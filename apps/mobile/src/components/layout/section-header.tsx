import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function SectionHeader({
  title,
  actionLabel,
  onAction,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between mb-3 ${className}`}>
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction}>
          <Text className="text-sm font-medium text-primary-600">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
