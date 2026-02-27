import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function FavoritesEmpty() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="bookmark-outline" size={64} color="#8B8EA1" />
        <View style={styles.badge}>
          <Ionicons name="close" size={20} color="#FFF" />
        </View>
      </View>

      <Text style={styles.text}>Você não possui nenhum jogo{`\n`}favoritado ;(</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 120 },
  iconWrap: { width: 120, height: 120, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#8B8EA1",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { marginTop: 16, color: "#6A6A6A", fontWeight: "800", fontSize: 18, textAlign: "center" },
});