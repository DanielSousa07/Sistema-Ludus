import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function ConfirmDeleteModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="warning-outline" size={28} color="#E62325" />
        </View>

        <Text style={styles.title}>{title ?? "Excluir jogo?"}</Text>
        <Text style={styles.message}>
          {message ?? "Tem certeza? Essa ação não poderá ser desfeita."}
        </Text>

        <View style={styles.row}>
          <Pressable onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>

          <Pressable onPress={onConfirm} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFE9EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#31358B" },
  message: { marginTop: 8, color: "#6A6A6A", fontWeight: "600", lineHeight: 20 },

  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontWeight: "900", color: "#31358B" },

  deleteBtn: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#E62325",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: { fontWeight: "900", color: "#fff" },
});