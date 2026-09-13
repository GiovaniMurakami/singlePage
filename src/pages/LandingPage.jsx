import { Link } from "react-router-dom";
import { ArrowRight, Check, FormInput, Image, Layers3, Link2, MousePointerClick, Sparkles } from "lucide-react";
import { Shell } from "../components/ui/Shell";
import { Reveal } from "../components/ui/Reveal";
import { HeroProduto } from "../components/ui/HeroProduto";
import { TEMPLATES } from "../editor/templates";
import { IconeLucide } from "../editor/icones";
import { Seo } from "../components/Seo";
import { SITE_DESCRICAO, SITE_DOMINIO_CANONICO, SITE_NOME } from "../constants/site";

const PASSOS = [
  ["Escolhe um começo", "Perfil, landing, formulário, portfólio ou all-my-links. Ou uma página em branco."],
  ["Mexe no essencial", "Texto, foto, botão, ícone e o e-mail que recebe o formulário. Sem painel escondido."],
  ["Publica", "Um endereço, um clique. A página vai ao ar. Conta só quando você quiser gravar."],
];

const RECURSOS = [
  [MousePointerClick, "Editor visual", "Clique no bloco, ajuste no painel do lado. É o mesmo gesto o tempo todo."],
  [Sparkles, "Ícones vivos", "Biblioteca pronta. Cor, fundo, tamanho e animação no formulário lateral."],
  [FormInput, "Formulário no e-mail", "Nome, recado e destino. A mensagem abre pronta no seu e-mail."],
  [Image, "Fotos no S3", "Sobe a imagem e ela entra na página. Os modelos já vêm com fotos."],
  [Layers3, "Uma página, várias seções", "Menu com âncoras, no estilo all-my-links, sem virar um site de 12 rotas."],
  [Link2, "Links com estilo", "Preenchido, contorno ou só texto. Abre aqui ou em outra aba."],
];

const FAQ = [
  ["Preciso de conta para começar?", "Não. O editor abre sem cadastro. A conta entra na hora de publicar e guardar na nuvem."],
  ["O formulário vai para onde?", "Para o e-mail que você colocar no bloco. Nome, recado e assunto já vão preenchidos."],
  ["Consigo uma página tipo Linktree?", "Sim. O modelo All my links tem menu, seções, botões e contato numa página só."],
  ["E se eu travar?", "O botão Preciso de ajuda abre um formulário curto e manda o e-mail direto para o suporte."],
  ["O Free tem anúncio?", "Sim. Uma página no Free leva anúncios na publicação. Pro e Ultra tiram os anúncios."],
  ["E se eu precisar de um site completo?", "O plano Sob medida é sem preço fechado. A gente marca uma reunião, captura as features e monta site com backend e o que for personalizado."],
];

export function LandingPage() {
  const modelos = TEMPLATES.filter((item) => item.destaque && item.id !== "em-branco");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NOME,
        url: SITE_DOMINIO_CANONICO,
        description: SITE_DESCRICAO,
        inLanguage: "pt-BR",
        potentialAction: {
          "@type": "CreateAction",
          target: `${SITE_DOMINIO_CANONICO}/criar`,
          name: "Criar página",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NOME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_DOMINIO_CANONICO,
        description: SITE_DESCRICAO,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
      },
    ],
  };

  return (
    <Shell>
      <Seo
        title="Uma página, no ar hoje"
        description={SITE_DESCRICAO}
        path="/"
        jsonLd={jsonLd}
      />
      <section className="hero-glow">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-16 text-center md:pt-24">
          <Reveal>
            <p className="font-display text-4xl tracking-tight md:text-5xl">Single</p>
            <h1 className="font-display mx-auto mt-4 max-w-3xl text-3xl leading-[1.08] text-ink-soft md:text-5xl">
              Uma página no ar hoje — modelo, texto e publicar.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted">
              Editor visual: clique na foto, no título ou no botão e ajuste do lado. Sem tema, sem plugin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/criar?modelos=1" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-strong hover:shadow-md">
                Escolher um modelo <ArrowRight size={16} />
              </Link>
              <Link to="/precos" className="inline-flex min-h-12 items-center rounded-full bg-paper-2 px-6 text-sm font-medium ring-1 ring-line transition hover:bg-paper hover:shadow-sm hover:ring-ink/20">
                Ver preços
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <HeroProduto />
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <Reveal>
          <p className="text-sm font-medium text-accent">Como funciona</p>
          <h2 className="font-display mt-2 text-4xl md:text-5xl">Três gestos. Página pronta.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PASSOS.map(([titulo, texto], index) => (
            <Reveal key={titulo} delay={index * 80}>
              <article className="h-full rounded-[1.6rem] bg-paper-2 p-6 shadow-sm ring-1 ring-line transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm text-accent">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <p className="text-sm font-medium text-accent">Comece por um modelo</p>
            <h2 className="font-display mt-2 text-4xl md:text-5xl">O mesmo tipo de página que você já conhece.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modelos.map((template, index) => (
              <Reveal key={template.id} delay={index * 60}>
                <Link to="/criar?modelos=1" className="group block overflow-hidden rounded-[1.6rem] bg-paper ring-1 ring-line transition hover:-translate-y-1 hover:shadow-xl">
                  <img src={template.capa} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="p-4">
                    <h3 className="font-semibold tracking-tight">{template.nome}</h3>
                    <p className="mt-1 text-sm text-muted">{template.descricao}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <p className="text-sm font-medium text-accent">O editor</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl md:text-5xl">Painel lateral. Ícone, cor, fundo, animação.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map(([Icone, titulo, texto], index) => (
            <Reveal key={titulo} delay={index * 50}>
              <article className="h-full rounded-[1.6rem] bg-paper-2 p-6 ring-1 ring-line transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <Icone size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex justify-center gap-3" delay={80}>
          {["Instagram", "Mail", "Music", "Camera", "Sparkles"].map((nome, index) => (
            <span
              key={nome}
              className={["anim-flutuar", "anim-pulso", "anim-pular", "anim-girar", "anim-flutuar"][index]}
              style={{
                display: "inline-flex",
                padding: 12,
                borderRadius: 18,
                background: ["#0071e3", "#1d1d1f", "#0071e3", "#f5f5f7", "#1d1d1f"][index],
                color: index === 3 ? "#1d1d1f" : "#fff",
                animationDelay: `${index * 120}ms`,
              }}
            >
              <IconeLucide nome={nome} size={20} color="currentColor" />
            </span>
          ))}
        </Reveal>
      </section>

      <section className="bg-ink text-paper-2">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <Reveal>
            <p className="text-sm text-white/60">Planos</p>
            <h2 className="font-display mt-2 text-4xl text-white md:text-5xl">Free para publicar. Sob medida quando virar um site.</h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Uma página no Free, com anúncios. Pro e Ultra tiram anúncio e abrem mais páginas. Precisa de backend e features próprias? A gente marca uma reunião.
            </p>
            <Link to="/precos" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-ink transition hover:bg-white/90 hover:shadow-md">
              Comparar planos
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <ul className="space-y-3 text-sm text-white/80">
              {["Editor sem conta", "Modelos prontos", "Formulário para o seu e-mail", "Ícones com animação", "Ajuda humana no botão da tela"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-[#7dd3fc]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <h2 className="font-display text-center text-4xl">Perguntas que a gente já ouviu</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map(([pergunta, resposta], index) => (
            <Reveal key={pergunta} delay={index * 40}>
              <details className="group rounded-[1.4rem] bg-paper-2 px-5 py-4 ring-1 ring-line transition hover:shadow-sm hover:ring-ink/15">
                <summary className="cursor-pointer list-none font-medium tracking-tight">{pergunta}</summary>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{resposta}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 pb-28">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-paper-2 px-8 py-14 text-center shadow-sm ring-1 ring-line">
            <h2 className="font-display text-4xl md:text-5xl">Começa pelo modelo. O resto é ajuste.</h2>
            <p className="mx-auto mt-4 max-w-lg text-ink-soft">Abre o editor, escolhe o tipo de página e publica quando estiver bom o suficiente.</p>
            <Link to="/criar?modelos=1" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-strong hover:shadow-md">
              Criar minha página
            </Link>
          </div>
        </Reveal>
      </section>
    </Shell>
  );
}
