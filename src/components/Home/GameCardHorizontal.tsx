import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameCardHorizontalProps {
  id: string;
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

function getHighResImage(url?: string | null) {
  if (!url) return null;

  return url
    .replace("_t.jpg", ".jpg")
    .replace("_t.jpeg", ".jpeg")
    .replace("_t.png", ".png");
}

export default function GameCardHorizontal({
  id,
  title,
  price,
  rating,
  image,
}: GameCardHorizontalProps) {
  const router = useRouter();

  const img = getHighResImage(image) ?? image ?? null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/game/[id]", params: { id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      {img ? (
        <Image
          source={{ uri: img }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={200}
          progressiveRenderingEnabled
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text style={styles.ratingText}>{formatRating(rating)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>{formatBRL(price)} / dia</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 16,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden", 
  },

  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#EEE",
  },

  imageFallback: {},

  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    height: 28,
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },

  ratingText: {
    fontWeight: "800",
    color: "#333",
  },

  footer: {
    padding: 12,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    color: "#333",
  },

  price: {
    color: "#2FA84F",
    fontWeight: "800",
    marginTop: 4,
  },
});