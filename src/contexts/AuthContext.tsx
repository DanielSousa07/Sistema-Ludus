import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const authContext = createContext({} as any);

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState(null);

    async function login(email: string, senha: string) {
        try {
            // Tenta realizar a chamada para o backend
            const response = await api.post("/auth/login", {
                email,
                senha
            });

            // Se chegar aqui, o status é 200 (Sucesso)
            await SecureStore.setItemAsync("token", response.data.token);
            setUser(response.data.user);
            
            return { success: true };

        } catch (error: any) {
            // Captura erros de status 401, 404, 500 ou erros de rede
            let message = "Erro ao conectar com o servidor";

            if (error.response) {
                // O servidor respondeu com um erro (ex: 401)
                message = error.response.data.error || "E-mail ou senha inválidos";
            }

            console.error("Erro no login:", message);
            return { success: false, message };
        }
    }

    async function register(name: string, email: string, senha: string) {
        try {
            await api.post("/auth/register", {
                name, 
                email,
                senha
            });
            return {success: true}; 
        } catch(error: any) {
            const message = error.response?.data?.error || "Error ao cadastrar";
            return {success: false, message};
        }
    }

    function logout() {
        SecureStore.deleteItemAsync("token");
        setUser(null);
    }

    return (
        <authContext.Provider value={{ user, login, logout, register }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}