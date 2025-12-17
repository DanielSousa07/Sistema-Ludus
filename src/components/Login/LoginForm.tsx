import { styles } from "@/src/components/Login/styles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    View
} from "react-native";

export function LoginForm() {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>
        Bem vindo ao LUDUS
        </Text>
      <Text style={styles.subtitle}>
        Entre com seu e-mail cadastrado ou número de telefone.
      </Text>

      {/* Email */}
      <Text style={styles.label}>E-mail ou número de telefone</Text>
      <TextInput
        placeholder="Entre com seu e-mail ou número de telefone"
        placeholderTextColor="#999"
        style={styles.input}
      />

      {/* Password */}
      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Entre com sua senha"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          style={styles.inputPassword}
        />
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Text style={styles.eye}>👁️</Text>
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
        <Text style={styles.googleText}>Logar com Google</Text>
      </Pressable>

      {/* Register */}
      <Text style={styles.register}>
        Não possui uma conta?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/register")}
        >
          Registre-se aqui!
        </Text>
      </Text>
    </View>
  );
}
