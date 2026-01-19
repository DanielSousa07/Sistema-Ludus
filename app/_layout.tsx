import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MySplashScreen from "../src/screens/Splash/SplashScreen";


function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  console.log("LAYOUT CHECK:", { isLoading, hasUser: !!user });

  if (isLoading) {
    return <MySplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
  
        <Stack.Screen name="home" />
      ) : (

        <Stack.Screen name="onboarding" />
      )}
    </Stack>
  );
}


export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}