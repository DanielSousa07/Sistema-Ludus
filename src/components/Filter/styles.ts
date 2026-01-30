import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        marginTop: 120,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#535353",
        marginTop: 24,
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    }, 
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    chipActive: {
        backgroundColor: "#B3193A",
        borderColor: "#B3193A",
    },
    chipText: {
        color: "#535353",
    },
    chipTextActive: {
        color: "#FFF",
    },
    square: {
        width: 56,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DDD",
        alignItems: "center",
        justifyContent: "center",
    },
    squareActive: {
        backgroundColor: "#B3193A",
        borderColor: "#B3193A",

    },
    squareText: {
        color: "#818194",

    },
    squareTextActive: {
        color: "#FFF",
    },
    starRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,  
    },
    button: {
        marginTop: 32,
        height: 56,
        backgroundColor: "#B3193A",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    }
})