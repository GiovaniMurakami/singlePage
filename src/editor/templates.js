import { iconePadrao } from "./icones";
import { aplicarCaixaNaParte } from "./partes";
import { LAYOUTS_EXTRA } from "./templatesLayouts";

function bloco(tipo, props) {
  return { id: crypto.randomUUID(), tipo, props };
}

export const TEMA_PADRAO = {
  fundo: "#0b0b10",
  texto: "#f4f4f5",
  destaque: "#155eff",
  fonte: "sans",
  alinhamento: "centro",
  largura: "media",
};

export const IMG_S3 = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

export const CATEGORIAS = [
  { id: "todos", nome: "Todos" },
  { id: "perfil", nome: "Perfil" },
  { id: "landing", nome: "Landing" },
  { id: "formulario", nome: "Formulário" },
  { id: "portfolio", nome: "Portfólio" },
  { id: "sectioned", nome: "Seções" },
];

export const TIPOS_ESTRUTURA = [
  { tipo: "secao", nome: "Seção", descricao: "Agrupa colunas e peças", icone: "Rows3" },
  { tipo: "grade", nome: "Colunas", descricao: "Duas, três ou quatro frentes", icone: "Columns2" },
  { tipo: "faixa", nome: "Faixa", descricao: "Faixa larga com fundo próprio", icone: "RectangleHorizontal" },
];

export const TIPOS_PECA = [
  { tipo: "capa", nome: "Capa", descricao: "Foto, título e um botão", icone: "User" },
  { tipo: "texto", nome: "Texto", descricao: "Título e parágrafo", icone: "Type" },
  { tipo: "imagem", nome: "Imagem", descricao: "Uma foto", icone: "Image" },
  { tipo: "botoes", nome: "Botões", descricao: "Links com estilo", icone: "MousePointerClick" },
  { tipo: "formulario", nome: "Formulário", descricao: "Envia para o seu e-mail", icone: "Mail" },
  { tipo: "galeria", nome: "Galeria", descricao: "Várias fotos", icone: "Images" },
  { tipo: "redes", nome: "Redes", descricao: "Instagram, site, etc.", icone: "Share2" },
  { tipo: "icones", nome: "Ícones", descricao: "Cor, fundo e animação", icone: "Sparkles" },
  { tipo: "navegacao", nome: "Menu", descricao: "Pula para seções da página", icone: "Menu" },
  { tipo: "cartoes", nome: "Cartões", descricao: "Grade de cards com ícone e texto", icone: "LayoutGrid" },
  { tipo: "depoimentos", nome: "Depoimentos", descricao: "Frases de quem já usou", icone: "Quote" },
  { tipo: "rodape", nome: "Rodapé", descricao: "Linha final da página", icone: "Minus" },
];

export const TIPOS_BLOCO = [...TIPOS_ESTRUTURA, ...TIPOS_PECA];

export const TIPOS_SIMPLES = TIPOS_PECA.map((item) => item.tipo);

const TIPOS_ESTRUTURA_IDS = new Set(TIPOS_ESTRUTURA.map((item) => item.tipo));

export function ehTipoEstrutura(tipo) {
  return TIPOS_ESTRUTURA_IDS.has(tipo);
}

export function nomeDoTipo(tipo) {
  return TIPOS_BLOCO.find((item) => item.tipo === tipo)?.nome || tipo;
}

export const ESTILOS_BOTAO = [
  { id: "preenchido", nome: "Preenchido" },
  { id: "contorno", nome: "Contorno" },
  { id: "texto", nome: "Só texto" },
];

export const TIPOS_CAMPO_FORM = [
  { id: "texto", nome: "Texto" },
  { id: "email", nome: "E-mail" },
  { id: "tel", nome: "Telefone" },
  { id: "area", nome: "Texto longo" },
  { id: "numero", nome: "Número" },
  { id: "url", nome: "Link" },
  { id: "lista", nome: "Lista" },
  { id: "check", nome: "Caixa" },
];

export function campoFormularioPadrao(extras = {}) {
  return {
    id: crypto.randomUUID(),
    tipo: "texto",
    rotulo: "Novo campo",
    placeholder: "",
    obrigatorio: false,
    opcoes: "",
    ...extras,
  };
}

export function camposDoFormulario(props = {}) {
  if (Array.isArray(props.campos) && props.campos.length) return props.campos;
  const campos = [];
  if (props.mostrarNome !== false) {
    campos.push({ id: "nome", tipo: "texto", rotulo: "Nome", placeholder: "Seu nome", obrigatorio: false });
  }
  campos.push({
    id: "email",
    tipo: "email",
    rotulo: "E-mail",
    placeholder: props.placeholder || "seu@email.com",
    obrigatorio: true,
  });
  if (props.mostrarMensagem !== false) {
    campos.push({ id: "mensagem", tipo: "area", rotulo: "Mensagem", placeholder: "Sua mensagem", obrigatorio: false });
  }
  return campos;
}

export function botaoPadrao(extras = {}) {
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

export function blocoPadrao(tipo) {
  const padroes = {
    capa: {
      layoutId: "centro",
      titulo: "Sua página",
      subtitulo: "Diga quem você é em uma frase.",
      fotoUrl: "",
      cta: "Fale comigo",
      url: "mailto:oi@email.com",
      estiloBotao: "preenchido",
    },
    texto: {
      titulo: "Sobre",
      corpo: "Escreva o essencial. Depois você publica.",
    },
    imagem: { url: "", alt: "Imagem da página", caption: "" },
    botoes: {
      layoutId: "pilha",
      itens: [
        botaoPadrao({ rotulo: "Instagram", url: "https://instagram.com", estilo: "preenchido" }),
        botaoPadrao({ rotulo: "WhatsApp", url: "https://wa.me/55", estilo: "contorno" }),
      ],
    },
    formulario: {
      titulo: "Escreva para mim",
      destEmail: "oi@email.com",
      assunto: "Mensagem pelo site",
      placeholder: "seu@email.com",
      botao: "Enviar",
      mostrarNome: true,
      mostrarMensagem: true,
      campos: [
        campoFormularioPadrao({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome" }),
        campoFormularioPadrao({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
        campoFormularioPadrao({ tipo: "area", rotulo: "Mensagem", placeholder: "Sua mensagem" }),
      ],
    },
    galeria: {
      layoutId: "grade-2",
      urls: [IMG_S3("portfolio-1.jpg"), IMG_S3("portfolio-2.jpg"), IMG_S3("portfolio-3.jpg")],
    },
    redes: {
      itens: [
        { rotulo: "Instagram", url: "https://instagram.com" },
        { rotulo: "YouTube", url: "https://youtube.com" },
        { rotulo: "E-mail", url: "mailto:oi@email.com" },
      ],
    },
    icones: {
      layoutId: "centro",
      itens: [
        iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#1d1d1f", animacao: "flutuar" }),
        iconePadrao({ nome: "Mail", url: "mailto:oi@email.com", fundo: "#0071e3", animacao: "pulso" }),
        iconePadrao({ nome: "Globe", url: "https://", fundo: "#424245", animacao: "nenhuma" }),
      ],
    },
    navegacao: {
      itens: [
        { rotulo: "Início", ancora: "inicio" },
        { rotulo: "Sobre", ancora: "sobre" },
        { rotulo: "Links", ancora: "links" },
      ],
    },
    secao: {
      ancora: "secao",
      titulo: "Nova seção",
      subtitulo: "",
      blocos: [
        bloco("grade", {
          colunas: 2,
          proporcao: "iguais",
          gap: 24,
          celulas: [
            { id: crypto.randomUUID(), blocos: [] },
            { id: crypto.randomUUID(), blocos: [] },
          ],
        }),
      ],
    },
    depoimentos: {
      layoutId: "lista",
      itens: [{ citacao: "Funcionou na primeira semana.", autor: "Cliente", fotoUrl: "" }],
    },
    divisor: { estilo: "linha" },
    rodape: { texto: "© Você" },
    grade: {
      colunas: 2,
      proporcao: "iguais",
      gap: 24,
      celulas: [
        { id: crypto.randomUUID(), blocos: [] },
        { id: crypto.randomUUID(), blocos: [] },
      ],
    },
    cartoes: {
      layoutId: "grade",
      colunas: 3,
      itens: [
        { icone: "Zap", titulo: "Rápido", corpo: "Uma página no ar no mesmo dia." },
        { icone: "Palette", titulo: "Seu visual", corpo: "Cor, tipo e foto no painel do lado." },
        { icone: "Mail", titulo: "Chega no e-mail", corpo: "O formulário abre pronto na sua caixa." },
      ],
    },
    faixa: {
      layoutId: "centro",
      fundo: "#111111",
      texto: "#f5f5f7",
      destaque: "#7dd3fc",
      titulo: "Uma faixa inteira",
      subtitulo: "Fundo próprio, conteúdo no meio.",
      blocos: [],
    },
  };
  return bloco(tipo, padroes[tipo] || {});
}

export const TEMPLATES = [
  {
    id: "em-branco",
    nome: "Página em branco",
    descricao: "Comece do zero, só com uma capa vazia.",
    categoria: "todos",
    tom: "classico",
    destaque: true,
    capa: "",
    tema: { ...TEMA_PADRAO },
    blocos: () => [
      bloco("capa", {
        titulo: "Título",
        subtitulo: "",
        fotoUrl: "",
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
    ],
  },
  {
    id: "perfil",
    nome: "Perfil",
    descricao: "Quem você é e onde te encontrar.",
    categoria: "perfil",
    tom: "classico",
    destaque: true,
    capa: IMG_S3("perfil.jpg"),
    tema: { ...TEMA_PADRAO, fundo: "#fff7ed", texto: "#111111", destaque: "#ff3b00", largura: "estreita" },
    blocos: () => [
      bloco("capa", {
        titulo: "Ana Costa",
        subtitulo: "Design e direção de arte. Trabalho com marcas que querem parecer o que são.",
        fotoUrl: IMG_S3("perfil.jpg"),
        cta: "Enviar e-mail",
        url: "mailto:ana@email.com",
        estiloBotao: "preenchido",
      }),
      bloco("icones", {
        itens: [
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#1d1d1f", animacao: "flutuar" }),
          iconePadrao({ nome: "Linkedin", url: "https://linkedin.com", fundo: "#0071e3", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:ana@email.com", fundo: "#424245", animacao: "pulso" }),
        ],
      }),
      bloco("texto", {
        titulo: "Agora",
        corpo: "Aberta para projetos pontuais e consultoria de identidade. Respondo em até dois dias.",
      }),
    ],
  },
  {
    id: "landing",
    nome: "Landing",
    descricao: "Produto, o que ele faz e como pegar.",
    categoria: "landing",
    tom: "classico",
    destaque: true,
    capa: IMG_S3("landing.jpg"),
    tema: { ...TEMA_PADRAO, fundo: "#020617", texto: "#f8fafc", destaque: "#00e5ff", fonte: "sans", largura: "media" },
    blocos: () => [
      bloco("imagem", { url: IMG_S3("landing.jpg"), alt: "Produto", caption: "" }),
      bloco("capa", {
        titulo: "O app que organiza o seu dia",
        subtitulo: "Uma lista, um calendário e um lembrete. Sem dashboard, sem ruído.",
        fotoUrl: "",
        cta: "Começar grátis",
        url: "#formulario",
        estiloBotao: "preenchido",
        novaAba: false,
      }),
      bloco("texto", {
        titulo: "O essencial",
        corpo: "Cadastre tarefas em 10 segundos. Veja o dia de relance. Receba um aviso só no que importa.",
      }),
      bloco("texto", {
        titulo: "Para quem",
        corpo: "Freelancers e times pequenos que cansaram de ferramenta cheia de aba.",
      }),
      bloco("formulario", {
        titulo: "Entre na lista",
        destEmail: "oi@email.com",
        assunto: "Quero o app",
        placeholder: "seu@email.com",
        botao: "Quero acesso",
        mostrarNome: true,
        mostrarMensagem: false,
      }),
    ],
  },
  {
    id: "formulario",
    nome: "Formulário",
    descricao: "Página inteira para receber recados no e-mail.",
    categoria: "formulario",
    tom: "classico",
    destaque: true,
    capa: IMG_S3("form.jpg"),
    tema: { ...TEMA_PADRAO, fundo: "#fff1f2", texto: "#111111", destaque: "#ff2d55", alinhamento: "esquerda", largura: "estreita" },
    blocos: () => [
      bloco("capa", {
        titulo: "Vamos conversar",
        subtitulo: "Orçamento, dúvida ou só um oi. A mensagem cai no meu e-mail.",
        fotoUrl: "",
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
      bloco("formulario", {
        titulo: "Sua mensagem",
        destEmail: "oi@email.com",
        assunto: "Contato pelo site",
        placeholder: "seu@email.com",
        botao: "Enviar para meu e-mail",
        mostrarNome: true,
        mostrarMensagem: true,
      }),
      bloco("texto", {
        titulo: "",
        corpo: "Respondo em horário comercial. Se for urgente, use o WhatsApp no rodapé.",
      }),
      bloco("botoes", {
        itens: [
          botaoPadrao({ rotulo: "WhatsApp", url: "https://wa.me/55", estilo: "contorno", novaAba: true }),
        ],
      }),
    ],
  },
  {
    id: "portfolio",
    nome: "Portfólio",
    descricao: "Fotos e trabalhos em grade, com lupa.",
    categoria: "portfolio",
    tom: "classico",
    destaque: true,
    capa: IMG_S3("portfolio-1.jpg"),
    tema: { ...TEMA_PADRAO, fundo: "#09090b", texto: "#fafafa", destaque: "#ff4d00", fonte: "serif", largura: "larga" },
    blocos: () => [
      bloco("capa", {
        titulo: "Estúdio Norte",
        subtitulo: "Fotografia de produto e espaço.",
        fotoUrl: "",
        cta: "Pedir orçamento",
        url: "mailto:estudio@email.com",
        estiloBotao: "contorno",
      }),
      bloco("galeria", {
        urls: [
          IMG_S3("portfolio-1.jpg"),
          IMG_S3("portfolio-2.jpg"),
          IMG_S3("portfolio-3.jpg"),
          IMG_S3("portfolio-4.jpg"),
        ],
      }),
      bloco("texto", {
        titulo: "Seleção recente",
        corpo: "Clique numa foto para ver maior. Troque as imagens pelas suas no painel ao lado.",
      }),
    ],
  },
  {
    id: "links",
    nome: "All my links",
    descricao: "Várias seções numa página: sobre, links e contato.",
    categoria: "sectioned",
    tom: "classico",
    destaque: true,
    capa: IMG_S3("links.jpg"),
    tema: { ...TEMA_PADRAO, fundo: "#09090b", texto: "#fafafa", destaque: "#b8ff00", largura: "estreita" },
    blocos: () => [
      bloco("navegacao", {
        itens: [
          { rotulo: "Início", ancora: "inicio" },
          { rotulo: "Sobre", ancora: "sobre" },
          { rotulo: "Links", ancora: "links" },
          { rotulo: "Contato", ancora: "contato" },
        ],
      }),
      bloco("secao", { ancora: "inicio", titulo: "", subtitulo: "" }),
      bloco("capa", {
        titulo: "Luna Alves",
        subtitulo: "Música, podcast e um newsletter semanal.",
        fotoUrl: IMG_S3("links.jpg"),
        cta: "",
        url: "",
        estiloBotao: "preenchido",
      }),
      bloco("icones", {
        itens: [
          iconePadrao({ nome: "Youtube", url: "https://youtube.com", fundo: "#0071e3", animacao: "pulso" }),
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "#1d1d1f", animacao: "flutuar" }),
          iconePadrao({ nome: "Music", url: "https://spotify.com", fundo: "#0071e3", animacao: "pular" }),
        ],
      }),
      bloco("secao", { ancora: "sobre", titulo: "Sobre", subtitulo: "O que eu faço agora." }),
      bloco("texto", {
        titulo: "",
        corpo: "Gravo às terças. O resto da semana é ensaio, café e responder quem escreve por aqui.",
      }),
      bloco("secao", { ancora: "links", titulo: "Links", subtitulo: "Onde me encontrar." }),
      bloco("botoes", {
        itens: [
          botaoPadrao({ rotulo: "Ouça o último episódio", url: "https://youtube.com", estilo: "preenchido" }),
          botaoPadrao({ rotulo: "Newsletter", url: "https://", estilo: "contorno" }),
          botaoPadrao({ rotulo: "Instagram", url: "https://instagram.com", estilo: "contorno" }),
          botaoPadrao({ rotulo: "Spotify", url: "https://spotify.com", estilo: "texto" }),
        ],
      }),
      bloco("secao", { ancora: "contato", titulo: "Contato", subtitulo: "Manda um recado." }),
      bloco("formulario", {
        titulo: "",
        destEmail: "luna@email.com",
        assunto: "Oi, Luna",
        placeholder: "seu@email.com",
        botao: "Enviar",
        mostrarNome: true,
        mostrarMensagem: true,
      }),
    ],
  },
  ...LAYOUTS_EXTRA,
];

export function buscarTemplate(id) {
  return TEMPLATES.find((item) => item.id === id) || TEMPLATES[0];
}

export function templateMostraDemo(template) {
  if (!template || template.id.startsWith("em-branco")) return false;
  const blocos = template.blocos();
  const tipos = new Set(blocos.map((item) => item.tipo));
  if (tipos.has("galeria") || tipos.has("navegacao")) return true;
  if (tipos.has("imagem") && blocos.length >= 4) return true;
  return false;
}

export function paginaDeTemplate(templateId, titulo) {
  const template = buscarTemplate(templateId);
  const nome = titulo || template.nome;
  return {
    id: "rascunho-local",
    titulo: nome,
    slug: slugify(nome),
    publicada: false,
    tema: { ...template.tema },
    blocos: template.blocos(),
    templateId: template.id,
  };
}

export function paginaInicial(titulo = "Minha página") {
  return paginaDeTemplate("perfil", titulo);
}

export function slugify(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "minha-pagina";
}

export function aplicarImagemNoBloco(bloco, url, destino = "url") {
  if (destino === "fotoUrl") {
    return { ...bloco, props: { ...bloco.props, fotoUrl: url } };
  }
  if (destino === "galeria") {
    return { ...bloco, props: { ...bloco.props, urls: [...(bloco.props.urls || []), url] } };
  }
  if (destino === "fundoImagem") {
    return { ...bloco, props: { ...bloco.props, fundoModo: "imagem", fundoImagem: url } };
  }
  if (String(destino).startsWith("parteFundo:")) {
    const parteId = String(destino).slice("parteFundo:".length);
    return aplicarCaixaNaParte(bloco, { id: parteId }, { fundoModo: "imagem", fundoImagem: url });
  }
  if (String(destino).startsWith("depoimento:")) {
    const indice = Number(String(destino).split(":")[1]);
    const itens = [...(bloco.props.itens || [])];
    if (!itens[indice]) return bloco;
    itens[indice] = { ...itens[indice], fotoUrl: url };
    return { ...bloco, props: { ...bloco.props, itens } };
  }
  return { ...bloco, props: { ...bloco.props, url } };
}
