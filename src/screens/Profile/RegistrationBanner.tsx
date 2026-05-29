import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export function RegistrationBanner() {
  const router = useRouter();
  const { user } = useAuth();

  const isIfmaMode = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

  // ==========================================
  // LÓGICA MODO IFMA (SUAP)
  // ==========================================
  if (isIfmaMode) {
    if (user?.isAcademicVerified) return null;

    return (
      <Pressable
        style={styles.containerWarning}
        onPress={() => router.push("/suap-verify")}
      >
        <View style={styles.iconWrapWarning}>
          <Ionicons name="school" size={24} color="#B8860B" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.titleWarn}>Vínculo Acadêmico</Text>
          <Text style={styles.subtitleWarn}>
            Verifique seu SUAP para liberar os aluguéis no campus Timon.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#B8860B" />
      </Pressable>
    );
  }

  // ==========================================
  // LÓGICA MODO PADRÃO (SaaS / DOCUMENTOS)
  // ==========================================

  // 1. Aprovado: some da tela
  if (user?.registrationStatus === "APPROVED") return null;

  const isRejected = user?.registrationStatus === "REJECTED";

  // Verifica se o usuário já tem alguma foto salva no banco
  const hasSentDocs = !!(user as any)?.documentFrontImage;

  const isAnalysis = user?.registrationStatus === "PENDING" && hasSentDocs;

  // 2. Em Análise: Banner Azul (Informativo, sem clique)
  if (isAnalysis) {
    return (
      <View style={styles.containerInfo}>
        <View style={styles.iconWrapInfo}>
          <Ionicons name="time" size={24} color="#1D4ED8" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.titleInfo}>Em Análise</Text>
          <Text style={styles.subtitleInfo}>
            Seus documentos estão sendo avaliados pela nossa equipe. Aguarde a
            aprovação!
          </Text>
        </View>
      </View>
    );
  }

  // 3. Rejeitado: Banner Vermelho (Clicável para reenviar)
  if (isRejected) {
    return (
      <Pressable
        style={styles.containerError}
        onPress={() => router.push("/profile/documents")}
      >
        <View style={styles.iconWrapError}>
          <Ionicons name="alert-circle" size={24} color="#DC2626" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.titleError}>Atenção aos seus documentos</Text>
          <Text style={styles.subtitleError}>
            Houve um problema. Toque aqui para ver o motivo e reenviar as fotos.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#DC2626" />
      </Pressable>
    );
  }

  // 4. Pendente (nunca enviou): Banner Amarelo (Clicável)
  return (
    <Pressable
      style={styles.containerWarning}
      onPress={() => router.push("/profile/documents")}
    >
      <View style={styles.iconWrapWarning}>
        <Ionicons name="warning" size={24} color="#B8860B" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.titleWarn}>Termine seu cadastro!</Text>
        <Text style={styles.subtitleWarn}>
          Envie seus documentos para liberar o aluguel de jogos do acervo.
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B8860B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },

  // ESTILOS: AMARELO (Avisos e Ações Pendentes)
  containerWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderColor: "#FBBC04",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20, // <- Adicionado
    marginTop: 16, // <- Adicionado
    marginBottom: 8, // <- Adicionado
  },
  iconWrapWarning: {
    backgroundColor: "#FEF08A",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleWarn: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9A6B00",
    marginBottom: 2,
  },
  subtitleWarn: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 18,
  },

  // ESTILOS: VERMELHO (Rejeição)
  containerError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#E62325",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20, // <- Adicionado
    marginTop: 16, // <- Adicionado
    marginBottom: 8, // <- Adicionado
  },
  iconWrapError: {
    backgroundColor: "#FEE2E2",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleError: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E62325",
    marginBottom: 2,
  },
  subtitleError: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
  },

  // ESTILOS: AZUL (Em Análise)
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20, // <- Adicionado
    marginTop: 16, // <- Adicionado
    marginBottom: 8, // <- Adicionado
  },
  iconWrapInfo: {
    backgroundColor: "#DBEAFE",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleInfo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 2,
  },
  subtitleInfo: {
    fontSize: 13,
    color: "#1D4ED8",
    lineHeight: 18,
  },
});
