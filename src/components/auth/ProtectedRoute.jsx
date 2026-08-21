import { useAuth } from "../../contexts/AuthContext";
import LoginPage from "./LoginPage";

export default function ProtectedRoute({ children, requireSuperUser = false }) {
  const { user, isSuperUser } = useAuth();
  if (!user) return <LoginPage />;
  if (requireSuperUser && !isSuperUser) return <AcessoNegado />;
  return children;
}

function AcessoNegado() {
  return (
    <div className="acesso-negado-wrap">
      <div className="acesso-negado-icon">🔒</div>
      <h2 className="acesso-negado-title">Acesso restrito</h2>
      <p className="acesso-negado-text">Essa área é exclusiva para <strong>Super Usuários</strong>.</p>
    </div>
  );
}
