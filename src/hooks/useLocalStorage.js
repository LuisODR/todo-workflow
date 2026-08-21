import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return initialValue;
      const parsed = JSON.parse(stored);
      if (isValid && !isValid(parsed)) return initialValue;
      return parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

export const STORAGE_KEYS = {
  FEITOS: "todo_workflow_feitos",
  FINALIZACAO: "todo_workflow_finalizacao",
};

export function exportarBackup() {
  const dados = {
    tipo: "todo-workflow-backup",
    versao: 1,
    exportadoEm: new Date().toISOString(),
    [STORAGE_KEYS.FEITOS]: safeParse(localStorage.getItem(STORAGE_KEYS.FEITOS), []),
    [STORAGE_KEYS.FINALIZACAO]: safeParse(localStorage.getItem(STORAGE_KEYS.FINALIZACAO), []),
  };
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-fluxo-venda-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function lerArquivoBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dados = JSON.parse(reader.result);
        if (dados.tipo !== "todo-workflow-backup") {
          reject(new Error("Arquivo não é um backup válido."));
          return;
        }
        resolve(dados);
      } catch {
        reject(new Error("Não foi possível ler o arquivo."));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao abrir o arquivo."));
    reader.readAsText(file);
  });
}

export function aplicarBackup(dados) {
  if (STORAGE_KEYS.FEITOS in dados)
    localStorage.setItem(STORAGE_KEYS.FEITOS, JSON.stringify(dados[STORAGE_KEYS.FEITOS]));
  if (STORAGE_KEYS.FINALIZACAO in dados)
    localStorage.setItem(STORAGE_KEYS.FINALIZACAO, JSON.stringify(dados[STORAGE_KEYS.FINALIZACAO]));
}

function safeParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}
