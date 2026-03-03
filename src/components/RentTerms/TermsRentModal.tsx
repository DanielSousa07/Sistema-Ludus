import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export function TermsRentModal({ visible, loading, onClose, onAccept }: Props) {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.icon}>
              <Ionicons name="document-text-outline" size={18} color="#31358B" />
            </View>
            <Text style={styles.title}>Termos do primeiro aluguel</Text>
          </View>

          <Text style={styles.text}>
            Para alugar jogos no Ludus, você precisa aceitar o termo de compromisso.
            O prazo padrão é de até <Text style={{ fontWeight: "900" }}>3 dias</Text> e a retirada/devolução
            ocorre no <Text style={{ fontWeight: "900" }}>IFMA - Campus Timon</Text>.
          </Text>

          <Pressable
            onPress={() => router.push("/terms")}
            style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.linkText}>Ver termos completos</Text>
            <Ionicons name="open-outline" size={16} color="#FBBC04" />
          </Pressable>

          <View style={styles.row}>
            <Pressable
              onPress={onClose}
              disabled={!!loading}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.92 },
                loading && { opacity: 0.5 },
              ]}
            >
              <Text style={styles.secondaryText}>Agora não</Text>
            </Pressable>

            <Pressable
              onPress={onAccept}
              disabled={!!loading}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.92 },
                loading && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.primaryText}>
                {loading ? "Aceitando..." : "Aceitar e continuar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 12,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(49,53,139,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 14, fontWeight: "900", color: "#222" },
  text: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  linkBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(251,188,4,0.12)",
  },
  linkText: { fontWeight: "900", color: "#9A6B00", fontSize: 13 },
  row: { flexDirection: "row", gap: 10, marginTop: 14 },
  secondaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F1F1F6",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontWeight: "900", color: "#333" },
  primaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#31358B",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontWeight: "900", color: "#FFF" },
});