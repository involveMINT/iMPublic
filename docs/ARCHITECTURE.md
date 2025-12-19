# involveMINT Architecture Documentation

> This document captures architectural understanding of the involveMINT codebase.
> Last updated: 2025-12-19

## Table of Contents

1. [Overview](#overview)
2. [Monorepo Structure](#monorepo-structure)
3. [User Roles & Domains](#user-roles--domains)
4. [Application Architecture](#application-architecture)
5. [Tech Stack](#tech-stack)
6. [Key Patterns](#key-patterns)
7. [Areas of Concern](#areas-of-concern)
8. [Open Questions](#open-questions)

---

## Overview

**involveMINT** is a community engagement platform that enables:
- Volunteers ("Change Makers") to earn credits for community service
- Organizations ("Service Partners") to manage volunteer opportunities
- Businesses ("Exchange Partners") to accept credits as payment
- Administrators to oversee the platform

It's a full-stack TypeScript application with:
- **Frontend**: Angular 12 + Ionic 5 (mobile-first PWA)
- **Backend**: NestJS 7 with TypeORM + PostgreSQL
- **Infrastructure**: Google Cloud App Engine + Firebase

---

## Monorepo Structure

This is an **Nx 12** monorepo with the following organization:

```
/
├── apps/                    # Deployable applications
│   ├── involvemint/         # Angular client (port 4202)
│   ├── api/                 # NestJS server (port 3335)
│   ├── migrate/             # Database migrations
│   └── *-e2e/               # E2E test suites
│
├── libs/                    # Shared libraries
│   ├── client/              # Frontend-specific code
│   ├── server/              # Backend-specific code
│   ├── shared/              # Cross-platform code
│   └── migration/           # DB migration scripts
│
├── tools/                   # Build utilities
└── docs/                    # Documentation
```

### Library Organization

The `libs/` directory follows a **scope-based organization**:

```
libs/
├── client/
│   ├── shell/               # Main app shell, guards, core features
│   ├── login/               # Authentication UI
│   ├── cm/                  # Change Maker role features
│   ├── sp/                  # Service Partner role features
│   ├── ep/                  # Exchange Partner role features
│   ├── admin/               # Admin console features
│   ├── ba/                  # Business Admin features
│   └── shared/              # Shared UI, utilities, state
│
├── server/
│   ├── core/
│   │   ├── domain-services/     # Entity repositories & DB access
│   │   └── application-services/ # Business logic & orchestration
│   └── orcha/               # API schema definitions
│
└── shared/
    ├── domain/              # Shared interfaces, models, DTOs
    └── util/                # Cross-platform utilities
```

---

## User Roles & Domains

### Role Abbreviations

| Abbrev | Full Name | Description |
|--------|-----------|-------------|
| **CM** | Change Maker | Volunteers who earn credits for community service |
| **SP** | Serve Partner | Organizations offering volunteer opportunities |
| **EP** | Exchange Partner | Businesses accepting credits as payment |
| **SA** | Serve Admin | Administrators for Service Partners |
| **EA** | Exchange Admin | Administrators for Exchange Partners |
| **BA** | Business Admin | Platform-level administrators |

### Role Relationships

```
User
├── ChangeMaker (1:1, optional)
├── ServeAdmins (1:many) ──> ServePartner
├── ExchangeAdmins (1:many) ──> ExchangePartner
├── SpApplications (1:many) - applying to become SP admin
└── EpApplications (1:many) - applying to become EP admin
```

A single user can have multiple roles simultaneously (e.g., be both a ChangeMaker and a ServeAdmin).

---

## Application Architecture

### Frontend (Angular + Ionic)

**Shell Pattern**: The app uses role-based shells for navigation:

```
ClientShellModule (main entry)
├── AuthShell (unauthenticated routes)
│   └── Login, SignUp, ForgotPassword, etc.
│
└── IMApp (authenticated routes)
    ├── Common features (wallet, market, chat, settings)
    └── Role-specific shells
        ├── CM Shell (passport, enrollments, POIs)
        ├── SP Shell (projects, enrollments, vouchers)
        ├── EP Shell (offers, vouchers)
        ├── Admin Shell (platform management)
        └── BA Shell (business admin)
```

**State Management**:
- NgRx for application state
- Orcha for type-safe API communication
- Firebase/Firestore for real-time features (chat)

### Backend (NestJS)

**Layered Architecture**:

```
API Layer (apps/api)
    ↓
Orcha Controllers (libs/server/orcha)
    ↓
Application Services (libs/server/core/application-services)
    ↓
Domain Services (libs/server/core/domain-services)
    ↓
TypeORM Entities → PostgreSQL
```

**Service Layers**:

1. **Domain Services**: Repository pattern over TypeORM entities
   - One module per entity type
   - Handles CRUD operations
   - Database table definitions

2. **Application Services**: Business logic orchestration
   - Combines multiple domain services
   - Handles complex workflows
   - Integrates external services (email, SMS, storage)

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 12.0.3 | UI framework |
| Ionic | 5.6.9 | Mobile-first UI components |
| NgRx | 12.x | State management |
| RxJS | 6.6.7 | Reactive programming |
| Orcha | 0.2.16 | Type-safe API client |
| Firebase SDK | 8.6.5 | Auth, Firestore, Storage |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 7.6.17 | Server framework |
| TypeORM | 0.2.37 | Database ORM |
| PostgreSQL | 14 | Primary database |
| Firebase Admin | 9.9.0 | Server-side Firebase |
| Socket.io | 4.1.2 | Real-time WebSockets |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Nx | Monorepo management |
| Google Cloud App Engine | Backend hosting |
| Firebase Hosting | Frontend hosting |
| Docker | Local development |

---

## Key Patterns

### 1. API Communication (Orcha → RestClient Migration)

**Historical Context**: The codebase originally used Orcha for type-safe API communication. A migration to standard REST clients was initiated in May 2024 (`ae8da81`).

**Legacy Pattern (Orcha)**:
```typescript
// Shared schema (libs/shared/domain)
interface UserOrchestration {
  getProfile: { dto: void; return: UserProfile };
  updateProfile: { dto: UpdateProfileDto; return: UserProfile };
}

// Server implementation (libs/server/orcha)
@Orchestration(USER_ORCHESTRATION)
class UserOrcha {
  @Operation()
  getProfile() { ... }
}

// Client usage
this.orcha.user.getProfile().subscribe(profile => ...);
```

**New Pattern (RestClient)**:
```typescript
// Client (libs/client/shared/data-access/src/lib/rest-clients/)
@Injectable()
export class UserRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.user}`;

  constructor(private http: HttpClient) {}

  getProfile(query: IQuery<User>) {
    return this.http.post<IParser<User, typeof UserQuery>>(
      `${this.apiUrl}/getProfile`,
      { [QUERY_KEY]: query }
    );
  }
}

// Usage in effects
constructor(private readonly users: UserRestClient) {}
```

**Migration Status**:
- Core features: Migrated in `develop` branch
- Activity Feed: Still uses Orcha, needs migration
- See `docs/tracking/in-progress/branch-integration-plan.md` for details

### 2. Shell-Based Navigation

Each user role has a dedicated shell module that manages:
- Route configuration
- Navigation UI
- Role-specific guards
- Feature lazy-loading

### 3. Feature Modules with Data Access

Each feature follows this structure:
```
feature/
├── shell/           # UI components, pages
├── data-access/     # NgRx state, selectors, effects
└── api/             # HTTP service layer (optional)
```

---

## Areas of Concern

> These are areas that may need attention or refactoring

### Active: Orcha Migration
The codebase is in the process of migrating from Orcha to standard REST clients:
- **Completed**: Core features (CM, SP, EP, Admin) in `develop` branch
- **Pending**: Activity Feed feature (still uses Orcha orchestrations)
- **Impact**: Cannot merge Activity Feed until it's migrated to RestClient pattern

### Technical Debt

- [ ] Angular 12 is quite outdated (current stable is 17+)
- [ ] NestJS 7 is outdated (current stable is 10+)
- [ ] TypeORM 0.2 vs 0.3 migration considerations
- [ ] Multiple environment files may contain secrets in git

---

## Open Questions

> Questions clarified or pending

### Clarified
- **Deployment**: `main` is production, `main_temp` is the integration staging branch
- **Orcha**: Being migrated to standard REST clients (decision already made)

### Still Open
1. **Firebase vs PostgreSQL**: What determines which data goes to Firestore vs PostgreSQL?

2. **Testing**: What's the current test coverage strategy? E2E apps exist but are they maintained?

3. **Mobile**: Is this deployed as a PWA only, or are there native app wrappers (Capacitor)?

4. **Waiver Feature**: Current status? (Was partially added then reverted in main_temp)

5. **Database Migrations**: How are migrations handled across branches with different schemas?

---

## Appendix

### Path Aliases (tsconfig.base.json)

Key import paths configured:
```
@involvemint/client/*     → libs/client/*/src/index.ts
@involvemint/server/*     → libs/server/*/src/index.ts
@involvemint/shared/*     → libs/shared/*/src/index.ts
```

### Local Development

```bash
# Start infrastructure
docker compose up

# Set environment variables
export FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
export FIRESTORE_EMULATOR_HOST='localhost:8080'

# Start apps
npm run start:client:local  # Port 4202
npm run start:server:local  # Port 3335
```
