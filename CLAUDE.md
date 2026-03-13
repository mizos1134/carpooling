# Carpooling App — Claude Context

This is a carpooling mobile app targeting the Moroccan market (similar to BlaBlaCar).
Read this file before doing anything. It is the source of truth for all decisions.

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Mobile | React Native + Expo (TypeScript) | Managed workflow unless native modules require bare |
| Navigation | React Navigation v6 | |
| State | Zustand | Lightweight, no Redux |
| UI | NativeWind (Tailwind) | |
| Forms | React Hook Form + Zod | |
| Backend | Node.js v20 + NestJS (TypeScript) | REST API, modular architecture |
| ORM | Prisma | Type-safe, handles Supabase/PostgreSQL |
| Database | Supabase (PostgreSQL + PostGIS) | PostGIS for geolocation queries |
| Auth | Supabase Auth + SMS OTP | Via Twilio |
| Storage | Supabase Storage | Avatars, ID verification docs |
| Real-time | Socket.io (NestJS gateway) | In-app chat + ride status events |
| Maps | Mapbox (rendering) + Google Places & Directions (search/routing) | Hybrid approach |
| Notifications | FCM + Expo Push Notifications | |
| SMS | Twilio | OTP + booking confirmations |
| Payments | Cash only (MVP) | CMI + mobile wallets in V2 |
| Cache | Upstash Redis | Sessions, rate limiting |
| Hosting | Railway (MVP) → AWS at scale | |
| Monitoring | Sentry | Mobile + backend |
| CI/CD | GitHub Actions | |

---

## MVP Feature Scope

These features are IN for MVP. Build nothing outside this list without asking.

- Phone OTP authentication (Supabase Auth + Twilio)
- User profile (name, avatar, bio, city, language preference)
- Driver profile + vehicle registration
- Post a ride (origin, destination, date, seats, price, intermediate stops)
- Ride search with filters (origin, destination, date, seats)
- Book a ride (cash payment only)
- Driver confirms or rejects a booking
- In-app chat per booking (Socket.io)
- Ride status updates (pending → active → completed) via Socket.io events — NO live GPS tracking
- Post-ride reviews (bilateral: driver ↔ passenger)
- Push notifications for booking events (FCM)
- Recent searches (last 5, upsert-based)
- Report / block a user (safety-critical)

### Explicitly OUT of MVP (V2+)
- Live GPS tracking during ride
- CMI / mobile wallet payments
- Favorite routes with alerts
- Recurring rides
- Promo codes
- Admin dashboard
- Twilio number masking
- Social login (Google/Apple)

---

## Localization

The app supports **3 languages: French (default), Arabic, English**.

- Use `i18next` + `react-i18next` on mobile
- Arabic requires **RTL layout support** — configure from day one
- Store ALL UI strings in locale files: `en.json`, `fr.json`, `ar.json`
- **Never hardcode any display string in components**
- Backend error messages and notification text are stored as plain text (not generated on read)

---

## Data Model

14 tables. See the full data model document for column-level detail.

| Table | Purpose |
|---|---|
| users | Primary identity for all users |
| driver_profiles | 1:1 extension of users (Table-Per-Type pattern) |
| vehicles | Cars registered by drivers |
| rides | Trip listings posted by drivers |
| ride_stops | Ordered intermediate stops (origin = index 0, destination = last) |
| bookings | Passenger seat reservations |
| reviews | Bilateral post-ride ratings (single table, both directions) |
| conversations | Chat thread metadata per booking |
| messages | Individual chat messages |
| reports | Polymorphic abuse reports |
| user_blocks | Directional user blocks |
| favorite_routes | Saved routes (V2 alerts) |
| recent_searches | Last 5 searches per user (upsert) |
| notifications | In-app notification inbox |

### Key Data Model Rules
- PostGIS `GEOGRAPHY(POINT,4326)` for all location fields alongside human-readable labels
- `bookings.price_per_seat` and `total_price` are **price snapshots** — frozen at booking time
- Ride status machine: `draft → published → full → in_progress → completed` (cancelled from any state except completed)
- Booking status machine: `pending → confirmed → rejected → cancelled → completed`
- `seats_available = 0` automatically flips ride status to `full`
- Conversations are created automatically when a booking is confirmed
- `recent_searches` uses UPSERT — repeat searches increment `search_count`, never create duplicates
- Notification `title` and `body` are stored as plain text, not generated dynamically

---

## Coding Conventions

- **Language**: TypeScript strict mode everywhere (mobile + backend)
- **No hardcoded strings** in UI components — always use i18n keys
- **No raw SQL** except for PostGIS spatial queries (use Prisma for everything else)
- **NestJS structure**: one module per feature (auth, users, rides, bookings, etc.)
- **Zod** for all input validation on mobile forms
- **class-validator** for all DTO validation on the backend
- **ESLint + Prettier** enforced — no exceptions
- Folder naming: `kebab-case` for files and folders
- Component naming: `PascalCase` for React components
- Use `async/await` — no `.then()` chains

---

## Monorepo Structure

```
/
├── apps/
│   ├── mobile/        # React Native + Expo
│   └── api/           # NestJS backend
├── packages/
│   └── shared/        # Shared TypeScript types and Zod schemas
├── CLAUDE.md
└── package.json       # Root workspace config
```

---

## Environment Variables

Never commit `.env` files. Use `.env.example` with placeholder values.
Always load secrets from environment — never hardcode API keys.

---

## Decisions Already Made — Do Not Revisit

- Cash-only payments for MVP (no Stripe, no CMI yet)
- Twilio for SMS (proven delivery in Morocco — used by InDrive)
- Mapbox for rendering + Google Places/Directions for search (hybrid)
- Socket.io for real-time (not Supabase Realtime for chat)
- No live GPS tracking in MVP — only ride status events
- 3 languages with RTL support from day one
- Prisma as ORM (not raw Supabase client for business logic)
- Railway for initial hosting
