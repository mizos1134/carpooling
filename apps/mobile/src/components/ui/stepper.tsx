import { Pressable, Text, View } from 'react-native';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
  className?: string;
}

export default function Stepper({
  value,
  min = 1,
  max = 8,
  onValueChange,
  className = '',
}: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View className={`flex-row items-center ${className}`}>
      <Pressable
        onPress={() => canDecrement && onValueChange(value - 1)}
        className={`
          w-10 h-10 rounded-full border border-gray-300 items-center justify-center
          ${canDecrement ? 'bg-white active:bg-gray-50' : 'bg-gray-50 opacity-40'}
        `}
        disabled={!canDecrement}
      >
        <Text className="text-lg font-semibold text-gray-700">−</Text>
      </Pressable>
      <Text className="text-xl font-bold text-gray-900 mx-5 min-w-[24px] text-center">
        {value}
      </Text>
      <Pressable
        onPress={() => canIncrement && onValueChange(value + 1)}
        className={`
          w-10 h-10 rounded-full border border-gray-300 items-center justify-center
          ${canIncrement ? 'bg-white active:bg-gray-50' : 'bg-gray-50 opacity-40'}
        `}
        disabled={!canIncrement}
      >
        <Text className="text-lg font-semibold text-gray-700">+</Text>
      </Pressable>
    </View>
  );
}
