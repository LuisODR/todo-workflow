import { FEED_ATIVIDADE, getUsuario } from "../../data/mockDashboard";

function fmtHora(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tempoRelativo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1)  return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  return `há ${h}h${min % 60 > 0 ? ` ${min % 60}min` : ""}`;
}

export default function FeedAtividade() {
  // Mais recentes primeiro
  const feed = [...FEED_ATIVIDADE].sort(
    (a, b) => new Date(b.dataHora) - new Date(a.dataHora)
  );

  return (
    <div className="db-card db-feed-card">
      <div className="db-feed-header">
        <h3 className="db-section-title" style={{ margin: 0 }}>Fila de Atividade</h3>
        <span className="db-feed-live">● ao vivo</span>
      </div>

      <div className="db-feed-list">
        {feed.map((ev) => {
          const u = getUsuario(ev.usuarioId);
          const concluiu = ev.acao === "concluiu";
          return (
            <div
              key={ev.id}
              className={`db-feed-item ${concluiu ? "db-feed-item--done" : "db-feed-item--started"}`}
            >
              <div className="db-avatar db-feed-avatar" style={{ background: u?.cor }}>
                {u?.avatar}
              </div>
              <div className="db-feed-info">
                <p className="db-feed-texto">
                  <strong>{u?.nome}</strong>{" "}
                  {concluiu ? "concluiu o processo de" : "iniciou o processo de"}{" "}
                  <strong>{ev.clienteNome}</strong>
                </p>
                <span className="db-feed-meta">
                  {fmtHora(ev.dataHora)} · {tempoRelativo(ev.dataHora)}
                </span>
              </div>
              <span className={`db-feed-badge ${concluiu ? "db-feed-badge--done" : "db-feed-badge--started"}`}>
                {concluiu ? "✓ Concluído" : "▶ Iniciado"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
