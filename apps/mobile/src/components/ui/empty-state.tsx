import { Text, View } from 'react-native';
import Button from './button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`flex-1 items-center justify-center px-screen-x py-12 ${className}`}>
      <Text className="text-lg font-semibold text-gray-800 text-center">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 text-center mt-2">{subtitle}</Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-6">
          <Button label={actionLabel} onPress={onAction} variant="outline" size="sm" />
        </View>
      )}
    </View>
  );
}
