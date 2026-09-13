import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick, Eye, Send, Users, TrendingUp, Clock } from "lucide-react";
import { Shell } from "../components/ui/Shell";
import { Seo } from "../components/Seo";
import { buscarAnalyticsPagina } from "../services/backendApi";
import { getSiteBaseUrl, urlPublicaPagina } from "../constants/site";

function formatar(n) {
  return new Intl.NumberFormat("pt-BR").format(n || 0);
}

function percentual(parte, total) {
  if (!total) return "0%";
  return `${((parte / total) * 100).toFixed(1).replace(".", ",")}%`;
}

function dataCurta(iso) {
  const [, mes, dia] = String(iso).split("-");
  return `${dia}/${mes}`;
}

function horaLabel(h) {
  return `${String(h).padStart(2, "0")}h`;
}

function CardKpi({ icone: Icone, rotulo, valor, dica }) {
  return (
    <article className="rounded-2xl border border-line bg-paper-2 px-5 py-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
        <Icone size={14} />
        {rotulo}
      </p>
      <p className="mt-2 font-display text-3xl">{valor}</p>
      {dica && <p className="mt-1 text-xs text-muted">{dica}</p>}
    </article>
  );
}

function Barras({ itens, valor, rotulo }) {
  const max = Math.max(1, ...itens.map(valor));
  return (
    <div className="flex h-40 items-end gap-1">
      {itens.map((item, index) => {
        const altura = Math.round((valor(item) / max) * 100);
        return (
          <div key={rotulo(item, index)} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-md bg-accent/80"
                style={{ height: `${Math.max(altura, valor(item) ? 6 : 2)}%` }}
                title={`${rotulo(item, index)}: ${formatar(valor(item))}`}
              />
            </div>
            <span className="truncate text-[10px] text-muted">{rotulo(item, index)}</span>
          </div>
        );
      })}
    </div>
  );
}

function Ranking({ titulo, itens }) {
  const max = Math.max(1, ...itens.map((item) => item.valor));
  return (
    <section className="rounded-2xl border border-line bg-paper-2 p-5">
      <h2 className="text-sm font-medium">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Ainda sem dados.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {itens.map((item) => (
            <li key={item.nome}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{item.nome}</span>
                <span className="shrink-0 text-muted">{formatar(item.valor)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(item.valor / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AnalyticsPage() {
  const { paginaId } = useParams();
  const consulta = useQuery({
    queryKey: ["analytics", paginaId],
    queryFn: () => buscarAnalyticsPagina(paginaId),
  });

  const dados = consulta.data;
  const totais = dados?.totais || { visitas: 0, cliques: 0, formularios: 0, porHora: [], destinos: {}, origens: {} };
  const serie = dados?.serie || [];
  const pagina = dados?.pagina;
  const unicos7 = serie.slice(-7).reduce((acc, dia) => acc + (dia.unicos || 0), 0);
  const visitas7 = serie.slice(-7).reduce((acc, dia) => acc + (dia.visitas || 0), 0);
  const pico = (totais.porHora || []).reduce((melhor, n, hora) => (n > (melhor.n || 0) ? { n, hora } : melhor), { n: 0, hora: 0 });
  const destinos = Object.entries(totais.destinos || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([nome, valor]) => ({ nome, valor }));
  const origens = Object.entries(totais.origens || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([nome, valor]) => ({ nome: nome || "direto", valor }));

  return (
    <Shell>
      <Seo title={pagina ? `Painel · ${pagina.titulo}` : "Painel"} path={`/app/${paginaId}/painel`} robots="noindex,nofollow" />
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-sm text-muted">
          <Link to="/app" className="hover:text-ink">Páginas</Link>
          {pagina && (
            <>
              {" · "}
              <Link to={`/app/${pagina.id}`} className="hover:text-ink">{pagina.titulo}</Link>
            </>
          )}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl">Painel</h1>
            <p className="mt-2 text-sm text-ink-soft">
              {pagina
                ? `${getSiteBaseUrl().replace(/^https?:\/\//, "")}/${pagina.slug} · ${pagina.publicada ? "Publicada" : "Rascunho"}`
                : "Acessos, cliques e o que mais a página recebeu."}
            </p>
          </div>
          {pagina && (
            <div className="flex gap-3 text-sm">
              <Link to={`/app/${pagina.id}`} className="rounded-full border border-line px-4 py-2">Editar</Link>
              {pagina.publicada && (
                <a href={urlPublicaPagina(pagina.slug)} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-paper">
                  Ver página
                </a>
              )}
            </div>
          )}
        </div>

        {consulta.isLoading && <p className="mt-10 text-sm text-muted">Carregando números…</p>}
        {consulta.isError && <p className="mt-10 text-sm text-danger">Não deu para carregar o painel.</p>}

        {dados && (
          <>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CardKpi icone={Eye} rotulo="Visitas" valor={formatar(totais.visitas)} dica={`${formatar(visitas7)} nos últimos 7 dias`} />
              <CardKpi icone={MousePointerClick} rotulo="Cliques" valor={formatar(totais.cliques)} dica={`${percentual(totais.cliques, totais.visitas)} das visitas`} />
              <CardKpi icone={TrendingUp} rotulo="Taxa de clique" valor={percentual(totais.cliques, totais.visitas)} dica="Cliques em links da página" />
              <CardKpi icone={Users} rotulo="Visitantes (7 dias)" valor={formatar(unicos7)} dica="Pessoas distintas no navegador" />
              <CardKpi icone={Send} rotulo="Formulários" valor={formatar(totais.formularios)} dica="Envios do formulário da página" />
              <CardKpi icone={Clock} rotulo="Horário de pico" valor={pico.n ? horaLabel(pico.hora) : "—"} dica={pico.n ? `${formatar(pico.n)} eventos nesse horário` : "Ainda sem pico"} />
            </div>

            {!totais.visitas && (
              <p className="mt-8 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
                O painel começa a encher quando a página está publicada e alguém a abre. Publique e compartilhe o link.
              </p>
            )}

            <section className="mt-8 rounded-2xl border border-line bg-paper-2 p-5">
              <h2 className="text-sm font-medium">Últimos 14 dias</h2>
              <p className="mt-1 text-xs text-muted">Visitas por dia</p>
              <div className="mt-4">
                {serie.length ? (
                  <Barras itens={serie} valor={(dia) => dia.visitas} rotulo={(dia) => dataCurta(dia.data)} />
                ) : (
                  <p className="text-sm text-muted">Nenhuma visita registrada ainda.</p>
                )}
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-line bg-paper-2 p-5">
              <h2 className="text-sm font-medium">Ao longo do dia</h2>
              <p className="mt-1 text-xs text-muted">Quando as pessoas mais aparecem</p>
              <div className="mt-4">
                <Barras
                  itens={(totais.porHora || []).map((n, hora) => ({ hora, n }))}
                  valor={(item) => item.n}
                  rotulo={(item) => (item.hora % 3 === 0 ? horaLabel(item.hora) : "")}
                />
              </div>
            </section>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Ranking titulo="Links mais clicados" itens={destinos} />
              <Ranking titulo="De onde vieram" itens={origens} />
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
