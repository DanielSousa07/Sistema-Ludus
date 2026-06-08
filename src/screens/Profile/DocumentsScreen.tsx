import BackButton from "@/src/components/common/BackButton";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { DocumentPicker } from "@/src/components/Profie/DocumentPicker";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
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
  const { user, refreshUser } = useAuth();

  // 👇 INICIAMOS OS ESTADOS COM AS FOTOS QUE JÁ ESTÃO SALVAS NO BANCO 👇
  const [docFront, setDocFront] = useState<string | null>(
    user?.documentFrontImage || null,
  );
  const [docBack, setDocBack] = useState<string | null>(
    user?.documentBackImage || null,
  );
  const [addressProof, setAddressProof] = useState<string | null>(
    user?.addressProof || null,
  );
  const [selfieWithId, setSelfieWithId] = useState<string | null>(
    user?.selfieWithId || null,
  );

  const [loading, setLoading] = useState(false);

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
    // Validação se os 4 documentos estão preenchidos na tela
    if (!docFront || !docBack || !addressProof || !selfieWithId) {
      return showAlert(
        "info",
        "Faltam documentos",
        "Por favor, anexe todas as fotos solicitadas, incluindo a sua selfie com o documento.",
      );
    }

    setLoading(true);
    try {
      const formData = new FormData();
      let hasNewFile = false; // Controle para saber se ele realmente trocou alguma foto

      // Só enviamos para a API as fotos NOVAS (que não começam com 'http' do banco de dados)
      if (docFront && !docFront.startsWith("http")) {
        formData.append("documentFront", {
          uri: docFront,
          name: "docFront.jpg",
          type: "image/jpeg",
        } as any);
        hasNewFile = true;
      }
      if (docBack && !docBack.startsWith("http")) {
        formData.append("documentBack", {
          uri: docBack,
          name: "docBack.jpg",
          type: "image/jpeg",
        } as any);
        hasNewFile = true;
      }
      if (addressProof && !addressProof.startsWith("http")) {
        formData.append("addressProof", {
          uri: addressProof,
          name: "address.jpg",
          type: "image/jpeg",
        } as any);
        hasNewFile = true;
      }
      if (selfieWithId && !selfieWithId.startsWith("http")) {
        formData.append("selfieWithId", {
          uri: selfieWithId,
          name: "selfie.jpg",
          type: "image/jpeg",
        } as any);
        hasNewFile = true;
      }

      // Se ele não mudou nenhuma foto e apertou enviar, avisamos
      if (!hasNewFile) {
        setLoading(false);
        return showAlert(
          "info",
          "Nenhuma alteração",
          "Você não enviou nenhuma foto nova.",
        );
      }

      await api.patch("/users/me/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refreshUser();

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

            {/* 👇 CAIXA AMARELA RESTAURADA AQUI 👇 */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Por que pedimos isso?</Text>
              <Text style={styles.infoText}>
                Para garantir a segurança do nosso acervo de jogos, precisamos
                confirmar sua identidade antes de liberar os aluguéis.
              </Text>
            </View>

            {/* Dicas de Fotografia */}
            <View style={styles.tipsBox}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={20} color="#1D4ED8" />
                <Text style={styles.tipsTitle}>
                  Dicas para aprovação rápida
                </Text>
              </View>
              <Text style={styles.tipsText}>
                • Vá para um ambiente bem iluminado.
              </Text>
              <Text style={styles.tipsText}>
                • Retire o documento do plástico.
              </Text>
              <Text style={styles.tipsText}>
                • Evite reflexos de luz e flash estourado.
              </Text>
              <Text style={styles.tipsText}>
                • Certifique-se de que as letras estão nítidas.
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

            <DocumentPicker
              label="1. Selfie segurando o Documento"
              description="Tire uma foto sua segurando a frente do seu RG ou CNH próximo ao rosto. Não tampe nenhuma informação."
              imageUri={selfieWithId}
              onImageSelected={setSelfieWithId}
            />

            <DocumentPicker
              label="2. Documento - Frente"
              description="Lado com a sua foto (RG ou CNH)."
              imageUri={docFront}
              onImageSelected={setDocFront}
            />

            <DocumentPicker
              label="3. Documento - Verso"
              description="Lado com seus dados pessoais e assinatura."
              imageUri={docBack}
              onImageSelected={setDocBack}
            />

            <DocumentPicker
              label="4. Comprovante de Residência"
              description="Conta de luz, água ou internet no seu nome ou de pais (Máx. 3 meses)."
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
  root: { flex: 1, backgroundColor: "#04096E" },
  bottomArea: { flex: 1, justifyContent: "flex-end" },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    height: height * 0.85,
    padding: 28,
  },
  scroll: { paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#535353", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#535353", marginBottom: 16 },

  // Estilo da Caixa Amarela (Restaurada)
  infoBox: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FBBC04",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
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

  // Estilo do quadro de Dicas (Azul)
  tipsBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  tipsTitle: { fontSize: 15, fontWeight: "700", color: "#1E3A8A" },
  tipsText: {
    fontSize: 13,
    color: "#1D4ED8",
    lineHeight: 22,
    fontWeight: "500",
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
  rejectedText: { fontSize: 14, color: "#991B1B", lineHeight: 20 },
  button: {
    backgroundColor: "#04096E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
