import BackButton from "@/src/components/common/BackButton";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BLUE = "#31358B";
const RED = "#E62325";
const YELLOW = "#FBBC04";

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  accent = "blue",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  accent?: "blue" | "red" | "yellow";
}) {
  const iconBg =
    accent === "red" ? "#FFE9EA" : accent === "yellow" ? "#FFF5D8" : "#EEF0FF";

  const iconColor =
    accent === "red" ? RED : accent === "yellow" ? "#9A6B00" : BLUE;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.itemIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={BLUE} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function handleOpenNotificationSettings() {
    try {
      await Linking.openSettings();
    } catch {}
  }

  async function handleConfirmLogout() {
    try {
      setLeaving(true);
      await logout();
      setLogoutOpen(false);
      router.replace("/onboarding");
    } finally {
      setLeaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <BackButton />

      <View style={styles.topTitle}>
        <Text style={styles.h1}>Configurações</Text>
      </View>

      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <View style={styles.list}>
            <SettingsItem
              icon="notifications-outline"
              title="Notificações"
              subtitle="Abra as configurações do aparelho para ativar ou revisar permissões"
              onPress={handleOpenNotificationSettings}
              accent="yellow"
            />

            <SettingsItem
              icon="document-text-outline"
              title="Termos de uso"
              subtitle="Consulte as regras e condições de uso do Ludus"
              onPress={() => router.push("/terms")}
              accent="red"
            />

            <SettingsItem
              icon="shield-checkmark-outline"
              title="Política de privacidade"
              subtitle="Veja como os dados da sua conta são utilizados no aplicativo"
              onPress={() => router.push("/privacy-policy")}
              accent="blue"
            />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.9}
            onPress={() => setLogoutOpen(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={logoutOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={24} color={RED} />
            </View>

            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalMessage}>
              Você realmente deseja encerrar sua sessão no Ludus?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setLogoutOpen(false)}
                disabled={leaving}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmBtn, leaving && { opacity: 0.7 }]}
                onPress={handleConfirmLogout}
                disabled={leaving}
              >
                <Text style={styles.confirmText}>
                  {leaving ? "Saindo..." : "Sair"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },

  topTitle: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 90,
  },

  h1: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  sheet: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  sheetContent: {
    paddingBottom: 30,
  },

  list: {
    gap: 12,
  },

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  itemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: BLUE,
  },

  itemSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#666D7E",
    fontWeight: "700",
  },

  logoutBtn: {
    marginTop: 22,
    height: 56,
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
  },

  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFE9EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: BLUE,
  },

  modalMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#666D7E",
    fontWeight: "700",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: BLUE,
    fontWeight: "900",
  },

  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "900",
  },
});