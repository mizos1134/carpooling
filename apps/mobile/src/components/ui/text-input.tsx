import { View, Text, TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';

interface TextInputProps extends Omit<RNTextInputProps, 'className'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export default function TextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
      )}
      <View
        className={`
          flex-row items-center border rounded-button px-3 h-14
          ${error ? 'border-danger-500' : 'border-gray-300'}
          ${props.editable === false ? 'bg-gray-50' : 'bg-white'}
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <RNTextInput
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-base text-gray-900"
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-danger-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
