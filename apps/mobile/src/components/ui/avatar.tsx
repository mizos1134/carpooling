import { Image, Text, View } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

const textSizeStyles: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-2xl',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0]?.toUpperCase() ?? '?';
}

export default function Avatar({ uri, name, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizeStyles[size];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${sizeClass} rounded-full ${className}`}
      />
    );
  }

  return (
    <View
      className={`${sizeClass} rounded-full bg-primary-100 items-center justify-center ${className}`}
    >
      <Text className={`${textSizeStyles[size]} font-semibold text-primary-700`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
