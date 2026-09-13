import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { criarPagina, excluirPagina, listarPaginas, mensagemErro } from "../services/backendApi";
import { CATEGORIAS, TEMPLATES, slugify } from "../editor/templates";
import { temRascunho } from "../editor/rascunho";
import { getSiteBaseUrl, urlPublicaPagina } from "../constants/site";
import { Seo } from "../components/Seo";

export function DashboardPage() {
  const { usuario } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [templateId, setTemplateId] = useState("perfil");
  const paginas = useQuery({ queryKey: ["paginas"], queryFn: listarPaginas });

  const criar = useMutation({
    mutationFn: async () => {
      const template = TEMPLATES.find((item) => item.id === templateId) || TEMPLATES[0];
      return criarPagina({
        titulo: titulo || "Minha página",
        slug: slugify(titulo || usuario?.nome || "minha-pagina"),
        tema: template.tema,
        blocos: template.blocos(),
      });
    },
    onSuccess: (pagina) => {
      queryClient.invalidateQueries({ queryKey: ["paginas"] });
      navigate(`/app/${pagina.id}`);
    },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  const excluir = useMutation({
    mutationFn: excluirPagina,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paginas"] }),
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  return (
    <Shell>
      <Seo title="Suas páginas" path="/app" robots="noindex,nofollow" />
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Plano {usuario?.limites?.nome || "Free"}</p>
            <h1 className="font-display text-5xl">Suas páginas</h1>
            {usuario?.limites?.anuncios && (
              <p className="mt-2 max-w-md text-sm text-ink-soft">No Free você publica 1 página. Ela leva anúncios. <Link to="/precos" className="text-accent">Tirar anúncios</Link></p>
            )}
          </div>
          <Link to="/precos" className="text-sm text-accent">Fazer upgrade</Link>
        </div>
        {temRascunho() && (
          <p className="mt-6 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
            Você tem um rascunho no navegador. <Link to="/criar" className="underline">Continuar editando</Link>
          </p>
        )}

        <form
          className="mt-8 grid gap-3 rounded-3xl border border-line bg-paper-2 p-5 md:grid-cols-[1fr_12rem_auto]"
          onSubmit={(e) => { e.preventDefault(); criar.mutate(); }}
        >
          <input className="rounded-xl border border-line px-3 py-3" placeholder="Nome da página" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <select className="rounded-xl border border-line px-3 py-3" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {CATEGORIAS.filter((cat) => cat.id !== "todos").map((cat) => (
              <optgroup key={cat.id} label={cat.nome}>
                {TEMPLATES.filter((item) => item.categoria === cat.id).map((template) => (
                  <option key={template.id} value={template.id}>{template.nome}</option>
                ))}
              </optgroup>
            ))}
            <optgroup label="Em branco">
              {TEMPLATES.filter((item) => item.categoria === "todos").map((template) => (
                <option key={template.id} value={template.id}>{template.nome}</option>
              ))}
            </optgroup>
          </select>
          <button disabled={criar.isPending} className="rounded-full bg-ink px-5 py-3 text-sm text-paper">
            {criar.isPending ? "Criando…" : "Nova página"}
          </button>
        </form>

        <div className="mt-10 grid gap-4">
          {(paginas.data || []).map((pagina) => (
            <article key={pagina.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper-2 px-5 py-4">
              <div>
                <Link to={`/app/${pagina.id}`} className="font-medium">{pagina.titulo}</Link>
                <p className="text-sm text-muted">
                  {getSiteBaseUrl().replace(/^https?:\/\//, "")}/{pagina.slug} · {pagina.publicada ? "Publicada" : "Rascunho"}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link to={`/app/${pagina.id}`} className="text-accent">Editar</Link>
                <Link to={`/app/${pagina.id}/painel`}>Painel</Link>
                {pagina.publicada && (
                  <a href={urlPublicaPagina(pagina.slug)} target="_blank" rel="noreferrer">Ver</a>
                )}
                <button type="button" className="text-danger" onClick={() => excluir.mutate(pagina.id)}>Excluir</button>
              </div>
            </article>
          ))}
          {paginas.isSuccess && paginas.data.length === 0 && (
            <p className="text-sm text-muted">
              Nenhuma página ainda. Escolha um modelo aqui ou <Link to="/criar?modelos=1" className="underline">veja todos no editor</Link>.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}
