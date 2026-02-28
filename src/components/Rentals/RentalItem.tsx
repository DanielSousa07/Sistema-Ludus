import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type RentalItemModel = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  game: { id: string; title: string; cover?: string | null };
  copy?: { id: string; code?: string | null; number: number } | null;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function statusLabel(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "PENDING" || s === "ACTIVE") return { text: "Em andamento", color: "#2FA84F" };
  if (s === "RETURNED") return { text: "Devolvido", color: "#31358B" };
  if (s === "CANCELED") return { text: "Cancelado", color: "#B3193A" };
  return { text: status || "—", color: "#6A6A6A" };
}

export default function RentalItem({ rental }: { rental: RentalItemModel }) {
  const router = useRouter();
  const st = statusLabel(rental.status);

  const copyLabel =
    rental.copy?.number != null
      ? `Exemplar #${rental.copy.number}${rental.copy.code ? ` • ${rental.copy.code}` : ""}`
      : "Jogo original";

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/game/[id]", params: { id: rental.game.id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      {rental.game.cover ? (
        <Image source={{ uri: rental.game.cover }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#EEE" }]} />
      )}

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {rental.game.title}
          </Text>

          <View style={[styles.badge, { backgroundColor: st.color }]}>
            <Text style={styles.badgeText}>{st.text}</Text>
          </View>
        </View>

        <View style={styles.subRow}>
          <Ionicons name="cube-outline" size={14} color="#8B8EA1" />
          <Text style={styles.subText} numberOfLines={1}>
            {copyLabel}
          </Text>
        </View>

        <View style={styles.subRow}>
          <Ionicons name="calendar-outline" size={14} color="#8B8EA1" />
          <Text style={styles.subText}>
            {fmtDate(rental.startDate)} • até {fmtDate(rental.endDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8F8FB",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
  width: 84,
  aspectRatio: 1, 
  borderRadius: 16,
  backgroundColor: "#EEE",
},
  info: { flex: 1, marginLeft: 12 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { flex: 1, fontSize: 16, fontWeight: "900", color: "#2C2C2C" },
  badge: { paddingHorizontal: 10, height: 26, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  subText: { color: "#8B8EA1", fontWeight: "700", fontSize: 13, flex: 1 },
});