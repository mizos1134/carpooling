import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  safeAreaClassName?: string;
}

export default function ScreenWrapper({
  children,
  scroll = false,
  className = '',
  safeAreaClassName = 'bg-white',
}: ScreenWrapperProps) {
  const content = (
    <View className={`flex-1 px-screen-x ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView className={`flex-1 ${safeAreaClassName}`} edges={['top']}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
