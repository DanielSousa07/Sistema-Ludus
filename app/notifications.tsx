import HomeBackground from "@/src/components/Home/HomeBackground";
import { NavFooter } from "@/src/components/common/NavFooter";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  readAt?: string | null;
  createdAt: string;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `há ${days}d`;
}

function iconForType(type: string) {
  if (type.startsWith("RENTAL_")) return { name: "cube-outline" as const, color: "#31358B" };
  if (type.startsWith("RATING")) return { name: "star-outline" as const, color: "#FBBC04" };
  if (type.startsWith("FAVORITE")) return { name: "bookmark-outline" as const, color: "#31358B" };
  if (type.includes("VERIFY") || type.includes("EMAIL") || type.includes("PHONE")) return { name: "shield-checkmark-outline" as const, color: "#0A1F5C" };
  if (type.includes("LEVEL") || type.includes("POINTS")) return { name: "trophy-outline" as const, color: "#FBBC04" };
  return { name: "notifications-outline" as const, color: "#31358B" };
}

export default function NotificationsScreen() {
  const router = useRouter();

  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [tab, setTab] = useState<"all" | "unread">("all");

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.readAt);
  }, [items, tab]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    type MeResponse = {notifications: AppNotification[]; nextCursor?: string};
    try {
      const res = await api.get<MeResponse>("Notifications/me")
      setItems(res.data?.notifications ?? []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Não foi possível carregar notificações.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
    try {
      await api.post(`/notifications/read-all`);
    } catch {}
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HomeBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Notificações</Text>

        <Pressable onPress={markAllRead} style={styles.headerAction}>
          <Text style={styles.headerActionText}>Ler tudo</Text>
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab("all")} style={[styles.tab, tab === "all" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>Todas</Text>
          </Pressable>
          <Pressable onPress={() => setTab("unread")} style={[styles.tab, tab === "unread" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "unread" && styles.tabTextActive]}>Não lidas</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.subtle}>Carregando…</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.err}>{err}</Text>
            <Text onPress={load} style={styles.retry}>Tentar novamente</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="notifications-off-outline" size={44} color="#9AA0A6" />
            <Text style={styles.emptyTitle}>Sem notificações</Text>
            <Text style={styles.subtle}>Quando acontecer algo importante, vai aparecer aqui.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
            {filtered.map((n) => {
              const meta = iconForType(n.type);
              const isUnread = !n.readAt;

              return (
                <Pressable
                  key={n.id}
                  onPress={async () => {
                    await markRead(n.id);

                    const route = n.data?.route;
                    if (route) router.push(route);
                  }}
                  style={[styles.item, isUnread && styles.itemUnread]}
                >
                  <View style={[styles.itemIcon, isUnread && styles.itemIconUnread]}>
                    <Ionicons name={meta.name} size={18} color={meta.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.itemTopRow}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {n.title}
                      </Text>
                      <Text style={styles.itemTime}>{formatWhen(n.createdAt)}</Text>
                    </View>

                    <Text style={styles.itemBody} numberOfLines={2}>
                      {n.body}
                    </Text>

                    {isUnread && <Text style={styles.unreadTag}>NOVA</Text>}
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#B0B4C1" />
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontWeight: "900", fontSize: 18, flex: 1 },
  headerAction: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  headerActionText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    overflow: "hidden",
  },

  tabs: { flexDirection: "row", gap: 10, marginBottom: 12 },
  tab: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#F1F2F6" },
  tabActive: { backgroundColor: "#31358B" },
  tabText: { fontWeight: "900", color: "#4B4E5A", fontSize: 12 },
  tabTextActive: { color: "#fff" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  subtle: { marginTop: 10, color: "#7A7E8B", fontWeight: "700" },
  err: { color: "#E53935", fontWeight: "900", textAlign: "center" },
  retry: { marginTop: 12, color: "#31358B", fontWeight: "900" },

  emptyTitle: { marginTop: 10, fontWeight: "900", fontSize: 16, color: "#222" },

  item: {
    backgroundColor: "#F8F8FB",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  itemUnread: { backgroundColor: "#EEF0FF" },

  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(49,53,139,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  itemIconUnread: { backgroundColor: "rgba(49,53,139,0.16)" },

  itemTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  itemTitle: { fontWeight: "900", color: "#222", flex: 1 },
  itemTime: { fontWeight: "800", color: "#7A7E8B", fontSize: 12 },

  itemBody: { marginTop: 4, color: "#555", fontWeight: "700", fontSize: 12 },

  unreadTag: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#31358B",
    color: "#fff",
    fontWeight: "900",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
});