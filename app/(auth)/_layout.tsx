// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false , headerTitle: ''}}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}