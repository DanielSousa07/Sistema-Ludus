import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import RegisterForm from "@/src/components/Register/RegisterForm";
import { StyleSheet, View } from "react-native";
export default function Register() {
  return (
    <View style={styles.container}>
      <LoginBackground />
    <BackButton/>
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
