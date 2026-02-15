import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    paddingTop: 50, // status bar
    paddingHorizontal: 20,
    zIndex: 10,
  },

  cardWrapper: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  resultsText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    marginTop: 10
  
  },
  listHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: 16,
  paddingHorizontal: 4,
},

});
