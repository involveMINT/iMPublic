# Negative Balance Feature Implementation

**Status:** IN PROGRESS - Awaiting Plan Approval
**Priority:** High
**Created:** 2026-01-05

## Problem Description

The current system requires users to have sufficient positive credit balance before completing transactions. This prevents the mutual credit model where users can temporarily operate "in the red" like a credit card.

## Solution Approach

Allow wallet balances to go negative up to a configurable limit per entity type. Instead of blocking when `balance < amount`, allow transactions as long as `balance - amount >= -negativeLimit`.

## Configuration

**Location:** `libs/shared/domain/src/lib/config/im-config.ts`

```typescript
negativeBalanceLimit: {
  changeMaker: 100000,      // -1000.00 credits (100000 cents)
  servePartner: 100000,     // -1000.00 credits
  exchangePartner: 100000,  // -1000.00 credits
}
```

## Implementation Steps

### Phase 1: Backend Changes

#### Step 1.1: Add Configuration
**File:** `libs/shared/domain/src/lib/config/im-config.ts`
- Add `negativeBalanceLimit` object with per-entity-type limits
- All default to 100000 (1000 credits in cents)

#### Step 1.2: Create Helper Utility
**File:** `libs/shared/domain/src/lib/domain/credit/credit.logic.ts`
- Add `getNegativeBalanceLimit(entityType: 'changeMaker' | 'servePartner' | 'exchangePartner')` function
- Returns the appropriate limit from ImConfig

#### Step 1.3: Update Transaction Validation
**File:** `libs/server/core/application-services/src/lib/transaction/transaction.service.ts`
- **Line 271:** Change balance check from `sendersTotalAmount < dto.amount` to allow negative up to limit
- Need to determine sender's entity type to get correct limit
- Update error message to mention negative limit

#### Step 1.4: Update Escrow Transfer Validation
**File:** `libs/server/core/application-services/src/lib/credit/credit.service.ts`
- **Lines 111-116:** Update `escrowTransfer()` to allow negative balance up to limit
- Need to determine entity type from profileId

### Phase 2: Frontend Changes

#### Step 2.1: Expose Limit to Frontend
**File:** `libs/shared/domain/src/lib/config/im-config.ts`
- Config is already shared between client/server, so limits are accessible

#### Step 2.2: Update Wallet Component State
**File:** `libs/client/shell/src/lib/wallet/wallet.component.ts`
- Add `negativeLimit` to component state based on active profile type
- Add `isNegative` and `isAtLimit` computed states for warnings

#### Step 2.3: Update Send Button Validation
**File:** `libs/client/shell/src/lib/wallet/wallet.component.html`
- **Line 219:** Change disabled condition from `state.balance - amount.value >= 0` to `state.balance - amount.value >= -state.negativeLimit`

#### Step 2.4: Add Warning Banners
**File:** `libs/client/shell/src/lib/wallet/wallet.component.html`
- Add warning banner when `balance < 0`: "Your balance is negative: -X / -Y limit"
- Add error banner when `balance <= -limit`: "You have reached your negative balance limit"

#### Step 2.5: Update Amount Editor (if needed)
**File:** `libs/client/shared/ui/src/lib/im-amount-editor/im-amount-editor.component.ts`
- Review `overspendOrZero` logic to account for negative limit

### Phase 3: Bug Fix (Last)

#### Step 3.1: Fix Negative Voucher Quantity Bug
**File:** `libs/client/shell/src/lib/market/ep-cover/ep-cover.component.ts`
- Add validation to prevent quantity from going below 1
- **Line 127:** Add check `if (evt.quantity < 1) return;` or similar

**File:** `libs/client/shell/src/lib/market/ep-cover/ep-cover.component.html`
- **Lines 106-111:** Disable subtract button when quantity is 1

## Files Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `libs/shared/domain/src/lib/config/im-config.ts` | Add | negativeBalanceLimit config |
| `libs/shared/domain/src/lib/domain/credit/credit.logic.ts` | Add | getNegativeBalanceLimit helper |
| `libs/server/core/application-services/src/lib/transaction/transaction.service.ts` | Modify | Balance validation logic |
| `libs/server/core/application-services/src/lib/credit/credit.service.ts` | Modify | Escrow transfer validation |
| `libs/client/shell/src/lib/wallet/wallet.component.ts` | Modify | Add limit state and warning logic |
| `libs/client/shell/src/lib/wallet/wallet.component.html` | Modify | Update validation, add banners |
| `libs/client/shared/ui/src/lib/im-amount-editor/im-amount-editor.component.ts` | Modify | Update overspend logic |
| `libs/client/shell/src/lib/market/ep-cover/ep-cover.component.ts` | Fix | Negative quantity bug |
| `libs/client/shell/src/lib/market/ep-cover/ep-cover.component.html` | Fix | Negative quantity bug |

## Testing Approach

1. **Unit Tests:** Update `transaction.service.spec.ts` to test negative balance scenarios
2. **Manual Testing:**
   - Verify transaction succeeds when balance goes negative within limit
   - Verify transaction fails when would exceed negative limit
   - Verify warning banners display correctly
   - Verify voucher purchase respects negative limit
   - Verify negative quantity bug is fixed

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing transactions | Validation is relaxed, not tightened - existing valid transactions remain valid |
| Display issues with negative numbers | Currency pipe should handle negatives; verify in testing |
| Escrow + negative balance edge cases | Test voucher purchase when already negative |

## Progress

- [x] Explore backend validation logic
- [x] Explore frontend validation logic
- [x] Investigate negative voucher bug
- [x] Review configuration patterns
- [x] Create implementation plan
- [x] Plan approved
- [x] Phase 1: Backend changes
  - [x] Add negativeBalanceLimit config to im-config.ts
  - [x] Add getNegativeBalanceLimit helper to credit.logic.ts
  - [x] Update transaction.service.ts balance validation
  - [x] Update credit.service.ts escrow validation
  - [x] Update voucher.service.ts to pass entity type
- [x] Phase 2: Frontend changes
  - [x] Update wallet.component.ts with limit state and warnings
  - [x] Update wallet.component.html validation and banners
  - [x] Update im-amount-editor.component.ts overspend logic
- [x] Phase 3: Bug fix
  - [x] Fix negative voucher quantity bug in ep-cover component
- [ ] Testing (awaiting npm install / build verification)
- [ ] User approval for commit
