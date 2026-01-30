import { api } from "@/src/services/api";
import { getOnboardingGames } from "@/src/services/ludopedia";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export function OnboardingHero() {
  const [game, setGame] = useState<any>(null);

  const PLACEHODER_IMAGE = "https://image.api.playstation.com/vulcan/ap/rnd/202209/2812/jm8wDLnosb3D8W6TUuLGa4jz.jpg"
  useEffect(() => {
    async function loadRandomGame() {
      try {
        const response = await api.get("/games")
        const games = response.data

        if(games.length > 0) {
          const randomIndex = Math.floor(Math.random() * games.length);
          setGame(games[randomIndex])
        }
      } catch (error) {
        console.error(error);
      }

      const games = await getOnboardingGames();
      const randomIndex = Math.floor(Math.random() * games.length);
      setGame(games[randomIndex]);
    }

    loadRandomGame();
  }, []);

  if (!game) return null; // evita piscar layout


  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image source={{ uri: game.image || PLACEHODER_IMAGE}} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 140,
    alignItems: "center",
  },

  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
