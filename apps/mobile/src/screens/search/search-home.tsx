import { FlatList, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/layout';
import { Button, Stepper } from '../../components/ui';
import { RecentSearchCard } from '../../components/cards';
import { useRideStore } from '../../store/rides';
import type { MainNavigatorParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<MainNavigatorParamList>;

export default function SearchHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavProp>();
  const { searchParams, recentSearches, setPassengers, swapLocations } = useRideStore();

  const openLocationPicker = (fieldKey: 'origin' | 'destination') => {
    navigation.navigate('LocationPicker', { fieldKey });
  };

  const handleSearch = () => {
    // TODO: Navigate to SearchResults when built in M5
  };

  return (
    <ScreenWrapper scroll>
      <View className="pt-12 pb-6">
        <Text className="text-2xl font-bold text-gray-900">
          {t('search.title')}
        </Text>
      </View>

      {/* Search Card */}
      <View className="bg-white rounded-card border border-gray-200 p-card shadow-sm">
        {/* Origin */}
        <Pressable
          onPress={() => openLocationPicker('origin')}
          className="flex-row items-center h-14 border-b border-gray-100"
        >
          <View className="w-3 h-3 rounded-full bg-primary-500 mr-3" />
          <Text
            className={`text-base flex-1 ${searchParams.origin ? 'text-gray-900' : 'text-gray-400'}`}
          >
            {searchParams.origin?.label ?? t('search.leavingFrom')}
          </Text>
        </Pressable>

        {/* Swap button */}
        <View className="absolute right-4 top-[52px] z-10">
          <Pressable
            onPress={swapLocations}
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
          >
            <Text className="text-sm text-gray-500">⇅</Text>
          </Pressable>
        </View>

        {/* Destination */}
        <Pressable
          onPress={() => openLocationPicker('destination')}
          className="flex-row items-center h-14 border-b border-gray-100"
        >
          <View className="w-3 h-3 rounded-full bg-primary-800 mr-3" />
          <Text
            className={`text-base flex-1 ${searchParams.destination ? 'text-gray-900' : 'text-gray-400'}`}
          >
            {searchParams.destination?.label ?? t('search.goingTo')}
          </Text>
        </Pressable>

        {/* Date + Passengers row */}
        <View className="flex-row items-center h-14">
          <Pressable className="flex-1 flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">📅</Text>
            <Text className="text-base text-gray-600">{t('search.today')}</Text>
          </Pressable>
          <View className="w-px h-8 bg-gray-200" />
          <View className="flex-1 flex-row items-center justify-center">
            <Stepper
              value={searchParams.passengers}
              min={1}
              max={8}
              onValueChange={setPassengers}
            />
          </View>
        </View>
      </View>

      {/* Search Button */}
      <View className="mt-4">
        <Button
          label={t('search.searchButton')}
          onPress={handleSearch}
          fullWidth
          disabled={!searchParams.origin || !searchParams.destination}
        />
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
    </ScreenWrapper>
  );
}
