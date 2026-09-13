import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage, CadastroPage } from "../pages/AuthPages";
import { VerificarEmailPage } from "../pages/VerificarEmailPage";
import { EsqueciSenhaPage, RedefinirSenhaPage } from "../pages/SenhaPages";
import { DashboardPage } from "../pages/DashboardPage";
import { EditorPage } from "../pages/EditorPage";
import { PrecosPage } from "../pages/PrecosPage";
import { ContaPage } from "../pages/ContaPage";
import { PublicPage } from "../pages/PublicPage";
import { GuestEditorPage } from "../pages/GuestEditorPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";

function Protected({ children }) {
  const { autenticado, ready } = useAuth();
  if (!ready) return <div className="p-10 text-sm text-muted">Carregando…</div>;
  if (!autenticado) return <Navigate to="/entrar" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/criar" element={<GuestEditorPage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/cadastrar" element={<CadastroPage />} />
      <Route path="/verificar-email" element={<VerificarEmailPage />} />
      <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
      <Route path="/precos" element={<PrecosPage />} />
      <Route path="/p/:slug" element={<PublicPage />} />
      <Route path="/app" element={<Protected><DashboardPage /></Protected>} />
      <Route path="/app/:paginaId/painel" element={<Protected><AnalyticsPage /></Protected>} />
      <Route path="/app/:paginaId" element={<Protected><EditorPage /></Protected>} />
      <Route path="/conta" element={<Protected><ContaPage /></Protected>} />
      {/* Endereço público: singlepage.com.br/{nome-da-pagina} */}
      <Route path="/:slug" element={<PublicPage />} />
    </Routes>
  );
}
