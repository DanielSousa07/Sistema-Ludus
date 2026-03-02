import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type MeRow = {
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  rank: number;
};

const PRIMARY = "#31358B";     
const YELLOW = "#FFC107";     
const RED = "#E53935";         

function compactLevel(levelName?: string, level?: number) {
  if (levelName) return levelName;
  if (level) return `Nível ${level}`;
  return "Nível";
}

export function EngagementPreview() {
  const router = useRouter();
  const [me, setMe] = useState<MeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr(false);

      try {
        const meRes = await api.get<MeRow>("/engagement/me");
        if (!mounted) return;
        setMe(meRes.data ?? null);
      } catch (e: any) {
  const status = e?.response?.status;
  const code = e?.response?.data?.code;

  if (status === 403 && (code === "EMAIL_NOT_VERIFIED" || code === "PHONE_NOT_VERIFIED")) {
    setMe(null);
    setErr(false);
    return;
  }

  setErr(true);
  setMe(null);
}
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const badge = useMemo(() => {
    const r = me?.rank ?? null;
    if (!r) return { bg: "rgba(49,53,139,0.10)", fg: PRIMARY };
    if (r <= 3) return { bg: "rgba(255,193,7,0.18)", fg: "#9A6B00" };
    if (r <= 10) return { bg: "rgba(229,57,53,0.12)", fg: RED };
    return { bg: "rgba(49,53,139,0.10)", fg: PRIMARY };
  }, [me?.rank]);

  return (
    <Pressable style={styles.wrap} onPress={() => router.push("/ranking")}>
      <View style={styles.left}>
        <View style={styles.icon}>
          <Ionicons name="trophy" size={16} color={PRIMARY} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Ranking</Text>

          {loading ? (
            <View style={styles.inline}>
              <ActivityIndicator size="small" />
              <Text style={styles.subtle}>Carregando…</Text>
            </View>
          ) : err ? (
            <Text style={styles.errorText} numberOfLines={1}>
              Falha ao carregar • toque para abrir
            </Text>
          ) : me ? (
            <Text style={styles.subtle} numberOfLines={1}>
              {compactLevel(me.levelName, me.level)} • {me.points} pts
            </Text>
          ) : (
            <Text style={styles.subtle} numberOfLines={1}>
              Toque para ver
            </Text>
          )}
        </View>
      </View>

      <View style={styles.right}>
        
        <View style={[styles.rankBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.rankText, { color: badge.fg }]}>
            {me?.rank ? `#${me.rank}` : "#—"}
          </Text>
        </View>

        <View style={styles.chev}>
          <Ionicons name="chevron-forward" size={16} color={PRIMARY} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  
  wrap: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 13,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  icon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(49,53,139,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: { fontSize: 14, fontWeight: "900", color: "#222" },

  subtle: { fontSize: 12, color: "#777", marginTop: 2, fontWeight: "600" },

  inline: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 2 },

  errorText: { fontSize: 12, color: RED, marginTop: 2, fontWeight: "800" },

  right: { flexDirection: "row", alignItems: "center", gap: 8 },

  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontWeight: "900", fontSize: 12 },

  chev: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(49,53,139,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});