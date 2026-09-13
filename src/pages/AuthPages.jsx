import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { mensagemErro } from "../services/backendApi";
import { temRascunho } from "../editor/rascunho";
import { Seo } from "../components/Seo";

function AuthForm({ modo }) {
  const { login, cadastrar } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", aceiteTermos: false });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modo === "cadastro") {
        if (!form.aceiteTermos) return;
        await cadastrar({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          aceiteTermos: true,
        });
        addToast("Enviamos um e-mail para você confirmar a conta.", "sucesso");
      } else await login({ email: form.email, senha: form.senha });
      navigate(temRascunho() ? "/criar" : "/app");
    } catch (error) {
      addToast(mensagemErro(error), "erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <Seo
        title={modo === "cadastro" ? "Criar conta" : "Entrar"}
        description={modo === "cadastro" ? "Crie sua conta no Single para publicar e guardar sua página." : "Entre na sua conta Single."}
        path={modo === "cadastro" ? "/cadastrar" : "/entrar"}
        robots="noindex,nofollow"
      />
      <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md space-y-4 rounded-[2rem] bg-paper-2 p-6 shadow-sm ring-1 ring-line sm:mt-20 sm:p-8">
        <h1 className="font-display text-3xl md:text-4xl">{modo === "cadastro" ? "Crie sua conta" : "Entrar"}</h1>
        {modo === "cadastro" && (
          <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        )}
        <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="password" placeholder="Senha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
        {modo === "cadastro" && (
          <label className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 shrink-0 accent-ink"
              checked={form.aceiteTermos}
              onChange={(e) => setForm({ ...form, aceiteTermos: e.target.checked })}
            />
            <span>
              Li e aceito os{" "}
              <Link to="/termos" target="_blank" rel="noreferrer" className="text-ink underline">Termos de Uso</Link>
              {" "}e a{" "}
              <Link to="/privacidade" target="_blank" rel="noreferrer" className="text-ink underline">Política de Privacidade</Link>.
            </span>
          </label>
        )}
        <button disabled={loading || (modo === "cadastro" && !form.aceiteTermos)} className="w-full rounded-full bg-accent py-3 text-sm text-white transition hover:bg-accent-strong disabled:opacity-60">
          {loading ? "Aguarde…" : modo === "cadastro" ? "Começar" : "Entrar"}
        </button>
        <p className="text-center text-sm text-muted">
          {modo === "cadastro" ? (
            <>Já tem conta? <Link to="/entrar" className="text-ink">Entrar</Link></>
          ) : (
            <>Novo por aqui? <Link to="/cadastrar" className="text-ink">Criar conta</Link>
              <span className="block mt-2"><Link to="/esqueci-senha" className="text-ink">Esqueci a senha</Link></span></>
          )}
        </p>
      </form>
    </Shell>
  );
}

export function LoginPage() { return <AuthForm modo="login" />; }
export function CadastroPage() { return <AuthForm modo="cadastro" />; }
