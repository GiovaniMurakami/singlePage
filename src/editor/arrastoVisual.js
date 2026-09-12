let fantasma = null;
let offsetX = 0;
let offsetY = 0;
let ultimoX = 0;
let inclinacao = 0;

const ESTILOS_VISUAIS = [
  "color",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "background-clip",
  "background-origin",
  "background-blend-mode",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-transform",
  "text-decoration-line",
  "text-decoration-color",
  "text-underline-offset",
  "white-space",
  "opacity",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-style",
  "border-right-style",
  "border-bottom-style",
  "border-left-style",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "box-shadow",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "display",
  "align-items",
  "justify-content",
  "justify-items",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "gap",
  "row-gap",
  "column-gap",
  "grid-template-columns",
  "grid-template-rows",
  "object-fit",
  "object-position",
  "width",
  "height",
  "max-width",
  "min-width",
  "min-height",
  "max-height",
  "overflow",
  "overflow-wrap",
  "word-break",
  "vertical-align",
  "-webkit-font-smoothing",
  "fill",
  "stroke",
  "stroke-width",
];

const VARS_VISUAIS = [
  "--item-bg",
  "--item-fg",
  "--item-border",
  "--item-bg-hover",
  "--item-fg-hover",
  "--item-border-hover",
  "--item-scale-hover",
  "--item-shadow-hover",
];

const PULAR_NA_RAIZ = new Set([
  "opacity",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "width",
  "height",
  "max-width",
  "min-width",
  "min-height",
  "max-height",
]);

function limparNativo(evento) {
  const vazio = document.createElement("div");
  vazio.style.cssText = "position:fixed;left:-20px;top:-20px;width:1px;height:1px;opacity:0";
  document.body.appendChild(vazio);
  evento.dataTransfer.setDragImage(vazio, 0, 0);
  requestAnimationFrame(() => vazio.remove());
}

function posicionar(x, y) {
  if (!fantasma) return;
  fantasma.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0)`;
  fantasma.style.setProperty("--inclinacao", `${inclinacao}deg`);
}

function pintarNo(origem, destino, raiz = false) {
  const computado = window.getComputedStyle(origem);
  for (const prop of ESTILOS_VISUAIS) {
    if (raiz && PULAR_NA_RAIZ.has(prop)) continue;
    destino.style.setProperty(prop, computado.getPropertyValue(prop));
  }
  for (const nome of VARS_VISUAIS) {
    const valor = computado.getPropertyValue(nome);
    if (valor) destino.style.setProperty(nome, valor);
  }
}

function pintarClone(origem, destino) {
  const origemNos = [origem, ...origem.querySelectorAll("*")];
  const destinoNos = [destino, ...destino.querySelectorAll("*")];
  const limite = Math.min(origemNos.length, destinoNos.length);
  for (let i = 0; i < limite; i += 1) {
    pintarNo(origemNos[i], destinoNos[i], i === 0);
  }
}

function aplicarTemaDaPagina(elemento, carta) {
  const palco = elemento.closest("[data-pagina-canvas]");
  if (!palco) return;
  const tema = window.getComputedStyle(palco);
  const fundo = window.getComputedStyle(carta).backgroundColor;
  const semFundo = !fundo || fundo === "transparent" || fundo === "rgba(0, 0, 0, 0)";
  if (semFundo) {
    carta.style.backgroundColor = tema.backgroundColor;
    carta.style.backgroundImage = tema.backgroundImage;
    carta.style.backgroundSize = tema.backgroundSize;
    carta.style.backgroundPosition = tema.backgroundPosition;
    carta.style.backgroundRepeat = tema.backgroundRepeat;
  }
  if (!carta.style.color) carta.style.color = tema.color;
  if (!carta.style.fontFamily) carta.style.fontFamily = tema.fontFamily;
  if (!carta.style.textAlign) carta.style.textAlign = tema.textAlign;
}

export function iniciarLevantamento(elemento, evento) {
  encerrarLevantamento(true);
  const ret = elemento.getBoundingClientRect();
  offsetX = evento.clientX - ret.left;
  offsetY = evento.clientY - ret.top;
  ultimoX = evento.clientX;
  inclinacao = 0;

  const capa = document.createElement("div");
  capa.className = "bloco-fantasma";
  capa.style.width = `${ret.width}px`;
  capa.setAttribute("aria-hidden", "true");

  const sombra = document.createElement("div");
  sombra.className = "bloco-fantasma-sombra";

  const carta = elemento.cloneNode(true);
  carta.classList.add("bloco-fantasma-carta");
  carta.classList.remove("bloco-levantando", "group");
  carta.removeAttribute("tabindex");
  carta.removeAttribute("role");
  pintarClone(elemento, carta);
  carta.querySelectorAll("[data-editor-chrome], [aria-label='Arrastar bloco']").forEach((no) => no.remove());
  aplicarTemaDaPagina(elemento, carta);
  carta.style.width = "100%";
  carta.style.boxSizing = "border-box";
  carta.style.opacity = "1";
  carta.style.filter = "none";
  carta.style.transform = "";
  carta.style.position = "relative";
  carta.style.left = "auto";
  carta.style.top = "auto";

  capa.append(sombra, carta);
  document.body.appendChild(capa);
  fantasma = capa;
  posicionar(evento.clientX, evento.clientY);
  requestAnimationFrame(() => capa.classList.add("bloco-fantasma-alto"));

  limparNativo(evento);
  window.addEventListener("dragover", acompanhar, { passive: false });
  window.addEventListener("dragend", aoSoltar);
}

function acompanhar(evento) {
  if (!evento.clientX && !evento.clientY) return;
  evento.preventDefault();
  const delta = evento.clientX - ultimoX;
  inclinacao = Math.max(-11, Math.min(11, inclinacao * 0.65 + delta * 0.9));
  ultimoX = evento.clientX;
  posicionar(evento.clientX, evento.clientY);
}

function aoSoltar() {
  encerrarLevantamento();
}

export function encerrarLevantamento(imediato = false) {
  window.removeEventListener("dragover", acompanhar);
  window.removeEventListener("dragend", aoSoltar);
  if (!fantasma) return;
  const no = fantasma;
  fantasma = null;
  if (imediato) {
    no.remove();
    return;
  }
  no.classList.remove("bloco-fantasma-alto");
  no.classList.add("bloco-fantasma-soltar");
  window.setTimeout(() => no.remove(), 200);
}
