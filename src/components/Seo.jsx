import { useEffect } from "react";
import {
  SITE_DESCRICAO,
  SITE_NOME,
  SITE_OG_IMAGE,
  getCanonicalBaseUrl,
} from "../constants/site";

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Atualiza title/meta/canonical/JSON-LD da rota atual (SPA).
 * Páginas privadas devem usar robots="noindex,nofollow".
 */
export function Seo({
  title,
  description = SITE_DESCRICAO,
  path = "/",
  image = SITE_OG_IMAGE,
  robots = "index,follow",
  type = "website",
  jsonLd,
}) {
  useEffect(() => {
    const base = getCanonicalBaseUrl();
    const caminho = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const tituloCheio = title?.includes(SITE_NOME) ? title : title ? `${title} · ${SITE_NOME}` : `${SITE_NOME} — uma página, no ar hoje`;

    document.title = tituloCheio;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "googlebot", robots);
    upsertLink("canonical", caminho);

    upsertMeta("property", "og:site_name", SITE_NOME);
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", tituloCheio);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", caminho);
    if (image) upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", tituloCheio);
    upsertMeta("name", "twitter:description", description);
    if (image) upsertMeta("name", "twitter:image", image);

    upsertJsonLd("seo-jsonld", jsonLd);

    return () => {
      upsertJsonLd("seo-jsonld", null);
    };
  }, [title, description, path, image, robots, type, jsonLd]);

  return null;
}
