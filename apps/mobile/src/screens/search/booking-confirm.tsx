import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../navigation/types';
import { Stepper } from '../../components/ui';
import { StickyBottomBar } from '../../components/layout';
import { api } from '../../services/api';
import { useBookingStore } from '../../store/bookings';

type Props = NativeStackScreenProps<SearchStackParamList, 'BookingConfirm'>;

interface RideStop {
  id: string;
  orderIndex: number;
  label: string;
  arrivesAt?: string | null;
  priceFromOrigin?: string | null;
}

interface BookingRide {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  seatsAvailable: number;
  pricePerSeat: string;
  currency: string;
  stops: RideStop[];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function BookingConfirmScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { rideId } = route.params;
  const { createBooking, isLoading } = useBookingStore();

  const [ride, setRide] = useState<BookingRide | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [pickupStopId, setPickupStopId] = useState<string>('');
  const [dropoffStopId, setDropoffStopId] = useState<string>('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    api
      .get<BookingRide>(`/rides/${rideId}`)
      .then((data) => {
        setRide(data);
        const sorted = [...data.stops].sort((a, b) => a.orderIndex - b.orderIndex);
        if (sorted.length > 0) {
          setPickupStopId(sorted[0].id);
          setDropoffStopId(sorted[sorted.length - 1].id);
        }
      })
      .catch(() => setRide(null))
      .finally(() => setIsFetching(false));
  }, [rideId]);

  const handleConfirm = async () => {
    if (!ride || !pickupStopId || !dropoffStopId) return;
    try {
      const booking = await createBooking({
        rideId: ride.id,
        pickupStopId,
        dropoffStopId,
        seatsReserved: seats,
        paymentMethod: 'cash',
      });
      navigation.navigate('BookingSuccess', { bookingId: booking.id });
    } catch {
      // handle error — silent for now
    }
  };

  if (isFetching || !ride) {
    return (
      <View
        className="flex-1 bg-white items-center justify-center"
        style={{ paddingTop: insets.top }}
      />
    );
  }

  const sortedStops = [...ride.stops].sort((a, b) => a.orderIndex - b.orderIndex);
  const pricePerSeat = parseFloat(ride.pricePerSeat);
  const total = pricePerSeat * seats;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-white border-b border-gray-100 px-4 py-3 flex-row items-center"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-9 h-9 rounded-full items-center justify-center active:bg-gray-100 mr-3"
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>
        <Text className="text-base font-bold text-gray-900 flex-1">
          {t('booking.confirmTitle')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Ride mini-summary */}
        <View className="bg-white mx-4 mt-4 rounded-card border border-gray-100 shadow-sm p-4">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full border-2 border-primary-600 mr-2" />
            <Text className="flex-1 text-sm font-medium text-gray-800" numberOfLines={1}>
              {ride.originLabel}
            </Text>
          </View>
          <View className="ml-1 w-px h-4 bg-gray-200 my-1" />
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-primary-600 mr-2" />
            <Text className="flex-1 text-sm font-medium text-gray-800" numberOfLines={1}>
              {ride.destinationLabel}
            </Text>
          </View>
          <View className="flex-row mt-3 pt-3 border-t border-gray-100">
            <View className="flex-row items-center mr-4">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-500">
                {formatDate(ride.departureAt)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-500">
                {formatTime(ride.departureAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup stop picker */}
        <View className="mx-4 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2 px-1">
            {t('booking.pickupPoint')}
          </Text>
          <View className="bg-white rounded-card border border-gray-100 overflow-hidden">
            {sortedStops.map((stop, index) => {
              const isSelected = pickupStopId === stop.id;
              const isLast = index === sortedStops.length - 1;
              return (
                <Pressable
                  key={stop.id}
                  onPress={() => setPickupStopId(stop.id)}
                  className={`flex-row items-center px-4 py-3 active:bg-gray-50 ${
                    !isLast ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      isSelected ? 'border-primary-600' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-sm ${
                      isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                    numberOfLines={1}
                  >
                    {stop.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dropoff stop picker */}
        <View className="mx-4 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2 px-1">
            {t('booking.dropoffPoint')}
          </Text>
          <View className="bg-white rounded-card border border-gray-100 overflow-hidden">
            {sortedStops.map((stop, index) => {
              const isSelected = dropoffStopId === stop.id;
              const isLast = index === sortedStops.length - 1;
              return (
                <Pressable
                  key={stop.id}
                  onPress={() => setDropoffStopId(stop.id)}
                  className={`flex-row items-center px-4 py-3 active:bg-gray-50 ${
                    !isLast ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      isSelected ? 'border-primary-600' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-sm ${
                      isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                    numberOfLines={1}
                  >
                    {stop.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Seats */}
        <View className="mx-4 mt-4 bg-white rounded-card border border-gray-100 p-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-gray-700">
            {t('booking.seats')}
          </Text>
          <Stepper
            value={seats}
            min={1}
            max={ride.seatsAvailable}
            onValueChange={setSeats}
          />
        </View>

        {/* Price breakdown */}
        <View className="mx-4 mt-4 bg-white rounded-card border border-gray-100 p-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            {t('booking.priceBreakdown')}
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">
              {seats} × {pricePerSeat.toFixed(0)} {ride.currency}
            </Text>
            <Text className="text-sm text-gray-800">
              {total.toFixed(0)} {ride.currency}
            </Text>
          </View>
          <View className="h-px bg-gray-100 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-sm font-bold text-gray-900">
              {t('booking.total')}
            </Text>
            <Text className="text-sm font-bold text-primary-600">
              {total.toFixed(0)} {ride.currency}
            </Text>
          </View>
        </View>

        {/* Payment method */}
        <View className="mx-4 mt-4 mb-4 bg-white rounded-card border border-gray-100 p-4 flex-row items-center">
          <Ionicons name="cash-outline" size={22} color="#059669" />
          <Text className="ml-3 text-sm text-gray-700 flex-1">
            {t('booking.paymentCash')}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <StickyBottomBar>
        <Pressable
          onPress={handleConfirm}
          disabled={isLoading}
          className={`h-12 rounded-button items-center justify-center ${
            isLoading ? 'bg-primary-300' : 'bg-primary-600 active:bg-primary-700'
          }`}
        >
          <Text className="text-white font-bold text-base">
            {t('booking.confirmButton')}
          </Text>
        </Pressable>
      </StickyBottomBar>
    </View>
  );
}
