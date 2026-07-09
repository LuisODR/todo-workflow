import { useRef, useState } from "react";
import "./App.css";
import FluxoVenda from "./components/FluxoVenda";
import FinalizacaoVendas from "./components/FinalizacaoVendas";
import Dashboard from "./components/dashboard/Dashboard";
import { exportarBackup, lerArquivoBackup, aplicarBackup } from "./hooks/useLocalStorage";

// Ícone: Lista de tarefas (todo workflow)
function IconeTodo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

// Ícone: Dashboard / gráfico
function IconeDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

const MODOS = ["todo", "dashboard"];

const TODO_TABS = [
  { id: "fluxo",      label: "Fluxo de Venda" },
  { id: "finalizacao", label: "Finalização de Vendas" },
];

export default function App() {
  const [modo, setModo]   = useState("todo");     // "todo" | "dashboard"
  const [tab, setTab]     = useState("fluxo");
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleExportar = () => exportarBackup();
  const handleEscolherArquivo = () => fileInputRef.current?.click();

  const handleArquivoSelecionado = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dados = await lerArquivoBackup(file);
      const ok = window.confirm(
        "Importar este backup vai substituir os dados atuais. Deseja continuar?"
      );
      if (!ok) return;
      aplicarBackup(dados);
      setImportMsg({ tipo: "sucesso", texto: "Backup importado! Recarregando..." });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setImportMsg({ tipo: "erro", texto: err.message });
      setTimeout(() => setImportMsg(null), 5000);
    }
  };

  return (
    <div className="app-root">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      <div className="container">

        {/* ── Header com dois botões de modo ── */}
        <header className="app-header">
          <div className="header-left">
            <div className="header-icon">✓</div>
            <div>
              <h1 className="app-title">
                {modo === "todo" ? "Fluxo de Venda" : "Painel Admin"}
              </h1>
              <p className="app-subtitle">
                {modo === "todo" ? "Workflow diário de pedidos" : "Visão geral da equipe"}
              </p>
            </div>
          </div>

          <div className="header-mode-switcher">
            <button
              className={`header-mode-btn ${modo === "todo" ? "header-mode-btn--active" : ""}`}
              onClick={() => setModo("todo")}
              title="Todo Workflow"
            >
              <IconeTodo />
              <span>Workflow</span>
            </button>
            <button
              className={`header-mode-btn ${modo === "dashboard" ? "header-mode-btn--active" : ""}`}
              onClick={() => setModo("dashboard")}
              title="Painel Admin"
            >
              <IconeDashboard />
              <span>Admin</span>
            </button>
          </div>
        </header>

        {/* ── Modo Dashboard ── */}
        {modo === "dashboard" && <Dashboard />}

        {/* ── Modo Todo Workflow ── */}
        {modo === "todo" && (
          <>
            <nav className="tabs-nav">
              {TODO_TABS.map((t) => (
                <button
                  key={t.id}
                  className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <section className="card backup-card">
              <h2 className="section-title">
                <span className="section-dot" />
                Backup dos Dados
              </h2>
              <p className="backup-text">
                Seus dados ficam salvos só neste navegador. Se for usar em outra
                máquina, baixe o backup. Use "Importar Backup" para restaurar.
              </p>
              <div className="backup-actions">
                <button className="btn-backup btn-backup--export" onClick={handleExportar}>
                  <span className="btn-save-icon">⬇️</span>
                  Baixar Backup (.json)
                </button>
                <button className="btn-backup btn-backup--import" onClick={handleEscolherArquivo}>
                  <span className="btn-save-icon">⬆️</span>
                  Importar Backup
                </button>
                <input
                  type="file"
                  accept="application/json,.json"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleArquivoSelecionado}
                />
              </div>
              {importMsg && (
                <p className={`backup-msg backup-msg--${importMsg.tipo}`}>
                  {importMsg.texto}
                </p>
              )}
            </section>

            {tab === "fluxo"       && <FluxoVenda />}
            {tab === "finalizacao" && <FinalizacaoVendas />}
          </>
        )}
      </div>
    </div>
  );
}
