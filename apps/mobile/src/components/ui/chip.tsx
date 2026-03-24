import { Text, View } from 'react-native';

type ChipVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;
}

const variantStyles: Record<ChipVariant, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-700' },
  success: { bg: 'bg-success-50', text: 'text-success-700' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-700' },
  danger: { bg: 'bg-danger-50', text: 'text-danger-700' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-600' },
  info: { bg: 'bg-info-50', text: 'text-info-500' },
};

/** Maps ride/booking status strings to chip variants */
export function statusToVariant(status: string): ChipVariant {
  switch (status) {
    case 'published':
    case 'in_progress':
      return 'primary';
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'cancelled':
      return 'danger';
    case 'completed':
    case 'full':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export default function Chip({ label, variant = 'neutral', className = '' }: ChipProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`self-start px-3 py-1 rounded-chip ${styles.bg} ${className}`}>
      <Text className={`text-xs font-semibold ${styles.text}`}>{label}</Text>
    </View>
  );
}
