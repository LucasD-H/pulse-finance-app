"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearAuthData,
  getServerSnapshot,
  getSnapshot,
  parseAuthSnapshot,
  setAuthData,
  subscribe,
  type StoredUser,
} from "@/lib/auth-store";

type AuthContextValue = {
  user: StoredUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Sincroniza com o localStorage sem efeito: no servidor (SSR) sempre usa
  // getServerSnapshot (sem usuário, já que localStorage não existe lá), e o
  // React automaticamente re-renderiza com o valor real assim que o cliente
  // termina de hidratar. Também reage a mudanças feitas em outras abas.
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stored = useMemo(() => parseAuthSnapshot(raw), [raw]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<{ token: string; user: StoredUser }>("/sessions", {
      method: "POST",
      body: { email, password },
    });
    setAuthData(data);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api("/users", { method: "POST", body: { name, email, password } });
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    clearAuthData();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: stored?.user ?? null,
        token: stored?.token ?? null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }

  return context;
}
