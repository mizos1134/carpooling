import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PublishStackParamList } from './types';

import PublishRideScreen from '../screens/publish/publish-ride';

const Stack = createNativeStackNavigator<PublishStackParamList>();

export default function PublishStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PublishRide" component={PublishRideScreen} />
    </Stack.Navigator>
  );
}
