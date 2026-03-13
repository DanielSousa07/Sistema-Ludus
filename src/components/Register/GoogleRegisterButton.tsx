import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { styles } from "./styles";

type Props = {
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function GoogleRegisterButton({
  loading,
  disabled,
  onPress,
}: Props) {
  return (
    <Pressable
      style={[styles.googleButton, disabled && { opacity: 0.7 }]}
      disabled={disabled}
      onPress={onPress}
    >
      <Ionicons name="logo-google" size={22} color="#0409CE" />
      <Text style={styles.googleText}>
        {loading ? "Conectando..." : "Cadastrar com Google"}
      </Text>
    </Pressable>
  );
}