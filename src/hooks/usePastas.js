import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useTracker } from "./useTracker";

export const PASTAS_KEY = "tw_pastas_moedas";
export const PASTA_CORES = ["#2196f3","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06b6d4","#84cc16","#f97316","#6366f1"];

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function isValid(val) { return Array.isArray(val); }

export function usePastas() {
  const [pastas, setPastas] = useLocalStorage(PASTAS_KEY, [], isValid);
  const { registrar } = useTracker();

  const criarPasta = useCallback((nome) => {
    const nomeTrimado = nome.trim();
    if (!nomeTrimado) return null;
    const id = uid();
    const cor = PASTA_CORES[pastas.length % PASTA_CORES.length];
    setPastas((prev) => [...prev, { id, nome: nomeTrimado, cor }]);
    registrar("pasta_criada", `Criou pasta "${nomeTrimado}"`, { pastaId: id, nome: nomeTrimado });
    return id;
  }, [pastas.length, setPastas, registrar]);

  const renomearPasta = useCallback((id, novoNome) => {
    const trimado = novoNome.trim();
    if (!trimado) return;
    setPastas((prev) => prev.map((p) => (p.id === id ? { ...p, nome: trimado } : p)));
  }, [setPastas]);

  const removerPasta = useCallback((id) => {
    const pasta = pastas.find((p) => p.id === id);
    setPastas((prev) => prev.filter((p) => p.id !== id));
    if (pasta) registrar("pasta_removida", `Removeu pasta "${pasta.nome}"`, { pastaId: id });
  }, [pastas, setPastas, registrar]);

  const getPasta = useCallback((id) => pastas.find((p) => p.id === id), [pastas]);
  const getPastasPorIds = useCallback((ids = []) => pastas.filter((p) => ids.includes(p.id)), [pastas]);

  return { pastas, criarPasta, renomearPasta, removerPasta, getPasta, getPastasPorIds };
}
