export const RASCUNHO_KEY = "single.rascunho";

export function lerRascunho() {
  try {
    return JSON.parse(window.localStorage.getItem(RASCUNHO_KEY) || "null");
  } catch {
    return null;
  }
}

export function salvarRascunho(pagina) {
  window.localStorage.setItem(RASCUNHO_KEY, JSON.stringify(pagina));
}

export function limparRascunho() {
  window.localStorage.removeItem(RASCUNHO_KEY);
}

export function temRascunho() {
  return Boolean(lerRascunho()?.blocos?.length);
}
