import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";

import { useAuth } from "@/src/contexts/AuthContext";
import { styles } from "./styles";

export default function RegisterForm() {
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

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


  const { register } = useAuth();

 const handleRegister = async () => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\D/g, '');

  console.log("1. Tentando registrar:", { name, cleanEmail, cleanPhone });

  try {
    const result = await register(name, cleanEmail, cleanPhone, password);
    console.log("2. Resultado do Registro:", result);

    if (result && result.success) {
      console.log("3. Sucesso! Mostrando alerta...");
      showAlert(
        "success",
        "Level concluído 🎉",
        "Conta criada com sucesso!"
      );

      setTimeout(() => {
        console.log("4. Navegando para /verify");
        setAlertVisible(false);
        router.push({
          pathname: "/verify",
          params: { phone: cleanPhone }
        });
      }, 1500);
    } else {
      console.log("3. Falha no registro/login:", result?.message);
      showAlert("error", "Erro", result?.message || "Erro desconhecido");
    }
  } catch (error) {
    console.error("Erro fatal no handleRegister:", error);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />


        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 0000-0000"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={22}
              color="#535353"
            />
          </Pressable>
        </View>


        <Text style={styles.label}>Confirmar senha</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Confirme a senha"
            placeholderTextColor="#999"
            secureTextEntry={hideConfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <Pressable onPress={() => setHideConfirm(!hideConfirm)}>
            <Ionicons
              name={hideConfirm ? "eye-off" : "eye"}
              size={22}
              color="#535353"
            />
          </Pressable>
        </View>


        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </Pressable>


        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>


        <Pressable style={styles.googleButton}>
          <Ionicons name="logo-google" size={22} color="#0409CE" />
          <Text style={styles.googleText}>Cadastrar com Google</Text>
        </Pressable>


        <Text style={styles.register}>
          Já possui uma conta?{" "}
          <Text style={styles.link} onPress={() => router.replace("/home")}>
            Entrar
          </Text>
        </Text>
      </ScrollView>
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