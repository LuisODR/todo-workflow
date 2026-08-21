import { useCallback } from "react";

export const ACTION_LOG_KEY = "tw_action_log";
export const MAX_ENTRIES = 500;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function lerLog() {
  try {
    const raw = localStorage.getItem(ACTION_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function gravarLog(entries) {
  try {
    localStorage.setItem(ACTION_LOG_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {}
}

export function registrarAcao(userId, userName, type, label, meta = {}) {
  if (!userId) return;
  const entrada = { id: uid(), ts: new Date().toISOString(), userId, userName, type, label, meta };
  gravarLog([entrada, ...lerLog()]);
  return entrada;
}

export function useTracker() {
  const getUser = useCallback(() => {
    try {
      const session = JSON.parse(localStorage.getItem("tw_session") ?? "null");
      if (!session?.userId) return null;
      const users = JSON.parse(localStorage.getItem("tw_users") ?? "[]");
      return users.find((u) => u.id === session.userId) ?? null;
    } catch { return null; }
  }, []);

  const registrar = useCallback((type, label, meta = {}) => {
    const user = getUser();
    registrarAcao(user?.id ?? "anonimo", user?.name ?? "Usuário", type, label, meta);
  }, [getUser]);

  return { registrar };
}

export function lerActionLog() { return lerLog(); }
export function limparActionLog() {
  try { localStorage.removeItem(ACTION_LOG_KEY); } catch {}
}
