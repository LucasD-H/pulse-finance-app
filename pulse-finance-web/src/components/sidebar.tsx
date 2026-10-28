"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/relatorios", label: "Relatórios", icon: PieChart },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel fixed inset-y-0 left-0 z-20 hidden w-64 flex-col p-6 md:flex">
      <div className="mb-10 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Wallet className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Pulse<span className="text-accent">Finance</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground",
                isActive && "bg-accent/10 text-accent hover:bg-accent/10 hover:text-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-lg border border-border bg-white/5 p-3 text-xs text-muted">
        PulseFinance v0.1 — projeto de estudo
      </div>
    </aside>
  );
}
