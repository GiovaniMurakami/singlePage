export const ORDEM_PLANOS = ["free", "pro", "ultra"];

export const ROTULO_PLANO = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export function nivelPlano(plano) {
  const indice = ORDEM_PLANOS.indexOf(plano || "free");
  return indice < 0 ? 0 : indice;
}

export function liberarPlanosNoAmbiente() {
  try {
    return Boolean(import.meta.env?.DEV) || import.meta.env?.VITE_LIBERAR_PLANOS === "true";
  } catch {
    return false;
  }
}

export function planoPermite(planoUsuario, planoExigido = "free") {
  if (liberarPlanosNoAmbiente()) return true;
  return nivelPlano(planoUsuario) >= nivelPlano(planoExigido);
}

export function planoPago(plano) {
  return nivelPlano(plano) > 0;
}
