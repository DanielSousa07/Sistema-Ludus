import { StyleSheet, Text, View } from "react-native";

type Props = { description?: string | null };

export function GameDescription({ description }: Props) {
  const text =
    description?.trim() ||
    "Sem descrição ainda. Em breve teremos mais detalhes sobre este jogo.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Descrição</Text>
      <Text style={styles.desc}>{"   "}{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#444",
    marginBottom: 8,
  },

  desc: {
    fontSize: 14,
    color: "#5F5F5F",
    lineHeight: 21,
    textAlign: "justify",
    paddingRight: 4,
  },
});