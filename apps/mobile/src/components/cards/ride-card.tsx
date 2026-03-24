import { Pressable, Text, View } from 'react-native';
import { Avatar, StarRating } from '../ui';

interface RideCardDriver {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  ratingAsDriver: string;
  totalRidesAsDriver: number;
}

interface RideCardVehicle {
  make: string;
  model: string;
  color: string;
}

export interface RideCardRide {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  estimatedArrivalAt?: string;
  seatsAvailable: number;
  pricePerSeat: string;
  currency: string;
  driver: RideCardDriver;
  vehicle: RideCardVehicle;
}

interface RideCardProps {
  ride: RideCardRide;
  onPress: (rideId: string) => void;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDriverName(firstName: string, lastName: string): string {
  const initial = lastName.trim().charAt(0).toUpperCase();
  return `${firstName} ${initial}.`;
}

export default function RideCard({ ride, onPress }: RideCardProps) {
  const price = parseFloat(ride.pricePerSeat).toFixed(0);
  const rating = parseFloat(ride.driver.ratingAsDriver);
  const driverName = formatDriverName(ride.driver.firstName, ride.driver.lastName);

  return (
    <Pressable
      onPress={() => onPress(ride.id)}
      className="bg-white rounded-card shadow-sm border border-gray-100 mb-3 overflow-hidden active:opacity-90"
    >
      <View className="p-4">
        {/* Time row */}
        <View className="flex-row items-center mb-2">
          <Text className="text-xl font-bold text-gray-900">
            {formatTime(ride.departureAt)}
          </Text>
          <View className="flex-1 mx-3 flex-row items-center justify-center">
            <View className="flex-1 border-t border-dashed border-gray-300" />
          </View>
          {ride.estimatedArrivalAt ? (
            <Text className="text-xl font-bold text-gray-900">
              {formatTime(ride.estimatedArrivalAt)}
            </Text>
          ) : (
            <View className="w-10" />
          )}
        </View>

        {/* Route labels */}
        <View className="flex-row items-center mb-3">
          <Text className="flex-1 text-sm text-gray-700 font-medium" numberOfLines={1}>
            {ride.originLabel}
          </Text>
          <View className="mx-2">
            <Text className="text-gray-400 text-xs">→</Text>
          </View>
          <Text className="flex-1 text-sm text-gray-700 font-medium text-right" numberOfLines={1}>
            {ride.destinationLabel}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100 mb-3" />

        {/* Driver row */}
        <View className="flex-row items-center mb-3">
          <Avatar
            uri={ride.driver.avatarUrl}
            name={`${ride.driver.firstName} ${ride.driver.lastName}`}
            size="sm"
          />
          <Text className="ml-2 text-sm font-medium text-gray-800 mr-2">
            {driverName}
          </Text>
          <StarRating
            rating={rating}
            size={12}
            showValue={true}
          />
          <Text className="ml-2 text-xs text-gray-400">
            ({ride.driver.totalRidesAsDriver})
          </Text>
        </View>

        {/* Price + seats row */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary-600">
            {price} {ride.currency}
          </Text>
          <Text className="text-sm text-gray-500">
            {ride.seatsAvailable}{' '}
            {ride.seatsAvailable === 1 ? 'place' : 'places'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
