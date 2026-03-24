import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { InboxStackParamList } from './types';

import InboxListScreen from '../screens/inbox/inbox-list';

const Stack = createNativeStackNavigator<InboxStackParamList>();

export default function InboxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InboxList" component={InboxListScreen} />
      {/* ChatThread, PublicProfile — added in M8 */}
    </Stack.Navigator>
  );
}
