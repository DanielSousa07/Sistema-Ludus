import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { styles } from "./styles";

type PasswordRules = {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

type Props = {
  visible: boolean;
  strength: {
    score: number;
    label: string;
    color: string;
  };
  rules: PasswordRules;
};

function PasswordRule({
  ok,
  text,
}: {
  ok: boolean;
  text: string;
}) {
  return (
    <View style={styles.ruleRow}>
      <Ionicons
        name={ok ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={ok ? "#2E7D32" : "#A0A5B5"}
      />
      <Text style={[styles.ruleText, ok && styles.ruleTextOk]}>{text}</Text>
    </View>
  );
}

export function PasswordStrengthSection({
  visible,
  strength,
  rules,
}: Props) {
  if (!visible) return null;

  return (
    <>
      <View style={styles.passwordStrengthWrap}>
        <View style={styles.strengthBars}>
          {[1, 2, 3].map((bar) => (
            <View
              key={bar}
              style={[
                styles.strengthBar,
                bar <= strength.score && {
                  backgroundColor: strength.color,
                },
              ]}
            />
          ))}
        </View>

        <Text
          style={[
            styles.strengthText,
            { color: strength.color || "#8B8EA1" },
          ]}
        >
          {strength.label}
        </Text>
      </View>

      <View style={styles.rulesWrap}>
        <PasswordRule ok={rules.minLength} text="Pelo menos 6 caracteres" />
        <PasswordRule ok={rules.hasLetter} text="Pelo menos 1 letra" />
        <PasswordRule ok={rules.hasNumber} text="Pelo menos 1 número" />
        <PasswordRule ok={rules.hasSpecial} text="Pelo menos 1 caractere especial" />
      </View>
    </>
  );
}