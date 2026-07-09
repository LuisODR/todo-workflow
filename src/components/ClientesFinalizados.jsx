import { FLUXO_VENDA_STEPS } from "../data/steps";
import { useLocalStorage, STORAGE_KEYS } from "../hooks/useLocalStorage";

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isFormatoValido(dados) {
  if (!Array.isArray(dados)) return false;
  return dados.every(
    (item) =>
      item &&
      typeof item === "object" &&
      "id" in item &&
      Array.isArray(item.checked)
  );
}

export default function ClientesFinalizados() {
  const [feitos, setFeitos] = useLocalStorage(
    STORAGE_KEYS.FEITOS,
    [],
    isFormatoValido
  );

  const total = FLUXO_VENDA_STEPS.length;

  // Só os que têm 100% marcado
  const finalizados = feitos.filter(
    (f) =>
      Array.isArray(f.checked) &&
      f.checked.filter(Boolean).length === total
  );

  const handleRemover = (id) => {
    const ok = window.confirm("Remover este cliente do histórico?");
    if (!ok) return;
    setFeitos((prev) => prev.filter((f) => f.id !== id));
  };

  const handleLimparTodos = () => {
    const ok = window.confirm(
      `Remover todos os ${finalizados.length} clientes finalizados do histórico? Esta ação não pode ser desfeita.`
    );
    if (!ok) return;
    const idsFinalizados = new Set(finalizados.map((f) => f.id));
    setFeitos((prev) => prev.filter((f) => !idsFinalizados.has(f.id)));
  };

  return (
    <>
      <section className="card">
        <div className="fin-cliente-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="section-dot" />
            Clientes Finalizados
            {finalizados.length > 0 && (
              <span className="feitos-badge">{finalizados.length}</span>
            )}
          </h2>
          {finalizados.length > 0 && (
            <button className="btn-clear" onClick={handleLimparTodos}>
              Limpar todos
            </button>
          )}
        </div>
        <p style={{ fontSize: 13.5, color: "var(--text-mid)", marginTop: 10, lineHeight: 1.6 }}>
          Clientes do <strong>Fluxo de Venda</strong> com todos os{" "}
          <strong>{total} passos</strong> concluídos.
        </p>
      </section>

      {finalizados.length === 0 ? (
        <section className="card" style={{ textAlign: "center" }}>
          <div className="feitos-empty">
            <span className="feitos-empty-icon">🏆</span>
            <p>Nenhum cliente finalizado ainda.</p>
            <p style={{ fontSize: 13, color: "var(--text-light)", marginTop: 6 }}>
              Quando um cliente tiver todos os {total} passos marcados e for salvo,
              ele aparecerá aqui.
            </p>
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="finalizados-lista">
            {finalizados.map((f, idx) => (
              <div className="finalizados-card" key={f.id}>
                <div className="finalizados-posicao">#{idx + 1}</div>
                <div className="feito-avatar finalizados-avatar">
                  {(f.nome?.[0] || "?").toUpperCase()}
                </div>
                <div className="feito-info">
                  <span className="feito-nome">{f.nome}</span>
                  <span className="feito-meta">
                    <span className="feito-tag">{f.origem || "—"}</span>
                    {formatDateTime(f.dataHora)}
                  </span>
                </div>
                <span className="feito-status-badge feito-status-badge--done finalizados-badge-done">
                  ✓ {total}/{total}
                </span>
                <button
                  className="feito-remove-btn"
                  title="Remover"
                  onClick={() => handleRemover(f.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
