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
