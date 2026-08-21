import { useRef, useState } from "react";
import { PASTA_CORES } from "../../hooks/usePastas";

export default function PastasSelector({ pastas, pastaIdsSelecionadas = [], onChange, onCriarPasta }) {
  const [novaNome, setNovaNome] = useState("");
  const [criando, setCriando] = useState(false);

  const togglePasta = (id) => {
    const jaEsta = pastaIdsSelecionadas.includes(id);
    onChange(jaEsta ? pastaIdsSelecionadas.filter((p) => p !== id) : [...pastaIdsSelecionadas, id]);
  };

  const handleCriar = () => {
    const nome = novaNome.trim();
    if (!nome) return;
    const id = onCriarPasta(nome);
    if (id) { onChange([...pastaIdsSelecionadas, id]); setNovaNome(""); setCriando(false); }
  };

  const corPreview = PASTA_CORES[pastas.length % PASTA_CORES.length];
  const selecionadas = pastas.filter((p) => pastaIdsSelecionadas.includes(p.id));

  return (
    <div className="ps-wrap">
      <span className="field-label">Pastas</span>
      {pastas.length > 0 ? (
        <div className="ps-lista">
          {pastas.map((pasta) => {
            const sel = pastaIdsSelecionadas.includes(pasta.id);
            return (
              <button key={pasta.id} type="button" className={`ps-pasta-btn ${sel ? "ps-pasta-btn--on" : ""}`}
                style={sel ? {background:pasta.cor,borderColor:pasta.cor,color:"#fff"} : {borderColor:pasta.cor+"88",color:pasta.cor}}
                onClick={() => togglePasta(pasta.id)}>
                <span className="ps-pasta-dot" style={{background: sel ? "rgba(255,255,255,0.7)" : pasta.cor}} />
                {pasta.nome}{sel && <IcoCheck />}
              </button>
            );
          })}
        </div>
      ) : <p className="ps-sem-pastas">Nenhuma pasta criada ainda.</p>}

      {selecionadas.length > 0 && (
        <div className="ps-selecionadas">
          <span className="ps-selecionadas-label">Em {selecionadas.length} pasta{selecionadas.length > 1 ? "s" : ""}:</span>
          {selecionadas.map((p) => (
            <span key={p.id} className="ps-badge" style={{background:p.cor+"22",color:p.cor,borderColor:p.cor+"55"}}>
              {p.nome}<button type="button" className="ps-badge-remove" onClick={() => togglePasta(p.id)}>×</button>
            </span>
          ))}
        </div>
      )}

      {criando ? (
        <div className="ps-nova-wrap">
          <span className="ps-nova-cor-preview" style={{background:corPreview}} />
          <input type="text" className="field-input ps-nova-input" placeholder="Nome da pasta…" value={novaNome} autoFocus onChange={(e) => setNovaNome(e.target.value)} onKeyDown={(e) => { if (e.key==="Enter"){e.preventDefault();handleCriar();} if (e.key==="Escape"){setCriando(false);setNovaNome("");} }} />
          <button type="button" className="ps-nova-confirmar" onClick={handleCriar} disabled={!novaNome.trim()}><IcoCheck /></button>
          <button type="button" className="ps-nova-cancelar" onClick={() => {setCriando(false);setNovaNome("");}}>×</button>
        </div>
      ) : (
        <button type="button" className="ps-criar-btn" onClick={() => setCriando(true)}><IcoMais />Nova pasta</button>
      )}
    </div>
  );
}

function IcoMais()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcoCheck() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
