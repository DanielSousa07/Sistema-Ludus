import { api } from "@/src/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomBar } from "@/src/components/GameDetails/BottomBar";
import { GameComponents } from "@/src/components/GameDetails/GameComponents";
import { GameDescription } from "@/src/components/GameDetails/GameDescription";
import { GameFactsRow } from "@/src/components/GameDetails/GameFactsRow";
import { GameHero } from "@/src/components/GameDetails/GameHero";
import { GameHowToPlay } from "@/src/components/GameDetails/GameHowToPlay";
import { GameMeta } from "@/src/components/GameDetails/GameMeta";
import { RateModal } from "@/src/components/GameDetails/RateModal";
import { RentModal } from "@/src/components/GameDetails/RentModal";
import { TermsRentModal } from "@/src/components/RentTerms/TermsRentModal";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type GameDetails = {
  id: string;
  title: string;
  cover?: string | null;

  description?: string | null;
  howToPlayUrl?: string | null;

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

  isAvailableNow?: boolean;
  rentedByMe?: boolean;

  // RF017
  tier?: string | null;
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
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const params = useLocalSearchParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : String(params.id)),
    [params.id]
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [favSaving, setFavSaving] = useState(false);
  const [favToastVisible, setFavToastVisible] = useState(false);
  const [favToastMessage, setFavToastMessage] = useState("");

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [rentOpen, setRentOpen] = useState(false);
  const [availableCopies, setAvailableCopies] = useState<Copy[]>([]);
  const [rentLoading, setRentLoading] = useState(false);

  const [rateOpen, setRateOpen] = useState(false);
  const [savingRate, setSavingRate] = useState(false);
  const [canRate, setCanRate] = useState(false);

  const [watching, setWatching] = useState(false);
  const [loadingWatch, setLoadingWatch] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);
  const pendingRentRef = useRef<null | { type: "original" } | { type: "copy"; copyId: string }>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [tab, setTab] = useState<"description" | "components" | "howtoplay">("description");

  const showAlert = useCallback((type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  const hasHowToPlay = !!(game?.howToPlayUrl && game.howToPlayUrl.trim());

  useEffect(() => {
    if (tab === "howtoplay" && !hasHowToPlay) setTab("description");
  }, [tab, hasHowToPlay]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.get(`/games/${id}`);
      setGame(res.data);
    } catch {
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

  function isTermsBlocked(e: any) {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    return status === 403 && code === "TERMS_NOT_ACCEPTED";
  }

  const handleSaveRating = async (value: number) => {
    if (!game) return;

    if (isAdmin) {
      showAlert("info", "Ação bloqueada", "Conta ADMIN não pode avaliar jogos.");
      return;
    }

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
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      if (code === "CANNOT_RATE") {
        setCanRate(false);
        showAlert("info", "Avaliação bloqueada", "Você só pode avaliar este jogo após devolver.");
        return;
      }

      showAlert("error", "Erro", msg || "Não foi possível salvar sua avaliação. Tente novamente.");
    } finally {
      setSavingRate(false);
    }
  };

  useEffect(() => {
    if (!game?.id) return;

    api
      .get(`/games/${game.id}/watch`)
      .then((res) => setWatching(!!res.data?.watching))
      .catch(() => setWatching(false));
  }, [game?.id]);

  const toggleWatch = async () => {
    if (!game) return;

    setLoadingWatch(true);
    try {
      if (!watching) {
        await api.post(`/games/${game.id}/watch`);
        setWatching(true);
        showAlert("success", "Aviso ativado", "Vamos te avisar quando o jogo voltar a ficar disponível.");
      } else {
        await api.delete(`/games/${game.id}/watch`);
        setWatching(false);
        showAlert("info", "Aviso removido", "Você não será mais notificado.");
      }
    } catch {
      showAlert("error", "Erro", "Não foi possível atualizar o aviso.");
    } finally {
      setLoadingWatch(false);
    }
  };

  useEffect(() => {
    if (!game?.id) return;

    api
      .get(`/games/${game.id}/can-rate`)
      .then((res) => setCanRate(!!res.data?.canRate))
      .catch(() => setCanRate(false));
  }, [game?.id]);

  const rentOriginalNow = useCallback(async () => {
    if (!game) return;

    try {
      await api.post("/rentals", { gameId: game.id });
      showAlert("success", "Pedido de aluguel solocitado!", "Retire o seu jogo na Biblioteca IFMA - Campus Timon");
      setRentOpen(false);
      await fetchDetails();
    } catch (e: any) {
      if (isTermsBlocked(e)) {
        pendingRentRef.current = { type: "original" };
        setTermsOpen(true);
        return;
      }

      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      if (code === "ONLY_COPIES_ALLOWED") {
        setRentOpen(true);
        showAlert("info", "Escolha um exemplar", "Este jogo só pode ser alugado por exemplar.");
        return;
      }

      if (code === "GAME_UNAVAILABLE") {
        showAlert("error", "Indisponível", "Este jogo não está disponível no momento.");
        return;
      }

      if (code === "RENTAL_LIMIT_REACHED") {
        showAlert("info", "Limite atingido", "Você já possui 2 aluguéis em aberto. Finalize um para alugar outro.");
        return;
      }

      if (code === "TIER_ACCESS_DENIED") {
        showAlert("error", "Acesso restrito", msg || "Sua categoria de cliente não permite alugar este jogo.");
        return;
      }

      showAlert("error", "Erro", msg || "Não foi possível alugar. Tente novamente.");
    }
  }, [game, fetchDetails, showAlert]);

  const rentCopyNow = useCallback(
    async (copyId: string) => {
      if (!game) return;

      try {
        await api.post("/rentals", { gameId: game.id, copyId });
        showAlert("success", "Exemplar alugado!", "Retire o seu jogo na Biblioteca IFMA - Campus Timon");
        setRentOpen(false);
        await fetchDetails();
      } catch (e: any) {
        if (isTermsBlocked(e)) {
          pendingRentRef.current = { type: "copy", copyId };
          setTermsOpen(true);
          return;
        }

        const code = e?.response?.data?.code;
        const msg = e?.response?.data?.error;

        if (code === "RENTAL_LIMIT_REACHED") {
          showAlert("info", "Limite atingido", "Você já possui 2 aluguéis em aberto. Finalize um para alugar outro.");
          return;
        }

        if (code === "COPY_UNAVAILABLE") {
          showAlert("error", "Exemplar indisponível", "Esse exemplar acabou de ficar indisponível. Atualize e tente outro.");
          return;
        }

        if (code === "TIER_ACCESS_DENIED") {
          showAlert("error", "Acesso restrito", msg || "Sua categoria de cliente não permite alugar este jogo.");
          return;
        }

        showAlert("error", "Erro", msg || "Não foi possível alugar o exemplar.");
      }
    },
    [game, fetchDetails, showAlert]
  );

  const acceptTermsAndContinue = useCallback(async () => {
    if (!pendingRentRef.current) return;

    setTermsLoading(true);
    try {
      await api.post("/rentals/accept-terms");
      setTermsOpen(false);

      const pending = pendingRentRef.current;
      pendingRentRef.current = null;

      if (pending.type === "original") await rentOriginalNow();
      else await rentCopyNow(pending.copyId);
    } catch {
      showAlert("error", "Erro", "Não foi possível aceitar os termos. Tente novamente.");
    } finally {
      setTermsLoading(false);
    }
  }, [rentCopyNow, rentOriginalNow, showAlert]);

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
    } catch {
      showAlert("error", "Erro", "Não foi possível carregar os exemplares disponíveis.");
    } finally {
      setRentLoading(false);
    }
  }, [game, rentOriginalNow, showAlert]);

  const checkFavorite = useCallback(async (gameId: string) => {
    try {
      const res = await api.get(`/favorites/check/${gameId}`);
      setIsFavorite(!!res.data?.isFavorite);
    } catch {
      setIsFavorite(false);
    }
  }, []);

  useEffect(() => {
    if (game?.id) checkFavorite(game.id);
  }, [game?.id, checkFavorite]);

  const handleToggleFavorite = async () => {
    if (!game?.id || favSaving) return;

    setFavSaving(true);
    const next = !isFavorite;
    setIsFavorite(next);

    try {
      if (next) {
        await api.post(`/favorites/${game.id}`);
        setFavToastMessage("Adicionado aos favoritos");
      } else {
        await api.delete(`/favorites/${game.id}`);
        setFavToastMessage("Removido dos favoritos");
      }

      setFavToastVisible(true);
      setTimeout(() => setFavToastVisible(false), 3000);
    } catch {
      setIsFavorite(!next);
    } finally {
      setFavSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
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
          <GameHero
            gameId={game.id}
            coverUrl={game.cover}
            isFavorite={isFavorite}
            onToggleFavorite={() => {
              if (isAdmin) {
                showAlert("info", "Ação bloqueada", "Administrador não pode favoritar jogos");
                return;
              }
              handleToggleFavorite();
            }}
          />

          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <GameMeta
                title={game.title}
                avgRating={avgRating}
                ratingsCount={game.ratingsCount}
                onPressRate={() => {
                  if (isAdmin) {
                    showAlert("info", "Ação bloqueada", "Conta ADMIN não pode avaliar jogos.");
                    return;
                  }
                  if (!canRate) {
                    showAlert("info", "Avaliação bloqueada", "Você só pode avaliar este jogo após alugar e devolver.");
                    return;
                  }
                  setRateOpen(true);
                }}
                available={!!game.available}
                rentalDaysText="Até 3 dias"
                availabilityForecast={null}
                tier={game.tier}
              />

              <GameFactsRow players={playersText} time={timeText} age={ageText} />

              { /*GameLocationPreview
                placeName="Biblioteca, Campus Timon"
                address="IFMA - Campus Timon"
                latitude={-5.11152}
                longitude={-42.85378}
              />
*/}
              <View style={styles.tabs}>
                <Pressable
                  onPress={() => setTab("description")}
                  style={[styles.tab, tab === "description" && styles.tabYellow]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={tab === "description" ? "#fff" : "#7A8194"}
                  />
                  <Text
                    numberOfLines={1}
                    style={[styles.tabText, tab === "description" && styles.tabTextActive]}
                  >
                    Descrição
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setTab("components")}
                  style={[styles.tab, tab === "components" && styles.tabBlue]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={16}
                    color={tab === "components" ? "#fff" : "#7A8194"}
                  />
                  <Text
                    numberOfLines={1}
                    style={[styles.tabText, tab === "components" && styles.tabTextActive]}
                  >
                    Componentes
                  </Text>
                </Pressable>

                {hasHowToPlay && (
                  <Pressable
                    onPress={() => setTab("howtoplay")}
                    style={[styles.tab, tab === "howtoplay" && styles.tabRed]}
                  >
                    <Ionicons
                      name="play-circle-outline"
                      size={16}
                      color={tab === "howtoplay" ? "#fff" : "#7A8194"}
                    />
                    <Text
                      numberOfLines={1}
                      style={[styles.tabText, tab === "howtoplay" && styles.tabTextActive]}
                    >
                      Como jogar
                    </Text>
                  </Pressable>
                )}
              </View>

              {tab === "description" && <GameDescription description={game.description} />}

              {tab === "components" && <GameComponents gameId={game.id} />}

              {tab === "howtoplay" && hasHowToPlay && (
                <GameHowToPlay url={game.howToPlayUrl} title={game.title} />
              )}
            </ScrollView>
          </View>

          <BottomBar
            price={game.price}
            unavailable={!game.isAvailableNow}
            rentedByMe={game.rentedByMe}
            watching={watching}
            loadingWatch={loadingWatch}
            onToggleWatch={toggleWatch}
            onPressRent={() => {
              if (isAdmin) {
                showAlert("info", "Ação bloqueada", "Administrador não pode alugar jogos.");
                return;
              }
              openRentFlow();
            }}
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

          <TermsRentModal
            visible={termsOpen}
            loading={termsLoading}
            onClose={() => {
              setTermsOpen(false);
              pendingRentRef.current = null;
            }}
            onAccept={acceptTermsAndContinue}
          />

          {favToastVisible && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{favToastMessage}</Text>
              <Pressable
                onPress={() => {
                  setFavToastVisible(false);
                  router.push("/favorites");
                }}
              >
                <Text style={styles.toastAction}>Ver favoritos</Text>
              </Pressable>
            </View>
          )}

          <LudusAlert
            visible={alertVisible}
            type={alertType}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -10,
    paddingHorizontal: 16,
    paddingTop: 10,
    overflow: "hidden",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  toast: {
    position: "absolute",
    bottom: 96,
    left: 18,
    right: 18,
    backgroundColor: "#0A0A0A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
  },

  toastText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  toastAction: {
    color: "#FBBC04",
    fontWeight: "900",
    fontSize: 13,
  },

  tabs: {
    flexDirection: "row",
    marginTop: 14,
    gap: 6,
  },

  tab: {
    flex: 1,
    minHeight: 38,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#F2F4F8",
  },

  tabText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#7A8194",
  },

  tabTextActive: {
    color: "#fff",
  },

  tabBlue: {
    backgroundColor: "#0A1F5C",
  },

  tabYellow: {
    backgroundColor: "#FBBC04",
  },

  tabRed: {
    backgroundColor: "#E53935",
  },
});