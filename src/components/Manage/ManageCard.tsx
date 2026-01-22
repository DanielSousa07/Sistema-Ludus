import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ManageCard({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={32} color="#31358B" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 18,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#31358B",
    textAlign: "center",
  },
});
