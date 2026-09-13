import { useState } from "react";
import { Link } from "react-router-dom";

export const CHAVE_AVISO_LGPD = "single.lgpd-aviso";
export const EVENTO_AVISO_LGPD = "single-lgpd";

export function avisoLgpdPendente() {
  try {
    return window.localStorage.getItem(CHAVE_AVISO_LGPD) !== "1";
  } catch {
    return false;
  }
}

export function AvisoLgpd() {
  const [visivel, setVisivel] = useState(avisoLgpdPendente);

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper-2/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm leading-6 text-ink-soft">
          Usamos cookies necessários para a conta. Nas páginas Free publicadas podem aparecer anúncios do Google.{" "}
          <Link to="/privacidade" className="text-ink underline">Política de Privacidade</Link>
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm text-paper"
          onClick={() => {
            window.localStorage.setItem(CHAVE_AVISO_LGPD, "1");
            window.dispatchEvent(new Event(EVENTO_AVISO_LGPD));
            setVisivel(false);
          }}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
