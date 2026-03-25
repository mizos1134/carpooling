import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { YourRidesStackParamList } from './types';

import YourRidesScreen from '../screens/rides/your-rides';

const Stack = createNativeStackNavigator<YourRidesStackParamList>();

export default function YourRidesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="YourRides" component={YourRidesScreen} />
      {/* PassengerBookingDetail, DriverRideDetail, ManageBooking, LeaveReview, ChatThread — added in M7 */}
    </Stack.Navigator>
  );
}
