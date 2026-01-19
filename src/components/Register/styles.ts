import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: height * 0.85,
    padding: 28,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  scroll: {
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#535353",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#535353",
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#535353",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  inputPassword: {
    flex: 1,
    paddingVertical: 16,
  },

  button: {
    backgroundColor: "#31358B",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  or: {
    marginHorizontal: 12,
    color: "#535353",
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  googleText: {
    fontSize: 16,
    fontWeight: "500",
  },

  register: {
    textAlign: "center",
    color: "#535353",
  },

  link: {
    color: "#1E3932",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
