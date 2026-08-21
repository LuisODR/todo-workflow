import { useState, useEffect } from "react";
import { useTracker } from "../hooks/useTracker";

const STEPS = [
  "Criar a pasta do cliente + Anotar nome dele aqui",
  "Separar peças fisicamente as que foram vendidas",
  "Retirar as fotos das peças da pasta de fotos e passar para a pasta do cliente",
  "Anotar no Notas o endereço do cliente + salvar no contato cidade e Estado",
  "Anotar qual é o custo da peça na foto dela (dentro do envelope)",
  "Retirar as peças do ESTOQUE",
  "Retirar as peças do Site + Mercado Livre",
  "Criar o pedido cliente em documento de Excel/PDF + Colocar na pasta dele",
  "Trocar a etiqueta (whatsapp) - Parar aqui em Pedidos do wpp",
  "Colocar para imprimir o pedido do Cliente",
  "Ver se o cliente adquiriu seguro (ML [Mercado Livre] Não)",
  "Ver se alguma moeda precisa do Termo de Autenticidade, R$1.000,00",
  "Inserir valor recebido no Fluxo de Vendas",
  "Convidar o cliente para o Grupo Exclusivo - Msg Automatica (conviteZN)",
];
const ORIGENS = ["Site", "Xiaomi", "Samsung", "Numeração"];
const LS_KEY = "todo_workflow_feitos";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export default function FluxoVenda() {
  const { registrar } = useTracker();
  const [nomeCliente, setNomeCliente] = useState("");
  const [origem, setOrigem] = useState(ORIGENS[0]);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [checked, setChecked] = useState(Array(STEPS.length).fill(false));
  const [feitos, setFeitos] = useState([]);
  const [saveAnim, setSaveAnim] = useState(false);

  useEffect(() => {
    try { setFeitos(JSON.parse(localStorage.getItem(LS_KEY)) || []); } catch { setFeitos([]); }
  }, []);

  const progress = Math.round((checked.filter(Boolean).length / STEPS.length) * 100);

  const handleCheck = (index) => {
    if (index > 0 && !checked[index - 1] && !checked[index]) {
      if (!window.confirm("Você está pulando um passo, deseja continuar marcando mesmo assim?")) return;
    }
    setChecked((prev) => { const n = [...prev]; n[index] = !n[index]; return n; });
  };

  const handleSalvar = () => {
    if (!checked.every(Boolean)) {
      if (!window.confirm("Você está finalizando um cliente sem ter feito um passo, deseja prosseguir mesmo assim?")) return;
    }
    const origemLabel = origem === "Numeração" && numeroPedido.trim() ? `Pedido ${numeroPedido.trim()}` : origem;
    const entry = { id: Date.now(), nome: nomeCliente.trim() || "(sem nome)", origem: origemLabel, dataHora: new Date().toISOString() };
    const updated = [entry, ...feitos];
    setFeitos(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    registrar("fluxo_salvo", `Salvou cliente "${entry.nome}"`, { clienteNome: entry.nome, origem: entry.origem });
    setSaveAnim(true); setTimeout(() => setSaveAnim(false), 700);
    setNomeCliente(""); setOrigem(ORIGENS[0]); setNumeroPedido(""); setChecked(Array(STEPS.length).fill(false));
  };

  const handleLimparHistorico = () => {
    if (!window.confirm("Tem certeza que deseja limpar todo o histórico de clientes feitos?")) return;
    localStorage.removeItem(LS_KEY); setFeitos([]);
  };

  return (
    <div className="fluxo-root">
      <section className="card client-card">
        <h2 className="section-title"><span className="section-dot" />Dados do Cliente</h2>
        <div className="client-fields">
          <div className="field-group">
            <label className="field-label">Nome do Cliente</label>
            <input type="text" className="field-input" placeholder="Ex: João Silva" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
          </div>
          <div className="field-group field-group--select">
            <label className="field-label">Origem</label>
            <select className="field-select" value={origem} onChange={(e) => { setOrigem(e.target.value); setNumeroPedido(""); }}>
              {ORIGENS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          {origem === "Numeração" && (
            <div className="field-group field-group--pedido">
              <label className="field-label">Nº do Pedido</label>
              <input type="text" className="field-input field-input--pedido" placeholder="Ex: 10234" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} autoFocus />
            </div>
          )}
        </div>
      </section>

      <div className="progress-wrap">
        <div className="progress-label"><span>Progresso</span><span className="progress-pct">{progress}%</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <section className="card checklist-card">
        <h2 className="section-title"><span className="section-dot" />Checklist de Tarefas</h2>
        <ol className="step-list">
          {STEPS.map((step, i) => (
            <li key={i} className={`step-item ${checked[i] ? "step-item--done" : ""}`} onClick={() => handleCheck(i)}>
              <span className="step-number">{i + 1}</span>
              <div className={`step-checkbox ${checked[i] ? "step-checkbox--checked" : ""}`}>
                {checked[i] && <svg viewBox="0 0 12 10" fill="none" className="check-svg"><polyline points="1.5,5 4.5,8 10.5,1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
        <button className={`btn-save ${saveAnim ? "btn-save--pulse" : ""}`} onClick={handleSalvar}>
          <span className="btn-save-icon">💾</span>Salvar Cliente
        </button>
      </section>

      <section className="card feitos-card">
        <div className="feitos-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="section-dot" />Feitos{feitos.length > 0 && <span className="feitos-badge">{feitos.length}</span>}
          </h2>
          {feitos.length > 0 && <button className="btn-clear" onClick={handleLimparHistorico}>Limpar Histórico</button>}
        </div>
        {feitos.length === 0 ? (
          <div className="feitos-empty"><span className="feitos-empty-icon">📋</span><p>Nenhum cliente finalizado ainda.</p></div>
        ) : (
          <div className="feitos-list">
            {feitos.map((f) => (
              <div className="feito-card" key={f.id}>
                <div className="feito-avatar">{(f.nome[0] || "?").toUpperCase()}</div>
                <div className="feito-info">
                  <span className="feito-nome">{f.nome}</span>
                  <span className="feito-meta"><span className="feito-tag">{f.origem}</span>{formatDateTime(f.dataHora)}</span>
                </div>
                <div className="feito-check">✓</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
