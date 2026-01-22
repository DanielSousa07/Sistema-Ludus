import { styles } from "@/src/components/Login/styles";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import LudusAlert from "../common/LudusAlert/LudusAlert";

import { Image, Pressable, Text, TextInput, View } from "react-native";
export function LoginForm() {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);
  const { login } = useAuth()

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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

  const handleLogin = async () => {

    if (!email || !senha) {
      return showAlert("info", "Inventário vazio", "Preencha e-mail e senha para continuar.")
    }

    const result = await login(email, senha)

    if (result.success) {
      showAlert("success", "Acesso liberado 🛡️", "Bem vindo de volta ao Ludus!")

      setTimeout(() => {
        setAlertVisible(false);
        if (result.user?.role === "ADMIN") {
           return router.replace("/admin/manage")
        }

        router.replace("/home");
      }, 1200);

    } else {
      showAlert("error", "Falha crítica", result.message || "E-mail ou senha incorretos ")
    }
  }

  return (

    <View style={styles.container}>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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

      <Text style={styles.label}>E-mail ou número de telefone</Text>
      <TextInput
        placeholder="Seu e-mail ou número de telefone"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
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

      <Pressable style={styles.googleButton}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="logo-google"
            size={24}
            style={{ marginRight: 10 }}
            color="#0409ce"
          />
          <Text style={styles.googleText}>Logar com Google</Text>
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
