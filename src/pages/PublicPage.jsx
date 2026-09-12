import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarPaginaPublica } from "../services/backendApi";
import { PageRenderer } from "../editor/PageRenderer";
import { enderecoReservado } from "../constants/site";

export function PublicPage() {
  const { slug } = useParams();
  const invalido = !slug || enderecoReservado(slug);
  const consulta = useQuery({
    queryKey: ["publica", slug],
    queryFn: () => buscarPaginaPublica(slug),
    enabled: !invalido,
  });

  if (invalido) return <div className="p-10">Página não encontrada.</div>;
  if (consulta.isLoading) return <div className="p-10 text-sm text-muted">Carregando página…</div>;
  if (consulta.isError) return <div className="p-10">Página não encontrada.</div>;

  return <PageRenderer pagina={consulta.data} marca={consulta.data.marca} anuncios={consulta.data.anuncios} />;
}
