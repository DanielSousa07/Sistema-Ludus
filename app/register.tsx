import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { StyleSheet, View } from "react-native";

const IFMA_MODE = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

const RegisterForm = IFMA_MODE
  ? require("@/src/components/Register/RegisterFormIFMA").default
  : require("@/src/components/Register/RegisterForm").default;

function Register() {
  const IFMA_MODE = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

  const RegisterForm = IFMA_MODE
    ? require("@/src/components/Register/RegisterFormIFMA").default
    : require("@/src/components/Register/RegisterForm").default;
  return (
    <View style={styles.container}>
      <LoginBackground />
      <BackButton />
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Register;
