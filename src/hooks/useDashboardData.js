import { useState, useEffect, useCallback } from "react";
import { lerActionLog } from "./useTracker";

const MOEDAS_KEY  = "tw_catalogo_moedas";
const PASTAS_KEY  = "tw_pastas_moedas";
const FEITOS_KEY  = "todo_workflow_feitos";
const USERS_KEY   = "tw_users";
const SESSION_KEY = "tw_session";
const REFRESH_MS  = 5000;

function safeParse(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) ?? fallback : fallback; }
  catch { return fallback; }
}

function getLoggedUser() {
  try {
    const session = safeParse(SESSION_KEY, null);
    if (!session?.userId) return null;
    return safeParse(USERS_KEY, []).find((u) => u.id === session.userId) ?? null;
  } catch { return null; }
}

function calcMetricasUsuario(userId, log) {
  const m = log.filter((a) => a.userId === userId);
  return {
    pdfsGerados: m.filter((a) => a.type === "pdf_gerado").length,
    moedasCriadas: m.filter((a) => a.type === "moeda_criada").length,
    moedasEditadas: m.filter((a) => a.type === "moeda_editada").length,
    fluxosSalvos: m.filter((a) => a.type === "fluxo_salvo").length,
    pastasCriadas: m.filter((a) => a.type === "pasta_criada").length,
    totalAcoes: m.length,
  };
}

function calcMetricasSuperUser(log) {
  return {
    totalAcoes: log.length,
    pdfsGerados: log.filter((a) => a.type === "pdf_gerado").length,
    moedasCriadas: log.filter((a) => a.type === "moeda_criada").length,
    moedasEditadas: log.filter((a) => a.type === "moeda_editada").length,
    fluxosSalvos: log.filter((a) => a.type === "fluxo_salvo").length,
    pastasCriadas: log.filter((a) => a.type === "pasta_criada").length,
    usuariosAtivos: [...new Set(log.map((a) => a.userId))].length,
  };
}

function calcResumoUsuarios(log) {
  const mapa = {};
  log.forEach((a) => {
    if (!mapa[a.userId]) mapa[a.userId] = { userId: a.userId, userName: a.userName, totalAcoes: 0, pdfsGerados: 0, moedasCriadas: 0, fluxosSalvos: 0, pastasCriadas: 0, ultimaAcao: a.ts };
    const m = mapa[a.userId];
    m.totalAcoes++;
    if (a.type === "pdf_gerado")   m.pdfsGerados++;
    if (a.type === "moeda_criada") m.moedasCriadas++;
    if (a.type === "fluxo_salvo")  m.fluxosSalvos++;
    if (a.type === "pasta_criada") m.pastasCriadas++;
    if (a.ts > m.ultimaAcao)       m.ultimaAcao = a.ts;
  });
  return Object.values(mapa).sort((a, b) => b.totalAcoes - a.totalAcoes);
}

export function useDashboardData() {
  const [dados, setDados] = useState(null);

  const calcular = useCallback(() => {
    const user = getLoggedUser();
    const isSuperUser = user?.role === "superuser";
    const log = lerActionLog();
    const moedas = safeParse(MOEDAS_KEY, []);
    const pastas = safeParse(PASTAS_KEY, []);
    const feitos = safeParse(FEITOS_KEY, []);

    if (isSuperUser) {
      setDados({ perfil: "superuser", user, metricas: calcMetricasSuperUser(log), acoes: log.slice(0, 80), usuariosResumo: calcResumoUsuarios(log), catalogo: { totalMoedas: moedas.length, totalPastas: pastas.length, totalFeitos: feitos.length } });
    } else {
      const userId = user?.id ?? "anonimo";
      setDados({ perfil: "usuario", user, metricas: calcMetricasUsuario(userId, log), acoes: log.filter((a) => a.userId === userId).slice(0, 40), catalogo: { totalMoedas: moedas.length, totalPastas: pastas.length, totalFeitos: feitos.length } });
    }
  }, []);

  useEffect(() => {
    calcular();
    const timer = setInterval(calcular, REFRESH_MS);
    return () => clearInterval(timer);
  }, [calcular]);

  return { dados, recarregar: calcular };
}
