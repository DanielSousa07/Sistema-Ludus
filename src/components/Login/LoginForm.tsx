import { styles } from "@/src/components/Login/styles";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import LudusAlert from "../common/LudusAlert/LudusAlert";

import { Image, Pressable, Text, TextInput, View } from "react-native";

export function LoginForm() {
  const router = useRouter();
  const { login, signInWithToken } = useAuth();

  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

    if (!webClientId) {
      console.warn("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID não definido");
      return;
    }
    if (!webClientId) {
      console.warn("Probela com env")
    }
    console.log("CHAVE IOS CLIENT: ", iosClientId)
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
      iosClientId: iosClientId,
    });
  }, []);

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

  
  const handleLogin = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = senha.trim();

    if (!cleanedEmail || !cleanedPassword) {
      return showAlert("info", "Inventário vazio", "Preencha e-mail e senha para continuar.");
    }

    const result = await login(cleanedEmail, cleanedPassword);

    if (result.success) {
      showAlert("success", "Acesso liberado 🛡️", "Bem-vindo de volta ao Ludus!");

      setTimeout(() => {
        setAlertVisible(false);

        if (result.user?.role === "ADMIN") {
          return router.replace("/admin/manage");
        }

        router.replace("/home");
      }, 1200);
    } else {
      showAlert("error", "Falha crítica", result.message || "E-mail ou senha incorretos");
    }
  };

  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo: any = await GoogleSignin.signIn();

      const idToken =
        userInfo?.idToken ||
        userInfo?.data?.idToken ||
        userInfo?.user?.idToken;

      if (!idToken) {
        throw new Error("Token do Google não encontrado.");
      }

      const res = await api.post("/auth/google", { idToken });

      await signInWithToken(res.data.token, res.data.user);

      showAlert("success", "Login com Google ✅", "Você entrou com sua conta Google.");

      setTimeout(() => {
        setAlertVisible(false);

        if (res.data.needsPhoneVerification) {
          router.replace({
            pathname: "/verify",
            params: {
              email: res.data.user.email,
              phone: res.data.user.phone ?? "",
            },
          });
          return;
        }

        if (res.data.user?.role === "ADMIN") {
          return router.replace("/admin/manage");
        }

        router.replace("/home");
      }, 1000);
    } catch (e: any) {
      console.log("Google Login Error:", e);

      showAlert(
        "error",
        "Erro Google",
        e?.response?.data?.error ||
          e?.message ||
          "Falha ao autenticar com Google."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Image
          source={require("../../../assets/logo-dice.png")}
          style={{ width: 63, height: 63, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-vindo ao Ludus</Text>
      </View>

      <Text style={styles.subtitle}>
        Entre com seu e-mail cadastrado ou número de telefone.
      </Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Seu e-mail"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          style={styles.inputPassword}
          onChangeText={setSenha}
          value={senha}
        />
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            color="#535353"
          />
        </Pressable>
      </View>

      <Pressable>
        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Logar</Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      <Pressable
        style={[styles.googleButton, googleLoading && { opacity: 0.6 }]}
        onPress={handleGoogleLogin}
        disabled={googleLoading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="logo-google"
            size={24}
            style={{ marginRight: 10 }}
            color="#0409ce"
          />
          <Text style={styles.googleText}>
            {googleLoading ? "Conectando..." : "Logar com Google"}
          </Text>
        </View>
      </Pressable>

      <Text style={styles.register}>
        Não possui uma conta?{" "}
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Registre-se aqui!
        </Text>
      </Text>

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