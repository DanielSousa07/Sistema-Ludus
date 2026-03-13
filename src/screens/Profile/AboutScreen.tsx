import HomeBackground from "@/src/components/Home/HomeBackground";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const BLUE = "#31358B";
const DARK_BLUE = "#0A1F5C";
const RED = "#E62325";
const YELLOW = "#FBBC04";

const LUDUS_LOGO = require("../../../assets/logo-dice.png");

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  accent = "blue",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  accent?: "blue" | "red" | "yellow";
}) {
  const bg =
    accent === "red"
      ? "#FFE9EA"
      : accent === "yellow"
      ? "#FFF6D9"
      : "#EEF0FF";

  const color =
    accent === "red" ? RED : accent === "yellow" ? "#9A6B00" : BLUE;

  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

function StatPill({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={14} color={BLUE} />
      <Text style={styles.statPillText}>{label}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const router = useRouter();

  const appVersion = Application.nativeApplicationVersion || "1.0.0";
  return (
    <View style={styles.root}>
      <HomeBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Sobre o Ludus</Text>
            <Text style={styles.headerSubtitle}>
              Plataforma de aluguel de jogos do IFMA Campus Timon
            </Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroCard}>
              <View style={styles.logoWrap}>
                <Image source={LUDUS_LOGO} style={styles.logo} resizeMode="contain" />
              </View>

              <Text style={styles.appName}>Ludus</Text>
              <Text style={styles.heroText}>
                O Ludus organiza e moderniza o acesso ao acervo de jogos,
                facilitando consultas, reservas, empréstimos e acompanhamento
                do uso da coleção em uma experiência simples, visual e envolvente.
              </Text>

              <View style={styles.heroPills}>
                <StatPill icon="school-outline" label="IFMA Campus Timon" />
                <StatPill icon="phone-portrait-outline" label="Aplicativo mobile" />
                <StatPill icon="trophy-outline" label="Gamificação" />
              </View>
            </View>

            <SectionTitle title="O que o app oferece" />

            <FeatureCard
              icon="grid-outline"
              title="Catálogo inteligente"
              text="Permite explorar o acervo com busca e filtros, tornando mais rápido encontrar jogos por perfil, duração e disponibilidade."
              accent="blue"
            />

            <FeatureCard
              icon="bookmark-outline"
              title="Reservas e empréstimos"
              text="Centraliza o fluxo de solicitação, retirada e devolução, reduzindo controles manuais e trazendo mais organização ao processo."
              accent="yellow"
            />

            <FeatureCard
              icon="notifications-outline"
              title="Acompanhamento e avisos"
              text="Ajuda o usuário a acompanhar sua jornada dentro do sistema, com histórico, alertas e informações importantes sobre uso do acervo."
              accent="red"
            />

            <FeatureCard
              icon="bar-chart-outline"
              title="Engajamento e métricas"
              text="Incorpora ranking e elementos de gamificação para incentivar participação contínua e ampliar o uso consciente dos jogos."
              accent="blue"
            />

            <SectionTitle title="Propósito" />

            <View style={styles.textBox}>
              <Text style={styles.textBoxText}>
                Mais do que digitalizar empréstimos, o Ludus foi pensado para
                aproximar tecnologia, ludicidade e educação. A proposta do app é
                tornar o acervo de jogos do IFMA mais acessíveis,
                organizados e atrativos para a comunidade acadêmica.
              </Text>
            </View>

            <SectionTitle title="Projeto" />

            <View style={styles.projectCard}>
              <View style={styles.projectRow}>
                <Ionicons name="business-outline" size={18} color={BLUE} />
                <Text style={styles.projectLabel}>Instituição</Text>
              </View>
              <Text style={styles.projectValue}>
                Instituto Federal do Maranhão – IFMA Campus Timon
              </Text>

              <View style={styles.projectDivider} />

              <View style={styles.projectRow}>
                <Ionicons name="people-outline" size={18} color={BLUE} />
                <Text style={styles.projectLabel}>Equipe</Text>
              </View>
              <Text style={styles.projectValue}>
                Joseni Daniel, Hemyly Rayany, Ramilson Rios, Marcelo Loureiro,
                Guilherme Raphael e Hélio Victor
              </Text>

              <View style={styles.projectDivider} />

              <View style={styles.projectRow}>
                <Ionicons name="ribbon-outline" size={18} color={BLUE} />
                <Text style={styles.projectLabel}>Orientação</Text>
              </View>
              <Text style={styles.projectValue}>Nara Chaves</Text>
            </View>

            <SectionTitle title="Aplicativo" />

            <View style={styles.appMetaRow}>
              <View style={styles.metaCard}>
                <Text style={styles.metaTitle}>Versão</Text>
                <Text style={styles.metaValue}>{appVersion}</Text>
              </View>
            </View>

            <View style={styles.footerCard}>
              <Text style={styles.footerTitle}>Ludus ©</Text>
              <Text style={styles.footerText}>
                Uma solução criada para fortalecer o acesso ao acervo de jogos e
                transformar a experiência de uso em algo mais organizado, moderno
                e significativo.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: DARK_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 22,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: "#F7F8FF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  logo: {
    width: 72,
    height: 72,
  },

  appName: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "900",
    color: BLUE,
  },

  heroText: {
    marginTop: 10,
    textAlign: "center",
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  heroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
  },

  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statPillText: {
    color: BLUE,
    fontWeight: "900",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: BLUE,
  },

  sectionLine: {
    marginTop: 10,
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },

  featureCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },

  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BLUE,
  },

  featureText: {
    marginTop: 6,
    color: "#666D7E",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 21,
  },

  textBox: {
    marginTop: 16,
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    padding: 16,
  },

  textBoxText: {
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  projectCard: {
    marginTop: 16,
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  projectLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: BLUE,
  },

  projectValue: {
    marginTop: 8,
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  projectDivider: {
    height: 1,
    backgroundColor: "rgba(49,53,139,0.10)",
    marginVertical: 14,
  },

  appMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  metaCard: {
    flex: 1,
    backgroundColor: "#F7F8FF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  metaTitle: {
    color: "#7A7E8B",
    fontSize: 13,
    fontWeight: "800",
  },

  metaValue: {
    marginTop: 6,
    color: BLUE,
    fontSize: 18,
    fontWeight: "900",
  },

  footerCard: {
    marginTop: 24,
    backgroundColor: BLUE,
    borderRadius: 22,
    padding: 18,
  },

  footerTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  footerText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.86)",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 20,
  },
});