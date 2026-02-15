import FilterButton from "@/src/components/common/FilterButton";
import GameCard from "@/src/components/Search/GameCard";
import SearchBackground from "@/src/components/Search/SearchBackground";
import SearchTop from "@/src/components/Search/SearchTop";
import { api } from "@/src/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { styles } from "./styles";

interface Game {
    id: string;
    title: string;
    cover: string;
    price: number;
    available: boolean; // Adicionado para exibir o status real
}

// Tipagem para os parâmetros de busca que podem vir na URL
interface SearchParams {
    q?: string;
    status?: string;
    players?: string;
    age?: string;
    priceMin?: string;
    priceMax?: string;
    timeMax?: string;
}

export default function SearchScreen() {
    const router = useRouter();
    // Captura todos os possíveis parâmetros da URL
    const params = useLocalSearchParams<Record<string, string>>();
    const { q, status, players, age, priceMin, priceMax, timeMax } = params;

    const [search, setSearch] = useState("");
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);

    function handleSearch() {
        router.setParams({ q: search });
    }

    useEffect(() => {
        if (q) setSearch(q);
    }, [q]);

   useEffect(() => {
    async function fetchResults() {
        setLoading(true);
        try {
            // Criamos um objeto apenas com o que realmente tem valor
            const searchParams: any = { q: q || "" };

            if (status && status !== "ALL") searchParams.status = status;
            
            // Verificamos se não é a string "null" que o router às vezes passa
            if (players && players !== "null") searchParams.players = players;
            if (age && age !== "null") searchParams.age = age;
            if (priceMin) searchParams.priceMin = priceMin;
            if (priceMax) searchParams.priceMax = priceMax;
            if (timeMax) searchParams.timeMax = timeMax;

            const response = await api.get('/games', { params: searchParams });
            setGames(response.data);
        } catch (error) {
            // Verifique o log do terminal do VS Code (Backend) para ver o erro real
            console.error("Erro na busca:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchResults();  
}, [q, status, players, age, priceMin, priceMax, timeMax]);

    return (
        <View style={styles.container}>
            <SearchBackground />

            <View style={styles.header}>
                <SearchTop
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    placeholder="Buscar jogos"
                />
            </View>

            <View style={styles.cardWrapper}>
               {loading ? (
                    <ActivityIndicator size="large" color="#31358B" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={games}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <GameCard data={{
                                title: item.title,
                                location: item.available ? "Disponível" : "Indisponível",
                                price: item.price,
                                days: 5, 
                                rating: 5.0,
                                image: item.cover 
                            }} />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                                Nenhum jogo encontrado com esses filtros.
                            </Text>
                        }
                        ListHeaderComponent={
                            <View style={styles.listHeader}>
                                <Text style={styles.resultsText}>
                                    {games.length} Resultados
                                </Text>
                                {/* O FilterButton agora deve abrir o Modal que chama router.setParams */}
                                <FilterButton />
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}