import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

type Role = "USER" | "ADMIN" | string;

export type AuthUser = {
  id: string;
  nome?: string;      
  name?: string;      
  email: string;
  phone?: string | null;
  role?: Role;
  phoneVerified?: boolean;
};

type AuthResult =
  | { success: true }
  | { success: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (emailOrPhone: string, senha: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, senha: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2500));

      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log("Erro ao carregar dados", e);
      } finally {
        await minimumDelay;
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function login(emailOrPhone: string, senha: string): Promise<AuthResult> {
    try {
      const response = await api.post("/auth/login", {
        email: emailOrPhone,
        senha,
      });

      const { token, user: userData } = response.data as {
        token: string;
        user: AuthUser;
      };

      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error: any) {
      let message = "Erro ao conectar com o servidor";

      if (error?.response) {
        message = error.response?.data?.error || "E-mail/telefone ou senha inválidos";
      }

      console.error("Erro no login:", message);
      return { success: false, message };
    }
  }

  async function register(
    name: string,
    email: string,
    phone: string,
    senha: string
  ): Promise<AuthResult> {
    try {
      await api.post("/auth/register", { name, email, phone, senha });

      
      const loginResult = await login(email, senha);

      if (loginResult.success) {
        return { success: true };
      }

      return {
        success: false,
        message: "Conta criada, mas não foi possível fazer login automaticamente.",
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Erro ao conectar com o servidor";
      console.error("Erro no registro:", errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    // ✅ limpa header também
    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, logout, register, isLoading }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
