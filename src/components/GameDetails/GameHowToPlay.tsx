import React, { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

type PlayerState =
  | "unstarted"
  | "ended"
  | "playing"
  | "paused"
  | "buffering"
  | "cued"
  | "unknown";

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);

    
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || null;
    }

    
    const v = u.searchParams.get("v");
    if (v) return v;
    
    const embed = u.pathname.match(/\/embed\/([^/]+)/)?.[1];
    if (embed) return embed;

    
    const shorts = u.pathname.match(/\/shorts\/([^/]+)/)?.[1];
    if (shorts) return shorts;

    return null;
  } catch {
    return null;
  }
}

export function GameHowToPlay({ url, title }: { url?: string | null; title?: string }) {
  const [playing, setPlaying] = useState(false);

  const cleanUrl = useMemo(() => (url ?? "").trim(), [url]);

  const videoId = useMemo(() => {
    if (!cleanUrl) return null;
    return extractYoutubeId(cleanUrl);
  }, [cleanUrl]);

  if (!cleanUrl) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Nenhum tutorial cadastrado.</Text>
      </View>
    );
  }

  if (!videoId) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Link inválido</Text>
        <Text style={styles.fallbackText}>
          Esse link não parece ser do YouTube. Abra pelo navegador:
        </Text>

        <Pressable onPress={() => Linking.openURL(cleanUrl)} style={styles.openBtn}>
          <Text style={styles.openBtnText}>Abrir link</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.h1}>{title ? `Como jogar ${title}` : "Como jogar"}</Text>

      <View style={styles.playerCard}>
        <YoutubePlayer
          height={210}
          play={playing}
          videoId={videoId}
          onChangeState={(state: PlayerState) => {
            
            if (state === "ended") setPlaying(false);
          }}
          onError={() => {
          }}
        />
      </View>

      <View style={styles.row}>


        <Pressable onPress={() => Linking.openURL(cleanUrl)} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Abrir no YouTube</Text>
        </Pressable>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: "900", color: "#0A1F5C", marginBottom: 12 },

  playerCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
  },

  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FBBC04",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontWeight: "900", color: "#0A1F5C" },

  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontWeight: "900", color: "#31358B" },



  emptyWrap: { marginTop: 10, padding: 16, backgroundColor: "#F7F8FF", borderRadius: 16 },
  emptyText: { color: "#666", fontWeight: "700" },

  fallback: { marginTop: 10, padding: 16, backgroundColor: "#FFF4F4", borderRadius: 16 },
  fallbackTitle: { fontWeight: "900", color: "#E62325", fontSize: 16 },
  fallbackText: { marginTop: 6, color: "#444", fontWeight: "700" },
  openBtn: {
    marginTop: 10,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E62325",
    alignItems: "center",
    justifyContent: "center",
  },
  openBtnText: { color: "#fff", fontWeight: "900" },
});