-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "ChatPreference" AS ENUM ('silent', 'sometimes', 'love_to_chat');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('draft', 'published', 'full', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'mobile_wallet');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'refunded');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'system');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('user', 'ride', 'review', 'message');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('inappropriate_behavior', 'fake_profile', 'fake_ride', 'harassment', 'spam', 'abusive_review', 'other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('booking_request', 'booking_confirmed', 'booking_rejected', 'booking_cancelled', 'ride_started', 'ride_completed', 'new_message', 'new_review', 'ride_alert', 'account_verified', 'account_blocked', 'system');

-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('booking', 'ride', 'message', 'review', 'user', 'conversation');

-- CreateEnum
CREATE TYPE "BlockReason" AS ENUM ('uncomfortable', 'harassment', 'no_show', 'inappropriate_messages', 'other');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "avatarUrl" TEXT,
    "gender" "Gender",
    "bio" TEXT,
    "city" VARCHAR(100),
    "preferredLanguage" VARCHAR(10) NOT NULL DEFAULT 'fr',
    "ratingAsDriver" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "ratingAsPassenger" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "totalRidesAsDriver" INTEGER NOT NULL DEFAULT 0,
    "totalRidesAsPassenger" INTEGER NOT NULL DEFAULT 0,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" TIMESTAMPTZ,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedAt" TIMESTAMPTZ,
    "blockReason" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_profiles" (
    "userId" UUID NOT NULL,
    "licenseNumber" VARCHAR(50),
    "licensePhotoUrl" TEXT,
    "isLicenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "smokingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "musicAllowed" BOOLEAN NOT NULL DEFAULT true,
    "chatPreference" "ChatPreference",
    "autoApproveBookings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "driver_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "make" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "year" SMALLINT NOT NULL,
    "color" VARCHAR(30) NOT NULL,
    "licensePlate" VARCHAR(20) NOT NULL,
    "totalSeats" SMALLINT NOT NULL,
    "photoUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "originLabel" VARCHAR(200) NOT NULL,
    "originLocation" geography(Point,4326) NOT NULL,
    "destinationLabel" VARCHAR(200) NOT NULL,
    "destinationLocation" geography(Point,4326) NOT NULL,
    "departureAt" TIMESTAMPTZ NOT NULL,
    "estimatedArrivalAt" TIMESTAMPTZ,
    "seatsOffered" SMALLINT NOT NULL,
    "seatsAvailable" SMALLINT NOT NULL,
    "pricePerSeat" DECIMAL(8,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'MAD',
    "distanceKm" DECIMAL(6,1),
    "durationMin" SMALLINT,
    "polyline" TEXT,
    "status" "RideStatus" NOT NULL DEFAULT 'published',
    "cancelledAt" TIMESTAMPTZ,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_stops" (
    "id" UUID NOT NULL,
    "rideId" UUID NOT NULL,
    "orderIndex" SMALLINT NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "location" geography(Point,4326) NOT NULL,
    "arrivesAt" TIMESTAMPTZ,
    "priceFromOrigin" DECIMAL(8,2),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "rideId" UUID NOT NULL,
    "passengerId" UUID NOT NULL,
    "pickupStopId" UUID NOT NULL,
    "dropoffStopId" UUID NOT NULL,
    "seatsReserved" SMALLINT NOT NULL DEFAULT 1,
    "pricePerSeat" DECIMAL(8,2) NOT NULL,
    "totalPrice" DECIMAL(8,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'MAD',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "confirmedAt" TIMESTAMPTZ,
    "cancelledAt" TIMESTAMPTZ,
    "cancelledBy" UUID,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "rideId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "revieweeId" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "rideId" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "passengerId" UUID NOT NULL,
    "lastMessageAt" TIMESTAMPTZ,
    "lastMessagePreview" VARCHAR(100),
    "driverUnreadCount" SMALLINT NOT NULL DEFAULT 0,
    "passengerUnreadCount" SMALLINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL DEFAULT 'text',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMPTZ,
    "deletedBySender" BOOLEAN NOT NULL DEFAULT false,
    "deletedByReceiver" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" UUID NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "reviewedBy" UUID,
    "reviewedAt" TIMESTAMPTZ,
    "resolutionNote" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" UUID NOT NULL,
    "blockerId" UUID NOT NULL,
    "blockedId" UUID NOT NULL,
    "reason" "BlockReason",
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_routes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "originLabel" VARCHAR(200) NOT NULL,
    "originLocation" geography(Point,4326) NOT NULL,
    "destinationLabel" VARCHAR(200) NOT NULL,
    "destinationLocation" geography(Point,4326) NOT NULL,
    "nickname" VARCHAR(100),
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "alertRadiusKm" SMALLINT DEFAULT 10,
    "alertDays" INTEGER[],
    "alertTimeFrom" TIME,
    "alertTimeTo" TIME,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "favorite_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recent_searches" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "originLabel" VARCHAR(200) NOT NULL,
    "originLocation" geography(Point,4326) NOT NULL,
    "destinationLabel" VARCHAR(200) NOT NULL,
    "destinationLocation" geography(Point,4326) NOT NULL,
    "departureDate" DATE,
    "seatsNeeded" SMALLINT NOT NULL DEFAULT 1,
    "searchCount" SMALLINT NOT NULL DEFAULT 1,
    "lastSearchedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "entityType" "NotificationEntityType",
    "entityId" UUID,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMPTZ,
    "pushSent" BOOLEAN NOT NULL DEFAULT false,
    "pushSentAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licensePlate_key" ON "vehicles"("licensePlate");

-- CreateIndex
CREATE INDEX "idx_rides_status" ON "rides"("status");

-- CreateIndex
CREATE INDEX "idx_rides_departure" ON "rides"("departureAt");

-- CreateIndex
CREATE INDEX "idx_rides_driver" ON "rides"("driverId");

-- CreateIndex
CREATE INDEX "idx_stops_ride" ON "ride_stops"("rideId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ride_stops_rideId_orderIndex_key" ON "ride_stops"("rideId", "orderIndex");

-- CreateIndex
CREATE INDEX "idx_bookings_ride" ON "bookings"("rideId");

-- CreateIndex
CREATE INDEX "idx_bookings_passenger" ON "bookings"("passengerId");

-- CreateIndex
CREATE INDEX "idx_bookings_ride_status" ON "bookings"("rideId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_reviewerId_key" ON "reviews"("bookingId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_bookingId_key" ON "conversations"("bookingId");

-- CreateIndex
CREATE INDEX "idx_messages_conversation" ON "messages"("conversationId", "createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "reports_reporterId_targetType_targetId_key" ON "reports"("reporterId", "targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blockerId_blockedId_key" ON "user_blocks"("blockerId", "blockedId");

-- CreateIndex
CREATE INDEX "idx_fav_routes_user" ON "favorite_routes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_routes_userId_originLabel_destinationLabel_key" ON "favorite_routes"("userId", "originLabel", "destinationLabel");

-- CreateIndex
CREATE UNIQUE INDEX "recent_searches_userId_originLabel_destinationLabel_key" ON "recent_searches"("userId", "originLabel", "destinationLabel");

-- CreateIndex
CREATE INDEX "idx_notifications_user" ON "notifications"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "driver_profiles" ADD CONSTRAINT "driver_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_stops" ADD CONSTRAINT "ride_stops_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cancelledBy_fkey" FOREIGN KEY ("cancelledBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_pickupStopId_fkey" FOREIGN KEY ("pickupStopId") REFERENCES "ride_stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_dropoffStopId_fkey" FOREIGN KEY ("dropoffStopId") REFERENCES "ride_stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_routes" ADD CONSTRAINT "favorite_routes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_searches" ADD CONSTRAINT "recent_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
