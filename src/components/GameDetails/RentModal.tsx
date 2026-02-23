import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Copy = {
  id: string;
  code?: string | null;
  number: number;
  condition?: string | null;
  available: boolean;
};

export function RentModal({
  visible,
  copies,
  allowOriginalRental,
  onClose,
  onRentOriginal,
  onRentCopy,
}: {
  visible: boolean;
  copies: Copy[];
  allowOriginalRental: boolean;
  onClose: () => void;
  onRentOriginal: () => void;
  onRentCopy: (copyId: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.card}>
        <Text style={styles.title}>Escolher aluguel</Text>
        <Text style={styles.subtitle}>Duração padrão: 4 dias</Text>

        {allowOriginalRental && (
          <Pressable onPress={onRentOriginal} style={styles.option}>
            <View style={styles.left}>
              <Ionicons name="cube-outline" size={18} color="#31358B" />
              <Text style={styles.optionText}>Alugar jogo original</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#31358B" />
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Exemplares disponíveis</Text>

        {copies.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="albums-outline" size={26} color="#999" />
            <Text style={styles.emptyText}>Nenhum exemplar disponível agora.</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {copies.map((c) => (
              <Pressable key={c.id} onPress={() => onRentCopy(c.id)} style={styles.option}>
                <View style={styles.left}>
                  <Ionicons name="albums-outline" size={18} color="#31358B" />
                  <View>
                    <Text style={styles.optionText}>{c.code ?? `#${c.number}`}</Text>
                    {!!c.condition?.trim() && (
                      <Text style={styles.optionSub}>Condição: {c.condition}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#31358B" />
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Fechar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  card: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 28,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#31358B" },
  subtitle: { marginTop: 6, color: "#6A6A6A", fontWeight: "700" },

  sectionTitle: { marginTop: 14, marginBottom: 10, fontWeight: "900", color: "#31358B" },

  option: {
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  optionText: { fontWeight: "900", color: "#31358B" },
  optionSub: { marginTop: 3, fontSize: 12, color: "#6A6A6A", fontWeight: "700" },

  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 12, gap: 8 },
  emptyText: { color: "#777", fontWeight: "700" },

  closeBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F7F8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontWeight: "900", color: "#31358B" },
});