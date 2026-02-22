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
  const [max, setMax] = useState(valueMax);

  useEffect(() => {
    setMax(valueMax);
  }, [valueMax]);

  const label = useMemo(() => {
    if (max >= maxLimit) return `${maxLimit}+ min`;
    return `Até ${max} min`;
  }, [max, maxLimit]);

  const commit = (v: number) => {
    const clamped = Math.max(minLimit, Math.min(v, maxLimit));
    setMax(clamped);
    onChange(clamped);
  };

  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.title}>Tempo de jogo</Text>
      <Text style={{ color: "#535353", marginBottom: 10 }}>{label}</Text>

      <Slider
        minimumValue={minLimit}
        maximumValue={maxLimit}
        step={5}
        value={max}
        onValueChange={(v) => setMax(v)}
        onSlidingComplete={commit}
        minimumTrackTintColor="#B3193A"
        maximumTrackTintColor="#c1acace3"
        thumbTintColor="#B3193A"
      />
    </View>
  );
}