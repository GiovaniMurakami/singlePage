import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { deveRedirecionarPathParaSubdominio, enderecoReservado, urlPublicaPagina } from "../constants/site";
import { PublicPage } from "./PublicPage";

export function RedirectPublica() {
  const { slug } = useParams();
  const redirecionar = Boolean(slug && !enderecoReservado(slug) && deveRedirecionarPathParaSubdominio());

  useEffect(() => {
    if (!redirecionar) return;
    window.location.replace(urlPublicaPagina(slug));
  }, [redirecionar, slug]);

  if (redirecionar) {
    return <div className="p-10 text-sm text-muted">Abrindo página…</div>;
  }

  return <PublicPage />;
}
