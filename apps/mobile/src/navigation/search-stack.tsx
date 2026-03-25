import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SearchStackParamList } from './types';

// Screens
import SearchHomeScreen from '../screens/search/search-home';
import SearchResultsScreen from '../screens/search/search-results';
import RideDetailScreen from '../screens/search/ride-detail';
import BookingConfirmScreen from '../screens/search/booking-confirm';
import BookingSuccessScreen from '../screens/search/booking-success';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchHome" component={SearchHomeScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="RideDetail" component={RideDetailScreen} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}
