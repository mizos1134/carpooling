import { Switch, Text, View } from 'react-native';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  className?: string;
}

export default function ToggleSwitch({
  label,
  value,
  onValueChange,
  description,
  className = '',
}: ToggleSwitchProps) {
  return (
    <View className={`flex-row items-center justify-between py-3 ${className}`}>
      <View className="flex-1 mr-3">
        <Text className="text-base text-gray-900">{label}</Text>
        {description && (
          <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#00A8A8' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
