import { createContext, useCallback, useContext, useEffect, useState } from "react";

const LS_USERS   = "tw_users";
const LS_SESSION = "tw_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

// ✏️  Mude "role" para testar os dois perfis:
//     "superuser"  → vê Dashboard Admin completo
//     "usuario"    → só vê o Workflow
const SEED_ACCOUNT = {
  id: "seed-001", email: "moeda@gmail.com", password: "localdev123",
  name: "Moeda ZN", role: "superuser", createdAt: "2025-01-01T00:00:00.000Z", seeded: true,
};

function lsGet(key, fallback = null) {
  try { const r = localStorage.getItem(key); return r === null ? fallback : JSON.parse(r); }
  catch { return fallback; }
}
function lsSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function lsDel(key) { try { localStorage.removeItem(key); } catch {} }

function seedHardcodedAccount() {
  const users = lsGet(LS_USERS, []);
  const idx = users.findIndex((u) => u.id === SEED_ACCOUNT.id);
  if (idx === -1) { lsSet(LS_USERS, [SEED_ACCOUNT, ...users]); }
  else { const u = [...users]; u[idx] = { ...users[idx], ...SEED_ACCOUNT }; lsSet(LS_USERS, u); }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  seedHardcodedAccount();

  const [user, setUser] = useState(() => {
    const session = lsGet(LS_SESSION);
    if (!session) return null;
    if (Date.now() > session.expiresAt) { lsDel(LS_SESSION); return null; }
    return lsGet(LS_USERS, []).find((u) => u.id === session.userId) ?? null;
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const session = lsGet(LS_SESSION);
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(() => logout(), remaining);
    return () => clearTimeout(timer);
  }, [user]);

  const login = useCallback((email, password) => {
    setLoading(true); setLoginError("");
    setTimeout(() => {
      const found = lsGet(LS_USERS, []).find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!found) { setLoginError("E-mail ou senha incorretos."); setLoading(false); return; }
      lsSet(LS_SESSION, { userId: found.id, expiresAt: Date.now() + SESSION_TTL_MS });
      setUser(found); setLoading(false);
    }, 350);
  }, []);

  const logout = useCallback(() => { lsDel(LS_SESSION); setUser(null); setLoginError(""); }, []);

  const isSuperUser = user?.role === "superuser";
  const isUsuario   = user?.role === "usuario";

  return (
    <AuthContext.Provider value={{ user, isSuperUser, isUsuario, login, logout, loginError, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
