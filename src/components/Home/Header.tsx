import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Header() {
  const { user, logout } = useAuth();

  const firstName = user?.nome ? user.nome.split(" ")[0] : "Visitante";
  const notificationsCount = 0; 

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hello}>Olá,</Text>
        <Text style={styles.name}>{firstName}!</Text>
        <Text style={styles.TextSearch}>Procure o Jogo!</Text>
      </View>

      <TouchableOpacity
        style={styles.nofication}
        onPress={() => {
          
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="notifications" size={22} color="#31358B" />

        {notificationsCount > 0 && (
          <View style={styles.badge} >
            <Text style={styles.badgeText}>
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
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
    fontSize: 20,
  },
  name: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  TextSearch: {
    marginTop: 12,
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "300",
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
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
});