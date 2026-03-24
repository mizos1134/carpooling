import { ActivityIndicator, View } from 'react-native';

interface LoadingScreenProps {
  className?: string;
}

export default function LoadingScreen({ className = '' }: LoadingScreenProps) {
  return (
    <View className={`flex-1 items-center justify-center bg-white ${className}`}>
      <ActivityIndicator size="large" color="#008B8B" />
    </View>
  );
}
