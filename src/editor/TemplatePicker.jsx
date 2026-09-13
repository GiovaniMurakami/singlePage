import { useMemo, useState } from "react";
import { CATEGORIAS, TEMPLATES, paginaDeTemplate, templateMostraDemo } from "./templates";
import { PageRenderer } from "./PageRenderer";
import { cssFundo } from "./fundo";

function MiniPreview({ template }) {
  const pagina = useMemo(() => paginaDeTemplate(template.id), [template.id]);
  return (
    <div className="relative aspect-[4/3] overflow-hidden" style={cssFundo(pagina.tema)}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: "263%", transform: "scale(0.38)" }}
      >
        <PageRenderer pagina={pagina} />
      </div>
    </div>
  );
}

export function TemplatePicker({ onEscolher, onCancelar, titulo = "Escolha um ponto de partida" }) {
  const [categoria, setCategoria] = useState("todos");
  const [demoId, setDemoId] = useState(null);

  const lista = useMemo(() => {
    return TEMPLATES.filter((item) => categoria === "todos" || item.categoria === categoria || item.categoria === "todos");
  }, [categoria]);

  const demo = demoId ? TEMPLATES.find((item) => item.id === demoId) : null;
  const paginaDemo = demo ? paginaDeTemplate(demo.id) : null;

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Modelos</p>
            <h1 className="font-display mt-2 text-3xl md:text-5xl">{titulo}</h1>
            <p className="mt-3 max-w-xl text-sm text-ink-soft">
              O recorte do card é a própria página. Demo só entra quando há o que rolar.
            </p>
          </div>
          {onCancelar && (
            <button type="button" className="text-sm text-muted hover:text-ink" onClick={onCancelar}>
              Voltar ao rascunho
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIAS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategoria(item.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                categoria === item.id ? "bg-ink text-paper" : "bg-paper-2 text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {item.nome}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((template) => {
            const temDemo = templateMostraDemo(template);
            return (
              <article key={template.id} className="overflow-hidden rounded-[1.6rem] bg-paper-2 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg">
                <MiniPreview template={template} />
                <div className="p-4">
                  <h2 className="font-medium">{template.nome}</h2>
                  <p className="mt-1 text-sm text-muted">{template.descricao}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-accent px-4 py-2 text-sm text-white"
                      onClick={() => onEscolher(paginaDeTemplate(template.id))}
                    >
                      Usar
                    </button>
                    {temDemo && (
                      <button
                        type="button"
                        className="rounded-full border border-line px-4 py-2 text-sm"
                        onClick={() => setDemoId(template.id)}
                      >
                        Demo
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {demo && paginaDemo && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/75 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div
            className="flex h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.6rem] shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[1.6rem]"
            style={{ ...cssFundo(paginaDemo.tema), color: paginaDemo.tema.texto }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
              <p className="text-sm opacity-80">{demo.nome}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-accent px-4 py-2 text-sm text-white"
                  onClick={() => onEscolher(paginaDemo)}
                >
                  Usar este
                </button>
                <button type="button" className="rounded-full px-4 py-2 text-sm opacity-80 hover:opacity-100" onClick={() => setDemoId(null)}>
                  Fechar
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <PageRenderer pagina={paginaDemo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
