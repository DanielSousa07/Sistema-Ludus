import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  minLimit?: number;
  maxLimit?: number;
};

export default function PriceRange({
  valueMin,
  valueMax,
  onChange,
  minLimit = 0,
  maxLimit = 100,
}: Props) {
  const [min, setMin] = useState(valueMin);
  const [max, setMax] = useState(valueMax);

  useEffect(() => {
    setMin(valueMin);
    setMax(valueMax);
  }, [valueMin, valueMax]);

  const commit = (nextMin: number, nextMax: number) => {
    let m1 = Math.max(minLimit, Math.min(nextMin, maxLimit));
    let m2 = Math.max(minLimit, Math.min(nextMax, maxLimit));

    if (m1 > m2) [m1, m2] = [m2, m1];

    setMin(m1);
    setMax(m2);
    onChange(m1, m2);
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.title}>Faixa de Preço (R$)</Text>

      <View style={styles.sliderContainer}>
        {/* Preço Mínimo */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.sliderHeader}>
            <Text style={{ color: "#6B7280", fontWeight: "600", fontSize: 13 }}>
              Mínimo
            </Text>
            <Text style={styles.sliderValue}>R$ {min}</Text>
          </View>
          <Slider
            minimumValue={minLimit}
            maximumValue={maxLimit}
            step={1}
            value={min}
            onValueChange={(v) => setMin(Math.min(v, max))}
            onSlidingComplete={(v) => commit(Math.min(v, max), max)}
            minimumTrackTintColor="#B3193A"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#B3193A"
          />
        </View>

        {/* Preço Máximo */}
        <View>
          <View style={styles.sliderHeader}>
            <Text style={{ color: "#6B7280", fontWeight: "600", fontSize: 13 }}>
              Máximo
            </Text>
            <Text style={styles.sliderValue}>R$ {max}</Text>
          </View>
          <Slider
            minimumValue={minLimit}
            maximumValue={maxLimit}
            step={1}
            value={max}
            onValueChange={(v) => setMax(Math.max(v, min))}
            onSlidingComplete={(v) => commit(min, Math.max(v, min))}
            minimumTrackTintColor="#B3193A"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#B3193A"
          />
        </View>
      </View>
    </View>
  );
}
