function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Lista compartilhada de clientes "Feitos", usada tanto no Fluxo de Venda
 * quanto na Finalização de Vendas. Mostra a % de progresso de cada cliente
 * (ou "Completo" quando 100%) e permite clicar para reabrir e editar.
 *
 * Props:
 * - feitos: array de registros salvos
 * - getTotalSteps(f): retorna o número total de passos possíveis para aquele registro
 *   (pode ser um número fixo, ou variar por registro - ex: Mercado Livre vs Tray)
 * - getProgress(f): retorna quantos passos daquele registro estão marcados
 * - editandoId: id do registro que está sendo editado agora (para destacar)
 * - onEditar(f): chamado ao clicar num card
 * - onRemover(id): chamado ao clicar em remover
 * - onLimparHistorico(): chamado ao limpar tudo
 * - renderTag(f): retorna o texto da tag exibida (ex: origem, ou "Mercado Livre")
 */
export default function FeitosList({
  feitos,
  getTotalSteps,
  getProgress,
  editandoId,
  onEditar,
  onRemover,
  onLimparHistorico,
  renderTag,
}) {
  // Filtra qualquer registro malformado antes de renderizar, por segurança
  // (ex: dados de uma versão antiga do app que tenham escapado da validação inicial)
  const feitosValidos = feitos.filter((f) => f && typeof f === "object");

  return (
    <section className="card feitos-card">
      <div className="feitos-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          <span className="section-dot" />
          Feitos
          {feitosValidos.length > 0 && (
            <span className="feitos-badge">{feitosValidos.length}</span>
          )}
        </h2>
        {feitosValidos.length > 0 && (
          <button className="btn-clear" onClick={onLimparHistorico}>
            Limpar Histórico
          </button>
        )}
      </div>

      {feitosValidos.length === 0 ? (
        <div className="feitos-empty">
          <span className="feitos-empty-icon">📋</span>
          <p>Nenhum cliente salvo ainda.</p>
        </div>
      ) : (
        <div className="feitos-list">
          {feitosValidos.map((f) => {
            const nome = f.nome || "(sem nome)";
            const done = getProgress(f) || 0;
            const total = getTotalSteps(f) || 0;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            const completo = pct === 100;
            const sendoEditado = editandoId === f.id;

            return (
              <div
                className={`feito-card feito-card--clickable ${
                  sendoEditado ? "feito-card--editando" : ""
                }`}
                key={f.id}
                onClick={() => onEditar(f)}
              >
                <div className="feito-avatar">
                  {nome[0].toUpperCase()}
                </div>
                <div className="feito-info">
                  <span className="feito-nome">{nome}</span>
                  <span className="feito-meta">
                    <span className="feito-tag">{renderTag(f)}</span>
                    {formatDateTime(f.dataHora)}
                  </span>
                </div>
                <div className="feito-status">
                  {completo ? (
                    <span className="feito-status-badge feito-status-badge--done">
                      ✓ Completo
                    </span>
                  ) : (
                    <span className="feito-status-badge feito-status-badge--pending">
                      {pct}%
                    </span>
                  )}
                </div>
                <button
                  className="feito-remove-btn"
                  title="Remover"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemover(f.id);
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
