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
import { Avatar, StarRating } from '../../components/ui';
import { StickyBottomBar } from '../../components/layout';
import RouteTimeline from '../../components/map/route-timeline';
import { api } from '../../services/api';

type Props = NativeStackScreenProps<SearchStackParamList, 'RideDetail'>;

interface RideStop {
  id: string;
  orderIndex: number;
  label: string;
  arrivesAt?: string | null;
  priceFromOrigin?: string | null;
}

interface RideDriver {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  ratingAsDriver: string;
  totalRidesAsDriver: number;
  memberSince: string;
  isPhoneVerified: boolean;
  bio?: string | null;
}

interface RideVehicle {
  make: string;
  model: string;
  color: string;
  year?: number;
}

interface RidePreferences {
  smokingAllowed: boolean;
  musicAllowed: boolean;
  chatPreference: 'loves_to_chat' | 'sometimes' | 'silent';
}

interface RideDetail {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  estimatedArrivalAt?: string | null;
  seatsAvailable: number;
  pricePerSeat: string;
  currency: string;
  stops: RideStop[];
  driver: RideDriver;
  vehicle: RideVehicle;
  preferences?: RidePreferences | null;
}

function getMemberSinceYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

function formatVehicleLabel(vehicle: RideVehicle): string {
  const parts = [vehicle.make, vehicle.model];
  if (vehicle.year) parts.push(String(vehicle.year));
  parts.push(`· ${vehicle.color}`);
  return parts.join(' ');
}

export default function RideDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { rideId } = route.params;

  const [ride, setRide] = useState<RideDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<RideDetail>(`/rides/${rideId}`)
      .then(setRide)
      .catch(() => setRide(null))
      .finally(() => setIsLoading(false));
  }, [rideId]);

  if (isLoading || !ride) {
    return (
      <View
        className="flex-1 bg-white items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
          <Ionicons name="car-outline" size={24} color="#9CA3AF" />
        </View>
      </View>
    );
  }

  const price = parseFloat(ride.pricePerSeat).toFixed(0);
  const rating = parseFloat(ride.driver.ratingAsDriver);
  const chatLabel = (() => {
    switch (ride.preferences?.chatPreference) {
      case 'loves_to_chat': return t('rideDetail.chatLoveTo');
      case 'sometimes': return t('rideDetail.chatSometimes');
      case 'silent': return t('rideDetail.chatSilent');
      default: return null;
    }
  })();

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
          style={{ paddingTop: insets.top + 8 }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-9 h-9 rounded-full items-center justify-center active:bg-gray-100"
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>
          <Pressable
            className="w-9 h-9 rounded-full items-center justify-center active:bg-gray-100"
          >
            <Ionicons name="share-outline" size={22} color="#111827" />
          </Pressable>
        </View>

        {/* Route timeline */}
        <View className="py-5 border-b border-gray-100">
          <RouteTimeline
            stops={ride.stops}
            departureAt={ride.departureAt}
            estimatedArrivalAt={ride.estimatedArrivalAt}
          />
        </View>

        {/* Price section */}
        <View className="px-4 py-5 border-b border-gray-100 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              {price} {ride.currency}
              <Text className="text-base font-normal text-gray-500">
                {' '}{t('rides.perSeat')}
              </Text>
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {ride.seatsAvailable} {t('rideDetail.seatsAvailable')}
            </Text>
          </View>
        </View>

        {/* Driver card */}
        <Pressable
          onPress={() =>
            navigation.navigate('PublicProfile', { userId: ride.driver.id })
          }
          className="px-4 py-5 border-b border-gray-100 active:bg-gray-50"
        >
          <View className="flex-row items-center mb-3">
            <Avatar
              uri={ride.driver.avatarUrl}
              name={`${ride.driver.firstName} ${ride.driver.lastName}`}
              size="md"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {ride.driver.firstName} {ride.driver.lastName}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <StarRating rating={rating} size={13} showValue={true} />
                <Text className="text-xs text-gray-500 ml-2">
                  · {t('rideDetail.memberSince')}{' '}
                  {getMemberSinceYear(ride.driver.memberSince)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>

          {/* Vehicle */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="car-outline" size={16} color="#6B7280" />
            <Text className="ml-2 text-sm text-gray-600">
              {formatVehicleLabel(ride.vehicle)}
            </Text>
          </View>

          {/* Phone verified badge */}
          {ride.driver.isPhoneVerified && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text className="ml-2 text-sm text-success-700">
                {t('rideDetail.verified')}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Preferences */}
        {ride.preferences && (
          <View className="px-4 py-5 border-b border-gray-100">
            <View className="flex-row flex-wrap gap-y-3">
              {/* Smoking */}
              <View className="flex-row items-center w-1/2">
                <Ionicons
                  name={ride.preferences.smokingAllowed ? 'flame-outline' : 'ban-outline'}
                  size={18}
                  color={ride.preferences.smokingAllowed ? '#D97706' : '#6B7280'}
                />
                <Text className="ml-2 text-sm text-gray-700">
                  {ride.preferences.smokingAllowed
                    ? t('rideDetail.smoking')
                    : t('rideDetail.noSmoking')}
                </Text>
              </View>

              {/* Music */}
              <View className="flex-row items-center w-1/2">
                <Ionicons
                  name={ride.preferences.musicAllowed ? 'musical-notes-outline' : 'volume-mute-outline'}
                  size={18}
                  color={ride.preferences.musicAllowed ? '#2563EB' : '#6B7280'}
                />
                <Text className="ml-2 text-sm text-gray-700">
                  {ride.preferences.musicAllowed
                    ? t('rideDetail.music')
                    : t('rideDetail.noMusic')}
                </Text>
              </View>

              {/* Chat */}
              {chatLabel && (
                <View className="flex-row items-center w-1/2">
                  <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-700">{chatLabel}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Driver bio */}
        {ride.driver.bio ? (
          <View className="px-4 py-5">
            <Text className="text-sm text-gray-600 leading-relaxed">
              {ride.driver.bio}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky bottom bar */}
      <StickyBottomBar>
        <View className="flex-row items-center">
          <View className="mr-4">
            <Text className="text-xl font-bold text-gray-900">
              {price} {ride.currency}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('BookingConfirm', { rideId: ride.id })
            }
            className="flex-1 h-12 bg-primary-600 rounded-button items-center justify-center active:bg-primary-700"
          >
            <Text className="text-white font-bold text-base">
              {t('rideDetail.book')}
            </Text>
          </Pressable>
        </View>
      </StickyBottomBar>
    </View>
  );
}
