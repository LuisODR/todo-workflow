import FeedAtividadeReal from "./FeedAtividadeReal";

const RANK_CORES = ["#7c3aed","#0891b2","#b45309","#16a34a","#dc2626"];
function getRankCor(i) { return RANK_CORES[i % RANK_CORES.length]; }
function getIniciais(nome="") { return nome.split(" ").map((p)=>p[0]).slice(0,2).join("").toUpperCase()||"?"; }

function tempoRelativo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff/60000);
  if (min < 1)  return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min/60);
  if (h < 24)   return `há ${h}h`;
  const d = Math.floor(h/24);
  return `há ${d} dia${d>1?"s":""}`;
}

const ESTILOS = {
  blue:   { bg:"#e3f2fd", text:"#1565c0", border:"#90caf9" },
  green:  { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0" },
  purple: { bg:"#faf5ff", text:"#6b21a8", border:"#e9d5ff" },
  amber:  { bg:"#fefce8", text:"#92400e", border:"#fde68a" },
  teal:   { bg:"#f0fdfa", text:"#134e4a", border:"#99f6e4" },
  red:    { bg:"#fef2f2", text:"#991b1b", border:"#fecaca" },
};

function StatGlobal({ valor, label, cor, emoji }) {
  const c = ESTILOS[cor] ?? ESTILOS.blue;
  return (
    <div className="db-stat-card" style={{background:c.bg,borderColor:c.border}}>
      {emoji && <span className="db-stat-emoji">{emoji}</span>}
      <span className="db-stat-num" style={{color:c.text}}>{valor}</span>
      <span className="db-stat-label">{label}</span>
    </div>
  );
}

function MiniMetrica({ label, valor, emoji }) {
  return (
    <div className="db-mini-metrica">
      <span className="db-mini-metrica-emoji">{emoji}</span>
      <span className="db-mini-metrica-valor">{valor}</span>
      <span className="db-mini-metrica-label">{label}</span>
    </div>
  );
}

function CardUsuario({ resumo, index, topTotal }) {
  const cor = getRankCor(index);
  const medalhas = ["🥇","🥈","🥉"];
  return (
    <div className="db-card db-user-resumo-card" style={{position:"relative",overflow:"hidden"}}>
      <div className="db-user-resumo-bar-bg" style={{position:"absolute",top:0,left:0,bottom:0,width:`${Math.round((resumo.totalAcoes/topTotal)*100)}%`,background:cor+"18",borderRadius:"var(--radius-sm)",pointerEvents:"none"}} />
      <div className="db-user-resumo-header">
        <div className="db-avatar" style={{background:cor}}>{getIniciais(resumo.userName)}</div>
        <div className="db-user-resumo-info">
          <span className="db-user-resumo-nome">{medalhas[index]??`#${index+1}`} {resumo.userName}</span>
          <span className="db-user-resumo-ultima">Última ação: {tempoRelativo(resumo.ultimaAcao)}</span>
        </div>
        <span className="db-user-resumo-total" style={{color:cor}}>{resumo.totalAcoes} ações</span>
      </div>
      <div className="db-user-resumo-metricas">
        <MiniMetrica label="Fluxos" valor={resumo.fluxosSalvos}  emoji="📋" />
        <MiniMetrica label="PDFs"   valor={resumo.pdfsGerados}   emoji="📄" />
        <MiniMetrica label="Moedas" valor={resumo.moedasCriadas} emoji="🪙" />
        <MiniMetrica label="Pastas" valor={resumo.pastasCriadas} emoji="📂" />
      </div>
    </div>
  );
}

export default function DashboardSuperUser({ dados }) {
  const { metricas, acoes, usuariosResumo, catalogo } = dados;
  const topTotal = usuariosResumo[0]?.totalAcoes ?? 1;

  return (
    <div className="db-superuser-view">
      <div className="db-resumo-grid">
        <StatGlobal valor={metricas.totalAcoes}     label="Ações totais"      cor="blue"   emoji="⚡" />
        <StatGlobal valor={metricas.fluxosSalvos}   label="Fluxos salvos"     cor="teal"   emoji="📋" />
        <StatGlobal valor={metricas.pdfsGerados}    label="PDFs gerados"      cor="purple" emoji="📄" />
        <StatGlobal valor={metricas.moedasCriadas}  label="Moedas criadas"    cor="green"  emoji="🪙" />
        <StatGlobal valor={catalogo.totalMoedas}    label="Moedas no catálogo" cor="amber" emoji="🗂" />
        <StatGlobal valor={metricas.usuariosAtivos} label="Usuários ativos"   cor="red"    emoji="👥" />
      </div>

      {metricas.totalAcoes === 0 ? (
        <div className="db-card db-vazio">
          <span className="db-vazio-ico">📊</span>
          <p className="db-vazio-titulo">Nenhuma ação registrada no sistema</p>
          <p className="db-vazio-hint">As ações dos usuários aparecerão aqui conforme eles usam o sistema.</p>
        </div>
      ) : (
        <div className="db-meio-grid">
          <div className="db-card">
            <h3 className="db-section-title">Atividade por usuário</h3>
            <div className="db-user-resumo-lista">
              {usuariosResumo.map((r, i) => <CardUsuario key={r.userId} resumo={r} index={i} topTotal={topTotal} />)}
            </div>
          </div>
          <div className="db-card db-feed-card">
            <div className="db-feed-header">
              <h3 className="db-section-title" style={{margin:0}}>Feed global de ações</h3>
              <span className="db-feed-live">● ao vivo</span>
            </div>
            <FeedAtividadeReal acoes={acoes} mostrarUsuario={true} />
          </div>
        </div>
      )}
    </div>
  );
}
