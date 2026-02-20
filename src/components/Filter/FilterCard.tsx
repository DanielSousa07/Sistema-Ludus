import { DEFAULTS, FilterValues, useFilters } from "@/src/contexts/FiltersContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GameTimeRange } from "./GameTimeRange";
import PriceRange from "./PriceRange";
import { styles } from "./styles";

interface Props {
  onApply: (filters: FilterValues) => void;
  initialValues: FilterValues;
}

export function FilterCard({ onApply, initialValues }: Props) {
  const { resetFilters } = useFilters();

  const [status, setStatus] = useState<FilterValues["status"]>(initialValues.status);
  const [players, setPlayers] = useState<number | null>(initialValues.players);
  const [age, setAge] = useState<number | null>(initialValues.age);
  const [stars, setStars] = useState<number[]>(initialValues.stars);

  const [priceMin, setPriceMin] = useState<number>(initialValues.priceMin);
  const [priceMax, setPriceMax] = useState<number>(initialValues.priceMax);

  const [timeMax, setTimeMax] = useState<number>(initialValues.timeMax);

  function toggleStar(value: number) {
    setStars((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  }

  const handleClear = () => {
    // reset local
    setStatus(DEFAULTS.status);
    setPlayers(DEFAULTS.players);
    setAge(DEFAULTS.age);
    setStars(DEFAULTS.stars);
    setPriceMin(DEFAULTS.priceMin);
    setPriceMax(DEFAULTS.priceMax);
    setTimeMax(DEFAULTS.timeMax);

    // reset global
    resetFilters();
  };

  const canClear = useMemo(() => {
    return (
      status !== DEFAULTS.status ||
      players !== DEFAULTS.players ||
      age !== DEFAULTS.age ||
      stars.length > 0 ||
      priceMin !== DEFAULTS.priceMin ||
      priceMax !== DEFAULTS.priceMax ||
      timeMax !== DEFAULTS.timeMax
    );
  }, [status, players, age, stars, priceMin, priceMax, timeMax]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.card}>
        {/* Header do card + Limpar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.title}>Status do jogo</Text>

          <TouchableOpacity onPress={handleClear} disabled={!canClear}>
            <Text style={{ color: "#E62325", fontWeight: "700", opacity: canClear ? 1 : 0.4 }}>
              Limpar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {[
            { label: "Reservado", value: "RESERVED" },
            { label: "Todos", value: "ALL" },
            { label: "Disponível", value: "AVAILABLE" },
            { label: "Alugado", value: "RENTED" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, status === item.value && styles.chipActive]}
              onPress={() => setStatus(item.value as FilterValues["status"])}
            >
              <Text style={[styles.chipText, status === item.value && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ✅ PriceRange precisa receber valor atual pra manter ativo */}
        <PriceRange
          valueMin={priceMin}
          valueMax={priceMax}
          onChange={(min, max) => {
            setPriceMin(min);
            setPriceMax(max);
          }}
        />

        <Text style={styles.title}>Quantidade de jogadores</Text>
        <View style={styles.row}>
          {[null, 2, 3, 4, 5, 6, 7, 8].map((value) => (
            <TouchableOpacity
              key={value ?? "ALL"}
              style={[styles.square, players === value && styles.squareActive]}
              onPress={() => setPlayers(value)}
            >
              <Text style={[styles.squareText, players === value && styles.squareTextActive]}>
                {value === null ? "Todos" : value === 8 ? "8+" : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Idade</Text>
        <View style={styles.row}>
          {[null, 4, 6, 8, 10, 12, 14].map((value) => (
            <TouchableOpacity
              key={value ?? "ALL"}
              style={[styles.square, age === value && styles.squareActive]}
              onPress={() => setAge(value)}
            >
              <Text style={[styles.squareText, age === value && styles.squareTextActive]}>
                {value === null ? "Todos" : value === 14 ? "14+" : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ✅ GameTimeRange precisa receber valor atual */}
        <GameTimeRange
          valueMax={timeMax}
          onChange={(max) => setTimeMax(max)}
        />

        <Text style={styles.title}>Número de estrelas</Text>
        {[5, 4, 3, 2, 1].map((star) => (
          <TouchableOpacity key={star} style={styles.starRow} onPress={() => toggleStar(star)}>
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
          onPress={() => onApply({ status, players, age, stars, priceMin, priceMax, timeMax })}
        >
          <Text style={styles.buttonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}