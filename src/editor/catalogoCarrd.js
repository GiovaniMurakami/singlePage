import { iconePadrao } from "./icones";

const TEMA = {
  fundo: "#0b0b10",
  texto: "#f4f4f5",
  destaque: "#155eff",
  fonte: "sans",
  alinhamento: "centro",
  largura: "media",
};

const IMG = (arquivo) =>
  `https://singlepage-bucket-images.s3.us-east-1.amazonaws.com/templates/${arquivo}`;

function botao(extras = {}) {
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
  return { ...TEMA, ...extra };
}

function icones(itens) {
  return bloco("icones", { itens: itens.map((item) => iconePadrao(item)) });
}

function botoes(itens) {
  return bloco("botoes", { itens: itens.map((item) => botao(item)) });
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
  return bloco("galeria", { urls: arquivos.map(IMG) });
}

function item({ id, nome, descricao, categoria, tom = "classico", capa, tema: temaPagina, blocos }) {
  return { id, nome, descricao, categoria, tom, capa, destaque: false, tema: temaPagina, blocos };
}

const PERFIL = [
  item({
    id: "carrd-bio-links",
    nome: "Bio links",
    descricao: "Foto, nome e uma pilha de links. O clássico de perfil.",
    categoria: "perfil",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#ffffff", texto: "#111111", destaque: "#111111", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Maya Lin", subtitulo: "Direção de arte e foto.", fotoUrl: IMG("perfil.jpg"), cta: "", url: "", estiloBotao: "preenchido" }),
      botoes([
        { rotulo: "Portfólio", url: "https://", estilo: "preenchido" },
        { rotulo: "Instagram", url: "https://instagram.com", estilo: "contorno" },
        { rotulo: "E-mail", url: "mailto:maya@email.com", estilo: "contorno" },
      ]),
    ],
  }),
  item({
    id: "carrd-bio-escuro",
    nome: "Bio escura",
    descricao: "Fundo preto, botões claros, um único recado.",
    categoria: "perfil",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#0a0a0a", texto: "#f5f5f5", destaque: "#f5f5f5", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Nico Vale", subtitulo: "Música e mix.", fotoUrl: IMG("links.jpg"), cta: "Ouvir agora", url: "https://", estiloBotao: "preenchido" }),
      icones([
        { nome: "Instagram", url: "https://instagram.com", fundo: "#222", animacao: "nenhuma" },
        { nome: "Youtube", url: "https://youtube.com", fundo: "#222", animacao: "nenhuma" },
        { nome: "Mail", url: "mailto:nico@email.com", fundo: "#222", animacao: "nenhuma" },
      ]),
    ],
  }),
  item({
    id: "carrd-bio-areia",
    nome: "Bio areia",
    descricao: "Serifada, quente, sem pressa.",
    categoria: "perfil",
    tom: "sobrio",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#efe6d6", texto: "#2c2418", destaque: "#8a5a2b", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Clara Mota", subtitulo: "Escrita e pesquisa.", fotoUrl: "", cta: "Ler o newsletter", url: "https://", estiloBotao: "texto" }),
      bloco("texto", { titulo: "", corpo: "Ensaio quinzenal sobre cidade, arquivo e o que sobra depois da pauta." }),
    ],
  }),
  item({
    id: "carrd-bio-esquerda",
    nome: "Nome à esquerda",
    descricao: "Texto grande, alinhado, quase cartaz.",
    categoria: "perfil",
    tom: "serio",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#111827", texto: "#f8fafc", destaque: "#fbbf24", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Rafael Ortiz", subtitulo: "Arquitetura de interiores. São Paulo e remoto.", fotoUrl: "", cta: "Pedir visita", url: "mailto:rafa@email.com", estiloBotao: "preenchido" }),
      bloco("texto", { titulo: "Agora", corpo: "Dois apartamentos e um café. Agenda nova em outubro." }),
    ],
  }),
  item({
    id: "carrd-bio-pastel",
    nome: "Bio pastel",
    descricao: "Rosa claro, ícones e um botão só.",
    categoria: "perfil",
    tom: "colorido",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#ffe4ef", texto: "#3b1020", destaque: "#e11d48", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Lívia Cho", subtitulo: "Unhas, cor e horário marcado.", fotoUrl: IMG("perfil.jpg"), cta: "Agendar", url: "https://", estiloBotao: "preenchido" }),
      icones([
        { nome: "Instagram", url: "https://instagram.com", fundo: "#e11d48", animacao: "pulso" },
        { nome: "Mail", url: "mailto:livia@email.com", fundo: "#3b1020", animacao: "nenhuma" },
      ]),
    ],
  }),
  item({
    id: "carrd-bio-verde",
    nome: "Bio hortelã",
    descricao: "Fundo menta e tipo preta.",
    categoria: "perfil",
    tom: "colorido",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#c6f6d5", texto: "#052e16", destaque: "#052e16", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Tomé Reis", subtitulo: "Paisagismo de varanda e quintal pequeno.", fotoUrl: "", cta: "Ver projetos", url: "https://", estiloBotao: "contorno" }),
      bloco("texto", { titulo: "", corpo: "Planto o que cabe no vaso e no tempo de quem viaja." }),
    ],
  }),
  item({
    id: "carrd-bio-foto-fundo",
    nome: "Retrato no fundo",
    descricao: "A página é a foto. Texto por cima.",
    categoria: "perfil",
    tom: "criativo",
    capa: IMG("perfil.jpg"),
    tema: tema({
      fundo: "#111111",
      texto: "#ffffff",
      destaque: "#ffffff",
      largura: "estreita",
      fundoModo: "imagem",
      fundoImagem: IMG("perfil.jpg"),
      fundoOverlay: "#00000099",
    }),
    blocos: () => [
      bloco("capa", { titulo: "Eva Shore", subtitulo: "Foto de palco e retrato.", fotoUrl: "", cta: "Reservar data", url: "mailto:eva@email.com", estiloBotao: "contorno" }),
    ],
  }),
  item({
    id: "carrd-bio-icones",
    nome: "Só os ícones",
    descricao: "Nome curto e três atalhos.",
    categoria: "perfil",
    tom: "minimalista",
    capa: IMG("perfil.jpg"),
    tema: tema({ fundo: "#f4f4f5", texto: "#18181b", destaque: "#18181b", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Kim", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "texto" }),
      icones([
        { nome: "Instagram", url: "https://instagram.com", fundo: "#18181b", animacao: "nenhuma" },
        { nome: "Globe", url: "https://", fundo: "#18181b", animacao: "nenhuma" },
        { nome: "Mail", url: "mailto:kim@email.com", fundo: "#18181b", animacao: "nenhuma" },
      ]),
    ],
  }),
];

const LANDING = [
  item({
    id: "carrd-waitlist",
    nome: "Lista de espera",
    descricao: "Uma frase, um e-mail, um botão.",
    categoria: "landing",
    capa: IMG("landing.jpg"),
    tema: tema({ fundo: "#0b1220", texto: "#e2e8f0", destaque: "#38bdf8", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "O calendário que cabe no bolso", subtitulo: "Sem reunião. Sem dashboard. Só o dia.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "Entra na lista", botao: "Quero o convite", mostrarMensagem: false, assunto: "Lista de espera" }),
    ],
  }),
  item({
    id: "carrd-app",
    nome: "App",
    descricao: "Tela do produto e um CTA.",
    categoria: "landing",
    capa: IMG("landing.jpg"),
    tema: tema({ fundo: "#f8fafc", texto: "#0f172a", destaque: "#4f46e5", largura: "media" }),
    blocos: () => [
      bloco("imagem", { url: IMG("landing.jpg"), alt: "App", caption: "" }),
      bloco("capa", { titulo: "Anota e esquece", subtitulo: "Uma lista que some quando o dia acaba.", fotoUrl: "", cta: "Baixar o app", url: "https://", estiloBotao: "preenchido" }),
      bloco("cartoes", {
        colunas: 3,
        itens: [
          { icone: "Zap", titulo: "Rápido", corpo: "Abre e já escreve." },
          { icone: "Moon", titulo: "Some à noite", corpo: "O dia vira página." },
          { icone: "Bell", titulo: "Um aviso", corpo: "Só no que importa." },
        ],
      }),
    ],
  }),
  item({
    id: "carrd-curso",
    nome: "Curso",
    descricao: "O que você ensina e como entrar.",
    categoria: "landing",
    tom: "serio",
    capa: IMG("landing.jpg"),
    tema: tema({ fundo: "#1c1917", texto: "#fafaf9", destaque: "#f59e0b", fonte: "serif", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Tipografia para quem já desenha", subtitulo: "Seis aulas. Sem módulo de ‘mindset’.", fotoUrl: "", cta: "Ver a ementa", url: "#formulario", estiloBotao: "preenchido" }),
      bloco("texto", { titulo: "Para quem", corpo: "Designers que cansaram de fonte ‘bonitinha’ sem critério." }),
      form({ titulo: "Quero a próxima turma", botao: "Avisem-me", mostrarMensagem: false }),
    ],
  }),
  item({
    id: "carrd-estudio",
    nome: "Estúdio",
    descricao: "Serviço, recorte e contato.",
    categoria: "landing",
    tom: "sobrio",
    capa: IMG("portfolio-1.jpg"),
    tema: tema({ fundo: "#f5f0e8", texto: "#1c1917", destaque: "#1c1917", fonte: "serif", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Estúdio Barra", subtitulo: "Identidade para marcas pequenas que já têm voz.", fotoUrl: "", cta: "Pedir conversa", url: "mailto:oi@estudio.com", estiloBotao: "contorno" }),
      bloco("texto", { titulo: "Como entra", corpo: "Um briefing de uma página. Uma proposta. Sem deck de 40 slides." }),
      bloco("depoimentos", { itens: [{ citacao: "Eles cortaram metade do texto e a marca ficou mais clara.", autor: "Cliente", fotoUrl: "" }] }),
    ],
  }),
  item({
    id: "carrd-evento",
    nome: "Evento",
    descricao: "Data, lugar e inscrição.",
    categoria: "landing",
    tom: "maximalista",
    capa: IMG("landing.jpg"),
    tema: tema({ fundo: "#3b0764", texto: "#faf5ff", destaque: "#facc15", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Noite de prova", subtitulo: "12 de novembro · São Paulo · 40 pessoas.", fotoUrl: "", cta: "Garantir lugar", url: "#formulario", estiloBotao: "preenchido" }),
      bloco("texto", { titulo: "O que rola", corpo: "Três pratos, um vinho e conversa sem microfone." }),
      form({ titulo: "Nome na lista", botao: "Quero ir", mostrarMensagem: false }),
    ],
  }),
  item({
    id: "carrd-newsletter",
    nome: "Newsletter",
    descricao: "Uma carta, um campo, sem ruído.",
    categoria: "landing",
    tom: "minimalista",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#ffffff", texto: "#171717", destaque: "#171717", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Uma carta por semana", subtitulo: "O que li, o que cortei, o que ainda não sei.", fotoUrl: "", cta: "", url: "", estiloBotao: "texto" }),
      form({ titulo: "", botao: "Assinar", mostrarNome: false, mostrarMensagem: false, assunto: "Newsletter" }),
    ],
  }),
];

const FORMULARIO = [
  item({
    id: "carrd-contato",
    nome: "Contato limpo",
    descricao: "Só o formulário, no centro.",
    categoria: "formulario",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#fafafa", texto: "#111111", destaque: "#111111", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Escreva", subtitulo: "Cai no meu e-mail. Respondo em dois dias.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "", botao: "Enviar" }),
    ],
  }),
  item({
    id: "carrd-orcamento",
    nome: "Orçamento",
    descricao: "Pedido de proposta, sem papo.",
    categoria: "formulario",
    tom: "serio",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#0f172a", texto: "#e2e8f0", destaque: "#22d3ee", alinhamento: "esquerda", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Orçamento", subtitulo: "Prazo, referência e o que não quer.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "O projeto", botao: "Pedir proposta", assunto: "Orçamento" }),
    ],
  }),
  item({
    id: "carrd-reserva",
    nome: "Reserva",
    descricao: "Data e nome para a mesa.",
    categoria: "formulario",
    tom: "colorido",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#fff7ed", texto: "#7c2d12", destaque: "#ea580c", fonte: "serif", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Mesa para dois", subtitulo: "Quinta a sábado. 19h e 21h.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "Reservar", botao: "Pedir mesa", assunto: "Reserva" }),
    ],
  }),
  item({
    id: "carrd-feedback",
    nome: "Feedback",
    descricao: "Uma pergunta e espaço para a resposta.",
    categoria: "formulario",
    tom: "minimalista",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#ecfeff", texto: "#164e63", destaque: "#0891b2", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Como foi?", subtitulo: "Uma linha já ajuda.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "", botao: "Enviar recado", assunto: "Feedback" }),
    ],
  }),
  item({
    id: "carrd-inscricao",
    nome: "Inscrição",
    descricao: "Nome e e-mail para a turma.",
    categoria: "formulario",
    tom: "criativo",
    capa: IMG("form.jpg"),
    tema: tema({ fundo: "#1e1b4b", texto: "#e0e7ff", destaque: "#a78bfa", largura: "estreita" }),
    blocos: () => [
      bloco("capa", { titulo: "Próxima turma", subtitulo: "12 vagas. Começa em março.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      form({ titulo: "Quero vaga", botao: "Inscrever", mostrarMensagem: false, assunto: "Inscrição" }),
    ],
  }),
];

const PORTFOLIO = [
  item({
    id: "carrd-foto-preto",
    nome: "Foto preta",
    descricao: "Grade no escuro, quase só imagem.",
    categoria: "portfolio",
    capa: IMG("portfolio-1.jpg"),
    tema: tema({ fundo: "#050505", texto: "#fafafa", destaque: "#a3a3a3", fonte: "serif", largura: "larga" }),
    blocos: () => [
      bloco("capa", { titulo: "Helena Park", subtitulo: "Retrato e rua.", fotoUrl: "", cta: "", url: "", estiloBotao: "texto" }),
      galeria(),
      bloco("rodape", { texto: "© Helena Park" }),
    ],
  }),
  item({
    id: "carrd-foto-clara",
    nome: "Foto clara",
    descricao: "Branco, pouco texto, as fotos falam.",
    categoria: "portfolio",
    tom: "minimalista",
    capa: IMG("portfolio-2.jpg"),
    tema: tema({ fundo: "#ffffff", texto: "#171717", destaque: "#171717", largura: "larga" }),
    blocos: () => [
      bloco("capa", { titulo: "Obra", subtitulo: "", fotoUrl: "", cta: "", url: "", estiloBotao: "texto" }),
      galeria(["portfolio-2.jpg", "portfolio-3.jpg", "portfolio-1.jpg", "portfolio-4.jpg"]),
    ],
  }),
  item({
    id: "carrd-produto",
    nome: "Produto",
    descricao: "Peças em grade e um pedido.",
    categoria: "portfolio",
    tom: "sobrio",
    capa: IMG("portfolio-3.jpg"),
    tema: tema({ fundo: "#faf6f1", texto: "#292524", destaque: "#b45309", fonte: "serif", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Cerâmica do pátio", subtitulo: "Peças únicas. Encomenda por e-mail.", fotoUrl: "", cta: "Encomendar", url: "mailto:patio@email.com", estiloBotao: "preenchido" }),
      galeria(["portfolio-3.jpg", "portfolio-4.jpg", "portfolio-1.jpg"]),
    ],
  }),
  item({
    id: "carrd-editorial",
    nome: "Editorial",
    descricao: "Uma foto grande e um texto curto.",
    categoria: "portfolio",
    tom: "serio",
    capa: IMG("portfolio-4.jpg"),
    tema: tema({ fundo: "#18181b", texto: "#fafafa", destaque: "#e7e5e4", fonte: "serif", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("imagem", { url: IMG("portfolio-4.jpg"), alt: "Ensaio", caption: "Série Norte, 2025" }),
      bloco("capa", { titulo: "Série Norte", subtitulo: "Luz de fim de tarde em três cidades.", fotoUrl: "", cta: "Ver o ensaio", url: "https://", estiloBotao: "texto" }),
    ],
  }),
  item({
    id: "carrd-arte",
    nome: "Arte",
    descricao: "Cor no fundo, obra no meio.",
    categoria: "portfolio",
    tom: "criativo",
    capa: IMG("portfolio-2.jpg"),
    tema: tema({ fundo: "#4c1d95", texto: "#f5f3ff", destaque: "#fde047", largura: "media" }),
    blocos: () => [
      bloco("capa", { titulo: "Íris", subtitulo: "Tinta, tecido e um pouco de rua.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      galeria(["portfolio-2.jpg", "portfolio-1.jpg", "portfolio-3.jpg"]),
      botoes([{ rotulo: "Comprar print", url: "https://", estilo: "preenchido" }]),
    ],
  }),
];

const SECOES = [
  item({
    id: "carrd-freelancer",
    nome: "Freelancer",
    descricao: "Sobre, trabalho e contato em seções.",
    categoria: "sectioned",
    capa: IMG("links.jpg"),
    tema: tema({ fundo: "#0c0a09", texto: "#fafaf9", destaque: "#fb7185", largura: "media" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Sobre", ancora: "sobre" }, { rotulo: "Trabalho", ancora: "trabalho" }, { rotulo: "Contato", ancora: "contato" }] }),
      bloco("secao", { ancora: "sobre", titulo: "", subtitulo: "" }),
      bloco("capa", { titulo: "Dani Cruz", subtitulo: "Produto e texto. Remoto.", fotoUrl: IMG("links.jpg"), cta: "", url: "", estiloBotao: "preenchido" }),
      bloco("secao", { ancora: "trabalho", titulo: "Trabalho", subtitulo: "O que entra no escopo." }),
      bloco("cartoes", {
        colunas: 2,
        itens: [
          { icone: "FileText", titulo: "Site", corpo: "Uma página que explica o que você faz." },
          { icone: "MessageSquare", titulo: "Texto", corpo: "Home, sobre e o e-mail difícil." },
        ],
      }),
      bloco("secao", { ancora: "contato", titulo: "Contato", subtitulo: "" }),
      form({ destEmail: "dani@email.com", botao: "Escrever" }),
    ],
  }),
  item({
    id: "carrd-banda",
    nome: "Banda",
    descricao: "Datas, disco e um recado.",
    categoria: "sectioned",
    tom: "maximalista",
    capa: IMG("links.jpg"),
    tema: tema({ fundo: "#14532d", texto: "#ecfccb", destaque: "#bef264", largura: "estreita" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Disco", ancora: "disco" }, { rotulo: "Datas", ancora: "datas" }, { rotulo: "Contato", ancora: "contato" }] }),
      bloco("capa", { titulo: "Vento Sul", subtitulo: "Segundo disco. Outubro.", fotoUrl: "", cta: "Ouvir", url: "https://", estiloBotao: "preenchido" }),
      bloco("secao", { ancora: "disco", titulo: "Disco", subtitulo: "" }),
      bloco("texto", { titulo: "", corpo: "Oito faixas. Gravado em casa. Master no Rio." }),
      bloco("secao", { ancora: "datas", titulo: "Datas", subtitulo: "" }),
      bloco("texto", { titulo: "", corpo: "18/10 Porto Alegre · 25/10 Curitiba · 02/11 São Paulo." }),
      bloco("secao", { ancora: "contato", titulo: "Contato", subtitulo: "" }),
      form({ destEmail: "vento@email.com", botao: "Shows e press", mostrarMensagem: true }),
    ],
  }),
  item({
    id: "carrd-restaurante",
    nome: "Casa de comida",
    descricao: "Cardápio curto e reserva.",
    categoria: "sectioned",
    tom: "sobrio",
    capa: IMG("portfolio-3.jpg"),
    tema: tema({ fundo: "#fffbeb", texto: "#431407", destaque: "#b45309", fonte: "serif", largura: "media" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Casa", ancora: "casa" }, { rotulo: "Pratos", ancora: "pratos" }, { rotulo: "Mesa", ancora: "mesa" }] }),
      bloco("secao", { ancora: "casa", titulo: "", subtitulo: "" }),
      bloco("capa", { titulo: "Casa Lena", subtitulo: "Almoço de quinta a domingo.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      bloco("secao", { ancora: "pratos", titulo: "Pratos", subtitulo: "Mudam com a feira." }),
      bloco("texto", { titulo: "", corpo: "Arroz de pato · Peixe do dia · Torta de limão. Sem cardápio de 20 páginas." }),
      bloco("secao", { ancora: "mesa", titulo: "Mesa", subtitulo: "" }),
      form({ titulo: "Reservar", botao: "Pedir mesa", assunto: "Mesa" }),
    ],
  }),
  item({
    id: "carrd-consultoria",
    nome: "Consultoria",
    descricao: "O serviço, a prova e o formulário.",
    categoria: "sectioned",
    tom: "serio",
    capa: IMG("landing.jpg"),
    tema: tema({ fundo: "#020617", texto: "#e2e8f0", destaque: "#38bdf8", alinhamento: "esquerda", largura: "media" }),
    blocos: () => [
      bloco("navegacao", { itens: [{ rotulo: "Serviço", ancora: "servico" }, { rotulo: "Prova", ancora: "prova" }, { rotulo: "Falar", ancora: "falar" }] }),
      bloco("capa", { titulo: "Operação enxuta", subtitulo: "Para time de 4 a 20 pessoas que já fatura e ainda se perde na planilha.", fotoUrl: "", cta: "", url: "", estiloBotao: "preenchido" }),
      bloco("secao", { ancora: "servico", titulo: "Serviço", subtitulo: "" }),
      bloco("texto", { titulo: "", corpo: "Diagnóstico em duas semanas. Um plano. Sem slides eternos." }),
      bloco("secao", { ancora: "prova", titulo: "Prova", subtitulo: "" }),
      bloco("depoimentos", { itens: [{ citacao: "Cortamos três ferramentas e o mês fechou no prazo.", autor: "Operações", fotoUrl: "" }] }),
      bloco("secao", { ancora: "falar", titulo: "Falar", subtitulo: "" }),
      form({ destEmail: "oi@consultoria.com", botao: "Agendar conversa" }),
    ],
  }),
];

export const CATALOGO_CARRD = [...PERFIL, ...LANDING, ...FORMULARIO, ...PORTFOLIO, ...SECOES];
