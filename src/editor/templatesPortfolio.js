// Portfólios com composição própria — inspirados no Carrd (#portfolio).
import { iconePadrao } from "./icones";

const IMG = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

const FOTOS = [
  IMG("portfolio-1.jpg"),
  IMG("portfolio-2.jpg"),
  IMG("portfolio-3.jpg"),
  IMG("portfolio-4.jpg"),
];

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

function celula(filhos) {
  return { id: crypto.randomUUID(), blocos: filhos };
}

function campo(extras = {}) {
  return {
    id: crypto.randomUUID(),
    tipo: "texto",
    rotulo: "",
    placeholder: "",
    obrigatorio: false,
    opcoes: "",
    ...extras,
  };
}

function form(extra = {}) {
  return bloco("formulario", {
    destEmail: "oi@email.com",
    assunto: "Orçamento",
    placeholder: "seu@email.com",
    botao: "Enviar",
    mostrarNome: false,
    mostrarMensagem: false,
    ...extra,
  });
}

function galeria(layoutId = "grade-2", urls = FOTOS) {
  return bloco("galeria", { layoutId, urls });
}

export const TEMPLATES_PORTFOLIO = [
  {
    id: "portfolio-nadir",
    nome: "Nadir",
    descricao: "Retrato full-bleed, botões duros e faixa de fotos embaixo.",
    categoria: "portfolio",
    tom: "foto",
    plano: "pro",
    capa: IMG("portfolio-1.jpg"),
    tema: {
      fundo: "#111111",
      texto: "#f5f5f5",
      destaque: "#e8572a",
      fonte: "poster",
      alinhamento: "esquerda",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "chip",
      botaoCor: "#e8572a",
      iconeForma: "quadrado",
      tituloForma: "caps",
      tinta: "#f5f5f5",
      estilo: "custom-nadir",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "fullbleed",
        titulo: "Nadir",
        subtitulo: "Retrato e editorial. Luz dura, sombra limpa.",
        fotoUrl: IMG("portfolio-1.jpg"),
        cta: "Ver seleção",
        url: "#fotos",
        estiloBotao: "preenchido",
        minAltura: 420,
        novaAba: false,
      }),
      bloco("botoes", {
        layoutId: "linha",
        itens: [
          botao({
            rotulo: "Seleção",
            url: "#fotos",
            fundo: "#e8572a",
            cor: "#111",
            sombraDura: "4px 4px 0 #e8572a",
            raio: 0,
            seta: true,
            novaAba: false,
          }),
          botao({
            rotulo: "Contato",
            url: "mailto:nadir@email.com",
            fundo: "#222",
            cor: "#f5f5f5",
            borda: "#f5f5f5",
            bordaLargura: 2,
            raio: 0,
            icone: "Mail",
          }),
        ],
      }),
      bloco("secao", { ancora: "fotos", titulo: "", subtitulo: "" }),
      galeria("faixa"),
    ],
  },

  {
    id: "portfolio-clara",
    nome: "Clara",
    descricao: "Claro e elegante: título serifado e grade de três colunas.",
    categoria: "portfolio",
    tom: "editorial",
    plano: "free",
    capa: IMG("portfolio-2.jpg"),
    tema: {
      fundo: "#f7f4ef",
      texto: "#1c1917",
      destaque: "#9f2d2d",
      fonte: "editorial",
      alinhamento: "centro",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "linha",
      iconeForma: "simples",
      tituloForma: "caps",
      tinta: "#1c1917",
      estilo: "custom-clara",
    },
    blocos: () => [
      bloco("capa", {
        titulo: "Clara Mendes",
        subtitulo: "Paisagem e interiores. Trabalho calmo, impressão grande.",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      bloco("botoes", {
        layoutId: "pills",
        itens: [
          botao({ rotulo: "Paisagem", url: "#fotos", estilo: "contorno", novaAba: false }),
          botao({ rotulo: "Interior", url: "#fotos", estilo: "contorno", novaAba: false }),
          botao({ rotulo: "Contato", url: "mailto:clara@email.com", estilo: "texto" }),
        ],
      }),
      bloco("secao", { ancora: "fotos", titulo: "", subtitulo: "" }),
      galeria("grade-3"),
      bloco("rodape", { texto: "© Clara Mendes — impressões sob encomenda" }),
    ],
  },

  {
    id: "portfolio-mosaic",
    nome: "Mosaic",
    descricao: "A primeira foto ganha destaque; o resto completa o mosaico.",
    categoria: "portfolio",
    tom: "foto",
    plano: "free",
    capa: IMG("portfolio-3.jpg"),
    tema: {
      fundo: "#0b0b10",
      texto: "#fafafa",
      destaque: "#fafafa",
      fonte: "grotesk",
      alinhamento: "centro",
      largura: "larga",
      casca: "coluna",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "circulo",
      tituloForma: "pesado",
      tinta: "#fafafa",
      estilo: "custom-mosaic",
    },
    blocos: () => [
      bloco("texto", {
        titulo: "Mosaic",
        tamanhoTitulo: "enorme",
        corpo: "Seleção recente. Clique para ampliar.",
      }),
      galeria("mosaico"),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#222", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:mosaic@email.com", fundo: "#222", animacao: "nenhuma" }),
        ],
      }),
    ],
  },

  {
    id: "portfolio-frame",
    nome: "Frame",
    descricao: "Split: bio à esquerda, foto destaque à direita; grade embaixo.",
    categoria: "portfolio",
    tom: "serio",
    plano: "pro",
    capa: IMG("portfolio-1.jpg"),
    tema: {
      fundo: "#f5f5f7",
      texto: "#1d1d1f",
      destaque: "#1d1d1f",
      fonte: "sans",
      alinhamento: "esquerda",
      largura: "larga",
      casca: "coluna",
      textura: "nenhuma",
      botao: "suave",
      iconeForma: "simples",
      tituloForma: "pesado",
      tinta: "#1d1d1f",
      estilo: "custom-frame",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 2,
        proporcao: "iguais",
        gap: 32,
        celulas: [
          celula([
            bloco("texto", {
              titulo: "Frame Studio",
              tamanhoTitulo: "enorme",
              corpo: "Produto, espaço e a gente que ocupa o espaço. Base em São Paulo.",
            }),
            bloco("botoes", {
              layoutId: "linha",
              itens: [
                botao({ rotulo: "Pedir orçamento", url: "mailto:frame@email.com", seta: true }),
                botao({ rotulo: "Instagram", url: "https://instagram.com", estilo: "texto" }),
              ],
            }),
          ]),
          celula([
            bloco("imagem", { url: IMG("portfolio-1.jpg"), alt: "Destaque", caption: "Campanha Leste, 2026", raio: 16 }),
          ]),
        ],
      }),
      galeria("grade-2", [IMG("portfolio-2.jpg"), IMG("portfolio-3.jpg"), IMG("portfolio-4.jpg"), IMG("portfolio-1.jpg")]),
    ],
  },

  {
    id: "portfolio-arquivo",
    nome: "Arquivo",
    descricao: "Editorial: tipografia grande, moldura e fotos em duas colunas.",
    categoria: "portfolio",
    tom: "editorial",
    plano: "pro",
    capa: IMG("portfolio-4.jpg"),
    tema: {
      fundo: "#f4f0e8",
      texto: "#1a1714",
      destaque: "#8a5a2b",
      fonte: "editorial",
      alinhamento: "esquerda",
      largura: "media",
      casca: "moldura",
      cascaBorda: "rgba(26,23,20,0.22)",
      textura: "nenhuma",
      botao: "linha",
      iconeForma: "simples",
      tituloForma: "caps",
      tinta: "#1a1714",
      estilo: "custom-arquivo",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "editorial",
        titulo: "Arquivo 2019–2026",
        subtitulo: "Estudos de luz em interiores e paisagem quieta.",
        fotoUrl: IMG("portfolio-4.jpg"),
        cta: "Solicitar dossiê",
        url: "mailto:arquivo@email.com",
        estiloBotao: "texto",
      }),
      galeria("grade-2"),
      bloco("texto", {
        titulo: "Nota",
        corpo: "Imagens disponíveis para publicação mediante crédito. Prints em edição limitada.",
      }),
    ],
  },

  {
    id: "portfolio-lens",
    nome: "Lens",
    descricao: "Pacote completo: nav, galeria, depoimentos e pedido de orçamento.",
    categoria: "portfolio",
    tom: "serio",
    plano: "pro",
    capa: IMG("portfolio-2.jpg"),
    tema: {
      fundo: "#0a0a0b",
      texto: "#f4f4f5",
      destaque: "#f97316",
      fonte: "display",
      alinhamento: "esquerda",
      largura: "media",
      casca: "coluna",
      textura: "ruido",
      botao: "bloco",
      iconeForma: "circulo",
      tituloForma: "display",
      tinta: "#f4f4f5",
      estilo: "custom-lens",
    },
    blocos: () => [
      bloco("navegacao", {
        itens: [
          { rotulo: "Trabalho", ancora: "trabalho" },
          { rotulo: "Clientes", ancora: "clientes" },
          { rotulo: "Orçamento", ancora: "orcamento" },
        ],
      }),
      bloco("capa", {
        layoutId: "esquerda",
        titulo: "Lens",
        subtitulo: "Fotografia de produto e espaço para marcas que querem parecer o que são.",
        fotoUrl: "",
        cta: "Ver trabalho",
        url: "#trabalho",
        estiloBotao: "preenchido",
        novaAba: false,
      }),
      bloco("secao", { ancora: "trabalho", titulo: "Seleção", subtitulo: "Clique para ampliar." }),
      galeria("destaque"),
      bloco("secao", { ancora: "clientes", titulo: "Quem chamou", subtitulo: "" }),
      bloco("depoimentos", {
        layoutId: "grade",
        itens: [
          { citacao: "Entregaram o ensaio no tom da marca, sem briefing eterno.", autor: "Marca Leste", fotoUrl: "" },
          { citacao: "O espaço parecia maior. E era só luz.", autor: "Hotel Rio", fotoUrl: "" },
        ],
      }),
      bloco("secao", { ancora: "orcamento", titulo: "Orçamento", subtitulo: "Data, cidade e tipo de ensaio." }),
      form({
        titulo: "",
        destEmail: "lens@email.com",
        assunto: "Orçamento Lens",
        botao: "Pedir orçamento",
        campos: [
          campo({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome", obrigatorio: true }),
          campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
          campo({ tipo: "area", rotulo: "Briefing", placeholder: "O que precisa fotografar" }),
        ],
      }),
      bloco("rodape", { texto: "© Lens — São Paulo" }),
    ],
  },

  {
    id: "portfolio-parede",
    nome: "Parede",
    descricao: "Quase só fotos. Quase nenhum texto.",
    categoria: "portfolio",
    tom: "minimalista",
    plano: "free",
    capa: IMG("portfolio-3.jpg"),
    tema: {
      fundo: "#ffffff",
      texto: "#111111",
      destaque: "#111111",
      fonte: "sans",
      alinhamento: "centro",
      largura: "larga",
      casca: "coluna",
      textura: "nenhuma",
      botao: "linha",
      iconeForma: "simples",
      tituloForma: "leve",
      tinta: "#111111",
      estilo: "custom-parede",
    },
    blocos: () => [
      galeria("grade-3"),
      bloco("capa", {
        titulo: "",
        subtitulo: "",
        fotoUrl: "",
        cta: "contato",
        url: "mailto:parede@email.com",
        estiloBotao: "texto",
      }),
    ],
  },

  {
    id: "portfolio-faixa",
    nome: "Faixa",
    descricao: "Sobre em cima; galeria em rolagem horizontal embaixo.",
    categoria: "portfolio",
    tom: "foto",
    plano: "free",
    capa: IMG("portfolio-4.jpg"),
    tema: {
      fundo: "#16161a",
      texto: "#ececf1",
      destaque: "#a78bfa",
      fonte: "moderna",
      alinhamento: "esquerda",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "vidro",
      tituloForma: "pesado",
      tinta: "#ececf1",
      estilo: "custom-faixa-port",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 2,
        gap: 24,
        celulas: [
          celula([
            bloco("texto", {
              titulo: "Faixa",
              corpo: "Direção de arte e still. Projetos selecionados — deslize para o lado.",
            }),
          ]),
          celula([
            bloco("icones", {
              layoutId: "faixa",
              itens: [
                iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
                iconePadrao({ nome: "Globe", url: "https://", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
                iconePadrao({ nome: "Mail", url: "mailto:faixa@email.com", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
              ],
            }),
          ]),
        ],
      }),
      galeria("faixa"),
      bloco("botoes", {
        layoutId: "linha",
        itens: [
          botao({ rotulo: "Pedir projeto", url: "mailto:faixa@email.com", seta: true }),
        ],
      }),
    ],
  },
];
