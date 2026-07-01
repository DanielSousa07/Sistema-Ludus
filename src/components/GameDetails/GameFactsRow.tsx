import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Fact = { icon: keyof typeof Ionicons.glyphMap; label: string };

type Props = {
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minTime?: number | null;
  maxTime?: number | null;
  minAge?: number | null;
  complexity?: number | null; // Extra BGG: Peso do jogo (ex: 2.5 / 5)
  year?: number | null; // Extra BGG: Ano de Lançamento
};

export function GameFactsRow({
  minPlayers,
  maxPlayers,
  minTime,
  maxTime,
  minAge,
  complexity,
  year,
}: Props) {
  const facts: Fact[] = [];

  // Lógica inteligente para Jogadores (Evita "1-1 jogadores")
  if (minPlayers || maxPlayers) {
    let label = "—";
    if (minPlayers && maxPlayers) {
      if (minPlayers === maxPlayers) {
        label = `${minPlayers} jog.`;
      } else {
        label = `${minPlayers}-${maxPlayers} jog.`;
      }
    } else if (minPlayers) {
      label = `${minPlayers}+ jog.`;
    } else if (maxPlayers) {
      label = `Até ${maxPlayers} jog.`;
    }
    facts.push({ icon: "people-outline", label });
  }

  // Lógica inteligente para Tempo (Evita "60-60 min")
  if (minTime || maxTime) {
    let label = "—";
    if (minTime && maxTime) {
      if (minTime === maxTime) {
        label = `${minTime} min`;
      } else {
        label = `${minTime}-${maxTime} min`;
      }
    } else if (minTime) {
      label = `${minTime} min`;
    } else if (maxTime) {
      label = `${maxTime} min`;
    }
    facts.push({ icon: "time-outline", label });
  }

  // Lógica de Idade Mínima
  if (minAge) {
    facts.push({ icon: "happy-outline", label: `${minAge}+ anos` });
  }

  // Novos Facts da BGG (Se existirem na sua API, ele renderiza!)
  if (complexity) {
    // Usa um ícone de quebra-cabeça e formata com 1 casa decimal (Ex: 2.5/5)
    facts.push({
      icon: "extension-puzzle-outline",
      label: `${complexity.toFixed(1)}/5`,
    });
  }

  if (year) {
    facts.push({ icon: "calendar-outline", label: String(year) });
  }

  // Se o jogo não tiver nenhum dado preenchido, não renderiza a linha
  if (facts.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {facts.map((f, idx) => (
        <View key={idx} style={styles.pill}>
          <Ionicons name={f.icon} size={15} color="#6A6A6A" />
          <Text style={styles.text}>{f.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  pill: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 12,
  },
  text: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#6A6A6A",
  },
});
