import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isLoading } = useAuth();

  // Enquanto estiver carregando a lógica de login, não faz nada
  if (isLoading) return null;

  // Se o layout por algum motivo não redirecionar, o index garante o caminho certo
  if (user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/onboarding" />;
}