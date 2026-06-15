import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  currentValue: number | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
};

export function RateModal({
  visible,
  currentValue,
  saving,
  onClose,
  onSave,
}: Props) {
  const value = currentValue ?? 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.card}>
        <Text style={styles.title}>Sua avaliação</Text>
        <Text style={styles.subtitle}>Você pode editar quando quiser.</Text>

        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, i) => {
            const starVal = i + 1;
            const filled = starVal <= value;
            return (
              <Pressable
                key={starVal}
                disabled={saving}
                onPress={() => onSave(starVal)}
                style={{ padding: 6 }}
              >
                <Ionicons
                  name={filled ? "star" : "star-outline"}
                  size={34}
                  color={filled ? "#FFC107" : "#BDBDBD"}
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={onClose} disabled={saving} style={styles.closeBtn}>
          <Text style={styles.closeText}>
            {saving ? "Salvando..." : "Fechar"}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  card: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 28,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#333" },
  subtitle: { marginTop: 6, color: "#6A6A6A", fontWeight: "600" },
  starsRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  closeBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F1F3F7",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontWeight: "900", color: "#0A1F5C" },
});
