import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function BackButton() {
    const router = useRouter()
    return (
        <Pressable style={styles.container} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#B3193A"></Ionicons>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 47,
    left: 25,

    width: 50,
    height: 50,

    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    // sombra externa (Android)
    elevation: 6,

    // sombra externa (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    // sombra interna fake (estilo Figma)
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
});

