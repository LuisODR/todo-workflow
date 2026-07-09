// ── Usuários mockados ──────────────────────────────────────────────
export const USUARIOS = [
  { id: "u1", nome: "Kathleen", avatar: "K", cor: "#7c3aed" },
  { id: "u2", nome: "Gabriela", avatar: "G", cor: "#0891b2" },
  { id: "u3", nome: "Mariana",  avatar: "M", cor: "#b45309" },
];

// ── Hoje (data de referência para os mocks) ───────────────────────
function hoje(h, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

// ── Clientes COMPLETOS (todos os 16 steps marcados) ───────────────
// checked: array de 16 booleans todos true
const checkedCompleto = Array(16).fill(true);

export const CLIENTES_COMPLETOS = [
  // Kathleen
  { id: "c1",  usuarioId: "u1", nome: "João Mendes",     origem: "Site",          checked: checkedCompleto, dataHora: hoje(8, 22), totalSteps: 16 },
  { id: "c2",  usuarioId: "u1", nome: "Ana Ferreira",    origem: "Mercado Livre", checked: checkedCompleto, dataHora: hoje(9, 47), totalSteps: 16 },
  { id: "c3",  usuarioId: "u1", nome: "Carlos Souza",    origem: "Site",          checked: checkedCompleto, dataHora: hoje(11,55), totalSteps: 16 },
  // Gabriela
  { id: "c4",  usuarioId: "u2", nome: "Pedro Alves",     origem: "Site",          checked: checkedCompleto, dataHora: hoje(8, 40), totalSteps: 16 },
  { id: "c5",  usuarioId: "u2", nome: "Luisa Ramos",     origem: "Mercado Livre", checked: checkedCompleto, dataHora: hoje(10, 5), totalSteps: 16 },
  { id: "c6",  usuarioId: "u2", nome: "Fernanda Costa",  origem: "Site",          checked: checkedCompleto, dataHora: hoje(14, 0), totalSteps: 16 },
  { id: "c7",  usuarioId: "u2", nome: "Bruno Lima",      origem: "Numeração",     checked: checkedCompleto, dataHora: hoje(15,30), totalSteps: 16 },
  // Mariana
  { id: "c8",  usuarioId: "u3", nome: "Tatiane Nunes",   origem: "Site",          checked: checkedCompleto, dataHora: hoje(9, 10), totalSteps: 16 },
  { id: "c9",  usuarioId: "u3", nome: "Ricardo Pinto",   origem: "Mercado Livre", checked: checkedCompleto, dataHora: hoje(10,50), totalSteps: 16 },
];

// ── Clientes EM ANDAMENTO (parcialmente marcados) ─────────────────
const ch = (n) => [...Array(16)].map((_, i) => i < n); // n primeiros steps marcados

export const CLIENTES_ANDAMENTO = [
  { id: "a1", usuarioId: "u1", nome: "Sofia Barbosa",   origem: "Site",          checked: ch(11), dataHora: hoje(13,30), totalSteps: 16 },
  { id: "a2", usuarioId: "u1", nome: "Eduardo Vieira",  origem: "Mercado Livre", checked: ch(6),  dataHora: hoje(15, 0), totalSteps: 16 },
  { id: "a3", usuarioId: "u2", nome: "Letícia Moura",   origem: "Site",          checked: ch(9),  dataHora: hoje(14,20), totalSteps: 16 },
  { id: "a4", usuarioId: "u3", nome: "Thiago Castro",   origem: "Numeração",     checked: ch(13), dataHora: hoje(13,45), totalSteps: 16 },
  { id: "a5", usuarioId: "u3", nome: "Patrícia Gomes",  origem: "Mercado Livre", checked: ch(4),  dataHora: hoje(16, 5), totalSteps: 16 },
];

// ── Feed de atividade (eventos ordenados por hora) ────────────────
export const FEED_ATIVIDADE = [
  { id: "f1",  usuarioId: "u1", clienteNome: "João Mendes",    acao: "concluiu",       dataHora: hoje(8, 22) },
  { id: "f2",  usuarioId: "u2", clienteNome: "Pedro Alves",    acao: "concluiu",       dataHora: hoje(8, 40) },
  { id: "f3",  usuarioId: "u3", clienteNome: "Tatiane Nunes",  acao: "concluiu",       dataHora: hoje(9, 10) },
  { id: "f4",  usuarioId: "u1", clienteNome: "Ana Ferreira",   acao: "concluiu",       dataHora: hoje(9, 47) },
  { id: "f5",  usuarioId: "u2", clienteNome: "Luisa Ramos",    acao: "concluiu",       dataHora: hoje(10, 5) },
  { id: "f6",  usuarioId: "u3", clienteNome: "Ricardo Pinto",  acao: "concluiu",       dataHora: hoje(10,50) },
  { id: "f7",  usuarioId: "u1", clienteNome: "Carlos Souza",   acao: "concluiu",       dataHora: hoje(11,55) },
  { id: "f8",  usuarioId: "u1", clienteNome: "Sofia Barbosa",  acao: "iniciou",        dataHora: hoje(13,30) },
  { id: "f9",  usuarioId: "u3", clienteNome: "Thiago Castro",  acao: "iniciou",        dataHora: hoje(13,45) },
  { id: "f10", usuarioId: "u2", clienteNome: "Fernanda Costa", acao: "concluiu",       dataHora: hoje(14, 0) },
  { id: "f11", usuarioId: "u2", clienteNome: "Letícia Moura",  acao: "iniciou",        dataHora: hoje(14,20) },
  { id: "f12", usuarioId: "u1", clienteNome: "Eduardo Vieira", acao: "iniciou",        dataHora: hoje(15, 0) },
  { id: "f13", usuarioId: "u2", clienteNome: "Bruno Lima",     acao: "concluiu",       dataHora: hoje(15,30) },
  { id: "f14", usuarioId: "u3", clienteNome: "Patrícia Gomes", acao: "iniciou",        dataHora: hoje(16, 5) },
];

// ── Helpers ───────────────────────────────────────────────────────
export function getUsuario(id) {
  return USUARIOS.find((u) => u.id === id);
}

export function getCompletosDoUsuario(usuarioId) {
  return CLIENTES_COMPLETOS.filter((c) => c.usuarioId === usuarioId);
}

export function getAndamentoDoUsuario(usuarioId) {
  return CLIENTES_ANDAMENTO.filter((c) => c.usuarioId === usuarioId);
}

export function pct(cliente) {
  const done = cliente.checked.filter(Boolean).length;
  return Math.round((done / cliente.totalSteps) * 100);
}
