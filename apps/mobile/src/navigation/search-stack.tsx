import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SearchStackParamList } from './types';

// Screens
import SearchHomeScreen from '../screens/search/search-home';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchHome" component={SearchHomeScreen} />
      {/* SearchResults, RideDetail, BookingConfirm, BookingSuccess, PublicProfile — added in M5 */}
    </Stack.Navigator>
  );
}
