# Carpooling MVP — Incremental Build Design

## Approach

Full vertical slices: each milestone delivers backend + mobile end-to-end, testable on a real device. Dev-mode shortcuts (OTP bypass, text-only location inputs) keep early milestones lean.

---

## Milestone Map

| # | Milestone | Testable outcome |
|---|-----------|-----------------|
| M1 | Foundation (shared types, Prisma, API config) | `GET /api/v1/health` returns 200 with DB status |
| M2 | Auth (OTP login) | Phone input → dev OTP bypass → JWT → home screen |
| M3 | User profile | View/edit name, avatar, bio, city; changes persist |
| M4 | Driver profile + vehicle | Register as driver, add car, see on profile |
| M5 | Post a ride | Fill form (text inputs for locations) → ride in DB |
| M6 | Search rides | Search by text/date → list of matching rides |
| M7 | Book a ride | Tap ride → book seats → driver sees pending booking |
| M8 | Booking management | Driver confirms/rejects → passenger sees status change |
| M9 | In-app chat | Real-time messaging after booking confirmed (Socket.io) |
| M10 | Ride status + reviews | Start/complete ride → bilateral reviews |
| M11 | Notifications + safety | Push notifications + report/block user |
| M12 | Localization + polish | fr/en/ar strings, RTL, error states |

---

## M1 Spec: Foundation

### Goal
API connects to Supabase via Prisma, shared types exist, health endpoint confirms DB connectivity.

### Module placement convention

Infrastructure modules (`prisma/`, `config/`) live at `src/` root level. Feature modules (`auth/`, `rides/`, `bookings/`, etc.) live under `src/modules/`. This separates cross-cutting concerns from business logic.

### 1. packages/shared

**Build/link strategy:** The shared package uses TypeScript project references. The API's `tsconfig.json` adds a path alias (`@carpooling/shared` → `../../packages/shared/src`) so it can import directly from source without a build step. The mobile app does the same via its `tsconfig.json`.

**Files:**
- `src/types/user.ts` — User, DriverProfile, Vehicle types (mirroring Prisma models)
- `src/types/ride.ts` — Ride, RideStop + RideStatus enum (`draft`, `published`, `full`, `in_progress`, `completed`, `cancelled`)
- `src/types/booking.ts` — Booking + BookingStatus enum (`pending`, `confirmed`, `rejected`, `cancelled`, `completed`)
- `src/types/review.ts` — Review type
- `src/types/chat.ts` — Conversation, Message + MessageType enum (`text`, `system`)
- `src/types/notification.ts` — Notification + NotificationType enum (all 11 values from Prisma schema) + NotificationEntityType enum
- `src/types/report.ts` — Report, UserBlock types + ReportTargetType, ReportReason, ReportStatus, BlockReason enums
- `src/types/common.ts` — ApiResponse<T>, PaginatedResponse<T>, GeoPoint (`{ lat: number; lng: number }`), shared enums: Gender, Role, ChatPreference, PaymentMethod, PaymentStatus
- `src/index.ts` — Re-exports all types

**Principles:**
- Types are plain TypeScript interfaces, not coupled to Prisma
- PostGIS geography fields are represented as `GeoPoint` (`{ lat: number; lng: number }`) at the shared type level
- Zod schemas are added per milestone (auth schemas in M2, ride schemas in M5, etc.)

### 2. apps/api — Prisma Module

**Files:**
- `src/prisma/prisma.service.ts` — Extends PrismaClient, implements OnModuleInit and OnModuleDestroy. Calls `$connect()` on init, `$disconnect()` on destroy. Logs connection status.
- `src/prisma/prisma.module.ts` — `@Global()` module that provides and exports PrismaService.

**Note:** The Prisma schema (`prisma/schema.prisma`) already exists with all 14 models and the datasource/generator blocks. `prisma generate` must be run to produce the client before the API can start.

**Behavior:**
- Registered as a global module so every feature module can inject PrismaService via constructor injection without importing PrismaModule at the module level.
- Logs connection status on startup.

### 3. apps/api — Config validation

**Files:**
- `src/config/env.validation.ts` — class-validator DTO (`EnvironmentVariables`) with decorators. Exported `validate` function that instantiates the DTO, runs `plainToInstance` + `validateSync`, and throws on errors.

**Pattern:** NestJS `ConfigModule.forRoot({ validate })` accepts a custom `validate` function. We use class-validator (already a project dependency) rather than adding Joi.

**Env vars validated at startup (fail-fast):**
- `DATABASE_URL` (required)
- `DIRECT_URL` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRATION` (default: `"7d"`)
- `PORT` (default: `3000`)

**ConfigModule.forRoot() is called directly in AppModule** — no wrapper module needed.

### 4. apps/api — main.ts updates

- Enable CORS (permissive for dev)
- Register global ValidationPipe (class-validator, whitelist: true, transform: true)
- Set global prefix: `api/v1`
- Listen on `process.env.PORT ?? 3000`

### 5. apps/api — Health Module

**Files:**
- `src/modules/health/health.controller.ts` — `GET /health` (after prefix: `/api/v1/health`). Injects PrismaService via constructor. Queries `SELECT 1` via `prisma.$queryRaw` to confirm DB connectivity. Returns `{ status: "ok", timestamp, database: "connected" }` or `{ status: "error", timestamp, database: "disconnected" }`.
- `src/modules/health/health.module.ts` — Declares HealthController. Does not import PrismaModule (it's global).

### 6. apps/api — AppModule updates

- Import `ConfigModule.forRoot({ isGlobal: true, validate })`, PrismaModule (global), HealthModule.
- Remove default AppController and AppService (replaced by HealthModule).

### 7. .env.example update

```
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Auth
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=7d

# Server
PORT=3000
```

### Testing

- Run `pnpm api` — server starts without errors, logs DB connection
- `curl localhost:3000/api/v1/health` → `{ "status": "ok", "timestamp": "...", "database": "connected" }`
- Remove DATABASE_URL from .env → server refuses to start (fail-fast validation)

### Files touched

```
packages/shared/
  src/types/user.ts          (new)
  src/types/ride.ts          (new)
  src/types/booking.ts       (new)
  src/types/review.ts        (new)
  src/types/chat.ts          (new)
  src/types/notification.ts  (new)
  src/types/report.ts        (new)
  src/types/common.ts        (new)
  src/index.ts               (edit — re-export all)
  package.json               (edit — may need adjustment)
  tsconfig.json              (edit — path aliases)

apps/api/
  src/prisma/prisma.service.ts      (new)
  src/prisma/prisma.module.ts       (new)
  src/config/env.validation.ts      (new)
  src/modules/health/health.controller.ts  (new)
  src/modules/health/health.module.ts      (new)
  src/app.module.ts                 (edit)
  src/app.controller.ts             (delete)
  src/app.service.ts                (delete)
  src/app.controller.spec.ts        (delete)
  src/main.ts                       (edit)
  .env.example                      (edit)
  tsconfig.json                     (edit — path alias for @carpooling/shared)
```
