# Branch Integration Plan

**Status**: IN PROGRESS
**Created**: 2025-12-19
**Integration Branch**: `main_temp`
**Target**: `main`

---

## Current State Summary

### Branch Relationships
```
main (production @ e34a2a0 - Jul 2025)
├── Has: CI/CD, MailGun fix, E2E tests, License
├── Missing: Activity feed, Orcha removal, Win25 features
│
main_temp (integration @ 74572af)
├── Contains: Everything in main + Activity feed + Admin UI + Waiver (partial)
├── Missing: Orcha removal, Win25 features
│
develop (diverged @ 0c49e5d - Jun 2024)
├── Contains: Orcha removal + emulator improvements
├── Missing: Activity feed, CI/CD work
│
origin/dfg/win25 (latest @ 4315a2f - Feb 2025)
└── Contains: Orcha removal + Win25 features + develop
    └── Missing: Activity feed, CI/CD work
```

---

## Timeline of Changes

| Date | Branch | Change | Orcha Status |
|------|--------|--------|--------------|
| 2023-02-08 to 2023-04-30 | 17413_spring23_main | Activity Feed (full feature) | Uses Orcha |
| 2023-07 to 2023-12 | develop | Docker, env improvements | Uses Orcha |
| **2024-05-27** | **develop** | **Orcha Removal (ae8da81)** | **Removed** |
| 2024-06-03 | develop | Win24 features | Post-Orcha |
| 2025-01 to 2025-02 | dfg/win25 | Win25 features | Post-Orcha |
| 2025-05 to 2025-07 | main | CI/CD, E2E, MailGun | Unrelated* |

*CI/CD work was done on main independently, doesn't interact with Orcha

---

## Key Finding: Activity Feed Needs Migration

The Activity Feed feature (100+ commits) was built using Orcha orchestrations. The Orcha removal commit (`ae8da81`) did NOT include the activity feed code.

**Migration Pattern** (from Orcha removal commit):
```typescript
// BEFORE (Orcha)
import { PoiOrchestration } from '@involvemint/client/shared/data-access';
constructor(private readonly pois: PoiOrchestration) {}

// AFTER (RestClient)
import { PoiRestClient } from '@involvemint/client/shared/data-access';
constructor(private readonly pois: PoiRestClient) {}
```

Activity feed files that need migration:
- `libs/client/shell/src/lib/activityfeed/**` (effects, actions, reducers)
- Any orchestration imports for ActivityPost, Comment, Like, Flag entities

---

## Integration Strategy

### Phase 1: Pre-Orcha Cleanup
**Goal**: Ensure main_temp has all work done BEFORE Orcha removal

Already in main_temp:
- [x] Activity feed (17413_spring23_main)
- [x] Admin UI enhancements
- [x] CI/CD from main

Missing from main_temp (pre-Orcha, from develop):
- [x] Docker port update (`a026599` - 2023-12-17) ✅ Committed: 92ff864
- [x] pgadmin auto-add db (`69b2b38` - 2023-12-10) ✅ Committed: c965785
- [x] Firebase emulator container (`e2a0cad` - 2024-01-16) ✅ Committed: 70e4fa4

**Action**: Cherry-pick or merge these changes from develop to main_temp

### Phase 2: Apply Orcha Removal
**Goal**: Remove Orcha framework

From develop:
- [x] Orcha removal (`ae8da81` - 2024-05-27) ✅ Committed: dae21a4

**Conflicts Resolved**:
- Activity feed state management preserved (effects, reducers, actions)
- Firebase emulator configs maintained
- Domain model imports updated to use repository pattern

### Phase 3: Post-Orcha Features
**Goal**: Add features built after Orcha removal

From develop/dfg/win25:
- [x] Win24 features (`f0fabfa` - 2024-06-03) ✅ Committed: ca15391
- [x] Photo aspect ratios (`0c49e5d` - 2024-06-06) ✅ Committed: eb9b259
- [x] Win25 features (2025-01 to 2025-02):
  - [x] Issue 376 fix ✅ Committed: 01cf447
  - [x] Auto-create ChangeMaker ✅ Committed: 08d8b34
  - [x] Email + validation ✅ Committed: ebf33cd
  - [x] "Invite business" rename ✅ Committed: 38d4757
  - [x] Prepopulate fixes ✅ Committed: 9429e47, 0111a10
  - [x] Red dot (full) ✅ Committed: d0acd0c, 2e7b41d

### Phase 4: Feature Branches
**Goal**: Integrate remaining standalone features

Outstanding:
- [ ] Waiver feature (`origin/feature-waiver`) - needs investigation
- [ ] Credit toggle (`origin/ft-toggle-credit`) - 1 commit
- [ ] Red dot completion (`origin/red-dot`) - if desired

---

## Detailed Commit Map

### Pre-Orcha (to cherry-pick to main_temp)
```
a026599 2023-12-17 Update Postgres Docker Container Host Port (#133)
69b2b38 2023-12-10 feat: Use local instead of org and auto add db to pgadmin (#132)
e2a0cad 2024-01-16 Feature/add firebase emulator container (#134)
```

### Orcha Removal
```
ae8da81 2024-05-27 Removes Orcha from all application code (#292)
```

### Post-Orcha (to cherry-pick after Orcha removal)
```
f0fabfa 2024-06-03 Win24 involvemint (#307)
0c49e5d 2024-06-06 Photo aspect ratios fix (#300)
e258f79 2025-01-26 Win25/issue 376 (#377)
7cfb328 2025-01-26 Make new users Changemakers (#378)
4520866 2025-02-02 Email + validation fix (#380)
d912087 2025-02-09 'Invite business' rename (#387)
3664219 2025-02-17 Prepopulate data fixes
d102854 2025-02-18 Prepopulate backend fix
6e72866 2025-02-20 Red dot (#407)
4315a2f 2025-02-25 Red dot locations
```

---

## Activity Feed Migration Checklist

When applying Orcha removal, these files need manual attention:

### Client Effects (use Orchestration → RestClient)
- [x] `activityfeed.effects.ts` - Uses ActivityPostRestClient ✅
- [x] Comment effects - Uses CommentRestClient ✅
- [x] Like effects - Handled via ActivityPost like/unlike endpoints ✅

### Actions (may reference Orcha types)
- [x] `activityfeed.actions.ts` - Already migrated ✅
- [x] Comment actions - Already migrated ✅

### New RestClient Needed
- [x] Create `activity-post.rest-client.ts` ✅
- [x] Create `comment.rest-client.ts` ✅
- [x] Like/Flag - Handled via ActivityPost and Comment endpoints (not needed separately) ✅

### Server Side (likely needs controllers)
- [x] Add REST controllers for activity post endpoints ✅ Created: `activity-post.controller.ts`
- [x] Add REST controllers for comment endpoints ✅ Created: `comment.controller.ts`
- [x] Verify domain services are compatible ✅ Services already exist and work

---

## Testing Plan

After each phase:
1. `npm run build:client` - Verify client compiles
2. `npm run build:server` - Verify server compiles
3. `npm run test` - Run unit tests
4. `docker compose up` - Start local environment
5. Manual smoke test of affected features

---

## Questions to Answer

1. **Waiver**: The commit `23dc430` says waiver was removed because it doesn't work. What's the status of the waiver feature?

2. **Red dot**: How complete is the red dot feature? Is it ready for integration?

3. **Database migrations**: Are there migration conflicts between branches?

4. **Testing**: What's the expected testing approach before merging to main?

---

## Next Steps

1. [ ] Confirm this integration strategy
2. [ ] Cherry-pick pre-Orcha commits to main_temp
3. [ ] Apply Orcha removal and migrate activity feed
4. [ ] Cherry-pick post-Orcha features
5. [ ] Test thoroughly
6. [ ] Merge main_temp → main
