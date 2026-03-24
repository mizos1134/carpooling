import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainNavigatorParamList } from './types';

import MainTabs from './main-tabs';

const Stack = createNativeStackNavigator<MainNavigatorParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* Root-level modals (shared across tabs):
          LocationPicker, ReportUser, AddStop, VehicleSelect — added in later milestones */}
    </Stack.Navigator>
  );
}
