import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { goToVerify } from "./navigation";

export const api = axios.create({
  baseURL: "http://192.168.18.153:3000",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    const url = (error?.config?.url || "").toString();
    const isVerifyRelated =
      url.includes("/auth/verify-email") ||
      url.includes("/auth/resend-email-code") ||
      url.includes("/auth/verify-phone") ||
      url.includes("/auth/resend-code");

    if (status === 403 && !isVerifyRelated) {
      const storedUser = await SecureStore.getItemAsync("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (code === "EMAIL_NOT_VERIFIED") {
        
        goToVerify({ email: user?.email });
      }

      if (code === "PHONE_NOT_VERIFIED") {
      
        goToVerify({ phone: user?.phone });
      }
    }

    return Promise.reject(error);
  }
);