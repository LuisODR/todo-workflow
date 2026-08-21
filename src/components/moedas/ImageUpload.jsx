import { useCallback, useRef, useState } from "react";

export default function ImageUpload({ label, value, onChange, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [erro, setErro] = useState("");

  const processar = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErro("Apenas imagens (PNG, JPG, WEBP)."); return; }
    const mb = file.size / (1024 * 1024);
    if (mb > 10) { setErro(`Máx. 10 MB (atual: ${mb.toFixed(1)} MB).`); return; }
    setErro("");
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.onerror = () => setErro("Erro ao ler o arquivo.");
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <div className="iu-wrap">
      <span className="iu-label">{label}</span>
      {value ? (
        <div className="iu-preview-wrap">
          <img src={value} alt={label} className={`iu-preview ${compact ? "iu-preview--compact" : ""}`} />
          <div className="iu-overlay">
            <button type="button" className="iu-btn iu-btn--trocar" onClick={() => inputRef.current?.click()}><IcoTrocar />Trocar</button>
            <button type="button" className="iu-btn iu-btn--remover" onClick={() => { setErro(""); onChange(null); }}><IcoLixo />Remover</button>
          </div>
        </div>
      ) : (
        <div className={["iu-dropzone", compact?"iu-dropzone--compact":"", dragging?"iu-dropzone--dragging":""].filter(Boolean).join(" ")}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e)=>{e.preventDefault();setDragging(true);}} onDragLeave={(e)=>{e.preventDefault();setDragging(false);}}
          onDrop={(e)=>{e.preventDefault();setDragging(false);processar(e.dataTransfer.files?.[0]);}}
          role="button" tabIndex={0} onKeyDown={(e)=>e.key==="Enter"&&inputRef.current?.click()}>
          <div className="iu-ico"><IcoUpload /></div>
          <p className="iu-dica">{dragging ? "Solte aqui" : "Clique ou arraste"}</p>
          {!compact && <p className="iu-hint">PNG, JPG, WEBP · máx. 10 MB</p>}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>{processar(e.target.files?.[0]);e.target.value="";}} />
      {erro && <p className="iu-erro" role="alert"><IcoAlerta />{erro}</p>}
    </div>
  );
}

function IcoUpload() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>; }
function IcoTrocar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>; }
function IcoLixo()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
function IcoAlerta() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4,verticalAlign:"middle"}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
