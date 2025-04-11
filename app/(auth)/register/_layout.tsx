// app/(auth)/register/_layout.tsx
import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Registration' }} />
      <Stack.Screen name="step1" options={{ title: 'Personal Info' }} />
      <Stack.Screen name="step2" options={{ title: 'Email Verification' }} />
      <Stack.Screen name="step3" options={{ title: 'Bio' }} />
      <Stack.Screen name="step4" options={{ title: 'Create Password' }} />
    </Stack>
  );
}