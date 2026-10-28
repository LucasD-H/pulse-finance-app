export type StoredUser = {
  id: string;
  name: string;
  email: string;
};

export type StoredAuth = {
  user: StoredUser;
  token: string;
} | null;

// Não é seguro para produção guardar JWT em localStorage (fica exposto a
// XSS), mas é a abordagem mais simples para fins de estudo. Em produção,
// o ideal é um cookie httpOnly setado pelo próprio backend.
const STORAGE_KEY = "pulsefinance:auth";

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

// useSyncExternalStore chama subscribe() para saber quando reler o
// localStorage (ex: login/logout nesta aba, ou em outra aba via "storage").
export function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

// No servidor (SSR) não existe localStorage; devolvemos "sem usuário".
export function getServerSnapshot(): string | null {
  return null;
}

export function setAuthData(data: NonNullable<StoredAuth>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  emitChange();
}

export function clearAuthData() {
  localStorage.removeItem(STORAGE_KEY);
  emitChange();
}

export function parseAuthSnapshot(raw: string | null): StoredAuth {
  if (!raw) return null;
  return JSON.parse(raw) as StoredAuth;
}
