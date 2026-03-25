import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StickyBottomBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function StickyBottomBar({ children, className = '' }: StickyBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`bg-white border-t border-gray-200 px-screen-x pt-3 ${className}`}
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {children}
    </View>
  );
}
