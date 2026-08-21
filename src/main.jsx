import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { AuthProvider }    from "./contexts/AuthContext";
import ProtectedRoute      from "./components/auth/ProtectedRoute";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    </AuthProvider>
  </StrictMode>
);
