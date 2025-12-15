import { Pressable, StyleSheet, Text, View } from "react-native";

export function OnboardingCTA() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Encontre seus{"\n"}jogos ideais!
      </Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>

      <Text style={styles.login}>
        Já possui uma conta? <Text style={styles.link}>Logue aqui!</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 28,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3932",
    textAlign: "center",
    marginBottom: 28,
  },

  button: {
    backgroundColor: "#31358B",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  login: {
    textAlign: "center",
    color: "#555568",
  },

  link: {
    color: "#31358B",
    fontWeight: "600",
  },
});
