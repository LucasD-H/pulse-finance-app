import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina classes condicionais (clsx) e remove conflitos do Tailwind (twMerge).
// Ex: cn("p-2", isActive && "p-4") -> "p-4", sem duplicar a classe de padding.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
