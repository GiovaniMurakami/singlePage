import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { criarPortal, mensagemErro } from "../services/backendApi";
import { Seo } from "../components/Seo";

export function ContaPage() {
  const { usuario } = useAuth();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const portal = useMutation({
    mutationFn: criarPortal,
    onSuccess: (data) => { window.location.href = data.url; },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  return (
    <Shell>
      <Seo title="Conta" path="/conta" robots="noindex,nofollow" />
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="font-display text-5xl">Conta</h1>
        {params.get("checkout") === "sucesso" && (
          <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm">Assinatura confirmada. O plano atualiza em instantes via webhook.</p>
        )}
        <dl className="mt-8 space-y-3 rounded-3xl border border-line bg-paper-2 p-6 text-sm">
          <div><dt className="text-muted">Nome</dt><dd>{usuario?.nome}</dd></div>
          <div><dt className="text-muted">E-mail</dt><dd>{usuario?.email}</dd></div>
          <div><dt className="text-muted">Plano</dt><dd>{usuario?.limites?.nome} · {usuario?.statusAssinatura}</dd></div>
        </dl>
        <button type="button" onClick={() => portal.mutate()} className="mt-6 rounded-full border border-line px-5 py-3 text-sm">
          Gerenciar assinatura no Stripe
        </button>
      </div>
    </Shell>
  );
}
