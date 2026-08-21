import { useState } from "react";
import FormularioMoeda from "./FormularioMoeda";

function formatData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric" });
}

export default function CardMoeda({ moeda, pastas = [], onAtualizar, onRemover, onCriarPasta }) {
  const [expandido, setExpandido] = useState(false);
  const [editando, setEditando]   = useState(false);

  const pastasVinculadas = pastas.filter((p) => moeda.pastaIds?.includes(p.id));

  const handleSalvar = (campos) => { onAtualizar(moeda.id, campos); setEditando(false); };

  const handleRemover = (e) => {
    e.stopPropagation();
    const msg = pastasVinculadas.length > 0
      ? `Remover esta moeda?\nEla será removida de ${pastasVinculadas.length} pasta(s): ${pastasVinculadas.map((p) => p.nome).join(", ")}.`
      : "Remover esta moeda do catálogo?";
    if (window.confirm(msg)) onRemover(moeda.id);
  };

  const specsPreview = moeda.specs ? moeda.specs.slice(0, 100) + (moeda.specs.length > 100 ? "…" : "") : null;

  if (editando) {
    return (
      <div className="card cm-card cm-card--editando">
        <FormularioMoeda moedaInicial={moeda} pastas={pastas} onCriarPasta={onCriarPasta} onSalvar={handleSalvar} onCancelar={() => setEditando(false)} />
      </div>
    );
  }

  return (
    <div className={`card cm-card ${expandido ? "cm-card--expandido" : ""}`} onClick={() => setExpandido((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setExpandido((v) => !v)} aria-expanded={expandido}>
      <div className="cm-header-row">
        <div className="cm-thumbs">
          <div className="cm-thumb">{moeda.fotoFrente ? <img src={moeda.fotoFrente} alt="Frente" className="cm-thumb-img" /> : <span className="cm-thumb-placeholder">F</span>}</div>
          <div className="cm-thumb">{moeda.fotoVerso  ? <img src={moeda.fotoVerso}  alt="Verso"  className="cm-thumb-img" /> : <span className="cm-thumb-placeholder">V</span>}</div>
        </div>
        <div className="cm-info">
          {specsPreview ? <p className="cm-specs-preview">{specsPreview}</p> : <p className="cm-specs-vazio">Sem especificações</p>}
          <div className="cm-pastas-badges">
            {pastasVinculadas.length === 0
              ? <span className="cm-sem-pasta">Sem pasta</span>
              : pastasVinculadas.map((p) => <span key={p.id} className="cm-pasta-badge" style={{background:p.cor+"22",color:p.cor,borderColor:p.cor+"55"}}>{p.nome}</span>)}
          </div>
          <span className="cm-data">Cadastrada em {formatData(moeda.criadoEm)}</span>
        </div>
        <button className={`cm-expand-btn ${expandido ? "cm-expand-btn--up" : ""}`} onClick={(e) => { e.stopPropagation(); setExpandido((v) => !v); }} aria-label={expandido ? "Recolher" : "Expandir"}><IcoChevron /></button>
      </div>

      {expandido && (
        <div className="cm-body" onClick={(e) => e.stopPropagation()}>
          <div className="cm-fotos-grandes">
            <div className="cm-foto-grande-slot"><span className="cm-foto-label">Frente</span>{moeda.fotoFrente ? <img src={moeda.fotoFrente} alt="Frente" className="cm-foto-grande" /> : <div className="cm-foto-sem">Sem foto</div>}</div>
            <div className="cm-foto-grande-divisor" />
            <div className="cm-foto-grande-slot"><span className="cm-foto-label">Verso</span>{moeda.fotoVerso ? <img src={moeda.fotoVerso} alt="Verso" className="cm-foto-grande" /> : <div className="cm-foto-sem">Sem foto</div>}</div>
          </div>
          {moeda.specs && <div className="cm-specs-completas"><span className="field-label">Especificações</span><p className="cm-specs-texto">{moeda.specs}</p></div>}
          <div className="cm-pastas-secao">
            <span className="field-label">Pastas</span>
            {pastasVinculadas.length === 0
              ? <p className="cm-sem-pasta">Não está em nenhuma pasta.</p>
              : <div className="cm-pastas-lista-detalhada">{pastasVinculadas.map((p) => <span key={p.id} className="cm-pasta-badge cm-pasta-badge--lg" style={{background:p.cor+"18",color:p.cor,borderColor:p.cor+"55"}}><span className="cm-pasta-badge-dot" style={{background:p.cor}} />{p.nome}</span>)}</div>}
          </div>
          <div className="cm-acoes">
            <button className="cm-btn-editar" onClick={() => { setExpandido(false); setEditando(true); }}><IcoEditar />Editar</button>
            <button className="cm-btn-remover" onClick={handleRemover}><IcoLixo />Remover</button>
          </div>
        </div>
      )}
    </div>
  );
}

function IcoChevron() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function IcoEditar()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IcoLixo()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
