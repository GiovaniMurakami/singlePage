import { iconePadrao } from "./icones";

const TEMA_PADRAO = {
  fundo: "#0b0b10",
  texto: "#f4f4f5",
  destaque: "#155eff",
  fonte: "sans",
  alinhamento: "centro",
  largura: "media",
};

const IMG_S3 = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

function botaoPadrao(extras = {}) {
  return {
    rotulo: "Meu link",
    url: "https://",
    estilo: "preenchido",
    novaAba: true,
    hoverFundo: "",
    hoverCor: "",
    hoverEscala: 1.04,
    hoverSombra: true,
    ...extras,
  };
}

function bloco(tipo, props) {
  return { id: crypto.randomUUID(), tipo, props };
}

function tema(extra) {
  return { ...TEMA_PADRAO, ...extra };
}

function icones(itens) {
  return bloco("icones", { itens: itens.map((item) => iconePadrao(item)) });
}

function botoes(itens) {
  return bloco("botoes", { itens: itens.map((item) => botaoPadrao(item)) });
}

function form(extra = {}) {
  return bloco("formulario", {
    destEmail: "oi@email.com",
    assunto: "Mensagem pelo site",
    placeholder: "seu@email.com",
    botao: "Enviar",
    mostrarNome: true,
    mostrarMensagem: true,
    ...extra,
  });
}

function galeria(arquivos = ["portfolio-1.jpg", "portfolio-2.jpg", "portfolio-3.jpg", "portfolio-4.jpg"]) {
  return bloco("galeria", { urls: arquivos.map(IMG_S3) });
}

function layout({ id, nome, descricao, categoria, tom, capa, tema: temaPagina, blocos }) {
  return {
    id,
    nome,
    descricao,
    categoria,
    tom,
    capa,
    destaque: false,
    tema: temaPagina,
    blocos,
  };
}

const PERFIL = [
  layout({
    id: "perfil-criativo",
    nome: "Mel Rivera",
    descricao: "Ilustração, cartaz e um retrato que parece capa.",
    categoria: "perfil",
    tom: "criativo",
    capa: IMG_S3("perfil.jpg"),
    tema: tema({ fundo: "#1b0633", texto: "#ffe8ff", destaque: "#ff2bd6", fonte: "serif", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("capa", {
        titulo: "Mel Rivera",
        subtitulo: "Ilustro capas, cartazes e um pouco de caos organizado.",
        fotoUrl: IMG_S3("perfil.jpg"),
        cta: "Encomendar um desenho",
        url: "mailto:mel@email.com",
        estiloBotao: "preenchido",
      }),
      icones([
        { nome: "Palette", url: "https://", fundo: "#ff2bd6", animacao: "pulso" },
        { nome: "Instagram", url: "https://instagram.com", fundo: "#5b21b6", animacao: "flutuar" },
        { nome: "Mail", url: "mailto:mel@email.com", fundo: "#1d1d1f", animacao: "nenhuma" },
      ]),
      bloco("texto", { titulo: "Agora", corpo: "Abrindo agenda para 3 projetos de capa. O resto do ano é livro e risografia." }),
    ],
  }),
  layout({
    id: "perfil-colorido",
    nome: "Bia Sol",
    descricao: "Cerâmica, cor e mesa posta.",
    categoria: "perfil",
    tom: "colorido",
    capa: IMG_S3("perfil.jpg"),
    tema: tema({ fundo: "#ffe600", texto: "#111111", destaque: "#5b21ff", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "Bia Sol",
        subtitulo: "Cerâmica, cor e mesa posta. Tudo que cabe num prato.",
        fotoUrl: IMG_S3("perfil.jpg"),
        cta: "Pedir um conjunto",
        url: "mailto:bia@email.com",
        estiloBotao: "preenchido",
      }),
      icones([
        { nome: "Instagram", url: "https://instagram.com", fundo: "#ff006e", animacao: "pular" },
        { nome: "ShoppingBag", url: "https://", fundo: "#5b21ff", animacao: "pulso" },
        { nome: "Mail", url: "mailto:bia@email.com", fundo: "#111111", animacao: "nenhuma" },
      ]),
      bloco("texto", { titulo: "Forno aberto", corpo: "Peças únicas aos sábados. Encomenda personalizada com 20 dias." }),
    ],
  }),
  layout({
    id: "perfil-sobrio",
    nome: "Clara Mendes",
    descricao: "Interiores. Casas quietas, luz certa.",
    categoria: "perfil",
    tom: "sobrio",
    capa: IMG_S3("perfil.jpg"),
    tema: tema({ fundo: "#ebe6dc", texto: "#2f2b26", destaque: "#6f675e", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "Clara Mendes",
        subtitulo: "Arquitetura de interiores. Casas quietas, luz certa.",
        fotoUrl: IMG_S3("perfil.jpg"),
        cta: "Agendar conversa",
        url: "mailto:clara@email.com",
        estiloBotao: "contorno",
      }),
      bloco("texto", { titulo: "", corpo: "Atendo projetos residenciais em São Paulo. Uma obra por vez." }),
    ],
  }),
  layout({
    id: "perfil-serio",
    nome: "Henrique Vale",
    descricao: "Conselho e estratégia para empresa familiar.",
    categoria: "perfil",
    tom: "serio",
    capa: IMG_S3("perfil.jpg"),
    tema: tema({ fundo: "#0b1220", texto: "#e8e6e1", destaque: "#c5a572", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("capa", {
        titulo: "Henrique Vale",
        subtitulo: "Estratégia para empresas familiares. Conselho, sucessão e clareza.",
        fotoUrl: "",
        cta: "Solicitar briefing",
        url: "mailto:henrique@email.com",
        estiloBotao: "contorno",
      }),
      bloco("texto", {
        titulo: "Atuação",
        corpo: "20 anos entre operação e conselho. Trabalho com times pequenos e decisões grandes.",
      }),
      icones([
        { nome: "Linkedin", url: "https://linkedin.com", fundo: "#1d2a44", animacao: "nenhuma" },
        { nome: "Mail", url: "mailto:henrique@email.com", fundo: "#c5a572", cor: "#0b1220", animacao: "nenhuma" },
      ]),
    ],
  }),
  layout({
    id: "perfil-minimalista",
    nome: "N. Kato",
    descricao: "Fotografia. Nome, uma linha, um e-mail.",
    categoria: "perfil",
    tom: "minimalista",
    capa: "",
    tema: tema({ fundo: "#ffffff", texto: "#111111", destaque: "#111111", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "N. Kato",
        subtitulo: "Fotografia.",
        fotoUrl: "",
        cta: "oi@kato.com",
        url: "mailto:oi@kato.com",
        estiloBotao: "texto",
      }),
    ],
  }),
  layout({
    id: "perfil-maximalista",
    nome: "Kika Torres",
    descricao: "Direção, styling e uma página que não para quieta.",
    categoria: "perfil",
    tom: "maximalista",
    capa: IMG_S3("perfil.jpg"),
    tema: tema({ fundo: "#0b0b10", texto: "#fafafa", destaque: "#ff3b00", largura: "larga" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Eu", ancora: "eu" }, { rotulo: "Trabalho", ancora: "trabalho" }, { rotulo: "Fala", ancora: "fala" }] }),
      bloco("secao", { ancora: "eu", titulo: "", subtitulo: "" }),
      bloco("capa", {
        titulo: "Kika Torres",
        subtitulo: "Direção, styling, um pouco de palco e muito recado no stories.",
        fotoUrl: IMG_S3("perfil.jpg"),
        cta: "Me chama",
        url: "#fala",
        estiloBotao: "preenchido",
        novaAba: false,
      }),
      icones([
        { nome: "Instagram", url: "https://instagram.com", fundo: "#ff3b00", animacao: "pular" },
        { nome: "Youtube", url: "https://youtube.com", fundo: "#155eff", animacao: "pulso" },
        { nome: "Music", url: "https://spotify.com", fundo: "#b8ff00", cor: "#111", animacao: "flutuar" },
        { nome: "Mail", url: "mailto:kika@email.com", fundo: "#7c3aed", animacao: "pulso" },
      ]),
      bloco("secao", { ancora: "trabalho", titulo: "Em cena", subtitulo: "Últimos frames." }),
      galeria(),
      bloco("texto", { titulo: "Agenda aberta", corpo: "Campanha, editorial e evento. Manda referência e prazo — eu devolvo no mesmo dia." }),
      botoes([
        { rotulo: "Lookbook", url: "https://", estilo: "preenchido" },
        { rotulo: "Imprensa", url: "https://", estilo: "contorno" },
        { rotulo: "Contrato", url: "mailto:kika@email.com", estilo: "texto" },
      ]),
      bloco("secao", { ancora: "fala", titulo: "Fala comigo", subtitulo: "" }),
      form({ titulo: "", destEmail: "kika@email.com", assunto: "Oi, Kika", botao: "Mandar recado" }),
      bloco("rodape", { texto: "© Kika Torres — tudo ao mesmo tempo" }),
    ],
  }),
];

const LANDING = [];

const FORMULARIO = [];

const PORTFOLIO = [];

const LINKS = [
  layout({
    id: "links-criativo",
    nome: "Zeca Comics",
    descricao: "Tira semanal. Um vilão por mês.",
    categoria: "sectioned",
    tom: "criativo",
    capa: IMG_S3("links.jpg"),
    tema: tema({ fundo: "#14001a", texto: "#fdf4ff", destaque: "#c1ff72", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Zeca", ancora: "inicio" }, { rotulo: "Gibis", ancora: "links" }, { rotulo: "Oi", ancora: "contato" }] }),
      bloco("secao", { ancora: "inicio", titulo: "", subtitulo: "" }),
      bloco("capa", {
        titulo: "Zeca Comics",
        subtitulo: "Tira semanal. Um vilão por mês.",
        fotoUrl: IMG_S3("links.jpg"),
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
      icones([
        { nome: "BookOpen", url: "https://", fundo: "#c1ff72", cor: "#14001a", animacao: "pular" },
        { nome: "Instagram", url: "https://instagram.com", fundo: "#ff2bd6", animacao: "flutuar" },
      ]),
      bloco("secao", { ancora: "links", titulo: "Gibis", subtitulo: "" }),
      botoes([
        { rotulo: "Capítulo novo", url: "https://", estilo: "preenchido" },
        { rotulo: "Loja de prints", url: "https://", estilo: "contorno" },
        { rotulo: "Patreon", url: "https://", estilo: "texto" },
      ]),
      bloco("secao", { ancora: "contato", titulo: "Manda um vilão", subtitulo: "" }),
      form({ destEmail: "zeca@email.com", assunto: "Vilão", botao: "Enviar" }),
    ],
  }),
  layout({
    id: "links-colorido",
    nome: "DJ Prisma",
    descricao: "Sets, ingressos e o mix da terça.",
    categoria: "sectioned",
    tom: "colorido",
    capa: IMG_S3("links.jpg"),
    tema: tema({ fundo: "#fb5607", texto: "#ffffff", destaque: "#8338ec", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "DJ Prisma",
        subtitulo: "Sets, ingressos e o mix da terça.",
        fotoUrl: IMG_S3("links.jpg"),
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
      icones([
        { nome: "Music", url: "https://spotify.com", fundo: "#8338ec", animacao: "girar" },
        { nome: "Headphones", url: "https://", fundo: "#111111", animacao: "pulso" },
        { nome: "Instagram", url: "https://instagram.com", fundo: "#3a0ca3", animacao: "pular" },
      ]),
      botoes([
        { rotulo: "Próxima festa", url: "https://", estilo: "preenchido" },
        { rotulo: "SoundCloud", url: "https://", estilo: "contorno" },
        { rotulo: "Contratar set", url: "mailto:prisma@email.com", estilo: "contorno" },
      ]),
    ],
  }),
  layout({
    id: "links-sobrio",
    nome: "oficina lenta",
    descricao: "Madeira, faca e tempo.",
    categoria: "sectioned",
    tom: "sobrio",
    capa: IMG_S3("links.jpg"),
    tema: tema({ fundo: "#cfc8bc", texto: "#1f1c19", destaque: "#5c564c", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "oficina lenta",
        subtitulo: "Madeira, faca e tempo.",
        fotoUrl: IMG_S3("links.jpg"),
        cta: "",
        url: "",
        estiloBotao: "texto",
      }),
      bloco("texto", { titulo: "", corpo: "Encomendas abertas no primeiro dia útil do mês. O resto é bancada." }),
      botoes([
        { rotulo: "Catálogo", url: "https://", estilo: "contorno" },
        { rotulo: "Lista de espera", url: "mailto:oficina@email.com", estilo: "texto" },
      ]),
    ],
  }),
  layout({
    id: "links-serio",
    nome: "Helena Prado",
    descricao: "Palestras, artigos e imprensa.",
    categoria: "sectioned",
    tom: "serio",
    capa: IMG_S3("links.jpg"),
    tema: tema({ fundo: "#111827", texto: "#f3f4f6", destaque: "#9ca3af", alinhamento: "esquerda", largura: "estreita" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Perfil", ancora: "inicio" }, { rotulo: "Agenda", ancora: "links" }, { rotulo: "Imprensa", ancora: "contato" }] }),
      bloco("secao", { ancora: "inicio", titulo: "", subtitulo: "" }),
      bloco("capa", {
        titulo: "Helena Prado",
        subtitulo: "Economia e política pública. Palestras e comentário.",
        fotoUrl: "",
        cta: "",
        url: "",
        estiloBotao: "contorno",
      }),
      bloco("secao", { ancora: "links", titulo: "Agenda", subtitulo: "" }),
      botoes([
        { rotulo: "Palestras 2026", url: "https://", estilo: "preenchido" },
        { rotulo: "Artigos", url: "https://", estilo: "contorno" },
        { rotulo: "LinkedIn", url: "https://linkedin.com", estilo: "texto" },
      ]),
      bloco("secao", { ancora: "contato", titulo: "Imprensa", subtitulo: "" }),
      form({ destEmail: "imprensa@prado.com", assunto: "Imprensa", botao: "Enviar pauta", mostrarMensagem: true }),
    ],
  }),
  layout({
    id: "links-minimalista",
    nome: "Luna",
    descricao: "Ouvir, ver, escrever.",
    categoria: "sectioned",
    tom: "minimalista",
    capa: "",
    tema: tema({ fundo: "#ffffff", texto: "#111111", destaque: "#111111", largura: "estreita" }),
    blocos: () => [
      bloco("capa", {
        titulo: "Luna",
        subtitulo: "",
        fotoUrl: "",
        cta: "",
        url: "",
        estiloBotao: "texto",
      }),
      botoes([
        { rotulo: "Ouvir", url: "https://spotify.com", estilo: "texto" },
        { rotulo: "Ver", url: "https://youtube.com", estilo: "texto" },
        { rotulo: "Escrever", url: "mailto:luna@email.com", estilo: "texto" },
      ]),
    ],
  }),
  layout({
    id: "links-maximalista",
    nome: "Luna Alves",
    descricao: "Música, podcast, newsletter e a loja.",
    categoria: "sectioned",
    tom: "maximalista",
    capa: IMG_S3("links.jpg"),
    tema: tema({ fundo: "#09090b", texto: "#fafafa", destaque: "#b8ff00", largura: "estreita" }),
    blocos: () => [
      bloco("navegacao", {
        itens: [
          { rotulo: "Início", ancora: "inicio" },
          { rotulo: "Sobre", ancora: "sobre" },
          { rotulo: "Links", ancora: "links" },
          { rotulo: "Loja", ancora: "loja" },
          { rotulo: "Contato", ancora: "contato" },
        ],
      }),
      bloco("secao", { ancora: "inicio", titulo: "", subtitulo: "" }),
      bloco("capa", {
        titulo: "Luna Alves",
        subtitulo: "Música, podcast, newsletter e uma loja que não para quieta.",
        fotoUrl: IMG_S3("links.jpg"),
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
      icones([
        { nome: "Youtube", url: "https://youtube.com", fundo: "#155eff", animacao: "pulso" },
        { nome: "Instagram", url: "https://instagram.com", fundo: "#1d1d1f", animacao: "flutuar" },
        { nome: "Music", url: "https://spotify.com", fundo: "#b8ff00", cor: "#111", animacao: "pular" },
        { nome: "Podcast", url: "https://", fundo: "#7c3aed", animacao: "pulso" },
        { nome: "Mail", url: "mailto:luna@email.com", fundo: "#ff2d55", animacao: "nenhuma" },
      ]),
      bloco("secao", { ancora: "sobre", titulo: "Sobre", subtitulo: "O que rola agora." }),
      bloco("texto", { titulo: "", corpo: "Gravo às terças. O resto é ensaio, café e responder quem escreve por aqui." }),
      bloco("texto", { titulo: "Turnê", corpo: "Outubro no sul. Novembro no nordeste. Ingresso no botão da seção Links." }),
      bloco("secao", { ancora: "links", titulo: "Links", subtitulo: "" }),
      botoes([
        { rotulo: "Último episódio", url: "https://youtube.com", estilo: "preenchido" },
        { rotulo: "Newsletter", url: "https://", estilo: "contorno" },
        { rotulo: "Instagram", url: "https://instagram.com", estilo: "contorno" },
        { rotulo: "Spotify", url: "https://spotify.com", estilo: "texto" },
      ]),
      bloco("secao", { ancora: "loja", titulo: "Loja", subtitulo: "Disco, camiseta, zine." }),
      galeria(["portfolio-1.jpg", "portfolio-2.jpg", "portfolio-3.jpg"]),
      botoes([{ rotulo: "Abrir a loja", url: "https://", estilo: "preenchido" }]),
      bloco("secao", { ancora: "contato", titulo: "Contato", subtitulo: "Shows e collab." }),
      form({ destEmail: "luna@email.com", assunto: "Oi, Luna", botao: "Enviar" }),
      bloco("rodape", { texto: "© Luna Alves" }),
    ],
  }),
];

const BRANCOS = [
  layout({
    id: "em-branco-criativo",
    nome: "Página violeta",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "criativo",
    capa: "",
    tema: tema({ fundo: "#1b0633", texto: "#ffe8ff", destaque: "#ff2bd6", fonte: "serif" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" })],
  }),
  layout({
    id: "em-branco-colorido",
    nome: "Página amarela",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "colorido",
    capa: "",
    tema: tema({ fundo: "#ffe600", texto: "#111111", destaque: "#5b21ff" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" })],
  }),
  layout({
    id: "em-branco-sobrio",
    nome: "Página areia",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "sobrio",
    capa: "",
    tema: tema({ fundo: "#ebe6dc", texto: "#2f2b26", destaque: "#6f675e", fonte: "serif" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" })],
  }),
  layout({
    id: "em-branco-serio",
    nome: "Página marinho",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "serio",
    capa: "",
    tema: tema({ fundo: "#0b1220", texto: "#e8e6e1", destaque: "#c5a572", alinhamento: "esquerda" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" })],
  }),
  layout({
    id: "em-branco-minimalista",
    nome: "Página branca",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "minimalista",
    capa: "",
    tema: tema({ fundo: "#ffffff", texto: "#111111", destaque: "#111111", largura: "estreita" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "texto" })],
  }),
  layout({
    id: "em-branco-maximalista",
    nome: "Página neon",
    descricao: "Comece do zero neste fundo.",
    categoria: "todos",
    tom: "maximalista",
    capa: "",
    tema: tema({ fundo: "#0b0b10", texto: "#fafafa", destaque: "#ff3b00", largura: "larga" }),
    blocos: () => [bloco("capa", { titulo: "Título", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" })],
  }),
];

export const LAYOUTS_EXTRA = [...LANDING, ...FORMULARIO, ...PORTFOLIO, ...LINKS];
