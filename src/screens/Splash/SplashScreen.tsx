import SplashBackground from "@/src/components/Splash/SplashBackground";
import { styles } from "@/src/screens/Splash/styles";
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  const fullOpacity = useRef(new Animated.Value(1)).current;
  const fullScale = useRef(new Animated.Value(1)).current;
  const diceOpacity = useRef(new Animated.Value(0)).current;
  const diceScale = useRef(new Animated.Value(0.75)).current;

  // 👉 Esconde o splash NATIVO quando o layout estiver pronto
  const onLayoutRootView = useCallback(async () => {
    if (!appReady) {
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    Animated.sequence([
      Animated.delay(600),

      Animated.parallel([
        Animated.timing(fullOpacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fullScale, {
          toValue: 0.92,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(diceOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(diceScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        router.replace('/onboarding');
      }, 600);
    });
  }, [appReady]);

  return (
    
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SplashBackground/> 
      <Animated.Image
        source={require('@/assets/logo-full.png')}
        style={[
          styles.logoFull,
          { opacity: fullOpacity, transform: [{ scale: fullScale }] },
        ]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require('@/assets/logo-dice.png')}
        style={[
          styles.logoDice,
          {
            position: 'absolute',
            opacity: diceOpacity,
            transform: [{ scale: diceScale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}
