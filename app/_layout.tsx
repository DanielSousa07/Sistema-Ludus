import { AuthProvider } from "@/src/contexts/AuthContext";
import { FiltersProvider } from "@/src/contexts/FiltersContext";
import { setRouter } from "@/src/services/navigation";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FiltersProvider>
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
              <Stack.Screen name="search" />
              <Stack.Screen name="filter" />
              <Stack.Screen name="game/[id]" />
              <Stack.Screen name="profile/account" />
            </Stack>
          </FiltersProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}