import { Image, StyleSheet, View } from "react-native";

export default function VerifyHero() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/verify-hero.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

  },

  image: {
    width: 280,
    height: 280,
  },
});
