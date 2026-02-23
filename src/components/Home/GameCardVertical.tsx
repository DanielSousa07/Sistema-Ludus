import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameCardVerticalProps {
  id: string; // ✅ precisa do id
  title: string;
  location: string;
  rating: number;
  image?: string | null;
}

function formatRating(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

export default function GameCardVertical({
  id,
  title,
  location,
  rating,
  image,
}: GameCardVerticalProps) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92 },
      ]}
      onPress={() => router.push(`/game/${id}`)} // ✅ agora correto
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text style={styles.ratingText}>{formatRating(rating)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#EEE",
  },

  imageFallback: {},

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    color: "#333",
  },

  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  locationText: {
    color: "#777",
    fontSize: 14,
    fontWeight: "700",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontWeight: "900",
    color: "#333",
  },
});