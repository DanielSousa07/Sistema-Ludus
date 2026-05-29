import { GoogleRegisterButton } from "@/src/components/Register/GoogleRegisterButton";
import { PasswordStrengthSection } from "@/src/components/Register/PasswordStrengthSection";
import { RegisterHeader } from "@/src/components/Register/RegisterHeader";
import { TermsConsentSection } from "@/src/components/Register/TermsConsentSection";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { isValidCPF, maskCEP, maskCPF } from "@/src/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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
    return { score: 0, label: "", color: "#D9DDE7" };
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
  const [cpf, setCpf] = useState("");

  // Estados de Endereço
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [fetchingCep, setFetchingCep] = useState(false);

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
  const cpfRef = useRef<TextInput | null>(null);
  const passRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const cleanPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
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

  const handleCepChange = async (text: string) => {
    const masked = maskCEP(text);
    setCep(masked);

    const cleanCep = masked.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setFetchingCep(true);
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        );
        if (!response.data.erro) {
          setLogradouro(response.data.logradouro);
          setBairro(response.data.bairro);
          setCidade(response.data.localidade);
          setUf(response.data.uf);
        } else {
          showAlert("error", "CEP Inválido", "Não encontramos este CEP.");
          setLogradouro("");
        }
      } catch (error) {
        showAlert("error", "Erro", "Falha ao buscar o CEP.");
      } finally {
        setFetchingCep(false);
      }
    }
  };

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
          "Não foi possível obter o idToken. Verifique se o webClientId está correto.",
        );
      }

      const res = await api.post("/auth/google", { idToken });

      await signInWithToken(res.data.token, res.data.user);

      showAlert("success", "Bem-vindo!", "Login realizado com sucesso.");
      setTimeout(() => router.replace("/home"), 1000);
    } catch (e: any) {
      console.log("Google sign-in error:", e);
      showAlert(
        "error",
        "Erro no Login",
        "Não foi possível conectar com o Google.",
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneDigits = cleanPhone;
    const cleanCpf = cpf.replace(/\D/g, "");

    if (!cleanName)
      return showAlert("info", "Nome obrigatório", "Digite seu nome completo.");
    if (!cleanEmail)
      return showAlert("info", "E-mail obrigatório", "Digite seu e-mail.");
    if (!isValidEmail(cleanEmail))
      return showAlert("info", "E-mail inválido", "Digite um e-mail válido.");
    if (cleanPhoneDigits.length < 10)
      return showAlert(
        "info",
        "Telefone inválido",
        "Digite um telefone válido com DDD.",
      );

    if (!isValidCPF(cleanCpf))
      return showAlert(
        "info",
        "CPF Inválido",
        "Por favor, digite um CPF válido.",
      );
    if (!logradouro || !numero || !cidade)
      return showAlert(
        "info",
        "Endereço Incompleto",
        "Preencha o CEP e o número da sua residência.",
      );

    if (password.length < 6) {
      setTouched((t) => ({ ...t, password: true }));
      return showAlert("info", "Senha fraca", "Use pelo menos 6 caracteres.");
    }

    if (password !== confirm) {
      setTouched((t) => ({ ...t, confirm: true }));
      return showAlert(
        "info",
        "Senhas diferentes",
        "A confirmação não confere.",
      );
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return showAlert(
        "info",
        "Confirmação necessária",
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.",
      );
    }

    const fullAddress = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${uf}, ${cep}`;

    setLoading(true);
    try {
      const result = await register(
        cleanName,
        cleanEmail,
        cleanPhoneDigits,
        password,
        acceptedTerms,
        acceptedPrivacy,
        cleanCpf,
        fullAddress,
      );

      if (result?.success) {
        showAlert(
          "success",
          "Cadastro iniciado 🎉",
          "Enviamos um código de verificação. Confirme para concluir a criação da sua conta.",
        );

        setTimeout(() => {
          setAlertVisible(false);
          router.push({
            pathname: "/verify",
            params: { email: cleanEmail, phone: cleanPhoneDigits },
          });
        }, 1200);
      } else {
        showAlert(
          "error",
          "Erro",
          result?.message || "Erro ao iniciar cadastro.",
        );
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
    <View style={styles.container}>
      <Wrapper style={{ flex: 1 }} {...wrapperProps}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
            onSubmitEditing={() => cpfRef.current?.focus()}
            textContentType="telephoneNumber"
          />

          <Text style={styles.label}>CPF</Text>
          <TextInput
            ref={cpfRef}
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor="#999"
            value={cpf}
            onChangeText={(text) => setCpf(maskCPF(text))}
            keyboardType="numeric"
            maxLength={14}
            returnKeyType="next"
          />

          <Text style={styles.label}>CEP</Text>
          <View style={[styles.passwordWrapper, { marginBottom: 20 }]}>
            <TextInput
              style={styles.inputPassword}
              placeholder="00000-000"
              placeholderTextColor="#999"
              value={cep}
              onChangeText={handleCepChange}
              keyboardType="numeric"
              maxLength={9}
              returnKeyType="next"
            />
            {fetchingCep && <ActivityIndicator size="small" color="#31358B" />}
          </View>

          {logradouro ? (
            <View
              style={{
                backgroundColor: "#F2F4F8",
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#535353",
                  marginBottom: 12,
                  fontWeight: "500",
                }}
              >
                {logradouro}, {bairro} - {cidade}/{uf}
              </Text>
              <Text style={styles.label}>Número da Residência</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                placeholder="Ex: 123"
                placeholderTextColor="#999"
                value={numero}
                onChangeText={setNumero}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => passRef.current?.focus()}
              />
            </View>
          ) : null}

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
          <Text style={styles.googleTermsBottomText}>
            Ao entrar com Google você concorda automaticamente com os
            <Text
              style={styles.checkLink}
              onPress={() => router.replace("/terms")}
            >
              {" "}
              Termos de Uso
            </Text>{" "}
            e a{" "}
            <Text
              style={styles.checkLink}
              onPress={() => router.replace("/privacy-policy")}
            >
              Política de Privacidade
            </Text>
            .
          </Text>

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
