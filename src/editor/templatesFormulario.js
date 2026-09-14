// Formulários com composição própria — inspirados no Carrd (#form).
import { iconePadrao } from "./icones";

const IMG = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

function bloco(tipo, props) {
  return { id: crypto.randomUUID(), tipo, props };
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

function dataDaqui(dias) {
  const data = new Date(Date.now() + dias * 86400000);
  data.setMinutes(0, 0, 0);
  const pad = (valor) => String(valor).padStart(2, "0");
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
}

function form(extra = {}) {
  return bloco("formulario", {
    destEmail: "oi@email.com",
    assunto: "Contato",
    placeholder: "seu@email.com",
    botao: "Enviar",
    mostrarNome: false,
    mostrarMensagem: false,
    ...extra,
  });
}

export const TEMPLATES_FORMULARIO = [
  {
    id: "form-orbit",
    nome: "Orbit",
    descricao: "Coming soon em cartão: texto, e-mail e contagem regressiva.",
    categoria: "formulario",
    tom: "serio",
    plano: "ultra",
    capa: IMG("landing.jpg"),
    tema: {
      fundoModo: "degrade",
      fundoDe: "#0b1220",
      fundoPara: "#1a2740",
      fundoAngulo: 165,
      texto: "#e8eef6",
      destaque: "#7CFC9A",
      fonte: "mono",
      alinhamento: "centro",
      largura: "estreita",
      casca: "cartao",
      cascaFundo: "rgba(18,24,36,0.92)",
      cascaCor: "#e8eef6",
      cascaRaio: 28,
      cascaBorda: "rgba(255,255,255,0.08)",
      cascaSombra: "0 30px 80px rgba(0,0,0,0.45)",
      textura: "brilho",
      botao: "suave",
      iconeForma: "circulo",
      tituloForma: "caps",
      tinta: "#e8eef6",
      estilo: "custom-orbit",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "centro",
        titulo: "Em breve",
        subtitulo: "Estamos fechando os últimos detalhes. Deixa o e-mail — avisamos no dia.",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      form({
        titulo: "",
        assunto: "Orbit lista",
        botao: "Avisar-me",
        campos: [
          campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
        ],
      }),
      bloco("icones", {
        layoutId: "centro",
        itens: [
          iconePadrao({ nome: "Instagram", url: "https://instagram.com", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
          iconePadrao({ nome: "Twitter", url: "https://twitter.com", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
          iconePadrao({ nome: "Mail", url: "mailto:oi@email.com", fundo: "rgba(255,255,255,0.08)", animacao: "nenhuma" }),
        ],
      }),
      bloco("contador", {
        layoutId: "caixas",
        titulo: "",
        alvo: dataDaqui(45),
        mostrarSegundos: true,
        textoFim: "Chegou o dia.",
        corCaixa: "rgba(124,252,154,0.12)",
      }),
    ],
  },

  {
    id: "form-lumen",
    nome: "Lumen",
    descricao: "Split: explicação à esquerda, formulário à direita.",
    categoria: "formulario",
    tom: "serio",
    plano: "free",
    capa: IMG("form.jpg"),
    tema: {
      fundo: "#f3f1ec",
      texto: "#1c1917",
      destaque: "#c45c8a",
      fonte: "sans",
      alinhamento: "esquerda",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "simples",
      tituloForma: "pesado",
      tinta: "#1c1917",
      estilo: "custom-lumen",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 2,
        proporcao: "iguais",
        gap: 36,
        celulas: [
          celula([
            bloco("texto", {
              titulo: "Lumen",
              tamanhoTitulo: "enorme",
              corpo: "Newsletter quinzenal sobre produto e escrita. Sem pitch. Sem thread.",
            }),
            bloco("texto", {
              titulo: "",
              corpo: "Uma carta. Um tema. Links só quando valem a pena.",
              tamanhoTexto: "pequeno",
            }),
          ]),
          celula([
            form({
              titulo: "Assinar",
              assunto: "Lumen newsletter",
              botao: "Entrar na lista",
              campos: [
                campo({ tipo: "texto", rotulo: "Nome", placeholder: "Como te chamamos" }),
                campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
              ],
            }),
          ]),
        ],
      }),
    ],
  },

  {
    id: "form-carta",
    nome: "Carta",
    descricao: "Cartão editorial serifado — contato clássico e contido.",
    categoria: "formulario",
    tom: "editorial",
    plano: "pro",
    capa: IMG("form.jpg"),
    tema: {
      fundo: "#1a1a1a",
      texto: "#1a1714",
      destaque: "#8a5a2b",
      fonte: "editorial",
      alinhamento: "centro",
      largura: "estreita",
      casca: "cartao",
      cascaFundo: "#f6f1e8",
      cascaCor: "#1a1714",
      cascaRaio: 4,
      cascaBorda: "rgba(26,23,20,0.12)",
      cascaSombra: "0 24px 60px rgba(0,0,0,0.35)",
      textura: "nenhuma",
      botao: "linha",
      iconeForma: "simples",
      tituloForma: "caps",
      tinta: "#1a1714",
      estilo: "custom-carta",
    },
    blocos: () => [
      bloco("capa", {
        titulo: "Escreva",
        subtitulo: "Leio tudo. Respondo no dia útil seguinte — sem plantão, sem automação.",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      form({
        titulo: "",
        assunto: "Carta",
        botao: "Enviar carta",
        campos: [
          campo({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome" }),
          campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
          campo({ tipo: "area", rotulo: "Mensagem", placeholder: "O que precisa dizer" }),
        ],
      }),
    ],
  },

  {
    id: "form-agenda",
    nome: "Agenda",
    descricao: "Agendamento com tipo de serviço, data preferida e recado.",
    categoria: "formulario",
    tom: "serio",
    plano: "pro",
    capa: IMG("form.jpg"),
    tema: {
      fundo: "#f7f8fa",
      texto: "#12141a",
      destaque: "#1a4fd6",
      fonte: "moderna",
      alinhamento: "esquerda",
      largura: "estreita",
      casca: "cartao",
      cascaFundo: "#ffffff",
      cascaCor: "#12141a",
      cascaRaio: 20,
      cascaBorda: "rgba(18,20,26,0.08)",
      cascaSombra: "0 20px 50px rgba(18,20,26,0.08)",
      textura: "nenhuma",
      botao: "suave",
      iconeForma: "quadrado",
      tituloForma: "pesado",
      tinta: "#12141a",
      estilo: "custom-agenda",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "esquerda",
        titulo: "Agendar conversa",
        subtitulo: "30 minutos. Sem proposta genérica — traz o contexto.",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      form({
        titulo: "",
        assunto: "Agendamento",
        botao: "Pedir horário",
        campos: [
          campo({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome", obrigatorio: true }),
          campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
          campo({
            tipo: "lista",
            rotulo: "Assunto",
            placeholder: "Escolha",
            obrigatorio: true,
            opcoes: "Demonstração\nConsultoria\nParceria\nOutro",
          }),
          campo({ tipo: "texto", rotulo: "Preferência de data", placeholder: "Ex.: terça de manhã" }),
          campo({ tipo: "area", rotulo: "Contexto", placeholder: "O que você precisa resolver" }),
        ],
      }),
      bloco("texto", {
        titulo: "",
        corpo: "Confirmação por e-mail em até um dia útil.",
        tamanhoTexto: "pequeno",
      }),
    ],
  },

  {
    id: "form-inbox",
    nome: "Inbox",
    descricao: "Contato sério com foto ao lado — estúdio ou escritório.",
    categoria: "formulario",
    tom: "serio",
    plano: "free",
    capa: IMG("perfil.jpg"),
    tema: {
      fundo: "#0c0c0e",
      texto: "#f4f4f5",
      destaque: "#e8d5b5",
      fonte: "grotesk",
      alinhamento: "esquerda",
      largura: "media",
      casca: "coluna",
      textura: "nenhuma",
      botao: "reto",
      iconeForma: "simples",
      tituloForma: "pesado",
      tinta: "#f4f4f5",
      estilo: "custom-inbox",
    },
    blocos: () => [
      bloco("grade", {
        colunas: 2,
        proporcao: "direita",
        gap: 28,
        celulas: [
          celula([
            bloco("imagem", { url: IMG("perfil.jpg"), alt: "Estúdio", caption: "", raio: 12 }),
          ]),
          celula([
            bloco("texto", {
              titulo: "Fale com o estúdio",
              corpo: "Projetos novos a partir de março. Briefing curto, resposta direta.",
            }),
            form({
              titulo: "",
              destEmail: "estudio@email.com",
              assunto: "Inbox estúdio",
              botao: "Enviar",
              campos: [
                campo({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome" }),
                campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
                campo({ tipo: "area", rotulo: "Projeto", placeholder: "Prazo, orçamento e referências" }),
              ],
            }),
          ]),
        ],
      }),
    ],
  },

  {
    id: "form-echo",
    nome: "Echo",
    descricao: "Pesquisa de feedback com notas e comentário.",
    categoria: "formulario",
    tom: "produto",
    plano: "pro",
    capa: IMG("form.jpg"),
    tema: {
      fundo: "#eef2ff",
      texto: "#1e1b4b",
      destaque: "#4f46e5",
      fonte: "moderna",
      alinhamento: "centro",
      largura: "estreita",
      casca: "cartao",
      cascaFundo: "#ffffff",
      cascaCor: "#1e1b4b",
      cascaRaio: 24,
      cascaBorda: "rgba(30,27,75,0.08)",
      cascaSombra: "0 22px 55px rgba(79,70,229,0.12)",
      textura: "nenhuma",
      botao: "pilula",
      iconeForma: "circulo",
      tituloForma: "leve",
      tinta: "#1e1b4b",
      estilo: "custom-echo",
    },
    blocos: () => [
      bloco("capa", {
        titulo: "Como foi a experiência?",
        subtitulo: "Dois minutos. Sem cadastro. A gente lê cada resposta.",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      form({
        titulo: "",
        assunto: "Feedback Echo",
        botao: "Enviar feedback",
        campos: [
          campo({
            tipo: "lista",
            rotulo: "Nota geral",
            placeholder: "Escolha",
            obrigatorio: true,
            opcoes: "5 — Excelente\n4 — Boa\n3 — Ok\n2 — Fraca\n1 — Ruim",
          }),
          campo({
            tipo: "lista",
            rotulo: "Você indicaria?",
            placeholder: "Escolha",
            obrigatorio: true,
            opcoes: "Sim\nTalvez\nNão",
          }),
          campo({ tipo: "area", rotulo: "O que melhorar", placeholder: "Seja específico — ajuda mais" }),
          campo({ tipo: "email", rotulo: "E-mail (opcional)", placeholder: "se quiser retorno" }),
        ],
      }),
    ],
  },

  {
    id: "form-folha",
    nome: "Folha",
    descricao: "Minimalista: uma frase e um campo de e-mail.",
    categoria: "formulario",
    tom: "minimalista",
    plano: "free",
    capa: "",
    tema: {
      fundo: "#ffffff",
      texto: "#111111",
      destaque: "#111111",
      fonte: "sans",
      alinhamento: "centro",
      largura: "estreita",
      casca: "coluna",
      textura: "nenhuma",
      botao: "linha",
      iconeForma: "simples",
      tituloForma: "leve",
      tinta: "#111111",
      estilo: "custom-folha",
    },
    blocos: () => [
      bloco("capa", {
        titulo: "Uma lista.",
        subtitulo: "",
        fotoUrl: "",
        cta: "",
        url: "",
      }),
      form({
        titulo: "",
        assunto: "Lista Folha",
        botao: "Quero",
        campos: [
          campo({ tipo: "email", rotulo: "", placeholder: "seu@email.com", obrigatorio: true }),
        ],
      }),
    ],
  },

  {
    id: "form-atelier",
    nome: "Atelier",
    descricao: "Pedido de orçamento sobre foto full-bleed com formulário em vidro.",
    categoria: "formulario",
    tom: "foto",
    plano: "pro",
    capa: IMG("landing.jpg"),
    tema: {
      fundoModo: "degrade",
      fundoDe: "#2a3038",
      fundoPara: "#6b7280",
      fundoAngulo: 180,
      texto: "#ffffff",
      destaque: "#ffffff",
      fonte: "sans",
      alinhamento: "centro",
      largura: "estreita",
      casca: "vidro",
      cascaRaio: 24,
      cascaBorda: "rgba(255,255,255,0.22)",
      textura: "nenhuma",
      botao: "vidro",
      iconeForma: "vidro",
      tituloForma: "pesado",
      tinta: "#ffffff",
      estilo: "custom-atelier",
    },
    blocos: () => [
      bloco("capa", {
        layoutId: "fullbleed",
        titulo: "Atelier",
        subtitulo: "Ensaios e campanhas. Conta o que precisa — a gente responde com disponibilidade.",
        fotoUrl: IMG("landing.jpg"),
        cta: "",
        url: "",
        minAltura: 280,
        raio: 20,
        paddingCima: 36,
        paddingBaixo: 24,
      }),
      form({
        titulo: "Pedido",
        destEmail: "atelier@email.com",
        assunto: "Orçamento Atelier",
        botao: "Enviar pedido",
        campos: [
          campo({ tipo: "texto", rotulo: "Nome", placeholder: "Seu nome", obrigatorio: true }),
          campo({ tipo: "email", rotulo: "E-mail", placeholder: "seu@email.com", obrigatorio: true }),
          campo({ tipo: "texto", rotulo: "Cidade / data", placeholder: "Onde e quando" }),
          campo({ tipo: "area", rotulo: "Briefing", placeholder: "Tipo de ensaio, referências, orçamento" }),
        ],
      }),
    ],
  },
];
