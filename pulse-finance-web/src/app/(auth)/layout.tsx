"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const isHydrated = useIsHydrated();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/");
    }
  }, [isHydrated, user, router]);

  if (isHydrated && user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {children}
    </div>
  );
}
