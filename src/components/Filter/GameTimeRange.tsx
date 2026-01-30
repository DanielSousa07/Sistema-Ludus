import Slider from "@react-native-community/slider";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  onChange: (min: number, max: number) => void;
};

export function GameTimeRange({ onChange }: Props) {
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(60);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  function handleChange(newMin: number, newMax: number) {
    setMin(newMin);
    setMax(newMax);
    onChange(newMin, newMax);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tempo de Jogo</Text>

      <View
        style={styles.sliderWrapper}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponderCapture={(e) => {
          const touchX = e.nativeEvent.locationX;
          const percent = (touchX / sliderWidth) * 100;
          const distMin = Math.abs(percent - (min / 120) * 100);
          const distMax = Math.abs(percent - (max / 120) * 100);
          setActiveThumb(distMin < distMax ? "min" : "max");
          return false;
        }}
      >

        <View style={styles.track} />


        <View
          style={[
            styles.activeTrack,
            {
              left: `${(min / 120) * 100}%`,
              width: `${((max - min) / 120) * 100}%`,
            },
          ]}
        />

        <Slider
          style={[
            styles.absoluteSlider,
            { zIndex: activeThumb === "min" ? 10 : 1 },
          ]}
          minimumValue={0}
          maximumValue={120}
          step={5}
          value={min}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#B3193A"
          onSlidingStart={() => setActiveThumb("min")}
          onSlidingComplete={() => setActiveThumb(null)}
          onValueChange={(v) => {
            if (v < max) handleChange(v, max);
          }}
        />

        <Slider
          style={[
            styles.absoluteSlider,
            { zIndex: activeThumb === "max" ? 10 : 1 },
          ]}
          minimumValue={0}
          maximumValue={120}
          step={5}
          value={max}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#B3193A"
          onSlidingStart={() => setActiveThumb("max")}
          onSlidingComplete={() => setActiveThumb(null)}
          onValueChange={(v) => {
            if (v > min) handleChange(min, v);
          }}
        />
      </View>

      <View style={styles.value}>
        <Text>{min} min</Text>
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
