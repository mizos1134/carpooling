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
