/** Miniatura simples da página publicada (capa + título + CTA). */
export function MiniaturaPagina({ item }) {
  const fundo = item.temaFundo || "#f6f1ea";
  const destaque = item.temaDestaque || "#c2410c";
  const texto = item.temaTexto || "#1c1917";
  const titulo = item.previewTitulo || item.titulo || "Página";
  const sub = item.previewSubtitulo || "";
  const cta = item.previewCta || "Ver mais";

  return (
    <div
      className="comunidade-mini"
      style={{ background: fundo, color: texto }}
      aria-hidden="true"
    >
      <div className="comunidade-mini-folha">
        {item.capaUrl ? (
          <span className="comunidade-mini-foto" style={{ backgroundImage: `url(${item.capaUrl})` }} />
        ) : (
          <span className="comunidade-mini-foto comunidade-mini-foto-vazia" style={{ background: destaque }} />
        )}
        <span className="comunidade-mini-titulo">{titulo}</span>
        {sub ? <span className="comunidade-mini-sub">{sub}</span> : null}
        <span className="comunidade-mini-cta" style={{ background: destaque }}>
          {cta}
        </span>
      </div>
    </div>
  );
}
