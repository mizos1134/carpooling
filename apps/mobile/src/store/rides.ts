import { create } from 'zustand';

export interface LocationSelection {
  label: string;
  lat: number;
  lng: number;
}

export interface SearchParams {
  origin: LocationSelection | null;
  destination: LocationSelection | null;
  date: string; // ISO date string
  passengers: number;
}

export interface RecentSearch {
  id: string;
  originLabel: string;
  destinationLabel: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  searchCount: number;
}

interface RideState {
  // Search
  searchParams: SearchParams;
  recentSearches: RecentSearch[];
  isSearching: boolean;

  // Actions
  setOrigin: (location: LocationSelection | null) => void;
  setDestination: (location: LocationSelection | null) => void;
  setDate: (date: string) => void;
  setPassengers: (count: number) => void;
  swapLocations: () => void;
  clearSearch: () => void;
  setRecentSearches: (searches: RecentSearch[]) => void;
}

export const useRideStore = create<RideState>((set) => ({
  searchParams: {
    origin: null,
    destination: null,
    date: new Date().toISOString().split('T')[0],
    passengers: 1,
  },
  recentSearches: [],
  isSearching: false,

  setOrigin: (origin) =>
    set((state) => ({ searchParams: { ...state.searchParams, origin } })),

  setDestination: (destination) =>
    set((state) => ({ searchParams: { ...state.searchParams, destination } })),

  setDate: (date) =>
    set((state) => ({ searchParams: { ...state.searchParams, date } })),

  setPassengers: (passengers) =>
    set((state) => ({ searchParams: { ...state.searchParams, passengers } })),

  swapLocations: () =>
    set((state) => ({
      searchParams: {
        ...state.searchParams,
        origin: state.searchParams.destination,
        destination: state.searchParams.origin,
      },
    })),

  clearSearch: () =>
    set({
      searchParams: {
        origin: null,
        destination: null,
        date: new Date().toISOString().split('T')[0],
        passengers: 1,
      },
    }),

  setRecentSearches: (recentSearches) => set({ recentSearches }),
}));
