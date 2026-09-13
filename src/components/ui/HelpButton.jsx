import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HelpCircle, X } from "lucide-react";
import { ASSUNTOS_AJUDA, EMAIL_SUPORTE } from "../../constants/suporte";
import { enderecoReservado } from "../../constants/site";

const campo = "w-full rounded-2xl border border-line bg-paper px-3.5 py-3 text-sm outline-none transition focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-soft)]";

function paginaPublicada(pathname) {
  if (pathname.startsWith("/p/")) return true;
  const primeiro = pathname.split("/").filter(Boolean)[0] || "";
  return Boolean(primeiro) && !enderecoReservado(primeiro);
}

export function HelpButton() {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "editor",
    pagina: "",
    esperado: "",
    aconteceu: "",
    mensagem: "",
  });

  if (paginaPublicada(pathname)) return null;

  const set = (campoNome, valor) => setForm((atual) => ({ ...atual, [campoNome]: valor }));

  const enviar = (evento) => {
    evento.preventDefault();
    const assuntoLabel = ASSUNTOS_AJUDA.find((item) => item.id === form.assunto)?.rotulo || form.assunto;
    const corpo = [
      `Nome: ${form.nome}`,
      `E-mail para resposta: ${form.email}`,
      `Assunto: ${assuntoLabel}`,
      `Página / slug: ${form.pagina || "—"}`,
      `O que eu esperava: ${form.esperado || "—"}`,
      `O que aconteceu: ${form.aconteceu || "—"}`,
      `Navegador: ${navigator.userAgent}`,
      "",
      form.mensagem || "",
    ].join("\n");
    const params = new URLSearchParams({
      subject: `Ajuda Single — ${assuntoLabel}`,
      body: corpo,
    });
    window.location.href = `mailto:${EMAIL_SUPORTE}?${params.toString()}`;
    setEnviado(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm text-paper shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition hover:scale-[1.03] active:scale-[0.98]"
      >
        <HelpCircle size={18} />
        Preciso de ajuda
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form
            onSubmit={enviar}
            className="flex h-full w-full max-w-md flex-col bg-paper-2 shadow-[-20px_0_60px_rgba(0,0,0,0.12)]"
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
              {enviado && (
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm">
                  Abri o seu e-mail com a mensagem pronta para {EMAIL_SUPORTE}.
                </p>
              )}
            </div>

            <footer className="border-t border-line px-6 py-4">
              <button type="submit" className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition hover:bg-accent-strong">
                Enviar para o Giovani
              </button>
            </footer>
          </form>
        </div>
      )}
    </>
  );
}
