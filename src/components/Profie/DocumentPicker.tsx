import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  description: string;
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
};

export function DocumentPicker({
  label,
  description,
  imageUri,
  onImageSelected,
}: Props) {
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Precisamos de permissão para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>

      <Pressable
        onPress={pickImage}
        style={[styles.box, imageUri ? styles.boxFilled : null]}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <View style={styles.changeOverlay}>
              <Ionicons name="camera-reverse" size={20} color="#fff" />
              <Text style={styles.changeText}>Trocar foto</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Ionicons
                name="document-attach-outline"
                size={28}
                color="#04096E"
              />
            </View>
            <Text style={styles.uploadText}>Toque para selecionar</Text>
            <Text style={styles.uploadSubtext}>JPG ou PNG (Máx. 5MB)</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#535353",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#8B8EA1",
    marginBottom: 12,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    minHeight: 160,
    overflow: "hidden",
  },
  boxFilled: {
    padding: 0,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#04096E",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#04096E",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#999",
  },
  preview: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(4, 9, 110, 0.85)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    gap: 6,
  },
  changeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
