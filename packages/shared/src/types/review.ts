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
