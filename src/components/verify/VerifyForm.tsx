import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { api } from "@/src/services/api";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";
import VerifyBackground from "./VerifyBackground";
import VerifyHero from "./VerifyHero";
export default function VerifyForm() {

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (
    type: "error" | "success" | "info",
    title: string,
    message: string
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const router = useRouter();

  const { phone } = useLocalSearchParams();
  const phoneStr = Array.isArray(phone) ? phone[0] : phone;

  if (!phoneStr) {
    showAlert("error", "Erro", "Telefone não encontrado. Volte e tente novamente.");
    return;
  }

  const [loading, setLoaging] = useState(false);

  const [renderHero, setRenderHero] = useState(true);

  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScaleY = useRef(new Animated.Value(1)).current;

  const OTP_LENGTH = 6;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleConfirm = async () => {
    const fullCode = otp.join("")

    if (fullCode.length < 6) {
      return showAlert("info", "Código incompleto", "Por favor, preencha os 6 dígitos")
    }
    setLoaging(true);
    try {
      await api.post("/auth/verify-phone", {
        phone: phoneStr,
        code: fullCode
      });

      showAlert("success", "Level concluído 🎉", "Conta verificada com sucesso!")
      router.replace("/home")
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao verificar código."
      showAlert("error", "Erro", message)
    } finally {
      setLoaging(false)
    }
  }

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setRenderHero(true);
      heroOpacity.setValue(1);
      heroScaleY.setValue(1);

      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heroScaleY, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setRenderHero(false);
      });
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setRenderHero(true);

      heroOpacity.setValue(0);
      heroScaleY.setValue(0);

      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(heroScaleY, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [heroOpacity, heroScaleY]);


  const Wrapper: any = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const wrapperProps =
    Platform.OS === "ios"
      ? {
        behavior: "padding" as const,
        keyboardVerticalOffset: 0,
      }
      : {};

  const focusIndex = (i: number) => {
    if (i < 0 || i >= OTP_LENGTH) return;
    inputsRef.current[i]?.focus();
  };

  const setOtpFromString = (raw: string, startIndex = 0) => {
    const digits = (raw || "").replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex);
    if (!digits.length) return;

    setOtp((prev) => {
      const next = [...prev];
      for (let k = 0; k < digits.length; k++) {
        next[startIndex + k] = digits[k];
      }
      return next;
    });

    const nextFocus = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    focusIndex(nextFocus);
  };

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");


    if (digits.length > 1) {

      setOtpFromString(digits, index);
      return;
    }


    const digit = digits.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key !== "Backspace") return;


    if (otp[index]) return;


    if (index > 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      focusIndex(index - 1);
    }
  };


  return (
    <View style={styles.container}>
      <VerifyBackground />

      <Wrapper style={{ flex: 1 }} {...wrapperProps}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={{ flex: 1, paddingTop: 100 }}>
            <View style={styles.card}>
              {renderHero && (
                <Animated.View
                  style={{
                    opacity: heroOpacity,
                    transform: [{ scaleY: heroScaleY }],
                    overflow: "hidden",
                  }}
                >
                  <VerifyHero />
                </Animated.View>
              )}

              <Text style={styles.title}>
                Verifique seu número com o código recebido via mensagem de SMS.
              </Text>

              <View style={styles.otpContainer}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(r) => {
                      inputsRef.current[index] = r;
                    }}

                    style={styles.input}
                    value={otp[index]}
                    maxLength={Platform.OS === "ios" ? 1 : 6}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    returnKeyType="done"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="oneTimeCode"
                    importantForAutofill="yes"
                    onChangeText={(t) => handleChange(t, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}


                  />
                ))}
              </View>


              <Text style={styles.resend}>Você não recebeu o SMS?</Text>
              <Text style={styles.resendBold}>REENVIAR SMS</Text>

              <View style={{ flexGrow: 1 }} />

              <Pressable style={
                [styles.button, loading && { opacity: 0.7 }]}
                onPress={handleConfirm}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "Processando..." : "Confirmar"}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
