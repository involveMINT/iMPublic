# Negative Balance (Mutual Credit) — Incident, Fix Design & Reconciliation

**Status:** In progress — production incident (SEV)
**Date opened:** 2026-06-04
**Affected feature:** Mutual credit / negative balances (#441, #445, #446)
**Affected commits:** `4cfafb4`, `c5fdcf2`, `9d564c8`

---

## 1. Root cause (summary)

involveMINT v1 does **not** store balances. It is a **coin / UTXO model**: money is a set of
individual `Credit` rows, each with an owner, an `amount`, and a POI (proof-of-impact). A wallet's
balance is `SUM(amount)` of the non-escrow coins it owns. Transfers physically reassign coin rows
from sender to receiver, **splitting** coins when amounts don't divide evenly and **merging** them by
POI. This machinery exists for one reason: to preserve POI provenance (every credit is backed by real
volunteer impact).

The mutual-credit feature tried to add negative balances by inventing a **synthetic negative `Credit`
row** (a "debt coin") — `transaction.service.ts:374-400`. This is the core mistake: it represents debt
as a *coin*, then feeds that coin back through transfer/split/merge logic that was built on the
hard assumption that **every coin is positive money the owner actually holds.**

This is a model mismatch. Mutual credit is inherently a **signed-balance ledger** (every trade debits
one account and credits another; the sum of all balances stays zero). UTXO systems (Bitcoin, etc.)
*cannot* represent negative balances at all. The two systems that involveMINT is fusing are opposites.

### Concrete defects observed

1. **Spurious debt even when funded.** The split branch (`transaction.service.ts:348-369`) never
   increments `amountTransferred`, so the shortfall block fires even after a successful split —
   fabricating a debt coin on top of a real transfer.
2. **Negative coins poison later transfers.** The transfer loop's test `credit.amount <= amountLeft`
   (`transaction.service.ts:335`) treats a `−1200` coin as "≤ 900," so a debt coin gets *transferred
   to the next payee*, dragging the debt onto an unrelated wallet.
3. **Spent coins not removed from sender** in some paths → value duplicated (exists in both wallets).

---

## 2. Corruption inventory (production, 2026-05-30)

All damage is dated **2026-05-30** (deploy day). POI-earned and pre-deploy coins are intact.

- **20 spurious negative `Credit` rows** across **~12 wallets**.
- **2 wallets currently net-negative:** `Jrw740` −$17.00 (reported), `bigpeople80099` (EP) −$9.00.
- **Net value created/destroyed (not conservative):**
  - `denisebigelow`: minted $65, spent all $65 (per ledger), should be **$0** — shows **$31** (phantom).
  - `wild-indigo-guild` (receiver): pre-deploy ≈$97 + received $105 ⇒ should be ≈$202 — shows **$179**
    (short ≈$23). Receivers were short-changed while senders kept extra.
  - `communitycultures` (pure receiver) holds a **−$12 debt coin** that belongs to a *sender*.
- **1 orphaned credit** (no owner) system-wide.

Worked reconciliations (representative):

| Wallet | Type | Legit in | Sent (ledger) | Correct | Actual | Delta |
|---|---|---|---|---|---|---|
| chrisg | cm | $11 mint | $9 | $2 | $2 | ✅ (mechanism wrong, net ok) |
| Marenlc | cm | $94.77 POI | $28 | $66.77 | $66.77 | ✅ |
| Coliveros | cm | $31 mint | $29 | $2 | $2 | ✅ |
| Acethetheorist | cm | $32.60 POI | $20 | $12.60 | $12.60 | ✅ |
| Samannesmith1 | cm | $459 mint | $21 | $438 | $438 | ✅ |
| **denisebigelow** | cm | $65 mint | $65 | **$0** | **$31** | ❌ +$31 |
| **Jrw740** | cm | see §3 (escrow) | $27 | TBD | −$17 | ❌ |
| **bigpeople80099** | ep | $0 | $9 | $0 or −$9¹ | −$9 | ⚠ policy |
| **communitycultures** | ep | $ received | $0 | +$12 vs now | — | ❌ stray debt |

¹ Whether an EP may go negative at all is a **policy decision** (see §6).

Diagnostic scripts (read-only): `scripts/diag.sql` (global + one wallet),
`scripts/diag-senders.sql` (all affected wallets).

---

## 3. Reconciliation

### 3.1 Prerequisite decision: do we have a pre-deploy DB snapshot?

This is the single biggest factor in how rigorous the repair can be. **Strongly preferred path:**
restore a backup — or run **point-in-time recovery (PITR)** — to a moment just before the 5/30 deploy
into a **separate, read-only scratch instance** (does *not* touch prod). From that snapshot:

```
B*(wallet) = balance_in_snapshot(wallet)
           + Σ(transfers received on/after deploy, per Transaction ledger)
           − Σ(transfers sent     on/after deploy, per Transaction ledger)
```

This is deterministic and sidesteps the one irreducible ambiguity in §3.2: transferred coins **retain
the original `dateMinted`**, so for a *receiver* you cannot always tell a pre-existing coin from one
received on 5/30 by date alone. The snapshot removes that ambiguity entirely.

- **If a snapshot is available:** use the replay formula above. Gold standard, no guessing.
- **If NOT:** reconstruct from current data using the rules in §3.2. Defensible for senders and for the
  net-correct wallets, but receiver targets require per-wallet human sign-off.

> Earliest observed corruption is **2026-05-30 02:32** (Quinn's own post-deploy test txns,
> `QuinnNTonic`/`MonVoyage`, −$0.99). A snapshot from **2026-05-29** is safely pre-deploy.

### 3.2 Re-derivation rules (if no backup)

The bug only ever created: (a) the 20 **negative** coins, and (b) **positive poi-null coins owned by a
transaction *receiver*** dated 2026-05-30. Therefore:

- **POI coins (`has_poi = true`)** → always legitimate, never touched.
- **Positive poi-null coins held by a wallet that was never a transaction receiver** → legitimate
  mints/grants (e.g. denise's $15/$50). The bug never mints positives for non-receivers.
- **Negative coins** → always spurious. Delete them; the debt they represent is recomputed (§4).
- **Receiver poi-null coins on 5/30** → may be legit received value *or* duplicated/short — must be
  reconciled against the ledger amount for that transaction.

**Correct balance** for each wallet:

```
B* = (legit positive coins it should still hold)
   + Σ(transfers received per Transaction ledger)
   − Σ(transfers sent     per Transaction ledger)
   − (escrow currently reserved for active vouchers)
```

with the **overdraft** portion (any amount sent beyond coins held at the time) represented as
**account debt** under the new model (§4), *not* as a coin.

### 3.3 Process (safe, staged — mirrors `scripts/preview-user-deletion.sql`)

1. **Report (read-only):** produce a per-wallet sheet — current coins, debt coins, escrow, ledger
   received/sent, computed `B*`, and the delta. (Extend `diag-senders.sql`.)
2. **Human sign-off** on the proposed `B*` per affected wallet (≈12 rows).
3. **Repair (single DB transaction):**
   - Delete the 20 spurious negative coins.
   - Burn/mint positive coins per wallet so `SUM(coins) − debt = B*`.
   - Set `creditDebt` on the wallets whose `B* < 0` (post-fix model).
   - Fix the 1 orphaned credit.
4. **Verify conservation:** assert `Σ(all coins) − Σ(all debt)` equals the expected total
   (POI-backed + admin mints) before committing. Roll back on mismatch.

> No destructive SQL is written until §3.1 is answered and the §3.3-step-1 report is reviewed.

---

## 4. Forward fix design — debt as an account property, not a coin

Principle: **coins stay positive-only** (their job is POI provenance); **negative is a plain number on
the account** (like every real mutual-credit system). The debt never enters the split/merge/transfer
machinery, so that code is untouched and can't be corrupted by it.

### 4.1 Schema

Add to `ChangeMaker`, `ExchangePartner`, `ServePartner` (matches the existing per-entity owner pattern):

```
creditDebt   integer  NOT NULL DEFAULT 0   -- cents owed, always >= 0
```

The `Transaction` ledger remains the historical source of truth for *how* debt was incurred/repaid;
`creditDebt` is a cached running figure. (Per repo standard, include audit columns if introducing a
dedicated table instead — a column is the simpler, YAGNI choice.)

### 4.2 Transaction path (`transaction.service.ts`)

```
spendable = SUM(non-escrow positive coins) − sender.creditDebt

guard:    spendable − amount  >=  −negativeLimit          // unchanged intent, correct math

transfer: move the sender's positive coins to the receiver  // EXISTING loop, positive-only — unchanged

if coins < amount:                                          // overdraft
    shortfall = amount − coinsAvailable
    move ALL sender coins to receiver                       // existing loop already does this
    mint poi-null +shortfall coin owned by RECEIVER         // receiver keeps real money
    sender.creditDebt += shortfall                          // <-- debt is a NUMBER, no negative coin
```

Delete the negative-coin creation block (`transaction.service.ts:374-400`) and the matching escrow
block in `credit.service.ts:175-206`. **Fix** the split-branch `amountTransferred` bug regardless.

### 4.3 Debt settlement on inflow

To keep the money supply honest (poi-null coins minted on overdraft must be burned when repaid):

```
on receiving coins (transfer-in or POI mint), if receiver.creditDebt > 0:
    settle = min(creditDebt, amountIn)
    creditDebt −= settle
    burn `settle` worth of positive coins (smallest-first)   // isolated helper; not the merge code
```

This is a small, self-contained helper — it does **not** touch the split/POI-merge logic.

### 4.4 Display / balance

- Wallet balance = `SUM(non-escrow coins) − creditDebt` (currently just `SUM(coins)` —
  `wallet.component.ts:99-103` and `credit.logic.ts:16`).
- `isNegative` / `isAtLimit` banners already exist; point them at the new computed balance.

### 4.5 Tests (must pass before re-enable)

Extend `transaction.service.spec.ts`:
- Funded transfer → no debt, exact coin deduction (regression for defect #1).
- Overdraft → receiver made whole, sender `creditDebt` set, **zero negative coins created**.
- Second transfer by a debtor → no debt coin transferred to payee (regression for defect #2).
- Repayment (receive while in debt) → debt reduced, coins burned, supply conserved.
- Conservation invariant: `Σcoins − Σdebt` constant across a transfer.

---

## 4b. Implementation status (branch `fix/mutual-credit-negative-balance`)

Done (server) — API type-checks clean, `server-core-application-services` tests pass (27/27):
- Schema: `creditDebt` on `ChangeMaker`/`ExchangePartner`/`ServePartner` (model + entity). Created via
  `synchronize:true` on deploy; safety-net `ADD COLUMN IF NOT EXISTS` in recon-3.
- `CreditService`: `getDebt` / `incurDebt` / `settleDebt` (burns coins smallest-first to repay).
- `transaction.service.ts`: spendable = credits − debt guard; **split-branch `amountTransferred` fixed**;
  positive-only transfer; overdraft → mint receiver + `incurDebt` (no negative coin); receiver debt settled.
- `credit.service.ts` escrow: same split fix + positive-only; overdraft → mint escrow + `incurDebt`.
- `poi.service.ts`: settle debt when POI credits are earned.
- `voucher.service.ts`: settle buyer debt on unredeemed-voucher refund.
- Tests: funded→no debt; overdraft→debt + receiver whole + zero negative coins; partial overdraft;
  receiver settle.

Reconciliation scripts — **total-based**, validated end-to-end on a scratch DB (clean/escrow/debt
cases + idempotency):
- `recon-1-snapshot-balances.sql` (snapshot) → per-wallet pre-deploy available **and escrow**.
- `recon-2-report.sql` (prod, read-only) → `correct_total = snapshot_total + post(received−sent)`,
  `correct_escrow = SUM(active vouchers)`, `correct_available = total − escrow`; shows deltas + flags.
- `recon-3-repair.sql` (prod, transactional, dry-run/ROLLBACK by default, verification-asserted) →
  per corrupted wallet: delete all coins, mint clean poi-null available + escrow coins, set debt.

**Escrow is handled automatically** (escrow rebuilt to the active-voucher total — escrow coins are
fungible, so nothing needs tying to specific vouchers). The only auto-skip is wallets that earned POI
after the cutoff (`post_poi_cents > 0`) or lack a snapshot row — those abort for manual review.

Done (client) — `libs/client/shell` + shared/domain type-check clean:
- `UserQuery` + `BaDownloadEpAdminsQuery` now fetch `creditDebt` for cm/ep/sp profiles.
- `wallet.component.ts` shows spendable = `coins − creditDebt` (both the credits and active-profile
  streams), so balance, send preview/guard, running totals, and the negative banners all reflect debt.

Remaining:
- Decide EP/SP-negative policy (currently allowed, matching deployed config).
- Wallets that earned POI after the cutoff (`post_poi_cents > 0`) still need manual review — the
  snapshot+ledger can't size a post-cutoff POI mint. Expected to be ~none among the affected set.
- Optional: surface the debt amount explicitly in the wallet UI (currently folded into balance).

## 5. Rollout sequence

1. **Stop the bleeding** (see Open Decisions §6) — prevent new corruption first.
2. **Land the fix** (§4) behind the existing config; ship with tests green.
3. **Answer §3.1** (backup?) and run the **reconciliation report** (read-only).
4. **Sign off** per-wallet, run the **repair** in one transaction with the conservation check.
5. **Re-enable** negative balances on the fixed code; spot-check the previously-affected wallets.

---

## 6. Open decisions

1. **Stop-the-bleeding mechanism:** revert #441 in prod (cleanest), set `negativeBalanceLimit = 0`
   (partial — split bug still misfires), or disable the transaction path (most conservative).
2. **Pre-deploy backup available?** Determines reconciliation rigor (§3.1).
3. **May ExchangePartners / ServePartners go negative at all,** or is mutual credit ChangeMaker-only?
   (`bigpeople80099` is an EP currently at −$9.) Affects the guard and `creditDebt` placement.

### Resolved

- **Model: A — mutual credit with tracked debt** (decided 2026-06-04). Debt is a number on the account
  (`creditDebt`), never a coin. Minting is reused only to make the *receiver* whole; the sender's
  shortfall is recorded as debt. (Model B / free auto-mint rejected — it inflates the supply and breaks
  POI backing.)
```
