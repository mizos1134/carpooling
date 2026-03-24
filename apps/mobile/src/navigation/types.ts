import type { NavigatorScreenParams } from '@react-navigation/native';
import type { GeoPoint } from '@carpooling/shared';

// ── Bottom Tabs ──────────────────────────────────────────────
export type MainTabParamList = {
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  PublishTab: NavigatorScreenParams<PublishStackParamList>;
  YourRidesTab: NavigatorScreenParams<YourRidesStackParamList>;
  InboxTab: NavigatorScreenParams<InboxStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ── Root (wraps tabs + modals) ───────────────────────────────
export type MainNavigatorParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LocationPicker: {
    fieldKey: 'origin' | 'destination' | 'stop';
  };
  ReportUser: { targetId: string; targetType: string };
  AddStop: undefined;
  VehicleSelect: undefined;
};

// ── Search Stack ─────────────────────────────────────────────
export type SearchStackParamList = {
  SearchHome: undefined;
  SearchResults: {
    originLabel: string;
    destinationLabel: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    date: string;
    passengers: number;
  };
  RideDetail: { rideId: string };
  BookingConfirm: { rideId: string };
  BookingSuccess: { bookingId: string };
  PublicProfile: { userId: string };
};

// ── Publish Stack ────────────────────────────────────────────
export type PublishStackParamList = {
  PublishRide: undefined;
  RidePublishSuccess: { rideId: string };
};

// ── Your Rides Stack ─────────────────────────────────────────
export type YourRidesStackParamList = {
  YourRides: undefined;
  PassengerBookingDetail: { bookingId: string };
  DriverRideDetail: { rideId: string };
  ManageBooking: { bookingId: string };
  LeaveReview: { bookingId: string; revieweeId: string; revieweeName: string };
  ChatThread: { conversationId: string; otherUserName: string };
  PublicProfile: { userId: string };
};

// ── Inbox Stack ──────────────────────────────────────────────
export type InboxStackParamList = {
  InboxList: undefined;
  ChatThread: { conversationId: string; otherUserName: string };
  PublicProfile: { userId: string };
};

// ── Profile Stack ────────────────────────────────────────────
export type ProfileStackParamList = {
  ProfileHub: undefined;
  EditProfile: undefined;
  DriverSetup: undefined;
  VehicleList: undefined;
  VehicleForm: { vehicleId?: string };
  MyReviews: undefined;
  Settings: undefined;
  PublicProfile: { userId: string };
};
