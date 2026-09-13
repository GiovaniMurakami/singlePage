const ouvintes = new Set();
let travas = 0;
let timer;

function avisar() {
  const aberto = seletorCorAberto();
  ouvintes.forEach((fn) => fn(aberto));
}

export function seletorCorAberto() {
  const ativo = typeof document !== "undefined" ? document.activeElement : null;
  return travas > 0 || (ativo instanceof HTMLInputElement && ativo.type === "color");
}

export function travarSeletorCor() {
  window.clearTimeout(timer);
  travas += 1;
  avisar();
}

export function soltarSeletorCor(atraso = 800) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    travas = Math.max(0, travas - 1);
    avisar();
  }, atraso);
}

export function escutarSeletorCor(fn) {
  ouvintes.add(fn);
  fn(seletorCorAberto());
  return () => ouvintes.delete(fn);
}

function ehInputCor(no) {
  return no instanceof HTMLInputElement && no.type === "color";
}

if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", (evento) => {
    if (ehInputCor(evento.target)) travarSeletorCor();
  }, true);
  document.addEventListener("focusin", (evento) => {
    if (ehInputCor(evento.target)) travarSeletorCor();
  }, true);
  document.addEventListener("focusout", (evento) => {
    if (ehInputCor(evento.target)) soltarSeletorCor(800);
  }, true);
  window.addEventListener("blur", () => {
    if (ehInputCor(document.activeElement)) travarSeletorCor();
  });
}
