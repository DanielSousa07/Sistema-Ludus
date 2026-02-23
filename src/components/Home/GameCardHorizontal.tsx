import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameCardHorizontalProps {
  id: string; // ✅ necessário
  title: string;
  price: number;
  rating: number;
  image?: string | null;
}

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatRating(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

export default function GameCardHorizontal({
  id,
  title,
  price,
  rating,
  image,
}: GameCardHorizontalProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/game/${id}`)} // ✅ correto
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92 },
      ]}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text>{formatRating(rating)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>{formatBRL(price)} / exp</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 16,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#EEE",
  },

  imageFallback: {},

  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },

  footer: {
    padding: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
  },

  price: {
    color: "#4CAF50",
    fontWeight: "700",
    marginTop: 4,
  },
});