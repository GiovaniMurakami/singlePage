import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { criarCheckout, listarPlanos, mensagemErro } from "../services/backendApi";
import { mailtoReuniaoSobMedida } from "../constants/suporte";
import { Seo } from "../components/Seo";

const CARD = "flex h-full flex-col rounded-[1.8rem] bg-paper-2 p-6 ring-1 ring-line transition duration-200 hover:-translate-y-1 hover:shadow-lg";
const BOTAO = "flex min-h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-white transition hover:bg-accent-strong hover:shadow-md disabled:pointer-events-none disabled:opacity-50";
const BOTAO_ATUAL = "flex min-h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper";

const PLANOS_FALLBACK = [
  { codigo: "free", nome: "Free", descricao: "Uma página. Anúncios na página publicada.", precoCentavos: 0, precoMensalCentavos: 0, periodo: "mes", paginasMaximas: 1, removeMarca: false, dominioProprio: false, anuncios: true },
  { codigo: "pro", nome: "Pro", descricao: "Até 10 páginas no domínio singlepage.com.br, sem marca, sem anúncios e com formulários ilimitados.", precoCentavos: 990, precoMensalCentavos: 990, periodo: "mes", paginasMaximas: 10, removeMarca: true, dominioProprio: false, anuncios: false, destaque: true },
  { codigo: "ultra", nome: "Ultra", descricao: "Até 50 páginas, domínio personalizável e prioridade no suporte.", precoCentavos: 4990, precoMensalCentavos: 4990, periodo: "ano", paginasMaximas: 50, removeMarca: true, dominioProprio: true, anuncios: false },
];

const PLANO_SOB_MEDIDA = {
  codigo: "sob-medida",
  nome: "Sob medida",
  descricao: "Um site completo, com backend e as features que o Single sozinho não cobre.",
  precoCentavos: null,
  precoMensalCentavos: null,
  periodo: null,
  sobConsulta: true,
  itens: [
    "Site completo — várias páginas, não só uma",
    "Backend e painel sob medida",
    "Features personalizadas",
    "Reunião para captar o que precisa entrar",
  ],
};

function formatarPreco(centavos) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

function rotuloPreco(plano) {
  const valor = plano.precoCentavos ?? plano.precoMensalCentavos;
  if (valor == null) return "A conversar";
  if (valor === 0) return "Grátis";
  const periodo = plano.periodo === "ano" ? "/ano" : "/mês";
  return (
    <>
      {formatarPreco(valor)}
      <span className="ml-1 text-lg font-sans text-muted">{periodo}</span>
    </>
  );
}

export function PrecosPage() {
  const { autenticado, usuario } = useAuth();
  const { addToast } = useToast();
  const planos = useQuery({ queryKey: ["planos"], queryFn: listarPlanos });
  const checkout = useMutation({
    mutationFn: criarCheckout,
    onSuccess: (data) => { window.location.href = data.url; },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  const lista = [...(planos.data?.length ? planos.data : PLANOS_FALLBACK), PLANO_SOB_MEDIDA];

  return (
    <Shell>
      <Seo
        title="Preços"
        description="Planos Free, Pro e Ultra para publicar sua página. Ou Sob medida para um site completo com backend."
        path="/precos"
      />
      <div className="hero-glow mx-auto max-w-6xl px-5 py-20">
        <h1 className="font-display text-center text-5xl md:text-6xl">Simples de começar. Barato de crescer.</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-ink-soft">
          Free, Pro e Ultra para a página única. Se o projeto pediu site completo, a gente senta e desenha juntos.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lista.map((plano) => {
            const atual = usuario?.plano === plano.codigo;
            const sobMedida = plano.sobConsulta;
            return (
              <article key={plano.codigo} className={CARD}>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{plano.nome}</p>
                <p className="font-display mt-3 text-4xl">
                  {sobMedida ? "A conversar" : rotuloPreco(plano)}
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{plano.descricao}</p>
                <ul className="mt-4 space-y-1 text-sm text-ink-soft">
                  {sobMedida ? (
                    plano.itens.map((item) => <li key={item}>{item}</li>)
                  ) : (
                    <>
                      <li>{plano.paginasMaximas} página(s)</li>
                      <li>{plano.removeMarca ? "Sem marca Single" : "Com marca Single"}</li>
                      <li>{plano.anuncios ? "Anúncios na página publicada" : "Sem anúncios"}</li>
                      <li>{plano.dominioProprio ? "Domínio personalizável" : "Endereço em singlepage.com.br"}</li>
                    </>
                  )}
                </ul>
                <div className="mt-auto pt-6">
                  {sobMedida ? (
                    <a href={mailtoReuniaoSobMedida()} className={BOTAO}>
                      Agendar reunião
                    </a>
                  ) : plano.codigo === "free" ? (
                    atual ? (
                      <span className={BOTAO_ATUAL}>Seu plano atual</span>
                    ) : (
                      <Link to="/criar?modelos=1" className={BOTAO}>
                        Começar grátis
                      </Link>
                    )
                  ) : !autenticado ? (
                    <Link to="/entrar" className={BOTAO}>
                      Entre para assinar
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={atual || checkout.isPending}
                      onClick={() => checkout.mutate(plano.codigo)}
                      className={atual ? BOTAO_ATUAL : BOTAO}
                    >
                      {atual ? "Seu plano atual" : "Assinar no Stripe"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
