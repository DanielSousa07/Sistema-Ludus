import { useAuth } from "@/src/contexts/AuthContext";
import type { HomeGame } from "@/src/screens/Home/HomeScreen";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GameCardVertical from "./GameCardVertical";
import GameCarousel from "./GameCarousel";

export function HomeCard({
  forYou,
  mostRented,
  onSeeAll,
  footerSpace,
}: {
  forYou: HomeGame[];
  mostRented: HomeGame[];
  onSeeAll: () => void;
  footerSpace: number;
}) {
  const forYouGames = forYou.slice(0, 3);
  const mostRentedGames = mostRented.slice(0, 6);

  const { logout } = useAuth();

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Para Você</Text>

        <Pressable onPress={onSeeAll} hitSlop={10}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </Pressable>
      </View>

      <GameCarousel data={forYouGames} />

      <Text style={styles.sectionTitle}>Mais Alugados</Text>

      {mostRentedGames.length === 0 ? (
        <Text style={styles.emptyText}>
          Ainda não há aluguéis suficientes para montar esse ranking.
        </Text>
      ) : (
        mostRentedGames.map((game) => (
          <GameCardVertical
            key={game.id}
            id={game.id}
            title={game.title}
            location={game.isAvailableNow ? "Disponível" : "Indisponível"}
            rating={Number(game.rating ?? 0)}
            image={game.cover ?? null}
          />
        ))
      )}

      <View style={{ height: footerSpace + 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 19,
    marginTop: 27,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginVertical: 10,
  },

  seeAll: {
    color: "#FBBC04",
    fontWeight: "900",
    fontSize: 15,
  },

  emptyText: {
    color: "#777",
    fontWeight: "700",
    marginTop: 6,
  },
});