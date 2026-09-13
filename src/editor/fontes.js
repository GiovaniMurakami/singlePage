export const FONTES = {
  sans: '"IBM Plex Sans", Inter, sans-serif',
  grotesk: '"Space Grotesk", Inter, sans-serif',
  moderna: '"Outfit", Inter, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  editorial: '"Fraunces", Georgia, serif',
  display: '"Playfair Display", Georgia, serif',
  poster: '"Bebas Neue", Impact, sans-serif',
  script: '"Caveat", "Segoe Script", cursive',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};

export const FONTES_OPCOES = [
  { id: "sans", nome: "Plex Sans — limpa" },
  { id: "grotesk", nome: "Space Grotesk — geométrica" },
  { id: "moderna", nome: "Outfit — contemporânea" },
  { id: "serif", nome: "Instrument Serif — editorial" },
  { id: "editorial", nome: "Fraunces — sofisticação" },
  { id: "display", nome: "Playfair — clássica" },
  { id: "poster", nome: "Bebas Neue — cartaz" },
  { id: "script", nome: "Caveat — manuscrita" },
  { id: "mono", nome: "Plex Mono — técnica" },
];

export const ALINHAMENTOS_TEMA = [
  { id: "esquerda", nome: "Esquerda" },
  { id: "centro", nome: "Centro" },
  { id: "direita", nome: "Direita" },
  { id: "justificado", nome: "Justificado" },
];

export const ORIENTACOES_TEXTO = [
  { id: "horizontal", nome: "Horizontal" },
  { id: "vertical", nome: "Vertical" },
];

export function cssAlinhamento(valor) {
  if (valor === "esquerda") return "left";
  if (valor === "direita") return "right";
  if (valor === "justificado") return "justify";
  if (valor === "centro") return "center";
  return undefined;
}

export function cssOrientacao(valor) {
  if (valor === "vertical") {
    return { writingMode: "vertical-rl", textOrientation: "mixed" };
  }
  return {};
}
