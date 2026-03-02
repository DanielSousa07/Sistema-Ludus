import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useRef, useState } from "react";
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

type AlertType = "error" | "success" | "info";

export default function VerifyForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const emailParam = Array.isArray(params.email)
    ? params.email[0]
    : (params.email as string | undefined);

  const phoneParam = Array.isArray(params.phone)
    ? params.phone[0]
    : (params.phone as string | undefined);

  const [method, setMethod] = useState<"email" | "sms">("email");

  const email = useMemo(() => (emailParam || "").trim().toLowerCase(), [emailParam]);
  const phone = useMemo(() => (phoneParam || "").trim(), [phoneParam]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const [loading, setLoading] = useState(false);

  
  const [renderHero, setRenderHero] = useState(true);
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScaleY = useRef(new Animated.Value(1)).current;

  
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);

  // resend timer
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  
useEffect(() => {
  
  if (email) {
    setMethod("email");
    return;
  }
  if (phone) {
    setMethod("sms");
    return;
  }

  showAlert("error", "Erro", "Não foi possível identificar e-mail/telefone. Faça login novamente.");
}, [email, phone]);
  

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setRenderHero(true);
      heroOpacity.setValue(1);
      heroScaleY.setValue(1);

      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(heroScaleY, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start(({ finished }) => finished && setRenderHero(false));
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setRenderHero(true);
      heroOpacity.setValue(0);
      heroScaleY.setValue(0);

      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(heroScaleY, { toValue: 1, duration: 220, useNativeDriver: true }),
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
      ? { behavior: "padding" as const, keyboardVerticalOffset: 0 }
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
      for (let k = 0; k < digits.length; k++) next[startIndex + k] = digits[k];
      return next;
    });

    const nextFocus = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    focusIndex(nextFocus);
  };

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");
    if (digits.length > 1) return setOtpFromString(digits, index);

    const digit = digits.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) focusIndex(index + 1);
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

  
  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting]);

  const switchMethod = async (next: "email" | "sms") => {
    setMethod(next);
    setOtp(Array(OTP_LENGTH).fill(""));

    if (next === "email") {
      setCountdown(30);
      setIsCounting(true);
      return;
    }

    
    if (!phone) {
      showAlert("info", "Sem telefone", "Você não informou telefone. Verifique por e-mail.");
      setMethod("email");
      setCountdown(30);
      setIsCounting(true);
      return;
    }

    setCountdown(0);
    setIsCounting(false);
  };

  async function patchStoredUser(flags: { emailVerified?: boolean; phoneVerified?: boolean }) {
    try {
      const storedUser = await SecureStore.getItemAsync("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const nextUser = {
        ...user,
        ...(flags.emailVerified !== undefined ? { emailVerified: flags.emailVerified } : {}),
        ...(flags.phoneVerified !== undefined ? { phoneVerified: flags.phoneVerified } : {}),
      };

      await SecureStore.setItemAsync("user", JSON.stringify(nextUser));
    } catch {
      
    }
  }

  const handleConfirm = async () => {
    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      return showAlert("info", "Código incompleto", "Por favor, preencha os 6 dígitos.");
    }

    
    if (method === "email" && !email) {
      return showAlert("error", "Erro", "E-mail não encontrado. Volte e tente novamente.");
    }

    
    if (method === "sms" && !phone) {
      return showAlert("info", "Sem telefone", "Você não informou telefone. Verifique por e-mail.");
    }

    setLoading(true);
    try {
      if (method === "email") {
        await api.post("/auth/verify-email", { email, code: fullCode });
        await patchStoredUser({ emailVerified: true });
        showAlert("success", "Verificado 🎉", "E-mail verificado com sucesso!");
      } else {
        await api.post("/auth/verify-phone", { phone, code: fullCode });
        await patchStoredUser({ phoneVerified: true });
        showAlert("success", "Verificado 🎉", "Telefone verificado com sucesso!");
      }

    
      router.replace("/home");
    } catch (error: any) {
      const message = error?.response?.data?.error || "Erro ao verificar código.";
      showAlert("error", "Erro", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isCounting) return;

  
    if (method === "email" && !email) {
      return showAlert("error", "Erro", "E-mail não encontrado. Volte e tente novamente.");
    }

    try {
      setResendLoading(true);

      if (method === "email") {
        await api.post("/auth/resend-email-code", { email });
        showAlert("success", "E-mail enviado 📩", "Novo código enviado para seu e-mail!");
      } else {
        if (!phone) {
          showAlert("info", "Sem telefone", "Você não informou telefone. Verifique por e-mail.");
          return;
        }
        await api.post("/auth/resend-code", { phone });
        showAlert("success", "SMS enviado 📩", "Novo código enviado por SMS!");
      }

      setCountdown(30);
      setIsCounting(true);
    } catch (error: any) {
      const retryAfter = error?.response?.data?.retryAfter;
      const message = error?.response?.data?.error || "Erro ao reenviar código.";

      if (retryAfter && typeof retryAfter === "number") {
        setCountdown(retryAfter);
        setIsCounting(true);
      }

      showAlert("error", "Erro", message);
    } finally {
      setResendLoading(false);
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
                  <VerifyHero method={method} />
                </Animated.View>
              )}

              <Text style={styles.title}>
                {method === "email"
                  ? "Verifique seu e-mail com o código que enviamos."
                  : "Verifique seu telefone com o código recebido por SMS."}
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

              <Text style={styles.resend}>
                {method === "email" ? "Não recebeu o e-mail?" : "Você não recebeu o SMS?"}
              </Text>

              <Pressable onPress={handleResend} disabled={isCounting || resendLoading}>
                <Text style={[styles.resendBold, (isCounting || resendLoading) && { opacity: 0.5 }]}>
                  {isCounting
                    ? `Reenviar em 00:${countdown.toString().padStart(2, "0")}`
                    : resendLoading
                    ? "Enviando..."
                    : method === "email"
                    ? "REENVIAR E-MAIL"
                    : "ENVIAR/REENVIAR SMS"}
                </Text>
              </Pressable>

              <View style={{ flexGrow: 1 }} />

              <Pressable
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleConfirm}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "Processando..." : "Confirmar"}</Text>
              </Pressable>

              <View style={{ marginBottom: 50, alignItems: "center" }}>
                {method === "email" ? (
                  <Text style={{ color: "#535353" }}>
                    Deseja verificar de outra forma?{" "}
                    <Text style={{ color: "#E62325", fontWeight: "600" }} onPress={() => switchMethod("sms")}>
                      Enviar SMS
                    </Text>
                  </Text>
                ) : (
                  <Text style={{ color: "#535353" }}>
                    Deseja voltar para e-mail?{" "}
                    <Text style={{ color: "#E62325", fontWeight: "600" }} onPress={() => switchMethod("email")}>
                      Verificar por e-mail
                    </Text>
                  </Text>
                )}
              </View>
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