import { api } from "@/src/services/api";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomBar } from "@/src/components/GameDetails/BottomBar";
import { GameDescription } from "@/src/components/GameDetails/GameDescription";
import { GameFactsRow } from "@/src/components/GameDetails/GameFactsRow";
import { GameHero } from "@/src/components/GameDetails/GameHero";
import { GameLocationPreview } from "@/src/components/GameDetails/GameLocationPreview";
import { GameMeta } from "@/src/components/GameDetails/GameMeta";
import { RateModal } from "@/src/components/GameDetails/RateModal";


import { RentModal } from "@/src/components/GameDetails/RentModal";


import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";

type GameDetails = {
  id: string;
  title: string;
  cover?: string | null;
  description?: string | null;
  price: number;
  available?: boolean;
  allowOriginalRental?: boolean;

  rating?: number | null;
  ratingsCount?: number | null;
  myRating?: number | null;

  minPlayers?: number | null;
  maxPlayers?: number | null;
  minAge?: number | null;
  minTime?: number | null;
  maxTime?: number | null;
};

type Copy = {
  id: string;
  code?: string | null;
  number: number;
  condition?: string | null;
  available: boolean;
};

type AlertType = "error" | "success" | "info";

export default function GameDetailsScreen() {
  const params = useLocalSearchParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : String(params.id)),
    [params.id]
  );

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [rentOpen, setRentOpen] = useState(false);
  const [availableCopies, setAvailableCopies] = useState<Copy[]>([]);
  const [rentLoading, setRentLoading] = useState(false);

  const [rateOpen, setRateOpen] = useState(false);
  const [savingRate, setSavingRate] = useState(false);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = useCallback((type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

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
      showAlert("success", "Avaliação salva!", "Sua avaliação foi registrada com sucesso.");
    } catch (e: any) {
      showAlert("error", "Erro", "Não foi possível salvar sua avaliação. Tente novamente.");
    } finally {
      setSavingRate(false);
    }
  };

  const addDaysISO = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const rentOriginalNow = useCallback(async () => {
    if (!game) return;

    try {
      await api.post("/rentals", {
        gameId: game.id,
        endDate: addDaysISO(4),
      });

      showAlert("success", "Aluguel realizado!", "Você alugou o jogo por 4 dias.");
      setRentOpen(false);
      await fetchDetails();
    } catch (e: any) {
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      if (code === "ONLY_COPIES_ALLOWED") {
        
        setRentOpen(true);
        showAlert(
          "info",
          "Escolha um exemplar",
          "Este jogo só pode ser alugado por exemplar."
        );
        return;
      }

      if (code === "GAME_UNAVAILABLE") {
        showAlert("error", "Indisponível", "Este jogo não está disponível no momento.");
        return;
      }

      showAlert("error", "Erro", msg || "Não foi possível alugar. Tente novamente.");
    }
  }, [game, fetchDetails, showAlert]);

  const rentCopyNow = useCallback(
    async (copyId: string) => {
      if (!game) return;

      try {
        await api.post("/rentals", {
          gameId: game.id,
          copyId,
          endDate: addDaysISO(4),
        });

        showAlert("success", "Exemplar alugado!", "Você alugou um exemplar por 4 dias.");
        setRentOpen(false);
        await fetchDetails();
      } catch (e: any) {
        const code = e?.response?.data?.code;
        const msg = e?.response?.data?.error;

        if (code === "COPY_UNAVAILABLE") {
          showAlert(
            "error",
            "Exemplar indisponível",
            "Esse exemplar acabou de ficar indisponível. Atualize e tente outro."
          );
          return;
        }

        showAlert("error", "Erro", msg || "Não foi possível alugar o exemplar.");
      }
    },
    [game, fetchDetails, showAlert]
  );

  const openRentFlow = useCallback(async () => {
    if (!game) return;

    setRentLoading(true);
    try {
      
      const res = await api.get(`/games/${game.id}/copies/available`);
      const copies: Copy[] = res.data || [];
      setAvailableCopies(copies);

      
      if (copies.length === 0) {
        await rentOriginalNow();
        return;
      }

      
      setRentOpen(true);
    } catch (e: any) {
      showAlert("error", "Erro", "Não foi possível carregar os exemplares disponíveis.");
    } finally {
      setRentLoading(false);
    }
  }, [game, rentOriginalNow, showAlert]);

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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
              <GameMeta
                title={game.title}
                avgRating={avgRating}
                ratingsCount={game.ratingsCount}
                onPressRate={() => setRateOpen(true)}
              />

              <GameFactsRow players={playersText} time={timeText} age={ageText} />

              <GameLocationPreview
                placeName="Biblioteca, Campus Timon"
                address="IFMA - Campus Timon"
                latitude={-5.11152}
                longitude={-42.85378}
              />

              <GameDescription description={game.description} />
            </ScrollView>
          </View>

          <BottomBar
            price={game.price}
            onPressRent={openRentFlow}
          />

          <RateModal
            visible={rateOpen}
            currentValue={game.myRating ?? null}
            saving={savingRate}
            onClose={() => setRateOpen(false)}
            onSave={handleSaveRating}
          />

          <RentModal
            visible={rentOpen}
            copies={availableCopies}
            allowOriginalRental={game.allowOriginalRental !== false}
            onClose={() => setRentOpen(false)}
            onRentOriginal={rentOriginalNow}
            onRentCopy={(copyId: string) => rentCopyNow(copyId)}
          />

          <LudusAlert
            visible={alertVisible}
            type={alertType}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
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