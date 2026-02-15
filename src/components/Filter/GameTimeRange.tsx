import Slider from "@react-native-community/slider";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  // Agora passamos apenas o valor máximo para filtrar no backend
  onChange: (maxTime: number) => void;
};

export function GameTimeRange({ onChange }: Props) {
  const [max, setMax] = useState(60);

  function handleChange(value: number) {
    setMax(value);
    onChange(value);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tempo de Jogo</Text>

      <View style={styles.sliderWrapper}>
      
        <View style={styles.track} />

        <Slider
          style={styles.absoluteSlider}
          minimumValue={15}
          maximumValue={120}
          step={5}
          value={max}
          minimumTrackTintColor="#B3193A" 
          maximumTrackTintColor="transparent" 
          thumbTintColor="#B3193A"
          onValueChange={handleChange}
        />
      </View>

      <View style={styles.value}>
        <Text>{max} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#535353",
    marginBottom: 12,
  },

  sliderWrapper: {
    height: 36,
    justifyContent: "center",
    marginVertical: 6,
  },

  absoluteSlider: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
  },

  track: {
    position: "absolute",
    height: 3,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 2,
  },

  value: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
});