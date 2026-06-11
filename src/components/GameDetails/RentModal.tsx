import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LudusClockPicker } from "./LudusClockPicker"; // 👇 Importamos a nossa Obra-Prima

interface RentModalProps {
  visible: boolean;
  gameId: string;
  onClose: () => void;
  onConfirm: (startDateIso: string, endDateIso: string) => Promise<void>;
  loading?: boolean;
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

export function RentModal({
  visible,
  gameId,
  onClose,
  onConfirm,
  loading,
}: RentModalProps) {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  // Controle de visibilidade do relógio customizado
  const [pickerStartVisible, setPickerStartVisible] = useState(false);
  const [pickerEndVisible, setPickerEndVisible] = useState(false);

  const [startTime, setStartTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  const [endTime, setEndTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    return d;
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUnavailableDates = useCallback(
    async (year: number, month: number) => {
      if (!gameId) return;
      setLoadingCalendar(true);
      try {
        const response = await api.get(
          `/rentals/game/${gameId}/unavailable-dates`,
          {
            params: { year, month },
          },
        );

        if (response.data?.unavailableDates) {
          if (response.data.unavailableDates[0] === "ALL") {
            setUnavailableDates(["ALL"]);
          } else {
            setUnavailableDates(response.data.unavailableDates);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar calendário:", err);
      } finally {
        setLoadingCalendar(false);
      }
    },
    [gameId],
  );

  useEffect(() => {
    if (visible) {
      setErrorMsg(null);
      fetchUnavailableDates(currentYear, currentMonth);
    } else {
      setSelectedDate(null);
    }
  }, [visible, currentYear, currentMonth, fetchUnavailableDates]);

  const handlePrevMonth = () => {
    if (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth()
    )
      return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

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

  const validateAndSubmit = async () => {
    setErrorMsg(null);

    if (!selectedDate) {
      return setErrorMsg("Por favor, selecione um dia no calendário.");
    }

    const start = new Date(selectedDate);
    start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const end = new Date(selectedDate);
    end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    if (start.getHours() < 8 || start.getHours() >= 19) {
      return setErrorMsg("A retirada deve ser agendada entre 08:00 e 18:59.");
    }

    if (end.getHours() < 8 || end.getHours() > 19) {
      return setErrorMsg(
        "A devolução deve ser agendada no máximo até as 19:00.",
      );
    }

    if (start >= end) {
      return setErrorMsg(
        "O horário de devolução deve ser maior que o de retirada.",
      );
    }

    if (start < new Date()) {
      return setErrorMsg("Escolha um horário no futuro.");
    }

    await onConfirm(start.toISOString(), end.toISOString());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Agendar Jogo</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0A1628" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* LUDUS CALENDAR CUSTOMIZADO */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Pressable onPress={handlePrevMonth} style={styles.monthNavBtn}>
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

                <Pressable onPress={handleNextMonth} style={styles.monthNavBtn}>
                  <Ionicons name="chevron-forward" size={24} color="#04096E" />
                </Pressable>
              </View>

              <View style={styles.weekDaysRow}>
                {WEEK_DAYS.map((wd, index) => (
                  <Text key={index} style={styles.weekDayText}>
                    {wd}
                  </Text>
                ))}
              </View>

              {loadingCalendar ? (
                <View style={styles.calendarLoading}>
                  <ActivityIndicator color="#04096E" size="large" />
                </View>
              ) : unavailableDates[0] === "ALL" ? (
                <View style={styles.calendarLoading}>
                  <Ionicons name="alert-circle" size={32} color="#E62325" />
                  <Text style={styles.allUnavailableText}>
                    Nenhum exemplar físico cadastrado e disponível para este
                    jogo no momento.
                  </Text>
                </View>
              ) : (
                <View style={styles.daysGrid}>
                  {calendarGrid.map((day, index) => {
                    if (day === null) {
                      return (
                        <View key={`empty-${index}`} style={styles.dayCell} />
                      );
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
                    const isPast = dayDateObj < today && !isToday;
                    const dayOfWeek = new Date(
                      currentYear,
                      currentMonth,
                      day,
                    ).getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const dateStr = formatDateToApiStr(
                      currentYear,
                      currentMonth,
                      day,
                    );
                    const isFullBooked = unavailableDates.includes(dateStr);
                    const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentMonth &&
                      selectedDate?.getFullYear() === currentYear;

                    const isDisabled = isPast || isWeekend || isFullBooked;

                    return (
                      <Pressable
                        key={day}
                        disabled={isDisabled}
                        onPress={() =>
                          setSelectedDate(
                            new Date(currentYear, currentMonth, day),
                          )
                        }
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          isDisabled && styles.dayCellDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isDisabled && styles.dayTextDisabled,
                            isToday && !isSelected && styles.dayTextToday,
                          ]}
                        >
                          {day}
                        </Text>

                        {isFullBooked && <View style={styles.dotRed} />}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#F3F4F6" }]}
                />
                <Text style={styles.legendText}>Fechado</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#E62325" }]}
                />
                <Text style={styles.legendText}>Esgotado</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View
                style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}
              >
                <Text style={styles.label}>Retirada (08h+)</Text>
                {/* 👇 AQUI CHAMAMOS O NOVO MODAL */}
                <Pressable
                  style={styles.pickerBox}
                  onPress={() => setPickerStartVisible(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#22C55E" />
                  <Text style={styles.pickerText}>
                    {startTime.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Pressable>
              </View>

              <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Devolução (até 19h)</Text>
                {/* 👇 AQUI CHAMAMOS O NOVO MODAL */}
                <Pressable
                  style={styles.pickerBox}
                  onPress={() => setPickerEndVisible(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#E62325" />
                  <Text style={styles.pickerText}>
                    {endTime.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color="#B8860B" />
              <Text style={styles.infoText}>
                No seu nível atual, a devolução deve ocorrer no mesmo dia letivo
                da retirada.
              </Text>
            </View>

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            <Pressable
              style={styles.button}
              onPress={validateAndSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Confirmar Agendamento</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>

      {/* ======================================================= */}
      {/* RENDERIZAÇÃO DO RELÓGIO EXCLUSIVO LUDUS                 */}
      {/* ======================================================= */}
      <LudusClockPicker
        visible={pickerStartVisible}
        title="Horário de Retirada"
        initialDate={startTime}
        minHour={8}
        maxHour={18} // Trava pra retirada máxima às 18:55
        onClose={() => setPickerStartVisible(false)}
        onConfirm={(date) => {
          setStartTime(date);
          setPickerStartVisible(false);
        }}
      />

      <LudusClockPicker
        visible={pickerEndVisible}
        title="Horário de Devolução"
        initialDate={endTime}
        minHour={8}
        maxHour={19}
        onClose={() => setPickerEndVisible(false)}
        onConfirm={(date) => {
          setEndTime(date);
          setPickerEndVisible(false);
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#04096E",
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  calendarHeader: {
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
  monthNavBtn: {
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
  dotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E62325",
    position: "absolute",
    bottom: 4,
  },
  calendarLoading: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  allUnavailableText: {
    marginTop: 12,
    color: "#E62325",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  pickerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
  },
  pickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0A1628",
    fontWeight: "800",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FBBC04",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 13,
    color: "#9A6B00",
    flex: 1,
    fontWeight: "600",
    lineHeight: 18,
  },
  errorText: {
    color: "#E62325",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#04096E",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#04096E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FBBC04",
    fontSize: 16,
    fontWeight: "900",
  },
});
