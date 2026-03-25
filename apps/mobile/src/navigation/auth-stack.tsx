import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneInputScreen from '../screens/auth/phone-input';
import OtpVerifyScreen from '../screens/auth/otp-verify';

export type AuthStackParamList = {
  PhoneInput: undefined;
  OtpVerify: { phone: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
    </Stack.Navigator>
  );
}
