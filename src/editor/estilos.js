// Estilo de página: a "casca" que dá personalidade antes de qualquer bloco entrar.
// O preset só escreve tokens no tema — depois de aplicado, cada token continua editável.

export const CASCAS = [
  { id: "coluna", nome: "Coluna", descricao: "Conteúdo direto sobre o fundo." },
  { id: "cartao", nome: "Cartão", descricao: "Tudo dentro de um card central." },
  { id: "vidro", nome: "Vidro", descricao: "Card translúcido sobre o fundo." },
  { id: "cheia", nome: "Página inteira", descricao: "Sem container, de ponta a ponta." },
  { id: "fita", nome: "Fita", descricao: "Card com faixa colorida no topo." },
  { id: "moldura", nome: "Moldura", descricao: "Borda em volta da página inteira." },
];

export const TEXTURAS = [
  { id: "nenhuma", nome: "Lisa" },
  { id: "poa", nome: "Poá" },
  { id: "listras", nome: "Listras" },
  { id: "grade", nome: "Grade" },
  { id: "brilho", nome: "Brilho" },
  { id: "ruido", nome: "Granulado" },
];

export const FORMAS_BOTAO = [
  { id: "pilula", nome: "Pílula" },
  { id: "suave", nome: "Cantos suaves" },
  { id: "reto", nome: "Reto" },
  { id: "bloco", nome: "Caixa-alta" },
  { id: "vidro", nome: "Vidro" },
  { id: "chip", nome: "Chip com sombra" },
  { id: "linha", nome: "Só linha" },
];

export const FORMAS_ICONE = [
  { id: "simples", nome: "Só o traço" },
  { id: "circulo", nome: "Círculo" },
  { id: "quadrado", nome: "Quadrado" },
  { id: "vidro", nome: "Vidro" },
];

export const FORMAS_TITULO = [
  { id: "pesado", nome: "Pesado" },
  { id: "leve", nome: "Leve" },
  { id: "caps", nome: "Caixa-alta espaçada" },
  { id: "display", nome: "Display" },
];

export function formaBotao(id) {
  if (id === "reto") return { raio: "0px", className: "" };
  if (id === "suave") return { raio: "12px", className: "" };
  if (id === "bloco") {
    return { raio: "4px", className: "uppercase tracking-[0.14em]" };
  }
  if (id === "vidro") {
    return {
      raio: "14px",
      className: "backdrop-blur-md",
      base: {
        background: "rgba(255,255,255,0.14)",
        color: "#ffffff",
        borderColor: "rgba(255,255,255,0.34)",
        borderWidth: 1,
        borderStyle: "solid",
      },
    };
  }
  if (id === "chip") {
    return {
      raio: "10px",
      className: "",
      base: {
        borderColor: "var(--skin-tinta, currentColor)",
        borderWidth: 2,
        borderStyle: "solid",
        boxShadow: "4px 4px 0 var(--skin-tinta, currentColor)",
      },
    };
  }
  if (id === "linha") {
    return {
      raio: "0px",
      className: "underline underline-offset-[6px]",
      base: { background: "transparent", paddingLeft: 0, paddingRight: 0 },
    };
  }
  return { raio: "999px", className: "" };
}

export function raioIcone(id) {
  if (id === "quadrado") return 10;
  if (id === "circulo") return 999;
  if (id === "vidro") return 16;
  return undefined;
}

const PRESETS = [
  {
    id: "limpo",
    nome: "Limpo",
    descricao: "Branco, tipografia grande, botão pílula.",
    plano: "free",
    tema: {
      fundo: "#ffffff", texto: "#111827", destaque: "#2563eb", fonte: "sans",
      alinhamento: "esquerda", largura: "media",
      casca: "coluna", textura: "nenhuma", botao: "pilula", iconeForma: "simples", tituloForma: "pesado",
      tinta: "#111827",
    },
  },
  {
    id: "cartao-claro",
    nome: "Cartão claro",
    descricao: "Card central sobre cinza, jeito de crachá.",
    plano: "free",
    tema: {
      fundo: "#e9e9ee", texto: "#16181d", destaque: "#111827", fonte: "moderna",
      alinhamento: "centro", largura: "estreita",
      casca: "cartao", cascaFundo: "#ffffff", cascaCor: "#16181d", cascaRaio: 28,
      cascaBorda: "rgba(0,0,0,0.06)", cascaSombra: "0 30px 80px rgba(15,18,25,0.14)",
      textura: "nenhuma", botao: "suave", iconeForma: "circulo", tituloForma: "pesado",
      tinta: "#16181d",
    },
  },
  {
    id: "noite",
    nome: "Noite",
    descricao: "Degradê escuro com brilho no topo.",
    plano: "free",
    tema: {
      fundoModo: "degrade", fundoDe: "#0b0b12", fundoPara: "#1e1b4b", fundoAngulo: 165,
      texto: "#f4f4f5", destaque: "#6366f1", fonte: "grotesk",
      alinhamento: "centro", largura: "media",
      casca: "coluna", textura: "brilho", botao: "pilula", iconeForma: "circulo", tituloForma: "pesado",
      tinta: "#f4f4f5",
    },
  },
  {
    id: "retrato",
    nome: "Retrato",
    descricao: "Foto ocupando a tela e links de vidro por cima.",
    plano: "free",
    tema: {
      fundoModo: "degrade", fundoDe: "#7d8ea1", fundoPara: "#c9b79c", fundoAngulo: 175,
      texto: "#ffffff", destaque: "#ffffff", fonte: "sans",
      alinhamento: "centro", largura: "estreita",
      casca: "cheia", textura: "nenhuma", botao: "vidro", iconeForma: "vidro", tituloForma: "pesado",
      tinta: "#ffffff",
    },
  },
  {
    id: "faixa-azul",
    nome: "Faixa azul",
    descricao: "Listras no topo, nome enorme, botões retos.",
    plano: "pro",
    tema: {
      fundo: "#eaf2fb", texto: "#4a7ba7", destaque: "#4a7ba7", fonte: "grotesk",
      alinhamento: "esquerda", largura: "estreita",
      casca: "fita", cascaFundo: "#ffffff", cascaCor: "#3f5e7d", cascaRaio: 0,
      cascaBorda: "rgba(74,123,167,0.18)", cascaSombra: "0 24px 60px rgba(63,94,125,0.12)",
      cascaFita: "repeating-linear-gradient(45deg, #dceaf8 0 8px, #eff6fd 8px 16px)",
      textura: "nenhuma", botao: "reto", iconeForma: "simples", tituloForma: "pesado",
      tinta: "#3f5e7d",
    },
  },
  {
    id: "poa",
    nome: "Poá",
    descricao: "Card sobre papel bege pontilhado, botões com sombra dura.",
    plano: "pro",
    tema: {
      fundo: "#efe7d8", texto: "#1c1917", destaque: "#f5d0c5", fonte: "mono",
      alinhamento: "centro", largura: "estreita",
      casca: "cartao", cascaFundo: "linear-gradient(150deg,#e8d9f3,#cfe6dd)", cascaCor: "#1c1917",
      cascaRaio: 22, cascaBorda: "#1c1917", cascaSombra: "0 18px 44px rgba(28,25,23,0.18)",
      textura: "poa", botao: "chip", iconeForma: "quadrado", tituloForma: "pesado",
      tinta: "#1c1917", botaoCor: "#1c1917",
    },
  },
  {
    id: "editorial",
    nome: "Editorial",
    descricao: "Serifada, caixa-alta espaçada, moldura fina.",
    plano: "pro",
    tema: {
      fundo: "#f6f3ec", texto: "#221f1a", destaque: "#8a6a3b", fonte: "editorial",
      alinhamento: "centro", largura: "media",
      casca: "moldura", cascaBorda: "rgba(34,31,26,0.28)",
      textura: "nenhuma", botao: "linha", iconeForma: "simples", tituloForma: "caps",
      tinta: "#221f1a",
    },
  },
  {
    id: "neon",
    nome: "Neon",
    descricao: "Azul profundo, brilho e cartão de vidro.",
    plano: "ultra",
    tema: {
      fundoModo: "degrade", fundoDe: "#0b1d5b", fundoPara: "#1e3a8a", fundoAngulo: 150,
      texto: "#e6edff", destaque: "#38bdf8", fonte: "moderna",
      alinhamento: "centro", largura: "media",
      casca: "vidro", cascaRaio: 26, cascaBorda: "rgba(255,255,255,0.18)",
      textura: "brilho", botao: "vidro", iconeForma: "vidro", tituloForma: "leve",
      tinta: "#e6edff",
    },
  },
  {
    id: "brutal",
    nome: "Brutal",
    descricao: "Amarelo, contorno preto e sombra deslocada.",
    plano: "ultra",
    tema: {
      fundo: "#ffd43b", texto: "#0a0a0a", destaque: "#ffffff", fonte: "poster",
      alinhamento: "esquerda", largura: "media",
      casca: "coluna", textura: "grade", botao: "chip", iconeForma: "quadrado", tituloForma: "caps",
      tinta: "#0a0a0a", botaoCor: "#0a0a0a",
    },
  },
  {
    id: "estudio",
    nome: "Estúdio",
    descricao: "Papel granulado, display serifada, botão caixa-alta.",
    plano: "ultra",
    tema: {
      fundo: "#faf7f2", texto: "#1b1b1b", destaque: "#1b1b1b", fonte: "display",
      alinhamento: "esquerda", largura: "larga",
      casca: "coluna", textura: "ruido", botao: "bloco", iconeForma: "circulo", tituloForma: "display",
      tinta: "#1b1b1b",
    },
  },
];

export const ESTILOS = PRESETS;

export function estiloPorId(id) {
  return PRESETS.find((item) => item.id === id) || null;
}

const CHAVES_ESTILO = [
  "fundo", "fundoModo", "fundoDe", "fundoPara", "fundoAngulo", "fundoDegradeTipo",
  "texto", "destaque", "fonte", "alinhamento", "largura",
  "casca", "cascaFundo", "cascaCor", "cascaRaio", "cascaBorda", "cascaSombra", "cascaFita",
  "textura", "botao", "botaoCor", "iconeForma", "tituloForma", "tinta",
];

// Troca só a casca e as cores do preset, preservando o que o usuário já escreveu
// nos campos que não pertencem ao estilo (título, orientação, etc).
export function aplicarEstilo(tema = {}, id) {
  const preset = estiloPorId(id);
  if (!preset) return tema;
  const limpo = { ...tema };
  for (const chave of CHAVES_ESTILO) delete limpo[chave];
  return { ...limpo, ...preset.tema, estilo: preset.id };
}
