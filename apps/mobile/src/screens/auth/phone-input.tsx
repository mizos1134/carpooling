import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendOtpSchema, type SendOtpDto } from '@carpooling/shared';
import { useAuthStore } from '../../store/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/auth-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneInput'>;

export default function PhoneInputScreen({ navigation }: Props) {
  const { sendOtp, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<SendOtpDto>({
    resolver: zodResolver(SendOtpSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: SendOtpDto) => {
    try {
      await sendOtp(data.phone);
      navigation.navigate('OtpVerify', { phone: data.phone });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Welcome</Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
        Enter your phone number to get started
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>Phone number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.phone ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              padding: 14,
              fontSize: 18,
              marginBottom: 4,
            }}
            placeholder="+212 6XX XXX XXX"
            keyboardType="phone-pad"
            autoFocus
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.phone && (
        <Text style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{errors.phone.message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        style={{
          backgroundColor: '#000',
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
          marginTop: 16,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
