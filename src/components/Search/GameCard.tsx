import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  data: {
    title: string;
    location: string;
    price: number;
    days: number;
    rating: number;
    image: string;
  };
};

export default function GameCard({ data }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{uri: data.image}} style={styles.image} resizeMode="contain" />

      <View style={styles.info}>
        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.locationText}>{data.location}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            R${data.price} <Text style={styles.days}>/ {data.days} dias</Text>
          </Text>

          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text>{data.rating}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 120,
    marginRight: 16,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    fontSize: 12,
    color: "#777",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  days: {
    color: "#777",
    fontWeight: "400",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
