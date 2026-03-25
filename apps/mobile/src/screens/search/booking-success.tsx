import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SearchStackParamList, 'BookingSuccess'>;

export default function BookingSuccessScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleBackToSearch = () => {
    navigation.popToTop();
  };

  return (
    <View
      className="flex-1 bg-white items-center justify-center px-screen-x"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Success icon */}
      <View className="w-24 h-24 rounded-full bg-success-50 items-center justify-center mb-6">
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
        {t('booking.successTitle')}
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-gray-500 text-center mb-10 leading-relaxed px-4">
        {t('booking.successSubtitle')}
      </Text>

      {/* View booking button (outline, placeholder) */}
      <Pressable
        className="w-full h-12 border border-gray-300 rounded-button items-center justify-center mb-3 active:bg-gray-50"
      >
        <Text className="text-base font-semibold text-gray-800">
          {t('booking.viewBooking')}
        </Text>
      </Pressable>

      {/* Back to search button (ghost) */}
      <Pressable
        onPress={handleBackToSearch}
        className="w-full h-12 rounded-button items-center justify-center active:bg-gray-100"
      >
        <Text className="text-base font-medium text-gray-600">
          {t('booking.backToSearch')}
        </Text>
      </Pressable>
    </View>
  );
}
