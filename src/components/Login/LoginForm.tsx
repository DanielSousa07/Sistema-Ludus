import { styles } from "@/src/components/Login/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
export function LoginForm() {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={styles.container}>
      {/* Logo e Título */}
      <View style={{flexDirection: 'row', alignItems:'center', marginBottom: 8}}>
      <Image
      source={require("../../../assets/logo-dice.png")}
      style={{width: 63, height: 63, marginRight: 10}}
      resizeMode="contain"
      />
      <Text style={styles.title}>Bem-vindo ao Ludus</Text>

      </View>
      <Text style={styles.subtitle}>
        Entre com seu e-mail cadastrado ou número de telefone.
      </Text>

      {/* Email */}
      <Text style={styles.label}>E-mail ou número de telefone</Text>
      <TextInput
        placeholder="Seu e-mail ou número de telefone"
        placeholderTextColor="#999"
        style={styles.input}
      />

      {/* Password */}
      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          style={styles.inputPassword}
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

      {/* Button */}
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Logar</Text>
      </Pressable>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Google */}
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

      {/* Register */}
      <Text style={styles.register}>
        Não possui uma conta?{" "}
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Registre-se aqui!
        </Text>
      </Text>
    </View>
  );
}
