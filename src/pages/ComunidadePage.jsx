import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flame, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { Seo } from "../components/Seo";
import { MiniaturaPagina } from "../components/ui/MiniaturaPagina";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { alternarCurtidaComunidade, listarComunidade, mensagemErro } from "../services/backendApi";
import { urlPublicaPagina } from "../constants/site";

export function ComunidadePage() {
  const { autenticado } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const comunidade = useQuery({ queryKey: ["comunidade"], queryFn: listarComunidade });

  const curtir = useMutation({
    mutationFn: alternarCurtidaComunidade,
    onMutate: async (paginaId) => {
      await queryClient.cancelQueries({ queryKey: ["comunidade"] });
      const anterior = queryClient.getQueryData(["comunidade"]);
      queryClient.setQueryData(["comunidade"], (atual) => {
        if (!atual?.itens) return atual;
        return {
          ...atual,
          itens: atual.itens.map((item) => {
            if (item.paginaId !== paginaId) return item;
            const curtiu = !item.curtiu;
            return {
              ...item,
              curtiu,
              curtidas: Math.max(0, item.curtidas + (curtiu ? 1 : -1)),
            };
          }),
        };
      });
      return { anterior };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.anterior) queryClient.setQueryData(["comunidade"], ctx.anterior);
      addToast(mensagemErro(error), "erro");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["comunidade"] }),
  });

  function aoCurtir(paginaId) {
    if (!autenticado) {
      addToast("Entre para curtir páginas da comunidade.", "erro");
      navigate("/entrar");
      return;
    }
    curtir.mutate(paginaId);
  }

  const itens = comunidade.data?.itens || [];

  return (
    <Shell>
      <Seo
        title="Comunidade"
        description="Descubra páginas publicadas no Single e curta as que mais gostar."
        path="/comunidade"
      />
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Comunidade</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Páginas no ar</h1>
          <p className="mt-3 text-ink-soft">
            Tudo que está publicado aparece aqui. Curtidas sobem as páginas; as mais curtidas ganham o selo Hot.
          </p>
        </div>

        {comunidade.isLoading && (
          <p className="mt-10 text-sm text-muted">Carregando comunidade…</p>
        )}

        {comunidade.isError && (
          <p className="mt-10 text-sm text-red-700">{mensagemErro(comunidade.error)}</p>
        )}

        {!comunidade.isLoading && !itens.length && (
          <div className="mt-10 rounded-3xl border border-line bg-paper-2 px-6 py-10 text-center">
            <p className="text-ink-soft">Ainda não há páginas publicadas.</p>
            <Link to="/criar" className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm text-white hover:bg-accent-strong">
              Criar a primeira
            </Link>
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => (
            <article
              key={item.paginaId}
              className="group overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <a href={urlPublicaPagina(item.slug)} target="_blank" rel="noreferrer" className="relative block">
                <MiniaturaPagina item={item} />
                {item.hot && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                    <Flame size={14} /> Hot
                  </span>
                )}
              </a>

              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <a
                    href={urlPublicaPagina(item.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate font-medium text-ink hover:underline"
                  >
                    {item.titulo}
                  </a>
                  <p className="mt-1 truncate text-sm text-muted">por {item.autorNome}</p>
                </div>
                <button
                  type="button"
                  onClick={() => aoCurtir(item.paginaId)}
                  className={[
                    "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition",
                    item.curtiu
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-line text-ink-soft hover:border-rose-300 hover:text-rose-700",
                  ].join(" ")}
                  aria-pressed={item.curtiu}
                  aria-label={item.curtiu ? "Remover curtida" : "Curtir página"}
                >
                  <Heart size={16} fill={item.curtiu ? "currentColor" : "none"} />
                  {item.curtidas}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  );
}
