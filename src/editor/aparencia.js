import { cssFundo, temFundoProprio } from "./fundo";

export const TAMANHOS_TITULO = [
  { id: "", nome: "Padrão do bloco" },
  { id: "pequeno", nome: "Pequeno" },
  { id: "medio", nome: "Médio" },
  { id: "grande", nome: "Grande" },
  { id: "enorme", nome: "Enorme" },
];

export const TAMANHOS_TEXTO = [
  { id: "", nome: "Padrão do bloco" },
  { id: "pequeno", nome: "Pequeno" },
  { id: "medio", nome: "Médio" },
  { id: "grande", nome: "Grande" },
];

export const ALINHAMENTOS_BLOCO = [
  { id: "", nome: "Seguir o tema" },
  { id: "esquerda", nome: "Esquerda" },
  { id: "centro", nome: "Centro" },
];

const TITULO = {
  pequeno: "font-display text-2xl leading-snug",
  medio: "font-display text-3xl leading-snug",
  grande: "font-display text-5xl leading-tight md:text-6xl",
  enorme: "font-display text-6xl leading-none md:text-7xl",
};

const TEXTO = {
  pequeno: "text-sm leading-6",
  medio: "text-base leading-7",
  grande: "text-lg leading-8",
};

export function classeTitulo(tipo, tamanho) {
  const padrao = tipo === "capa" ? "grande" : "medio";
  return TITULO[tamanho || padrao] || TITULO.medio;
}

export function classeTexto(tamanho) {
  return TEXTO[tamanho || "medio"] || TEXTO.medio;
}

function px(valor, padrao) {
  if (valor === "" || valor == null) return padrao;
  return `${Number(valor)}px`;
}

export function temaDoBloco(props = {}, tema = {}) {
  return {
    ...tema,
    texto: props.corTexto || tema.texto,
    destaque: props.destaque || tema.destaque,
    fundo: props.corFundo || tema.fundo,
    alinhamento: props.alinhamento || tema.alinhamento,
  };
}

export const DISPLAYS_BLOCO = [
  { id: "", nome: "Auto" },
  { id: "block", nome: "Bloco" },
  { id: "flex", nome: "Flex" },
  { id: "grid", nome: "Grade" },
];

export const DIRECOES_FLEX = [
  { id: "row", nome: "Linha" },
  { id: "column", nome: "Coluna" },
];

export const JUSTIFY_BLOCO = [
  { id: "flex-start", nome: "Início" },
  { id: "center", nome: "Centro" },
  { id: "flex-end", nome: "Fim" },
  { id: "space-between", nome: "Entre" },
  { id: "space-around", nome: "Em volta" },
];

export const ALIGN_BLOCO = [
  { id: "stretch", nome: "Esticar" },
  { id: "flex-start", nome: "Início" },
  { id: "center", nome: "Centro" },
  { id: "flex-end", nome: "Fim" },
];

export const RAIOS_BLOCO = [
  { id: "", nome: "Padrão" },
  { id: "0", nome: "Reto" },
  { id: "6", nome: "Sutil" },
  { id: "16", nome: "Médio" },
  { id: "28", nome: "Redondo" },
  { id: "999", nome: "Pílula" },
];

export const OBJECT_FIT = [
  { id: "cover", nome: "Preencher" },
  { id: "contain", nome: "Cabendo" },
  { id: "fill", nome: "Esticar" },
];

function definido(valor) {
  return valor !== "" && valor != null;
}

export function raioCss(props = {}, padrao) {
  if (definido(props.raio)) return `${Number(props.raio)}px`;
  return padrao;
}

export function estiloLayout(props = {}) {
  const estilo = {};
  if (props.display) estilo.display = props.display;
  if (props.display === "flex" || props.display === "grid") {
    if (props.flexDirecao) estilo.flexDirection = props.flexDirecao;
    if (props.flexQuebra) estilo.flexWrap = props.flexQuebra;
    if (props.justify) estilo.justifyContent = props.justify;
    if (props.align) estilo.alignItems = props.align;
    if (definido(props.gap)) estilo.gap = px(props.gap);
    if (props.display === "grid") {
      estilo.gridTemplateColumns = `repeat(${props.colunasGrade || 2}, minmax(0, 1fr))`;
    }
  }
  if (definido(props.raio)) estilo.borderRadius = `${Number(props.raio)}px`;
  if (definido(props.minAltura)) estilo.minHeight = px(props.minAltura);
  if (props.overflow) estilo.overflow = props.overflow;
  return estilo;
}

export function estiloMidia(props = {}, padraoRaio = "1rem") {
  const estilo = {
    borderRadius: raioCss(props, padraoRaio),
    objectFit: props.objectFit || "cover",
  };
  if (definido(props.itemLargura)) {
    estilo.maxWidth = px(props.itemLargura);
    estilo.width = "100%";
  }
  return estilo;
}

export function caixaDoBloco(props = {}) {
  const estilo = { ...cssFundo(props, "corFundo"), ...estiloLayout(props) };
  if (props.alinhamento === "esquerda") estilo.textAlign = "left";
  if (props.alinhamento === "centro") estilo.textAlign = "center";
  if (!definido(props.raio) && temFundoProprio(props)) estilo.borderRadius = "1.25rem";
  const temPadding = definido(props.paddingCima) || definido(props.paddingBaixo) || definido(props.paddingLados);
  if (temPadding) {
    estilo.paddingTop = px(props.paddingCima, "24px");
    estilo.paddingBottom = px(props.paddingBaixo, "24px");
    estilo.paddingLeft = px(props.paddingLados, "20px");
    estilo.paddingRight = px(props.paddingLados, "20px");
  } else if (temFundoProprio(props)) {
    estilo.padding = "1.5rem 1.25rem";
  }
  if (definido(props.margemCima)) estilo.marginTop = px(props.margemCima);
  if (definido(props.margemBaixo)) estilo.marginBottom = px(props.margemBaixo);
  if (props.corTexto) estilo.color = props.corTexto;
  return estilo;
}
