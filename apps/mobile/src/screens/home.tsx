import { View, Text } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Home</Text>
      <Text style={{ fontSize: 16, color: '#666' }}>
        Welcome{user?.firstName ? `, ${user.firstName}` : ''}!
      </Text>
      <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
        Rides and search will appear here in M5-M6.
      </Text>
    </View>
  );
}
