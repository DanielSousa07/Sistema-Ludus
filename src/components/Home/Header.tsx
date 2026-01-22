import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export function Header() {
    const { user} = useAuth();
    const firstName = user?.nome ? user.nome.split(" ")[0] : "Visitante";   
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.hello}>Olá,</Text>
                <Text style={styles.name}>{firstName}!</Text>
            </View> 
        <TouchableOpacity style={styles.nofication}>
            <Ionicons name="notifications" size={22} color="#31358B"/>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
            </View>

        </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hello: {
        color: "#E0E0E0",
        fontSize: 18,

    },
    name: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
    },
    nofication: {
        width: 50,
        height: 50,
        backgroundColor: "#FFF",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
      badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2ECC71",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
    badgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "700",
    },
});