import FeedAtividadeReal from "./FeedAtividadeReal";

const CORES = {
  blue:   { bg:"#e3f2fd", text:"#1565c0", border:"#90caf9" },
  green:  { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0" },
  purple: { bg:"#faf5ff", text:"#6b21a8", border:"#e9d5ff" },
  amber:  { bg:"#fefce8", text:"#92400e", border:"#fde68a" },
  teal:   { bg:"#f0fdfa", text:"#134e4a", border:"#99f6e4" },
};

function StatCard({ valor, label, cor="blue", emoji }) {
  const c = CORES[cor];
  return (
    <div className="db-stat-card" style={{background:c.bg,borderColor:c.border}}>
      {emoji && <span className="db-stat-emoji">{emoji}</span>}
      <span className="db-stat-num" style={{color:c.text}}>{valor}</span>
      <span className="db-stat-label">{label}</span>
    </div>
  );
}

export default function DashboardUsuario({ dados }) {
  const { metricas, acoes, catalogo } = dados;
  return (
    <div className="db-usuario-view">
      <div className="db-resumo-grid">
        <StatCard valor={metricas.fluxosSalvos}  label="Fluxos salvos"   cor="blue"   emoji="📋" />
        <StatCard valor={metricas.pdfsGerados}   label="PDFs gerados"    cor="purple" emoji="📄" />
        <StatCard valor={metricas.moedasCriadas} label="Moedas criadas"  cor="green"  emoji="🪙" />
        <StatCard valor={catalogo.totalPastas}   label="Pastas criadas"  cor="amber"  emoji="📂" />
        <StatCard valor={catalogo.totalFeitos}   label="Clientes feitos" cor="teal"   emoji="✅" />
      </div>
      {metricas.totalAcoes === 0 ? (
        <div className="db-card db-vazio">
          <span className="db-vazio-ico">📊</span>
          <p className="db-vazio-titulo">Nenhuma ação registrada ainda</p>
          <p className="db-vazio-hint">Suas atividades aparecerão aqui conforme você usa o sistema: salve clientes, gere PDFs ou cadastre moedas.</p>
        </div>
      ) : (
        <div className="db-card">
          <h3 className="db-section-title">Minhas atividades recentes</h3>
          <FeedAtividadeReal acoes={acoes} mostrarUsuario={false} />
        </div>
      )}
    </div>
  );
}
