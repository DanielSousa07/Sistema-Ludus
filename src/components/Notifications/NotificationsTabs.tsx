import { Pressable, StyleSheet, Text, View } from "react-native";

export function NotificationsTabs({
  tab,
  onChange,
}: {
  tab: "all" | "unread";
  onChange: (tab: "all" | "unread") => void;
}) {
  return (
    <View style={styles.tabs}>
      <Pressable onPress={() => onChange("all")} style={[styles.tab, tab === "all" && styles.tabActive]}>
        <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>Todas</Text>
      </Pressable>
      <Pressable onPress={() => onChange("unread")} style={[styles.tab, tab === "unread" && styles.tabActive]}>
        <Text style={[styles.tabText, tab === "unread" && styles.tabTextActive]}>Não lidas</Text>
      </Pressable>
    </View>
  );
}

const BLUE = "#31358B";

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 10, marginBottom: 10 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#F1F2F6",
  },
  tabActive: { backgroundColor: BLUE },
  tabText: { fontWeight: "900", color: "#4B4E5A", fontSize: 12 },
  tabTextActive: { color: "#fff" },
});