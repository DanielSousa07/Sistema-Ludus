import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  price: number;

  
  onPressRent?: () => void;

  
  unavailable?: boolean;
  watching?: boolean;
  loadingWatch?: boolean;
  onToggleWatch?: () => void;
};

export function BottomBar({
  price,
  onPressRent,
  unavailable,
  watching,
  loadingWatch,
  onToggleWatch,
}: Props) {
  const priceText = Number(price ?? 0).toFixed(2);

  return (
    <View style={styles.wrap}>
      <View style={styles.inner}>
        <Text style={styles.price}>
          R${priceText} <Text style={styles.perDay}>/ dia</Text>
        </Text>

        {!unavailable ? (
          <Pressable onPress={onPressRent} style={styles.btn}>
            <Text style={styles.btnText}>Alugar</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onToggleWatch} style={styles.notifyBtn}>
            {loadingWatch ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name={watching ? "notifications" : "notifications-outline"}
                  size={18}
                  color="#fff"
                />
                <Text style={styles.notifyText}>
                  {watching ? "Aviso ativado" : "Me avise"}
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "transparent",
  },

  inner: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  price: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2E7D32",
  },

  perDay: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
  },

  btn: {
    backgroundColor: "#0A1F5C",
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  notifyBtn: {
    backgroundColor: "#FBBC04",
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },

  notifyText: {
    color: "#111",
    fontWeight: "900",
    fontSize: 14,
  },
});