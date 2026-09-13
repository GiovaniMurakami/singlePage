import { useEffect, useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const INSTAGRAM_URL = "https://www.instagram.com/_singlepage/";

function navClass({ isActive }, vertical = false) {
  return [
    "rounded-full px-3 py-2.5 transition",
    isActive ? "text-ink" : "text-ink-soft hover:text-ink",
    vertical ? "flex min-h-12 w-full items-center text-left text-base" : "",
  ].filter(Boolean).join(" ");
}

export function Shell({ children }) {
  const { autenticado, usuario, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuAberto) return undefined;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [menuAberto]);

  const fechar = () => setMenuAberto(false);

  const links = (
    <>
      <NavLink to="/criar" className={(props) => navClass(props, menuAberto)} onClick={fechar}>Editor</NavLink>
      <NavLink to="/precos" className={(props) => navClass(props, menuAberto)} onClick={fechar}>Preços</NavLink>
      {autenticado ? (
        <>
          <NavLink to="/app" className={(props) => navClass(props, menuAberto)} onClick={fechar}>Páginas</NavLink>
          <NavLink to="/conta" className={(props) => navClass(props, menuAberto)} onClick={fechar}>{usuario?.nome}</NavLink>
          <button
            type="button"
            onClick={() => { fechar(); logout(); }}
            className={menuAberto
              ? "flex min-h-12 w-full items-center rounded-full px-3 py-2.5 text-left text-base text-muted hover:text-ink"
              : "rounded-full px-3 py-2.5 text-muted hover:text-ink"}
          >
            Sair
          </button>
        </>
      ) : (
        <>
          <NavLink to="/entrar" className={(props) => navClass(props, menuAberto)} onClick={fechar}>Entrar</NavLink>
          <NavLink
            to="/criar"
            onClick={fechar}
            className={menuAberto
              ? "mt-1 flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-4 text-base font-medium text-white transition hover:bg-accent-strong"
              : "ml-1 rounded-full bg-accent px-4 py-2 text-white transition hover:bg-accent-strong hover:shadow-md"}
          >
            Começar
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper-2/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight" onClick={fechar}>Single</Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {links}
          </nav>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink md:hidden"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuAberto && (
          <nav
            id="menu-mobile"
            className="flex flex-col gap-1 border-t border-line px-5 py-3 md:hidden"
          >
            {links}
          </nav>
        )}
      </header>
      <main className="min-w-0 flex-1">{children}</main>
      <footer className="border-t border-line/80 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <p className="text-sm text-muted">Single — uma página, no ar hoje</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft transition hover:text-ink"
            aria-label="Instagram do Single"
          >
            <Instagram size={18} strokeWidth={1.75} />
            @_singlepage
          </a>
        </div>
      </footer>
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
