import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

type ComponentItem = {
  id: string;
  name: string;
  quantity: number;
};

export function GameComponentsModal({
  visible,
  gameId,
  gameTitle,
  onClose,
}: {
  visible: boolean;
  gameId: string | null;
  gameTitle?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const qtyNum = useMemo(() => {
    const n = Number(quantity);
    return Number.isFinite(n) ? Math.floor(n) : 1;
  }, [quantity]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ComponentItem | null>(null);

  async function load() {
    if (!gameId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get(`/games/${gameId}/components`);
      setItems(res.data || []);
    } catch (e: any) {
      setItems([]);
      setErr(e?.response?.data?.error || "Não foi possível carregar componentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!visible || !gameId) return;
    setName("");
    setQuantity("1");
    load();
  }, [visible, gameId]);

  async function addComponent() {
    if (!gameId) return;

    const clean = name.trim();
    if (!clean) {
      setErr("Digite o nome do componente.");
      return;
    }
    if (qtyNum < 1) {
      setErr("Quantidade inválida.");
      return;
    }

    setErr(null);
    try {
      const res = await api.post(`/games/${gameId}/components`, {
        name: clean,
        quantity: qtyNum,
      });
      setItems((prev) => [res.data, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setQuantity("1");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Erro ao adicionar componente.");
    }
  }

  async function inc(id: string) {
    const current = items.find((x) => x.id === id);
    if (!current || !gameId) return;

    const nextQty = current.quantity + 1;
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, quantity: nextQty } : x)));

    try {
      await api.patch(`/games/${gameId}/components/${id}`, { quantity: nextQty });
    } catch {
      setItems((prev) => prev.map((x) => (x.id === id ? current : x)));
    }
  }

  async function dec(id: string) {
    const current = items.find((x) => x.id === id);
    if (!current || !gameId) return;
    if (current.quantity <= 1) return;

    const nextQty = current.quantity - 1;
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, quantity: nextQty } : x)));

    try {
      await api.patch(`/games/${gameId}/components/${id}`, { quantity: nextQty });
    } catch {
      setItems((prev) => prev.map((x) => (x.id === id ? current : x)));
    }
  }

  async function removeNow() {
    if (!gameId || !toDelete) return;
    const backup = toDelete;

    setItems((prev) => prev.filter((x) => x.id !== backup.id));

    try {
      await api.delete(`/games/${gameId}/components/${backup.id}`);
    } catch {
      setItems((prev) => [backup, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    } finally {
      setToDelete(null);
    }
  }

  if (!gameId) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Componentes</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {gameTitle ?? "Jogo"}
              </Text>
            </View>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={26} color={LUDUS.blue} />
            </Pressable>
          </View>

          <View style={styles.addCard}>
            <View style={styles.inputWrap}>
              <Ionicons name="cube-outline" size={18} color={LUDUS.blue} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: Cartas, Dados, Peões..."
                placeholderTextColor="#666"
                style={styles.input}
              />
            </View>

            <View style={styles.qtyRow}>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Ionicons name="layers-outline" size={18} color={LUDUS.blue} />
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Quantidad"
                  keyboardType="number-pad"
                  placeholderTextColor="#666"
                  style={styles.input}
                />
              </View>

              <Pressable onPress={addComponent} style={styles.addBtn}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Adicionar</Text>
              </Pressable>
            </View>

            {!!err && <Text style={styles.err}>{err}</Text>}
          </View>

          {loading ? (
            <View style={{ paddingTop: 18 }}>
              <ActivityIndicator size="large" color={LUDUS.blue} />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="cube-outline" size={46} color="#999" />
              <Text style={styles.emptyTitle}>Nenhum componente</Text>
              <Text style={styles.emptySubtitle}>Adicione itens acima (ex: 120 cartas).</Text>
            </View>
          ) : (
            <View style={{ marginTop: 16, gap: 12 }}>
              {items.map((c) => (
                <View key={c.id} style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <Text style={styles.rowSub}>Quantidade</Text>
                  </View>

                  <View style={styles.counter}>
                    <Pressable onPress={() => dec(c.id)} style={styles.counterBtn} hitSlop={10}>
                      <Ionicons name="remove" size={16} color={LUDUS.blue} />
                    </Pressable>

                    <Text style={styles.counterText}>{c.quantity}</Text>

                    <Pressable onPress={() => inc(c.id)} style={styles.counterBtn} hitSlop={10}>
                      <Ionicons name="add" size={16} color={LUDUS.blue} />
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() => {
                      setToDelete(c);
                      setConfirmOpen(true);
                    }}
                    style={styles.trashBtn}
                    hitSlop={10}
                  >
                    <Ionicons name="trash-outline" size={18} color={LUDUS.red} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <ConfirmDeleteModal
        visible={confirmOpen}
        title="Excluir componente?"
        message={toDelete ? `Remover "${toDelete.name}" desse jogo?` : "Tem certeza?"}
        onCancel={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
        onConfirm={() => {
          setConfirmOpen(false);
          removeNow();
        }}
      />
    </Modal>
  );
}

const LUDUS = {
  blue: "#31358B",
  red: "#E62325",
  yellow: "#FBBC04",
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 22,
    height: "88%",
  },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "900", color: LUDUS.blue },
  subtitle: { fontSize: 13, color: "#535353", marginTop: 2, maxWidth: 260 },

  addCard: {
    backgroundColor: "#F7F8FF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.12)",
  },

  inputWrap: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  input: { flex: 1, fontSize: 15, color: "#222", fontWeight: "700" },

  qtyRow: { flexDirection: "row", gap: 10, marginTop: 10 },

  addBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: LUDUS.blue,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "900" },

  err: { marginTop: 10, color: LUDUS.red, fontWeight: "800" },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 28 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "800", color: LUDUS.blue },
  emptySubtitle: { marginTop: 6, fontSize: 14, color: "#777", textAlign: "center" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FF",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.10)",
  },
  rowName: { fontSize: 15, fontWeight: "900", color: LUDUS.blue },
  rowSub: { marginTop: 3, fontSize: 12, fontWeight: "700", color: "#6E6E6E" },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    height: 42,
    paddingHorizontal: 8,
    gap: 10,
  },
  counterBtn: { width: 28, height: 28, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  counterText: { minWidth: 18, textAlign: "center", fontWeight: "900", color: "#222" },

  trashBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(230,35,37,0.18)",
  },
});