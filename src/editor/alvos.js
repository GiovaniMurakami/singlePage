export const ALVO_FUNDO = "__fundo";
export const ALVO_PAGINA = "__pagina";

export function ehAlvoEspecial(id) {
  return id === ALVO_FUNDO || id === ALVO_PAGINA;
}
