import { api } from "@/src/services/api";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { NavFooter } from "@/src/components/common/NavFooter";
import HomeBackground from "@/src/components/Home/HomeBackground";
import type { RentalItemModel } from "@/src/components/Rentals/RentalItem";
import RentalsCard from "@/src/components/Rentals/RentalsCard";

export default function RentalsScreen() {
  const [rentals, setRentals] = useState<RentalItemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/rentals/me");
      setRentals(res.data || []);
    } catch {
      setRentals([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={styles.root}>
      <HomeBackground />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          {/* card por cima */}
          <View style={styles.cardWrap}>
            <RentalsCard rentals={rentals} />
          </View>


          {refreshing && null}
        </View>
      )}

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  container: { flex: 1 },
  cardWrap: {
    flex: 1,
  },
});