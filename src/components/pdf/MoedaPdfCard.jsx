import ImageUploadSlot from "./ImageUploadSlot";

export default function MoedaPdfCard({ moeda, index, total, onAtualizar, onRemover, onMover }) {
  return (
    <div className="moeda-pdf-card card">
      <div className="moeda-pdf-header">
        <div className="moeda-pdf-header-left">
          <span className="moeda-pdf-page-badge">Página {index + 3}</span>
          <span className="moeda-pdf-label">Moeda {index + 1}</span>
        </div>
        <div className="moeda-pdf-header-actions">
          <button className="moeda-pdf-move-btn" onClick={() => onMover(moeda.id, -1)} disabled={index === 0} title="Mover para cima"><IcoUp /></button>
          <button className="moeda-pdf-move-btn" onClick={() => onMover(moeda.id, 1)} disabled={index === total - 1} title="Mover para baixo"><IcoDown /></button>
          <button className="moeda-pdf-remove-btn" onClick={() => { if (window.confirm(`Remover Moeda ${index + 1} do PDF?`)) onRemover(moeda.id); }} title="Remover"><IcoLixo /></button>
        </div>
      </div>
      <div className="moeda-pdf-fotos">
        <div className="moeda-pdf-foto-slot"><ImageUploadSlot label="Frente" value={moeda.fotoFrente} onUpload={(url) => onAtualizar(moeda.id, "fotoFrente", url)} onClear={() => onAtualizar(moeda.id, "fotoFrente", null)} compact /></div>
        <div className="moeda-pdf-foto-divider" />
        <div className="moeda-pdf-foto-slot"><ImageUploadSlot label="Verso" value={moeda.fotoVerso} onUpload={(url) => onAtualizar(moeda.id, "fotoVerso", url)} onClear={() => onAtualizar(moeda.id, "fotoVerso", null)} compact /></div>
      </div>
      <div className="moeda-pdf-specs">
        <label className="field-label" htmlFor={`specs-${moeda.id}`}>Especificações</label>
        <textarea id={`specs-${moeda.id}`} className="moeda-pdf-specs-textarea" placeholder="País, ano, denominação, grau de conservação, valor estimado…" rows={4} value={moeda.specs} onChange={(e) => onAtualizar(moeda.id, "specs", e.target.value)} />
        <p className="moeda-pdf-specs-hint">Este texto aparece abaixo das fotos no PDF.</p>
      </div>
    </div>
  );
}

function IcoUp()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>; }
function IcoDown() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function IcoLixo() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
