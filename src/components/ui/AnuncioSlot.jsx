import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ADSENSE_CLIENT, ADSENSE_SLOT, ANUNCIOS_PROPRIOS } from "../../constants/anuncios";

function AnuncioCasa({ campanha }) {
  const interno = campanha.url.startsWith("/");
  const corpo = (
    <>
      <p className="anuncio-casa-rotulo">{campanha.rotulo}</p>
      <p className="anuncio-casa-titulo">{campanha.titulo}</p>
      <p className="anuncio-casa-texto">{campanha.texto}</p>
      <span className="anuncio-casa-cta">{campanha.cta}</span>
    </>
  );
  if (interno) {
    return <Link to={campanha.url} className="anuncio-casa">{corpo}</Link>;
  }
  return <a href={campanha.url} target="_blank" rel="noreferrer sponsored" className="anuncio-casa">{corpo}</a>;
}

export function AnuncioSlot({ posicao = "esquerda" }) {
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
    <aside className={`anuncio-trilho anuncio-trilho-${posicao}`} aria-label="Publicidade">
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
