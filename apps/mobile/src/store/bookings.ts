import { create } from 'zustand';
import { api } from '../services/api';

interface CreateBookingData {
  rideId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seatsReserved: number;
  paymentMethod?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface BookingState {
  myBookings: any[];
  isLoading: boolean;
  createBooking: (data: CreateBookingData) => Promise<{ id: string }>;
}

export const useBookingStore = create<BookingState>((set) => ({
  myBookings: [],
  isLoading: false,

  createBooking: async (data: CreateBookingData): Promise<{ id: string }> => {
    set({ isLoading: true });
    try {
      const result = await api.post<{ id: string }>('/bookings', data);
      return result;
    } finally {
      set({ isLoading: false });
    }
  },
}));
