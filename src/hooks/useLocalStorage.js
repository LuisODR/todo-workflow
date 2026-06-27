import { useEffect, useState } from "react";

/**
 * Hook simples para persistir um valor no localStorage.
 * Funciona como useState, mas lê/grava automaticamente.
 *
 * @param {string} key
 * @param {*} initialValue valor usado se não houver nada salvo (ou se os dados salvos forem inválidos)
 * @param {(value: any) => boolean} [isValid] validador opcional. Se os dados salvos
 *   não passarem nessa checagem (ex: formato de uma versão antiga do app), o hook
 *   ignora o que estava salvo e usa o initialValue, evitando que a página quebre.
 */
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
    } catch {
      // Storage indisponível ou cheio - ignora silenciosamente
    }
  }, [key, value]);

  return [value, setValue];
}

// Todas as chaves usadas pelo app — centralizadas aqui para o export/import
export const STORAGE_KEYS = {
  FEITOS: "todo_workflow_feitos",
  FINALIZACAO: "todo_workflow_finalizacao",
};

/**
 * Monta um objeto com todos os dados salvos do app e dispara o download
 * de um arquivo .json para o usuário guardar como backup.
 */
export function exportarBackup() {
  const dados = {
    tipo: "todo-workflow-backup",
    versao: 1,
    exportadoEm: new Date().toISOString(),
    [STORAGE_KEYS.FEITOS]: safeParse(localStorage.getItem(STORAGE_KEYS.FEITOS), []),
    [STORAGE_KEYS.FINALIZACAO]: safeParse(localStorage.getItem(STORAGE_KEYS.FINALIZACAO), []),
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dataStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `backup-fluxo-venda-${dataStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lê um arquivo .json escolhido pelo usuário e devolve os dados
 * já validados (ou lança erro se o arquivo não for um backup válido).
 */
export function lerArquivoBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dados = JSON.parse(reader.result);
        if (dados.tipo !== "todo-workflow-backup") {
          reject(new Error("Esse arquivo não parece ser um backup válido deste app."));
          return;
        }
        resolve(dados);
      } catch {
        reject(new Error("Não foi possível ler o arquivo. Verifique se é o .json exportado pelo app."));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao abrir o arquivo."));
    reader.readAsText(file);
  });
}

/**
 * Aplica os dados de um backup importado diretamente no localStorage.
 * Depois disso, é necessário recarregar a página (ou o estado em memória)
 * para refletir os dados novos.
 */
export function aplicarBackup(dados) {
  if (STORAGE_KEYS.FEITOS in dados) {
    localStorage.setItem(STORAGE_KEYS.FEITOS, JSON.stringify(dados[STORAGE_KEYS.FEITOS]));
  }
  if (STORAGE_KEYS.FINALIZACAO in dados) {
    localStorage.setItem(STORAGE_KEYS.FINALIZACAO, JSON.stringify(dados[STORAGE_KEYS.FINALIZACAO]));
  }
}

function safeParse(str, fallback) {
  if (str === null || str === undefined) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
