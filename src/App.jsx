import { useRef, useState } from "react";
import "./App.css";
import FluxoVenda from "./components/FluxoVenda";
import FinalizacaoVendas from "./components/FinalizacaoVendas";
import { exportarBackup, lerArquivoBackup, aplicarBackup } from "./hooks/useLocalStorage";

const TABS = [
  { id: "fluxo", label: "Fluxo de Venda" },
  { id: "finalizacao", label: "Finalização de Vendas" },
];

export default function App() {
  const [tab, setTab] = useState("fluxo");
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleExportar = () => {
    exportarBackup();
  };

  const handleEscolherArquivo = () => {
    fileInputRef.current?.click();
  };

  const handleArquivoSelecionado = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite selecionar o mesmo arquivo de novo depois
    if (!file) return;

    try {
      const dados = await lerArquivoBackup(file);
      const ok = window.confirm(
        "Importar este backup vai substituir os dados atuais salvos neste navegador (histórico de clientes feitos e progresso da Finalização de Vendas). Deseja continuar?"
      );
      if (!ok) return;

      aplicarBackup(dados);
      setImportMsg({ tipo: "sucesso", texto: "Backup importado com sucesso! Recarregando..." });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setImportMsg({ tipo: "erro", texto: err.message });
      setTimeout(() => setImportMsg(null), 5000);
    }
  };

  return (
    <div className="app-root">
      {/* Background decoration */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-icon">✓</div>
          <div>
            <h1 className="app-title">Fluxo de Venda</h1>
            <p className="app-subtitle">Workflow diário de pedidos</p>
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Backup card */}
        <section className="card backup-card">
          <h2 className="section-title">
            <span className="section-dot" />
            Backup dos Dados
          </h2>
          <p className="backup-text">
            Seus dados ficam salvos só neste navegador, neste computador. Se
            for usar em outra máquina, ou quiser ter uma cópia de segurança,
            baixe o backup. Depois, na outra máquina (ou após limpar o
            navegador), use "Importar Backup" para trazer os clientes de
            volta.
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

        {/* Active tab content */}
        {tab === "fluxo" ? <FluxoVenda /> : <FinalizacaoVendas />}
      </div>
    </div>
  );
}
