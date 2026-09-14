// 10 perfis com cascas e composições distintas — nenhum é só troca de cor.
import { iconePadrao } from "./icones";
import { estiloPorId } from "./estilos";

const IMG = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

function bloco(tipo, props) {
  return { id: crypto.randomUUID(), tipo, props };
}

function botao(extras = {}) {
  return {
    rotulo: "Meu link",
    url: "https://",
    estilo: "preenchido",
    novaAba: true,
    hoverEscala: 1.04,
    hoverSombra: true,
    ...extras,
  };
}

function tema(estiloId, extras = {}) {
  const base = estiloPorId(estiloId)?.tema || {};
  return { ...base, estilo: estiloId, ...extras };
}

function celula(filhos) {
  return { id: crypto.randomUUID(), blocos: filhos };
}

function cardBrutal(extras) {
  return botao({
    borda: "#111",
    bordaLargura: 2,
    sombraDura: "4px 4px 0 #111",
    raio: 12,
    seta: true,
    iconeDireita: "ArrowUpRight",
    iconeCaixa: "#fff",
    cor: "#111",
    ...extras,
  });
}

export const TEMPLATES_ESTILO = [
  {
    id: "estilo-poa",
    nome: "Poá",
    descricao: "Cartão pastel sobre papel pontilhado, botões com sombra dura.",
    categoria: "perfil",
    tom: "estilo",
    plano: "pro",
    capa: IMG("perfil.jpg"),
    tema: tema("poa"),
    blocos: () => [
      bloco("capa", {
        layoutId: "centro",
        titulo: "Lia Monteiro",
        subtitulo: "Direção de arte e ilustração para marcas pequenas que querem parecer o que são.",
        fotoUrl: IMG("perfil.jpg"),
        fotoTamanho: 96,
        fotoRaio: 999,
        cta: "",
        url: "",
      }),
      bloco("divisor", { estilo: "linha" }),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Dribbble", url: "https://dribbble.com", fundo: "#f3c8d2", cor: "#1c1917", animacao: "nenhuma" }),
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#f2a98d", cor: "#1c1917", animacao: "nenhuma" }),
          iconePadrao({ nome: "Zap", url: "https://wa.me/55", fundo: "#a9d8b8", cor: "#1c1917", animacao: "nenhuma" }),
          iconePadrao({ nome: "Figma", url: "https://figma.com", fundo: "#8fd3d0", cor: "#1c1917", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:lia@estudio.com", fundo: "#e9dcc6", cor: "#1c1917", animacao: "nenhuma" }),
        ],
      }),
      bloco("botoes", {
        layoutId: "linha",
        itens: [
          botao({ rotulo: "Pedir orçamento", url: "mailto:lia@estudio.com", seta: true }),
          botao({ rotulo: "Ver portfólio", url: "https://", estilo: "contorno" }),
        ],
      }),
    ],
  },

  {
    id: "perfil-tres-fotos",
    nome: "Cayce Pollard",
    descricao: "Três fotos na linha, nome serifado e contato com ícone de e-mail.",
    categoria: "perfil",
    tom: "editorial",
    plano: "free",
    capa: IMG("portfolio-1.jpg"),
    tema: {
      fundo: "#2a1638",
      texto: "#1a1220",
      destaque: "#c45c4a",
      fonte: "editorial",
      alinhamento: "esquerda",
      largura: "media",
      casca: "cartao",
      cascaFundo: "#fffaf6",
      cascaCor: "#1a1220",
      cascaRaio: 4,
      cascaSombra: "0 28px 70px rgba(0,0,0,0.35)",
      textura: "nenhuma",
      botao: "suave",
      iconeForma: "simples",
      tituloForma: "display",
      tinta: "#1a1220",
      estilo: "custom-cayce",
    },
    blocos: () => [
      bloco("galeria", {
        layoutId: "grade-3",
        urls: [IMG("perfil.jpg"), IMG("portfolio-2.jpg"), IMG("portfolio-3.jpg")],
        margemBaixo: 8,
        paddingCima: 0,
        paddingBaixo: 0,
        paddingLados: 0,
        raio: 0,
      }),
      bloco("texto", {
        titulo: "Retrato e produto",
        tamanhoTitulo: "pequeno",
        corpo: "",
        corTitulo: "#c45c4a",
      }),
      bloco("texto", {
        titulo: "Cayce Pollard",
        tamanhoTitulo: "enorme",
        corpo: "Fotografo marcas de moda e casa. Luz natural, entrega em duas semanas, sem moodboard eterno.",
      }),
      bloco("grade", {
        colunas: 2,
        proporcao: "esquerda",
        gap: 16,
        celulas: [
          celula([
            bloco("redes", {
              itens: [
                { rotulo: "Instagram", url: "https://instagram.com" },
                { rotulo: "YouTube", url: "https://youtube.com" },
              ],
            }),
          ]),
          celula([
            bloco("botoes", {
              layoutId: "linha",
              itens: [
                botao({
                  rotulo: "Falar comigo",
                  url: "mailto:cayce@email.com",
                  icone: "Mail",
                  fundo: "#c45c4a",
                  cor: "#fffaf6",
                  raio: 999,
                  tamanho: "pequeno",
                }),
              ],
            }),
          ]),
        ],
      }),
    ],
  },

  {
    id: "perfil-t-invertido",
    nome: "John Anderson",
    descricao: "Duas colunas: foto de ponta a ponta e nome com contato embaixo.",
    categoria: "perfil",
    tom: "glass",
    plano: "pro",
    capa: IMG("perfil.jpg"),
    tema: {
      fundoModo: "degrade",
      fundoDe: "#1c1c1e",
      fundoPara: "#3a3a3c",
      fundoAngulo: 160,
      texto: "#f5f5f7",
      destaque: "#ffd60a",
      fonte: "moderna",
      alinhamento: "esquerda",
      largura: "larga",
      casca: "vidro",
      cascaRaio: 28,
      cascaBorda: "rgba(255,255,255,0.12)",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "simples",
      tituloForma: "pesado",
      tinta: "#f5f5f7",
      estilo: "custom-john",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 2,
        proporcao: "iguais",
        gap: 28,
        celulas: [
          celula([
            bloco("texto", {
              titulo: "John Anderson",
              tamanhoTitulo: "enorme",
              corpo: "Design de produto para times que já sabem o que querem. Menos slides, mais protótipo.",
            }),
            bloco("redes", {
              itens: [
                { rotulo: "LinkedIn", url: "https://linkedin.com" },
                { rotulo: "Dribbble", url: "https://dribbble.com" },
              ],
            }),
          ]),
          celula([
            bloco("imagem", {
              url: IMG("perfil.jpg"),
              alt: "John Anderson",
              caption: "",
              raio: 20,
              minAltura: 320,
            }),
          ]),
        ],
      }),
      bloco("botoes", {
        layoutId: "linha",
        itens: [
          botao({
            rotulo: "Agendar conversa",
            url: "mailto:john@email.com",
            fundo: "#ffd60a",
            cor: "#1c1c1e",
            seta: true,
          }),
        ],
      }),
    ],
  },

  {
    id: "perfil-tres-colunas",
    nome: "Samantha Carter",
    descricao: "Nome à esquerda, retrato no centro, lista de links à direita.",
    categoria: "perfil",
    tom: "editorial",
    plano: "ultra",
    capa: IMG("portfolio-2.jpg"),
    tema: {
      fundo: "#0a0a0a",
      texto: "#f4f4f5",
      destaque: "#ef4444",
      fonte: "serif",
      alinhamento: "esquerda",
      largura: "larga",
      casca: "cheia",
      textura: "brilho",
      botao: "reto",
      iconeForma: "simples",
      tituloForma: "display",
      tinta: "#f4f4f5",
      estilo: "custom-samantha",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 3,
        proporcao: "iguais",
        gap: 32,
        align: "center",
        celulas: [
          celula([
            bloco("texto", {
              titulo: "Samantha Carter",
              tamanhoTitulo: "grande",
              corpo: "Fotografia documental · São Paulo",
            }),
            bloco("botoes", {
              layoutId: "linha",
              itens: [
                botao({
                  rotulo: "Ver ensaio",
                  url: "https://",
                  estilo: "contorno",
                  seta: true,
                  fundo: "transparent",
                  cor: "#f4f4f5",
                  borda: "#ef4444",
                  bordaLargura: 1,
                  raio: 0,
                }),
              ],
            }),
          ]),
          celula([
            bloco("imagem", {
              url: IMG("portfolio-2.jpg"),
              alt: "Samantha Carter",
              caption: "",
              raio: 4,
            }),
          ]),
          celula([
            bloco("botoes", {
              layoutId: "pilha",
              itens: [
                botao({ rotulo: "Instagram", url: "https://instagram.com", estilo: "texto", cor: "#f4f4f5" }),
                botao({ rotulo: "YouTube", url: "https://youtube.com", estilo: "texto", cor: "#f4f4f5" }),
                botao({ rotulo: "Behance", url: "https://behance.net", estilo: "texto", cor: "#f4f4f5" }),
                botao({ rotulo: "Contato", url: "mailto:sam@email.com", estilo: "texto", cor: "#ef4444", seta: true }),
              ],
            }),
          ]),
        ],
      }),
    ],
  },

  {
    id: "perfil-foto-container",
    nome: "Alex Murphy",
    descricao: "O card é a própria foto; nome, bio e botão moram dentro dela.",
    categoria: "perfil",
    tom: "foto",
    plano: "free",
    capa: IMG("perfil.jpg"),
    tema: {
      fundo: "#f5f5f7",
      texto: "#ffffff",
      destaque: "#ffffff",
      fonte: "sans",
      alinhamento: "centro",
      largura: "estreita",
      casca: "cartao",
      cascaRaio: 24,
      cascaSombra: "0 30px 80px rgba(0,0,0,0.18)",
      cascaBorda: "transparent",
      textura: "nenhuma",
      botao: "vidro",
      iconeForma: "vidro",
      tituloForma: "pesado",
      tinta: "#ffffff",
      estilo: "custom-alex",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "fullbleed",
        titulo: "Alex Murphy",
        subtitulo: "Paisagem e arquitetura. Baseado em Curitiba, viajando o ano todo.",
        fotoUrl: IMG("perfil.jpg"),
        cta: "Enviar e-mail",
        url: "mailto:alex@email.com",
        estiloBotao: "contorno",
        minAltura: 480,
        raio: 24,
        paddingCima: 40,
        paddingBaixo: 40,
        paddingLados: 28,
      }),
    ],
  },

  {
    id: "perfil-quadriculado",
    nome: "Ann Lewis",
    descricao: "Fundo quadriculado e cards coloridos com título, descrição e seta.",
    categoria: "perfil",
    tom: "brutal",
    plano: "ultra",
    capa: IMG("perfil.jpg"),
    tema: {
      fundo: "#efe7d8",
      texto: "#111111",
      destaque: "#f5d547",
      fonte: "poster",
      alinhamento: "esquerda",
      largura: "estreita",
      casca: "coluna",
      textura: "grade",
      botao: "chip",
      botaoCor: "#111111",
      iconeForma: "quadrado",
      tituloForma: "caps",
      tinta: "#111111",
      estilo: "custom-ann",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 1,
        gap: 14,
        celulas: [
          celula([
            bloco("capa", {
              layoutId: "compacta",
              titulo: "Ann Lewis",
              subtitulo: "Ilustração e identidade visual",
              fotoUrl: IMG("perfil.jpg"),
              fotoTamanho: 64,
              fotoRaio: 999,
              cta: "",
              url: "",
              corFundo: "#fffaf0",
              raio: 14,
              borda: "#111",
              paddingCima: 16,
              paddingBaixo: 16,
              paddingLados: 16,
            }),
          ]),
        ],
      }),
      bloco("botoes", {
        layoutId: "cartoes",
        itens: [
          cardBrutal({
            rotulo: "Portfólio 2026",
            subtitulo: "Últimos trabalhos de marca e embalagem.",
            url: "https://",
            fundo: "#f5d547",
          }),
          cardBrutal({
            rotulo: "Loja de prints",
            subtitulo: "Tiragens limitadas, envio para todo o Brasil.",
            url: "https://",
            fundo: "#7eb6ff",
          }),
          cardBrutal({
            rotulo: "Curso ao vivo",
            subtitulo: "Quatro aulas de tipografia aplicada.",
            url: "https://",
            fundo: "#ff8fab",
          }),
          cardBrutal({
            rotulo: "Newsletter",
            subtitulo: "Uma carta por mês sobre processo criativo.",
            url: "https://",
            fundo: "#7dd3c0",
          }),
        ],
      }),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Twitter", url: "https://twitter.com", fundo: "#fff", cor: "#111", animacao: "nenhuma", raio: 8 }),
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#fff", cor: "#111", animacao: "nenhuma", raio: 8 }),
          iconePadrao({ nome: "Globe", url: "https://", fundo: "#fff", cor: "#111", animacao: "nenhuma", raio: 8 }),
          iconePadrao({ nome: "Mail", url: "mailto:ann@email.com", fundo: "#fff", cor: "#111", animacao: "nenhuma", raio: 8 }),
        ],
      }),
    ],
  },

  {
    id: "perfil-duas-linhas",
    nome: "Faixa retrato",
    descricao: "Foto ocupando a linha de cima; redes só na de baixo.",
    categoria: "perfil",
    tom: "foto",
    plano: "pro",
    capa: IMG("landing.jpg"),
    tema: {
      fundo: "#0b0b10",
      texto: "#f4f4f5",
      destaque: "#ffffff",
      fonte: "grotesk",
      alinhamento: "centro",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "vidro",
      iconeForma: "circulo",
      tituloForma: "leve",
      tinta: "#f4f4f5",
      estilo: "custom-faixa",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "fullbleed",
        titulo: "Marina Sol",
        subtitulo: "Direção de arte para marcas de moda e comida.",
        fotoUrl: IMG("landing.jpg"),
        cta: "",
        url: "",
        minAltura: 420,
        margemBaixo: 0,
      }),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "rgba(255,255,255,0.1)", animacao: "nenhuma" }),
          iconePadrao({ nome: "Behance", url: "https://behance.net", fundo: "rgba(255,255,255,0.1)", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:marina@email.com", fundo: "rgba(255,255,255,0.1)", animacao: "nenhuma" }),
          iconePadrao({ nome: "Globe", url: "https://", fundo: "rgba(255,255,255,0.1)", animacao: "nenhuma" }),
        ],
      }),
    ],
  },

  {
    id: "perfil-apple",
    nome: "Single One",
    descricao: "Estética Apple: branco, tipografia enorme e um botão só.",
    categoria: "perfil",
    tom: "apple",
    plano: "free",
    capa: IMG("perfil.jpg"),
    tema: {
      fundo: "#f5f5f7",
      texto: "#1d1d1f",
      destaque: "#0071e3",
      fonte: "sans",
      alinhamento: "centro",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "circulo",
      tituloForma: "leve",
      tinta: "#1d1d1f",
      estilo: "custom-apple",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "centro",
        titulo: "Olá. Eu sou a Ana.",
        subtitulo: "Design de produto. Páginas simples. Nada de dashboard.",
        fotoUrl: IMG("perfil.jpg"),
        fotoTamanho: 120,
        fotoRaio: 999,
        cta: "Falar comigo",
        url: "mailto:ana@email.com",
        tamanhoTitulo: "enorme",
      }),
      bloco("texto", {
        titulo: "",
        corpo: "Trabalhei em três startups e um estúdio. Agora ajudo times a publicar a primeira página sem reunião de alinhamento.",
      }),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Linkedin", url: "https://linkedin.com", fundo: "transparent", cor: "#1d1d1f", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:ana@email.com", fundo: "transparent", cor: "#1d1d1f", animacao: "nenhuma" }),
        ],
      }),
    ],
  },

  {
    id: "perfil-linear",
    nome: "Studio North",
    descricao: "Glassmorphism escuro, no jeito de produto de design.",
    categoria: "perfil",
    tom: "glass",
    plano: "ultra",
    capa: IMG("links.jpg"),
    tema: tema("neon", {
      casca: "vidro",
      largura: "estreita",
      botao: "vidro",
      tituloForma: "leve",
    }),
    blocos: () => [
      bloco("texto", {
        titulo: "Studio North",
        tamanhoTitulo: "grande",
        corpo: "Design systems e interfaces para times remotos.",
      }),
      bloco("botoes", {
        layoutId: "pilha",
        itens: [
          botao({
            rotulo: "Cases",
            subtitulo: "Produtos que publicamos este ano",
            url: "https://",
            seta: true,
          }),
          botao({
            rotulo: "Figma Community",
            subtitulo: "Componentes gratuitos do time",
            url: "https://figma.com",
            seta: true,
          }),
          botao({
            rotulo: "Vagas abertas",
            subtitulo: "Product designer e motion",
            url: "https://",
            seta: true,
          }),
          botao({
            rotulo: "Agendar call",
            url: "mailto:hello@north.studio",
            icone: "Calendar",
            fundo: "#38bdf8",
            cor: "#0b1d5b",
          }),
        ],
      }),
    ],
  },

  {
    id: "estilo-faixa",
    nome: "Aribeth",
    descricao: "Listras no topo, nome enorme e botões retos em grade.",
    categoria: "perfil",
    tom: "estilo",
    plano: "pro",
    capa: IMG("landing.jpg"),
    tema: tema("faixa-azul"),
    blocos: () => [
      bloco("icones", {
        layoutId: "centro",
        alinhamento: "esquerda",
        itens: [
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "transparent", cor: "#3f5e7d", animacao: "nenhuma" }),
          iconePadrao({ nome: "Music2", url: "https://tiktok.com", fundo: "transparent", cor: "#3f5e7d", animacao: "nenhuma" }),
          iconePadrao({ nome: "Linkedin", url: "https://linkedin.com", fundo: "transparent", cor: "#3f5e7d", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:aribeth@email.com", fundo: "transparent", cor: "#3f5e7d", animacao: "nenhuma" }),
        ],
      }),
      bloco("texto", {
        titulo: "Aribeth Costa",
        tamanhoTitulo: "enorme",
        corpo: "Escrevo sobre produto e carreira em tecnologia. Uma edição por semana, sempre na terça.",
      }),
      bloco("imagem", { url: IMG("landing.jpg"), alt: "Escritório", caption: "", raio: 12 }),
      bloco("botoes", {
        layoutId: "grade",
        itens: [
          botao({ rotulo: "Última newsletter", url: "https://", seta: true, raio: 4 }),
          botao({ rotulo: "Podcast", url: "https://", seta: true, raio: 4 }),
          botao({ rotulo: "Mentoria", url: "https://", seta: true, raio: 4 }),
          botao({ rotulo: "Contato", url: "mailto:aribeth@email.com", seta: true, raio: 4 }),
        ],
      }),
    ],
  },
];
