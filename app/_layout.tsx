import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/app/context/auth';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
 const { isAuthenticated, hasJoinedHouse } = useAuth();
 const segments = useSegments();
 const router = useRouter();

 useEffect(() => {
   const inAuthGroup = segments[0] === '(auth)';
   
   if (!isAuthenticated && !inAuthGroup) {
     router.replace('/(auth)/login');
   } else if (isAuthenticated && !hasJoinedHouse && segments[0] !== 'orientation') {
     router.replace('/orientation');
   } else if (isAuthenticated && hasJoinedHouse && inAuthGroup) {
     router.replace('/(tabs)');
   }
 }, [isAuthenticated, hasJoinedHouse, segments]);

 return (
   <Stack>
     <Stack.Screen name="(auth)/login" options={{ headerShown: false, title: '',presentation: 'containedModal'}} />
     <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />

     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     <Stack.Screen name="orientation" options={{ headerShown: false }} />
     <Stack.Screen name="(modals)/settings" options={{ presentation: 'modal', headerShown: false }} />
     <Stack.Screen name="(modals)/help" options={{ presentation: 'modal', headerShown: false }} />
     <Stack.Screen name="(modals)/edit-profile" options={{ presentation: 'modal', headerShown: false }} />
     <Stack.Screen name="(modals)/change-password" options={{ presentation: 'modal', headerShown: false }} />
     <Stack.Screen name="+not-found" />
   </Stack>
 );
}

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

 if (!loaded) return null;

 return (
   <AuthProvider>
     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <RootLayoutNav />
       <StatusBar style="auto" />
     </ThemeProvider>
   </AuthProvider>
 );
}