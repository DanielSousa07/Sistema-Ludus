import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GameTimeRange } from "./GameTimeRange";
import PriceRange from "./PriceRange";
import { styles } from "./styles";
interface FilterValues {
    status: "ALL" | "AVAILABLE" | "RESERVED" | "RENTED";
    players: number | null;
    age: number | null;
    stars: number[];
}

interface Props {
    onApply: (filters: FilterValues) => void
}

export function FilterCard({ onApply }: Props) {
    const [status, setStatus] = useState<FilterValues["status"]>("ALL");
    const [players, setPlayers] = useState<number | null>(null)
    const [age, setAge] = useState<number | null>(null);
    const [stars, setStars] = useState<number[]>([]);

    const [priceMin, setPriceMin] = useState<number>(0);
    const [priceMax, setPriceMax] = useState<number>(100);

    const [timeMin, setTimeMin] = useState<number>(20);
    const [timeMax, setTimeMax] = useState<number>(60);



    function toggleStar(value: number) {
        setStars(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    return (


        <ScrollView >
            <View style={styles.card}>
                <Text style={styles.title}>Status do jogo</Text>

                <View style={styles.row}>
                    {[
                        { label: "Todos", value: "ALL" },
                        { label: "Disponível", value: "AVAILABLE" },
                        { label: "Reservado", value: "RESERVED" },
                        { label: "Alugado", value: "RENTED" },
                    ].map(item => (
                        <TouchableOpacity
                            key={item.value}
                            style={[
                                styles.chip,
                                status === item.value && styles.chipActive,
                            ]}
                            onPress={() => setStatus(item.value as any)}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    status === item.value && styles.chipTextActive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <PriceRange
                    onChange={(min, max) => {
                        setPriceMin(min);
                        setPriceMax(max);
                    }}
                />

                <Text style={styles.title}>Quantidade de jogadores</Text>
                <View style={styles.row}>
                    {[null, 1, 2, 3, 4, 5].map(value => (
                        <TouchableOpacity
                            key={value ?? "ALL"}
                            style={[
                                styles.square,
                                players === value && styles.squareActive,
                            ]}
                            onPress={() => setPlayers(value)}
                        >
                            <Text
                                style={[
                                    styles.squareText,
                                    players === value && styles.squareTextActive,
                                ]}
                            >
                                {value === null ? "Todos" : value === 5 ? "5+" : value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.title}>Idade</Text>
                <View style={styles.row}>
                    {[null, 4, 6, 8, 10, 12].map(value => (
                        <TouchableOpacity
                            key={value ?? "ALL"}
                            style={[
                                styles.square,
                                age === value && styles.squareActive,
                            ]}
                            onPress={() => setAge(value)}
                        >
                            <Text
                                style={[
                                    styles.squareText,
                                    age === value && styles.squareTextActive,
                                ]}
                            >
                                {value === null ? "Todos" : value === 5 ? "5+" : value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <GameTimeRange


                    onChange={(min, max) => {
                        setTimeMin(min);
                        setTimeMax(max);
                    }}
                />

                <Text style={styles.title}>Número de estrelas</Text>
                {[5, 4, 3, 2, 1].map(star => (
                    <TouchableOpacity
                        key={star}
                        style={styles.starRow}
                        onPress={() => toggleStar(star)}
                    >
                        <View style={{ flexDirection: "row", gap: 2 }}>
                            {Array.from({ length: star }).map((_, i) => (
                                <Ionicons key={i} name="star" size={17} color="#FBBC04" />
                            ))}
                        </View>
                        <Ionicons
                            name={stars.includes(star) ? "checkbox" : "square-outline"}
                            size={22}
                            color={stars.includes(star) ? "#B3193A" : "#DDD"}
                        />
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        onApply({ status, players, age, stars })
                    }
                >
                    <Text style={styles.buttonText}>Aplicar Filtros</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
