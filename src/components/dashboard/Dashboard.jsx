import { useDashboardData } from "../../hooks/useDashboardData";
import { limparActionLog }  from "../../hooks/useTracker";
import DashboardUsuario     from "./DashboardUsuario";
import DashboardSuperUser   from "./DashboardSuperUser";

function IcoRefresh() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>; }
function IcoLixo()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }

export default function Dashboard() {
  const { dados, recarregar } = useDashboardData();

  const hoje = new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });

  if (!dados) {
    return (
      <div className="db-root">
        <div className="db-loading"><span className="db-loading-spinner" /><span>Carregando dados…</span></div>
      </div>
    );
  }

  const handleLimparLog = () => {
    if (!window.confirm("Limpar todo o histórico de ações? Irreversível.")) return;
    limparActionLog(); recarregar();
  };

  return (
    <div className="db-root">
      <div className="db-topbar">
        <div>
          <h1 className="db-titulo">{dados.perfil === "superuser" ? "Painel do Administrador" : "Meu Painel"}</h1>
          <p className="db-subtitulo">
            {hoje} · {dados.user?.name ?? ""}
            {dados.perfil === "superuser" && <span className="db-superuser-badge">🛡 Super User</span>}
          </p>
        </div>
        <div className="db-topbar-actions">
          <button className="db-btn-refresh" onClick={recarregar}><IcoRefresh />Atualizar</button>
          {dados.perfil === "superuser" && <button className="db-btn-limpar-log" onClick={handleLimparLog}><IcoLixo />Limpar log</button>}
        </div>
      </div>
      {dados.perfil === "superuser"
        ? <DashboardSuperUser dados={dados} />
        : <DashboardUsuario   dados={dados} />}
    </div>
  );
}
