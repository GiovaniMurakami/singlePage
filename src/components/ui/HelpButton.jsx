import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HelpCircle, X } from "lucide-react";
import { ASSUNTOS_AJUDA } from "../../constants/suporte";
import { enviarPedidoAjuda, mensagemErro } from "../../services/backendApi";
import { enderecoReservado, slugDoHost } from "../../constants/site";

const campo = "w-full rounded-2xl border border-line bg-paper px-3.5 py-3 text-sm outline-none transition focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-soft)]";

function paginaPublicada(pathname) {
  if (slugDoHost()) return true;
  if (pathname.startsWith("/p/")) return true;
  const primeiro = pathname.split("/").filter(Boolean)[0] || "";
  return Boolean(primeiro) && !enderecoReservado(primeiro);
}

export function HelpButton() {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "editor",
    pagina: "",
    esperado: "",
    aconteceu: "",
    mensagem: "",
  });

  const noEditor = pathname === "/criar" || /^\/app\/[^/]+$/.test(pathname);
  if (paginaPublicada(pathname) || noEditor) return null;

  const set = (campoNome, valor) => setForm((atual) => ({ ...atual, [campoNome]: valor }));

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      await enviarPedidoAjuda({
        ...form,
        assunto: ASSUNTOS_AJUDA.find((item) => item.id === form.assunto)?.rotulo || form.assunto,
        navegador: navigator.userAgent,
      });
      setEnviado(true);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível enviar. Tente de novo."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Preciso de ajuda"
        className="fixed right-[max(1.25rem,env(safe-area-inset-right))] z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-3 text-sm text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition hover:scale-[1.03] active:scale-[0.98] sm:px-4"
        style={{ bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
      >
        <HelpCircle size={18} />
        <span className="hidden sm:inline">Preciso de ajuda</span>
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form
            onSubmit={enviar}
            className="flex h-full w-full max-w-md flex-col bg-paper-2 pt-[env(safe-area-inset-top)] shadow-[-20px_0_60px_rgba(0,0,0,0.12)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Suporte</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">Como posso te ajudar?</h2>
                <p className="mt-1 text-sm text-ink-soft">Responda o essencial. Eu recebo no e-mail e te devolvo por lá.</p>
              </div>
              <button type="button" className="rounded-full p-2 text-muted hover:bg-paper" onClick={() => setAberto(false)} aria-label="Fechar">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">Seu nome</span>
                <input className={campo} required value={form.nome} onChange={(e) => set("nome", e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">E-mail para eu te responder</span>
                <input className={campo} type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">O que você precisa</span>
                <select className={campo} value={form.assunto} onChange={(e) => set("assunto", e.target.value)}>
                  {ASSUNTOS_AJUDA.map((item) => (
                    <option key={item.id} value={item.id}>{item.rotulo}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">Página ou slug, se tiver</span>
                <input className={campo} placeholder="ex.: meu-studio" value={form.pagina} onChange={(e) => set("pagina", e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">O que você tentou fazer</span>
                <textarea className={campo} rows={2} value={form.esperado} onChange={(e) => set("esperado", e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">O que aconteceu de fato</span>
                <textarea className={campo} rows={2} value={form.aconteceu} onChange={(e) => set("aconteceu", e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted">Mais algum detalhe</span>
                <textarea className={campo} rows={3} value={form.mensagem} onChange={(e) => set("mensagem", e.target.value)} />
              </label>
              {erro && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{erro}</p>
              )}
              {enviado && (
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm">
                  Recebi sua mensagem. Respondo no e-mail que você informou.
                </p>
              )}
            </div>

            <footer className="border-t border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="submit" disabled={enviando} className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition hover:bg-accent-strong disabled:opacity-60">
                {enviando ? "Enviando…" : "Enviar para o Giovani"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </>
  );
}
