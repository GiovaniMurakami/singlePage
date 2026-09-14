import { cssFundo, temFundoProprio } from "./fundo";
import { ALINHAMENTOS_TEMA, FONTES, cssAlinhamento, cssOrientacao } from "./fontes";

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

export const TAMANHOS_BOTAO = [
  { id: "", nome: "Médio" },
  { id: "pequeno", nome: "Pequeno" },
  { id: "medio", nome: "Médio" },
  { id: "grande", nome: "Grande" },
];

export function classeBotaoTamanho(tamanho) {
  if (tamanho === "pequeno") return "min-h-9 px-4 text-xs";
  if (tamanho === "grande") return "min-h-14 px-8 text-base";
  return "min-h-11 px-6 text-sm";
}

export const ALINHAMENTOS_BLOCO = [
  { id: "", nome: "Seguir o tema" },
  ...ALINHAMENTOS_TEMA,
];

const TITULO = {
  pequeno: "text-xl font-semibold leading-snug sm:text-2xl",
  medio: "text-2xl font-semibold leading-snug sm:text-3xl",
  grande: "text-3xl font-semibold leading-tight sm:text-5xl md:text-6xl",
  enorme: "text-4xl font-semibold leading-none sm:text-6xl md:text-7xl",
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
  { id: "space-evenly", nome: "Igual" },
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

function eixoGrade(valor, padrao = "center") {
  const mapa = {
    "flex-start": "start",
    center: "center",
    "flex-end": "end",
    "space-between": "stretch",
    "space-around": "center",
    stretch: "stretch",
  };
  return mapa[valor] || padrao;
}

export function estiloLayout(props = {}) {
  const estilo = {};
  const usarFlex = props.display === "flex" || (!props.display && (props.justify || props.align));
  if (props.display || usarFlex) {
    estilo.display = props.display || "flex";
    estilo.boxSizing = "border-box";
  }
  if (usarFlex) {
    estilo.flexDirection = props.flexDirecao || "row";
    estilo.flexWrap = props.flexQuebra || "wrap";
    estilo.justifyContent = props.justify || "center";
    estilo.alignItems = props.align || "center";
    estilo.gap = definido(props.gap) ? px(props.gap) : "16px";
  }
  if (props.display === "grid") {
    estilo.gridTemplateColumns = `repeat(${props.colunasGrade || 2}, minmax(0, 1fr))`;
    estilo.justifyItems = eixoGrade(props.justify, "center");
    estilo.alignItems = eixoGrade(props.align, "center");
    estilo.gap = definido(props.gap) ? px(props.gap) : "16px";
  }
  if (definido(props.raio)) estilo.borderRadius = `${Number(props.raio)}px`;
  if (definido(props.minAltura)) estilo.minHeight = px(props.minAltura);
  if (props.alignSelf) estilo.alignSelf = props.alignSelf;
  if (props.overflow) estilo.overflow = props.overflow;
  return estilo;
}

export function estiloMidia(props = {}, padraoRaio = "1rem") {
  const estilo = {
    borderRadius: raioCss(props, padraoRaio),
    objectFit: props.objectFit || "cover",
    overflow: "hidden",
    flex: "0 0 auto",
    minWidth: 0,
  };
  if (definido(props.itemLargura)) {
    estilo.width = px(props.itemLargura);
    estilo.maxWidth = "100%";
  } else if (props.display === "flex") {
    estilo.width = props.flexDirecao === "column" ? "min(100%, 280px)" : "180px";
  } else if (props.display === "grid") {
    estilo.width = "100%";
  }
  return estilo;
}

export function caixaDoBloco(props = {}) {
  const estilo = { ...cssFundo(props, "corFundo"), ...estiloLayout(props) };
  const alinhado = cssAlinhamento(props.alinhamento);
  if (alinhado) estilo.textAlign = alinhado;
  if (props.fonte && FONTES[props.fonte]) estilo.fontFamily = FONTES[props.fonte];
  Object.assign(estilo, cssOrientacao(props.orientacao));
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
  if (props.borda) {
    estilo.border = `${props.bordaLargura || 2}px solid ${props.borda}`;
  }
  if (props.sombraDura) estilo.boxShadow = props.sombraDura;
  return estilo;
}

export function estiloDoItem(item = {}, extra = {}) {
  const estilo = caixaDoBloco(item);
  const temPadding = definido(item.paddingCima) || definido(item.paddingBaixo) || definido(item.paddingLados);
  if (!temPadding) {
    delete estilo.padding;
    delete estilo.paddingTop;
    delete estilo.paddingBottom;
    delete estilo.paddingLeft;
    delete estilo.paddingRight;
  }
  if (!definido(item.raio) && estilo.borderRadius === "1.25rem") {
    delete estilo.borderRadius;
  }
  return { ...estilo, ...extra };
}

export function estiloDaParte(props = {}, parteId, extra = {}) {
  return estiloDoItem(props.estiloPartes?.[parteId] || {}, extra);
}
