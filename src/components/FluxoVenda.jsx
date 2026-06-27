import { useState } from "react";
import { FLUXO_VENDA_STEPS, FLUXO_VENDA_ORIGENS } from "../data/steps";
import { useLocalStorage, STORAGE_KEYS } from "../hooks/useLocalStorage";
import FeitosList from "./FeitosList";

function vazio() {
  return {
    id: null,
    nome: "",
    origem: FLUXO_VENDA_ORIGENS[0],
    numeroPedido: "",
    checked: Array(FLUXO_VENDA_STEPS.length).fill(false),
    dataHora: null,
  };
}

// Valida que os dados salvos no localStorage estão no formato atual
// (lista de clientes com id/checked). Protege contra formatos incompatíveis
// de versões antigas, que quebrariam a tela.
function isFormatoValido(dados) {
  if (!Array.isArray(dados)) return false;
  return dados.every(
    (item) =>
      item &&
      typeof item === "object" &&
      "id" in item &&
      Array.isArray(item.checked)
  );
}

export default function FluxoVenda() {
  const [feitos, setFeitos] = useLocalStorage(
    STORAGE_KEYS.FEITOS,
    [],
    isFormatoValido
  );
  const [form, setForm] = useState(vazio());
  const [saveAnim, setSaveAnim] = useState(false);

  const checked = form.checked;

  const handleCheck = (index) => {
    if (index > 0 && !checked[index - 1] && !checked[index]) {
      const ok = window.confirm(
        "Você está pulando um passo, deseja continuar marcando mesmo assim?"
      );
      if (!ok) return;
    }
    setForm((prev) => {
      const next = [...prev.checked];
      next[index] = !next[index];
      return { ...prev, checked: next };
    });
  };

  const handleSalvar = () => {
    const allDone = checked.every(Boolean);
    if (!allDone) {
      const ok = window.confirm(
        "Você está salvando um cliente sem ter feito todos os passos. O progresso atual ficará salvo e você poderá voltar para completar depois. Deseja prosseguir?"
      );
      if (!ok) return;
    }

    const origemLabel =
      form.origem === "Numeração" && form.numeroPedido.trim()
        ? `Pedido ${form.numeroPedido.trim()}`
        : form.origem;

    const entry = {
      id: form.id ?? Date.now(),
      nome: form.nome.trim() || "(sem nome)",
      origem: origemLabel,
      origemRaw: form.origem,
      numeroPedido: form.numeroPedido,
      checked,
      dataHora: new Date().toISOString(),
    };

    setFeitos((prev) => {
      const existe = prev.some((f) => f.id === entry.id);
      if (existe) {
        return prev.map((f) => (f.id === entry.id ? entry : f));
      }
      return [entry, ...prev];
    });

    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 700);

    setForm(vazio());
  };

  const handleEditar = (entry) => {
    setForm({
      id: entry.id,
      nome: entry.nome === "(sem nome)" ? "" : entry.nome,
      origem: entry.origemRaw || FLUXO_VENDA_ORIGENS[0],
      numeroPedido: entry.numeroPedido || "",
      checked: entry.checked || Array(FLUXO_VENDA_STEPS.length).fill(false),
      dataHora: entry.dataHora,
    });
  };

  const handleNovo = () => {
    setForm(vazio());
  };

  const handleRemover = (id) => {
    const ok = window.confirm("Remover este cliente da lista de Feitos?");
    if (!ok) return;
    setFeitos((prev) => prev.filter((f) => f.id !== id));
    if (form.id === id) setForm(vazio());
  };

  const handleLimparHistorico = () => {
    const ok = window.confirm(
      "Tem certeza que deseja limpar todo o histórico de clientes feitos?"
    );
    if (!ok) return;
    setFeitos([]);
    setForm(vazio());
  };

  const progress = Math.round(
    (checked.filter(Boolean).length / FLUXO_VENDA_STEPS.length) * 100
  );

  const editando = form.id !== null;

  return (
    <>
      {/* Client Info */}
      <section className="card client-card">
        <div className="fin-cliente-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="section-dot" />
            Dados do Cliente
          </h2>
          {editando && (
            <button className="btn-clear" onClick={handleNovo}>
              + Novo Cliente
            </button>
          )}
        </div>
        <div className="client-fields" style={{ marginTop: 18 }}>
          <div className="field-group">
            <label className="field-label">Nome do Cliente</label>
            <input
              type="text"
              className="field-input"
              placeholder="Ex: João Silva"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            />
          </div>
          <div className="field-group field-group--select">
            <label className="field-label">Origem</label>
            <select
              className="field-select"
              value={form.origem}
              onChange={(e) =>
                setForm((p) => ({ ...p, origem: e.target.value, numeroPedido: "" }))
              }
            >
              {FLUXO_VENDA_ORIGENS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          {form.origem === "Numeração" && (
            <div className="field-group field-group--pedido">
              <label className="field-label">Nº do Pedido</label>
              <input
                type="text"
                className="field-input field-input--pedido"
                placeholder="Ex: 10234"
                value={form.numeroPedido}
                onChange={(e) =>
                  setForm((p) => ({ ...p, numeroPedido: e.target.value }))
                }
                autoFocus
              />
            </div>
          )}
        </div>
      </section>

      {/* Progress */}
      <div className="progress-wrap">
        <div className="progress-label">
          <span>Progresso</span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <section className="card checklist-card">
        <h2 className="section-title">
          <span className="section-dot" />
          Checklist de Tarefas
        </h2>
        <ol className="step-list">
          {FLUXO_VENDA_STEPS.map((step, i) => (
            <li
              key={i}
              className={`step-item ${checked[i] ? "step-item--done" : ""}`}
              onClick={() => handleCheck(i)}
            >
              <span className="step-number">{i + 1}</span>
              <div
                className={`step-checkbox ${checked[i] ? "step-checkbox--checked" : ""}`}
              >
                {checked[i] && (
                  <svg viewBox="0 0 12 10" fill="none" className="check-svg">
                    <polyline
                      points="1.5,5 4.5,8 10.5,1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>

        <button
          className={`btn-save ${saveAnim ? "btn-save--pulse" : ""}`}
          onClick={handleSalvar}
        >
          <span className="btn-save-icon">💾</span>
          {editando ? "Atualizar Cliente" : "Salvar Cliente"}
        </button>
      </section>

      {/* Feitos */}
      <FeitosList
        feitos={feitos}
        getTotalSteps={() => FLUXO_VENDA_STEPS.length}
        getProgress={(f) => f.checked.filter(Boolean).length}
        editandoId={form.id}
        onEditar={handleEditar}
        onRemover={handleRemover}
        onLimparHistorico={handleLimparHistorico}
        renderTag={(f) => f.origem}
      />
    </>
  );
}
