import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { mensagemErro } from "../services/backendApi";
import { temRascunho } from "../editor/rascunho";

function AuthForm({ modo }) {
  const { login, cadastrar } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modo === "cadastro") await cadastrar(form);
      else await login({ email: form.email, senha: form.senha });
      navigate(temRascunho() ? "/criar" : "/app");
    } catch (error) {
      addToast(mensagemErro(error), "erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <form onSubmit={onSubmit} className="mx-auto mt-20 max-w-md space-y-4 rounded-[2rem] bg-paper-2 p-8 shadow-sm ring-1 ring-line">
        <h1 className="font-display text-4xl">{modo === "cadastro" ? "Crie sua conta" : "Entrar"}</h1>
        {modo === "cadastro" && (
          <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        )}
        <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-2xl border border-line px-3 py-3 outline-none focus:border-accent" type="password" placeholder="Senha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
        <button disabled={loading} className="w-full rounded-full bg-accent py-3 text-sm text-white transition hover:bg-accent-strong disabled:opacity-60">
          {loading ? "Aguarde…" : modo === "cadastro" ? "Começar" : "Entrar"}
        </button>
        <p className="text-center text-sm text-muted">
          {modo === "cadastro" ? (
            <>Já tem conta? <Link to="/entrar" className="text-ink">Entrar</Link></>
          ) : (
            <>Novo por aqui? <Link to="/cadastrar" className="text-ink">Criar conta</Link></>
          )}
        </p>
      </form>
    </Shell>
  );
}

export function LoginPage() { return <AuthForm modo="login" />; }
export function CadastroPage() { return <AuthForm modo="cadastro" />; }
