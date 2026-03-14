import { create } from 'zustand';
import { getItem, setItem, deleteItem } from '../services/storage';
import { api } from '../services/api';

interface AuthUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isHydrated: boolean;

  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  isHydrated: false,

  sendOtp: async (phone: string) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/send-otp', { phone });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (phone: string, code: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ accessToken: string; user: AuthUser }>(
        '/auth/verify-otp',
        { phone, code },
      );
      await setItem('accessToken', response.accessToken);
      set({ token: response.accessToken, user: response.user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await deleteItem('accessToken');
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = await getItem('accessToken');
    set({ token, isHydrated: true });
  },
}));
