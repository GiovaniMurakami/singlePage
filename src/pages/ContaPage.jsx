import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { alterarSenha, criarPortal, mensagemErro, reenviarVerificacaoEmail } from "../services/backendApi";
import { Seo } from "../components/Seo";

export function ContaPage() {
  const { usuario } = useAuth();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const [senhas, setSenhas] = useState({ senhaAtual: "", senhaNova: "" });
  const portal = useMutation({
    mutationFn: criarPortal,
    onSuccess: (data) => { window.location.href = data.url; },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });
  const senha = useMutation({
    mutationFn: alterarSenha,
    onSuccess: () => {
      addToast("Senha alterada. Te avisamos por e-mail.");
      setSenhas({ senhaAtual: "", senhaNova: "" });
    },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });
  const verificacao = useMutation({
    mutationFn: reenviarVerificacaoEmail,
    onSuccess: () => addToast("Enviamos outro e-mail de confirmação."),
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  return (
    <Shell>
      <Seo title="Conta" path="/conta" robots="noindex,nofollow" />
      <div className="mx-auto max-w-xl px-5 py-10 md:py-16">
        <h1 className="font-display text-3xl md:text-5xl">Conta</h1>
        {params.get("checkout") === "sucesso" && (
          <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm">Assinatura confirmada. O plano atualiza em instantes via webhook.</p>
        )}
        {usuario && usuario.emailVerificado === false && (
          <div className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm">
            Confirme seu e-mail para receber avisos de publicação e formulário.
            <button type="button" className="ml-2 underline" onClick={() => verificacao.mutate()}>Reenviar</button>
          </div>
        )}
        <dl className="mt-8 space-y-3 rounded-3xl border border-line bg-paper-2 p-6 text-sm">
          <div><dt className="text-muted">Nome</dt><dd>{usuario?.nome}</dd></div>
          <div><dt className="text-muted">E-mail</dt><dd className="break-all">{usuario?.email}{usuario?.emailVerificado ? "" : " · não confirmado"}</dd></div>
          <div><dt className="text-muted">Plano</dt><dd>{usuario?.limites?.nome} · {usuario?.statusAssinatura}</dd></div>
        </dl>
        <button type="button" onClick={() => portal.mutate()} className="mt-6 rounded-full border border-line px-5 py-3 text-sm">
          Gerenciar assinatura no Stripe
        </button>
        <form
          className="mt-8 space-y-3 rounded-3xl border border-line bg-paper-2 p-6"
          onSubmit={(evento) => {
            evento.preventDefault();
            senha.mutate(senhas);
          }}
        >
          <h2 className="text-lg font-semibold">Trocar senha</h2>
          <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="password" required placeholder="Senha atual" value={senhas.senhaAtual} onChange={(e) => setSenhas({ ...senhas, senhaAtual: e.target.value })} />
          <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="password" required minLength={8} placeholder="Nova senha" value={senhas.senhaNova} onChange={(e) => setSenhas({ ...senhas, senhaNova: e.target.value })} />
          <button disabled={senha.isPending} className="rounded-full bg-accent px-5 py-3 text-sm text-white disabled:opacity-60">Salvar senha</button>
        </form>
      </div>
    </Shell>
  );
}
