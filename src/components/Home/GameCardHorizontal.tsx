import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

interface GameCardHorizontalProps {
  title: string;
  price: string;
  rating: number;
  image: string;
}

export default function GameCardHorizontal({
  title,
  price,
  rating,
  image,
}: GameCardHorizontalProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover"/>

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text>{rating}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price} / exp</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: 220,
    marginRight: 16,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

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
