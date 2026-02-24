import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";


WebBrowser.maybeCompleteAuthSession();

type AlertType = "error" | "success" | "info";

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const formatBRPhone = (raw: string) => {
  const digits = (raw || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

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

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const redirectUri = AuthSession.makeRedirectUri({ scheme: "ludus" });
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      responseType: "id_token",
    },

  );

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


  const passwordError =
    touched.password && password.length > 0 && password.length < 6
      ? "Use pelo menos 6 caracteres."
      : "";

  const confirmError =
    touched.confirm && confirm.length > 0 && confirm !== password
      ? "A confirmação não confere."
      : "";

  const googleLock = useRef(false);

  useEffect(() => {
    if (response?.type !== "success") return;
    if (googleLock.current) return;
    googleLock.current = true;

    const idToken = (response as any)?.params?.id_token as string | undefined;

    if (!idToken) {
      googleLock.current = false;
      showAlert("error", "Erro", "Não foi possível obter token do Google.");
      return;
    }

    (async () => {
      setGoogleLoading(true);
      try {
        const res = await api.post("/auth/google", { idToken });
        await signInWithToken(res.data.token, res.data.user);

        showAlert("success", "Tudo certo ✅", "Você entrou com Google.");

        setTimeout(() => {
          setAlertVisible(false);
          if (res.data.needsPhoneVerification) {
            router.replace({
              pathname: "/verify",
              params: { email: res.data.user.email, phone: res.data.user.phone ?? "" },
            });
          } else {
            router.replace("/home");
          }
        }, 900);
      } catch (e: any) {
        console.error("Google login error:", e);
        const msg = e?.response?.data?.error || "Falha ao autenticar com Google. Tente novamente.";
        showAlert("error", "Erro", msg);
        googleLock.current = false;
      } finally {
        setGoogleLoading(false);
      }
    })();
  }, [response]);


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

    setLoading(true);
    try {
      const result = await register(cleanName, cleanEmail, cleanPhoneDigits, password);

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
    } catch (error) {
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
    <View style={styles.container}>
      <Wrapper style={{ flex: 1 }} {...wrapperProps}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Image
              source={require("../../../assets/logo-dice.png")}
              style={{ width: 63, height: 63, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={styles.title}>Crie sua conta</Text>
          </View>

          <Text style={styles.subtitle}>
            Preencha os dados abaixo para começar no Ludus.
          </Text>

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
              onChangeText={(t) => {
                setPassword(t);

                if (!touched.password) return;
              }}
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

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

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

          {confirmError ? (
            <Text style={styles.errorText}>{confirmError}</Text>
          ) : null}

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

          <Pressable
            style={[styles.googleButton, (googleLoading || loading) && { opacity: 0.7 }]}
            disabled={!request || googleLoading || loading}
            onPress={() => promptAsync()}
          >
            <Ionicons name="logo-google" size={22} color="#0409CE" />
            <Text style={styles.googleText}>
              {googleLoading ? "Conectando..." : "Cadastrar com Google"}
            </Text>
          </Pressable>

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
  );
}
