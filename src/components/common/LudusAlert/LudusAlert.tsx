import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type AlertType = "error" | "success" | "info";

interface AppAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
}

const config: Record<AlertType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  error: {
    icon: "alert-circle-outline",
    color: "#B3193A",
  },
  success: {
    icon: "checkmark-circle-outline",
    color: "#31358B",
  },
  info: {
    icon: "information-circle-outline",
    color: "#535353",
  },
};

export default function LudusAlert({
  visible,
  type,
  title,
  message,
  onClose,
}: AppAlertProps) {
  const { icon, color } = config[type];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} 
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name={icon} size={44} color={color} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: color, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, 
  },
  card: {
    width: "100%",
    maxWidth: 400, 
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    marginTop: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#6A6A6A",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
