import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LudusCalendar } from "./LudusCalendar"; // 👇 O Novo Componente
import { LudusClockPicker } from "./LudusClockPicker";

interface RentModalProps {
  visible: boolean;
  gameId: string;
  onClose: () => void;
  onConfirm: (startDateIso: string, endDateIso: string) => Promise<void>;
  loading?: boolean;
}

export function RentModal({
  visible,
  gameId,
  onClose,
  onConfirm,
  loading,
}: RentModalProps) {
  const today = new Date();

  // Estados do Calendário
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  // Controle de visibilidade dos relógios
  const [pickerStartVisible, setPickerStartVisible] = useState(false);
  const [pickerEndVisible, setPickerEndVisible] = useState(false);

  // Estados dos Relógios
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

  // Busca os dias indisponíveis da API
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
            {/* 👇 O NOVO COMPONENTE LUDUS CALENDAR 👇 */}
            <LudusCalendar
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              unavailableDates={unavailableDates}
              isLoading={loadingCalendar}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <View style={styles.row}>
              <View
                style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}
              >
                <Text style={styles.label}>Retirada (08h+)</Text>
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

      {/* MODAIS DE RELÓGIO (Ocultos até o clique) */}
      <LudusClockPicker
        visible={pickerStartVisible}
        title="Horário de Retirada"
        initialDate={startTime}
        minHour={8}
        maxHour={18}
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
    color: "#f8f7f3",
    fontSize: 16,
    fontWeight: "900",
  },
});
