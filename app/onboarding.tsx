import { OnboardingBackground } from "@/src/components/Onboarding/OnboardingBackground";
import { OnboardingCTA } from "@/src/components/Onboarding/OnboardingCTA";
import { OnboardingHero } from "@/src/components/Onboarding/OnboardingHero";
import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect } from "expo-router";
import { View } from "react-native";
export default function Onboarding() {
  const {user, isLoading} = useAuth()

  if(isLoading) return null 

  if (user) {
    return <Redirect href="/home"/>
  }
  return (
    
      <View style={{flex: 1}}>
        <OnboardingBackground/>
        <OnboardingHero/>
        <OnboardingCTA/>
      </View>

  )
}