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
