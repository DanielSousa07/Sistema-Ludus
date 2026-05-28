import { Image, Text, View } from "react-native";
import { styles } from "./styles";

export function RegisterHeader() {
  return (
    <>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Image
          source={require("../../../assets/logo-dice.png")}
          style={{ width: 63, height: 63, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Crie sua conta</Text>
      </View>

      <Text style={styles.subtitle}>
        Preencha os dados abaixo para começar no Ludus.
      </Text>
    </>
  );
}
