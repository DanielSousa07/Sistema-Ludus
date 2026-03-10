import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const RED = "#B3193A";
const BLUE = "#04096E";
const YELLOW = "#FFC107";

const DEFAULT_AVATAR = require("../../../assets/profile-default.png");

type LeaderRow = {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  avatar?: string | null;
  picture?: string | null;
};

type MeRow = {
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  rank: number;
  avatar?: string | null;
  picture?: string | null;
};

function rankBadgeStyle(rank: number) {
  if (rank === 1) return { bg: "rgba(255,193,7,0.22)", fg: "#8A5B00" };
  if (rank === 2) return { bg: "rgba(255,193,7,0.14)", fg: "#8A5B00" };
  if (rank === 3) return { bg: "rgba(179,25,58,0.12)", fg: RED };
  return { bg: "rgba(4,9,110,0.08)", fg: BLUE };
}

function Avatar({
  uri,
  picture,
  size = 38,
  radius = 14,
}: {
  uri?: string | null;
  picture?: string | null;
  size?: number;
  radius?: number;
}) {
  const sourceUri = uri || picture || null;

  if (sourceUri) {
    return (
      <Image
        source={{ uri: sourceUri }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: "#EAEAEA",
        }}
      />
    );
  }

  return (
    <Image
      source={DEFAULT_AVATAR}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: "#EAEAEA",
      }}
    />
  );
}

export default function RankingScreen() {
  const [me, setMe] = useState<MeRow | null>(null);
  const [data, setData] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setErr(null);

    try {
      const [leaderRes, meRes] = await Promise.all([
        api.get<LeaderRow[]>("/engagement/leaderboard", { params: { limit: 50 } }),
        api.get<MeRow>("/engagement/me"),
      ]);

      setData(Array.isArray(leaderRes.data) ? leaderRes.data : []);
      setMe(meRes.data ?? null);
    } catch (e) {
      console.error("RankingScreen error:", e);
      setErr("Não foi possível carregar o ranking.");
      setData([]);
      setMe(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(false);
  }, []);

  const myBox = useMemo(() => {
    if (!me) return null;

    const lvl = me.levelName ?? `Nível ${me.level}`;

    return (
      <View style={styles.meBox}>
        <View style={styles.meLeft}>
          <Avatar uri={me.avatar} picture={me.picture} size={48} radius={20} />

          <View style={{ flex: 1 }}>
            <Text style={styles.meTitle} numberOfLines={1}>
              {me.name}
            </Text>
            <Text style={styles.meSub} numberOfLines={1}>
              {lvl} • posição #{me.rank}
            </Text>
          </View>
        </View>

        <View style={styles.mePtsPill}>
          <Ionicons name="flash" size={14} color="#fff" />
          <Text style={styles.mePtsText}>{me.points} pts</Text>
        </View>
      </View>
    );
  }, [me]);

  return (
    <View style={styles.page}>
      <LoginBackground />
      <BackButton />

      <View style={styles.card}>
        <Pressable style={styles.redBtn} onPress={() => setShowRules((s) => !s)}>
          <Ionicons name="information-circle" size={18} color="#fff" />
          <Text style={styles.redBtnText}>Como ganhar pontos</Text>
        </Pressable>

        {showRules && (
          <View style={styles.rulesBox}>
            <Text style={styles.rulesTitle}>Regras rápidas</Text>

            <View style={styles.ruleRow}>
              <View style={[styles.dot, { backgroundColor: YELLOW }]} />
              <Text style={styles.ruleText}>+7 pts ao finalizar um aluguel</Text>
            </View>

            <View style={styles.ruleRow}>
              <View style={[styles.dot, { backgroundColor: RED }]} />
              <Text style={styles.ruleText}>+5 pts ao delvolver</Text>
            </View>

            <View style={styles.ruleRow}>
              <View style={[styles.dot, { backgroundColor: BLUE }]} />
              <Text style={styles.ruleText}>+3 pts na 1ª avaliação do jogo</Text>
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.centerText}>Carregando…</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.errText}>{err}</Text>
            <Pressable onPress={() => load(false)} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.userId}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
            contentContainerStyle={{ paddingBottom: 22 }}
            ListHeaderComponent={
              <>
                {myBox}
                <Text style={styles.sectionTitle}>Top usuários</Text>
              </>
            }
            renderItem={({ item }) => {
              const isMe = me?.userId === item.userId;
              const lvl = item.levelName ?? `Nível ${item.level}`;
              const badge = rankBadgeStyle(item.rank);

              return (
                <View style={[styles.row, isMe && styles.rowMe]}>
                  <View style={[styles.rankBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.rankBadgeText, { color: badge.fg }]}>{item.rank}</Text>
                  </View>

                  <Avatar uri={item.avatar} picture={item.picture} radius={150}/>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                      {isMe ? " (você)" : ""}
                    </Text>
                    <Text style={styles.meta} numberOfLines={1}>
                      {lvl}
                    </Text>
                  </View>

                  <View style={styles.pointsPill}>
                    <Ionicons name="flash" size={14} color={BLUE} />
                    <Text style={styles.pointsText}>{item.points}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },

  card: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  redBtn: {
    backgroundColor: RED,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },

  redBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  rulesBox: {
    backgroundColor: "rgba(4,9,110,0.04)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  rulesTitle: {
    fontWeight: "900",
    color: "#222",
    marginBottom: 8,
  },

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  ruleText: {
    color: "#444",
    fontWeight: "700",
    fontSize: 12,
  },

  center: {
    paddingVertical: 26,
    alignItems: "center",
  },

  centerText: {
    marginTop: 10,
    color: "#666",
    fontWeight: "700",
  },

  errText: {
    color: RED,
    fontWeight: "900",
    textAlign: "center",
  },

  retryBtn: {
    marginTop: 12,
    backgroundColor: "rgba(4,9,110,0.10)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  retryText: {
    color: BLUE,
    fontWeight: "900",
  },

  meBox: {
    backgroundColor: BLUE,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },

  meLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  meTitle: {
    color: "#fff",
    fontWeight: "900",
  },

  meSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },

  mePtsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },

  mePtsText: {
    color: "#fff",
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#222",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },

  rowMe: {
    borderColor: "rgba(179,25,58,0.28)",
    backgroundColor: "rgba(179,25,58,0.04)",
  },

  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  rankBadgeText: {
    fontWeight: "900",
  },

  name: {
    fontWeight: "900",
    color: "#222",
  },

  meta: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },

  pointsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,193,7,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },

  pointsText: {
    fontWeight: "900",
    color: BLUE,
  },
});