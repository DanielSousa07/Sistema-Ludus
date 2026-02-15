import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  placeholder?: string;
};

export default function SearchTop({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Buscar jogos",
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
    
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="chevron-back" size={22} color="#FFF" />
      </TouchableOpacity>


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor="#818194"
          returnKeyType="search"
        />

        <Ionicons name="search-outline" size={20} color="#818194" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#B3193A",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 20,


    shadowColor: "#A2A2A2",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },

  searchContainer: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#E3E3E3",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#818194",
    marginRight: 10,
  },
});
