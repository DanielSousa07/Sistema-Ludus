import { Image, StyleSheet, Text, View } from "react-native";

const DEFAULT_AVATAR = require("../../../../assets/profile-default.png");

type Props = {
  name: string;
  email: string;
  avatar?: string | null;
  picture?: string | null;
  points: number;
  level: number;
  levelLabel: string;
};

export function AccountSummaryCard({
  name,
  email,
  avatar,
  picture,
  points,
  level,
  levelLabel,
}: Props) {
  const displayAvatar = avatar || picture || null;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {displayAvatar ? (
          <Image key={displayAvatar} source={{ uri: displayAvatar }} style={styles.avatar} />
        ) : (
          <Image source={DEFAULT_AVATAR} style={styles.avatar} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.badges}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Nv. {level}</Text>
            </View>

            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>{points} pts</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.levelName}>{levelLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F8FF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    marginBottom: 24,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 999,
    backgroundColor: "#EAEAEA",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  name: {
    fontSize: 18,
    fontWeight: "900",
    color: "#31358B",
  },

  email: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#6E7385",
  },

  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  levelBadge: {
    backgroundColor: "#FBBC04",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  levelBadgeText: {
    color: "#0A1F5C",
    fontWeight: "900",
    fontSize: 12,
  },

  pointsBadge: {
    backgroundColor: "#E62325",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pointsBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  levelName: {
    marginTop: 14,
    color: "#31358B",
    fontSize: 14,
    fontWeight: "800",
  },
});