import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  onToggleTerms: () => void;
  onTogglePrivacy: () => void;
};

export function TermsConsentSection({
  acceptedTerms,
  acceptedPrivacy,
  onToggleTerms,
  onTogglePrivacy,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.checksWrap}>
      <Pressable style={styles.checkRow} onPress={onToggleTerms}>
        <Ionicons
          name={acceptedTerms ? "checkbox" : "square-outline"}
          size={22}
          color={acceptedTerms ? "#31358B" : "#8B8EA1"}
        />
        <Text style={styles.checkText}>
          Li e concordo com os{" "}
          <Text style={styles.checkLink} onPress={() => router.push("/terms")}>
            Termos de Uso
          </Text>
        </Text>
      </Pressable>

      <Pressable style={styles.checkRow} onPress={onTogglePrivacy}>
        <Ionicons
          name={acceptedPrivacy ? "checkbox" : "square-outline"}
          size={22}
          color={acceptedPrivacy ? "#31358B" : "#8B8EA1"}
        />
        <Text style={styles.checkText}>
          Li e concordo com a{" "}
          <Text
            style={styles.checkLink}
            onPress={() => router.push("/privacy-policy")}
          >
            Política de Privacidade
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}