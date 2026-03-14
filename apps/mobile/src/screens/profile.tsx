import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema, type UpdateProfileDto } from '@carpooling/shared';
import { useAuthStore, type AuthUser } from '../store/auth';
import { api } from '../services/api';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
] as const;

const LANGUAGE_OPTIONS = [
  { label: 'Fran\u00e7ais', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', value: 'ar' },
] as const;

export default function ProfileScreen() {
  const { user, setUser, logout } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<UpdateProfileDto>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      bio: user?.bio ?? '',
      city: user?.city ?? '',
      gender: (user?.gender as UpdateProfileDto['gender']) ?? null,
      preferredLanguage: (user?.preferredLanguage as UpdateProfileDto['preferredLanguage']) ?? 'fr',
    },
  });

  const onSubmit = async (data: UpdateProfileDto) => {
    setIsSaving(true);
    try {
      const updated = await api.put<AuthUser>('/users/me', data);
      setUser(updated);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>Profile</Text>
      <Text style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>{user?.phone}</Text>

      {/* First Name */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6 }}>First name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={inputStyle(!!errors.firstName)}
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
          />
        )}
      />
      {errors.firstName && <Text style={errorStyle}>{errors.firstName.message}</Text>}

      {/* Last Name */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 16 }}>Last name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={inputStyle(!!errors.lastName)}
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
          />
        )}
      />
      {errors.lastName && <Text style={errorStyle}>{errors.lastName.message}</Text>}

      {/* Bio */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 16 }}>Bio</Text>
      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[inputStyle(!!errors.bio), { height: 80, textAlignVertical: 'top' }]}
            placeholder="Tell others about yourself"
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
          />
        )}
      />

      {/* City */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 16 }}>City</Text>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={inputStyle(!!errors.city)}
            placeholder="Your city"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
          />
        )}
      />

      {/* Gender */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 16 }}>Gender</Text>
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onChange(value === option.value ? null : option.value)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: value === option.value ? '#000' : '#d1d5db',
                  backgroundColor: value === option.value ? '#000' : '#fff',
                }}
              >
                <Text style={{ color: value === option.value ? '#fff' : '#374151', fontSize: 13 }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      {/* Language */}
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 16 }}>Language</Text>
      <Controller
        control={control}
        name="preferredLanguage"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onChange(option.value)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: value === option.value ? '#000' : '#d1d5db',
                  backgroundColor: value === option.value ? '#000' : '#fff',
                }}
              >
                <Text style={{ color: value === option.value ? '#fff' : '#374151', fontSize: 13 }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving || !isDirty}
        style={{
          backgroundColor: '#000',
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
          marginTop: 24,
          opacity: isSaving || !isDirty ? 0.5 : 1,
        }}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={logout}
        style={{
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
          marginTop: 12,
          borderWidth: 1,
          borderColor: '#ef4444',
        }}
      >
        <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '600' }}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const inputStyle = (hasError: boolean) => ({
  borderWidth: 1,
  borderColor: hasError ? '#ef4444' : '#d1d5db',
  borderRadius: 8,
  padding: 14,
  fontSize: 16,
});

const errorStyle = { color: '#ef4444', fontSize: 13, marginTop: 4 };
