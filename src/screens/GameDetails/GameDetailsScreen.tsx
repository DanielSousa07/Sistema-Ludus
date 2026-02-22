import { api } from "@/src/services/api";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomBar } from "@/src/components/GameDetails/BottomBar";
import { GameDescription } from "@/src/components/GameDetails/GameDescription";
import { GameFactsRow } from "@/src/components/GameDetails/GameFactsRow";
import { GameHero } from "@/src/components/GameDetails/GameHero";
import { GameMeta } from "@/src/components/GameDetails/GameMeta";
import { RateModal } from "@/src/components/GameDetails/RateModal";

type GameDetails = {
  id: string;
  title: string;
  cover?: string | null;
  description?: string | null;
  price: number;
  available?: boolean;

  rating?: number | null;       
  ratingsCount?: number | null; 
  myRating?: number | null;    

  minPlayers?: number | null;
  maxPlayers?: number | null;
  minAge?: number | null;
  minTime?: number | null;
  maxTime?: number | null;
};

export default function GameDetailsScreen() {
  const params = useLocalSearchParams();
  const id = useMemo(() => (Array.isArray(params.id) ? params.id[0] : String(params.id)), [params.id]);

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [rateOpen, setRateOpen] = useState(false);
  const [savingRate, setSavingRate] = useState(false);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.get(`/games/${id}`);
      setGame(res.data);
    } catch (e: any) {
      setErrMsg("Não foi possível carregar os detalhes.");
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const avgRating = Number(game?.rating ?? 0);

  const playersText =
    game?.minPlayers && game?.maxPlayers
      ? `${game.minPlayers}-${game.maxPlayers} jogadores`
      : game?.minPlayers
      ? `${game.minPlayers}+ jogadores`
      : "—";

  const timeText =
    game?.minTime && game?.maxTime
      ? `${game.minTime}-${game.maxTime} min`
      : game?.maxTime
      ? `${game.maxTime} min`
      : game?.minTime
      ? `${game.minTime} min`
      : "—";

  const ageText = game?.minAge ? `${game.minAge}+ anos` : "—";

  const handleSaveRating = async (value: number) => {
    if (!game) return;

    setSavingRate(true);
    try {
      const res = await api.post(`/games/${game.id}/rating`, { value });
      
      setGame((prev) =>
        prev
          ? {
              ...prev,
              rating: res.data?.avgRating ?? prev.rating,
              ratingsCount: res.data?.ratingsCount ?? prev.ratingsCount,
              myRating: res.data?.myRating ?? value,
            }
          : prev
      );
      
      setRateOpen(false);
    } catch (e) {
      
    } finally {
      setSavingRate(false);
    }
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : errMsg ? (
        <View style={styles.center}>
          <Text style={{ color: "#666", fontWeight: "700" }}>{errMsg}</Text>
          <Text onPress={fetchDetails} style={{ marginTop: 10, color: "#0A1F5C", fontWeight: "900" }}>
            Tentar novamente
          </Text>
        </View>
      ) : !game ? (
        <View style={styles.center}>
          <Text style={{ color: "#666", fontWeight: "700" }}>Jogo não encontrado.</Text>
        </View>
      ) : (
        <>
          <GameHero coverUrl={game.cover} />

          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <GameMeta
                title={game.title}
                avgRating={avgRating}
                ratingsCount={game.ratingsCount}
                onPressRate={() => setRateOpen(true)}
              />

              <GameFactsRow players={playersText} time={timeText} age={ageText} />

              <GameDescription description={game.description} />
            </ScrollView>
          </View>

          <BottomBar
            price={game.price}
            onPressRent={() => {
        
              
              setRateOpen(false);
            }}
          />

          <RateModal
            visible={rateOpen}
            currentValue={game.myRating ?? null}
            saving={savingRate}
            onClose={() => setRateOpen(false)}
            onSave={handleSaveRating}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A1F5C" }, 
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -22, 
    paddingHorizontal: 18,
    paddingTop: 12,
    overflow: "hidden",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
});