import { AuthProvider } from "@/src/contexts/AuthContext";
import { setRouter } from "@/src/services/navigation";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="admin/manage" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="verify" /> 
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
