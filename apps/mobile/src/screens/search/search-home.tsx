import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/ui';

export default function SearchHomeScreen() {
  const { t } = useTranslation();

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
        <Pressable className="flex-row items-center h-14 border-b border-gray-100">
          <Text className="text-sm text-primary-600 font-bold mr-3">●</Text>
          <Text className="text-base text-gray-400">{t('search.leavingFrom')}</Text>
        </Pressable>

        {/* Destination */}
        <Pressable className="flex-row items-center h-14 border-b border-gray-100">
          <Text className="text-sm text-primary-600 font-bold mr-3">●</Text>
          <Text className="text-base text-gray-400">{t('search.goingTo')}</Text>
        </Pressable>

        {/* Date + Passengers row */}
        <View className="flex-row items-center h-14">
          <Pressable className="flex-1 flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">📅</Text>
            <Text className="text-base text-gray-400">{t('search.today')}</Text>
          </Pressable>
          <View className="w-px h-8 bg-gray-200" />
          <Pressable className="flex-1 flex-row items-center justify-center">
            <Text className="text-base text-gray-400">1 {t('search.passenger')}</Text>
          </Pressable>
        </View>
      </View>

      {/* Search Button */}
      <View className="mt-4">
        <Button
          label={t('search.searchButton')}
          onPress={() => {}}
          fullWidth
        />
      </View>

      {/* Recent Searches placeholder */}
      <View className="mt-8">
        <Text className="text-base font-semibold text-gray-800 mb-3">
          {t('search.recentSearches')}
        </Text>
        <Text className="text-sm text-gray-400">{t('search.noRecentSearches')}</Text>
      </View>
    </ScreenWrapper>
  );
}
