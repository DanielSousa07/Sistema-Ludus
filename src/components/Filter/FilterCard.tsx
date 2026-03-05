import { DEFAULT_FILTERS, FilterValues, useFilters } from "@/src/contexts/FiltersContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GameTimeRange } from "./GameTimeRange";
import PriceRange from "./PriceRange";
import { styles } from "./styles";

interface Props {
  onApply: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export function FilterCard({ onApply, initialValues }: Props) {
  const { resetFilters } = useFilters();

  const initial = initialValues ?? DEFAULT_FILTERS;

  const [status, setStatus] = useState<FilterValues["status"]>(initial.status);
  const [players, setPlayers] = useState<number | null>(initial.players);
  const [age, setAge] = useState<number | null>(initial.age);
  const [stars, setStars] = useState<number[]>(initial.stars);

  const [priceMin, setPriceMin] = useState<number>(initial.priceMin);
  const [priceMax, setPriceMax] = useState<number>(initial.priceMax);

  const [timeMax, setTimeMax] = useState<number>(initial.timeMax);


  useEffect(() => {
    const v = initialValues ?? DEFAULT_FILTERS;
    setStatus(v.status);
    setPlayers(v.players);
    setAge(v.age);
    setStars(v.stars);
    setPriceMin(v.priceMin);
    setPriceMax(v.priceMax);
    setTimeMax(v.timeMax);
  }, [initialValues]);

  function toggleStar(value: number) {
    setStars((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  }

  const handleClear = () => {
    setStatus(DEFAULT_FILTERS.status);
    setPlayers(DEFAULT_FILTERS.players);
    setAge(DEFAULT_FILTERS.age);
    setStars(DEFAULT_FILTERS.stars);
    setPriceMin(DEFAULT_FILTERS.priceMin);
    setPriceMax(DEFAULT_FILTERS.priceMax);
    setTimeMax(DEFAULT_FILTERS.timeMax);

    resetFilters();
  };

  const canClear = useMemo(() => {
    return (
      status !== DEFAULT_FILTERS.status ||
      players !== DEFAULT_FILTERS.players ||
      age !== DEFAULT_FILTERS.age ||
      stars.length > 0 ||
      priceMin !== DEFAULT_FILTERS.priceMin ||
      priceMax !== DEFAULT_FILTERS.priceMax ||
      timeMax !== DEFAULT_FILTERS.timeMax
    );
  }, [status, players, age, stars, priceMin, priceMax, timeMax]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 6, flexGrow: 1 }}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.title}>Status do jogo</Text>

          <TouchableOpacity onPress={handleClear} disabled={!canClear}>
            <Text style={{ color: "#dd1519", fontWeight: "700", opacity: canClear ? 1 : 0.4 }}>
              Limpar Tudo
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

        <GameTimeRange valueMax={timeMax} onChange={(max) => setTimeMax(max)} />

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