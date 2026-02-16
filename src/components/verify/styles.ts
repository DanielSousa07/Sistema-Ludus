import { StyleSheet } from "react-native";
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 25,
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  card: {
    flex: 1,
    marginTop: 140,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    textAlign: "center",
    color: "#E62325",
    fontSize: 16,
    marginTop: 30,
    lineHeight: 22,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#979BB5",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
  },

  resend: {
    textAlign: "center",
    marginTop: 40,
    color: "#E62325",
  },

  resendBold: {
    textAlign: "center",
    color: "#1F3C2F",
    fontWeight: "600",
    marginTop: 6,
  },

  button: {
    height: 60,
    backgroundColor: "#04096E",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
