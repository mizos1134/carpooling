import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from './types';

import ProfileHubScreen from '../screens/profile/profile-hub';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHub" component={ProfileHubScreen} />
      {/* EditProfile, DriverSetup, VehicleList, VehicleForm, MyReviews, Settings — added in M9 */}
    </Stack.Navigator>
  );
}
