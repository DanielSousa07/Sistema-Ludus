import ManageBackground from "@/src/components/Manage/ManageBackground";
import { ManageContainer } from "@/src/components/Manage/ManageContainer";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ManageCopiesModal } from "@/src/components/Manage/Copies/ManageCopiesModal";
import { ManageGameRowSimple } from "@/src/components/Manage/Copies/ManageGameRowSimple";

type Game = {
  id: string;
  title: string;
  cover?: string | null;
};

export default function CopiesScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [selected, setSelected] = useState<Game | null>(null);

  async function fetchGames() {
    setLoading(true);
    try {
      const res = await api.get<Game[]>("/games");
      setGames(res.data || []);
    } catch {
      setGames([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return games;
    return games.filter((g) => g.title.toLowerCase().includes(term));
  }, [q, games]);

  return (
    <View style={{ flex: 1 }}>
      <ManageBackground />

      <ManageContainer>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#31358B" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Gerenciar Exemplares</Text>
            <Text style={styles.subtitle}>Crie e controle os exemplares por jogo</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#535353" />
          <TextInput
            style={styles.input}
            placeholder="Buscar jogo..."
            value={q}
            onChangeText={setQ}
          />
        </View>

        {loading ? (
          <View style={{ paddingTop: 20 }}>
            <ActivityIndicator size="large" color="#31358B" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <ManageGameRowSimple item={item} onPress={() => setSelected(item)} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="albums-outline" size={46} color="#999" />
                <Text style={styles.emptyTitle}>Nenhum jogo encontrado</Text>
                <Text style={styles.emptySubtitle}>Tente buscar por outro nome.</Text>
              </View>
            }
          />
        )}

        <ManageCopiesModal
          visible={!!selected}
          game={selected}
          onClose={() => setSelected(null)}
        />
      </ManageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#31358B" },
  subtitle: { fontSize: 14, color: "#535353", marginTop: 2 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    marginBottom: 16,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: "#333" },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 28 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#31358B" },
  emptySubtitle: { marginTop: 6, fontSize: 14, color: "#777", textAlign: "center" },
});