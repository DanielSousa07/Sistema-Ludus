import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface LudusClockPickerProps {
  visible: boolean;
  title: string;
  initialDate: Date;
  minHour: number;
  maxHour: number;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const CLOCK_SIZE = 260;
const CENTER = CLOCK_SIZE / 2;
const DIAL_RADIUS = 100;
const NUMBER_RADIUS = 20;

export function LudusClockPicker({
  visible,
  title,
  initialDate,
  minHour,
  maxHour,
  onClose,
  onConfirm,
}: LudusClockPickerProps) {
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(initialDate.getMinutes());

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quando o modal abre, resetamos para o modo hora e sincronizamos a data
  useEffect(() => {
    if (visible) {
      setMode("hour");
      setHour(initialDate.getHours());

      // Arredonda os minutos iniciais para múltiplo de 5 para encaixar no relógio
      const currentMin = initialDate.getMinutes();
      const roundedMin = Math.round(currentMin / 5) * 5;
      setMinute(roundedMin === 60 ? 55 : roundedMin);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible, initialDate]);

  // Geração dos arrays de Horas e Minutos permitidos
  const hoursList = useMemo(() => {
    const list = [];
    for (let i = minHour; i <= maxHour; i++) {
      list.push(i);
    }
    return list;
  }, [minHour, maxHour]);

  const minutesList = useMemo(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  }, []);

  // Matemágica do Relógio: Converte valor (hora ou minuto) para Ângulo e Coordenadas (X, Y)
  const getCoordinates = (value: number, isHour: boolean) => {
    let position = 0;

    if (isHour) {
      // 12h = posição 12, 13h = posição 1, 14h = posição 2...
      position = value % 12;
      if (position === 0) position = 12;
    } else {
      // 0min = posição 12, 5min = posição 1...
      position = value / 5;
      if (position === 0) position = 12;
    }

    // Posição 3 (3h ou 15m) é 0 graus na matemática padrão.
    // 1 posição no relógio = 30 graus. Posição 12 é o topo (-90 graus).
    const angleDeg = position * 30 - 90;
    const angleRad = angleDeg * (Math.PI / 180);

    const x = CENTER + DIAL_RADIUS * Math.cos(angleRad) - NUMBER_RADIUS;
    const y = CENTER + DIAL_RADIUS * Math.sin(angleRad) - NUMBER_RADIUS;

    return { x, y, angleDeg };
  };

  const handleSelectHour = (h: number) => {
    setHour(h);
    // Transição suave para os minutos após selecionar a hora
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMode("minute");
    }, 300);
  };

  const handleSelectMinute = (m: number) => {
    setMinute(m);
  };

  const handleSave = () => {
    const newDate = new Date(initialDate);
    newDate.setHours(hour, minute, 0, 0);
    onConfirm(newDate);
  };

  const activeValue = mode === "hour" ? hour : minute;
  const { angleDeg } = getCoordinates(activeValue, mode === "hour");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0A1628" />
            </Pressable>
          </View>

          {/* Display Digital */}
          <View style={styles.digitalDisplay}>
            <Pressable
              onPress={() => setMode("hour")}
              style={[
                styles.digitalBlock,
                mode === "hour" && styles.digitalBlockActive,
              ]}
            >
              <Text
                style={[
                  styles.digitalText,
                  mode === "hour" && styles.digitalTextActive,
                ]}
              >
                {String(hour).padStart(2, "0")}
              </Text>
            </Pressable>

            <Text style={styles.digitalSeparator}>:</Text>

            <Pressable
              onPress={() => setMode("minute")}
              style={[
                styles.digitalBlock,
                mode === "minute" && styles.digitalBlockActive,
              ]}
            >
              <Text
                style={[
                  styles.digitalText,
                  mode === "minute" && styles.digitalTextActive,
                ]}
              >
                {String(minute).padStart(2, "0")}
              </Text>
            </Pressable>
          </View>

          {/* Relógio Analógico Circular */}
          <View style={styles.clockFace}>
            {/* O Ponto Central */}
            <View style={styles.centerDot} />

            {/* O Ponteiro Dinâmico */}
            <View
              style={[
                styles.handContainer,
                { transform: [{ rotate: `${angleDeg}deg` }] },
              ]}
            >
              <View style={styles.handLine} />
            </View>

            {/* Os Números Circulares (Horas) */}
            {mode === "hour" &&
              hoursList.map((h) => {
                const { x, y } = getCoordinates(h, true);
                const isSelected = hour === h;

                return (
                  <Pressable
                    key={`hour-${h}`}
                    onPress={() => handleSelectHour(h)}
                    style={[
                      styles.numberCircle,
                      { left: x, top: y },
                      isSelected && styles.numberCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        isSelected && styles.numberTextSelected,
                      ]}
                    >
                      {String(h).padStart(2, "0")}
                    </Text>
                  </Pressable>
                );
              })}

            {/* Os Números Circulares (Minutos) */}
            {mode === "minute" &&
              minutesList.map((m) => {
                const { x, y } = getCoordinates(m, false);
                const isSelected = minute === m;

                return (
                  <Pressable
                    key={`minute-${m}`}
                    onPress={() => handleSelectMinute(m)}
                    style={[
                      styles.numberCircle,
                      { left: x, top: y },
                      isSelected && styles.numberCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        isSelected && styles.numberTextSelected,
                      ]}
                    >
                      {String(m).padStart(2, "0")}
                    </Text>
                  </Pressable>
                );
              })}
          </View>

          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Confirmar Horário</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: "85%",
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0A1628",
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },

  // Display Digital
  digitalDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  digitalBlock: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  digitalBlockActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#04096E",
    borderWidth: 2,
  },
  digitalText: {
    fontSize: 42,
    fontWeight: "600",
    color: "#6B7280",
  },
  digitalTextActive: {
    color: "#04096E",
    fontWeight: "900",
  },
  digitalSeparator: {
    fontSize: 42,
    fontWeight: "900",
    color: "#D1D5DB",
    marginHorizontal: 12,
    paddingBottom: 6,
  },

  // Relógio
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: "#F9FAFB",
    position: "relative",
    marginBottom: 32,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#04096E",
    position: "absolute",
    left: CENTER - 4,
    top: CENTER - 4,
    zIndex: 10,
  },
  handContainer: {
    width: DIAL_RADIUS * 2,
    height: 2,
    position: "absolute",
    left: CENTER - DIAL_RADIUS,
    top: CENTER - 1,
    zIndex: 5,
  },
  handLine: {
    width: DIAL_RADIUS,
    height: 2,
    backgroundColor: "#04096E",
    marginLeft: DIAL_RADIUS, // Oculta a metade esquerda para girar em torno do centro
  },
  numberCircle: {
    position: "absolute",
    width: NUMBER_RADIUS * 2,
    height: NUMBER_RADIUS * 2,
    borderRadius: NUMBER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  numberCircleSelected: {
    backgroundColor: "#04096E",
  },
  numberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  numberTextSelected: {
    color: "#FBBC04",
    fontWeight: "900",
  },

  // Botão
  button: {
    backgroundColor: "#04096E",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FBBC04",
    fontSize: 16,
    fontWeight: "900",
  },
});
