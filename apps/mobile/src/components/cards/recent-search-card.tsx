import { Pressable, Text, View } from 'react-native';
import type { RecentSearch } from '../../store/rides';

interface RecentSearchCardProps {
  search: RecentSearch;
  onPress: (search: RecentSearch) => void;
}

export default function RecentSearchCard({ search, onPress }: RecentSearchCardProps) {
  return (
    <Pressable
      onPress={() => onPress(search)}
      className="flex-row items-center py-3 px-1 active:bg-gray-50"
    >
      <Text className="text-gray-400 mr-3">🕐</Text>
      <View className="flex-1">
        <Text className="text-base text-gray-900">
          {search.originLabel}
          <Text className="text-gray-400"> → </Text>
          {search.destinationLabel}
        </Text>
      </View>
    </Pressable>
  );
}
