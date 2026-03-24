import { Text } from 'react-native';
import { ScreenWrapper } from '../../components/layout';

export default function YourRidesScreen() {
  return (
    <ScreenWrapper className="items-center justify-center">
      <Text className="text-lg text-gray-400">Your rides</Text>
      <Text className="text-sm text-gray-300 mt-1">Coming in M7</Text>
    </ScreenWrapper>
  );
}
