export const SITE_NOME = "Single";
export const SITE_DOMINIO_CANONICO = "https://singlepage.com.br";
export const SITE_HOST_APEX = "singlepage.com.br";
export const SITE_DESCRICAO =
  "Crie e publique uma página bonita em minutos. Editor visual, modelos prontos, links, formulário e fotos — no ar hoje.";
export const SITE_OG_IMAGE = "";
export const VERSAO_TERMOS = "2026-09-13";
export const DATA_TERMOS = "13 de setembro de 2026";

const ENDERECOS_RESERVADOS = new Set([
  "",
  "www",
  "app",
  "api",
  "mail",
  "ftp",
  "cdn",
  "static",
  "assets",
  "admin",
  "criar",
  "entrar",
  "cadastrar",
  "precos",
  "comunidade",
  "conta",
  "termos",
  "privacidade",
  "lgpd",
  "cookies",
  "legal",
  "p",
  "verificar-email",
  "esqueci-senha",
  "redefinir-senha",
  "homolog",
  "staging",
  "beta",
  "status",
  "docs",
  "blog",
  "help",
  "suporte",
  "dashboard",
  "editor",
  "preview",
  "smtp",
  "imap",
  "ns",
  "origin",
]);

export function limparEndereco(endereco) {
  return String(endereco || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

export function enderecoReservado(endereco) {
  return ENDERECOS_RESERVADOS.has(limparEndereco(endereco));
}

export function hostAtual() {
  if (typeof window === "undefined") return "";
  return window.location.hostname.toLowerCase();
}

export function ehHostLocal(host = hostAtual()) {
  return host === "localhost" || host === "127.0.0.1";
}

export function ehHostPreview(host = hostAtual()) {
  return host.includes("amplifyapp.com");
}

export function ehHostHomolog(host = hostAtual()) {
  return host === `homolog.${SITE_HOST_APEX}` || host.endsWith(`.homolog.${SITE_HOST_APEX}`);
}

export function ehHostApp(host = hostAtual()) {
  return (
    ehHostLocal(host)
    || ehHostPreview(host)
    || host === SITE_HOST_APEX
    || host === `www.${SITE_HOST_APEX}`
    || host === `homolog.${SITE_HOST_APEX}`
  );
}

/** Slug quando a página está em nome.singlepage.com.br */
export function slugDoHost(host = hostAtual()) {
  if (!host || ehHostApp(host)) return "";
  if (host.endsWith(`.homolog.${SITE_HOST_APEX}`)) {
    const sub = host.slice(0, -`.homolog.${SITE_HOST_APEX}`.length);
    if (sub && !sub.includes(".") && !enderecoReservado(sub)) return sub;
    return "";
  }
  if (host.endsWith(`.${SITE_HOST_APEX}`)) {
    const sub = host.slice(0, -`.${SITE_HOST_APEX}`.length);
    if (sub && !sub.includes(".") && !enderecoReservado(sub)) return sub;
  }
  return "";
}

/** Produção usa subdomínio; local, preview e homolog continuam no path. */
export function usaSubdominioPublico(host = hostAtual()) {
  if (!host) return true;
  if (ehHostLocal(host) || ehHostPreview(host) || ehHostHomolog(host)) return false;
  return host === SITE_HOST_APEX || host === `www.${SITE_HOST_APEX}` || Boolean(slugDoHost(host));
}

export function deveRedirecionarPathParaSubdominio(host = hostAtual()) {
  if (import.meta.env.VITE_PAGINA_SUBDOMINIO !== "1") return false;
  return usaSubdominioPublico(host) && !slugDoHost(host);
}

/** Base pública do site (domínio atual do app, não o da página). */
export function getSiteBaseUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    if (slugDoHost()) return SITE_DOMINIO_CANONICO;
    return window.location.origin.replace(/\/+$/, "");
  }
  return SITE_DOMINIO_CANONICO;
}

/** URL canônica preferida para SEO (sempre produção quando possível). */
export function getCanonicalBaseUrl() {
  if (typeof window === "undefined") return SITE_DOMINIO_CANONICO;
  const host = window.location.hostname;
  if (ehHostLocal(host) || ehHostPreview(host) || ehHostHomolog(host)) return window.location.origin;
  return SITE_DOMINIO_CANONICO;
}

/** URL pública da página: https://endereco.singlepage.com.br */
export function urlPublicaPagina(endereco, host = hostAtual()) {
  const limpo = limparEndereco(endereco);
  if (!usaSubdominioPublico(host)) {
    const origem = typeof window !== "undefined" && window.location?.origin
      ? window.location.origin.replace(/\/+$/, "")
      : getCanonicalBaseUrl();
    return `${origem}/${limpo}`;
  }
  return `https://${limpo}.${SITE_HOST_APEX}`;
}

export function rotuloUrlPublica(endereco) {
  return urlPublicaPagina(endereco).replace(/^https?:\/\//, "");
}

export function partesEnderecoPublico(endereco, host = hostAtual()) {
  const slug = limparEndereco(endereco);
  if (!usaSubdominioPublico(host)) {
    const base = getSiteBaseUrl().replace(/^https?:\/\//, "");
    return { prefixo: `${base}/`, slug, sufixo: "" };
  }
  return { prefixo: "", slug, sufixo: `.${SITE_HOST_APEX}` };
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
