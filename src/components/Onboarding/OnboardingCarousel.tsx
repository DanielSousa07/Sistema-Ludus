import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";

import { api } from "@/src/services/api";

interface Game {
  id: string;
  title: string;
  cover: string;
}

const { width } = Dimensions.get("window");
const ITEM_SIZE = 300;

export function OnboardingCarousel() {
  const [games, setGames] = useState<Game[]>([])
  const scrolX = useRef(new Animated.Value(0)).current
  

  useEffect(() => {
    api.get("/games")
    .then(response => setGames(response.data))
    .catch(err => console.error("Erro ao carregar onboarding", err))
    ;
  }, []);

  return (
    <Animated.FlatList
      data={games}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: (width - ITEM_SIZE) / 2,
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrolX } } }],
        { useNativeDriver: true }
      )}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
        ];

        const scale = scrolX.interpolate({
          inputRange,
          outputRange: [0.85, 1, 0.85],
        });

        const opacity = scrolX.interpolate({
          inputRange,
          outputRange: [0.6, 1, 0.6],
        });

        return (
          <View style={{ width: ITEM_SIZE, alignItems: "center" }}>
            <Animated.View
              style={[
                styles.circle,
                { transform: [{ scale }], opacity },
              ]}
            >
              <Image source={{ uri: item.cover}} style={styles.image} />
            </Animated.View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: "#fff",
    elevation: 12,
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
