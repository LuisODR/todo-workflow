import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useAuth }           from "./contexts/AuthContext";
import FluxoVenda            from "./components/FluxoVenda";
import FinalizacaoVendas     from "./components/FinalizacaoVendas";
import Dashboard             from "./components/dashboard/Dashboard";
import PdfBuilder            from "./components/pdf/PdfBuilder";
import OrganizacaoMoedas     from "./components/moedas/OrganizacaoMoedas";
import { exportarBackup, lerArquivoBackup, aplicarBackup } from "./hooks/useLocalStorage";

function IcoTodo()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>; }
function IcoDashboard() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function IcoSair()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }

const TODO_TABS = [
  { id:"fluxo",       label:"Fluxo de Venda"     },
  { id:"finalizacao", label:"Finalização"          },
  { id:"pdf",         label:"Gerador de PDF"   },
  { id:"moedas",      label:"Org. de Moedas"  },
];
const SEM_BACKUP        = new Set(["pdf","moedas"]);
const CONTAINER_LARGO   = new Set(["moedas"]);

export default function App() {
  const { user, isSuperUser, logout } = useAuth();
  const [modo, setModo]             = useState("todo");
  const [tab,  setTab]              = useState("fluxo");
  const [importMsg, setImportMsg]   = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const userMenuRef  = useRef(null);

  // Usuário comum não acessa dashboard
  useEffect(() => { if (modo === "dashboard" && !isSuperUser) setModo("todo"); }, [modo, isSuperUser]);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const fn = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleExportar = () => exportarBackup();
  const handleEscolherArquivo = () => fileInputRef.current?.click();
  const handleArquivoSelecionado = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    try {
      const dados = await lerArquivoBackup(file);
      if (!window.confirm("Importar este backup vai substituir os dados atuais. Deseja continuar?")) return;
      aplicarBackup(dados);
      setImportMsg({ tipo:"sucesso", texto:"Backup importado! Recarregando..." });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setImportMsg({ tipo:"erro", texto:err.message });
      setTimeout(() => setImportMsg(null), 5000);
    }
  };

  const iniciais = user?.name ? user.name.split(" ").map((p)=>p[0]).slice(0,2).join("").toUpperCase() : "?";
  const containerClass = ["container", modo==="todo" && CONTAINER_LARGO.has(tab) ? "container--largo" : ""].filter(Boolean).join(" ");

  return (
    <div className="app-root">
      <div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" />
      <div className={containerClass}>

        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="header-icon">✓</div>
            <div>
              <h1 className="app-title">{modo==="todo" ? "Fluxo de Venda" : "Painel Admin"}</h1>
              <p className="app-subtitle">{modo==="todo" ? "Workflow diário de pedidos" : "Visão geral da equipe"}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-mode-switcher">
              <button className={`header-mode-btn ${modo==="todo" ? "header-mode-btn--active" : ""}`} onClick={()=>setModo("todo")}><IcoTodo /><span>Workflow</span></button>
              {isSuperUser && <button className={`header-mode-btn ${modo==="dashboard" ? "header-mode-btn--active" : ""}`} onClick={()=>setModo("dashboard")}><IcoDashboard /><span>Admin</span></button>}
            </div>
            <div className="user-menu-wrap" ref={userMenuRef}>
              <button className="user-avatar-btn" onClick={()=>setUserMenuOpen(v=>!v)}>
                <span className="user-avatar">{iniciais}</span>
                <span className={`user-role-badge ${isSuperUser ? "user-role-badge--super" : ""}`}>{isSuperUser ? "Super" : "User"}</span>
              </button>
              {userMenuOpen && (
                <div className="user-menu">
                  <div className="user-menu-info">
                    <strong className="user-menu-name">{user?.name}</strong>
                    <span className="user-menu-email">{user?.email}</span>
                    <span className={`user-menu-role ${isSuperUser ? "user-menu-role--super" : ""}`}>{isSuperUser ? " Super User" : "👤 Usuário"}</span>
                  </div>
                  <button className="user-menu-logout" onClick={()=>{setUserMenuOpen(false);logout();}}><IcoSair />Sair</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard */}
        {modo==="dashboard" && isSuperUser && <Dashboard />}

        {/* Workflow */}
        {modo==="todo" && (<>
          <nav className="tabs-nav">
            {TODO_TABS.map((t) => <button key={t.id} className={`tab-btn ${tab===t.id ? "tab-btn--active" : ""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
          </nav>

          {!SEM_BACKUP.has(tab) && (
            <section className="card backup-card">
              <h2 className="section-title"><span className="section-dot" />Backup dos Dados</h2>
              <p className="backup-text">Seus dados ficam salvos só neste navegador. Baixe o backup para usar em outra máquina.</p>
              <div className="backup-actions">
                <button className="btn-backup btn-backup--export" onClick={handleExportar}><span className="btn-save-icon">⬇️</span>Baixar Backup (.json)</button>
                <button className="btn-backup btn-backup--import" onClick={handleEscolherArquivo}><span className="btn-save-icon">⬆️</span>Importar Backup</button>
                <input type="file" accept="application/json,.json" ref={fileInputRef} style={{display:"none"}} onChange={handleArquivoSelecionado} />
              </div>
              {importMsg && <p className={`backup-msg backup-msg--${importMsg.tipo}`}>{importMsg.texto}</p>}
            </section>
          )}

          {tab==="fluxo"       && <FluxoVenda />}
          {tab==="finalizacao" && <FinalizacaoVendas />}
          {tab==="pdf"         && <PdfBuilder />}
          {tab==="moedas"      && <OrganizacaoMoedas />}
        </>)}
      </div>
    </div>
  );
}
