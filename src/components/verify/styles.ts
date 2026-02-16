import { StyleSheet } from "react-native";
 
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


  card: {
    flex: 1,
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
    justifyContent: "center",
    marginTop: 40,
    gap: 4.7,
  },

  input: {
    flex: 1,
    maxWidth: 52,
    height: 56,
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
