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
