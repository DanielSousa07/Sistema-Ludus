import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { useAuth } from "@/src/contexts/AuthContext";
import { styles } from "./styles";

export default function RegisterForm() {
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const {register} = useAuth();

  const handleRegister = async () => {
    if (password !== confirm) {
      return Alert.alert("Erro no cadastro", "As senhas não coincidem!!!");
    }

    const result = await register(name, email, password);

    if(result.success) {
      Alert.alert("Conta criada com sucesso!");
      router.replace("/home")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
      <View style={{flexDirection: 'row', alignItems:'center', marginBottom: 8}}>
            <Image
            source={require("../../../assets/logo-dice.png")}
            style={{width: 63, height: 63, marginRight: 10}}
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
          <Text style={styles.link} onPress={() => router.replace("/")}>
            Entrar
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}
