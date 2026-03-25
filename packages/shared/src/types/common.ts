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
