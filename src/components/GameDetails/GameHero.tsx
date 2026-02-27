import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

type Props = {
  gameId: string;
  coverUrl?: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function GameHero({
  coverUrl,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const router = useRouter();
  
return (
    <View style={styles.wrap}>
      <Image
        source={{
          uri:
            coverUrl ||
            "https://via.placeholder.com/600x400.png?text=Ludus",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </Pressable>

      <Pressable onPress={onToggleFavorite} style={styles.bookmarkBtn}>
        <Ionicons
          name={isFavorite ? "bookmark" : "bookmark-outline"}
          size={22}
          color={isFavorite ? "#FBBC04" : "#fff"}
        />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { height: 320, width: "100%" },
  image: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 18,
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    position: "absolute",
    top: 220,
    right: 18,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
});