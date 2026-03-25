import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../navigation/types';
import { EmptyState } from '../../components/ui';
import RideCard, { type RideCardRide } from '../../components/cards/ride-card';
import { api } from '../../services/api';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResults'>;

type SortOption = 'departure' | 'price' | 'rating';

interface RidesResponse {
  data: RideCardRide[];
}

export default function SearchResultsScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    originLabel,
    destinationLabel,
    originLat,
    originLng,
    destLat,
    destLng,
    date,
    passengers,
  } = route.params;

  const [rides, setRides] = useState<RideCardRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState<SortOption>('departure');

  const fetchRides = useCallback(
    async (currentSort: SortOption) => {
      try {
        const params = new URLSearchParams({
          originLat: String(originLat),
          originLng: String(originLng),
          destLat: String(destLat),
          destLng: String(destLng),
          date,
          passengers: String(passengers),
          sort: currentSort,
        });
        const response = await api.get<RidesResponse>(`/rides?${params.toString()}`);
        setRides(response.data ?? []);
      } catch {
        setRides([]);
      }
    },
    [originLat, originLng, destLat, destLng, date, passengers],
  );

  useEffect(() => {
    setIsLoading(true);
    fetchRides(sort).finally(() => setIsLoading(false));
  }, [sort, fetchRides]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRides(sort);
    setRefreshing(false);
  }, [sort, fetchRides]);

  const handleSortChange = (newSort: SortOption) => {
    if (newSort !== sort) {
      setSort(newSort);
    }
  };

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'departure', label: t('rides.sortDeparture') },
    { key: 'price', label: t('rides.sortPrice') },
    { key: 'rating', label: t('rides.sortRating') },
  ];

  const originShort = originLabel.split(',')[0];
  const destShort = destinationLabel.split(',')[0];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="bg-white border-b border-gray-100 px-4 py-3 flex-row items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-9 h-9 rounded-full items-center justify-center active:bg-gray-100 mr-2"
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {originShort} → {destShort}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {date} · {passengers}{' '}
            {passengers === 1 ? t('search.passenger') : t('search.passengers')}
          </Text>
        </View>

        <Pressable
          className="w-9 h-9 rounded-full items-center justify-center active:bg-gray-100"
        >
          <Ionicons name="options-outline" size={22} color="#111827" />
        </Pressable>
      </View>

      {/* Sort bar */}
      <View className="bg-white border-b border-gray-100 px-4 py-2 flex-row gap-2">
        {sortOptions.map(({ key, label }) => {
          const isActive = sort === key;
          return (
            <Pressable
              key={key}
              onPress={() => handleSortChange(key)}
              className={`px-4 py-1.5 rounded-chip border ${
                isActive
                  ? 'bg-primary-50 border-primary-300'
                  : 'bg-white border-gray-200 active:bg-gray-50'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? 'text-primary-700' : 'text-gray-600'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#008B8B" />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={(rideId) => navigation.navigate('RideDetail', { rideId })}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 16),
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <EmptyState
              title={t('rides.noRidesFound')}
              subtitle={t('rides.noRidesFoundSubtitle')}
            />
          }
        />
      )}
    </View>
  );
}
