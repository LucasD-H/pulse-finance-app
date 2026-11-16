"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// Usa o mesmo mecanismo de reconciliação pós-hidratação do React que o
// useAuth já usa para ler o localStorage: no servidor retorna `false`
// (bate com o HTML enviado), e logo após a hidratação o React re-renderiza
// com `true`, na MESMA passada em que o valor real do localStorage também é
// re-sincronizado. Isso evita checar `user` antes dele estar confiável.
export function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
