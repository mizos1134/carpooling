import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyOtpSchema, type VerifyOtpDto } from '@carpooling/shared';
import { useAuthStore } from '../../store/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/auth-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>;

export default function OtpVerifyScreen({ route }: Props) {
  const { phone } = route.params;
  const { verifyOtp, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<VerifyOtpDto>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { phone, code: '' },
  });

  const onSubmit = async (data: VerifyOtpDto) => {
    try {
      await verifyOtp(data.phone, data.code);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid OTP');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Verify OTP</Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
        Enter the 6-digit code sent to {phone}
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>Code</Text>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.code ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              padding: 14,
              fontSize: 24,
              textAlign: 'center',
              letterSpacing: 8,
              marginBottom: 4,
            }}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.code && (
        <Text style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{errors.code.message}</Text>
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
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Verify</Text>
        )}
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 16, color: '#999', fontSize: 13 }}>
        Dev mode: use code 000000
      </Text>
    </View>
  );
}
