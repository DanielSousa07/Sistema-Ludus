import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Fact = { icon: keyof typeof Ionicons.glyphMap; label: string };

type Props = {
  players?: string;
  time?: string;
  age?: string;
};

export function GameFactsRow({ players, time, age }: Props) {
  const facts: Fact[] = [
    { icon: "people-outline", label: players || "—" },
    { icon: "time-outline", label: time || "—" },
    { icon: "happy-outline", label: age || "—" },
  ];

  return (
    <View style={styles.row}>
      {facts.map((f, idx) => (
        <View key={idx} style={styles.pill}>
          <Ionicons name={f.icon} size={18} color="#6A6A6A" />
          <Text style={styles.text}>{f.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  pill: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
  },
  text: { fontSize: 14, fontWeight: "700", color: "#6A6A6A" },
});