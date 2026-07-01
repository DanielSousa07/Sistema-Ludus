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
import { LudusCalendar } from "./LudusCalendar";

interface RentModalProps {
  visible: boolean;
  gameId: string;
  onClose: () => void;
  onConfirm: (startDateIso: string, endDateIso: string) => Promise<void>;
  loading?: boolean;
}

// Helpers Matemáticos para lidar com os blocos de 30 minutos
const timeToMins = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

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

  // Controle de Turno (Manhã / Tarde)
  const [activePeriod, setActivePeriod] = useState<"morning" | "afternoon">(
    "morning",
  );

  // Estados da API e Lista
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Controle da Seleção Contínua (Primeiro bloco e Último bloco clicados)
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<string | null>(null);

  // Limpa tudo ao abrir/fechar o modal
  useEffect(() => {
    if (visible) {
      setErrorMsg(null);
      setSelectedDate(null);
      setSelectionStart(null);
      setSelectionEnd(null);
      setAvailableSlots([]);
      setActivePeriod("morning");
    }
  }, [visible]);

  // Busca a disponibilidade do dia na API
  const fetchSlotsForDate = useCallback(
    async (date: Date) => {
      if (!gameId) return;
      setLoadingSlots(true);
      setSelectionStart(null);
      setSelectionEnd(null);
      setErrorMsg(null);

      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      try {
        const response = await api.get(`/rentals/game/${gameId}/availability`, {
          params: { date: dateStr },
        });
        setAvailableSlots(response.data?.availableSlots || []);
      } catch (err) {
        console.error("Erro ao buscar horários:", err);
        setErrorMsg("Não foi possível carregar os horários livres.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [gameId],
  );

  useEffect(() => {
    if (selectedDate) {
      setActivePeriod("morning"); // Reseta para a manhã ao trocar de dia
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchSlotsForDate]);

  // LÓGICA DE SELEÇÃO E AGRUPAMENTO SEPARADO POR TURNOS
  const groupedSlots = useMemo(() => {
    const buildGroup = (startH: number, endH: number) => {
      const result = [];
      let currentOccupiedStart: string | null = null;
      let currentOccupiedEnd: string | null = null;

      for (let h = startH; h <= endH; h++) {
        for (let m of [0, 30]) {
          if (h === 18 && m === 30 && endH === 18) continue;

          const slotStart = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          const slotEndMins = timeToMins(slotStart) + 30;
          const slotEnd = minsToTime(slotEndMins);

          const isAvailable = availableSlots.includes(slotStart);

          if (isAvailable) {
            if (currentOccupiedStart) {
              result.push({
                start: currentOccupiedStart,
                end: minsToTime(timeToMins(currentOccupiedEnd!) + 30),
                status: "OCCUPIED",
              });
              currentOccupiedStart = null;
              currentOccupiedEnd = null;
            }
            result.push({
              start: slotStart,
              end: slotEnd,
              status: "AVAILABLE",
            });
          } else {
            if (!currentOccupiedStart) {
              currentOccupiedStart = slotStart;
            }
            currentOccupiedEnd = slotStart;
          }
        }
      }

      if (currentOccupiedStart) {
        result.push({
          start: currentOccupiedStart,
          end: minsToTime(timeToMins(currentOccupiedEnd!) + 30),
          status: "OCCUPIED",
        });
      }
      return result;
    };

    return {
      morning: buildGroup(8, 11), // 08:00 às 11:30 (Fim 12:00)
      afternoon: buildGroup(12, 18), // 12:00 às 18:00 (Fim 19:00)
    };
  }, [availableSlots]);

  // A Mágica do Clique: Permite arrastar e selecionar vários blocos
  const handleSlotPress = (slotStart: string) => {
    const cMins = timeToMins(slotStart);

    if (!selectionStart || !selectionEnd) {
      setSelectionStart(slotStart);
      setSelectionEnd(slotStart);
      return;
    }

    let sMins = timeToMins(selectionStart);
    let eMins = timeToMins(selectionEnd);

    if (cMins === sMins && cMins === eMins) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    if (cMins >= sMins && cMins <= eMins) {
      if (cMins === sMins) {
        setSelectionStart(minsToTime(sMins + 30));
      } else if (cMins === eMins) {
        setSelectionEnd(minsToTime(eMins - 30));
      } else {
        setSelectionStart(slotStart);
        setSelectionEnd(slotStart);
      }
      return;
    }

    const min = Math.min(sMins, cMins);
    const max = Math.max(eMins, cMins);

    let isValid = true;
    for (let m = min; m <= max; m += 30) {
      if (!availableSlots.includes(minsToTime(m))) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setSelectionStart(minsToTime(min));
      setSelectionEnd(minsToTime(max));
    } else {
      setSelectionStart(slotStart);
      setSelectionEnd(slotStart);
    }
  };

  const isSlotSelected = (slotStart: string) => {
    if (!selectionStart || !selectionEnd) return false;
    const sMins = timeToMins(selectionStart);
    const eMins = timeToMins(selectionEnd);
    const cMins = timeToMins(slotStart);
    return cMins >= sMins && cMins <= eMins;
  };

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
    if (!selectedDate || !selectionStart || !selectionEnd) return;

    const start = new Date(selectedDate);
    const [sh, sm] = selectionStart.split(":").map(Number);
    start.setHours(sh, sm, 0, 0);

    const endMins = timeToMins(selectionEnd) + 30;
    const end = new Date(selectedDate);
    end.setHours(Math.floor(endMins / 60), endMins % 60, 0, 0);

    await onConfirm(start.toISOString(), end.toISOString());
  };

  const hasSelection = selectionStart && selectionEnd;
  const finalEndTime = hasSelection
    ? minsToTime(timeToMins(selectionEnd) + 30)
    : null;

  const currentListToRender =
    activePeriod === "morning" ? groupedSlots.morning : groupedSlots.afternoon;

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
            contentContainerStyle={{ paddingBottom: hasSelection ? 100 : 20 }}
          >
            <LudusCalendar
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              unavailableDates={[]}
              isLoading={false}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            {!selectedDate ? (
              <View style={styles.stateContainer}>
                <Ionicons name="calendar-outline" size={32} color="#D1D5DB" />
                <Text style={styles.stateText}>
                  Toque em um dia no calendário para ver os horários
                  disponíveis.
                </Text>
              </View>
            ) : loadingSlots ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator color="#0A1F5C" size="large" />
                <Text style={styles.stateText}>
                  Carregando disponibilidade...
                </Text>
              </View>
            ) : availableSlots.length === 0 ? (
              <View style={styles.stateContainer}>
                <Ionicons name="sad-outline" size={32} color="#E62325" />
                <Text style={[styles.stateText, { color: "#E62325" }]}>
                  Poxa, todos os exemplares já estão esgotados neste dia.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {/* TABS DE TURNO (MANHÃ / TARDE) - CORES LUDUS */}
                <View style={styles.periodTabs}>
                  <Pressable
                    style={[
                      styles.periodTab,
                      activePeriod === "morning" && styles.periodTabActive,
                    ]}
                    onPress={() => setActivePeriod("morning")}
                  >
                    <Text
                      style={[
                        styles.periodTabText,
                        activePeriod === "morning" &&
                          styles.periodTabTextActive,
                      ]}
                    >
                      Manhã
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.periodTab,
                      activePeriod === "afternoon" && styles.periodTabActive,
                    ]}
                    onPress={() => setActivePeriod("afternoon")}
                  >
                    <Text
                      style={[
                        styles.periodTabText,
                        activePeriod === "afternoon" &&
                          styles.periodTabTextActive,
                      ]}
                    >
                      Tarde
                    </Text>
                  </Pressable>
                </View>

                {/* LISTA DE HORÁRIOS DO TURNO SELECIONADO */}
                {currentListToRender.map((item, index) => {
                  if (item.status === "OCCUPIED") {
                    return (
                      <View key={`occ-${index}`} style={styles.slotRowOccupied}>
                        <Text style={styles.slotTextOccupied}>
                          {item.start} às {item.end}
                        </Text>
                        <Text style={styles.occupiedBadge}>OCUPADO</Text>
                      </View>
                    );
                  }

                  const selected = isSlotSelected(item.start);
                  return (
                    <Pressable
                      key={`av-${item.start}`}
                      onPress={() => handleSlotPress(item.start)}
                      style={[
                        styles.slotRow,
                        selected && styles.slotRowSelected,
                      ]}
                    >
                      <View style={styles.slotLeft}>
                        {selected ? (
                          <View style={styles.checkIconWrap}>
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FBBC04"
                            />
                          </View>
                        ) : (
                          <View style={styles.checkIconWrapEmpty} />
                        )}
                        <Text
                          style={[
                            styles.slotText,
                            selected && styles.slotTextSelected,
                          ]}
                        >
                          {item.start} às {item.end}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          </ScrollView>

          {/* BARRA FLUTUANTE INFERIOR DE CONFIRMAÇÃO */}
          {hasSelection && (
            <View style={styles.bottomFloatingBarWrap}>
              <Pressable
                style={styles.bottomFloatingBar}
                onPress={validateAndSubmit}
                disabled={loading}
              >
                <View style={styles.bottomFloatingTextGroup}>
                  <Text style={styles.bottomFloatingTitle}>
                    {selectionStart} às {finalEndTime}
                  </Text>
                  <Text style={styles.bottomFloatingSub}>
                    Retirada na Biblioteca do Campus
                  </Text>
                </View>

                {loading ? (
                  <ActivityIndicator color="#FBBC04" />
                ) : (
                  <View style={styles.bottomFloatingAction}>
                    <Text style={styles.bottomFloatingActionText}>
                      Confirmar
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#FBBC04"
                    />
                  </View>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
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
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0A1F5C", // Ludus Blue
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
  },
  stateContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  listContainer: {
    marginTop: 12,
    marginBottom: 20,
  },

  // --- Estilos das Abas Manhã / Tarde (Estilo Ludus) ---
  periodTabs: {
    flexDirection: "row",
    backgroundColor: "#F1F3F7", // Cinza/Azulado muito suave
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  periodTabActive: {
    backgroundColor: "#0A1F5C", // Ludus Blue
    shadowColor: "#0A1F5C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#7A8194",
  },
  periodTabTextActive: {
    color: "#FBBC04", // Ludus Yellow
  },

  // --- Estilos da Lista de Horários ---
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  slotRowSelected: {
    borderColor: "#0A1F5C", // Ludus Blue na borda
    backgroundColor: "#F4F6FF", // Azul bem clarinho no fundo
  },
  slotLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0A1F5C", // Ludus Blue no círculo do check
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkIconWrapEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    marginRight: 12,
  },
  slotText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  slotTextSelected: {
    color: "#0A1F5C", // Texto fica Azul Ludus forte
  },
  slotRowOccupied: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  slotTextOccupied: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
    marginLeft: 36,
  },
  occupiedBadge: {
    fontSize: 12,
    fontWeight: "900",
    color: "#E62325", // Ludus Red alertando "OCUPADO"
    letterSpacing: 0.5,
  },

  errorText: {
    color: "#E62325", // Ludus Red
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
  },

  // --- Barra Flutuante de Confirmação ---
  bottomFloatingBarWrap: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  bottomFloatingBar: {
    backgroundColor: "#0A1F5C", // Ludus Blue
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#04096E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomFloatingTextGroup: {
    flex: 1,
  },
  bottomFloatingTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2,
  },
  bottomFloatingSub: {
    color: "#D6DCFF",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomFloatingAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  bottomFloatingActionText: {
    color: "#FBBC04", // Ludus Yellow no texto "Confirmar"
    fontWeight: "900",
    fontSize: 14,
    marginRight: 4,
  },
});
