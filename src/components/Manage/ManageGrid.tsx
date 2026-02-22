import { StyleSheet, View } from "react-native";
import { ManageCard } from "./ManageCard";

export function ManageGrid({
  onAddGamePress,
  onEditGamesPress,
}: {
  onAddGamePress: () => void;
  onEditGamesPress: () => void;
}) {
  
  return (
    <View style={styles.grid}>
      <ManageCard icon="game-controller-outline" label="Adicionar Jogo" onPress={onAddGamePress} />
      <ManageCard icon="albums-outline" label="Gerenciar Exemplares" onPress={() => {}} />
      <ManageCard icon="create-outline" label="Editar Jogos" onPress={onEditGamesPress} />
      <ManageCard icon="stats-chart-outline" label="Jogos Alugados" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
