import { getApiBaseUrl } from "./httpClient";

const VISITANTE_KEY = "single.vid";

export function idVisitante() {
  try {
    let id = window.localStorage.getItem(VISITANTE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(VISITANTE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function hostOrigem() {
  try {
    return document.referrer ? new URL(document.referrer).host : "";
  } catch {
    return "";
  }
}

export function registrarEventoPagina(slug, dados) {
  if (!slug || typeof navigator !== "undefined" && navigator.webdriver) return;
  const payload = JSON.stringify({
    ...dados,
    visitanteId: idVisitante(),
    origem: hostOrigem(),
    hora: new Date().getHours(),
  });
  const url = `${getApiBaseUrl()}/p/${encodeURIComponent(slug)}/evento`;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    /* cai no fetch */
  }
  fetch(url, {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}
