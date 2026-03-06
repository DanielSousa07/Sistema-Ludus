import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  avgRating: number;
  ratingsCount?: number | null;
  onPressRate: () => void;
};

export function GameMeta({ title, avgRating, ratingsCount, onPressRate }: Props) {
  const safeAvg = Number.isFinite(avgRating) ? avgRating : 0;
  const rounded = Math.round(safeAvg);
  const display = safeAvg.toFixed(1);

  const count = typeof ratingsCount === "number" ? ratingsCount : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.ratingRow}>
        <View style={styles.ratingLeft}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rounded ? "star" : "star-outline"}
              size={18}
              color={i < rounded ? "#FFC107" : "#BDBDBD"}
            />
          ))}

          <Text style={styles.ratingText}>
            {display} <Text style={styles.countText}>({count})</Text>
          </Text>
        </View>

        <Pressable onPress={onPressRate} style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Avaliar</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingBottom: 4,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingLeft: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    flexShrink: 1,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#6A6A6A",
  },

  countText: {
    fontWeight: "800",
    color: "#8B8EA1",
  },

  rateBtn: {
    backgroundColor: "#F1F3F7",
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  rateBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0A1F5C",
  },

  title: {
    marginTop: 10,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    color: "#444",
  },
});