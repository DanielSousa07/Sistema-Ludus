import BackButton from "@/src/components/common/BackButton";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { DocumentPicker } from "@/src/components/Profie/DocumentPicker";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { height } = Dimensions.get("window");
type AlertType = "error" | "success" | "info";

export default function DocumentsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // 1. Separamos a frente e o verso em estados diferentes
  const [docFront, setDocFront] = useState<string | null>(null);
  const [docBack, setDocBack] = useState<string | null>(null);
  const [addressProof, setAddressProof] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Controle do LudusAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    // 2. Validamos se os TRÊS documentos foram anexados
    if (!docFront || !docBack || !addressProof) {
      return showAlert(
        "info",
        "Faltam documentos",
        "Por favor, anexe a frente, o verso do seu documento e o comprovante de residência.",
      );
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // 3. Adicionamos os três arquivos no envio
      formData.append("documentFront", {
        uri: docFront,
        name: "docFront.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("documentBack", {
        uri: docBack,
        name: "docBack.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("addressProof", {
        uri: addressProof,
        name: "address.jpg",
        type: "image/jpeg",
      } as any);

      await api.patch("/users/me/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert(
        "success",
        "Enviado com sucesso!",
        "Seus documentos estão em análise. Você será notificado assim que aprovarmos.",
      );

      setTimeout(() => {
        setAlertVisible(false);
        router.back();
      }, 2000);
    } catch (error) {
      console.error(error);
      showAlert(
        "error",
        "Erro no envio",
        "Não foi possível enviar os documentos. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LoginBackground />
      <BackButton />

      <View style={styles.bottomArea}>
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <Text style={styles.title}>Validação de Conta</Text>
            <Text style={styles.subtitle}>
              Anexe seus documentos para liberar o aluguel de jogos.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Por que pedimos isso?</Text>
              <Text style={styles.infoText}>
                Para garantir a segurança do nosso acervo de jogos, precisamos
                confirmar sua identidade antes de liberar os aluguéis.
              </Text>
            </View>

            {user?.registrationStatus === "REJECTED" && (
              <View style={styles.rejectedBox}>
                <Text style={styles.rejectedTitle}>
                  Atenção: Documentos Recusados
                </Text>
                <Text style={styles.rejectedText}>
                  {user?.rejectReason ||
                    "Por favor, envie novas fotos mais nítidas."}
                </Text>
              </View>
            )}

            {/* Renderizando os TRÊS inputs de arquivo */}
            <DocumentPicker
              label="Documento - Frente"
              description="Lado com a sua foto (RG ou CNH)."
              imageUri={docFront}
              onImageSelected={setDocFront}
            />

            <DocumentPicker
              label="Documento - Verso"
              description="Lado com seus dados pessoais e filiação."
              imageUri={docBack}
              onImageSelected={setDocBack}
            />

            <DocumentPicker
              label="Comprovante de Residência"
              description="Conta de luz, água, internet ou fatura (Máx. 3 meses)."
              imageUri={addressProof}
              onImageSelected={setAddressProof}
            />

            <Pressable
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Enviando..." : "Enviar para Análise"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#04096E",
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    height: height * 0.85,
    padding: 28,
  },
  scroll: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#535353",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#535353",
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FBBC04",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B8860B",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#535353",
    lineHeight: 20,
  },
  rejectedBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#E62325",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  rejectedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E62325",
    marginBottom: 6,
  },
  rejectedText: {
    fontSize: 14,
    color: "#991B1B",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#04096E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
