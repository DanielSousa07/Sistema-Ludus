import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { goToVerify } from "./navigation";

export const api = axios.create({
  baseURL: "http://192.168.18.153:3000", 
})


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@Ludus:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    const url = error?.config?.url || "";
    const isVerifyEndpoint = url.includes("/auth/verify-phone");

    if (status === 403 && code === "PHONE_NOT_VERIFIED" && !isVerifyEndpoint) {
    
      const storedUser = await AsyncStorage.getItem("@Ludus:user");
      const phone = storedUser ? JSON.parse(storedUser)?.phone : undefined;

      goToVerify(phone);
    }

    return Promise.reject(error);
  }
);
