import { getOnboardingGames, LudopediaGame } from "@/src/services/ludopedia";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = 300;

export function OnboardingCarousel() {
  const [games, setGames] = useState<LudopediaGame[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getOnboardingGames().then(setGames);
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
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.85, 1, 0.85],
        });

        const opacity = scrollX.interpolate({
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
              <Image source={{ uri: item.image }} style={styles.image} />
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
