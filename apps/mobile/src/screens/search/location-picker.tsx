import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainNavigatorParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rides';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MainNavigatorParamList, 'LocationPicker'>;

interface CityItem {
  label: string;
  lat: number;
  lng: number;
}

/** Popular Moroccan cities — will be supplemented by Google Places autocomplete */
const POPULAR_CITIES: CityItem[] = [
  { label: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { label: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { label: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { label: 'Fès', lat: 34.0181, lng: -5.0078 },
  { label: 'Tanger', lat: 35.7595, lng: -5.8340 },
  { label: 'Agadir', lat: 30.4278, lng: -9.5981 },
  { label: 'Meknès', lat: 33.8935, lng: -5.5547 },
  { label: 'Oujda', lat: 34.6814, lng: -1.9086 },
  { label: 'Kénitra', lat: 34.2610, lng: -6.5802 },
  { label: 'Tétouan', lat: 35.5889, lng: -5.3626 },
  { label: 'Settat', lat: 33.0011, lng: -7.6164 },
  { label: 'El Jadida', lat: 33.2316, lng: -8.5007 },
  { label: 'Nador', lat: 35.1681, lng: -2.9335 },
  { label: 'Béni Mellal', lat: 32.3373, lng: -6.3498 },
];

export default function LocationPickerScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { fieldKey } = route.params;
  const [query, setQuery] = useState('');
  const [sameCityError, setSameCityError] = useState(false);
  const { setOrigin, setDestination, searchParams } = useRideStore();

  const filteredCities = query.trim()
    ? POPULAR_CITIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()),
      )
    : POPULAR_CITIES;

  const handleSelect = (city: CityItem) => {
    const oppositeField =
      fieldKey === 'origin' ? searchParams.destination : searchParams.origin;

    if (oppositeField && city.label === oppositeField.label) {
      setSameCityError(true);
      return;
    }

    setSameCityError(false);
    const selection = { label: city.label, lat: city.lat, lng: city.lng };

    if (fieldKey === 'origin') {
      setOrigin(selection);
    } else if (fieldKey === 'destination') {
      setDestination(selection);
    }

    navigation.goBack();
  };

  const renderCity = ({ item }: { item: CityItem }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className="flex-row items-center py-4 px-4 active:bg-gray-50"
    >
      <Text className="text-primary-600 mr-3 text-base">📍</Text>
      <Text className="text-base text-gray-900">{item.label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <Pressable onPress={() => navigation.goBack()} className="mr-3 p-1">
          <Text className="text-2xl text-gray-600">✕</Text>
        </Pressable>
        <TextInput
          autoFocus
          value={query}
          onChangeText={(v) => { setQuery(v); setSameCityError(false); }}
          placeholder={t('locationPicker.searchPlaceholder')}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-base text-gray-900 h-10"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} className="ml-2 p-1">
            <Text className="text-sm text-gray-400">{t('locationPicker.clear')}</Text>
          </Pressable>
        )}
      </View>

      {/* Same-city error banner */}
      {sameCityError && (
        <View className="flex-row items-center px-4 py-3 bg-red-50 border-b border-red-100">
          <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
          <Text className="ml-2 text-sm text-red-600 flex-1">
            {t('locationPicker.sameCityError')}
          </Text>
        </View>
      )}

      {/* Section header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-xs font-semibold text-gray-400 uppercase">
          {query.trim()
            ? t('locationPicker.results')
            : t('locationPicker.popularCities')}
        </Text>
      </View>

      {/* City list */}
      <FlatList
        data={filteredCities}
        renderItem={renderCity}
        keyExtractor={(item) => item.label}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text className="text-gray-400">{t('locationPicker.noResults')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
