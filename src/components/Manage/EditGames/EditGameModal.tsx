import type { ManageGame } from "@/src/screens/Manage/EditGamesScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

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

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [available, setAvailable] = useState(true);


    useEffect(() => {
        if (!game) return;
        setTitle(game.title ?? "");
        setPrice(String(game.price ?? ""));
        setDescription(game.description ?? "");
        setAvailable(game.available !== false);
    }, [game]);

    const priceNumber = useMemo(() => {
        const v = Number(String(price).replace(",", "."));
        return Number.isFinite(v) ? v : 0;
    }, [price]);

    if (!game) return null;



    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Editar jogo</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>
                                {game.title}
                            </Text>
                        </View>

                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={26} color="#31358B" />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Título</Text>
                    <View style={styles.inputWrap}>
                        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Nome do jogo" />
                    </View>

                    <Text style={styles.label}>Preço (R$ / dia)</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={price}
                            onChangeText={setPrice}
                            style={styles.input}
                            placeholder="Ex: 15.00"
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>Disponível</Text>
                        <Switch value={available} onValueChange={setAvailable} />
                    </View>

                    <Text style={styles.label}>Descrição</Text>
                    <View style={[styles.inputWrap, { height: 110, alignItems: "flex-start", paddingTop: 12 }]}>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, { height: 98 }]}
                            placeholder="Escreva uma descrição curta..."
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.footer}>
                        <Pressable onPress={() => setConfirmOpen(true)} style={styles.deleteBtn}>
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
                                    available,
                                })
                            }
                            style={styles.saveBtn}
                        >
                            <Ionicons name="save-outline" size={18} color="#fff" />
                            <Text style={styles.saveText}>Salvar</Text>
                        </Pressable>
                    </View>


                </View>
            </View>
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
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
    sheet: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, height: "88%" },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    title: { fontSize: 20, fontWeight: "800", color: "#31358B" },
    subtitle: { fontSize: 13, color: "#535353", marginTop: 2, maxWidth: 240 },

    label: { marginTop: 12, marginBottom: 8, fontWeight: "800", color: "#31358B" },
    inputWrap: { backgroundColor: "#F0F2FF", borderRadius: 16, paddingHorizontal: 14, height: 52, justifyContent: "center" },
    input: { fontSize: 15, color: "#333", width: "100%" },

    switchRow: {
        marginTop: 14,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#F7F8FF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    switchText: { fontSize: 15, fontWeight: "800", color: "#31358B" },

    footer: { flexDirection: "row", gap: 12, marginTop: 18 },
    deleteBtn: {
        flex: 1,
        height: 54,
        borderRadius: 18,
        backgroundColor: "#E62325",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    deleteText: { color: "#fff", fontWeight: "900" },
    saveBtn: {
        flex: 1,
        height: 54,
        borderRadius: 18,
        backgroundColor: "#31358B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    saveText: { color: "#fff", fontWeight: "900" },


});