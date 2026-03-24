import { Text, View } from 'react-native';

interface BadgeProps {
  count: number;
  className?: string;
}

export default function Badge({ count, className = '' }: BadgeProps) {
  if (count <= 0) return null;

  const display = count > 99 ? '99+' : String(count);

  return (
    <View
      className={`bg-danger-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 ${className}`}
    >
      <Text className="text-white text-[10px] font-bold">{display}</Text>
    </View>
  );
}
