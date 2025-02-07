import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/settings" options={{ presentation: 'modal', headerShown: false, headerTitle: 'Settings' }} />
        <Stack.Screen 
          name="(modals)/help" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
            headerTitle: 'Help & Support'
          }} />
          <Stack.Screen 
          name="(modals)/edit-profile" 
          options={{ 
            presentation: 'modal',
            headerShown: false
          }} 
        />

        <Stack.Screen 
          name="(modals)/change-password" 
          options={{ 
            presentation: 'modal',
            headerShown: false
          }} 
        />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
