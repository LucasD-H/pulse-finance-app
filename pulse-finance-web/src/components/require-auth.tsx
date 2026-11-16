"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isHydrated = useIsHydrated();
  const router = useRouter();

  // Só decide redirecionar depois que o client já re-sincronizou com o
  // localStorage de verdade — antes disso, `user` é sempre `null` (valor
  // usado no servidor) mesmo que o usuário esteja autenticado.
  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
