import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { ConfirmDeleteModal } from "../EditGames/ConfirmDeleteModal";

type Game = { id: string; title: string };

type Copy = {
  id: string;
  number: number;
  code?: string | null;
  condition?: string | null;
  available: boolean;
};

export function ManageCopiesModal({
  visible,
  game,
  onClose,
}: {
  visible: boolean;
  game: Game | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [copies, setCopies] = useState<Copy[]>([]);
  const [creating, setCreating] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editCondition, setEditCondition] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);



  async function fetchCopies() {
    if (!game) return;
    setLoading(true);
    try {
      const res = await api.get<Copy[]>(`/games/${game.id}/copies`);
      setCopies(res.data || []);
    } catch {
      setCopies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (visible && game) fetchCopies();

  }, [visible, game?.id]);

  async function createCopy() {
    if (!game) return;
    setCreating(true);
    try {
      const res = await api.post<Copy>(`/games/${game.id}/copies`, {});
      setCopies((prev) => [res.data, ...prev]);
    } catch {
      Alert.alert("Erro", "Não foi possível criar o exemplar.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleAvailable(copyId: string, next: boolean) {
    try {
      const res = await api.patch<Copy>(`/games/copies/${copyId}`, { available: next });
      setCopies((prev) => prev.map((c) => (c.id === copyId ? res.data : c)));
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o exemplar.");
    }
  }

  async function saveCondition(copyId: string) {
    const text = editCondition.trim();
    try {
      const res = await api.patch<Copy>(`/games/copies/${copyId}`, { condition: text });
      setCopies((prev) => prev.map((c) => (c.id === copyId ? res.data : c)));
      setEditId(null);
      setEditCondition("");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a condição.");
    }
  }

  async function deleteCopy(copyId: string) {
    try {
      await api.delete(`/games/copies/${copyId}`);
      setCopies((prev) => prev.filter((c) => c.id !== copyId));
    } catch (e: any) {
      const status = e?.response?.status;
      const code = e?.response?.data?.code;

      if (status === 409 && code === "COPY_HAS_RENTALS") {
        Alert.alert(
          "Não foi possível excluir",
          "Esse exemplar possui histórico de aluguel. Para manter os registros, ele não pode ser excluído.",
          [{ text: "Entendi" }]
        );
        return;
      }

      Alert.alert("Erro", "Não foi possível excluir o exemplar.");
    }
  }

  if (!game) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Exemplares</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {game.title}
              </Text>
            </View>
            

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={26} color="#31358B" />
            </Pressable>
          </View>

          <Pressable onPress={createCopy} disabled={creating} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>{creating ? "Criando..." : "Adicionar exemplar"}</Text>
          </Pressable>

          {loading ? (
            <View style={{ paddingTop: 18 }}>
              <ActivityIndicator size="large" color="#31358B" />
            </View>
          ) : copies.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="albums-outline" size={46} color="#999" />
              <Text style={styles.emptyTitle}>Nenhum exemplar ainda</Text>
              <Text style={styles.emptySubtitle}>Clique em “Adicionar exemplar”.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 14, gap: 12 }}>
              {copies.map((c) => {
                const isEditing = editId === c.id;
                return (
                  <View key={c.id} style={styles.copyRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.copyCode}>{c.code ?? `#${c.number}`}</Text>

                      {isEditing ? (
                        <View style={styles.editLine}>
                          <TextInput
                            value={editCondition}
                            onChangeText={setEditCondition}
                            placeholder="Condição (ex: Bom, Usado...)"
                            style={styles.input}
                          />
                          <Pressable onPress={() => saveCondition(c.id)} style={styles.saveMini}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => {
                            setEditId(c.id);
                            setEditCondition(c.condition ?? "");
                          }}
                        >
                          <Text style={styles.condition}>
                            {c.condition?.trim() ? `Condição: ${c.condition}` : "Definir condição"}
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    <View style={styles.rightCol}>
                      <View style={styles.switchWrap}>
                        <Text style={styles.avText}>{c.available ? "Disp." : "Ind."}</Text>
                        <Switch value={c.available} onValueChange={(v) => toggleAvailable(c.id, v)} />
                      </View>

                      <Pressable onPress={() => setConfirmDeleteId(c.id)} style={styles.trash}>
                        <Ionicons name="trash-outline" size={18} color="#E62325" />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <ConfirmDeleteModal
            visible={!!confirmDeleteId}
            title="Excluir exemplar?"
            message="Tem certeza? Essa ação não poderá ser desfeita."
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={() => {
              const id = confirmDeleteId!;
              setConfirmDeleteId(null);
              deleteCopy(id);
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

  addBtn: {
    marginTop: 16,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#31358B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: 28 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#31358B" },
  emptySubtitle: { marginTop: 6, fontSize: 14, color: "#777", textAlign: "center" },

  copyRow: {
    backgroundColor: "#F7F8FF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  copyCode: { fontSize: 16, fontWeight: "900", color: "#31358B" },
  condition: { marginTop: 6, fontSize: 13, fontWeight: "700", color: "#8B8EA1" },

  rightCol: { alignItems: "flex-end", justifyContent: "space-between", gap: 10 },
  switchWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  avText: { fontSize: 12, fontWeight: "900", color: "#535353" },

  trash: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFE9EA",
    alignItems: "center",
    justifyContent: "center",
  },

  editLine: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: "#F0F2FF",
    fontWeight: "700",
    color: "#333",
  },
  saveMini: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#31358B",
    alignItems: "center",
    justifyContent: "center",
  },
});