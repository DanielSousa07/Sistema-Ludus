import Slider from "@react-native-community/slider";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  valueMax: number;
  onChange: (max: number) => void;
  minLimit?: number;
  maxLimit?: number;
};

export function GameTimeRange({
  valueMax,
  onChange,
  minLimit = 15,
  maxLimit = 180,
}: Props) {
  const [max, setMax] = useState<number>(valueMax);

  useEffect(() => {
    setMax(valueMax);
  }, [valueMax]);

  const label = useMemo(() => {
    if (max >= maxLimit) return `${maxLimit}+ minutos`;
    return `Até ${max} minutos`;
  }, [max, maxLimit]);

  const commit = (v: number) => {
    const clamped = Math.max(minLimit, Math.min(v, maxLimit));
    setMax(clamped);
    onChange(clamped);
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.title}>Tempo de Jogo</Text>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={{ color: "#6B7280", fontWeight: "600", fontSize: 13 }}>
            Duração
          </Text>
          <Text style={styles.sliderValue}>{label}</Text>
        </View>

        <Slider
          minimumValue={minLimit}
          maximumValue={maxLimit}
          step={5}
          value={max}
          onValueChange={(v) => setMax(v)}
          onSlidingComplete={commit}
          minimumTrackTintColor="#B3193A"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#B3193A"
        />
      </View>
    </View>
  );
}
