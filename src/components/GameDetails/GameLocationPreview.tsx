import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
  placeName: string;
  address?: string;
  latitude: number;
  longitude: number;
};

export function GameLocationPreview({
  placeName,
  address,
  latitude,
  longitude,
}: Props) {
  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Onde encontrar?</Text>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#6A6A6A" />
        <Text style={styles.place}>{placeName}</Text>
      </View>

      {!!address?.trim() && (
        <Text style={styles.address}>{address.trim()}</Text>
      )}

      <Pressable style={styles.mapCard}>
        <View style={styles.mapInner}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
            initialRegion={region}
            mapType="standard"
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>

        <Pressable style={styles.openHint} onPress={openMaps}>
          <Ionicons name="open-outline" size={16} color="#fff" />
          <Text style={styles.openHintText}>Abrir no mapa</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#555",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  place: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6A6A6A",
  },

  address: {
    marginTop: 6,
    fontSize: 14,
    color: "#8B8EA1",
  },

  mapCard: {
    marginTop: 12,
    height: 170,
    borderRadius: 18,
    backgroundColor: "#EEE",
  },

  mapInner: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },

  openHint: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(10,31,92,0.92)",
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  openHintText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
});