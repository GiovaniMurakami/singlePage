import { IMG_S3, TEMA_PADRAO, blocoPadrao } from "./templates";

const FOTO = IMG_S3("perfil.jpg");
const FOTOS = [IMG_S3("portfolio-1.jpg"), IMG_S3("portfolio-2.jpg"), IMG_S3("portfolio-3.jpg")];

const LAYOUTS = {
  capa: [
    { id: "centro", nome: "Centro", descricao: "Foto, título e botão no meio." },
    { id: "esquerda", nome: "Esquerda", descricao: "Pilha alinhada à esquerda.", props: { alinhamento: "esquerda" } },
    { id: "split", nome: "Foto + texto", descricao: "Foto à esquerda, texto ao lado.", props: { alinhamento: "esquerda", fotoTamanho: 220, fotoRaio: 28 } },
    { id: "split-direita", nome: "Texto + foto", descricao: "Texto primeiro, foto à direita.", props: { alinhamento: "esquerda", fotoTamanho: 220, fotoRaio: 28 } },
    { id: "fullbleed", nome: "Foto de fundo", descricao: "A foto vira o fundo da capa.", props: { alinhamento: "centro", minAltura: 420 } },
    { id: "editorial", nome: "Editorial", descricao: "Título grande em cima, foto embaixo.", props: { alinhamento: "esquerda", tamanhoTitulo: "enorme", fotoTamanho: 280, fotoRaio: 16 } },
    { id: "cartao", nome: "Cartão", descricao: "Tudo dentro de um card.", props: { alinhamento: "centro", fotoTamanho: 96, fotoRaio: 999, raio: 28 } },
    { id: "compacta", nome: "Compacta", descricao: "Foto pequena, título e botão na mesma linha.", props: { alinhamento: "esquerda", fotoTamanho: 72, fotoRaio: 999 } },
  ],
  galeria: [
    { id: "grade-2", nome: "2 colunas", descricao: "Grade clássica." },
    { id: "grade-3", nome: "3 colunas", descricao: "Mais fotos na mesma faixa." },
    { id: "mosaico", nome: "Mosaico", descricao: "A primeira foto ganha destaque." },
    { id: "destaque", nome: "Destaque", descricao: "Uma foto larga e as outras embaixo." },
    { id: "faixa", nome: "Faixa", descricao: "Rola na horizontal." },
  ],
  cartoes: [
    { id: "grade", nome: "Grade", descricao: "Cards lado a lado." },
    { id: "lista", nome: "Lista", descricao: "Um embaixo do outro." },
    { id: "destaque", nome: "Destaque", descricao: "O primeiro card ocupa a faixa." },
    { id: "faixa", nome: "Faixa", descricao: "Rola na horizontal." },
  ],
  depoimentos: [
    { id: "lista", nome: "Lista", descricao: "Um depoimento por vez." },
    { id: "grade", nome: "Grade", descricao: "Dois por linha." },
    { id: "citacao", nome: "Citação", descricao: "Frase grande no centro." },
    { id: "faixa", nome: "Faixa", descricao: "Rola na horizontal." },
  ],
  botoes: [
    { id: "pilha", nome: "Pilha", descricao: "Botões largos, um embaixo do outro." },
    { id: "linha", nome: "Linha", descricao: "Botões lado a lado." },
    { id: "pills", nome: "Pílulas", descricao: "Compactos, quebra sozinho." },
    { id: "grade", nome: "Grade", descricao: "Duas colunas de botões." },
    { id: "cartoes", nome: "Cartões", descricao: "Título, texto e seta — um embaixo do outro." },
  ],
  icones: [
    { id: "centro", nome: "Centro", descricao: "Ícones agrupados no meio." },
    { id: "com-nome", nome: "Com nome", descricao: "Ícone e rótulo embaixo." },
    { id: "faixa", nome: "Faixa", descricao: "Espaçados na linha." },
  ],
  faixa: [
    { id: "centro", nome: "Centro", descricao: "Título e texto no meio." },
    { id: "esquerda", nome: "Esquerda", descricao: "Texto alinhado à esquerda.", props: { alinhamento: "esquerda" } },
    { id: "cta", nome: "Chamada", descricao: "Faixa alta, texto grande.", props: { tamanhoTitulo: "grande", minAltura: 280 } },
  ],
  contador: [
    { id: "caixas", nome: "Caixas", descricao: "Cada número numa caixa." },
    { id: "linha", nome: "Relógio", descricao: "Números grandes separados por dois-pontos." },
    { id: "discreto", nome: "Discreto", descricao: "Uma linha curta de texto." },
  ],
};

const PADRAO = {
  capa: "centro",
  galeria: "grade-2",
  cartoes: "grade",
  depoimentos: "lista",
  botoes: "pilha",
  icones: "centro",
  faixa: "centro",
  contador: "caixas",
};

function amostraCapa(propsUsuario = {}) {
  return {
    titulo: propsUsuario.titulo || "Sua página",
    subtitulo: propsUsuario.subtitulo || "Diga quem você é em uma frase.",
    fotoUrl: propsUsuario.fotoUrl || FOTO,
    cta: propsUsuario.cta || "Fale comigo",
    url: propsUsuario.url || "#",
    estiloBotao: propsUsuario.estiloBotao || "preenchido",
  };
}

function amostraDoTipo(tipo, propsUsuario = {}) {
  if (tipo === "capa") return amostraCapa(propsUsuario);
  const base = blocoPadrao(tipo).props;
  if (tipo === "galeria") return { ...base, urls: FOTOS };
  if (tipo === "depoimentos") {
    return {
      itens: [
        { citacao: "Funcionou na primeira semana.", autor: "Ana", fotoUrl: FOTO },
        { citacao: "Simples de publicar.", autor: "Leo", fotoUrl: FOTOS[1] },
        { citacao: "O visual ficou meu.", autor: "Mia", fotoUrl: FOTOS[2] },
      ],
    };
  }
  if (tipo === "cartoes") return base;
  if (tipo === "botoes") return base;
  if (tipo === "icones") return base;
  if (tipo === "faixa") return base;
  return base;
}

export function layoutsDoTipo(tipo) {
  return LAYOUTS[tipo] || [];
}

export function temLayouts(tipo) {
  return layoutsDoTipo(tipo).length > 0;
}

export function layoutPadrao(tipo) {
  return PADRAO[tipo] || layoutsDoTipo(tipo)[0]?.id || "";
}

export function layoutIdDoBloco(tipo, props = {}) {
  return props.layoutId || layoutPadrao(tipo);
}

export function obterLayout(tipo, layoutId) {
  const lista = layoutsDoTipo(tipo);
  return lista.find((item) => item.id === layoutId) || lista[0] || null;
}

export function aplicarLayout(tipo, layoutId, props = {}) {
  const layout = obterLayout(tipo, layoutId);
  return {
    ...props,
    display: "",
    flexDirecao: "",
    justify: "",
    align: "",
    ...(layout?.props || {}),
    layoutId: layout?.id || layoutId,
  };
}

export function paginaPreviewLayout(tipo, layout, tema, propsUsuario) {
  return {
    tema: { ...TEMA_PADRAO, ...tema, largura: "completa" },
    blocos: [
      {
        id: `preview-${tipo}-${layout.id}`,
        tipo,
        props: {
          ...amostraDoTipo(tipo, propsUsuario),
          ...(layout.props || {}),
          layoutId: layout.id,
        },
      },
    ],
  };
}
