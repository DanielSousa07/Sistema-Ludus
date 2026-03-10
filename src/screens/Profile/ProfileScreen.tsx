import { NavFooter } from "@/src/components/common/NavFooter";
import { ProfileHeader } from "@/src/components/Profie/ProfileHeader";
import { ProfileMenuItem } from "@/src/components/Profie/ProfileMenuItem";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import HomeBackground from "../../components/Home/HomeBackground";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();

  async function handleChangePhoto() {
    Alert.alert("Foto de perfil", "Escolha uma opção", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Escolher da galeria",
        onPress: pickImageFromLibrary,
      },
      ...(user?.avatar
        ? [
            {
              text: "Remover foto",
              style: "destructive" as const,
              onPress: removeProfilePhoto,
            },
          ]
        : []),
    ]);
  }

  async function pickImageFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da sua permissão para acessar a galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    try {
      const formData = new FormData();

      formData.append("avatar", {
        uri: asset.uri,
        name: `avatar-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      const response = await api.post("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const nextUser = response.data?.user;
      if (nextUser?.avatar) {
        await updateUser({ avatar: nextUser.avatar });
      }

      Alert.alert("Sucesso", "Foto de perfil atualizada.");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.error || "Não foi possível atualizar a foto."
      );
    }
  }

  async function removeProfilePhoto() {
    try {
      await api.delete("/users/me/avatar");
      await updateUser({ avatar: null });
      Alert.alert("Sucesso", "Foto removida com sucesso.");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.error || "Não foi possível remover a foto."
      );
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <ProfileHeader user={user} onPressChangePhoto={handleChangePhoto} />

      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.sectionLine} />

          <View style={{ marginTop: 26 }}>
            <ProfileMenuItem
              icon="person-outline"
              title="Conta"
              onPress={() => router.push("/profile/account")}
            />

            <ProfileMenuItem
              icon="notifications-outline"
              title="Notificações"
              onPress={() => router.push("/notifications")}
            />

            <ProfileMenuItem
              icon="lock-closed-outline"
              title="Privacidade"
              onPress={() => Alert.alert("Privacidade", "Tela de privacidade em breve.")}
            />

            <ProfileMenuItem
              icon="information-circle-outline"
              title="Sobre nós"
              onPress={() => Alert.alert("Sobre nós", "Tela de sobre nós em breve.")}
            />
          </View>

          <ProfileMenuItem
          icon="cog-outline"
          title="Configurações"
          onPress={() => Alert.alert("Config", "Tela em breve")}
          />

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </Pressable>
        </ScrollView>
      </View>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#31358B",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 6,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
  },

  scrollContent: {
    paddingTop: 26,
    paddingBottom: 140,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#31358B",
  },

  sectionLine: {
    marginTop: 10,
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#FBBC04",
  },

  logoutBtn: {
    marginTop: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#E62325",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});