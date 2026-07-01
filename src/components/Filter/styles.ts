import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: 100,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#F3F4F6", // Fundo suave inativo
  },
  chipActive: {
    backgroundColor: "#B3193A", // O Vermelho Ludus
  },
  chipText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#FFFFFF", // Branco puro dá o melhor contraste com o vermelho
    fontWeight: "800",
  },
  square: {
    width: 52,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  squareActive: {
    backgroundColor: "#B3193A",
  },
  squareText: {
    color: "#4B5563",
    fontWeight: "700",
    fontSize: 15,
  },
  squareTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  button: {
    marginTop: 40,
    height: 60,
    backgroundColor: "#B3193A", // Botãozão Vermelho
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B3193A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  sliderContainer: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A1628",
  },
});
