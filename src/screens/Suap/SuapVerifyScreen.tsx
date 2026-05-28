/**
 * SuapVerifyScreen.tsx
 *
 * Tela de verificação do vínculo acadêmico via SUAP.
 */

import BackButton from "@/src/components/common/BackButton";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AlertType = "error" | "success" | "info";
type VerifyState = "idle" | "loading" | "success" | "error";

export default function SuapVerifyScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [suapUsername, setSuapUsername] = useState("");
  const [suapPassword, setSuapPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [state, setState] = useState<VerifyState>("idle");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function handleVerify() {
    if (!suapUsername.trim()) {
      return showAlert(
        "info",
        "Campo obrigatório",
        "Digite seu usuário do SUAP.",
      );
    }

    if (!suapPassword) {
      return showAlert(
        "info",
        "Campo obrigatório",
        "Digite sua senha do SUAP.",
      );
    }

    setState("loading");

    try {
      await api.post("/auth/ifma/verify-suap", {
        suapUsername: suapUsername.trim(),
        suapPassword,
      });

      setState("success");

      await refreshUser?.();

      setTimeout(() => {
        router.replace("/home");
      }, 2200);
    } catch (e: any) {
      setState("error");
      shake();

      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      if (code === "SUAP_INVALID_CREDENTIALS") {
        showAlert(
          "error",
          "Credenciais inválidas",
          "Usuário ou senha do SUAP incorretos.",
        );
      } else if (code === "SUAP_TIMEOUT") {
        showAlert(
          "info",
          "SUAP indisponível",
          "O SUAP demorou para responder.",
        );
      } else if (code === "SUAP_UNAVAILABLE") {
        showAlert("info", "SUAP offline", "Não foi possível conectar ao SUAP.");
      } else {
        showAlert("error", "Erro", msg || "Não foi possível verificar.");
      }

      setTimeout(() => setState("idle"), 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // SUCESSO
  // ─────────────────────────────────────────────────────────

  if (state === "success") {
    return (
      <View style={styles.successContainer}>
        <LoginBackground />

        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color="#2E7D32" />
          </View>

          <Text style={styles.successTitle}>Vínculo confirmado! 🎓</Text>

          <Text style={styles.successSubtitle}>
            Seu vínculo acadêmico foi validado com sucesso.
            {"\n"}
            Bem-vindo ao Ludus IFMA.
          </Text>

          <ActivityIndicator
            size="small"
            color="#31358B"
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────
  // TELA PRINCIPAL
  // ─────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <LoginBackground />

      <BackButton />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingTop: 80 }}>
            <View style={styles.card}>
              {/* HERO */}
              <View style={styles.heroWrap}>
                <View style={styles.heroRow}>
                  {/* Ludus */}
                  <View style={styles.logoCard}>
                    <Image
                      source={require("@/assets/logo-dice.png")}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Link */}
                  <View style={styles.linkWrap}>
                    <View style={styles.linkLine} />

                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#FBBC04"
                    />

                    <View style={styles.linkLine} />
                  </View>

                  {/* SUAP */}
                  {/* SUAP */}
                  <View style={styles.suapCard}>
                    <Image
                      source={require("@/assets/suap-logo.png")}
                      style={styles.suapImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              {/* TITULO */}
              <Text style={styles.title}>Verificação acadêmica</Text>

              <Text style={styles.subtitle}>
                Confirme seu vínculo acadêmico usando suas credenciais do SUAP
                para desbloquear os recursos do Ludus IFMA.
              </Text>

              {/* INFO */}
              <View style={styles.infoBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#B8860B"
                />

                <Text style={styles.infoText}>
                  Sua senha do SUAP é usada apenas uma vez para validar sua
                  matrícula e nunca é armazenada.
                </Text>
              </View>

              {/* FORM */}
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim }],
                }}
              >
                <Text style={styles.label}>Usuário do SUAP</Text>

                <View style={styles.inputWrap}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 20241INF.TMN0001"
                    placeholderTextColor="#AAA"
                    value={suapUsername}
                    onChangeText={setSuapUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>

                <Text style={styles.label}>Senha do SUAP</Text>

                <View style={styles.inputWrap}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Sua senha do SUAP"
                    placeholderTextColor="#AAA"
                    value={suapPassword}
                    onChangeText={setSuapPassword}
                    secureTextEntry={hidePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleVerify}
                  />

                  <Pressable
                    onPress={() => setHidePassword((v) => !v)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={hidePassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#888"
                    />
                  </Pressable>
                </View>
              </Animated.View>

              {/* BOTÃO */}
              <Pressable
                style={[
                  styles.button,
                  state === "loading" && {
                    opacity: 0.7,
                  },
                ]}
                onPress={handleVerify}
                disabled={state === "loading"}
              >
                {state === "loading" ? (
                  <View style={styles.buttonLoading}>
                    <ActivityIndicator size="small" color="#fff" />

                    <Text style={styles.buttonText}>
                      Verificando no SUAP...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    Confirmar vínculo acadêmico
                  </Text>
                )}
              </Pressable>

              {/* FOOTER */}
              <Text style={styles.footerNote}>
                Problemas com o SUAP?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/home")}
                >
                  Verificar depois
                </Text>
              </Text>

              {/* WARNING */}
              <View style={styles.warningBox}>
                <Ionicons name="warning-outline" size={14} color="#C62828" />

                <Text style={styles.warningText}>
                  Sem a verificação acadêmica, o aluguel de jogos ficará
                  bloqueado.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    flex: 1,
    backgroundColor: "#FCFCFF",

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,

    marginTop: 30,
    marginHorizontal: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },

  // HERO

  heroWrap: {
    alignItems: "center",
    marginBottom: 24,

    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1FA",
  },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoCard: {
    width: 88,
    height: 88,

    borderRadius: 28,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E7EAF5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  suapCard: {
    width: 88,
    height: 88,

    borderRadius: 28,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E7EAF5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  logoImage: {
    width: 75,
    height: 75,
  },
  suapImage: {
    width: 92,
    height: 92,
    borderRadius: 16,
  },

  linkWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },

  linkLine: {
    width: 20,
    height: 2,
    backgroundColor: "#FBBC04",
  },

  // TITULOS

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#04096E",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
  },

  // INFO BOX

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,

    backgroundColor: "#FFF8E1",

    borderWidth: 1,
    borderColor: "#FFE7A3",

    borderRadius: 14,
    padding: 14,

    marginBottom: 22,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#B8860B",
    lineHeight: 18,
  },

  // LABELS

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#04096E",

    marginBottom: 8,
    marginTop: 4,
  },

  // INPUTS

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderWidth: 1.5,
    borderColor: "#D7DBEA",

    borderRadius: 16,

    paddingHorizontal: 14,

    height: 56,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },

  // BOTÃO

  button: {
    height: 58,

    backgroundColor: "#31358B",

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
    marginBottom: 16,

    overflow: "hidden",

    shadowColor: "#31358B",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  buttonLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // FOOTER

  footerNote: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    marginBottom: 12,
  },

  footerLink: {
    color: "#31358B",
    fontWeight: "700",
  },

  // WARNING

  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    backgroundColor: "#FFF1F1",

    borderRadius: 12,
    padding: 12,

    borderWidth: 1,
    borderColor: "#FFCCCC",
  },

  warningText: {
    flex: 1,
    fontSize: 11,
    color: "#C62828",
    lineHeight: 16,
  },
  // SUCCESS

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  successCard: {
    backgroundColor: "#fff",

    borderRadius: 28,

    padding: 32,

    alignItems: "center",
    width: "100%",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 10,
  },

  successIcon: {
    marginBottom: 16,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#31358B",

    marginBottom: 10,
    textAlign: "center",
  },

  successSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
});
