import { GoogleRegisterButton } from "@/src/components/Register/GoogleRegisterButton";
import { PasswordStrengthSection } from "@/src/components/Register/PasswordStrengthSection";
import { RegisterHeader } from "@/src/components/Register/RegisterHeader";
import { TermsConsentSection } from "@/src/components/Register/TermsConsentSection";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";

type AlertType = "error" | "success" | "info";

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const formatBRPhone = (raw: string) => {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

function getPasswordStrength(password: string) {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "#D9DDE7",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Za-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score: 1, label: "Senha fraca", color: "#E62325" };
  }

  if (score <= 4) {
    return { score: 2, label: "Senha média", color: "#FBBC04" };
  }

  return { score: 3, label: "Senha forte", color: "#2E7D32" };
}

export default function RegisterForm() {
  const router = useRouter();
  const { register, signInWithToken } = useAuth();

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [touched, setTouched] = useState({
    password: false,
    confirm: false,
  });

  const nameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const phoneRef = useRef<TextInput | null>(null);
  const passRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const cleanPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordError =
    touched.password && password.length > 0 && password.length < 6
      ? "Use pelo menos 6 caracteres."
      : "";

  const confirmError =
    touched.confirm && confirm.length > 0 && confirm !== password
      ? "A confirmação não confere."
      : "";

  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    const iosClient = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

    if (!webClientId) {
      console.warn("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID não encontrado");
      return;
    }

    GoogleSignin.configure({
      webClientId,
      iosClientId: iosClient,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error(
          "Não foi possível obter o idToken. Verifique se o webClientId está correto."
        );
      }

      const res = await api.post("/auth/google", { idToken });

      await signInWithToken(res.data.token, res.data.user);

      showAlert("success", "Bem-vindo!", "Login realizado com sucesso.");
      setTimeout(() => router.replace("/home"), 1000);
    } catch (e: any) {
      console.log("Google sign-in error:", e);
      showAlert("error", "Erro no Login", "Não foi possível conectar com o Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneDigits = cleanPhone;

    if (!cleanName) {
      return showAlert("info", "Nome obrigatório", "Digite seu nome completo.");
    }

    if (!cleanEmail) {
      return showAlert("info", "E-mail obrigatório", "Digite seu e-mail.");
    }

    if (!isValidEmail(cleanEmail)) {
      return showAlert("info", "E-mail inválido", "Digite um e-mail válido.");
    }

    if (cleanPhoneDigits.length < 10) {
      return showAlert(
        "info",
        "Telefone inválido",
        "Digite um telefone válido com DDD."
      );
    }

    if (password.length < 6) {
      setTouched((t) => ({ ...t, password: true }));
      return showAlert("info", "Senha fraca", "Use pelo menos 6 caracteres.");
    }

    if (password !== confirm) {
      setTouched((t) => ({ ...t, confirm: true }));
      return showAlert("info", "Senhas diferentes", "A confirmação não confere.");
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return showAlert(
        "info",
        "Confirmação necessária",
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar sua conta."
      );
    }

    setLoading(true);
    try {
      const result = await register(
  cleanName,
  cleanEmail,
  cleanPhoneDigits,
  password,
  acceptedTerms,
  acceptedPrivacy
);

      if (result?.success) {
        showAlert(
          "success",
          "Conta criada 🎉",
          "Agora verifique seu número com o código enviado por SMS."
        );

        setTimeout(() => {
          setAlertVisible(false);
          router.push({
            pathname: "/verify",
            params: { email: cleanEmail, phone: cleanPhoneDigits },
          });
        }, 1200);
      } else {
        showAlert("error", "Erro", result?.message || "Erro ao criar conta.");
      }
    } catch {
      showAlert("error", "Erro", "Falha inesperada ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const Wrapper: any = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const wrapperProps =
    Platform.OS === "ios"
      ? { behavior: "padding" as const, keyboardVerticalOffset: 0 }
      : {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Wrapper style={{ flex: 1 }} {...wrapperProps}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <RegisterHeader />

            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              ref={nameRef}
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Seu e-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              textContentType="emailAddress"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              ref={phoneRef}
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={(t) => setPhone(formatBRPhone(t))}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              textContentType="telephoneNumber"
            />

            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.passwordWrapper,
                passwordError ? styles.fieldError : null,
              ]}
            >
              <TextInput
                ref={passRef}
                style={styles.inputPassword}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setHidePassword((v) => !v)}>
                <Ionicons
                  name={hidePassword ? "eye-off" : "eye"}
                  size={22}
                  color={passwordError ? "#E62325" : "#535353"}
                />
              </Pressable>
            </View>

            <PasswordStrengthSection
              visible={password.length > 0}
              strength={passwordStrength}
              rules={passwordRules}
            />

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <Text style={styles.label}>Confirmar senha</Text>
            <View
              style={[
                styles.passwordWrapper,
                confirmError ? styles.fieldError : null,
              ]}
            >
              <TextInput
                ref={confirmRef}
                style={styles.inputPassword}
                placeholder="Confirme a senha"
                placeholderTextColor="#999"
                secureTextEntry={hideConfirm}
                value={confirm}
                onChangeText={setConfirm}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setHideConfirm((v) => !v)}>
                <Ionicons
                  name={hideConfirm ? "eye-off" : "eye"}
                  size={22}
                  color={confirmError ? "#E62325" : "#535353"}
                />
              </Pressable>
            </View>

            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

            <TermsConsentSection
              acceptedTerms={acceptedTerms}
              acceptedPrivacy={acceptedPrivacy}
              onToggleTerms={() => setAcceptedTerms((v) => !v)}
              onTogglePrivacy={() => setAcceptedPrivacy((v) => !v)}
            />

            <Pressable
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Processando..." : "Criar conta"}
              </Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>or</Text>
              <View style={styles.line} />
            </View>

            <GoogleRegisterButton
              loading={googleLoading}
              disabled={googleLoading || loading}
              onPress={handleGoogle}
            />

            <Text style={styles.register}>
              Já possui uma conta?{" "}
              <Text style={styles.link} onPress={() => router.replace("/login")}>
                Entrar
              </Text>
            </Text>
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
      </TouchableWithoutFeedback>
      );
}