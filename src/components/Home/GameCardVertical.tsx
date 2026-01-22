import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
interface GameCardVerticalProps {
    title: string,
    location: string,
    rating: number,
    image: string,
}
export default function GameCardVertical({title, location, rating, image}: GameCardVerticalProps) {
      return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text>{rating}</Text>
      </View>
    </View>
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
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
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
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});