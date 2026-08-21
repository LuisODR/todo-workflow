import { useState } from "react";
import { usePdfStorage } from "../../hooks/usePdfStorage";
import { gerarPdf } from "../../utils/gerarPdf";
import ImageUploadSlot from "./ImageUploadSlot";
import MoedaPdfCard from "./MoedaPdfCard";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function PageArrow() {
  return <div className="pdf-page-arrow" aria-hidden="true"><div className="pdf-page-arrow-line" /><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>;
}

function PageItem({ num, label, status, obrigatorio = false, hint }) {
  const map = { ok: { cls:"pdf-page-status--ok", text:"Pronto ✓" }, vazio: { cls:"pdf-page-status--vazio", text:"Sem imagem" }, opcional: { cls:"pdf-page-status--opcional", text:"Não adicionado" }, pendente: { cls:"pdf-page-status--pendente", text:"Pendente" } };
  const s = map[status] ?? map.opcional;
  return <li className="pdf-page-item"><span className="pdf-page-num">{num}</span><span className="pdf-page-label">{label}{obrigatorio && <span className="pdf-page-required">obrigatório</span>}{hint && <span className="pdf-page-hint">{hint}</span>}</span><span className={`pdf-page-status ${s.cls}`}>{s.text}</span></li>;
}

export default function PdfBuilder() {
  const { bannerPrincipal, subBanner, bannerFooter, moedas, updatedAt, setBanner, clearBanner, adicionarMoeda, atualizarMoeda, removerMoeda, moverMoeda, clearAll } = usePdfStorage();
  const [gerando, setGerando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erroGerar, setErroGerar] = useState("");
  const [previaOpen, setPreviaOpen] = useState(false);

  const totalPaginas = 2 + moedas.length + (bannerFooter ? 1 : 0);
  const tudoVazio = !bannerPrincipal && !subBanner && !bannerFooter && moedas.length === 0;

  const handleGerarPdf = async () => {
    setGerando(true); setProgresso(0); setErroGerar("");
    try { await gerarPdf({ bannerPrincipal, subBanner, moedas, bannerFooter, onProgress: setProgresso }); }
    catch (err) { console.error(err); setErroGerar("Erro ao gerar o PDF. Verifique as imagens e tente novamente."); }
    finally { setGerando(false); setProgresso(0); }
  };

  return (
    <div className="pdf-builder">
      <div className="pdf-builder-topbar">
        <div>
          <h2 className="pdf-builder-title"><span className="section-dot" style={{width:10,height:10}} />Montar estrutura do PDF</h2>
          <p className="pdf-builder-subtitle">Configure os banners e adicione as moedas para compor o catálogo.</p>
        </div>
        <div className="pdf-builder-actions-top">
          <button className="pdf-btn-outline" onClick={() => setPreviaOpen(v => !v)}><IcoPaginas />{previaOpen ? "Fechar prévia" : "Prévia de páginas"}</button>
          {!tudoVazio && <button className="pdf-btn-danger" onClick={() => { if (window.confirm("Limpar todos os banners e moedas?")) clearAll(); }}><IcoLixo /> Limpar tudo</button>}
        </div>
      </div>

      {updatedAt && <p className="pdf-last-saved"><IcoRelogio />Salvo automaticamente em {formatDate(updatedAt)}</p>}

      {previaOpen && (
        <div className="card pdf-preview-card">
          <h3 className="pdf-preview-title"><IcoPaginas />Sumário de páginas</h3>
          <ol className="pdf-page-list">
            <PageItem num={1} label="Banner Principal" status={bannerPrincipal ? "ok" : "vazio"} obrigatorio />
            <PageItem num={2} label="Sub-banner" status={subBanner ? "ok" : "vazio"} obrigatorio />
            {moedas.map((m, i) => <PageItem key={m.id} num={3+i} label={`Moeda ${i+1}${m.specs ? ` — ${m.specs.slice(0,40)}` : ""}`} status={(m.fotoFrente||m.fotoVerso) ? "ok" : "vazio"} />)}
            {moedas.length === 0 && <PageItem num="3…" label="Moedas" status="pendente" hint="Adicione abaixo" />}
            <PageItem num={totalPaginas} label="Banner Footer" status={bannerFooter ? "ok" : "opcional"} />
          </ol>
          <p className="pdf-page-total">Total: <strong>{totalPaginas} página{totalPaginas !== 1 ? "s" : ""}</strong></p>
        </div>
      )}

      <div className="card pdf-section-card">
        <div className="pdf-section-badge pdf-section-badge--blue">Página 1</div>
        <ImageUploadSlot label="Banner Principal" description="Capa do documento — ocupa a página inteira." pageTag="Pág. 1" value={bannerPrincipal} onUpload={(url) => setBanner("bannerPrincipal", url)} onClear={() => clearBanner("bannerPrincipal")} />
      </div>
      <PageArrow />
      <div className="card pdf-section-card">
        <div className="pdf-section-badge pdf-section-badge--indigo">Página 2</div>
        <ImageUploadSlot label="Sub-banner" description="Segunda página — apresentação ou header interno." pageTag="Pág. 2" value={subBanner} onUpload={(url) => setBanner("subBanner", url)} onClear={() => clearBanner("subBanner")} />
      </div>
      <PageArrow />

      <div className="pdf-moedas-section">
        <div className="pdf-moedas-section-header">
          <div className="pdf-moedas-section-title-row">
            <span className="pdf-section-label-tag pdf-section-label-tag--moeda">🪙 Moedas</span>
            <span className="pdf-moedas-count">{moedas.length === 0 ? "Nenhuma adicionada" : `${moedas.length} página${moedas.length !== 1 ? "s" : ""}`}</span>
          </div>
          <p className="pdf-moedas-section-hint">Cada moeda será uma página no PDF. Adicione quantas quiser.</p>
        </div>
        {moedas.length > 0 && (
          <div className="pdf-moedas-list">
            {moedas.map((m, i) => (<div key={m.id}><MoedaPdfCard moeda={m} index={i} total={moedas.length} onAtualizar={atualizarMoeda} onRemover={removerMoeda} onMover={moverMoeda} />{i < moedas.length - 1 && <PageArrow />}</div>))}
          </div>
        )}
        {moedas.length === 0 && <div className="pdf-moedas-empty"><span className="pdf-moedas-empty-icon">🪙</span><p className="pdf-moedas-empty-title">Nenhuma moeda adicionada</p><p className="pdf-moedas-empty-hint">Clique em "Adicionar Moeda" para inserir páginas de moedas.</p></div>}
        <button className="pdf-add-moeda-btn" onClick={() => { adicionarMoeda(); setTimeout(() => document.querySelector(".pdf-moedas-list")?.lastElementChild?.scrollIntoView({ behavior:"smooth", block:"start" }), 80); }}><IcoMais />Adicionar Moeda</button>
      </div>
      <PageArrow />

      <div className={`card pdf-section-card ${!bannerFooter ? "pdf-section-card--optional-empty" : ""}`}>
        <div className="pdf-section-badge pdf-section-badge--gray">Última página · Opcional</div>
        <ImageUploadSlot label="Banner Footer" description="Página final — rodapé ou imagem de encerramento." pageTag="Última pág." value={bannerFooter} onUpload={(url) => setBanner("bannerFooter", url)} onClear={() => clearBanner("bannerFooter")} optional />
      </div>

      <div className="pdf-generate-wrap">
        {gerando && <div className="pdf-progress-wrap"><div className="pdf-progress-label"><span>Gerando PDF…</span><span className="pdf-progress-pct">{progresso}%</span></div><div className="pdf-progress-track"><div className="pdf-progress-fill" style={{width:`${progresso}%`}} /></div></div>}
        {erroGerar && <p className="pdf-generate-error" role="alert"><IcoInfo />{erroGerar}</p>}
        <button className={`btn-save pdf-generate-btn ${gerando ? "pdf-generate-btn--loading" : ""}`} onClick={handleGerarPdf} disabled={gerando}>
          {gerando ? <><span className="pdf-generate-spinner" />Gerando…</> : <><IcoPdf />Gerar PDF · {totalPaginas} página{totalPaginas !== 1 ? "s" : ""}</>}
        </button>
        {!gerando && <p className="pdf-generate-note">Páginas sem imagem recebem placeholder em branco. O download inicia automaticamente.</p>}
      </div>
    </div>
  );
}

function IcoPaginas() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function IcoLixo()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
function IcoRelogio(){ return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IcoPdf()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>; }
function IcoMais()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcoInfo()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
