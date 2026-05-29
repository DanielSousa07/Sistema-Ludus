import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../services/api";
import {
  attachNotificationListeners,
  registerForPush,
} from "../services/push.client";

type Role = "USER" | "ADMIN" | string;

const IFMA_MODE = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

export type AuthUser = {
  id: string;
  nome?: string;
  name?: string;
  email: string;
  phone?: string | null;
  role?: Role;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  points?: number;
  level?: number;
  authProvider?: string;
  avatar?: string | null;
  picture?: string | null;

  // IFMA — verificação acadêmica via SUAP
  isAcademicVerified?: boolean;
  academicVerifiedAt?: string | null;
  matricula?: string | null;

  registrationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string | null;
};

type AuthResult = { success: true } | { success: false; message: string };

type GoogleAuthResult =
  | { success: true; needsPhoneVerification: boolean }
  | { success: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (emailOrPhone: string, senha: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    phone: string,
    senha: string,
    acceptedTerms: boolean,
    acceptedPrivacy: boolean,
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signInWithToken: (
    token: string,
    userData: AuthUser,
    redirectFn?: (path: string) => void,
  ) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<GoogleAuthResult>;
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // No AuthContext.tsx, dentro do useEffect de loadStorageData
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;

          // Verificação rápida: se o token for rejeitado, limpamos tudo
          try {
            await api.get("/auth/me"); // Adicione essa rota no seu back ou use uma existente
            setUser(JSON.parse(storedUser));
          } catch (err: any) {
            if (err.response?.status === 403) {
              await logout(); // Se o backend barrou, deslogamos
            }
          }
        }
      } catch (e) {
        console.log("Erro ao carregar dados", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  useEffect(() => {
    const detach = attachNotificationListeners();
    return detach;
  }, []);

  // ── Atualiza o status acadêmico consultando o backend ──────────────────────
  // Chamada pelo SuapVerifyScreen após verificação bem-sucedida,
  // para refletir isAcademicVerified=true no estado local.
  const refreshUser = useCallback(async () => {
    if (!IFMA_MODE) return;

    try {
      const res = await api.get("/auth/ifma/status");

      setUser((prev) => {
        if (!prev) return prev;
        const next: AuthUser = {
          ...prev,
          isAcademicVerified: res.data.isAcademicVerified,
          academicVerifiedAt: res.data.academicVerifiedAt ?? null,
          matricula: res.data.matricula ?? null,
        };
        SecureStore.setItemAsync("user", JSON.stringify(next)).catch(() => {});
        return next;
      });
    } catch (e) {
      console.log("[IFMA] Erro ao atualizar status acadêmico:", e);
    }
  }, []);

  // ── signInWithToken ────────────────────────────────────────────────────────
  // Aceita um redirectFn opcional para que o chamador (login, Google, etc.)
  // possa controlar a navegação sem criar dependência circular com o router.
  async function signInWithToken(
    token: string,
    userData: AuthUser,
    redirectFn?: (path: string) => void,
  ) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));

    setUser(userData);

    // ── Guard IFMA: redireciona para verificação SUAP se necessário ──────────
    if (redirectFn) {
      if (IFMA_MODE && !userData.isAcademicVerified) {
        redirectFn("/suap-verify");
      } else {
        redirectFn("/home");
      }
    }

    // Registra push token em background
    try {
      const pushToken = await registerForPush(userData.id);
      if (pushToken) {
        console.log("Push Token registrado com sucesso:", pushToken);
      } else {
        console.log(
          "Push token não registrado: permissão negada ou indisponível.",
        );
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;

      if (status === 403 || code === "ACCOUNT_NOT_VERIFIED") {
        console.log(
          "Push token adiado até a conta ter ao menos um fator verificado.",
        );
      } else {
        console.log(
          "Não foi possível registrar push token agora:",
          error?.message || error,
        );
      }
    }
  }

  async function updateUser(patch: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      SecureStore.setItemAsync("user", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  async function login(
    emailOrPhone: string,
    senha: string,
  ): Promise<AuthResult> {
    try {
      const response = await api.post("/auth/login", {
        email: emailOrPhone,
        senha,
      });

      const { token, user: userData } = response.data as {
        token: string;
        user: AuthUser;
      };

      // Passa undefined como redirectFn — quem chama login() controla a navegação
      await signInWithToken(token, userData);
      return { success: true };
    } catch (error: any) {
      let message = "Erro ao conectar com o servidor";

      if (error?.response) {
        message =
          error.response?.data?.error || "E-mail/telefone ou senha inválidos";
      }

      console.error("Erro no login:", message);
      return { success: false, message };
    }
  }

  async function register(
    name: string,
    email: string,
    phone: string,
    senha: string,
    acceptedTerms: boolean,
    acceptedPrivacy: boolean,
  ): Promise<AuthResult> {
    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
        senha,
        acceptedTerms,
        acceptedPrivacy,
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Erro ao conectar com o servidor";

      console.error("Erro no registro:", errorMessage);
      return { success: false, message: errorMessage };
    }
  }

  async function loginGoogle(idToken: string): Promise<GoogleAuthResult> {
    try {
      const res = await api.post("/auth/google", { idToken });

      const {
        token,
        user: userData,
        needsPhoneVerification,
      } = res.data as {
        token: string;
        user: AuthUser;
        needsPhoneVerification: boolean;
      };

      await signInWithToken(token, userData);

      return {
        success: true,
        needsPhoneVerification: !!needsPhoneVerification,
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Falha ao autenticar com Google.";

      console.error("Erro no loginGoogle:", message);
      return { success: false, message };
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      isLoading,
      signInWithToken,
      loginGoogle,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
