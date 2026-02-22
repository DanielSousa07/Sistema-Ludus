import { StyleSheet, Text, View } from "react-native";

type Props = { description?: string | null };

export function GameDescription({ description }: Props) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.title}>Descrição</Text>
      <Text style={styles.desc}>
        {description?.trim()
          ? description.trim()
          : "Sem descrição ainda. Em breve teremos mais detalhes sobre este jogo."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", color: "#555", marginBottom: 10 },
  desc: { fontSize: 16, color: "#6A6A6A", lineHeight: 24 },
});