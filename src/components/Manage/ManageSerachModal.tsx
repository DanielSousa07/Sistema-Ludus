import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";
interface Props {
  visible: boolean;
  onClose: () => void;
}

interface LudopediaGame {
  id: number;
  name: string;
  image: string;
  description?: string;
  rating?: number;
  minPlayers?: number;
  maxPlayers?: number;
  minAge?: number;
  minTime?: number;
  maxTime?: number;
}




export function ManageSearchModal({ visible, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LudopediaGame[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [hasSearched, setHasSearched] = useState(false)

  const showAlert = (
    type: "error" | "success" | "info",
    title: string,
    message: string
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  async function handleSearch() {
    if (!search.trim()) return;
    setHasSearched(true);
    setLoading(true);
    try {
      const response = await api.get<LudopediaGame[]>(
        `/games/search-ludopedia?q=${search}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  }

async function handleAddGame(game: LudopediaGame) {
  try {
    await api.post("/games", {
      ludopediaId: game.id,
      title: game.name,
      cover: game.image,
      price: 15.0,
      description: game.description,
      rating: game.rating,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      minAge: game.minAge,
      minTime: game.minTime,
      maxTime: game.maxTime,
    });

    showAlert(
      "success",
      "Jogo adicionado 🎲",
      `"${game.name}" foi adicionado com sucesso!`
    );

    setTimeout(() => {
      setAlertVisible(false);
      onClose();
    }, 1200);

  } catch (error) {
    showAlert(
      "error",
      "Erro ao salvar",
      "Não foi possível adicionar o jogo ao catálogo."
    );
  }
}


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Buscar na Ludopedia</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={26} color="#31358B" />
            </Pressable>
          </View>

        
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#535353" />
            <TextInput
              style={styles.input}
              placeholder="Nome do jogo..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          
          {loading ? (
  <ActivityIndicator size="large" color="#31358B" />
) : results.length === 0 && hasSearched ? (
  <View style={styles.emptyContainer}>
    <Ionicons name="search-outline" size={48} color="#999" />
    <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
    <Text style={styles.emptySubtitle}>
      Tente outro nome ou verifique a grafia.
    </Text>
  </View>
) : (
  <FlatList
    data={results}
    keyExtractor={(item) => String(item.id)}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.gameItem}>
        <Image source={{ uri: item.image }} style={styles.thumb} />

        <Text style={styles.gameName} numberOfLines={1}>
          {item.name}
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() => handleAddGame(item)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    )}
  />
)}

        </View>
      </View>
      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
}

