import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { LayoutTemplate } from "lucide-react";
import { PageRenderer } from "./PageRenderer";
import { cssFundo } from "./fundo";
import { aplicarLayout, layoutIdDoBloco, layoutsDoTipo, obterLayout, paginaPreviewLayout } from "./blocoLayouts";

function MiniLayout({ tipo, layout, tema, propsUsuario }) {
  const pagina = useMemo(
    () => paginaPreviewLayout(tipo, layout, tema, propsUsuario),
    [tipo, layout, tema, propsUsuario]
  );
  return (
    <div className="relative aspect-[5/4] overflow-hidden bg-paper" style={cssFundo(pagina.tema)}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: "240%", transform: "scale(0.416)" }}
      >
        <PageRenderer pagina={pagina} compacto />
      </div>
    </div>
  );
}

export function LayoutPickerModal({ tipo, atualId, propsBloco, tema, onEscolher, onFechar }) {
  const layouts = layoutsDoTipo(tipo);
  const titulo = tipo === "capa" ? "Layouts de capa" : "Layouts";

  useEffect(() => {
    const onKey = (evento) => {
      if (evento.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onFechar]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onFechar}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.6rem] bg-paper shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Exemplos</p>
            <h2 className="font-display mt-1 text-3xl">{titulo}</h2>
          </div>
          <button type="button" className="rounded-full px-4 py-2 text-sm text-muted hover:text-ink" onClick={onFechar}>
            Fechar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layouts.map((layout) => {
              const ativo = layout.id === atualId;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => onEscolher(layout.id)}
                  className={`overflow-hidden rounded-[1.3rem] text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-lg ${
                    ativo ? "ring-2 ring-accent" : "ring-line"
                  }`}
                >
                  <div className="pointer-events-none [&_a]:pointer-events-none">
                    <MiniLayout tipo={tipo} layout={layout} tema={tema} propsUsuario={propsBloco} />
                  </div>
                  <div className="bg-paper-2 px-4 py-3">
                    <p className="text-sm font-medium">{layout.nome}</p>
                    <p className="mt-0.5 text-xs text-muted">{layout.descricao}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function CartaoLayouts({ bloco, set, tema }) {
  const layouts = layoutsDoTipo(bloco.tipo);
  const atualId = layoutIdDoBloco(bloco.tipo, bloco.props);
  const atual = obterLayout(bloco.tipo, atualId);
  const [aberto, setAberto] = useState(false);

  if (!layouts.length) return null;

  return (
    <>
      <div className="rounded-2xl bg-paper-2 p-3 ring-1 ring-line">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Layout</p>
        <p className="mt-1 text-sm font-medium">{atual?.nome || "Padrão"}</p>
        <p className="mt-0.5 text-xs text-muted">{atual?.descricao}</p>
        <button
          type="button"
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm text-paper hover:bg-ink/90"
          onClick={() => setAberto(true)}
        >
          <LayoutTemplate size={14} />
          {bloco.tipo === "capa" ? "Ver layouts de capa" : "Ver exemplos"}
        </button>
      </div>
      {aberto && (
        <LayoutPickerModal
          tipo={bloco.tipo}
          atualId={atualId}
          propsBloco={bloco.props}
          tema={tema}
          onEscolher={(id) => {
            set(aplicarLayout(bloco.tipo, id, bloco.props));
            setAberto(false);
          }}
          onFechar={() => setAberto(false)}
        />
      )}
    </>
  );
}
