import type { AdminRental } from "@/src/screens/Manage/ManageRentalsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ConfirmDeleteModal } from "../EditGames/ConfirmDeleteModal";

function formatDate(dt: string) {
  const d = new Date(dt);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

export function RentalActionsSheet({
  visible,
  rental,
  saving,
  onClose,
  onSetStatus,
}: {
  visible: boolean;
  rental: AdminRental | null;
  saving: boolean;
  onClose: () => void;
  onSetStatus: (rentalId: string, status: "ACTIVE" | "RETURNED" | "CANCELED") => void;
}) {
  const [confirmType, setConfirmType] = useState<null | "RETURNED" | "CANCELED">(null);

  if (!rental) return null;

  const copyLabel = rental.copy?.code ? rental.copy.code : "Original";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Detalhes do aluguel</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {rental.game.title}
              </Text>
            </View>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={26} color="#31358B" />
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.line}>
              <Text style={styles.key}>Aluno: </Text>
              {rental.user.name}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.key}>Email: </Text>
              {rental.user.email}
            </Text>
            {!!rental.user.phone && (
              <Text style={styles.line}>
                <Text style={styles.key}>Telefone: </Text>
                {rental.user.phone}
              </Text>
            )}
            <Text style={styles.line}>
              <Text style={styles.key}>Item: </Text>
              {copyLabel}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.key}>Período: </Text>
              {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
            </Text>
            <Text style={styles.line}>
              <Text style={styles.key}>Status: </Text>
              {rental.status}
            </Text>
          </View>

          {/* Ações */}
          <View style={{ gap: 12, marginTop: 14 }}>
            {(rental.status === "PENDING") && (
              <Pressable
                disabled={saving}
                onPress={() => onSetStatus(rental.id, "ACTIVE")}
                style={[styles.btn, { backgroundColor: "#31358B" }, saving && { opacity: 0.6 }]}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Marcar como ATIVO</Text>
              </Pressable>
            )}

            {(rental.status === "PENDING" || rental.status === "ACTIVE") && (
              <Pressable
                disabled={saving}
                onPress={() => setConfirmType("RETURNED")}
                style={[styles.btn, { backgroundColor: "#2E7D32" }, saving && { opacity: 0.6 }]}
              >
                <Ionicons name="log-in-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Marcar como DEVOLVIDO</Text>
              </Pressable>
            )}

            {(rental.status === "PENDING" || rental.status === "ACTIVE") && (
              <Pressable
                disabled={saving}
                onPress={() => setConfirmType("CANCELED")}
                style={[styles.btn, { backgroundColor: "#B3193A" }, saving && { opacity: 0.6 }]}
              >
                <Ionicons name="close-circle-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Cancelar aluguel</Text>
              </Pressable>
            )}
          </View>

          <ConfirmDeleteModal
            visible={confirmType === "RETURNED"}
            title="Confirmar devolução?"
            message="Ao confirmar, o item será liberado e o aluguel será finalizado."
            onCancel={() => setConfirmType(null)}
            onConfirm={() => {
              setConfirmType(null);
              onSetStatus(rental.id, "RETURNED");
            }}
          />

          <ConfirmDeleteModal
            visible={confirmType === "CANCELED"}
            title="Cancelar aluguel?"
            message="Ao cancelar, o item será liberado e o aluguel ficará como cancelado."
            onCancel={() => setConfirmType(null)}
            onConfirm={() => {
              setConfirmType(null);
              onSetStatus(rental.id, "CANCELED");
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, height: "90%" },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "800", color: "#31358B" },
  subtitle: { fontSize: 13, color: "#535353", marginTop: 2, maxWidth: 280 },

  card: { marginTop: 16, backgroundColor: "#F7F8FF", borderRadius: 18, padding: 14, gap: 6 },
  line: { color: "#333", fontWeight: "700" },
  key: { color: "#31358B", fontWeight: "900" },

  btn: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnText: { color: "#fff", fontWeight: "900" },
});