import { useFilters } from "@/src/contexts/FiltersContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    View,
} from "react-native";

import GameCard, { Game } from "@/src/components/Search/GameCard";
import SearchBackground from "@/src/components/Search/SearchBackground";
import SearchTop from "@/src/components/Search/SearchTop";


const EMPTY_IMAGE = require("../../../assets/no-result.png")

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const qParam = Array.isArray(params.q) ? params.q[0] : (params.q as string | undefined);
  const initialQ = (qParam || "").toString();

  const { filters, activeCount } = useFilters();

  const [q, setQ] = useState(initialQ);
  const [games, setGames] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const requestIdRef = useRef(0);

  const queryParams = useMemo(() => {
    const status = filters.status === "ALL" ? undefined : filters.status;

    return {
      q: q.trim() || undefined,
      status,
      players: filters.players ?? undefined,
      age: filters.age ?? undefined,
      stars: filters.stars.length ? filters.stars.join(",") : undefined,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      timeMax: filters.timeMax,
    };
  }, [q, filters]);

  const fetchGames = useCallback(async () => {
    const currentId = ++requestIdRef.current;
    try {
      const res = await api.get("/games", { params: queryParams });
      if (currentId !== requestIdRef.current) return;
      setGames(res.data || []);
    } catch (e) {
      console.log("Erro ao buscar jogos:", e);
      setGames([]);
    }
  }, [queryParams]);

  useEffect(() => {
    router.setParams({ q: q || undefined });
    fetchGames();
  }, [q, fetchGames, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const onSubmitSearch = () => fetchGames();

  return (
    <View style={{ flex: 1 }}>
      <SearchBackground />

      
      <SearchTop
        value={q}
        onChangeText={setQ}
        onSubmit={onSubmitSearch}
        onOpenFilters={() => router.push("/filter")}
        activeFiltersCount={activeCount}
      />

      
      <View
        style={{
          flex: 1,
          marginTop: 25,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 18,
          overflow: "hidden",
        }}
      >
        
        <View
          style={{
            paddingHorizontal: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#555" }}>
            {games.length} Resultados
          </Text>

          <Pressable
            onPress={() => router.push("/filter")}
            style={{
              height: 44,
              paddingHorizontal: 16,
              borderRadius: 14,
              backgroundColor: "#B3193A",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="filter" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800" }}>Filtros</Text>

            {activeCount > 0 && (
              <View
                style={{
                  marginLeft: 6,
                  minWidth: 18,
                  height: 18,
                  paddingHorizontal: 5,
                  borderRadius: 999,
                  backgroundColor: "#E62325",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>
                  {activeCount > 9 ? "9+" : activeCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <FlatList
          data={games}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <GameCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 4,
            flexGrow: 1, 
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 50,
              }}
            >
              
                <Image
                  source={EMPTY_IMAGE}
                  style={{ width: 140, height: 140, marginBottom: 18, opacity: 0.85 }}
                  resizeMode="contain"
                />
          

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#8B8EA1",
                  textAlign: "center",
                  paddingHorizontal: 30,
                  lineHeight: 20,
                }}
              >
                Tente buscar por outro nome ou ajuste os filtros.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}