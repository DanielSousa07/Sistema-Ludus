import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.18.148:3000"
});

api.interceptors.request.use(async (config) => {
    // Volta o token aqui pra pesquisar
    
    const token = await AsyncStorage.getItem("@Ludus:token");
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});