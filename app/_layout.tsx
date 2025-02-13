import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/app/context/auth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
 const segments = useSegments();
 const router = useRouter();

//  useEffect(() => {
//    const inAuthGroup = segments[0] === '(auth)';
   
//    if (!isAuthenticated && !inAuthGroup) {
//      router.replace('/(auth)/login');
//    } else if (isAuthenticated && !hasJoinedHouse && segments[0] !== 'orientation') {
//      router.replace('/orientation');
//    } else if (isAuthenticated && hasJoinedHouse && inAuthGroup) {
//      router.replace('/(tabs)');
//    }
//  }, [isAuthenticated, hasJoinedHouse, segments]);

 const { token } = useAuthStore();
console.log("===================Token =======================",token);

useEffect(() => {
if (token === null) {
  router.replace('/(auth)/login');
}else{
  router.replace('/(tabs)');
}
}, [token]);  

 return (
   
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

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
 const queryClient = new QueryClient();
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
  <QueryClientProvider client={queryClient}>
   <AuthProvider>
     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <RootLayoutNav />
       <StatusBar style="auto" />
     </ThemeProvider>
   </AuthProvider>
  </QueryClientProvider>
 );
}