import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const PDF_STORAGE_KEY = "tw_pdf_builder";

const INITIAL_STATE = { bannerPrincipal: null, subBanner: null, moedas: [], bannerFooter: null, updatedAt: null };

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function isValid(val) { return val !== null && typeof val === "object" && "bannerPrincipal" in val && Array.isArray(val.moedas); }

export function usePdfStorage() {
  const [state, setState] = useLocalStorage(PDF_STORAGE_KEY, INITIAL_STATE, isValid);

  const setBanner = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }));
  }, [setState]);

  const clearBanner = useCallback((field) => {
    setState((prev) => ({ ...prev, [field]: null, updatedAt: new Date().toISOString() }));
  }, [setState]);

  const adicionarMoeda = useCallback(() => {
    const novaMoeda = { id: uid(), fotoFrente: null, fotoVerso: null, specs: "" };
    setState((prev) => ({ ...prev, moedas: [...prev.moedas, novaMoeda], updatedAt: new Date().toISOString() }));
    return novaMoeda.id;
  }, [setState]);

  const atualizarMoeda = useCallback((id, campo, valor) => {
    setState((prev) => ({ ...prev, moedas: prev.moedas.map((m) => (m.id === id ? { ...m, [campo]: valor } : m)), updatedAt: new Date().toISOString() }));
  }, [setState]);

  const removerMoeda = useCallback((id) => {
    setState((prev) => ({ ...prev, moedas: prev.moedas.filter((m) => m.id !== id), updatedAt: new Date().toISOString() }));
  }, [setState]);

  const moverMoeda = useCallback((id, direcao) => {
    setState((prev) => {
      const arr = [...prev.moedas];
      const idx = arr.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const dest = idx + direcao;
      if (dest < 0 || dest >= arr.length) return prev;
      [arr[idx], arr[dest]] = [arr[dest], arr[idx]];
      return { ...prev, moedas: arr, updatedAt: new Date().toISOString() };
    });
  }, [setState]);

  const clearAll = useCallback(() => {
    setState({ ...INITIAL_STATE, updatedAt: new Date().toISOString() });
  }, [setState]);

  return {
    bannerPrincipal: state.bannerPrincipal, subBanner: state.subBanner,
    bannerFooter: state.bannerFooter, moedas: state.moedas, updatedAt: state.updatedAt,
    setBanner, clearBanner, adicionarMoeda, atualizarMoeda, removerMoeda, moverMoeda, clearAll,
  };
}
