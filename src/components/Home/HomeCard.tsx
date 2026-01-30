import { StyleSheet, Text, View } from "react-native";
import GameCardVertical from "./GameCardVertical";
import GameCarousel from "./GameCarousel";

interface Game {
    id: string;
    title: string;
    cover: string;
    price: number;
}

export function HomeCard({ games }: { games: Game[] }) {
    const ForYouGames = games.slice(0, 3)
    const moreRentedGames = games.slice(4)

    return (
        <View style={styles.card}>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Para Você</Text>
                <Text style={styles.seeAll}>Ver tudo</Text>
            </View>

            <GameCarousel data={ForYouGames} />
            <Text style={styles.sectionTitle}>Mais Alugados</Text>

            {moreRentedGames.map((game) => (
                <GameCardVertical
                    key={game.id}
                    title={game.title}
                    location="Disponível"
                    rating={5.0}
                    image={game.cover} // Usa a imagem vinda da Ludopedia
                />
            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 19,
        marginTop: 27,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginVertical: 10,
    },
    seeAll: {
        color: "#4CAF50",
        fontWeight: "600",
    }
})