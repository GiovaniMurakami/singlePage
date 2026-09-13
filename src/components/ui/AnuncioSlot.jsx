import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ADSENSE_CLIENT, ADSENSE_SLOT, ANUNCIOS_PROPRIOS } from "../../constants/anuncios";

function AnuncioCasa({ campanha }) {
  const interno = campanha.url.startsWith("/");
  const classe = "block rounded-2xl bg-black/5 px-4 py-4 text-left no-underline";
  const corpo = (
    <>
      <p className="text-[10px] uppercase tracking-[0.18em] opacity-50">{campanha.rotulo}</p>
      <p className="mt-1 text-sm font-medium">{campanha.titulo}</p>
      <p className="mt-1 text-xs leading-5 opacity-70">{campanha.texto}</p>
      <span className="mt-3 inline-flex rounded-full bg-black/80 px-3 py-1 text-xs text-white">{campanha.cta}</span>
    </>
  );
  if (interno) {
    return <Link to={campanha.url} className={classe}>{corpo}</Link>;
  }
  return <a href={campanha.url} target="_blank" rel="noreferrer sponsored" className={classe}>{corpo}</a>;
}

export function AnuncioSlot({ posicao = "rodape" }) {
  const adsense = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT);

  useEffect(() => {
    if (!adsense) return undefined;
    const id = "single-adsense";
    if (!document.getElementById(id) && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script");
      script.id = id;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    const timer = window.setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        /* slot ainda não hidratou */
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [adsense, posicao]);

  return (
    <aside className="my-8" aria-label="Publicidade">
      {adsense ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <AnuncioCasa campanha={ANUNCIOS_PROPRIOS[0]} />
      )}
    </aside>
  );
}
