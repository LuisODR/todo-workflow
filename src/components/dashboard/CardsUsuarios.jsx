import {
  USUARIOS,
  getCompletosDoUsuario,
  getAndamentoDoUsuario,
  pct,
} from "../../data/mockDashboard";

function fmtHora(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MiniProgressBar({ valor, cor }) {
  return (
    <div className="db-mini-bar-wrap">
      <div
        className="db-mini-bar-fill"
        style={{ width: `${valor}%`, background: cor }}
      />
    </div>
  );
}

function ClienteCompleto({ cliente, cor }) {
  return (
    <div className="db-cliente-row db-cliente-row--done">
      <span className="db-cliente-check" style={{ color: cor }}>✓</span>
      <div className="db-cliente-info">
        <span className="db-cliente-nome">{cliente.nome}</span>
        <span className="db-cliente-meta">{cliente.origem} · {fmtHora(cliente.dataHora)}</span>
      </div>
      <span className="db-cliente-badge-done">100%</span>
    </div>
  );
}

function ClienteAndamento({ cliente, cor }) {
  const p = pct(cliente);
  const done = cliente.checked.filter(Boolean).length;
  return (
    <div className="db-cliente-row db-cliente-row--andamento">
      <span className="db-cliente-check db-cliente-check--andamento">◐</span>
      <div className="db-cliente-info">
        <span className="db-cliente-nome">{cliente.nome}</span>
        <span className="db-cliente-meta">{cliente.origem} · {done}/{cliente.totalSteps} passos</span>
        <MiniProgressBar valor={p} cor={cor} />
      </div>
      <span className="db-cliente-badge-andamento" style={{ color: cor }}>{p}%</span>
    </div>
  );
}

export default function CardsUsuarios() {
  return (
    <div className="db-usuarios-grid">
      {USUARIOS.map((u) => {
        const completos  = getCompletosDoUsuario(u.id);
        const andamento  = getAndamentoDoUsuario(u.id);
        const totalFeitos = completos.length + andamento.length;
        const taxaUser   = totalFeitos === 0 ? 0 : Math.round((completos.length / totalFeitos) * 100);

        return (
          <div className="db-card db-usuario-card" key={u.id}>
            {/* Header do card */}
            <div className="db-usuario-header">
              <div className="db-avatar db-usuario-avatar" style={{ background: u.cor }}>
                {u.avatar}
              </div>
              <div>
                <h3 className="db-usuario-nome">{u.nome}</h3>
                <span className="db-usuario-meta">
                  {completos.length} completos · {andamento.length} em andamento
                </span>
              </div>
              <div className="db-usuario-taxa" style={{ color: u.cor }}>
                {taxaUser}%
              </div>
            </div>

            {/* Barra de progresso geral do usuário */}
            <div className="db-usuario-bar-wrap">
              <div className="db-usuario-bar-fill" style={{ width: `${taxaUser}%`, background: u.cor }} />
            </div>

            {/* Clientes completos */}
            {completos.length > 0 && (
              <div className="db-usuario-secao">
                <span className="db-usuario-secao-titulo db-usuario-secao-titulo--done">
                  ✓ Completos ({completos.length})
                </span>
                {completos.map((c) => (
                  <ClienteCompleto key={c.id} cliente={c} cor={u.cor} />
                ))}
              </div>
            )}

            {/* Clientes em andamento */}
            {andamento.length > 0 && (
              <div className="db-usuario-secao">
                <span className="db-usuario-secao-titulo db-usuario-secao-titulo--andamento">
                  ◐ Em andamento ({andamento.length})
                </span>
                {andamento.map((c) => (
                  <ClienteAndamento key={c.id} cliente={c} cor={u.cor} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
