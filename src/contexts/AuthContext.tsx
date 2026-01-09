import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const authContext = createContext({} as any);

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState(null);

    async function login(email: string, senha: string){
        const response = await api.post("/auth/login", {
            email, 
            senha
        });

        await SecureStore.setItemAsync("token", response.data.token);
        setUser(response.data.user)
    }

    function logout() {
        SecureStore.deleteItemAsync("token");
        setUser(null);
    }

    return (
        <authContext.Provider value={{user, login, logout}}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext)
}