const ROTAS_RESERVADAS = new Set([
  "",
  "criar",
  "entrar",
  "cadastrar",
  "precos",
  "app",
  "conta",
  "p",
]);

/** Base pública do site (domínio atual). */
export function getSiteBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return "https://singlepage.com.br";
}

/** URL pública da página: https://dominio/{endereco} */
export function urlPublicaPagina(endereco) {
  const limpo = String(endereco || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return `${getSiteBaseUrl()}/${limpo}`;
}

export function enderecoReservado(endereco) {
  const limpo = String(endereco || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  return ROTAS_RESERVADAS.has(limpo);
}
