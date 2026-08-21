import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useTracker } from "./useTracker";

export const MOEDAS_KEY = "tw_catalogo_moedas";

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function isValid(val) { return Array.isArray(val); }
function normalizar(m) { return { ...m, pastaIds: Array.isArray(m.pastaIds) ? m.pastaIds : [] }; }

export function useMoedas() {
  const [moedas, setMoedas] = useLocalStorage(MOEDAS_KEY, [], isValid);
  const { registrar } = useTracker();

  const criarMoeda = useCallback(({ fotoFrente, fotoVerso, specs, pastaIds = [] }) => {
    const nova = { id: uid(), fotoFrente: fotoFrente ?? null, fotoVerso: fotoVerso ?? null, specs: specs?.trim() ?? "", pastaIds, criadoEm: new Date().toISOString() };
    setMoedas((prev) => [nova, ...prev]);
    const label = nova.specs ? nova.specs.slice(0, 40) + (nova.specs.length > 40 ? "…" : "") : "sem especificações";
    registrar("moeda_criada", `Criou moeda "${label}"`, { moedaId: nova.id, specs: nova.specs, pastaIds });
    return nova.id;
  }, [setMoedas, registrar]);

  const atualizarMoeda = useCallback((id, campos) => {
    setMoedas((prev) => prev.map((m) => (m.id === id ? normalizar({ ...m, ...campos }) : m)));
    const label = (campos.specs ?? "").slice(0, 40) || id;
    registrar("moeda_editada", `Editou moeda "${label}"`, { moedaId: id });
  }, [setMoedas, registrar]);

  const setPastasDaMoeda = useCallback((id, pastaIds) => {
    setMoedas((prev) => prev.map((m) => (m.id === id ? { ...m, pastaIds } : m)));
  }, [setMoedas]);

  const removerMoeda = useCallback((id) => {
    const moeda = moedas.find((m) => m.id === id);
    setMoedas((prev) => prev.filter((m) => m.id !== id));
    const label = (moeda?.specs ?? "").slice(0, 40) || id;
    registrar("moeda_removida", `Removeu moeda "${label}"`, { moedaId: id, pastaIds: moeda?.pastaIds ?? [] });
  }, [setMoedas, moedas, registrar]);

  return { moedas: moedas.map(normalizar), criarMoeda, atualizarMoeda, setPastasDaMoeda, removerMoeda };
}
