import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';

import SearchStack from './search-stack';
import PublishStack from './publish-stack';
import YourRidesStack from './your-rides-stack';
import InboxStack from './inbox-stack';
import ProfileStack from './profile-stack';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconConfig {
  active: IoniconsName;
  inactive: IoniconsName;
}

const TAB_ICONS: Record<string, TabIconConfig> = {
  SearchTab: { active: 'search', inactive: 'search-outline' },
  PublishTab: { active: 'add-circle', inactive: 'add-circle-outline' },
  YourRidesTab: { active: 'car', inactive: 'car-outline' },
  InboxTab: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  ProfileTab: { active: 'person', inactive: 'person-outline' },
};

function TabBarIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  const config = TAB_ICONS[routeName];
  const iconName = focused ? config.active : config.inactive;

  if (focused) {
    return (
      <View className="bg-primary-50 rounded-full px-4 py-1.5 items-center justify-center">
        <Ionicons name={iconName} size={22} color="#008B8B" />
      </View>
    );
  }

  return <Ionicons name={iconName} size={22} color="#9CA3AF" />;
}

export default function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 8,
          height: 64,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarActiveTintColor: '#008B8B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon routeName={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ tabBarLabel: t('tabs.search') }}
      />
      <Tab.Screen
        name="PublishTab"
        component={PublishStack}
        options={{ tabBarLabel: t('tabs.publish') }}
      />
      <Tab.Screen
        name="YourRidesTab"
        component={YourRidesStack}
        options={{ tabBarLabel: t('tabs.yourRides') }}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxStack}
        options={{ tabBarLabel: t('tabs.inbox') }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}
