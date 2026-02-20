import Slider from "@react-native-community/slider";
import { useEffect, useMemo, useState } from "react";
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

  const label = useMemo(() => {
    return `R$ ${min} - R$ ${max}`;
  }, [min, max]);

  const commit = (nextMin: number, nextMax: number) => {
    
    let m1 = Math.max(minLimit, Math.min(nextMin, maxLimit));
    let m2 = Math.max(minLimit, Math.min(nextMax, maxLimit));

    if (m1 > m2) [m1, m2] = [m2, m1];

    setMin(m1);
    setMax(m2);
    onChange(m1, m2);
  };

  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.title}>Faixa de preço</Text>
      <Text style={{ color: "#535353", marginBottom: 10 }}>{label}</Text>

      
      <Text style={{ color: "#535353", marginBottom: 6 }}>Mínimo</Text>
      <Slider
        minimumValue={minLimit}
        maximumValue={maxLimit}
        step={1}
        value={min}
        onValueChange={(v) => {
          const next = Math.min(v, max); 
          setMin(next);
        }}
        onSlidingComplete={(v) => {
          commit(Math.min(v, max), max);
        }}
      />

      {/* Slider do máximo */}
      <Text style={{ color: "#535353", marginTop: 12, marginBottom: 6 }}>Máximo</Text>
      <Slider
        minimumValue={minLimit}
        maximumValue={maxLimit}
        step={1}
        value={max}
        onValueChange={(v) => {
          const next = Math.max(v, min); 
          setMax(next);
        }}
        onSlidingComplete={(v) => {
          commit(min, Math.max(v, min));
        }}
      />
    </View>
  );
}