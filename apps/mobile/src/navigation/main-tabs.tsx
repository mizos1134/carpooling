import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { MainTabParamList } from './types';

import SearchStack from './search-stack';
import PublishStack from './publish-stack';
import YourRidesStack from './your-rides-stack';
import InboxStack from './inbox-stack';
import ProfileStack from './profile-stack';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Simple text-based tab icon (replace with proper icons in polish phase) */
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      className={`text-lg ${focused ? 'text-primary-600' : 'text-gray-400'}`}
    >
      {label}
    </Text>
  );
}

export default function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingBottom: 6, paddingTop: 6, height: 56 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#008B8B',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          tabBarLabel: t('tabs.search'),
          tabBarIcon: ({ focused }) => <TabIcon label="🔍" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PublishTab"
        component={PublishStack}
        options={{
          tabBarLabel: t('tabs.publish'),
          tabBarIcon: ({ focused }) => <TabIcon label="＋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="YourRidesTab"
        component={YourRidesStack}
        options={{
          tabBarLabel: t('tabs.yourRides'),
          tabBarIcon: ({ focused }) => <TabIcon label="🚗" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxStack}
        options={{
          tabBarLabel: t('tabs.inbox'),
          tabBarIcon: ({ focused }) => <TabIcon label="💬" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
