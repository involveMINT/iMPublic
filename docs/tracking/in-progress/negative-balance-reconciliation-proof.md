# Mutual-Credit Reconciliation — Proof of Correct Targets

**Status:** In progress — evidence for the per-wallet repair targets
**Date:** 2026-06-05
**Companion:** [[negative-balance-incident-fix]]

This documents *why* each affected wallet's reconciled balance is correct, with the evidence.

---

## 1. Sources of truth

| Source | What it proves | How obtained |
|---|---|---|
| **Pre-deploy snapshot** | Each wallet's exact balance before the bug | PITR clone of prod to `2026-05-30T00:00:00Z`, verified `COUNT(*) WHERE amount<0 = 0` (clean). Dumped to `~/involvemint-snapshot-pre-deploy-20260530.sql.gz`. |
| **Transaction ledger** | Correct transfer amounts (the `amount` column was never corrupted — only the coin side-effects were) | prod `"Transaction"` |
| **Voucher table** | Which vouchers are still active (→ correct escrow) | prod `"Voucher"` (untouched by the credit bug) |
| **Coin timestamps** | Mint vs. transaction-receipt: a coin minted within ~1s of a received transaction is that transaction's shortfall coin; a coin with no nearby transaction is an admin/POI mint | prod `"Credit".dateMinted` vs `"Transaction".dateTransacted` |

**Cutoff = `2026-05-30 00:00:00`.** The clone's latest transaction is `2026-05-24 17:18`; the first corruption is `2026-05-30 02:32`. So everything `>= cutoff` is post-deploy and gets replayed; nothing legitimate falls in the gap.

## 2. The formula

```
correct_total     = snapshot_total - post_sent + post_received + admin_mints
correct_escrow    = SUM(active vouchers)
correct_available = correct_total - correct_escrow
creditDebt        = max(0, -correct_available)
```
- `post_received` / `post_sent` come from the **ledger** (correct amounts), so bug-inflated receipt coins don't matter.
- `admin_mints` = post-cutoff positive coins with **no received transaction within 2s** (proven legit per
  your confirmation that admin mints are correct). This per-coin timestamp test is the method
  implemented in `recon-3-repair.sql`; it supersedes the earlier `max()` heuristic, which undercounted
  mints that were masked by short-changing on a receipt (caught wild-indigo's $8).

Independent cross-check: the two wallets whose owners texted their balances match exactly —
**Marenlc** snapshot `12277` = "Was 122.77"; **Jrw740** snapshot `8000` = "I had 80 credits."

**Repair mechanism — rebuild, not "delete the negative coins."** The repair *discards each
corrupted wallet's entire coin set* and re-mints to the proven `correct_available` (one positive
coin) + `correct_escrow` + `creditDebt`. This is why it's safe regardless of *how* the bug mangled
a wallet:
- Some wallets the bug only **mis-represented** (net already correct) — e.g. chrisg holds `+$11`
  intact *and* a `−$9` debt coin = net `$2`. Deleting just the `−$9` would wrongly leave `$11`;
  rebuilding to net leaves a clean `+$2`. Dollar value unchanged, representation fixed.
- Some wallets the bug **double-charged** — e.g. Marenlc's positive was reduced `122.77→94.77`
  *and* she got `−$28` debt coins (net `66.77`). Rebuild restores the correct `$94.77`.

Buckets: **cleanup only ($ unchanged)** = chrisg, Coliveros, Samannesmith1, bigpeople80099.
**Real value correction** = the other 10.

## 2b. Worked example — how the negative coins were created (Marenlc)

The clearest illustration of the root cause, with coin-level proof.

**Pre-deploy, Marenlc had exactly one credit** (from the snapshot dump):

```
id      bab58211-de14-49c8-bb3f-f1e5632e931b
amount  12277  ($122.77)   POI-backed (poiId ff9a8136…), minted 2024-09-22
```

A single $122.77 POI coin — far more than enough for her two purchases. Yet she ended with
`+9477, −1600, −1200` (net $66.77). She was **charged twice**. Here's why, per transaction
(`transaction.service.ts`):

**Tx 1 — pays $16 to wild-indigo:**
1. The loop hits her $122.77 coin. `12277 > 1600`, so it takes the **split** branch: gives the
   receiver $16 and reduces her coin `12277 → 10677`. (Correct so far.)
2. **The bug:** the split branch never executed `amountTransferred += amountLeft`, so the counter
   stayed `0`.
3. After the loop, `amountTransferred (0) < amount (1600)`, so the code believes she transferred
   *nothing* and runs the **overdraft path**, minting a spurious **−1600 debt coin** for her.

**Tx 2 — pays $12:** same again — coin `10677 → 9477`, plus a spurious **−1200** debt coin.

**Proof it's the same coin:** credit `bab58211` exists in prod today at **9477** — reduced by exactly
`2800` (= $16 + $12). So the split *did* deduct correctly; the negatives are pure duplication from
the overdraft path firing on a fully-funded payment.

**Root cause:** one missing line — `amountTransferred += amountLeft` in the credit-split branch.
Because the counter never advanced, the "insufficient funds → go into debt" path fired on **every**
payment, even when the sender was flush. Fixed in commit `578ec33`. (Reconciliation restores her to
`9477`.)

## 3. Per-wallet proof

### Group A — exact from snapshot+ledger (no post-cutoff receipts; formula unambiguous)

| handle | snapshot | sent | mints | correct | now | evidence |
|---|--:|--:|--:|--:|--:|---|
| Marenlc | 12277 | 2800 | 0 | **9477** | 6677 | 122.77 − 28 = 94.77; remove 2 spurious neg coins |
| Jrw740 | 8000 | 2700 | 0 | **5300** (4100 avail + 1200 voucher escrow) | −1700 | 80 − 27 = 53; escrow = 1 active voucher ($12) |
| denisebigelow | 8000 | 6500 | 5000 | **6500** | 3100 | $50 admin mint @15:58 (no tx, received=0) kept |
| flycorey | 4326 | 4000 | 6004 | **6330** | 2654 | $60.04 admin mints @20:09/22:17 (received=0) kept |
| Samannesmith1 | 0 | 2100 | 45900 | **43800** | 43800 | $459 admin mint @22:25 kept; remove neg coin |
| Acethetheorist | 5260 | 2000 | 0 | **3260** | 1260 | remove 2 spurious neg coins |
| chrisg | 0 | 900 | 1100 | **200** | 200 | $11 mint @23:12 − $9 spent; net already $2, rebuild to one +$2 coin |
| Coliveros | 0 | 2900 | 3100 | **200** | 200 | $31 mint @22:18 − $29 spent; net already $2, rebuild to one +$2 coin |
| bigpeople80099 (EP) | 0 | 900 | 0 | **−900** (debt) | −900 | legitimate EP overdraw → $9 debt |

### Group B — receivers; verified by coin↔transaction timestamp matching

| handle | snapshot | received (ledger) | admin_mints (proven) | correct | now | evidence |
|---|--:|--:|--:|--:|--:|---|
| wild-indigo-guild (EP) | 0 | 10500 | 800 | **11300** | 17900 | $8 admin mint @22:18:58 (same batch as Coliveros/communitycultures, no tx); rest are receipts. The `max()` heuristic missed this because short-changing on the $56 receipt masked it; timestamp matching catches it. |
| GarfieldFarm (EP) | 6700 | 4000 | 8000 | **18700** | 22376 | 2×$40 mints @15:57:51 & 15:57:56 (no tx); $36.76 @21:38:43.53 = shortfall of $40 receipt @21:38:43.559 |
| MonVoyage | 171660 | 100 | 1045 | **171805** | ~170806 | $0.99 @02:32 = shortfall of $1 receipt; $10.45 dated **Jun 1** = legit recent credit |
| QuinnNTonic | 1 | 100 | 0 | **1** | 100 | test account; $0.99 coin = shortfall of $1 receipt; sent 100 |

### Group C — confirmed admin mints (2026-06-05)

> **Confirmed by owner:** the unmatched coins below are admin mints → communitycultures correct = **$163.00**.

**communitycultures (EP)** — snapshot 0, ledger received **11200**, sent 0.
- Receipt coins match transactions, **except** a bug-inflated one: a `$21.00` coin @`22:31:20.969` for a `$9.00` transaction @`22:31:20.997` (negative-coin-poisoning bug). Using the **ledger** amount ($9) for that receipt avoids the inflation.
- Three coins have **no matching transaction**: `$21@22:18:58`, `$21@22:25:05`, `$9@23:12:39` (= **$51 total**). Each coincides to the millisecond-window with **confirmed admin mints to other wallets** (Coliveros `$31`@22:18:58, Samann `$459`@22:25:05, chrisg `$11`@23:12:39), so they are almost certainly admin mints to communitycultures during the same minting batches.
- **If those $51 are admin mints:** correct = `0 + 11200 + 5100 = `**`16300`** ($163.00). Current 21500.
- **Confirmation needed:** were admin mints issued to communitycultures on 5/30? (We don't need to know *why* — just whether to keep the $51.)

## 4. System conservation (to assert before COMMIT)

After repair, `Σ(all credits) − Σ(all creditDebt)` must equal the pre-deploy system total + all post-cutoff legit mints (POI + admin) − nothing (transfers net to zero). The repair script asserts each wallet's `coins − debt = correct_available` and `escrow = active vouchers`; the global identity is the final gate.

## 5. Final targets (all 14 confirmed)

| handle | correct_available | correct_escrow | creditDebt |
|---|--:|--:|--:|
| Marenlc | 9477 | 0 | 0 |
| Jrw740 | 4100 | 1200 | 0 |
| denisebigelow | 6500 | 0 | 0 |
| flycorey | 6330 | 0 | 0 |
| Samannesmith1 | 43800 | 0 | 0 |
| Acethetheorist | 3260 | 0 | 0 |
| chrisg | 200 | 0 | 0 |
| Coliveros | 200 | 0 | 0 |
| bigpeople80099 | 0 | 0 | 900 |
| wild-indigo-guild | 11300 | 0 | 0 |
| GarfieldFarm | 18700 | 0 | 0 |
| communitycultures | 16300 | 0 | 0 |
| MonVoyage | 171805 | 0 | 0 |
| QuinnNTonic | 1 | 0 | 0 |

## 6. Status / open items
- ✅ `recon-3-repair.sql` updated to timestamp-based mint detection.
- ✅ Dry-run against prod passed (2026-06-05): 14 wallets reconcile to the §5 targets, verification
  assertion passed, **0 negative credit rows remain**, transaction rolled back (nothing persisted).
  `DELETE 133 → INSERT 13 available + 1 escrow → UPDATE 14 debt`.
- ⬜ Align `recon-2-report.sql` to the same timestamp method (currently `max()` heuristic; report-only).
- ⬜ Re-run dry-run on the day of the fix (in case of new transactions), then switch ROLLBACK → COMMIT.
- ⬜ Drop the temporary `recon_snapshot` table from prod after the repair commits.
