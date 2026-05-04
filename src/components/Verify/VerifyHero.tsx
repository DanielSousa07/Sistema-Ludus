import { Image, StyleSheet, View } from "react-native";

export default function VerifyHero({ method }: { method: "email" | "sms" | "password" }) {
  const source =
    method === "email"
      ? require("@/assets/verify-email.png")
      : method === "password"
      ? require("@/assets/security.png")
      : require("@/assets/verify-hero.png");

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  image: { width: 280, height: 280 },
});