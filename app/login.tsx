import LoginBackground from "@/src/components/Login/LoginBackground";
import { LoginForm } from "@/src/components/Login/LoginForm";
import { StyleSheet, View } from "react-native";
const Login = () => {
    return ( 
      <View style={styles.container}>
        <LoginBackground/>
        <LoginForm/>
      </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#04096E"
    }
})
export default Login;