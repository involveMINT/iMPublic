# Wallet Correction — Summary for Review

**Prepared for:** Dan
**Date:** 2026-06-05
**Purpose:** Show that the proposed wallet corrections are accurate, before we apply them.

---

## What happened

A change released on **May 30** (the "mutual credit" / negative-balance feature) had a flaw in how
it recorded payments. Instead of simply deducting a payment from a member's balance, it sometimes
**charged people twice**, **duplicated credits** for businesses receiving payments, and recorded
debts incorrectly. The result: some wallets showed the wrong balance — a few even went negative when
they shouldn't have (this is what members reported).

**14 wallets** were affected, all from activity on May 30. Everything before that date is unaffected.

## How we know the correct balance for each wallet

We did not guess. Each corrected balance is rebuilt from three trustworthy sources:

1. **A backup of the system from just before the problem started** (verified to contain zero of the
   bad records) — this gives each wallet's exact balance *before* the issue.
2. **The actual payment history.** Every payment's amount was recorded correctly; only the
   balance bookkeeping was wrong. So we replay each real payment on top of the pre-issue balance.
3. **Legitimate credits issued by an admin during that period are preserved** (we confirmed these
   are real grants and kept them).

**Independent confirmation.** Two members told us their balances directly, and our reconstruction
matches them exactly:
- *Marenlc* texted "**Was 122.77**" — our pre-issue record shows **122.77**.
- *Jrw740* texted "**I had 80 credits**" — our pre-issue record shows **80.00**.

These outside confirmations give us high confidence the method is correct.

## The corrections (current → corrected)

All figures are in credits.

| Member / Business | Showing now | Corrected to | Why |
|---|--:|--:|---|
| **Marenlc** | 66.77 | **94.77** | Had 122.77, spent 28.00. Was charged twice → restored. (Matches her text.) |
| **Jrw740** | −17.00 | **53.00** | Had 80.00, spent 27.00. (41.00 available + 12.00 held for pending vouchers.) (Matches her text.) |
| **denisebigelow** | 31.00 | **65.00** | Had 80.00 + 50.00 admin grant − 65.00 spent. Was overcharged → restored. |
| **flycorey** | 26.54 | **63.30** | Had 43.26 + 60.04 admin grants − 40.00 spent. Was overcharged → restored. |
| **Acethetheorist** | 12.60 | **32.60** | Had 52.60 − 20.00 spent. Was overcharged → restored. |
| **MonVoyage** | 1,598.05 | **1,718.05** | Had 1,716.60 + 1.00 received + 10.45 recent credit − 10.00 spent. Was undercharged → restored. |
| **chrisg** | 2.00 | **2.00** | 11.00 admin grant − 9.00 spent. Balance was right; internal records cleaned up. |
| **Coliveros** | 2.00 | **2.00** | 31.00 admin grant − 29.00 spent. Balance was right; internal records cleaned up. |
| **Samannesmith1** | 438.00 | **438.00** | 459.00 admin grant − 21.00 spent. Balance was right; internal records cleaned up. |
| **bigpeople80099** (business) | −9.00 | **−9.00** | Legitimately spent 9.00 it didn't have. Recorded properly as 9.00 owed. |
| **wild-indigo-guild** (business) | 179.00 | **113.00** | 105.00 in sales received + 8.00 admin grant. Duplicated credits removed. |
| **GarfieldFarm** (business) | 223.76 | **187.00** | 67.00 prior + 80.00 admin grants + 40.00 sale. Duplicated credits removed. |
| **communitycultures** (business) | 215.00 | **163.00** | 112.00 in sales + 51.00 admin grants. Duplicated credits removed. |
| **QuinnNTonic** (test account) | 1.00 | **0.01** | Internal test account; minor cleanup. |

**Three kinds of correction:**
- **Restored (members were overcharged):** Marenlc, Jrw740, denisebigelow, flycorey, Acethetheorist, MonVoyage.
- **Reduced (duplicated credits removed):** wild-indigo-guild, GarfieldFarm, communitycultures, QuinnNTonic.
- **No change in balance (internal records cleaned up):** chrisg, Coliveros, Samannesmith1, bigpeople80099.

## Safeguards before we apply this

- The correction has been **tested in a trial run** that makes no permanent change — it confirmed all
  14 wallets land on the balances above and that no wallet is left negative-by-error.
- We will **apply it only after this review and after the software fix is live**, so the problem can't
  recur in between.
- Nothing about members' prior history (before May 30) is touched.

---

*Engineering detail (for the technical reviewer) lives in `negative-balance-reconciliation-proof.md`.*
