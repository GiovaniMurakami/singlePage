import { cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { IconeLucide, classeAnimacaoIcone } from "./icones";
import { AnuncioSlot } from "../components/ui/AnuncioSlot";
import { enviarFormularioPagina } from "../services/backendApi";
import { TIPOS_ESTRUTURA, TIPOS_PECA, camposDoFormulario, ehTipoEstrutura, nomeDoTipo } from "./templates";
import { layoutIdDoBloco, temLayouts } from "./blocoLayouts";
import { caixaDoBloco, classeBotaoTamanho, classeTexto, classeTitulo, estiloDaParte, estiloDoItem, estiloMidia, raioCss, temaDoBloco } from "./aparencia";
import { FONTES, cssAlinhamento, cssOrientacao } from "./fontes";
import { cssFundo } from "./fundo";
import { encerrarLevantamento, iniciarLevantamento } from "./arrastoVisual";
import { fonteCaixaDaParte, idParte, partesDoBloco, podeRemoverParte, separarAlvo } from "./partes";
import { ALVO_FUNDO, ALVO_PAGINA } from "./alvos";
import { formaBotao, raioIcone } from "./estilos";
import { ROTULO_PLANO, planoPermite } from "./planos";
import { useAuth } from "../context/AuthContext";

const LARGURAS = {
  estreita: "36rem",
  media: "44rem",
  larga: "56rem",
  completa: "100%",
};

const HOLD_EXCLUIR_MS = 200;

function BotaoExcluirHold({ onConfirmar, rotulo = "Excluir" }) {
  const [progresso, setProgresso] = useState(0);
  const quadro = useRef(0);
  const inicio = useRef(0);

  const cancelar = () => {
    cancelAnimationFrame(quadro.current);
    inicio.current = 0;
    setProgresso(0);
  };

  const pressionar = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    evento.currentTarget.setPointerCapture?.(evento.pointerId);
    inicio.current = performance.now();
    const tick = (agora) => {
      if (!inicio.current) return;
      const fator = Math.min(1, (agora - inicio.current) / HOLD_EXCLUIR_MS);
      setProgresso(fator);
      if (fator >= 1) {
        inicio.current = 0;
        cancelAnimationFrame(quadro.current);
        setProgresso(0);
        onConfirmar();
        return;
      }
      quadro.current = requestAnimationFrame(tick);
    };
    quadro.current = requestAnimationFrame(tick);
  };

  return (
    <button
      type="button"
      aria-label={`Segure para excluir: ${rotulo}`}
      title="Segure para excluir"
      className="botao-excluir-hold inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-white"
      style={{ "--hold": progresso }}
      onPointerDown={pressionar}
      onPointerUp={cancelar}
      onPointerCancel={cancelar}
      onLostPointerCapture={cancelar}
      onClick={(evento) => evento.stopPropagation()}
    >
      <span className="botao-excluir-hold-fill" aria-hidden />
      <Trash2 size={13} />
      {rotulo}
    </button>
  );
}

function semMarca(_parteId, node, className = "") {
  if (!className) return node;
  if (!isValidElement(node)) return <div className={className}>{node}</div>;
  const atual = node.props.className || "";
  return cloneElement(node, { className: [atual, className].filter(Boolean).join(" ") });
}

function parteEncaixa(bloco, parte) {
  const id = parte?.id || "";
  if (id === "botao") return true;
  return (bloco?.tipo === "botoes" || bloco?.tipo === "redes" || bloco?.tipo === "navegacao") && id.startsWith("item-");
}

function Parte({
  bloco,
  parte,
  ativo,
  onSelect,
  onRemover,
  className = "",
  children,
}) {
  const alvo = idParte(bloco.id, parte.id);
  const alignSelf = fonteCaixaDaParte(bloco, parte).alignSelf;

  return (
    <div
      role="button"
      tabIndex={0}
      title={`Editar ${parte.nome.toLowerCase()}`}
      data-parte-ativa={ativo ? "true" : undefined}
      className={`parte-alvo ${parteEncaixa(bloco, parte) ? "parte-alvo-encaixe" : ""} ${className}`}
      style={alignSelf ? { alignSelf } : undefined}
      onClick={(evento) => {
        evento.stopPropagation();
        onSelect(alvo);
      }}
      onKeyDown={(evento) => {
        if (evento.key !== "Enter") return;
        evento.stopPropagation();
        onSelect(alvo);
      }}
    >
      <span className="parte-etiqueta" data-editor-chrome>{parte.nome}</span>
      {ativo && onRemover && podeRemoverParte(bloco, parte.id) && (
        <div className="parte-excluir" data-editor-chrome>
          <BotaoExcluirHold rotulo={parte.nome} onConfirmar={() => onRemover(bloco.id, parte.id)} />
        </div>
      )}
      {children}
    </div>
  );
}

function criarMarcador(bloco, selecionadoId, onSelect, extras = {}) {
  const partes = partesDoBloco(bloco);
  if (!partes.length) return undefined;
  return (parteId, node, className = "") => {
    const parte = partes.find((item) => item.id === parteId);
    if (!parte) return node;
    return (
      <Parte
        bloco={bloco}
        parte={parte}
        ativo={selecionadoId === idParte(bloco.id, parteId)}
        onSelect={onSelect}
        onRemover={extras.onRemoverParte}
        className={className}
      >
        {node}
      </Parte>
    );
  };
}

function MenuPecas({ ancoraRef, onEscolher, onFechar, permitirEstrutura = false }) {
  const { usuario } = useAuth();
  const plano = usuario?.plano || "free";
  const [busca, setBusca] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, abrirCima: false });
  const caixa = useRef(null);
  const MENU_LARGURA = 272;
  const MENU_ALTURA = 320;

  useLayoutEffect(() => {
    const colocar = () => {
      const alvo = ancoraRef?.current;
      if (!alvo) return;
      const ret = alvo.getBoundingClientRect();
      let left = ret.left + ret.width / 2 - MENU_LARGURA / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - MENU_LARGURA - 8));
      const cabeEmbaixo = ret.bottom + 8 + MENU_ALTURA <= window.innerHeight - 8;
      const top = cabeEmbaixo
        ? ret.bottom + 8
        : Math.max(8, ret.top - MENU_ALTURA - 8);
      setPos({ top, left, abrirCima: !cabeEmbaixo });
    };
    colocar();
    window.addEventListener("resize", colocar);
    window.addEventListener("scroll", colocar, true);
    return () => {
      window.removeEventListener("resize", colocar);
      window.removeEventListener("scroll", colocar, true);
    };
  }, [ancoraRef]);

  useEffect(() => {
    const clicouFora = (evento) => {
      if (caixa.current?.contains(evento.target)) return;
      if (ancoraRef?.current?.contains(evento.target)) return;
      onFechar();
    };
    const teclou = (evento) => {
      if (evento.key === "Escape") onFechar();
    };
    document.addEventListener("pointerdown", clicouFora, true);
    document.addEventListener("keydown", teclou);
    return () => {
      document.removeEventListener("pointerdown", clicouFora, true);
      document.removeEventListener("keydown", teclou);
    };
  }, [onFechar, ancoraRef]);

  const termo = busca.trim().toLowerCase();
  const filtrar = (itens) => (
    termo
      ? itens.filter((item) => `${item.nome} ${item.descricao || ""}`.toLowerCase().includes(termo))
      : itens
  );
  const grupos = [
    { nome: "Conteúdo", itens: filtrar(TIPOS_PECA) },
    ...(permitirEstrutura ? [{ nome: "Estrutura da página", itens: filtrar(TIPOS_ESTRUTURA) }] : []),
  ].filter((grupo) => grupo.itens.length);

  return createPortal(
    <div
      ref={caixa}
      className="menu-pecas"
      data-editor-chrome
      style={{ top: pos.top, left: pos.left, width: MENU_LARGURA, maxHeight: MENU_ALTURA }}
      onClick={(evento) => evento.stopPropagation()}
    >
      <input
        autoFocus
        className="menu-pecas-busca"
        placeholder="O que você quer colocar aqui?"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
      />
      <div className="menu-pecas-lista">
        {grupos.map((grupo) => (
          <div key={grupo.nome}>
            <p className="menu-pecas-grupo">{grupo.nome}</p>
            {grupo.itens.map((tipo) => {
              const liberada = planoPermite(plano, tipo.plano);
              return (
                <button
                  key={tipo.tipo}
                  type="button"
                  className="menu-pecas-item"
                  data-travada={liberada ? undefined : "true"}
                  title={liberada ? undefined : `Disponível no plano ${ROTULO_PLANO[tipo.plano]}`}
                  onClick={() => (liberada ? onEscolher(tipo.tipo) : window.open("/precos", "_blank"))}
                >
                  <span className="menu-pecas-icone">
                    {tipo.icone ? <IconeLucide nome={tipo.icone} size={14} color="currentColor" /> : <Plus size={14} />}
                  </span>
                  <span>
                    <strong className="block">
                      {tipo.nome}
                      {!liberada && <span className="menu-pecas-selo">{ROTULO_PLANO[tipo.plano]}</span>}
                    </strong>
                    <span className="menu-pecas-dica">{tipo.descricao}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
        {!grupos.length && <p className="menu-pecas-dica px-2 py-3">Nada com esse nome.</p>}
      </div>
    </div>,
    document.body
  );
}

function PontoDeInsercao({ onEscolher, permitirEstrutura = false, rotulo = "Adicionar aqui" }) {
  const [aberto, setAberto] = useState(false);
  const ancora = useRef(null);
  return (
    <div ref={ancora} className="ponto-insercao" data-editor-chrome data-aberto={aberto ? "true" : undefined}>
      <button
        type="button"
        className="ponto-insercao-botao"
        title={rotulo}
        onClick={(evento) => {
          evento.stopPropagation();
          setAberto((valor) => !valor);
        }}
      >
        <Plus size={13} />
        <span>{rotulo}</span>
      </button>
      {aberto && (
        <MenuPecas
          ancoraRef={ancora}
          permitirEstrutura={permitirEstrutura}
          onFechar={() => setAberto(false)}
          onEscolher={(tipo) => {
            setAberto(false);
            onEscolher(tipo);
          }}
        />
      )}
    </div>
  );
}

function embedUrl(url = "") {
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
  }
  return url;
}

function estiloBotao(estilo, tema, item = {}, forma = {}) {
  const daForma = forma.base || {};
  if (estilo === "texto") {
    return { className: "underline-offset-4", style: { color: item.cor || tema.destaque, background: "transparent" } };
  }
  if (estilo === "contorno") {
    return {
      className: `border ${forma.className || ""}`,
      style: {
        ...daForma,
        borderColor: item.fundo || daForma.borderColor || tema.destaque,
        color: item.cor || daForma.color || tema.texto,
        background: "transparent",
      },
    };
  }
  return {
    className: forma.className || "",
    style: {
      ...daForma,
      background: item.fundo || daForma.background || tema.destaque,
      color: item.cor || daForma.color || tema.botaoCor || "#ffffff",
    },
  };
}

function raioPadraoBotao(item = {}, forma = {}) {
  if (item.raio !== "" && item.raio != null) return undefined;
  if ((item.estilo || "preenchido") === "texto") return undefined;
  return forma.raio || "999px";
}

function itemBotaoCapa(props, extras = {}) {
  return {
    rotulo: props.cta,
    url: props.url,
    estilo: props.estiloBotao,
    tamanho: props.tamanhoBotao,
    novaAba: props.novaAba,
    fundo: props.fundoBotao,
    cor: props.corBotao,
    hoverFundo: props.hoverFundo,
    hoverCor: props.hoverCor,
    hoverEscala: props.hoverEscala,
    hoverSombra: props.hoverSombra,
    ...(props.estiloPartes?.botao || {}),
    ...extras,
  };
}

function estiloInterativo(item, base = {}) {
  const fundo = item.fundo || base.background || "transparent";
  const cor = item.cor || base.color || "currentColor";
  return {
    ...base,
    "--item-bg": fundo,
    "--item-fg": cor,
    "--item-border": item.borda || base.borderColor || "transparent",
    "--item-bg-hover": item.hoverFundo || fundo,
    "--item-fg-hover": item.hoverCor || cor,
    "--item-border-hover": item.hoverBorda || item.hoverFundo || item.borda || base.borderColor || "transparent",
    "--item-scale-hover": String(item.hoverEscala || 1.04),
    "--item-shadow-hover": item.hoverSombra === false ? "none" : "0 12px 30px rgba(0,0,0,0.16)",
  };
}

function BotaoPagina({ item, tema, className = "" }) {
  const forma = formaBotao(tema.botao);
  const visual = estiloBotao(item.estilo || "preenchido", tema, item, forma);
  const tamanho = classeBotaoTamanho(item.tamanho || item.tamanhoBotao);
  const estilo = estiloDoItem(item, estiloInterativo({
    ...item,
    fundo: item.fundo || visual.style.background,
    cor: item.cor || visual.style.color,
    borda: visual.style.borderColor,
  }, visual.style));
  const raioPadrao = raioPadraoBotao(item, forma);
  if (raioPadrao) estilo.borderRadius = raioPadrao;
  if (item.bordaLargura) {
    estilo.borderWidth = item.bordaLargura;
    estilo.borderStyle = "solid";
    estilo.borderColor = item.borda || estilo.borderColor || "currentColor";
  }
  if (item.sombraDura) {
    estilo.boxShadow = item.sombraDura;
  }

  const temExtra = item.subtitulo || item.icone || item.seta;
  const alinhamento = item.alinhamentoConteudo || (temExtra ? "between" : "center");
  const gap = item.gap != null ? item.gap : (temExtra ? 12 : undefined);

  return (
    <a
      href={item.url || "#"}
      target={item.novaAba ? "_blank" : undefined}
      rel={item.novaAba ? "noreferrer" : undefined}
      className={`item-interativo inline-flex font-medium ${tamanho} ${visual.className} ${className} ${item.animacao ? classeAnimacaoIcone(item.animacao) : ""}`}
      style={{
        ...estilo,
        gap,
        justifyContent: alinhamento === "between" ? "space-between" : alinhamento === "inicio" ? "flex-start" : "center",
        textAlign: item.subtitulo ? "left" : undefined,
      }}
    >
      <span className={item.subtitulo ? "flex min-w-0 flex-col gap-0.5" : "inline-flex items-center gap-2"}>
        {item.icone && !item.iconeDireita ? (
          <IconeLucide nome={item.icone} size={item.iconeTamanho || 16} color="currentColor" strokeWidth={item.traco || 2} />
        ) : null}
        <span className="min-w-0">
          <span className={item.subtitulo ? "block text-sm font-semibold uppercase tracking-[0.04em]" : undefined}>{item.rotulo}</span>
          {item.subtitulo ? <span className="block text-xs font-normal opacity-70">{item.subtitulo}</span> : null}
        </span>
      </span>
      {(item.seta || item.iconeDireita) ? (
        <span className="inline-flex shrink-0 items-center justify-center" style={item.iconeCaixa ? {
          width: 28,
          height: 28,
          borderRadius: 6,
          background: item.iconeCaixa,
          color: item.iconeCaixaCor || "#111",
        } : undefined}>
          <IconeLucide nome={item.iconeDireita || "ArrowUpRight"} size={item.iconeTamanho || 14} color="currentColor" strokeWidth={2.2} />
        </span>
      ) : null}
    </a>
  );
}

function fotoCapa({ props, onEscolherFoto, className = "", style }) {
  const tamanho = props.fotoTamanho || 112;
  const parteFoto = props.estiloPartes?.foto || {};
  const larguraCustom = parteFoto.itemLargura !== "" && parteFoto.itemLargura != null;
  const larga = style?.height === "auto" || className.includes("max-w-full") || larguraCustom;
  const largura = larguraCustom ? Number(parteFoto.itemLargura) : tamanho;
  const raio = parteFoto.raio === "" || parteFoto.raio == null ? (props.fotoRaio ?? 999) : Number(parteFoto.raio);
  const caixa = estiloDaParte(props, "foto", style);
  const midia = {
    width: larga ? (larguraCustom ? largura : "100%") : tamanho,
    height: larga ? "auto" : tamanho,
    maxWidth: "100%",
    maxHeight: style?.maxHeight,
    borderRadius: raio,
    objectFit: parteFoto.objectFit || "cover",
    display: "block",
    flexShrink: 0,
    minWidth: 0,
  };
  const conteudo = props.fotoUrl ? (
    <img src={props.fotoUrl} alt="" className="object-cover max-w-full" style={midia} />
  ) : (
    <label className="capa-foto-vazia" style={midia} onClick={(evento) => evento.stopPropagation()}>
      <span>Foto</span>
      <span className="capa-foto-vazia-dica">Clique para adicionar</span>
      {onEscolherFoto && (
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          onChange={(evento) => {
            const file = evento.target.files?.[0];
            evento.target.value = "";
            if (file) onEscolherFoto(file);
          }}
        />
      )}
    </label>
  );
  return (
    <div
      className={className}
      style={{
        ...caixa,
        width: caixa.width || (larga ? "100%" : tamanho),
        height: larga ? (caixa.height || "auto") : (caixa.height || tamanho),
        maxWidth: "100%",
        minWidth: 0,
        flexShrink: 0,
        overflow: caixa.overflow || "hidden",
      }}
    >
      {conteudo}
    </div>
  );
}

function textosCapa({ props, local, marcar, botaoClass = "mt-8" }) {
  return (
    <>
      {marcar("titulo", (
        <h1 className={classeTitulo("capa", props.tamanhoTitulo)} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h1>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`mt-4 ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-80"}`} style={estiloDaParte(props, "subtitulo", props.corTexto ? { color: props.corTexto } : undefined)}>
          {props.subtitulo}
        </p>
      ))}
      {props.cta && marcar("botao", (
        <BotaoPagina tema={local} item={itemBotaoCapa(props)} className={botaoClass} />
      ))}
    </>
  );
}

function BlocoCapa({ props, tema, marcar = semMarca, onEscolherFoto }) {
  const local = temaDoBloco(props, tema);
  const layoutId = layoutIdDoBloco("capa", props);
  const centro = local.alinhamento !== "esquerda";
  const foto = fotoCapa({ props, onEscolherFoto, className: centro ? "mx-auto mb-6" : "mb-6" });
  const textos = textosCapa({ props, local, marcar });

  if (layoutId === "split" || layoutId === "split-direita") {
    const invertido = layoutId === "split-direita";
    return (
      <section className="py-10 md:py-16" style={caixaDoBloco(props)}>
        <div className={`grid items-center gap-8 md:grid-cols-2 ${invertido ? "md:[&>:first-child]:order-2" : ""}`}>
          {marcar("foto", fotoCapa({ props, onEscolherFoto }))}
          <div className="min-w-0 text-left">{textosCapa({ props, local, marcar, botaoClass: "mt-6" })}</div>
        </div>
      </section>
    );
  }

  if (layoutId === "fullbleed") {
    return (
      <section
        data-layout="fullbleed"
        className="relative flex min-h-[20rem] items-end overflow-hidden py-10 md:min-h-[26rem] md:py-16"
        style={{
          ...caixaDoBloco(props),
          ...(props.fotoUrl ? { backgroundImage: `url(${props.fotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
        }}
      >
        {props.fotoUrl && <div className="absolute inset-0 bg-black/45" />}
        <div className="relative z-10 w-full" style={props.fotoUrl ? { color: "#fff" } : undefined}>
          {!props.fotoUrl && marcar("foto", fotoCapa({ props, onEscolherFoto, className: "mx-auto mb-6" }))}
          {props.fotoUrl && marcar("foto", <span className="sr-only">Foto de fundo</span>)}
          {textosCapa({ props, local, marcar })}
        </div>
      </section>
    );
  }

  if (layoutId === "editorial") {
    return (
      <section className="py-16 text-left" style={caixaDoBloco(props)}>
        {marcar("titulo", (
          <h1 className={classeTitulo("capa", props.tamanhoTitulo || "enorme")} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h1>
        ))}
        <div className="mt-8">{marcar("foto", fotoCapa({ props, onEscolherFoto, className: "max-w-full", style: { height: "auto", maxHeight: 360 } }))}</div>
        {props.subtitulo && marcar("subtitulo", (
          <p className={`mt-6 ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-80"}`} style={estiloDaParte(props, "subtitulo", props.corTexto ? { color: props.corTexto } : undefined)}>
            {props.subtitulo}
          </p>
        ))}
        {props.cta && marcar("botao", (
          <BotaoPagina tema={local} item={itemBotaoCapa(props)} className="mt-8" />
        ))}
      </section>
    );
  }

  if (layoutId === "cartao") {
    return (
      <section className="py-12" style={caixaDoBloco({ ...props, corFundo: undefined, fundoModo: undefined })}>
        <div className="mx-auto max-w-md rounded-[1.6rem] px-6 py-10 ring-1 ring-line" style={caixaDoBloco({ ...props, margemCima: "", margemBaixo: "" })}>
          {marcar("foto", fotoCapa({ props, onEscolherFoto, className: "mx-auto mb-6" }))}
          {textosCapa({ props, local, marcar })}
        </div>
      </section>
    );
  }

  if (layoutId === "compacta") {
    return (
      <section className="py-10" style={caixaDoBloco(props)}>
        <div className="flex flex-wrap items-center gap-4 text-left">
          {marcar("foto", fotoCapa({ props, onEscolherFoto }))}
          <div className="min-w-0 flex-1">
            {marcar("titulo", (
              <h1 className={classeTitulo("capa", props.tamanhoTitulo || "medio")} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h1>
            ))}
            {props.subtitulo && marcar("subtitulo", (
              <p className={`mt-1 ${classeTexto(props.tamanhoTexto || "pequeno")} ${props.corTexto ? "" : "opacity-80"}`} style={estiloDaParte(props, "subtitulo", props.corTexto ? { color: props.corTexto } : undefined)}>
                {props.subtitulo}
              </p>
            ))}
          </div>
          {props.cta && marcar("botao", (
            <BotaoPagina tema={local} item={itemBotaoCapa(props, { tamanho: props.tamanhoBotao || "pequeno" })} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={caixaDoBloco(props)}>
      {marcar("foto", foto)}
      {textos}
    </section>
  );
}

function BlocoTexto({ props, marcar = semMarca }) {
  return (
    <section className="py-10" style={caixaDoBloco(props)}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h2>
      ))}
      {props.corpo && marcar("corpo", (
        <p className={`whitespace-pre-wrap ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-85"}`} style={estiloDaParte(props, "corpo", props.corTexto ? { color: props.corTexto } : undefined)}>
          {props.corpo}
        </p>
      ), "mt-3")}
    </section>
  );
}

function BlocoImagem({ props, onEnviarImagem, marcar = semMarca }) {
  if (!props.url) {
    return (
      <div className="my-8">
        {onEnviarImagem ? (
          <label
            className="editor-placeholder flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-sm transition hover:border-accent/40"
            onClick={(evento) => evento.stopPropagation()}
          >
            <span>Enviar imagem</span>
            <span className="ui-dica mt-1 text-xs">JPG, PNG, GIF ou WebP</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              onChange={(evento) => {
                const file = evento.target.files?.[0];
                evento.target.value = "";
                if (file) onEnviarImagem(file);
              }}
            />
          </label>
        ) : (
          <div className="editor-placeholder rounded-2xl border border-dashed border-line px-6 py-16 text-sm">Imagem</div>
        )}
      </div>
    );
  }
  const estiloImg = estiloDaParte(props, "imagem", estiloMidia(props, "1rem"));
  const estreita = Boolean(estiloImg.width) && estiloImg.width !== "100%";
  return (
    <figure className="my-8" style={caixaDoBloco(props)}>
      {marcar("imagem", (
        <img
          src={props.url}
          alt={props.alt || ""}
          className={props.display ? "" : estreita ? "mx-auto" : "w-full"}
          style={estreita ? { display: "block", ...estiloImg } : estiloImg}
        />
      ))}
      {props.caption && marcar("legenda", (
        <figcaption className={`${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-60"}`} style={estiloDaParte(props, "legenda", props.corTexto ? { color: props.corTexto } : undefined)}>
          {props.caption}
        </figcaption>
      ), "mt-2")}
    </figure>
  );
}

function BlocoBotoes({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  const layoutId = layoutIdDoBloco("botoes", props);
  const classe = props.display
    ? "py-6"
    : layoutId === "linha"
      ? "flex flex-wrap justify-center gap-3 py-6"
      : layoutId === "pills"
        ? "flex flex-wrap justify-center gap-2 py-6"
        : layoutId === "grade"
          ? "grid gap-3 py-6 sm:grid-cols-2"
          : "mx-auto flex max-w-md flex-col gap-3 py-6";
  const botaoClass = layoutId === "linha"
    ? "min-h-12 px-6"
    : layoutId === "pills"
      ? "min-h-9 px-4 text-xs"
      : layoutId === "grade"
        ? "min-h-14 w-full px-4 py-3"
        : layoutId === "cartoes"
          ? "min-h-[4.5rem] w-full px-4 py-3"
          : "min-h-12 w-full max-w-sm";
  return (
    <div className={classe} style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => (
        <div key={`${item.rotulo}-${index}`} className={layoutId === "pilha" || layoutId === "cartoes" ? "flex justify-center" : "contents"}>
          {marcar(`item-${index}`, <BotaoPagina item={item} tema={local} className={botaoClass} />)}
        </div>
      ))}
    </div>
  );
}

function itemGaleria({ url, index, props, interativo, setAberta, marcar, aspecto = "aspect-square", extraClass = "" }) {
  if (!url) {
    return <div className={`${aspecto} border border-dashed border-line ${extraClass}`} style={estiloMidia(props, "1rem")} />;
  }
  return marcar(`item-${index}`, (
    <button
      type="button"
      className={`w-full overflow-hidden ${extraClass}`}
      style={estiloDaParte(props, `item-${index}`, estiloMidia(props, "1rem"))}
      onClick={() => interativo && setAberta(url)}
    >
      <img src={url} alt="" className={`${aspecto} w-full`} style={{ objectFit: props.objectFit || "cover", display: "block" }} />
    </button>
  ));
}

function BlocoGaleria({ props, interativo, marcar = semMarca }) {
  const urls = (props.urls || []).filter(Boolean);
  const lista = urls.length ? urls : ["", "", ""];
  const [aberta, setAberta] = useState(null);
  const layoutId = layoutIdDoBloco("galeria", props);
  const custom = Boolean(props.display);
  const item = (url, index, extra) => itemGaleria({ url, index, props, interativo, setAberta, marcar, ...extra });

  let grade;
  if (custom) {
    grade = (
      <div className="w-full py-8" style={caixaDoBloco(props)}>
        {lista.map((url, index) => <div key={url ? url + index : `vazia-${index}`} className="contents">{item(url, index)}</div>)}
      </div>
    );
  } else if (layoutId === "faixa") {
    grade = (
      <div className="flex gap-3 overflow-x-auto py-8" style={caixaDoBloco(props)}>
        {lista.map((url, index) => (
          <div key={url ? url + index : `vazia-${index}`} className="w-[min(70%,16rem)] shrink-0">
            {item(url, index)}
          </div>
        ))}
      </div>
    );
  } else if (layoutId === "destaque") {
    const [primeira, ...resto] = lista;
    grade = (
      <div className="grid gap-3 py-8" style={caixaDoBloco(props)}>
        {item(primeira, 0, { aspecto: "aspect-[2/1]" })}
        {resto.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {resto.map((url, index) => <div key={url ? url + index : `vazia-${index}`}>{item(url, index + 1)}</div>)}
          </div>
        )}
      </div>
    );
  } else if (layoutId === "mosaico") {
    grade = (
      <div className="grid gap-3 py-8 sm:grid-cols-2" style={caixaDoBloco(props)}>
        {lista.map((url, index) => (
          <div key={url ? url + index : `vazia-${index}`} className={index === 0 ? "sm:col-span-2" : ""}>
            {item(url, index, { aspecto: index === 0 ? "aspect-[2/1]" : "aspect-square" })}
          </div>
        ))}
      </div>
    );
  } else {
    const colunas = layoutId === "grade-3" ? "sm:grid-cols-3" : "sm:grid-cols-2";
    grade = (
      <div className={`grid w-full gap-3 py-8 ${colunas}`} style={caixaDoBloco(props)}>
        {lista.map((url, index) => <div key={url ? url + index : `vazia-${index}`} className="contents">{item(url, index)}</div>)}
      </div>
    );
  }

  return (
    <>
      {grade}
      {aberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setAberta(null)}
          role="presentation"
        >
          <img src={aberta} alt="" className="max-h-full max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </>
  );
}

function cardDepoimento({ item, props, citacao }) {
  return (
    <blockquote className={`border border-line px-5 py-4 ${citacao ? "text-center" : "text-left"}`} style={estiloDoItem(item, estiloMidia(props, "1rem"))}>
      <div className={citacao ? "flex flex-col items-center gap-3" : "flex items-start gap-3"}>
        {item.fotoUrl ? (
          <img src={item.fotoUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="depoimento-foto-vazia" aria-hidden>
            {(item.autor || "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className={classeTitulo("texto", citacao ? "medio" : props.tamanhoTitulo || "pequeno")} style={props.corTitulo ? { color: props.corTitulo } : undefined}>“{item.citacao}”</p>
          {item.autor && (
            <footer className={`mt-2 ${classeTexto(props.tamanhoTexto || "pequeno")} ${props.corTexto ? "" : "opacity-60"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
              {item.autor}
            </footer>
          )}
        </div>
      </div>
    </blockquote>
  );
}

function BlocoDepoimentos({ props, marcar = semMarca }) {
  const layoutId = layoutIdDoBloco("depoimentos", props);
  const itens = props.itens || [];
  const citacao = layoutId === "citacao";
  const classe = props.display
    ? "py-8"
    : layoutId === "grade"
      ? "grid gap-4 py-8 sm:grid-cols-2"
      : layoutId === "faixa"
        ? "flex gap-4 overflow-x-auto py-8"
        : "grid gap-4 py-8";
  return (
    <div className={classe} style={caixaDoBloco(props)}>
      {itens.map((item, index) => (
        <div key={index} className={layoutId === "faixa" ? "w-[min(85%,20rem)] shrink-0" : "contents"}>
          {marcar(`item-${index}`, cardDepoimento({ item, props, citacao }))}
        </div>
      ))}
    </div>
  );
}

function opcoesDaLista(campo) {
  return String(campo.opcoes || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function CampoPagina({ campo, valor, onChange, interativo, className }) {
  const obrigatorio = interativo && Boolean(campo.obrigatorio);
  const comum = `${className} border border-line bg-transparent`;
  if (campo.tipo === "area") {
    return (
      <textarea
        rows={4}
        required={obrigatorio}
        placeholder={campo.placeholder || campo.rotulo || ""}
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-3xl px-4 py-3 ${comum}`}
      />
    );
  }
  if (campo.tipo === "lista") {
    return (
      <select
        required={obrigatorio}
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-12 rounded-full px-4 ${comum}`}
      >
        <option value="">{campo.placeholder || "Escolha"}</option>
        {opcoesDaLista(campo).map((opcao) => (
          <option key={opcao} value={opcao}>{opcao}</option>
        ))}
      </select>
    );
  }
  if (campo.tipo === "check") {
    return (
      <label className="flex min-h-12 items-center gap-3 px-1 text-sm">
        <input type="checkbox" required={obrigatorio} checked={Boolean(valor)} onChange={(e) => onChange(e.target.checked)} />
        {campo.rotulo || campo.placeholder || "Aceito"}
      </label>
    );
  }
  const tipoInput = campo.tipo === "numero" ? "number" : campo.tipo === "tel" ? "tel" : campo.tipo === "url" ? "url" : campo.tipo === "email" ? "email" : "text";
  return (
    <input
      type={tipoInput}
      required={obrigatorio}
      placeholder={campo.placeholder || campo.rotulo || ""}
      value={valor || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`min-h-12 rounded-full px-4 ${comum}`}
    />
  );
}

function BlocoFormulario({ props, tema, interativo, marcar = semMarca, slug }) {
  const campos = camposDoFormulario(props);
  const [valores, setValores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const setValor = (id, valor) => setValores((atual) => ({ ...atual, [id]: valor }));

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!interativo) return;
    if (!slug) {
      setErro("Publique a página para receber as respostas por e-mail.");
      return;
    }
    setEnviando(true);
    setErro("");
    try {
      const camposEnvio = campos.map((campo) => ({
        id: campo.id,
        rotulo: campo.rotulo || campo.placeholder || "Campo",
        tipo: campo.tipo,
        valor: valores[campo.id],
      }));
      await enviarFormularioPagina(slug, {
        assunto: props.assunto || "",
        campos: camposEnvio,
      });
      setEnviado(true);
    } catch (error) {
      setErro(error?.response?.data?.mensagem || "Não foi possível enviar. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  const local = temaDoBloco(props, tema);
  const estiloBotaoEnvio = estiloDaParte(props, "botao", { background: local.destaque });
  if (raioPadraoBotao(props.estiloPartes?.botao || {})) estiloBotaoEnvio.borderRadius = "999px";
  const alinhamento = local.alinhamento === "esquerda"
    ? "mr-auto"
    : local.alinhamento === "direita"
      ? "ml-auto"
      : "mx-auto";
  return (
    <form
      className={`formulario-pagina w-full max-w-sm py-10 ${alinhamento}`}
      onSubmit={enviar}
      id="formulario"
      style={caixaDoBloco(props)}
    >
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h2>
      ))}
      {marcar("campos", (
        <div className="flex flex-col gap-3" style={estiloDaParte(props, "campos")}>
          {campos.map((campo) => (
            <CampoPagina
              key={campo.id}
              campo={campo}
              valor={valores[campo.id]}
              onChange={(valor) => setValor(campo.id, valor)}
              interativo={interativo}
              className="w-full"
            />
          ))}
        </div>
      ), "mt-4")}
      {marcar("botao", (
        <button type="submit" disabled={enviando} className="min-h-12 w-full px-6 text-sm font-medium text-white disabled:opacity-60" style={estiloBotaoEnvio}>
          {enviando ? "Enviando…" : (props.botao || "Enviar")}
        </button>
      ), "mt-3")}
      {erro && <p className="mt-3 text-sm text-red-400">{erro}</p>}
      {enviado && (
        <p className="mt-3 text-sm opacity-70">
          Recebemos sua mensagem. O dono da página vai ver no e-mail.
        </p>
      )}
    </form>
  );
}

function BlocoRedes({ props, marcar = semMarca }) {
  return (
    <div className={props.display ? "py-6 text-sm" : "flex flex-wrap justify-center gap-4 py-6 text-sm"} style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => (
        <div key={index} className="contents">
          {marcar(`item-${index}`, (
            <a href={item.url || "#"} className="underline-offset-4 hover:underline" style={estiloDoItem(item, props.corTexto ? { color: props.corTexto } : undefined)}>
              {item.rotulo}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}

function BlocoNavegacao({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  const noEditor = marcar !== semMarca;
  return (
    <nav
      className={`flex gap-x-5 gap-y-2 overflow-x-auto px-4 py-3 text-sm backdrop-blur [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible ${
        noEditor ? "relative z-0 rounded-xl" : "sticky top-0 z-10 -mx-4 mb-2 sm:-mx-6"
      }`}
      style={{ background: props.corFundo || `${local.fundo}cc`, color: props.corTexto || undefined }}
      aria-label="Menu da página"
    >
      {(props.itens || []).map((item, index) => (
        <div key={index} className="contents">
          {marcar(`item-${index}`, (
            <a href={`#${item.ancora || ""}`} className="inline-flex min-h-10 shrink-0 items-center whitespace-nowrap underline-offset-4 hover:underline" style={estiloDoItem(item, props.corTexto ? { color: props.corTexto } : undefined)}>
              {item.rotulo}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

function filhosPadrao(lista, tema, interativo) {
  return (lista || []).map((filho) => {
    const Comp = COMPONENTES[filho.tipo];
    return Comp ? <Comp key={filho.id} props={filho.props || {}} tema={tema} interativo={interativo} /> : null;
  });
}

function BlocoSecao({ props, tema, interativo, filhos, marcar = semMarca }) {
  const lista = filhos ?? filhosPadrao(props.blocos, tema, interativo);
  if (!props.titulo && !props.subtitulo && !filhos && !(props.blocos || []).length) {
    return <div id={props.ancora} className="scroll-mt-20" />;
  }
  return (
    <section id={props.ancora} className="scroll-mt-20 pt-12" style={caixaDoBloco(props)}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h2>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-70"}`} style={estiloDaParte(props, "subtitulo", props.corTexto ? { color: props.corTexto } : undefined)}>
          {props.subtitulo}
        </p>
      ), "mt-2")}
      {lista}
    </section>
  );
}

function BlocoIncorporar({ props }) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-line">
      <iframe title="conteúdo incorporado" src={embedUrl(props.url)} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
}

function BlocoDivisor({ props }) {
  if (props.estilo === "espaco") return <div className="h-12" />;
  return <hr className="my-8 border-line" />;
}

function BlocoRodape({ props }) {
  return (
    <p className={`py-10 ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-50"}`} style={caixaDoBloco(props)}>
      {props.texto}
    </p>
  );
}

function restanteAte(alvo, agora) {
  const destino = alvo ? new Date(alvo).getTime() : NaN;
  if (Number.isNaN(destino)) return null;
  const segundos = Math.max(0, Math.floor((destino - agora) / 1000));
  return {
    acabou: segundos <= 0,
    dias: Math.floor(segundos / 86400),
    horas: Math.floor((segundos % 86400) / 3600),
    minutos: Math.floor((segundos % 3600) / 60),
    segundos: segundos % 60,
  };
}

function BlocoContador({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  const layoutId = layoutIdDoBloco("contador", props);
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const restante = restanteAte(props.alvo, agora);
  const caixa = caixaDoBloco(props);
  const titulo = props.titulo && marcar("titulo", (
    <p className={`${classeTexto(props.tamanhoTexto)} opacity-70`} style={estiloDaParte(props, "titulo")}>{props.titulo}</p>
  ));

  if (!restante || restante.acabou) {
    return (
      <div className="py-8" style={caixa}>
        {marcar("relogio", (
          <p className={classeTitulo("texto", props.tamanhoTitulo)}>
            {restante ? (props.textoFim || "Chegou o dia.") : "Escolha a data no painel"}
          </p>
        ))}
      </div>
    );
  }

  const unidades = [
    { chave: "dias", valor: restante.dias, rotulo: "dias" },
    { chave: "horas", valor: restante.horas, rotulo: "horas" },
    { chave: "minutos", valor: restante.minutos, rotulo: "min" },
    ...(props.mostrarSegundos === false ? [] : [{ chave: "segundos", valor: restante.segundos, rotulo: "seg" }]),
  ];
  const doisDigitos = (valor) => String(valor).padStart(2, "0");

  if (layoutId === "discreto") {
    return (
      <div className="py-6" style={caixa}>
        {titulo}
        {marcar("relogio", (
          <p className={classeTexto(props.tamanhoTexto)}>
            {restante.dias}d {doisDigitos(restante.horas)}:{doisDigitos(restante.minutos)}
            {props.mostrarSegundos === false ? "" : `:${doisDigitos(restante.segundos)}`}
          </p>
        ))}
      </div>
    );
  }

  if (layoutId === "linha") {
    return (
      <div className="py-8" style={caixa}>
        {titulo}
        {marcar("relogio", (
          <p className="mt-2 text-4xl font-semibold tabular-nums sm:text-6xl">
            {unidades.map((unidade, indice) => (
              <span key={unidade.chave}>
                {indice ? <span className="opacity-40">:</span> : null}
                {doisDigitos(unidade.valor)}
              </span>
            ))}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8" style={caixa}>
      {titulo}
      {marcar("relogio", (
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {unidades.map((unidade) => (
            <div
              key={unidade.chave}
              className="min-w-[4.5rem] px-3 py-3"
              style={{
                background: props.corCaixa || `${local.destaque}1f`,
                borderRadius: raioCss(props, "1rem"),
              }}
            >
              <p className="text-2xl font-semibold tabular-nums sm:text-4xl">{doisDigitos(unidade.valor)}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] opacity-60">{unidade.rotulo}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function BlocoCartoes({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  const layoutId = layoutIdDoBloco("cartoes", props);
  const colunas = props.colunas || 3;
  const custom = Boolean(props.display);
  const grade = colunas === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : colunas === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const classe = custom
    ? "py-8"
    : layoutId === "lista"
      ? "grid gap-4 py-8"
      : layoutId === "faixa"
        ? "flex gap-4 overflow-x-auto py-8"
        : layoutId === "destaque"
          ? "grid gap-4 py-8"
          : `grid gap-4 py-8 ${grade}`;
  return (
    <div className={classe} style={caixaDoBloco({ ...props, corFundo: undefined })}>
      {(props.itens || []).map((item, index) => (
        <div
          key={`${item.titulo}-${index}`}
          className={layoutId === "faixa" ? "w-[min(80%,16rem)] shrink-0" : layoutId === "destaque" && index === 0 ? "sm:col-span-full" : "contents"}
        >
          {marcar(`item-${index}`, (
            <article className="h-full border border-line px-5 py-5 text-left" style={estiloDoItem(item, { ...(props.corFundo ? { background: props.corFundo, color: props.corTexto || undefined } : undefined), ...estiloMidia(props, "1rem") })}>
              {item.icone && (
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${local.destaque}22`, color: local.destaque }}>
                  <IconeLucide nome={item.icone} size={18} color="currentColor" />
                </span>
              )}
              {item.titulo && <h3 className={classeTitulo("texto", props.tamanhoTitulo || "pequeno")} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{item.titulo}</h3>}
              {item.corpo && (
                <p className={`mt-2 ${classeTexto(props.tamanhoTexto || "pequeno")} ${props.corTexto ? "" : "opacity-80"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
                  {item.corpo}
                </p>
              )}
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}

function estiloGrade(props) {
  const colunas = props.colunas || 2;
  const gap = props.gap || 24;
  const proporcao = props.proporcao || "iguais";
  const template = colunas === 2
    ? proporcao === "esquerda" ? "1.4fr 1fr" : proporcao === "direita" ? "1fr 1.4fr" : "1fr 1fr"
    : `repeat(${colunas}, minmax(0, 1fr))`;
  return { display: "grid", gap, "--grade-template": template };
}

function BlocoGrade({ props, tema, interativo, filhos }) {
  return (
    <div className="bloco-grade py-6" style={{ ...estiloGrade(props), ...caixaDoBloco({ ...props, corFundo: props.corFundo }) }}>
      {filhos ?? (props.celulas || []).map((celula, index) => (
        <div key={celula.id || index} className="min-w-0">
          {filhosPadrao(celula.blocos, tema, interativo)}
        </div>
      ))}
    </div>
  );
}

function BlocoFaixa({ props, tema, interativo, filhos, marcar = semMarca }) {
  const layoutId = layoutIdDoBloco("faixa", props);
  const faixaTema = {
    ...tema,
    fundo: props.fundo || "#111111",
    texto: props.texto || "#f5f5f7",
    destaque: props.destaque || tema.destaque,
  };
  const alinhamento = props.alinhamento || (layoutId === "esquerda" ? "esquerda" : "centro");
  const padding = layoutId === "cta" ? "py-20" : "py-12";
  return (
    <section className={`-mx-4 my-6 px-4 sm:-mx-6 sm:px-6 ${padding}`} style={{ ...cssFundo(props, "fundo"), ...caixaDoBloco({ ...props, corFundo: undefined }), color: faixaTema.texto, textAlign: alinhamento === "esquerda" ? "left" : "center" }}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={estiloDaParte(props, "titulo", props.corTitulo ? { color: props.corTitulo } : undefined)}>{props.titulo}</h2>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`${classeTexto(props.tamanhoTexto)} opacity-80`} style={estiloDaParte(props, "subtitulo")}>{props.subtitulo}</p>
      ), "mt-3")}
      {filhos ?? filhosPadrao(props.blocos, faixaTema, interativo)}
    </section>
  );
}

function BlocoIcones({ props, tema = {}, marcar = semMarca }) {
  const raioDoEstilo = raioIcone(tema.iconeForma);
  const layoutId = layoutIdDoBloco("icones", props);
  const classe = props.display
    ? "py-6"
    : layoutId === "faixa"
      ? "flex flex-wrap items-center justify-between gap-4 py-6"
      : layoutId === "com-nome"
        ? "flex flex-wrap items-start justify-center gap-5 py-6"
        : "flex flex-wrap items-center justify-center gap-3 py-6";
  return (
    <div className={classe} style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => {
        const lado = (item.tamanho || 22) + (item.padding || 12) * 2;
        const visual = (
          <span
            className="item-interativo icone-interativo"
            style={estiloDoItem(item, {
              ...estiloInterativo(item),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: lado,
              height: lado,
              borderRadius: item.raio ?? raioDoEstilo ?? 18,
            })}
          >
            <span className={classeAnimacaoIcone(item.animacao)}>
              <IconeLucide nome={item.nome} size={item.tamanho || 22} color="currentColor" strokeWidth={item.traco || 2} />
            </span>
          </span>
        );
        const rotulo = layoutId === "com-nome" ? (
          <span className="flex flex-col items-center gap-2">
            {visual}
            <span className="text-xs opacity-70">{item.nome}</span>
          </span>
        ) : visual;
        return (
          <div key={`${item.nome}-${index}`} className="contents">
            {marcar(`item-${index}`, item.url ? (
              <a href={item.url} target={item.novaAba ? "_blank" : undefined} rel={item.novaAba ? "noreferrer" : undefined} aria-label={item.nome}>
                {rotulo}
              </a>
            ) : <span>{rotulo}</span>)}
          </div>
        );
      })}
    </div>
  );
}

const COMPONENTES = {
  capa: BlocoCapa,
  texto: BlocoTexto,
  imagem: BlocoImagem,
  botoes: BlocoBotoes,
  galeria: BlocoGaleria,
  depoimentos: BlocoDepoimentos,
  formulario: BlocoFormulario,
  redes: BlocoRedes,
  navegacao: BlocoNavegacao,
  secao: BlocoSecao,
  incorporar: BlocoIncorporar,
  divisor: BlocoDivisor,
  rodape: BlocoRodape,
  icones: BlocoIcones,
  contador: BlocoContador,
  cartoes: BlocoCartoes,
  grade: BlocoGrade,
  faixa: BlocoFaixa,
};

function lerDadosArrasto(evento) {
  try {
    return JSON.parse(evento.dataTransfer.getData("text/plain") || "{}");
  } catch {
    return {};
  }
}

function ZonaVazia({ ativo, sobre, dica, onSelect, onEscolher, onDragOver, onDrop, permitirEstrutura = false }) {
  const [aberto, setAberto] = useState(false);
  const ancora = useRef(null);
  const abrir = () => {
    onSelect?.();
    if (onEscolher) setAberto(true);
  };
  return (
    <div
      ref={ancora}
      role="button"
      tabIndex={0}
      data-ativo={ativo ? "true" : undefined}
      className={`zona-vazia ${sobre ? "zona-vazia-sobre" : ""} ${ativo ? "zona-vazia-ativa" : ""}`}
      onClick={(evento) => {
        evento.stopPropagation();
        abrir();
      }}
      onKeyDown={(evento) => {
        if (evento.key === "Enter") abrir();
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="zona-vazia-acao">
        <Plus size={14} />
        {dica}
      </span>
      {aberto && onEscolher && (
        <MenuPecas
          ancoraRef={ancora}
          permitirEstrutura={permitirEstrutura}
          onFechar={() => setAberto(false)}
          onEscolher={(tipo) => {
            setAberto(false);
            onEscolher(tipo);
          }}
        />
      )}
    </div>
  );
}

function ItemCanvas({ bloco, tema, editor, faixaTema, slug }) {
  const Comp = COMPONENTES[bloco.tipo];
  const local = faixaTema || tema;
  const {
    selecionadoId,
    onSelect,
    arrasto,
    onInicioArrasto,
    onSobreArrasto,
    onSoltarArrasto,
    onEscolherImagem,
    onRemover,
    onRemoverParte,
    onInserir,
    onAtualizar,
    onAbrirLayouts,
  } = editor || {};
  const interativo = !onSelect;
  const podeArrastar = Boolean(onInicioArrasto);
  const { blocoId: selecionadoBlocoId, parteId: selecionadaParteId } = separarAlvo(selecionadoId);
  const ativo = selecionadoBlocoId === bloco.id;
  const parteAtiva = ativo ? selecionadaParteId : null;
  const parteSelecionada = parteAtiva ? partesDoBloco(bloco).find((item) => item.id === parteAtiva) : null;
  const alvo = arrasto?.sobreId === bloco.id;
  const estrutura = ehTipoEstrutura(bloco.tipo);
  const ehMenu = bloco.tipo === "navegacao";
  const ehFormulario = bloco.tipo === "formulario";
  const alinhamentoForm = (faixaTema || tema)?.alinhamento === "esquerda"
    ? "mr-auto"
    : (faixaTema || tema)?.alinhamento === "direita"
      ? "ml-auto"
      : "mx-auto";
  const caixa = useRef(null);

  useEffect(() => {
    if (!ativo || !caixa.current) return;
    caixa.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [ativo]);

  if (!Comp) return null;

  const soltarEm = (evento, blocoId, extra) => {
    if (!onSoltarArrasto) return;
    evento.preventDefault();
    evento.stopPropagation();
    const ret = evento.currentTarget.getBoundingClientRect();
    const posicao = extra ? "dentro" : (evento.clientY < ret.top + ret.height / 2 ? "antes" : "depois");
    onSoltarArrasto(blocoId, posicao, lerDadosArrasto(evento), extra);
  };

  const filhosEditor = () => {
    if (bloco.tipo === "grade") {
      return (bloco.props.celulas || []).map((celula, indice) => {
        const sobreCelula = arrasto?.sobreCelulaId === celula.id;
        const celulaAtiva = selecionadoBlocoId === celula.id;
        const vazia = !(celula.blocos || []).length;
        return (
          <div
            key={celula.id || indice}
            className={`celula-editor min-w-0 ${celulaAtiva || sobreCelula ? "celula-editor-ativa" : ""}`}
            onClick={(evento) => {
              evento.stopPropagation();
              onSelect?.(celula.id);
            }}
            onDragOver={onSobreArrasto ? (evento) => {
              evento.preventDefault();
              evento.stopPropagation();
              onSobreArrasto(bloco.id, "dentro", { celulaId: celula.id });
            } : undefined}
            onDrop={onSoltarArrasto ? (evento) => soltarEm(evento, null, { celulaId: celula.id }) : undefined}
          >
            <p className="celula-editor-rotulo">Coluna {indice + 1}</p>
            {(celula.blocos || []).map((filho) => (
              <div key={filho.id}>
                <ItemCanvas bloco={filho} tema={local} editor={editor} slug={slug} />
                {onInserir && (
                  <PontoDeInsercao
                    rotulo="Adicionar aqui"
                    onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: filho.id, posicao: "depois" })}
                  />
                )}
              </div>
            ))}
            {vazia && (
              <ZonaVazia
                ativo={celulaAtiva}
                sobre={sobreCelula}
                dica="Coloque algo nesta coluna"
                onSelect={() => onSelect?.(celula.id)}
                onEscolher={onInserir ? (tipo) => onInserir(tipo, { modo: "celula", celulaId: celula.id }) : undefined}
                onDragOver={onSobreArrasto ? (evento) => {
                  evento.preventDefault();
                  evento.stopPropagation();
                  onSobreArrasto(bloco.id, "dentro", { celulaId: celula.id });
                } : undefined}
                onDrop={onSoltarArrasto ? (evento) => soltarEm(evento, null, { celulaId: celula.id }) : undefined}
              />
            )}
          </div>
        );
      });
    }
    if (bloco.tipo === "secao" || bloco.tipo === "faixa") {
      const temaFilhos = bloco.tipo === "faixa"
        ? { ...local, fundo: bloco.props.fundo || "#111111", texto: bloco.props.texto || "#f5f5f7", destaque: bloco.props.destaque || local.destaque }
        : local;
      const vazia = !(bloco.props.blocos || []).length;
      const sobreDentro = arrasto?.sobreContainerId === bloco.id;
      return (
        <>
          {(bloco.props.blocos || []).map((filho) => (
            <div key={filho.id}>
              <ItemCanvas
                bloco={filho}
                tema={temaFilhos}
                editor={editor}
                faixaTema={bloco.tipo === "faixa" ? temaFilhos : undefined}
                slug={slug}
              />
              {onInserir && (
                <PontoDeInsercao
                  permitirEstrutura
                  rotulo="Adicionar aqui"
                  onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: filho.id, posicao: "depois" })}
                />
              )}
            </div>
          ))}
          {onSelect && vazia && (
            <ZonaVazia
              permitirEstrutura
              ativo={ativo}
              sobre={sobreDentro}
              dica={bloco.tipo === "secao" ? "Coloque colunas ou conteúdo nesta seção" : "Coloque algo nesta faixa"}
              onSelect={() => onSelect?.(bloco.id)}
              onEscolher={onInserir ? (tipo) => onInserir(tipo, { modo: "dentro", containerId: bloco.id }) : undefined}
              onDragOver={onSobreArrasto ? (evento) => {
                evento.preventDefault();
                evento.stopPropagation();
                onSobreArrasto(bloco.id, "dentro", { containerId: bloco.id });
              } : undefined}
              onDrop={onSoltarArrasto ? (evento) => soltarEm(evento, null, { containerId: bloco.id }) : undefined}
            />
          )}
        </>
      );
    }
    return undefined;
  };

  const conteudo = (
    <Comp
      props={bloco.props || {}}
      tema={local}
      slug={slug}
      interativo={interativo}
      marcar={onSelect ? criarMarcador(bloco, selecionadoId, onSelect, {
        onRemoverParte,
        onAtualizar,
        onEscolherImagem,
        tema: local,
      }) : undefined}
      filhos={onSelect ? filhosEditor() : undefined}
      onEnviarImagem={
        onEscolherImagem && bloco.tipo === "imagem"
          ? (file) => onEscolherImagem(file, bloco, "url")
          : undefined
      }
      onEscolherFoto={
        onEscolherImagem && bloco.tipo === "capa"
          ? (file) => {
            onSelect?.(idParte(bloco.id, "foto"));
            onEscolherImagem(file, bloco, "fotoUrl");
          }
          : undefined
      }
    />
  );

  if (!onSelect) return conteudo;

  return (
    <div ref={caixa}>
      {podeArrastar && alvo && arrasto?.posicao === "antes" && (
        <div className="my-2 h-1 rounded-full bg-accent" />
      )}
      <div
        role="button"
        tabIndex={0}
        data-ativo={ativo ? "true" : undefined}
        data-parte-aberta={parteAtiva ? "true" : undefined}
        onClick={(evento) => {
          evento.stopPropagation();
          onSelect(bloco.id);
        }}
        onKeyDown={(evento) => {
          if (evento.key === "Enter") onSelect(bloco.id);
        }}
        onDragOver={onSobreArrasto ? (evento) => {
          evento.preventDefault();
          const ret = evento.currentTarget.getBoundingClientRect();
          onSobreArrasto(bloco.id, evento.clientY < ret.top + ret.height / 2 ? "antes" : "depois");
        } : undefined}
        onDrop={onSoltarArrasto ? (evento) => soltarEm(evento, bloco.id) : undefined}
        className={`bloco-editor group relative rounded-2xl ${ehFormulario ? `w-full max-w-sm ${alinhamentoForm}` : "w-full"} ${estrutura ? "bloco-estrutura" : ""} ${ehMenu ? "bloco-editor-menu" : ""} ${arrasto?.id === bloco.id ? "bloco-levantando" : ""}`}
      >
        {podeArrastar && (
          <div
            data-editor-chrome
            className={`bloco-chrome absolute z-10 flex items-center gap-0.5 rounded-md text-white transition ${
              ehMenu ? "left-2 top-1.5" : "left-2 top-3"
            } ${
              ativo
                ? "bg-[#1d1d1f]"
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:bg-[#1d1d1f]/75 group-hover:opacity-100"
            }`}
          >
            <button
              type="button"
              draggable
              aria-label={ehMenu ? "Mover o menu (controle do editor)" : "Arrastar bloco"}
              title={ehMenu ? "Controle do editor — não faz parte do menu publicado" : "Arraste para reordenar"}
              className="inline-flex cursor-grab items-center gap-1 px-1.5 py-1 text-[11px] font-medium active:cursor-grabbing"
              onClick={(evento) => evento.stopPropagation()}
              onDragStart={(evento) => {
                evento.stopPropagation();
                evento.dataTransfer.effectAllowed = "move";
                evento.dataTransfer.setData("text/plain", JSON.stringify({ kind: "bloco", id: bloco.id }));
                const carta = evento.currentTarget.closest(".bloco-editor");
                if (carta) iniciarLevantamento(carta, evento);
                onInicioArrasto({ kind: "bloco", id: bloco.id });
              }}
              onDragEnd={() => {
                encerrarLevantamento();
                onInicioArrasto(null);
              }}
            >
              <GripVertical size={14} />
              <span>{ehMenu ? "Mover menu" : "Mover"}</span>
            </button>
            {ativo && (
              <button
                type="button"
                className="border-l border-white/15 px-2 py-1 text-[11px] font-medium"
                title={parteAtiva ? `Voltar para a ${nomeDoTipo(bloco.tipo).toLowerCase()} inteira` : undefined}
                onClick={(evento) => {
                  evento.stopPropagation();
                  onSelect(bloco.id);
                }}
              >
                {parteSelecionada
                  ? `${nomeDoTipo(bloco.tipo)} › ${parteSelecionada.nome}`
                  : nomeDoTipo(bloco.tipo)}
              </button>
            )}
            {ativo && temLayouts(bloco.tipo) && onAbrirLayouts && (
              <button
                type="button"
                className="inline-flex items-center gap-1 border-l border-white/15 px-2 py-1 text-[11px] font-medium"
                onClick={(evento) => {
                  evento.stopPropagation();
                  onAbrirLayouts(bloco.id);
                }}
              >
                <LayoutTemplate size={12} />
                Layouts
              </button>
            )}
          </div>
        )}
        {ativo && onRemover && !parteAtiva && (
          <div data-editor-chrome className={`absolute z-20 flex items-center gap-1 ${ehMenu ? "right-2 top-1.5" : "right-2 top-2"}`}>
            <BotaoExcluirHold rotulo={nomeDoTipo(bloco.tipo)} onConfirmar={() => onRemover(bloco.id)} />
          </div>
        )}
        <div className={ehMenu ? "bloco-editor-menu-conteudo" : undefined}>
          {conteudo}
        </div>
      </div>
      {podeArrastar && alvo && arrasto?.posicao === "depois" && (
        <div className="my-2 h-1 rounded-full bg-accent" />
      )}
    </div>
  );
}

export function PageRenderer({
  pagina,
  marca = false,
  anuncios = false,
  compacto = false,
  selecionadoId,
  onSelect,
  arrasto,
  onInicioArrasto,
  onSobreArrasto,
  onSoltarArrasto,
  onEscolherImagem,
  onRemover,
  onRemoverParte,
  onInserir,
  onAtualizar,
  onAbrirLayouts,
}) {
  const tema = pagina.tema || {};
  const interativo = !onSelect;
  const mostrarAnuncios = anuncios && interativo;
  const blocos = pagina.blocos || [];
  const editor = onSelect
    ? {
      selecionadoId,
      onSelect,
      arrasto,
      onInicioArrasto,
      onSobreArrasto,
      onSoltarArrasto,
      onEscolherImagem,
      onRemover,
      onRemoverParte,
      onInserir,
      onAtualizar,
      onAbrirLayouts,
    }
    : null;

  const casca = tema.casca || "coluna";
  const canvas = (
    <div
      className={`pagina-skin ${compacto ? "flex w-full flex-col" : onSelect ? "flex min-h-full w-full flex-col" : "flex min-h-screen flex-col"}`}
      data-pagina-canvas
      data-selecao={selecionadoId === ALVO_FUNDO ? "fundo" : undefined}
      data-casca={casca}
      data-textura={tema.textura || "nenhuma"}
      data-botao={tema.botao || "pilula"}
      data-icone={tema.iconeForma || "simples"}
      data-titulo={tema.tituloForma || "pesado"}
      style={{
        ...cssFundo(tema),
        color: tema.texto,
        fontFamily: FONTES[tema.fonte] || FONTES.sans,
        textAlign: cssAlinhamento(tema.alinhamento) || "center",
        ...cssOrientacao(tema.orientacao),
        "--skin-tinta": tema.tinta || tema.texto,
        ...(tema.cascaFundo ? { "--casca-fundo": tema.cascaFundo } : {}),
        ...(tema.cascaCor ? { "--casca-cor": tema.cascaCor } : {}),
        ...(tema.cascaBorda ? { "--casca-borda": tema.cascaBorda } : {}),
        ...(tema.cascaSombra ? { "--casca-sombra": tema.cascaSombra } : {}),
        ...(tema.cascaFita ? { "--casca-fita": tema.cascaFita } : {}),
        ...(tema.cascaRaio != null && tema.cascaRaio !== "" ? { "--casca-raio": `${Number(tema.cascaRaio)}px` } : {}),
      }}
      onClick={onSelect ? (evento) => {
        if (evento.target.closest(".bloco-editor, .parte-alvo, .ponto-insercao, .zona-vazia, .celula-editor, [data-editor-chrome], [data-pagina-caixa]")) return;
        onSelect(ALVO_FUNDO);
      } : undefined}
      onDragOver={onSobreArrasto ? (e) => e.preventDefault() : undefined}
      onDrop={onSoltarArrasto && !(pagina.blocos || []).length ? (e) => { e.preventDefault(); onSoltarArrasto(null, "depois", lerDadosArrasto(e)); } : undefined}
    >
      <div
        data-pagina-caixa
        data-selecao={selecionadoId === ALVO_PAGINA ? "pagina" : undefined}
        className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${mostrarAnuncios ? "pagina-conteudo-com-trilhos" : ""} ${onSelect && !blocos.length ? "flex min-h-[18rem] items-center justify-center" : ""}`}
        style={{ maxWidth: LARGURAS[tema.largura] || LARGURAS.media }}
        onClick={onSelect ? (evento) => {
          if (evento.target.closest(".bloco-editor, .parte-alvo, .ponto-insercao, .zona-vazia, .celula-editor, [data-editor-chrome]")) return;
          onSelect(ALVO_PAGINA);
        } : undefined}
      >
        {onInserir && blocos.length > 0 && (
          <PontoDeInsercao
            permitirEstrutura
            rotulo="Adicionar no começo"
            onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: blocos[0].id, posicao: "antes" })}
          />
        )}
        {blocos.map((bloco) => (
          <div key={bloco.id}>
            <ItemCanvas bloco={bloco} tema={tema} editor={editor} slug={pagina.slug} />
            {onInserir && (
              <PontoDeInsercao
                permitirEstrutura
                rotulo="Adicionar aqui"
                onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: bloco.id, posicao: "depois" })}
              />
            )}
          </div>
        ))}
        {onInserir && !blocos.length && (
          <div className="flex min-h-[18rem] items-center justify-center py-16">
            <ZonaVazia
              permitirEstrutura
              dica="Comece por aqui: escolha o que entra na página"
              onEscolher={(tipo) => onInserir(tipo, { modo: "fim" })}
            />
          </div>
        )}
        {marca && (
          <p className="pt-8 text-xs uppercase tracking-[0.2em] opacity-40">
            Feito no Single
          </p>
        )}
      </div>
    </div>
  );

  if (!mostrarAnuncios) return canvas;

  return (
    <div className="pagina-publicada-com-anuncios">
      {canvas}
      <AnuncioSlot posicao="esquerda" />
      <AnuncioSlot posicao="direita" />
      <AnuncioSlot posicao="base" />
    </div>
  );
}
