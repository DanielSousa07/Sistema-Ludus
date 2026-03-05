import type { ManageGame } from "@/src/screens/Manage/EditGamesScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { GameComponentsModal } from "./GameComponentsModal";

export function EditGameModal({
  visible,
  game,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  game: ManageGame | null;
  onClose: () => void;
  onSave: (next: Partial<ManageGame> & { id: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [howToPlayUrl, setHowToPlayUrl] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!game) return;

    setTitle(game.title ?? "");
    setPrice(String(game.price ?? ""));
    setDescription(game.description ?? "");
    setHowToPlayUrl(game.howToPlayUrl ?? "");
    setAvailable(game.available !== false);
  }, [game]);

  const priceNumber = useMemo(() => {
    const v = Number(String(price).replace(",", "."));
    return Number.isFinite(v) ? v : 0;
  }, [price]);

  if (!game) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Editar jogo</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {game.title}
                  </Text>
                </View>

                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={26} color={LUDUS.blue} />
                </Pressable>
              </View>

              <Text style={styles.label}>Título</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  placeholder="Nome do jogo"
                  placeholderTextColor="#666"
                />
              </View>

              <Text style={styles.label}>Preço (R$ / dia)</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  style={styles.input}
                  placeholder="Ex: 15.00"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Disponível</Text>
                <Switch value={available} onValueChange={setAvailable} />
              </View>

              <Text style={styles.label}>Descrição</Text>
              <View style={[styles.inputWrap, styles.textAreaWrap]}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.input, styles.textArea]}
                  placeholder="Escreva uma descrição curta..."
                  placeholderTextColor="#666"
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <Text style={styles.label}>Vídeo de tutorial (URL)</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={howToPlayUrl}
                  onChangeText={setHowToPlayUrl}
                  style={styles.input}
                  placeholder="https://youtube.com/watch?v=..."
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                />
              </View>

              <Pressable
                onPress={() => setComponentsOpen(true)}
                style={styles.componentsBtn}
              >
                <Ionicons name="cube-outline" size={18} color={LUDUS.blue} />
                <Text style={styles.componentsText}>Componentes</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward" size={18} color={LUDUS.blue} />
              </Pressable>

              <View style={styles.footer}>
                <Pressable
                  onPress={() => setConfirmOpen(true)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={styles.deleteText}>Excluir</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    onSave({
                      id: game.id,
                      title: title.trim() || game.title,
                      price: priceNumber,
                      description,
                      howToPlayUrl,
                      available,
                    })
                  }
                  style={styles.saveBtn}
                >
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text style={styles.saveText}>Salvar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ConfirmDeleteModal
        visible={confirmOpen}
        title="Excluir este jogo?"
        message={`Você tem certeza que deseja excluir "${game.title}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(game.id);
        }}
      />

      <GameComponentsModal
        visible={componentsOpen}
        gameId={game.id}
        gameTitle={game.title}
        onClose={() => setComponentsOpen(false)}
      />
    </Modal>
  );
}

const LUDUS = {
  blue: "#31358B",
  red: "#E62325",
  yellow: "#FBBC04",
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    height: "88%",
    marginBottom: -16
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: LUDUS.blue,
  },

  subtitle: {
    fontSize: 13,
    color: "#535353",
    marginTop: 2,
    maxWidth: 240,
  },

  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "900",
    color: LUDUS.blue,
  },

  inputWrap: {
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    justifyContent: "center",
  },

  input: {
    fontSize: 15,
    color: "#222",
    width: "100%",
    fontWeight: "700",
  },

  textAreaWrap: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: 12,
  },

  textArea: {
    height: 100,
  },

  switchRow: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#F7F8FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchText: {
    fontSize: 15,
    fontWeight: "900",
    color: LUDUS.blue,
  },

  componentsBtn: {
    marginTop: 14,
    height: 56,
    borderRadius: 18,
    backgroundColor: LUDUS.yellow,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  componentsText: {
    color: LUDUS.blue,
    fontWeight: "900",
    fontSize: 15,
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  deleteBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: LUDUS.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "900",
  },

  saveBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: LUDUS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
  },
});