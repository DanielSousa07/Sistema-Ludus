import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const authContext = createContext({} as any);

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            // Tempo mínimo para a animação da Splash (2.5s)

            const minimumDelay = new Promise(resolve => setTimeout(resolve, 2500));
            try {
                const storedToken = await SecureStore.getItemAsync("token");
                const storedUser = await SecureStore.getItemAsync("user");

                if (storedToken && storedUser) {
                    // Garante que todas as chamadas futuras usem o token recuperado
                    api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.log("Erro ao carregar dados", e);
            } finally {
                await minimumDelay;
                setIsloading(false); // Só liberta aqui
            }
        }
        loadStorageData();
    }, []);

    async function login(emailOrPhone: string, senha: string) {
        try {
            // Tenta realizar a chamada para o backend
            const response = await api.post("/auth/login", {
                email: emailOrPhone,
                senha,
            });
            const { token, user: userData } = response.data;

            await SecureStore.setItemAsync("token", token);
            await SecureStore.setItemAsync("user", JSON.stringify(userData));

            setUser(userData);
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

   async function register(name: string, email: string, phone: string, senha: string) {
    try {
        await api.post('/auth/register', { 
            name, 
            email, 
            phone, 
            senha 
        });

    
        const loginResult = await login(email, senha); 

        if (loginResult.success) {
            return { success: true }; 
        }
        
        return { 
            success: false, 
            message: loginResult.message || 'Erro ao logar após registro' 
        };

    } catch (error: any) {
        
        const errorMessage = error.response?.data?.error || "Erro ao conectar com o servidor";
        console.error("Erro no registro:", errorMessage);
        
        return { 
            success: false, 
            message: errorMessage 
        };
    }
}
    async function logout() {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        setUser(null);
    }

    return (
        <authContext.Provider value={{ user, login, logout, register, isLoading }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}