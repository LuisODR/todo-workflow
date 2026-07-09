import { CLIENTES_COMPLETOS, CLIENTES_ANDAMENTO, USUARIOS, getCompletosDoUsuario } from "../../data/mockDashboard";

export default function ResumoGeral() {
  const totalCompletos  = CLIENTES_COMPLETOS.length;
  const totalAndamento  = CLIENTES_ANDAMENTO.length;
  const totalClientes   = totalCompletos + totalAndamento;
  const taxaConclusao   = Math.round((totalCompletos / totalClientes) * 100);

  // Ranking por quantidade de completos
  const ranking = [...USUARIOS]
    .map((u) => ({ ...u, completos: getCompletosDoUsuario(u.id).length }))
    .sort((a, b) => b.completos - a.completos);

  const medalhas = ["🥇", "🥈", "🥉"];

  return (
    <div className="db-resumo-grid">
      {/* Stat cards */}
      <div className="db-stat-card db-stat-card--blue">
        <span className="db-stat-num">{totalClientes}</span>
        <span className="db-stat-label">Clientes hoje</span>
      </div>
      <div className="db-stat-card db-stat-card--green">
        <span className="db-stat-num">{totalCompletos}</span>
        <span className="db-stat-label">Completos</span>
      </div>
      <div className="db-stat-card db-stat-card--orange">
        <span className="db-stat-num">{totalAndamento}</span>
        <span className="db-stat-label">Em andamento</span>
      </div>
      <div className="db-stat-card db-stat-card--purple">
        <span className="db-stat-num">{taxaConclusao}%</span>
        <span className="db-stat-label">Taxa de conclusão</span>
      </div>

      {/* Ranking */}
      <div className="db-ranking-card">
        <h3 className="db-section-title">Ranking do dia</h3>
        <div className="db-ranking-list">
          {ranking.map((u, i) => (
            <div className="db-ranking-item" key={u.id}>
              <span className="db-ranking-medalha">{medalhas[i] || `#${i + 1}`}</span>
              <div className="db-avatar" style={{ background: u.cor }}>{u.avatar}</div>
              <span className="db-ranking-nome">{u.nome}</span>
              <span className="db-ranking-qtd">{u.completos} completos</span>
              <div className="db-ranking-bar-wrap">
                <div
                  className="db-ranking-bar-fill"
                  style={{
                    width: `${Math.round((u.completos / totalCompletos) * 100)}%`,
                    background: u.cor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
