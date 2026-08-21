import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login, loginError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); login(email, password); };

  return (
    <div className="login-root">
      <div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" />
      <div className="login-box">
        <div className="login-logo-wrap">
          <div className="login-logo">✓</div>
          <div><h1 className="login-title">Fluxo de Venda</h1><p className="login-subtitle">Faça login para continuar</p></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="field-label" htmlFor="login-email">E-mail</label>
            <input id="login-email" type="email" className={`field-input ${loginError ? "field-input--error" : ""}`} placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required />
          </div>
          <div className="login-field">
            <label className="field-label" htmlFor="login-password">Senha</label>
            <div className="login-pass-wrap">
              <input id="login-password" type={showPass ? "text" : "password"} className={`field-input ${loginError ? "field-input--error" : ""}`} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              <button type="button" className="login-toggle-pass" onClick={() => setShowPass((v) => !v)}>
                {showPass ? <IcoOlhoFechado /> : <IcoOlho />}
              </button>
            </div>
          </div>
          {loginError && <p className="login-error" role="alert"><IcoAlerta /> {loginError}</p>}
          <button type="submit" className="btn-save login-btn" disabled={loading || !email || !password}>
            {loading ? <span className="login-spinner" /> : <> Entrar</>}
          </button>
        </form>
        <div className="login-hint">
          <span className="login-hint-label">Conta de teste</span>
          <code className="login-hint-code">moeda@gmail.com / localdev123</code>
        </div>
      </div>
    </div>
  );
}

function IcoOlho() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function IcoOlhoFechado() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>; }
function IcoAlerta() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
