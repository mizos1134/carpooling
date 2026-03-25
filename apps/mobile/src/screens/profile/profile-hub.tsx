import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth';
import { ScreenWrapper } from '../../components/layout';
import { Avatar, Divider } from '../../components/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHub'>;

interface MenuItemProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ label, onPress, destructive = false }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4 active:bg-gray-50"
    >
      <Text className={`text-base ${destructive ? 'text-danger-500' : 'text-gray-900'}`}>
        {label}
      </Text>
      {!destructive && <Text className="text-gray-400 text-lg">›</Text>}
    </Pressable>
  );
}

export default function ProfileHubScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || t('profile.unnamed');

  return (
    <ScreenWrapper scroll>
      {/* Header */}
      <View className="items-center pt-6 pb-4">
        <Avatar uri={user?.avatarUrl} name={fullName} size="lg" />
        <Text className="text-xl font-bold text-gray-900 mt-3">{fullName}</Text>
        {user?.city && (
          <Text className="text-sm text-gray-500 mt-1">{user.city}</Text>
        )}
      </View>

      <Divider className="my-2" />

      {/* Account section */}
      <Text className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1">
        {t('profile.account')}
      </Text>
      <MenuItem
        label={t('profile.editProfile')}
        onPress={() => navigation.navigate('EditProfile')}
      />
      <MenuItem
        label={t('profile.driverProfile')}
        onPress={() => navigation.navigate('DriverSetup')}
      />
      <MenuItem
        label={t('profile.myVehicles')}
        onPress={() => navigation.navigate('VehicleList')}
      />

      <Divider className="my-2" />

      {/* Activity section */}
      <Text className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1">
        {t('profile.activity')}
      </Text>
      <MenuItem
        label={t('profile.myReviews')}
        onPress={() => navigation.navigate('MyReviews')}
      />

      <Divider className="my-2" />

      {/* Settings section */}
      <Text className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1">
        {t('profile.settings')}
      </Text>
      <MenuItem
        label={t('profile.settingsPage')}
        onPress={() => navigation.navigate('Settings')}
      />

      <Divider className="my-2" />

      <MenuItem
        label={t('profile.logout')}
        onPress={logout}
        destructive
      />

      <View className="py-6 items-center">
        <Text className="text-xs text-gray-300">v1.0.0</Text>
      </View>
    </ScreenWrapper>
  );
}
