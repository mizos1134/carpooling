import { GeoPoint } from './common';

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
