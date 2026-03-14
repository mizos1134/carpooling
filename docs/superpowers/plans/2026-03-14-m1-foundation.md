# M1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** API connects to Supabase via Prisma, shared types exist, health endpoint confirms DB connectivity.

**Architecture:** Global PrismaModule wraps the Prisma client for DI. ConfigModule validates env vars at startup (fail-fast). Health endpoint proves the full stack works. Shared package exports TypeScript types consumed by both API and mobile via pnpm workspace linking.

**Tech Stack:** NestJS 11, Prisma 6, @nestjs/config, class-validator, class-transformer, TypeScript strict mode

**Spec:** `docs/superpowers/specs/2026-03-14-mvp-incremental-build-design.md`

---

## File Structure

```
packages/shared/
  src/
    types/
      common.ts        — GeoPoint, ApiResponse<T>, PaginatedResponse<T>, shared enums
      user.ts          — User, DriverProfile, Vehicle interfaces
      ride.ts          — Ride, RideStop interfaces, RideStatus enum
      booking.ts       — Booking interface, BookingStatus enum
      review.ts        — Review interface
      chat.ts          — Conversation, Message interfaces, MessageType enum
      notification.ts  — Notification interface, NotificationType/NotificationEntityType enums
      report.ts        — Report, UserBlock interfaces, ReportTargetType/ReportReason/ReportStatus/BlockReason enums
    index.ts           — Re-exports everything
  package.json         — Already has zod; no changes needed
  tsconfig.json        — No changes needed

apps/api/
  src/
    prisma/
      prisma.service.ts    — PrismaClient wrapper with lifecycle hooks
      prisma.module.ts     — Global module providing PrismaService
    config/
      env.validation.ts    — class-validator DTO + validate function
    modules/
      health/
        health.controller.ts  — GET /health endpoint
        health.module.ts       — Declares HealthController
    app.module.ts          — Updated: imports Config, Prisma, Health
    main.ts                — Updated: CORS, ValidationPipe, prefix
    app.controller.ts      — DELETED
    app.service.ts         — DELETED
    app.controller.spec.ts — DELETED
  package.json             — Add @carpooling/shared workspace dep
  tsconfig.json            — Add path alias for @carpooling/shared
  .env.example             — Updated with all required vars
```

---

## Chunk 1: Shared Types

### Task 1: Create shared type files

**Files:**
- Create: `packages/shared/src/types/common.ts`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/ride.ts`
- Create: `packages/shared/src/types/booking.ts`
- Create: `packages/shared/src/types/review.ts`
- Create: `packages/shared/src/types/chat.ts`
- Create: `packages/shared/src/types/notification.ts`
- Create: `packages/shared/src/types/report.ts`
- Modify: `packages/shared/src/index.ts`

- [ ] **Step 1: Create `packages/shared/src/types/common.ts`**

```typescript
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  PreferNotToSay = 'prefer_not_to_say',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Superadmin = 'superadmin',
}

export enum ChatPreference {
  Silent = 'silent',
  Sometimes = 'sometimes',
  LoveToChat = 'love_to_chat',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  MobileWallet = 'mobile_wallet',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Refunded = 'refunded',
}
```

- [ ] **Step 2: Create `packages/shared/src/types/user.ts`**

```typescript
import { Gender, Role, ChatPreference } from './common.js';

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender | null;
  bio: string | null;
  city: string | null;
  preferredLanguage: string;
  ratingAsDriver: number;
  ratingAsPassenger: number;
  totalRidesAsDriver: number;
  totalRidesAsPassenger: number;
  isPhoneVerified: boolean;
  phoneVerifiedAt: string | null;
  isBlocked: boolean;
  blockedAt: string | null;
  blockReason: string | null;
  deletedAt: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface DriverProfile {
  userId: string;
  licenseNumber: string | null;
  licensePhotoUrl: string | null;
  isLicenseVerified: boolean;
  smokingAllowed: boolean;
  musicAllowed: boolean;
  chatPreference: ChatPreference | null;
  autoApproveBookings: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  totalSeats: number;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 3: Create `packages/shared/src/types/ride.ts`**

```typescript
import { GeoPoint } from './common.js';

export enum RideStatus {
  Draft = 'draft',
  Published = 'published',
  Full = 'full',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface Ride {
  id: string;
  driverId: string;
  vehicleId: string;
  originLabel: string;
  originLocation: GeoPoint;
  destinationLabel: string;
  destinationLocation: GeoPoint;
  departureAt: string;
  estimatedArrivalAt: string | null;
  seatsOffered: number;
  seatsAvailable: number;
  pricePerSeat: number;
  currency: string;
  distanceKm: number | null;
  durationMin: number | null;
  polyline: string | null;
  status: RideStatus;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RideStop {
  id: string;
  rideId: string;
  orderIndex: number;
  label: string;
  location: GeoPoint;
  arrivesAt: string | null;
  priceFromOrigin: number | null;
  createdAt: string;
}
```

- [ ] **Step 4: Create `packages/shared/src/types/booking.ts`**

```typescript
import { PaymentMethod, PaymentStatus } from './common.js';

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seatsReserved: number;
  pricePerSeat: number;
  totalPrice: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 5: Create `packages/shared/src/types/review.ts`**

```typescript
export interface Review {
  id: string;
  bookingId: string;
  rideId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 6: Create `packages/shared/src/types/chat.ts`**

```typescript
export enum MessageType {
  Text = 'text',
  System = 'system',
}

export interface Conversation {
  id: string;
  bookingId: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  driverUnreadCount: number;
  passengerUnreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  messageType: MessageType;
  isRead: boolean;
  readAt: string | null;
  deletedBySender: boolean;
  deletedByReceiver: boolean;
  createdAt: string;
}
```

- [ ] **Step 7: Create `packages/shared/src/types/notification.ts`**

```typescript
export enum NotificationType {
  BookingRequest = 'booking_request',
  BookingConfirmed = 'booking_confirmed',
  BookingRejected = 'booking_rejected',
  BookingCancelled = 'booking_cancelled',
  RideStarted = 'ride_started',
  RideCompleted = 'ride_completed',
  NewMessage = 'new_message',
  NewReview = 'new_review',
  RideAlert = 'ride_alert',
  AccountVerified = 'account_verified',
  AccountBlocked = 'account_blocked',
  System = 'system',
}

export enum NotificationEntityType {
  Booking = 'booking',
  Ride = 'ride',
  Message = 'message',
  Review = 'review',
  User = 'user',
  Conversation = 'conversation',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType: NotificationEntityType | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  pushSent: boolean;
  pushSentAt: string | null;
  createdAt: string;
}
```

- [ ] **Step 8: Create `packages/shared/src/types/report.ts`**

```typescript
export enum ReportTargetType {
  User = 'user',
  Ride = 'ride',
  Review = 'review',
  Message = 'message',
}

export enum ReportReason {
  InappropriateBehavior = 'inappropriate_behavior',
  FakeProfile = 'fake_profile',
  FakeRide = 'fake_ride',
  Harassment = 'harassment',
  Spam = 'spam',
  AbusiveReview = 'abusive_review',
  Other = 'other',
}

export enum ReportStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Resolved = 'resolved',
  Dismissed = 'dismissed',
}

export enum BlockReason {
  Uncomfortable = 'uncomfortable',
  Harassment = 'harassment',
  NoShow = 'no_show',
  InappropriateMessages = 'inappropriate_messages',
  Other = 'other',
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: BlockReason | null;
  createdAt: string;
}
```

- [ ] **Step 9: Update `packages/shared/src/index.ts` to re-export all**

```typescript
export * from './types/common.js';
export * from './types/user.js';
export * from './types/ride.js';
export * from './types/booking.js';
export * from './types/review.js';
export * from './types/chat.js';
export * from './types/notification.js';
export * from './types/report.js';
```

- [ ] **Step 10: Verify shared package typechecks**

Run: `pnpm --filter @carpooling/shared typecheck`
Expected: No errors

- [ ] **Step 11: Commit**

```bash
git add packages/shared/
git commit -m "feat(shared): add TypeScript types for all domain models"
```

---

## Chunk 2: API Infrastructure (Prisma + Config + Health)

### Task 2: Link shared package to API

**Files:**
- Modify: `apps/api/package.json`

- [ ] **Step 1: Add `@carpooling/shared` as workspace dependency**

Add to `dependencies` in `apps/api/package.json`:
```json
"@carpooling/shared": "workspace:*"
```

- [ ] **Step 2: Install to create the link**

Run: `pnpm install`
Expected: Completes successfully, shared package is linked

- [ ] **Step 3: Verify import works**

Run: `cd apps/api && node -e "require('@carpooling/shared')"`
Expected: No errors (module resolves)

---

### Task 3: Create Prisma module

**Files:**
- Create: `apps/api/src/prisma/prisma.service.ts`
- Create: `apps/api/src/prisma/prisma.module.ts`

- [ ] **Step 1: Create `apps/api/src/prisma/prisma.service.ts`**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
```

- [ ] **Step 2: Create `apps/api/src/prisma/prisma.module.ts`**

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 3: Generate Prisma client**

Run: `pnpm --filter api prisma:generate`
Expected: `✔ Generated Prisma Client`

---

### Task 4: Create env validation

**Files:**
- Create: `apps/api/src/config/env.validation.ts`

- [ ] **Step 1: Create `apps/api/src/config/env.validation.ts`**

```typescript
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_URL!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  SUPABASE_URL?: string;

  @IsString()
  @IsOptional()
  SUPABASE_ANON_KEY?: string;

  @IsString()
  @IsOptional()
  SUPABASE_SERVICE_ROLE_KEY?: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION?: string = '7d';

  @IsOptional()
  PORT?: number = 3000;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.toString()}`);
  }
  return validatedConfig;
}
```

---

### Task 5: Create Health module

**Files:**
- Create: `apps/api/src/modules/health/health.controller.ts`
- Create: `apps/api/src/modules/health/health.module.ts`

- [ ] **Step 1: Create `apps/api/src/modules/health/health.controller.ts`**

```typescript
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      };
    }
  }
}
```

- [ ] **Step 2: Create `apps/api/src/modules/health/health.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

---

### Task 6: Update AppModule and main.ts

**Files:**
- Modify: `apps/api/src/app.module.ts`
- Modify: `apps/api/src/main.ts`
- Delete: `apps/api/src/app.controller.ts`
- Delete: `apps/api/src/app.service.ts`
- Delete: `apps/api/src/app.controller.spec.ts`

- [ ] **Step 1: Update `apps/api/src/app.module.ts`**

Replace entire file contents with:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { validate } from './config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 2: Update `apps/api/src/main.ts`**

Replace entire file contents with:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
```

- [ ] **Step 3: Delete old scaffold files**

Delete these files:
- `apps/api/src/app.controller.ts`
- `apps/api/src/app.service.ts`
- `apps/api/src/app.controller.spec.ts`

---

### Task 7: Update .env.example

**Files:**
- Modify: `apps/api/.env.example`

- [ ] **Step 1: Write `.env.example`**

```
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_JWT_SECRET="your-jwt-secret"

# Auth
JWT_EXPIRATION="7d"

# Server
PORT=3000
```

---

### Task 8: Test the full stack

- [ ] **Step 1: Start the API**

Run: `pnpm api`
Expected: Server starts, logs show:
- `Database connection established`
- `Nest application successfully started`

- [ ] **Step 2: Test health endpoint**

Run: `curl http://localhost:3000/api/v1/health`
Expected: `{"status":"ok","timestamp":"...","database":"connected"}`

- [ ] **Step 3: Test 404 for old root route**

Run: `curl http://localhost:3000/`
Expected: 404 (old Hello World route is gone)

- [ ] **Step 4: Commit**

```bash
git add apps/api/ packages/shared/
git commit -m "feat(api): add Prisma, config validation, and health endpoint (M1)"
```
