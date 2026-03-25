import { Pressable, Text, View } from 'react-native';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export default function SegmentedControl({
  segments,
  selectedIndex,
  onSelect,
  className = '',
}: SegmentedControlProps) {
  return (
    <View className={`flex-row bg-gray-100 rounded-button p-1 ${className}`}>
      {segments.map((label, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onSelect(index)}
            className={`
              flex-1 items-center justify-center py-2 rounded-md
              ${isSelected ? 'bg-white shadow-sm' : ''}
            `}
          >
            <Text
              className={`
                text-sm font-medium
                ${isSelected ? 'text-gray-900' : 'text-gray-500'}
              `}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
