import { OnboardingBackground } from "@/src/components/Onboarding/OnboardingBackground";
import { OnboardingCTA } from "@/src/components/Onboarding/OnboardingCTA";
import { OnboardingHero } from "@/src/components/Onboarding/OnboardingHero";
import { View } from "react-native";

export default function Onboarding() {
  return (
    <View style={{flex: 1}}>
      <OnboardingBackground/>
      <OnboardingHero/>
      <OnboardingCTA/>
    </View>
  )
}