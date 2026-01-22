import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect } from "expo-router";
import SplashScreen from "../src/screens/Splash/SplashScreen";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }


  if (user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/onboarding" />;
}