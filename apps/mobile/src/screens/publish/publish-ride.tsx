import { Text } from 'react-native';
import { ScreenWrapper } from '../../components/layout';

export default function PublishRideScreen() {
  return (
    <ScreenWrapper className="items-center justify-center">
      <Text className="text-lg text-gray-400">Publish a ride</Text>
      <Text className="text-sm text-gray-300 mt-1">Coming in M6</Text>
    </ScreenWrapper>
  );
}
