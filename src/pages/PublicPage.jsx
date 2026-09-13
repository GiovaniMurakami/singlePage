import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarPaginaPublica } from "../services/backendApi";
import { registrarEventoPagina } from "../services/analytics";
import { PageRenderer } from "../editor/PageRenderer";
import { Seo } from "../components/Seo";
import {
  descricaoSeoDaPagina,
  enderecoReservado,
  imagemSeoDaPagina,
  SITE_DOMINIO_CANONICO,
  SITE_NOME,
} from "../constants/site";

export function PublicPage() {
  const { slug } = useParams();
  const invalido = !slug || enderecoReservado(slug);
  const consulta = useQuery({
    queryKey: ["publica", slug],
    queryFn: () => buscarPaginaPublica(slug),
    enabled: !invalido,
  });
  const paginaPronta = consulta.data;

  useEffect(() => {
    if (!paginaPronta?.slug) return undefined;
    registrarEventoPagina(paginaPronta.slug, { tipo: "visita" });
    const clicou = (evento) => {
      const link = evento.target?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      registrarEventoPagina(paginaPronta.slug, { tipo: "clique", alvo: href.slice(0, 400) });
    };
    const enviou = () => registrarEventoPagina(paginaPronta.slug, { tipo: "formulario" });
    document.addEventListener("click", clicou, true);
    document.addEventListener("submit", enviou, true);
    return () => {
      document.removeEventListener("click", clicou, true);
      document.removeEventListener("submit", enviou, true);
    };
  }, [paginaPronta?.slug]);

  if (invalido) {
    return (
      <>
        <Seo title="Página não encontrada" path={`/${slug || ""}`} robots="noindex,nofollow" />
        <div className="p-10">Página não encontrada.</div>
      </>
    );
  }
  if (consulta.isLoading) {
    return (
      <>
        <Seo title="Carregando…" path={`/${slug}`} robots="noindex,follow" />
        <div className="p-10 text-sm text-muted">Carregando página…</div>
      </>
    );
  }
  if (consulta.isError) {
    return (
      <>
        <Seo title="Página não encontrada" path={`/${slug}`} robots="noindex,nofollow" />
        <div className="p-10">Página não encontrada.</div>
      </>
    );
  }

  const pagina = consulta.data;
  const descricao = descricaoSeoDaPagina(pagina);
  const imagem = imagemSeoDaPagina(pagina);
  const url = `${SITE_DOMINIO_CANONICO}/${pagina.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pagina.titulo,
    description: descricao,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NOME,
      url: SITE_DOMINIO_CANONICO,
    },
  };

  return (
    <>
      <Seo
        title={pagina.titulo}
        description={descricao}
        path={`/${pagina.slug}`}
        image={imagem || undefined}
        type="article"
        jsonLd={jsonLd}
      />
      <PageRenderer pagina={pagina} marca={pagina.marca} anuncios={pagina.anuncios} />
    </>
  );
}
