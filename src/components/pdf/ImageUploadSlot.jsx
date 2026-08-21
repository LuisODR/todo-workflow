import { useCallback, useRef, useState } from "react";

export default function ImageUploadSlot({ label, description, pageTag, value = null, onUpload, onClear, optional = false, accept = "image/*", maxSizeMB = 10, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Apenas imagens (PNG, JPG, WEBP)."); return; }
    const mb = file.size / (1024 * 1024);
    if (mb > maxSizeMB) { setError(`Máx. ${maxSizeMB} MB (atual: ${mb.toFixed(1)} MB).`); return; }
    setError(""); setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => { onUpload(e.target.result); setLoading(false); };
    reader.onerror = () => { setError("Erro ao ler o arquivo."); setLoading(false); };
    reader.readAsDataURL(file);
  }, [onUpload, maxSizeMB]);

  return (
    <div className="img-slot">
      {(label || description) && (
        <div className="img-slot-header">
          {label && <div className="img-slot-title-row"><h3 className={`img-slot-title ${compact ? "img-slot-title--compact" : ""}`}>{label}</h3>{pageTag && <span className="img-slot-page-tag">{pageTag}</span>}{optional && <span className="img-slot-optional-badge">Opcional</span>}</div>}
          {description && <p className="img-slot-description">{description}</p>}
        </div>
      )}
      {value ? (
        <div className="img-slot-preview-wrap">
          <img src={value} alt={label ?? "imagem"} className={`img-slot-preview ${compact ? "img-slot-preview--compact" : ""}`} />
          <div className="img-slot-preview-overlay">
            <button className="img-slot-change-btn" onClick={() => inputRef.current?.click()}><IcoTrocar /> Trocar</button>
            <button className="img-slot-remove-btn" onClick={onClear}><IcoLixo /> Remover</button>
          </div>
        </div>
      ) : (
        <div className={["img-slot-dropzone", compact ? "img-slot-dropzone--compact" : "", dragging ? "img-slot-dropzone--dragging" : "", loading ? "img-slot-dropzone--loading" : ""].filter(Boolean).join(" ")}
          onClick={() => !value && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]); }}
          role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}>
          {loading ? <span className="img-slot-spinner" /> : (<>
            <div className="img-slot-icon">{dragging ? <IcoImg /> : <IcoUpload />}</div>
            {compact ? <p className="img-slot-drop-label img-slot-drop-label--compact">{dragging ? "Solte" : "Carregar"}</p>
              : <><p className="img-slot-drop-label">{dragging ? "Solte aqui" : "Clique ou arraste uma imagem"}</p><p className="img-slot-drop-hint">PNG, JPG, WEBP · máx. {maxSizeMB} MB</p></>}
          </>)}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => { processFile(e.target.files?.[0]); e.target.value = ""; }} />
      {error && <p className="img-slot-error" role="alert"><IcoAlerta />{error}</p>}
    </div>
  );
}

function IcoUpload() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>; }
function IcoImg()    { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function IcoTrocar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>; }
function IcoLixo()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>; }
function IcoAlerta() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4,verticalAlign:"middle"}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
