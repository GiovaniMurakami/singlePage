export const SITE_NOME = "Single";
export const SITE_DOMINIO_CANONICO = "https://singlepage.com.br";
export const SITE_DESCRICAO =
  "Crie e publique uma página bonita em minutos. Editor visual, modelos prontos, links, formulário e fotos — no ar hoje.";
export const SITE_OG_IMAGE = "";

const ROTAS_RESERVADAS = new Set([
  "",
  "criar",
  "entrar",
  "cadastrar",
  "precos",
  "app",
  "conta",
  "p",
  "verificar-email",
  "esqueci-senha",
  "redefinir-senha",
]);

/** Base pública do site (domínio atual). */
export function getSiteBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return SITE_DOMINIO_CANONICO;
}

/** URL canônica preferida para SEO (sempre produção quando possível). */
export function getCanonicalBaseUrl() {
  if (typeof window === "undefined") return SITE_DOMINIO_CANONICO;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return window.location.origin;
  if (host.includes("homolog") || host.includes("amplifyapp.com")) return window.location.origin;
  return SITE_DOMINIO_CANONICO;
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

/** Texto curto para meta description a partir dos blocos. */
export function descricaoSeoDaPagina(pagina) {
  const blocos = pagina?.blocos || [];
  for (const bloco of blocos) {
    const props = bloco?.props || {};
    const candidatos = [props.subtitulo, props.texto, props.titulo, props.rotulo];
    for (const valor of candidatos) {
      const limpo = String(valor || "").replace(/\s+/g, " ").trim();
      if (limpo.length >= 12) return limpo.slice(0, 160);
    }
    if (Array.isArray(props.itens)) {
      for (const item of props.itens) {
        const limpo = String(item?.rotulo || item?.texto || "").replace(/\s+/g, " ").trim();
        if (limpo.length >= 12) return limpo.slice(0, 160);
      }
    }
  }
  const titulo = String(pagina?.titulo || "").trim();
  return titulo ? `${titulo} — página publicada no Single.` : SITE_DESCRICAO;
}

/** Primeira imagem útil para Open Graph. */
export function imagemSeoDaPagina(pagina) {
  const blocos = pagina?.blocos || [];
  for (const bloco of blocos) {
    const props = bloco?.props || {};
    const url = props.fotoUrl || props.url || props.fundoImagem;
    if (url && /^https?:\/\//i.test(url) && !url.startsWith("data:")) return url;
    if (Array.isArray(props.itens)) {
      for (const item of props.itens) {
        const itemUrl = item?.fotoUrl || item?.url;
        if (itemUrl && /^https?:\/\//i.test(itemUrl) && !itemUrl.startsWith("data:")) return itemUrl;
      }
    }
  }
  return SITE_OG_IMAGE || "";
}
