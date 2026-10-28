"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
      <div>
        <p className="text-sm text-muted">Bem-vindo de volta,</p>
        <p className="font-medium">{user?.name}</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </header>
  );
}
