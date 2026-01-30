import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const filters = [
    {icon: "cube", label: "Status"},
    {icon: "people", label: "Quant Jogadores"},
    {icon: "person", label: "Idade"},
    {icon: "hourglass", label: "Tempo"},
];

export function  FilterButtons() {
    return (
        <View style={styles.container}>
            {filters.map((item)=> (
                <View key={item.label} style={styles.card}>
                    <Ionicons name={item.icon as any} size={22} color="#31358B"/>
                    <Text style={styles.text}>{item.label}</Text>
                </View> 
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFF",
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    color: "#31358B",
    textAlign: "center",
  },
});