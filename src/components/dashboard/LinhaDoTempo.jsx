import { CLIENTES_COMPLETOS, USUARIOS, getUsuario } from "../../data/mockDashboard";

// Turnos: manhã 08:00–12:00, tarde 13:30–20:00
const TURNOS = [
  { label: "Manhã",  inicio: 8 * 60,       fim: 12 * 60,      id: "manha" },
  { label: "Tarde",  inicio: 13 * 60 + 30, fim: 20 * 60,      id: "tarde" },
];

function minutos(iso) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function fmtHora(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function posicao(min, inicio, fim) {
  return Math.max(0, Math.min(100, ((min - inicio) / (fim - inicio)) * 100));
}

function Turno({ turno }) {
  const duracaoMin = turno.fim - turno.inicio;
  // Marcadores de hora a cada 60 min
  const marcadores = [];
  for (let m = turno.inicio; m <= turno.fim; m += 60) {
    marcadores.push(m);
  }

  // Clientes deste turno
  const clientesTurno = CLIENTES_COMPLETOS.filter((c) => {
    const m = minutos(c.dataHora);
    return m >= turno.inicio && m <= turno.fim;
  });

  return (
    <div className="db-turno">
      <div className="db-turno-header">
        <span className="db-turno-label">{turno.label}</span>
        <span className="db-turno-range">
          {fmtHora(turno.inicio)} – {fmtHora(turno.fim)}
        </span>
        <span className="db-turno-count">{clientesTurno.length} concluídos</span>
      </div>

      {/* Trilha da linha do tempo */}
      <div className="db-timeline-track">
        {/* Marcadores de hora */}
        {marcadores.map((m) => (
          <div
            key={m}
            className="db-timeline-mark"
            style={{ left: `${posicao(m, turno.inicio, turno.fim)}%` }}
          >
            <div className="db-timeline-tick" />
            <span className="db-timeline-tick-label">{fmtHora(m)}</span>
          </div>
        ))}

        {/* Clientes concluídos */}
        {clientesTurno.map((c) => {
          const u = getUsuario(c.usuarioId);
          const pos = posicao(minutos(c.dataHora), turno.inicio, turno.fim);
          return (
            <div
              key={c.id}
              className="db-timeline-evento"
              style={{ left: `${pos}%` }}
              title={`${u?.nome} — ${c.nome} (${fmtHora(minutos(c.dataHora))})`}
            >
              <div className="db-timeline-dot" style={{ background: u?.cor }}>
                {u?.avatar}
              </div>
              <div className="db-timeline-tooltip">
                <strong>{u?.nome}</strong>
                <span>{c.nome}</span>
                <span className="db-timeline-tooltip-hora">{fmtHora(minutos(c.dataHora))}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LinhaDoTempo() {
  return (
    <div className="db-card">
      <h3 className="db-section-title">Linha do Tempo — Hoje</h3>
      <div className="db-timeline-legenda">
        {USUARIOS.map((u) => (
          <span key={u.id} className="db-timeline-legenda-item">
            <span className="db-timeline-legenda-dot" style={{ background: u.cor }} />
            {u.nome}
          </span>
        ))}
      </div>
      <div className="db-turnos">
        {TURNOS.map((t) => <Turno key={t.id} turno={t} />)}
      </div>
    </div>
  );
}
