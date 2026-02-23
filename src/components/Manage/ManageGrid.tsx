import { StyleSheet, View } from "react-native";
import { ManageCard } from "./ManageCard";

export function ManageGrid({
  onAddGamePress,
  onEditGamesPress,
  onManageCopiesPress,
  onManageRentalsPress,
}: {
  onAddGamePress: () => void;
  onEditGamesPress: () => void;
  onManageCopiesPress: () => void;
  onManageRentalsPress: () => void;
}) {
  
  return (
    <View style={styles.grid}>
      <ManageCard icon="game-controller-outline" label="Adicionar Jogo" onPress={onAddGamePress} />
      <ManageCard icon="albums-outline" label="Gerenciar Exemplares" onPress={onManageCopiesPress} />
      <ManageCard icon="create-outline" label="Editar Jogos" onPress={onEditGamesPress} />
      <ManageCard icon="stats-chart-outline" label="Jogos Alugados" onPress={onManageRentalsPress} />
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
