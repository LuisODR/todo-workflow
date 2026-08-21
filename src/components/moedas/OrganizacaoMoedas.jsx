import { useState } from "react";
import { useMoedas } from "../../hooks/useMoedas";
import { usePastas } from "../../hooks/usePastas";
import FormularioMoeda from "./FormularioMoeda";
import CardMoeda from "./CardMoeda";

export default function OrganizacaoMoedas() {
  const { moedas, criarMoeda, atualizarMoeda, removerMoeda } = useMoedas();
  const { pastas, criarPasta, renomearPasta, removerPasta }   = usePastas();

  const [filtroPastaId, setFiltroPastaId]  = useState(null);
  const [busca, setBusca]                  = useState("");
  const [confirmLimpar, setConfirmLimpar]  = useState(false);
  const [pastaRenomear, setPastaRenomear]  = useState(null);
  const [novaPastaNome, setNovaPastaNome]  = useState("");
  const [criandoPasta, setCriandoPasta]    = useState(false);

  const moedasNaPasta = filtroPastaId ? moedas.filter((m) => m.pastaIds?.includes(filtroPastaId)) : moedas;
  const moedasFiltradas = busca.trim() ? moedasNaPasta.filter((m) => m.specs.toLowerCase().includes(busca.trim().toLowerCase())) : moedasNaPasta;

  const handleCriarPasta = (nome) => { const id = criarPasta(nome); setNovaPastaNome(""); setCriandoPasta(false); return id; };

  const handleRenomearConfirm = () => {
    if (!pastaRenomear?.nome?.trim()) return;
    renomearPasta(pastaRenomear.id, pastaRenomear.nome); setPastaRenomear(null);
  };

  const handleRemoverPasta = (pasta) => {
    const qtd = moedas.filter((m) => m.pastaIds?.includes(pasta.id)).length;
    const msg = qtd > 0 ? `Remover a pasta "${pasta.nome}"?\n${qtd} moeda(s) serão desvinculadas.` : `Remover a pasta "${pasta.nome}"?`;
    if (!window.confirm(msg)) return;
    if (filtroPastaId === pasta.id) setFiltroPastaId(null);
    removerPasta(pasta.id);
  };

  const contarNaPasta = (id) => moedas.filter((m) => m.pastaIds?.includes(id)).length;

  return (
    <div className="om-layout">
      {/* Sidebar */}
      <aside className="om-sidebar">
        <div className="card om-sidebar-card">
          <h3 className="om-sidebar-titulo"><IcoPasta />Pastas</h3>
          <ul className="om-pastas-lista">
            <li className={`om-pasta-item ${filtroPastaId === null ? "om-pasta-item--ativa" : ""}`} onClick={() => setFiltroPastaId(null)} role="button" tabIndex={0}>
              <span className="om-pasta-cor" style={{background:"#64748b"}} /><span className="om-pasta-nome">Todas</span><span className="om-pasta-count">{moedas.length}</span>
            </li>
            {pastas.map((pasta) => {
              const ativa = filtroPastaId === pasta.id;
              return (
                <li key={pasta.id} className={`om-pasta-item ${ativa ? "om-pasta-item--ativa" : ""}`} onClick={() => setFiltroPastaId(ativa ? null : pasta.id)} role="button" tabIndex={0}>
                  <span className="om-pasta-cor" style={{background:pasta.cor}} />
                  {pastaRenomear?.id === pasta.id ? (
                    <input className="om-pasta-rename-input" value={pastaRenomear.nome} autoFocus onClick={(e)=>e.stopPropagation()} onChange={(e)=>setPastaRenomear({...pastaRenomear,nome:e.target.value})} onKeyDown={(e)=>{if(e.key==="Enter")handleRenomearConfirm();if(e.key==="Escape")setPastaRenomear(null);}} onBlur={handleRenomearConfirm} />
                  ) : <span className="om-pasta-nome">{pasta.nome}</span>}
                  <span className="om-pasta-count">{contarNaPasta(pasta.id)}</span>
                  <div className="om-pasta-acoes" onClick={(e)=>e.stopPropagation()}>
                    <button className="om-pasta-acao-btn" title="Renomear" onClick={()=>setPastaRenomear({id:pasta.id,nome:pasta.nome})}><IcoEditar /></button>
                    <button className="om-pasta-acao-btn om-pasta-acao-btn--danger" title="Remover" onClick={()=>handleRemoverPasta(pasta)}><IcoLixo /></button>
                  </div>
                </li>
              );
            })}
          </ul>
          {criandoPasta ? (
            <div className="om-pasta-nova-form">
              <input type="text" className="field-input om-pasta-nova-input" placeholder="Nome da pasta…" value={novaPastaNome} autoFocus onChange={(e)=>setNovaPastaNome(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();handleCriarPasta(novaPastaNome);}if(e.key==="Escape"){setCriandoPasta(false);setNovaPastaNome("");}}} />
              <div className="om-pasta-nova-acoes">
                <button className="om-pasta-nova-ok" onClick={()=>handleCriarPasta(novaPastaNome)} disabled={!novaPastaNome.trim()}><IcoCheck />Criar</button>
                <button className="om-pasta-nova-cancel" onClick={()=>{setCriandoPasta(false);setNovaPastaNome("");}}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button className="om-pasta-criar-btn" onClick={()=>setCriandoPasta(true)}><IcoMais />Nova pasta</button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="om-main">
        <section className="card om-form-card">
          <FormularioMoeda pastas={pastas} onCriarPasta={handleCriarPasta} onSalvar={(campos) => criarMoeda(campos)} />
        </section>

        <section className="om-catalogo">
          <div className="om-catalogo-header">
            <h2 className="section-title" style={{marginBottom:0}}>
              <span className="section-dot" />
              {filtroPastaId ? pastas.find((p)=>p.id===filtroPastaId)?.nome ?? "Pasta" : "Catálogo"}
              {moedasNaPasta.length > 0 && <span className="feitos-badge">{moedasNaPasta.length}</span>}
            </h2>
            {moedas.length > 0 && (
              <div className="om-busca-wrap">
                <IcoSearch />
                <input type="text" className="om-busca-input" placeholder="Buscar nas especificações…" value={busca} onChange={(e)=>setBusca(e.target.value)} />
                {busca && <button className="om-busca-clear" onClick={()=>setBusca("")}>×</button>}
              </div>
            )}
          </div>

          {moedas.length === 0 && <div className="card om-vazio"><span className="om-vazio-ico">🪙</span><p className="om-vazio-titulo">Nenhuma moeda cadastrada</p><p className="om-vazio-hint">Preencha o formulário acima para começar.</p></div>}
          {moedas.length > 0 && moedasNaPasta.length === 0 && <div className="card om-vazio"><span className="om-vazio-ico">📂</span><p className="om-vazio-titulo">Pasta vazia</p><p className="om-vazio-hint">Edite uma moeda e selecione esta pasta.</p></div>}
          {moedasNaPasta.length > 0 && moedasFiltradas.length === 0 && <div className="card om-vazio"><span className="om-vazio-ico">🔍</span><p className="om-vazio-titulo">Nenhum resultado</p><p className="om-vazio-hint">Nenhuma moeda contém "<strong>{busca}</strong>".</p></div>}

          {moedasFiltradas.length > 0 && (
            <div className="om-grid">
              {moedasFiltradas.map((m) => <CardMoeda key={m.id} moeda={m} pastas={pastas} onAtualizar={atualizarMoeda} onRemover={removerMoeda} onCriarPasta={handleCriarPasta} />)}
            </div>
          )}

          {moedas.length > 0 && !filtroPastaId && (
            <div className="om-rodape">
              {confirmLimpar ? (
                <div className="om-confirm-limpar">
                  <span>Remover todas as {moedas.length} moedas? Irreversível.</span>
                  <div className="om-confirm-acoes">
                    <button className="btn-clear" onClick={()=>{moedas.forEach((m)=>removerMoeda(m.id));setConfirmLimpar(false);}}>Sim, limpar tudo</button>
                    <button className="om-confirm-nao" onClick={()=>setConfirmLimpar(false)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button className="btn-clear om-btn-limpar" onClick={()=>setConfirmLimpar(true)}><IcoLixo />Limpar catálogo</button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function IcoPasta()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>; }
function IcoMais()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcoEditar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IcoLixo()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
function IcoCheck()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function IcoSearch() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,color:"var(--text-light)"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
