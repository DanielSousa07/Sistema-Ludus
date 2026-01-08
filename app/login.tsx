import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { LoginForm } from "@/src/components/Login/LoginForm";
import { StyleSheet, View } from "react-native";
const Login = () => {
    return ( 
      <View style={styles.container}>
        <BackButton/>
        <LoginBackground/>
        <LoginForm/>
      </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#31358b"
    }
})
export default Login;