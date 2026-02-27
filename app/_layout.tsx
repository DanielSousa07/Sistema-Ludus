import { AuthProvider } from "@/src/contexts/AuthContext";
import { FilterProvider } from "@/src/contexts/FiltersContext";
import { setRouter } from "@/src/services/navigation";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Importação necessária
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return (
    // Adicione o GestureHandlerRootView como o pai mais externo
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FilterProvider>
            <StatusBar style="light" backgroundColor="transparent" translucent />
            <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="home" />
              <Stack.Screen name="admin/manage" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="verify" />
              <Stack.Screen name="favorites" />
              
            </Stack>
          </FilterProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}