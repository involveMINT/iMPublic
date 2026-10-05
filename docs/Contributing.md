## Branching Strategy

This document outlines the Git branching pattern used for the Involvemint project. Our goal is to keep **`main`** always in a deployable state, enable clear feature development in isolation, and streamline deployments to test and production environments.

---

### 1. Main Branch

- **Purpose**:  
  - Holds validated, deployable code at all times.
  - Serves as the source for production releases.

- **Production Deployment**:  
  1. When a new production release is ready, create a **tag** on `main` at the desired commit.  
  2. Pushing that tag triggers our CI/CD pipeline to deploy to the production environment.  
  3. Do **not** commit directly to `main` except via an approved PR (see “Pull Requests” below).

---

### 2. Branch Naming Convention

Developers work on isolated branches named according to the type of work and the corresponding GitHub issue ID. The general pattern is:

{TYPE}/<GITHUB_ISSUE_ID>[-optional-short-description]


- **`{TYPE}`** must be one of:
  - `feature` – for new functionality
  - `bugfix`  – for fixing a bug
  - `chore`   – for non-functional tasks, such as dependency updates or refactors
  - `hotfix`  – for urgent fixes against `main` (see section “Hotfixes”)
- **`<GITHUB_ISSUE_ID>`** is the numeric or alphanumeric ID of the GitHub issue (e.g., `123`, `ABC-456`).
- **Optional**: A short, hyphenated description (e.g., `feature/123-add-user-profile`).

**Example**:
```
feature/42
bugfix/101-fix-login-error
chore/210-update-dependencies
```
---

### 3. Creating and Working on a Branch

1. **Create a new branch** off of `main` as soon as you pick up an issue:
  ```
  git checkout main
  git pull origin main
  git checkout -b feature/123
  ```
2. **Implement changes** on your branch until all requirements of the GitHub issue are fully addressed.  
3. **Commit frequently**, keeping each commit focused. However, before opening a PR, ensure that:
- All acceptance criteria are met.
- The code builds and passes any relevant tests locally.
- The resulting merged code will be immediately deployable (i.e., no broken builds or failing tests).

---

### 4. Pull Requests (PRs)

1. **Open a PR** from your feature/bugfix/chore branch into `main` only when your work is _“ready to go”_:
- The issue’s requirements must be fully addressed.
- The branch must be in a state where merging to `main` keeps `main` deployable.

2. **Local verification (no PR CI)**:  
- The hosted test environment was retired in October 2026, and PRs no longer run a workflow.  
- Before opening a PR, run `npm run build`, `npm run test` and `npm run lint`, and validate the change against the issue’s acceptance criteria on the local stack (`docker compose up`, see the README).

3. **Database migrations**:  
- If you change an entity, generate the migration against your local Postgres and commit it in the PR:
  ```
  DB_PORT=5433 DB_USER=postgres DB_PASSWORD=postgres DB_NAME=involvemint \
    npx ts-node --project ./util/tsconfig.json ./node_modules/typeorm/cli.js migration:generate -n <Name> -f util/ormconfig.js
  ```
- The production deploy applies committed migrations and fails if the schema still drifts from the entities.

4. **PR Settings**:  
- **Squash and merge**: All commits in the PR will be squashed into a single commit when merging.  
- **Delete source branch**: After merge, the PR’s source branch will be automatically deleted.  

5. **Approval & Merge**:  
- After local validation, reviewers (including QA or a designated approver) approve the PR.  
- Merging to `main` should happen **only after** validation confirms that everything works as expected.

---

### 5. Working on a Shared Feature

Sometimes multiple developers collaborate on the same feature issue:

1. **Create a shared feature branch**:
```
git checkout main
git pull origin main
git checkout -b feature/123
```
2. **Individual sub-branches** (optional):  
- Developers can branch off `feature/123` for specific tasks:
  ```
  git checkout feature/123
  git checkout -b feature/123/backend-endpoint
  ```
- Once sub-task work is complete, merge into `feature/123` via PR or locally.
3. **Final PR**:  
- Only the **`feature/123`** branch (the shared feature branch) should be used to open the final PR into `main`, once the entire feature is deployable and meets all requirements.

---

### 6. Hotfixes

For urgent fixes that must go straight to production:

1. **Create a `hotfix` branch** from `main`:
```
git checkout main
git pull origin main
git checkout -b hotfix/789
```
2. **Implement and test** the fix locally, then open a PR against `main` following the same PR guidelines (squash, delete source).
3. **Validate locally** on the docker stack before merging.
4. **Merge and Tag**:
- Once approved, merge into `main`, then immediately create a tag (e.g., `v1.2.3-hotfix.1`) to trigger production deployment.
- If additional patch releases are needed, create subsequent hotfix branches from the updated `main`.

---

### 7. Post-Deployment

- After a PR is merged into `main`, the branch is deleted automatically.  
- Tags created on `main` will trigger production deployments; no additional work is needed beyond tagging and pushing.

---

### 8. Summary Checklist

- [ ] **Branch off `main`** with the correct naming convention (`feature/`, `bugfix/`, `chore/`, or `hotfix/`), including the GitHub issue ID.  
- [ ] **Complete all issue requirements** and verify locally before opening a PR.  
- [ ] **Build, test and lint locally**, and commit any new migration, before opening a PR into `main`.  
- [ ] **Squash and merge**, deleting the source branch automatically.  
- [ ] **Tag `main`** for production when ready (only from validated commits).  

By following this pattern, we ensure that:
1. `main` is always in a deployable state.  
2. Features and fixes are developed in isolation.  
3. Test deployments occur early, catching issues before they reach production.  
4. Release tagging is clear and repeatable.  

If you have any questions about this process, please reach out to the project lead before opening your PR. Happy coding!  

