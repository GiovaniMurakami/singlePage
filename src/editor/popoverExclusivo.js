/** Garante um único popover de estilização aberto por vez. */
let atual = null;
const ouvintes = new Set();

function notificar() {
  ouvintes.forEach((fn) => fn(atual));
}

export function reivindicarPopover(id) {
  if (atual === id) return;
  atual = id;
  notificar();
}

export function liberarPopover(id) {
  if (atual !== id) return;
  atual = null;
  notificar();
}

export function escutarPopover(fn) {
  ouvintes.add(fn);
  fn(atual);
  return () => ouvintes.delete(fn);
}
