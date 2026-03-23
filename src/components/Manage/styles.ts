import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "85%",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#31358B",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  gameItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  gameName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#31358B",
  },
  addButton: {
    backgroundColor: "#31358B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonDisabled: {
    backgroundColor: "#A5A7D6",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#31358B",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});