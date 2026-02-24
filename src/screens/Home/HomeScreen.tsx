import { NavFooter } from "@/src/components/common/NavFooter";
import { EngagementPreview } from "@/src/components/Home/EngagementPreview";
import { Header } from "@/src/components/Home/Header";
import { HomeCard } from "@/src/components/Home/HomeCard";
import SearchBar from "@/src/components/Home/SearchBar";
import { useFilters } from "@/src/contexts/FiltersContext";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HomeBackground from "../../components/Home/HomeBackground";

export type HomeGame = {
  id: string;
  title: string;
  cover?: string | null;
  price: number;

  rating?: number | null;
  ratingsCount?: number | null;

  available?: boolean; // original
  allowOriginalRental?: boolean;

  copiesCount?: number;
  availableCopiesCount?: number;

  isAvailableNow?: boolean;
};

type HomePayload = {
  forYou: HomeGame[];
  mostRented: HomeGame[];
};

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [forYou, setForYou] = useState<HomeGame[]>([]);
  const [mostRented, setMostRented] = useState<HomeGame[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const { activeCount } = useFilters();

  
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadHome = useCallback(async () => {
    setErrMsg(null);
    try {
      const res = await api.get<HomePayload>("/games/home");
      setForYou(res.data?.forYou || []);
      setMostRented(res.data?.mostRented || []);
    } catch (e) {
      console.error("Erro ao carregar home:", e);
      setErrMsg("Não foi possível carregar os jogos.");
      setForYou([]);
      setMostRented([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadHome();
      setLoading(false);
    })();
  }, [loadHome]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHome();
    setRefreshing(false);
  }, [loadHome]);

  const onSubmitSearch = useCallback(() => {
    if (!search.trim()) return;
    Keyboard.dismiss();

    router.push({
      pathname: "/search",
      params: { q: search },
    });
  }, [router, search]);

  
  const topOpacity = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const topTranslate = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, -16],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 65 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]} 
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <HomeBackground />
        

        
        <Animated.View
          style={[
            styles.topBlock,
            {
              opacity: topOpacity,
              transform: [{ translateY: topTranslate }],
            },
          ]}
        >
          <Header />
          <EngagementPreview />
        </Animated.View>

        
        <View style={styles.stickySearchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={onSubmitSearch}
            activeFiltersCount={activeCount}
          />
        </View>

        
        {loading ? (
          <View style={{ paddingTop: 30, alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10, color: "#E0E0E0", fontWeight: "700" }}>
              Carregando jogos...
            </Text>
          </View>
        ) : errMsg ? (
          <View style={{ paddingTop: 30, alignItems: "center" }}>
            <Text style={{ color: "#E0E0E0", fontWeight: "800" }}>{errMsg}</Text>
            <Text
              onPress={async () => {
                setLoading(true);
                await loadHome();
                setLoading(false);
              }}
              style={{ marginTop: 10, color: "#FFFFFF", fontWeight: "900" }}
            >
              Tentar novamente
            </Text>
          </View>
        ) : (
          <HomeCard forYou={forYou} mostRented={mostRented} onSeeAll={() => router.push("/search")} />
        )}
      </Animated.ScrollView>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  topBlock: {

    paddingBottom: 6,
  },

  
  stickySearchWrap: {
    backgroundColor: "transparent", 
    paddingBottom: 6,
  },
});