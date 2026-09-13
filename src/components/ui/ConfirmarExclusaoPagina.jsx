import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { rotuloUrlPublica } from "../../constants/site";

function normalizarNome(valor) {
  return String(valor || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export function nomesPaginaIguais(digitado, esperado) {
  return Boolean(esperado) && normalizarNome(digitado) === normalizarNome(esperado);
}

export function ConfirmarExclusaoPagina({ pagina, pendente, onCancelar, onConfirmar }) {
  const [digitado, setDigitado] = useState("");
  const inputRef = useRef(null);
  const tituloId = useId();
  const bate = nomesPaginaIguais(digitado, pagina.titulo);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (evento) => {
      if (evento.key === "Escape" && !pendente) onCancelar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancelar, pendente]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      onClick={() => {
        if (!pendente) onCancelar();
      }}
    >
      <form
        className="w-full max-w-md rounded-t-[1.6rem] bg-paper p-5 shadow-2xl sm:rounded-[1.6rem] sm:p-6"
        onClick={(evento) => evento.stopPropagation()}
        onSubmit={(evento) => {
          evento.preventDefault();
          if (bate && !pendente) onConfirmar();
        }}
      >
        <h2 id={tituloId} className="font-display text-2xl">Excluir esta página?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Isso apaga <strong className="font-medium text-ink">{pagina.titulo}</strong> e libera o endereço{" "}
          <strong className="font-medium text-ink">{rotuloUrlPublica(pagina.slug)}</strong>. Outra pessoa poderá cadastrar o mesmo nome.
        </p>
        <label className="mt-5 block text-sm">
          <span className="mb-1.5 block text-muted">Digite o nome da página para confirmar</span>
          <input
            ref={inputRef}
            className="w-full rounded-xl border border-line px-3 py-3"
            value={digitado}
            onChange={(evento) => setDigitado(evento.target.value)}
            placeholder={pagina.titulo}
            autoComplete="off"
            aria-required="true"
          />
        </label>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="min-h-11 rounded-full px-4 py-2 text-sm"
            onClick={onCancelar}
            disabled={pendente}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!bate || pendente}
            className="min-h-11 rounded-full bg-danger px-4 py-2 text-sm text-paper disabled:opacity-40"
          >
            {pendente ? "Excluindo…" : "Excluir página"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
