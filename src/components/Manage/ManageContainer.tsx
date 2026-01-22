import { Dimensions, StyleSheet, View } from "react-native";

const { height } = Dimensions.get("window");

export function ManageContainer({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: height * 0.85,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
  },
});
