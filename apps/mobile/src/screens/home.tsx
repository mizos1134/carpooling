import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Home</Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
        Welcome{user?.firstName ? `, ${user.firstName}` : ''}! You are logged in.
      </Text>
      <Text style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
        Phone: {user?.phone}
      </Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#ef4444',
          borderRadius: 8,
          padding: 16,
          paddingHorizontal: 32,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
