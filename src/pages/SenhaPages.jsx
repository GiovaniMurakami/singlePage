import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { Seo } from "../components/Seo";
import { useToast } from "../context/ToastContext";
import { mensagemErro, pedirRedefinicaoSenha, redefinirSenha } from "../services/backendApi";

export function EsqueciSenhaPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await pedirRedefinicaoSenha(email);
      addToast("Se o e-mail existir, você recebe o link em instantes.");
    } catch (error) {
      addToast(mensagemErro(error), "erro");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell>
      <Seo title="Esqueci a senha" path="/esqueci-senha" robots="noindex,nofollow" />
      <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md space-y-4 rounded-[2rem] bg-paper-2 p-6 shadow-sm ring-1 ring-line sm:mt-20 sm:p-8">
        <h1 className="font-display text-3xl md:text-4xl">Esqueci a senha</h1>
        <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="email" required placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={enviando} className="w-full rounded-full bg-accent py-3 text-sm text-white disabled:opacity-60">{enviando ? "Enviando…" : "Enviar link"}</button>
        <p className="text-center text-sm text-muted"><Link to="/entrar" className="text-ink">Voltar ao login</Link></p>
      </form>
    </Shell>
  );
}

export function RedefinirSenhaPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { addToast } = useToast();
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);

  const onSubmit = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await redefinirSenha({ token, senha });
      setOk(true);
    } catch (error) {
      addToast(mensagemErro(error, "Link inválido ou expirado."), "erro");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell>
      <Seo title="Nova senha" path="/redefinir-senha" robots="noindex,nofollow" />
      <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md space-y-4 rounded-[2rem] bg-paper-2 p-6 shadow-sm ring-1 ring-line sm:mt-20 sm:p-8">
        <h1 className="font-display text-3xl md:text-4xl">Nova senha</h1>
        {ok ? (
          <p className="text-sm">Senha atualizada. <Link to="/entrar" className="text-ink">Entrar</Link></p>
        ) : (
          <>
            <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="password" required minLength={8} placeholder="Nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button disabled={enviando || !token} className="w-full rounded-full bg-accent py-3 text-sm text-white disabled:opacity-60">{enviando ? "Salvando…" : "Salvar senha"}</button>
          </>
        )}
      </form>
    </Shell>
  );
}
