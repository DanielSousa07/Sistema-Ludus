import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { LoginForm } from "@/src/components/Login/LoginForm";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function Login() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <LoginBackground />
        <BackButton />

        {/* Wrapper que empurra o card pra baixo */}
        <View style={styles.bottomArea}>
          <LoginForm />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#31358b",
  },

  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
