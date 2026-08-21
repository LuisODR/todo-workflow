import { useState } from "react";
import ImageUpload from "./ImageUpload";
import PastasSelector from "./PastasSelector";

const INICIAL = { fotoFrente: null, fotoVerso: null, specs: "", pastaIds: [] };

export default function FormularioMoeda({ moedaInicial = null, pastas = [], onSalvar, onCancelar, onCriarPasta }) {
  const modoEdicao = !!moedaInicial;
  const [campos, setCampos] = useState(modoEdicao ? { fotoFrente: moedaInicial.fotoFrente, fotoVerso: moedaInicial.fotoVerso, specs: moedaInicial.specs, pastaIds: Array.isArray(moedaInicial.pastaIds) ? moedaInicial.pastaIds : [] } : { ...INICIAL });
  const set = (campo, valor) => setCampos((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = (e) => { e.preventDefault(); onSalvar(campos); if (!modoEdicao) setCampos({ ...INICIAL }); };

  return (
    <form className="form-moeda" onSubmit={handleSubmit} noValidate>
      <div className="form-moeda-titulo"><span className="section-dot" />{modoEdicao ? "Editar moeda" : "Cadastrar nova moeda"}</div>
      <div className="form-moeda-fotos">
        <ImageUpload label="Frente" value={campos.fotoFrente} onChange={(v) => set("fotoFrente", v)} />
        <div className="form-moeda-fotos-divisor" />
        <ImageUpload label="Verso" value={campos.fotoVerso} onChange={(v) => set("fotoVerso", v)} />
      </div>
      <div className="form-moeda-specs">
        <label className="field-label" htmlFor="moeda-specs">Especificações</label>
        <textarea id="moeda-specs" className="form-moeda-textarea" placeholder="País, ano, denominação, grau de conservação, valor estimado…" rows={4} value={campos.specs} onChange={(e) => set("specs", e.target.value)} />
      </div>
      <PastasSelector pastas={pastas} pastaIdsSelecionadas={campos.pastaIds} onChange={(ids) => set("pastaIds", ids)} onCriarPasta={onCriarPasta} />
      <div className="form-moeda-actions">
        {modoEdicao && <button type="button" className="form-moeda-btn-cancelar" onClick={onCancelar}>Cancelar</button>}
        <button type="submit" className="btn-save form-moeda-btn-salvar">{modoEdicao ? <><IcoCheck />Salvar Alterações</> : <><IcoMais />Cadastrar Moeda</>}</button>
      </div>
    </form>
  );
}

function IcoMais()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcoCheck() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
