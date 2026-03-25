import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainNavigatorParamList } from './types';

import MainTabs from './main-tabs';
import LocationPickerScreen from '../screens/search/location-picker';

const Stack = createNativeStackNavigator<MainNavigatorParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
      {/* Root-level modals: ReportUser, AddStop, VehicleSelect — added in later milestones */}
    </Stack.Navigator>
  );
}
