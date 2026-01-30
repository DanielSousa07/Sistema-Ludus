import Slider from "@react-native-community/slider";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  onChange: (min: number, max: number) => void;
};

const BAR_COUNT = 32;
const MAX_BAR_HEIGHT = 42;



function generateHistogram(count: number) {
  let last = 0.6;

  return Array.from({ length: count }, () => {
    const next = Math.min(
      1,
      Math.max(0.25, last + (Math.random() - 0.5) * 0.25)
    );
    last = next;
    return next;
  });
}

export default function PriceRange({ onChange }: Props) {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(40);
  const [activeThumb, setAcitiveThumb] = useState<"min" | "max" | null>(null);
  const [sliderWidth, setSliderWidth] = useState(0)
 
  const histogram = useMemo(() => generateHistogram(BAR_COUNT), []);

  function handleChange(newMin: number, newMax: number) {
    setMin(newMin);
    setMax(newMax);
    onChange(newMin, newMax);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linha de preço</Text>

    
      <View style={styles.histogram}>
        {histogram.map((value, index) => {
          const percent = (index / BAR_COUNT) * 100;
          const isActive = percent >= min && percent <= max;

          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height: value * MAX_BAR_HEIGHT,
                  backgroundColor: isActive ? "#B3193A" : "transparent",
                  opacity: percent < min ? 0.25 : 1,
                },
              ]}
            />
          );
        })}
      </View>


    <View 
    style={styles.sliderWrapper}
    onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
    onStartShouldSetResponderCapture={(e) => {
        const touchX = e.nativeEvent.locationX
        const touchPercent = (touchX / sliderWidth) * 100
        const distMin = Math.abs(touchPercent - min)
        const distMax = Math.abs(touchPercent - max)
        setAcitiveThumb(distMin < distMax ? "min": "max");
        return false;
    }}
    >

  <View style={styles.track} />

  <View
    style={[
      styles.activeTrack,
      {
        left: `${min}%`,
        width: `${max - min}%`,
      },
    ]}
  />


  <Slider
    style={[styles.absoluteSlider, {zIndex: activeThumb === "min" ? 10 : 1},]}
    minimumValue={0}
    maximumValue={100}
    value={min}
    step={1}
    minimumTrackTintColor="transparent"
    maximumTrackTintColor="transparent"
    thumbTintColor="#B3193A"
    onSlidingStart={() => setAcitiveThumb("min")}
    onSlidingComplete={() => setAcitiveThumb(null)}
    onValueChange={(v) => {
      if (v < max) handleChange(v, max);
    }}
  />


  <Slider
    style={[styles.absoluteSlider, {zIndex: activeThumb === "max" ? 10 : 1}]}
    minimumValue={0}
    maximumValue={100}
    value={max}
    step={1}
    minimumTrackTintColor="transparent"
    maximumTrackTintColor="transparent"
    thumbTintColor="#B3193A"
    onSlidingStart={() => setAcitiveThumb("max")} 
    onSlidingComplete={() => setAcitiveThumb(null)}
    onValueChange={(v) => {
      if (v > min) handleChange(min, v);
    }}
  />
</View>


    
      <View style={styles.value}>
        <Text>R${min}</Text>
        <Text>R${max}</Text>
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
    marginBottom: 20,
  },

  histogram: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 50,
    gap: 2,
    marginBottom: 6,
  },

  bar: {
    flex: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  sliderWrapper: {
    height: 36,
    justifyContent: "center",
    marginVertical: 6,
  },


  absoluteSlider: {
    position: 'absolute',
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

activeTrack: {
  position: "absolute",
  height: 3,
  backgroundColor: "#B3193A",
  borderRadius: 2,
},

  value: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
