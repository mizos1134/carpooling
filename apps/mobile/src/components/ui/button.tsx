import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-gray-100 active:bg-gray-200',
  outline: 'bg-transparent border border-gray-300 active:bg-gray-50',
  destructive: 'bg-danger-500 active:bg-danger-700',
  ghost: 'bg-transparent active:bg-gray-100',
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-800',
  outline: 'text-gray-800',
  destructive: 'text-white',
  ghost: 'text-gray-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-3 rounded-button',
  md: 'py-3.5 px-5 rounded-button',
  lg: 'py-4 px-6 rounded-button',
};

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        flex-row items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#374151'}
        />
      ) : (
        <Text
          className={`
            font-semibold text-center
            ${variantTextStyles[variant]}
            ${sizeTextStyles[size]}
          `}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
