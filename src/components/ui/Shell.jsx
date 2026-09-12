import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function navClass({ isActive }) {
  return `rounded-full px-3 py-2 transition ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`;
}

export function Shell({ children }) {
  const { autenticado, usuario, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper-2/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">Single</Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/criar" className={navClass}>Editor</NavLink>
            <NavLink to="/precos" className={navClass}>Preços</NavLink>
            {autenticado ? (
              <>
                <NavLink to="/app" className={navClass}>Páginas</NavLink>
                <NavLink to="/conta" className={navClass}>{usuario?.nome}</NavLink>
                <button type="button" onClick={logout} className="rounded-full px-3 py-2 text-muted hover:text-ink">Sair</button>
              </>
            ) : (
              <>
                <NavLink to="/entrar" className={navClass}>Entrar</NavLink>
                <NavLink to="/criar" className="ml-1 rounded-full bg-accent px-4 py-2 text-white transition hover:bg-accent-strong hover:shadow-md">
                  Começar
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function Protected({ children }) {
  const { autenticado, ready } = useAuth();
  if (!ready) return <div className="p-10 text-sm text-muted">Carregando…</div>;
  if (!autenticado) {
    window.location.replace("/entrar");
    return null;
  }
  return children;
}
