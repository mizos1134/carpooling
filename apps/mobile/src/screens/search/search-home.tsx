import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/layout';
import { RecentSearchCard } from '../../components/cards';
import { useRideStore } from '../../store/rides';
import type { MainNavigatorParamList, SearchStackParamList } from '../../navigation/types';
import { CompositeNavigationProp } from '@react-navigation/native';

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParamList, 'SearchHome'>,
  NativeStackNavigationProp<MainNavigatorParamList>
>;

export default function SearchHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavProp>();
  const { searchParams, recentSearches, swapLocations } = useRideStore();

  const openLocationPicker = (fieldKey: 'origin' | 'destination') => {
    navigation.navigate('LocationPicker', { fieldKey });
  };

  const handleSearch = () => {
    if (!searchParams.origin || !searchParams.destination) return;
    navigation.navigate('SearchResults', {
      originLabel: searchParams.origin.label,
      destinationLabel: searchParams.destination.label,
      originLat: searchParams.origin.lat,
      originLng: searchParams.origin.lng,
      destLat: searchParams.destination.lat,
      destLng: searchParams.destination.lng,
      date: searchParams.date,
      passengers: searchParams.passengers,
    });
  };

  const isSearchReady = searchParams.origin && searchParams.destination;

  return (
    <ScreenWrapper scroll className="bg-gray-50" safeAreaClassName="bg-gray-50">
      {/* Hero header */}
      <View className="pt-14 pb-8">
        <Text className="text-3xl font-bold text-gray-900 leading-tight">
          {t('search.heroLine1')}
        </Text>
        <Text className="text-3xl font-bold text-primary-600 leading-tight mt-1">
          {t('search.heroLine2')}
        </Text>
        <Text className="text-base text-gray-500 mt-3">
          {t('search.heroSubtitle')}
        </Text>
      </View>

      {/* Unified Search Card */}
      <View className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Origin row */}
        <Pressable
          onPress={() => openLocationPicker('origin')}
          className="flex-row items-center px-4 h-16 active:bg-gray-50"
        >
          <View className="w-5 items-center mr-4">
            <View className="w-3 h-3 rounded-full border-2 border-primary-500" />
          </View>
          <Text
            className={`text-base flex-1 ${searchParams.origin ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
            numberOfLines={1}
          >
            {searchParams.origin?.label ?? t('search.leavingFrom')}
          </Text>
        </Pressable>

        {/* Divider with swap */}
        <View className="flex-row items-center px-4">
          <View className="w-5 items-center mr-4">
            <View className="w-px h-4 bg-gray-200" />
          </View>
          <View className="flex-1 h-px bg-gray-100" />
          <Pressable
            onPress={swapLocations}
            className="ml-3 w-9 h-9 rounded-full bg-gray-50 border border-gray-200 items-center justify-center"
          >
            <Ionicons name="swap-vertical" size={18} color="#6B7280" />
          </Pressable>
        </View>

        {/* Destination row */}
        <Pressable
          onPress={() => openLocationPicker('destination')}
          className="flex-row items-center px-4 h-16 active:bg-gray-50"
        >
          <View className="w-5 items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-primary-600" />
          </View>
          <Text
            className={`text-base flex-1 ${searchParams.destination ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
            numberOfLines={1}
          >
            {searchParams.destination?.label ?? t('search.goingTo')}
          </Text>
        </Pressable>

        {/* Separator */}
        <View className="mx-4 h-px bg-gray-100" />

        {/* Date row */}
        <Pressable className="flex-row items-center px-4 h-14 active:bg-gray-50">
          <View className="w-5 items-center mr-4">
            <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
          </View>
          <Text className="text-base text-gray-500">{t('search.today')}</Text>
        </Pressable>

        {/* Separator */}
        <View className="mx-4 h-px bg-gray-100" />

        {/* Passengers row */}
        <Pressable className="flex-row items-center px-4 h-14 active:bg-gray-50">
          <View className="w-5 items-center mr-4">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
          </View>
          <Text className="text-base text-gray-500">
            {searchParams.passengers} {searchParams.passengers === 1 ? t('search.passenger') : t('search.passengers')}
          </Text>
        </Pressable>

        {/* Search Button — flush inside card */}
        <Pressable
          onPress={handleSearch}
          disabled={!isSearchReady}
          className={`
            h-14 items-center justify-center mx-4 mb-4 mt-2 rounded-xl
            ${isSearchReady ? 'bg-primary-600 active:bg-primary-700' : 'bg-primary-200'}
          `}
        >
          <Text className="text-white text-base font-bold">
            {t('search.searchButton')}
          </Text>
        </Pressable>
      </View>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View className="mt-8">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            {t('search.recentSearches')}
          </Text>
          {recentSearches.map((search) => (
            <RecentSearchCard
              key={search.id}
              search={search}
              onPress={(s) => {
                useRideStore.getState().setOrigin({
                  label: s.originLabel,
                  lat: s.origin.lat,
                  lng: s.origin.lng,
                });
                useRideStore.getState().setDestination({
                  label: s.destinationLabel,
                  lat: s.destination.lat,
                  lng: s.destination.lng,
                });
              }}
            />
          ))}
        </View>
      )}

      {/* Bottom spacing */}
      <View className="h-8" />
    </ScreenWrapper>
  );
}
