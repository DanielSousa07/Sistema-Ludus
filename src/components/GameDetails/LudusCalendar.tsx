import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface LudusCalendarProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  unavailableDates: string[];
  isLoading: boolean;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function LudusCalendar({
  currentYear,
  currentMonth,
  selectedDate,
  unavailableDates,
  isLoading,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: LudusCalendarProps) {
  const today = new Date();

  // Gera o grid do calendário (com espaços vazios no início para alinhar os dias da semana)
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentYear, currentMonth]);

  const formatDateToApiStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Calendário (Mês e Ano) */}
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} style={styles.navBtn}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={
              currentYear === today.getFullYear() &&
              currentMonth === today.getMonth()
                ? "#D1D5DB"
                : "#04096E"
            }
          />
        </Pressable>

        <Text style={styles.monthTitle}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>

        <Pressable onPress={onNextMonth} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={24} color="#04096E" />
        </Pressable>
      </View>

      {/* Dias da Semana */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((wd, index) => (
          <Text key={index} style={styles.weekDayText}>
            {wd}
          </Text>
        ))}
      </View>

      {/* Grid de Dias */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#04096E" size="large" />
          <Text style={styles.loadingText}>Verificando disponibilidade...</Text>
        </View>
      ) : unavailableDates[0] === "ALL" ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={32} color="#E62325" />
          <Text style={styles.allUnavailableText}>
            Nenhum exemplar físico cadastrado e disponível para este jogo no
            momento.
          </Text>
        </View>
      ) : (
        <View style={styles.daysGrid}>
          {calendarGrid.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();
            const dayDateObj = new Date(
              currentYear,
              currentMonth,
              day,
              23,
              59,
              59,
            );

            // Regras de Bloqueio Físico
            const isPast = dayDateObj < today && !isToday;
            const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Regras de Bloqueio da API (Esgotado ou Feriado)
            const dateStr = formatDateToApiStr(currentYear, currentMonth, day);
            const isFullBooked = unavailableDates.includes(dateStr);

            const isSelected =
              selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === currentMonth &&
              selectedDate?.getFullYear() === currentYear;

            const isDisabled = isPast || isWeekend || isFullBooked;

            // Isolamos a regra do esgotado (para não pintar de vermelho os fins de semana/passado)
            const isFullBookedDay = isFullBooked && !isPast && !isWeekend;

            return (
              <Pressable
                key={day}
                disabled={isDisabled}
                onPress={() =>
                  onSelectDate(new Date(currentYear, currentMonth, day))
                }
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isDisabled && styles.dayCellDisabled,
                  isFullBookedDay && styles.dayCellFullBooked, // Borda e fundo vermelho
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && !isSelected && styles.dayTextToday,
                    isDisabled && styles.dayTextDisabled,
                    isFullBookedDay && styles.dayTextFullBooked, // Texto em vermelho
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Legenda Detalhada do Calendário */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Entenda o calendário:</Text>

        <View style={styles.legendGrid}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#F9FAFB" }]} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "bold" }}>Cinza:</Text> Indisponível
              (Passado, Feriado ou Fim de Semana). A biblioteca não funciona.
            </Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: "#FFF4F2",
                  borderColor: "#E62325",
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  styles.dayTextFullBooked,
                  { fontSize: 11, textAlign: "center" },
                ]}
              >
                10
              </Text>
            </View>
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "bold" }}>Número em Vermelho:</Text>{" "}
              Esgotado. Todas as cópias do jogo já foram alugadas neste dia.
            </Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#04096E" }]} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "bold" }}>Azul Escuro:</Text> Data
              selecionada por você.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A1628",
    textTransform: "capitalize",
  },
  navBtn: {
    padding: 8,
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDayText: {
    width: 36,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCell: {
    width: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 12,
  },
  dayCellSelected: {
    backgroundColor: "#04096E",
  },
  dayCellDisabled: {
    backgroundColor: "#F9FAFB",
  },
  dayCellFullBooked: {
    backgroundColor: "#FFF4F2", // Fundo vermelho muito claro
    borderColor: "#E62325", // Borda sutil vermelha
    borderWidth: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  dayTextSelected: {
    color: "#FBBC04",
    fontWeight: "900",
  },
  dayTextDisabled: {
    color: "#D1D5DB",
  },
  dayTextToday: {
    color: "#FBBC04",
    fontWeight: "900",
  },
  dayTextFullBooked: {
    color: "#E62325", // Texto do número inteiramente em Vermelho
    fontWeight: "800",
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  allUnavailableText: {
    marginTop: 12,
    color: "#E62325",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 20,
  },

  // Estilos da Legenda Detalhada
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  legendGrid: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2, // Alinha com a primeira linha do texto
  },
  legendText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
});
