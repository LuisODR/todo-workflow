const TIPO_CONFIG = {
  fluxo_salvo:    { emoji:"📋", label:"Fluxo salvo",    cor:"#2196f3" },
  pdf_gerado:     { emoji:"📄", label:"PDF gerado",     cor:"#7c3aed" },
  moeda_criada:   { emoji:"🪙", label:"Moeda criada",   cor:"#10b981" },
  moeda_editada:  { emoji:"✏️",  label:"Moeda editada",  cor:"#f59e0b" },
  moeda_removida: { emoji:"🗑",  label:"Moeda removida", cor:"#ef4444" },
  pasta_criada:   { emoji:"📂", label:"Pasta criada",   cor:"#0891b2" },
  pasta_removida: { emoji:"🗑",  label:"Pasta removida", cor:"#ef4444" },
  login:          { emoji:"🔑", label:"Login",          cor:"#64748b" },
  default:        { emoji:"⚡", label:"Ação",           cor:"#94a3b8" },
};

function getCfg(type) { return TIPO_CONFIG[type] ?? TIPO_CONFIG.default; }
function getIniciais(nome="") { return nome.split(" ").map((p)=>p[0]).slice(0,2).join("").toUpperCase() || "?"; }

function tempoRelativo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff/1000);
  if (sec < 60)  return "agora mesmo";
  const min = Math.floor(sec/60);
  if (min < 60)  return `há ${min} min`;
  const h = Math.floor(min/60);
  if (h < 24)    return `há ${h}h`;
  const d = Math.floor(h/24);
  return `há ${d} dia${d>1?"s":""}`;
}

function fmtHora(iso) { return new Date(iso).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}); }
function fmtData(iso) { return new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}); }

export default function FeedAtividadeReal({ acoes = [], mostrarUsuario = false }) {
  if (acoes.length === 0) return <div className="db-feed-vazio"><span>Nenhuma ação registrada ainda.</span></div>;
  return (
    <div className="db-feed-list">
      {acoes.map((acao) => {
        const cfg = getCfg(acao.type);
        return (
          <div key={acao.id} className="db-feed-item--real">
            {mostrarUsuario
              ? <div className="db-avatar db-feed-avatar" style={{background:cfg.cor}} title={acao.userName}>{getIniciais(acao.userName)}</div>
              : <div className="db-feed-type-ico" style={{background:cfg.cor+"22",borderColor:cfg.cor+"44"}}>{cfg.emoji}</div>}
            <div className="db-feed-info">
              <p className="db-feed-texto">{mostrarUsuario && <strong className="db-feed-username">{acao.userName} · </strong>}{acao.label}</p>
              <span className="db-feed-meta">{fmtData(acao.ts)} · {fmtHora(acao.ts)} · {tempoRelativo(acao.ts)}</span>
            </div>
            <span className="db-feed-badge" style={{background:cfg.cor+"18",color:cfg.cor,borderColor:cfg.cor+"44"}}>{cfg.emoji} {cfg.label}</span>
          </div>
        );
      })}
    </div>
  );
}
