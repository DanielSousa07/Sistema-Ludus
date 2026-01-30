import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
export default function SearchBar() {
  const router = useRouter()
   return (
    <View style={styles.wrapper}>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#535353" />
        <TextInput
          style={styles.input}
          placeholder="Procure o jogo..."
          placeholderTextColor="#535353"
        />
      </View>

    
      <TouchableOpacity style={styles.filterButton } onPress={() => router.push("/filter")}>
        <Ionicons name="filter" size={22} color="#31358B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  searchContainer: {
    flex: 1,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#E3E3E3",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#535353",
  },

  filterButton: {
    width: 60,
    height: 60,
    marginLeft: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E3E3E3",
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 4,
  },
});
