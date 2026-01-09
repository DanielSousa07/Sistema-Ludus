import { AuthProvider } from '@/src/contexts/AuthContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}/>
    </AuthProvider>
  )
}