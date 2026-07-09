import ResumoGeral from "./ResumoGeral";
import LinhaDoTempo from "./LinhaDoTempo";
import FeedAtividade from "./FeedAtividade";
import CardsUsuarios from "./CardsUsuarios";

export default function Dashboard() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="db-root">
      <div className="db-topbar">
        <div>
          <h1 className="db-titulo">Painel do Administrador</h1>
          <p className="db-subtitulo">{hoje} · dados de exemplo</p>
        </div>
        <span className="db-mock-badge">DEMO</span>
      </div>

      {/* Resumo do dia + ranking */}
      <ResumoGeral />

      {/* Linha do tempo + feed lado a lado */}
      <div className="db-meio-grid">
        <LinhaDoTempo />
        <FeedAtividade />
      </div>

      {/* Cards por usuário */}
      <div className="db-card" style={{ padding: "20px 20px 8px" }}>
        <h3 className="db-section-title" style={{ marginBottom: 16 }}>Desempenho por Colaboradora</h3>
        <CardsUsuarios />
      </div>
    </div>
  );
}
