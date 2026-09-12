import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical, Plus, Trash2, Undo2 } from "lucide-react";
import { IconeLucide, classeAnimacaoIcone } from "./icones";
import { AnuncioSlot } from "../components/ui/AnuncioSlot";
import { ESTILOS_BOTAO, TIPOS_ESTRUTURA, TIPOS_PECA, camposDoFormulario, ehTipoEstrutura, nomeDoTipo } from "./templates";
import { caixaDoBloco, classeBotaoTamanho, classeTexto, classeTitulo, estiloMidia, temaDoBloco, TAMANHOS_BOTAO, TAMANHOS_TEXTO, TAMANHOS_TITULO } from "./aparencia";
import { cssFundo } from "./fundo";
import { encerrarLevantamento, iniciarLevantamento } from "./arrastoVisual";
import { idParte, partesDoBloco, podeRemoverParte, separarAlvo } from "./partes";

const FONTES = {
  sans: "IBM Plex Sans, sans-serif",
  serif: "Instrument Serif, serif",
  mono: "IBM Plex Mono, monospace",
};

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

const semMarca = (_parteId, node) => node;

function opcoesRapidasDaParte(bloco, parteId) {
  if (!bloco || !parteId) return null;
  if (parteId === "titulo" || (bloco.tipo === "texto" && parteId === "titulo")) {
    return { chave: "tamanhoTitulo", rotulo: "Tamanho", opcoes: TAMANHOS_TITULO.filter((o) => o.id) };
  }
  if (parteId === "subtitulo" || parteId === "corpo" || parteId === "legenda") {
    return { chave: "tamanhoTexto", rotulo: "Tamanho", opcoes: TAMANHOS_TEXTO.filter((o) => o.id) };
  }
  if (parteId === "botao" && bloco.tipo === "capa") {
    return [
      { chave: "tamanhoBotao", rotulo: "Tamanho", opcoes: TAMANHOS_BOTAO.filter((o) => o.id) },
      { chave: "estiloBotao", rotulo: "Estilo", opcoes: ESTILOS_BOTAO },
    ];
  }
  if (bloco.tipo === "botoes" && parteId.startsWith("item-")) {
    return { chave: "estilo", rotulo: "Estilo", opcoes: ESTILOS_BOTAO, item: true };
  }
  return null;
}

function PopoverRapido({ bloco, parteId, onAtualizar }) {
  const cfg = opcoesRapidasDaParte(bloco, parteId);
  if (!cfg || !onAtualizar) return null;
  const grupos = Array.isArray(cfg) ? cfg : [cfg];
  const indice = parteId.startsWith("item-") ? Number(parteId.split("-")[1]) : null;

  const valorDe = (chave, item) => {
    if (item) return bloco.props.itens?.[indice]?.[chave] || "";
    return bloco.props[chave] || "";
  };

  const gravar = (chave, valor, item) => {
    if (item) {
      const itens = (bloco.props.itens || []).map((atual, i) => (i === indice ? { ...atual, [chave]: valor } : atual));
      onAtualizar({ ...bloco, props: { ...bloco.props, itens } });
      return;
    }
    onAtualizar({ ...bloco, props: { ...bloco.props, [chave]: valor } });
  };

  return (
    <div className="parte-popover" data-editor-chrome onClick={(e) => e.stopPropagation()}>
      <div className="parte-popover-caixa">
        {grupos.map((grupo) => (
          <div key={grupo.chave} className="parte-popover-grupo">
            <span className="parte-popover-rotulo">{grupo.rotulo}</span>
            <div className="parte-popover-pills">
              {grupo.opcoes.map((opcao) => {
                const ativo = valorDe(grupo.chave, grupo.item) === opcao.id;
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    className={ativo ? "ativo" : ""}
                    onClick={() => gravar(grupo.chave, opcao.id, grupo.item)}
                  >
                    {opcao.nome}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Parte({
  bloco,
  parte,
  ativo,
  onSelect,
  onRemover,
  onAtualizar,
  className = "",
  children,
}) {
  const alvo = idParte(bloco.id, parte.id);
  const [hover, setHover] = useState(false);
  const timer = useRef(0);
  const temPopover = Boolean(opcoesRapidasDaParte(bloco, parte.id) && onAtualizar);

  const entrar = () => {
    clearTimeout(timer.current);
    setHover(true);
  };

  const sair = () => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHover(false), 220);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      role="button"
      tabIndex={0}
      title={`Editar ${parte.nome.toLowerCase()}`}
      data-parte-ativa={ativo ? "true" : undefined}
      data-parte-hover={hover ? "true" : undefined}
      className={`parte-alvo ${className}`}
      onMouseEnter={entrar}
      onMouseLeave={sair}
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
        <div
          className="parte-excluir"
          data-editor-chrome
          onMouseEnter={entrar}
          onMouseLeave={sair}
        >
          <BotaoExcluirHold rotulo={parte.nome} onConfirmar={() => onRemover(bloco.id, parte.id)} />
        </div>
      )}
      {(hover || ativo) && temPopover && (
        <div onMouseEnter={entrar} onMouseLeave={sair}>
          <PopoverRapido bloco={bloco} parteId={parte.id} onAtualizar={onAtualizar} />
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
        onAtualizar={extras.onAtualizar}
        className={className}
      >
        {node}
      </Parte>
    );
  };
}

function MenuPecas({ ancoraRef, onEscolher, onFechar, permitirEstrutura = false }) {
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
            {grupo.itens.map((tipo) => (
              <button
                key={tipo.tipo}
                type="button"
                className="menu-pecas-item"
                onClick={() => onEscolher(tipo.tipo)}
              >
                <span className="menu-pecas-icone">
                  {tipo.icone ? <IconeLucide nome={tipo.icone} size={14} color="currentColor" /> : <Plus size={14} />}
                </span>
                <span>
                  <strong className="block">{tipo.nome}</strong>
                  <span className="menu-pecas-dica">{tipo.descricao}</span>
                </span>
              </button>
            ))}
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

function estiloBotao(estilo, tema, item = {}) {
  if (estilo === "texto") {
    return { className: "underline-offset-4", style: { color: item.cor || tema.destaque, background: "transparent" } };
  }
  if (estilo === "contorno") {
    return {
      className: "rounded-full border",
      style: { borderColor: item.fundo || tema.destaque, color: item.cor || tema.texto, background: "transparent" },
    };
  }
  return {
    className: "rounded-full",
    style: { background: item.fundo || tema.destaque, color: item.cor || "#ffffff" },
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
  const visual = estiloBotao(item.estilo || "preenchido", tema, item);
  const tamanho = classeBotaoTamanho(item.tamanho || item.tamanhoBotao);
  return (
    <a
      href={item.url || "#"}
      target={item.novaAba ? "_blank" : undefined}
      rel={item.novaAba ? "noreferrer" : undefined}
      className={`item-interativo inline-flex items-center justify-center font-medium ${tamanho} ${visual.className} ${className}`}
      style={estiloInterativo({
        ...item,
        fundo: item.fundo || visual.style.background,
        cor: item.cor || visual.style.color,
        borda: visual.style.borderColor,
      }, visual.style)}
    >
      {item.rotulo}
    </a>
  );
}

function BlocoCapa({ props, tema, marcar = semMarca, onEscolherFoto }) {
  const local = temaDoBloco(props, tema);
  const centro = local.alinhamento !== "esquerda";
  const tamanho = props.fotoTamanho || 112;
  const raio = props.fotoRaio ?? 999;
  const foto = props.fotoUrl ? (
    <img
      src={props.fotoUrl}
      alt=""
      className={`mb-6 object-cover ${centro ? "mx-auto" : ""}`}
      style={{ width: tamanho, height: tamanho, borderRadius: raio }}
    />
  ) : (
    <label
      className={`capa-foto-vazia mb-6 ${centro ? "mx-auto" : ""}`}
      style={{ width: tamanho, height: tamanho, borderRadius: raio }}
      onClick={(evento) => evento.stopPropagation()}
    >
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
    <section className="py-16" style={caixaDoBloco(props)}>
      {marcar("foto", foto)}
      {marcar("titulo", (
        <h1 className={classeTitulo("capa", props.tamanhoTitulo)} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{props.titulo}</h1>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`mt-4 ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-80"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
          {props.subtitulo}
        </p>
      ))}
      {props.cta && marcar("botao", (
        <div className="mt-8">
          <BotaoPagina
            tema={local}
            item={{
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
            }}
          />
        </div>
      ))}
    </section>
  );
}

function BlocoTexto({ props, marcar = semMarca }) {
  return (
    <section className="py-10" style={caixaDoBloco(props)}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{props.titulo}</h2>
      ))}
      {props.corpo && marcar("corpo", (
        <p className={`whitespace-pre-wrap ${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-85"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
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
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-sm opacity-80 transition hover:opacity-100"
            onClick={(evento) => evento.stopPropagation()}
          >
            <span>Enviar imagem</span>
            <span className="mt-1 text-xs opacity-60">JPG, PNG, GIF ou WebP</span>
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
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-sm opacity-50">Imagem</div>
        )}
      </div>
    );
  }
  return (
    <figure className="my-8" style={caixaDoBloco(props)}>
      {marcar("imagem", (
        <img src={props.url} alt={props.alt || ""} className={props.display ? "" : "w-full"} style={estiloMidia(props, "1rem")} />
      ))}
      {props.caption && marcar("legenda", (
        <figcaption className={`${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-60"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
          {props.caption}
        </figcaption>
      ), "mt-2")}
    </figure>
  );
}

function BlocoBotoes({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  return (
    <div className={props.display ? "py-6" : "flex flex-col gap-3 py-6"} style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => (
        <div key={`${item.rotulo}-${index}`} className="contents">
          {marcar(`item-${index}`, <BotaoPagina item={item} tema={local} className="min-h-12 w-full" />)}
        </div>
      ))}
    </div>
  );
}

function BlocoGaleria({ props, interativo, marcar = semMarca }) {
  const urls = (props.urls || []).filter(Boolean);
  const [aberta, setAberta] = useState(null);
  const custom = Boolean(props.display);
  return (
    <>
      <div className={custom ? "w-full py-8" : "grid w-full gap-3 py-8 sm:grid-cols-2"} style={caixaDoBloco(props)}>
        {(urls.length ? urls : ["", "", ""]).map((url, index) => (
          <div key={url ? url + index : `vazia-${index}`} className="contents">
            {url
              ? marcar(`item-${index}`, (
                <button
                  type="button"
                  className="w-full overflow-hidden"
                  style={estiloMidia(props, "1rem")}
                  onClick={() => interativo && setAberta(url)}
                >
                  <img src={url} alt="" className="aspect-square w-full" style={{ objectFit: props.objectFit || "cover", display: "block" }} />
                </button>
              ))
              : <div className="aspect-square border border-dashed border-line" style={estiloMidia(props, "1rem")} />}
          </div>
        ))}
      </div>
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

function BlocoDepoimentos({ props, marcar = semMarca }) {
  return (
    <div className="grid gap-4 py-8" style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => (
        <div key={index} className="contents">
          {marcar(`item-${index}`, (
            <blockquote className="border border-line px-5 py-4 text-left" style={estiloMidia(props, "1rem")}>
              <div className="flex items-start gap-3">
                {item.fotoUrl ? (
                  <img src={item.fotoUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="depoimento-foto-vazia" aria-hidden>
                    {(item.autor || "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className={classeTitulo("texto", props.tamanhoTitulo || "pequeno")} style={props.corTitulo ? { color: props.corTitulo } : undefined}>“{item.citacao}”</p>
                  {item.autor && (
                    <footer className={`mt-2 ${classeTexto(props.tamanhoTexto || "pequeno")} ${props.corTexto ? "" : "opacity-60"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
                      {item.autor}
                    </footer>
                  )}
                </div>
              </div>
            </blockquote>
          ))}
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

function montarMailtoCampos(destEmail, assunto, campos, valores) {
  const dest = String(destEmail || "").trim();
  if (!dest) return "";
  const linhas = campos.map((campo) => {
    const valor = valores[campo.id];
    const rotulo = campo.rotulo || campo.placeholder || "Campo";
    if (campo.tipo === "check") return valor ? `${rotulo}: sim` : "";
    if (valor == null || String(valor).trim() === "") return "";
    return campo.tipo === "area" ? `${rotulo}:\n${valor}` : `${rotulo}: ${valor}`;
  }).filter(Boolean);
  const params = new URLSearchParams();
  if (assunto) params.set("subject", assunto);
  if (linhas.length) params.set("body", linhas.join("\n"));
  return `mailto:${dest}?${params.toString()}`;
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

function BlocoFormulario({ props, tema, interativo, marcar = semMarca }) {
  const campos = camposDoFormulario(props);
  const [valores, setValores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const setValor = (id, valor) => setValores((atual) => ({ ...atual, [id]: valor }));

  const enviar = (evento) => {
    evento.preventDefault();
    if (!interativo) return;
    if (!props.destEmail) {
      setErro("Defina o e-mail de destino no painel do bloco.");
      return;
    }
    const primeiroTexto = campos.find((campo) => campo.tipo !== "check" && String(valores[campo.id] || "").trim());
    const href = montarMailtoCampos(
      props.destEmail,
      props.assunto || `Mensagem de ${primeiroTexto ? valores[primeiroTexto.id] : "sua página"}`,
      campos,
      valores
    );
    window.location.href = href;
    setEnviado(true);
    setErro("");
  };

  const local = temaDoBloco(props, tema);
  return (
    <form className="py-10" onSubmit={enviar} id="formulario" style={caixaDoBloco(props)}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{props.titulo}</h2>
      ))}
      {marcar("campos", (
        <div className="flex flex-col gap-3">
          {campos.map((campo) => (
            <CampoPagina
              key={campo.id}
              campo={campo}
              valor={valores[campo.id]}
              onChange={(valor) => setValor(campo.id, valor)}
              interativo={interativo}
              className=""
            />
          ))}
        </div>
      ), "mt-4")}
      {marcar("botao", (
        <button
          type="submit"
          className="min-h-12 w-full rounded-full px-6 text-sm font-medium text-white"
          style={{ background: local.destaque }}
        >
          {props.botao || "Enviar"}
        </button>
      ), "mt-3")}
      {erro && <p className="mt-3 text-sm text-red-400">{erro}</p>}
      {enviado && (
        <p className="mt-3 text-sm opacity-70">
          Abrimos o seu e-mail com a mensagem pronta para {props.destEmail}.
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
            <a href={item.url || "#"} className="underline-offset-4 hover:underline" style={props.corTexto ? { color: props.corTexto } : undefined}>
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
  return (
    <nav
      className="sticky top-0 z-10 -mx-6 mb-2 flex flex-wrap justify-center gap-4 px-6 py-4 text-sm backdrop-blur"
      style={{ background: props.corFundo || `${local.fundo}cc`, color: props.corTexto || undefined }}
    >
      {(props.itens || []).map((item, index) => (
        <div key={index} className="contents">
          {marcar(`item-${index}`, (
            <a href={`#${item.ancora || ""}`} className="underline-offset-4 hover:underline" style={props.corTexto ? { color: props.corTexto } : undefined}>
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
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{props.titulo}</h2>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`${classeTexto(props.tamanhoTexto)} ${props.corTexto ? "" : "opacity-70"}`} style={props.corTexto ? { color: props.corTexto } : undefined}>
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

function BlocoCartoes({ props, tema, marcar = semMarca }) {
  const local = temaDoBloco(props, tema);
  const colunas = props.colunas || 3;
  const custom = Boolean(props.display);
  const grade = colunas === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : colunas === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={custom ? "py-8" : `grid gap-4 py-8 ${grade}`} style={caixaDoBloco({ ...props, corFundo: undefined })}>
      {(props.itens || []).map((item, index) => (
        <div key={`${item.titulo}-${index}`} className="contents">
          {marcar(`item-${index}`, (
            <article className="h-full border border-line px-5 py-5 text-left" style={{ ...(props.corFundo ? { background: props.corFundo, color: props.corTexto || undefined } : undefined), ...estiloMidia(props, "1rem") }}>
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
  return { display: "grid", gap, gridTemplateColumns: template };
}

function BlocoGrade({ props, tema, interativo, filhos }) {
  return (
    <div className="py-6" style={{ ...estiloGrade(props), ...caixaDoBloco({ ...props, corFundo: props.corFundo }) }}>
      {filhos ?? (props.celulas || []).map((celula, index) => (
        <div key={celula.id || index} className="min-w-0">
          {filhosPadrao(celula.blocos, tema, interativo)}
        </div>
      ))}
    </div>
  );
}

function BlocoFaixa({ props, tema, interativo, filhos, marcar = semMarca }) {
  const faixaTema = {
    ...tema,
    fundo: props.fundo || "#111111",
    texto: props.texto || "#f5f5f7",
    destaque: props.destaque || tema.destaque,
  };
  return (
    <section className="-mx-6 my-6 px-6 py-12" style={{ ...cssFundo(props, "fundo"), color: faixaTema.texto, textAlign: props.alinhamento === "esquerda" ? "left" : props.alinhamento === "centro" ? "center" : undefined }}>
      {props.titulo && marcar("titulo", (
        <h2 className={classeTitulo("texto", props.tamanhoTitulo)} style={props.corTitulo ? { color: props.corTitulo } : undefined}>{props.titulo}</h2>
      ))}
      {props.subtitulo && marcar("subtitulo", (
        <p className={`${classeTexto(props.tamanhoTexto)} opacity-80`}>{props.subtitulo}</p>
      ), "mt-3")}
      {filhos ?? filhosPadrao(props.blocos, faixaTema, interativo)}
    </section>
  );
}

function BlocoIcones({ props, marcar = semMarca }) {
  return (
    <div className={props.display ? "py-6" : "flex flex-wrap items-center justify-center gap-3 py-6"} style={caixaDoBloco(props)}>
      {(props.itens || []).map((item, index) => {
        const lado = (item.tamanho || 22) + (item.padding || 12) * 2;
        const visual = (
          <span
            className="item-interativo"
            style={{
              ...estiloInterativo(item),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: lado,
              height: lado,
              borderRadius: item.raio ?? 18,
            }}
          >
            <span className={classeAnimacaoIcone(item.animacao)}>
              <IconeLucide nome={item.nome} size={item.tamanho || 22} color="currentColor" strokeWidth={item.traco || 2} />
            </span>
          </span>
        );
        return (
          <div key={`${item.nome}-${index}`} className="contents">
            {marcar(`item-${index}`, item.url ? (
              <a href={item.url} target={item.novaAba ? "_blank" : undefined} rel={item.novaAba ? "noreferrer" : undefined} aria-label={item.nome}>
                {visual}
              </a>
            ) : <span>{visual}</span>)}
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

function ItemCanvas({ bloco, tema, editor, faixaTema }) {
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
    onDesfazer,
    temDesfazer,
    onInserir,
    onAtualizar,
  } = editor || {};
  const interativo = !onSelect;
  const podeArrastar = Boolean(onInicioArrasto);
  const { blocoId: selecionadoBlocoId, parteId: selecionadaParteId } = separarAlvo(selecionadoId);
  const ativo = selecionadoBlocoId === bloco.id;
  const parteAtiva = ativo ? selecionadaParteId : null;
  const parteSelecionada = parteAtiva ? partesDoBloco(bloco).find((item) => item.id === parteAtiva) : null;
  const alvo = arrasto?.sobreId === bloco.id;
  const estrutura = ehTipoEstrutura(bloco.tipo);
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
                <ItemCanvas bloco={filho} tema={local} editor={editor} />
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
      interativo={interativo}
      marcar={onSelect ? criarMarcador(bloco, selecionadoId, onSelect, {
        onRemoverParte,
        onAtualizar,
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
        className={`bloco-editor group relative w-full rounded-2xl ${estrutura ? "bloco-estrutura" : ""} ${arrasto?.id === bloco.id ? "bloco-levantando" : ""}`}
      >
        {podeArrastar && (
          <div
            data-editor-chrome
            className={`absolute left-2 top-3 z-10 flex items-center rounded-md text-white transition ${
              ativo
                ? "bg-[#1d1d1f]"
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:bg-[#1d1d1f]/75 group-hover:opacity-100"
            }`}
          >
            <button
              type="button"
              draggable
              aria-label="Arrastar bloco"
              title="Arraste para reordenar"
              className="cursor-grab p-1 active:cursor-grabbing"
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
            </button>
            {ativo && (
              <button
                type="button"
                className="pr-2 text-[11px] font-medium"
                title={parteAtiva ? `Voltar para a ${nomeDoTipo(bloco.tipo).toLowerCase()} inteira` : undefined}
                onClick={(evento) => {
                  evento.stopPropagation();
                  onSelect(bloco.id);
                }}
              >
                {parteSelecionada ? `${nomeDoTipo(bloco.tipo)} › ${parteSelecionada.nome}` : nomeDoTipo(bloco.tipo)}
              </button>
            )}
          </div>
        )}
        {ativo && onRemover && !parteAtiva && (
          <div data-editor-chrome className="absolute right-2 top-2 z-20 flex items-center gap-1">
            {temDesfazer && onDesfazer && (
              <button
                type="button"
                aria-label="Desfazer exclusão"
                className="inline-flex items-center gap-1 rounded-md bg-[#1d1d1f] px-2 py-1.5 text-[11px] font-medium text-white hover:bg-ink-soft"
                onClick={(evento) => {
                  evento.stopPropagation();
                  onDesfazer();
                }}
              >
                <Undo2 size={13} />
                Desfazer
              </button>
            )}
            <BotaoExcluirHold rotulo={nomeDoTipo(bloco.tipo)} onConfirmar={() => onRemover(bloco.id)} />
          </div>
        )}
        {ativo && parteAtiva && temDesfazer && onDesfazer && (
          <div data-editor-chrome className="absolute right-2 top-2 z-20">
            <button
              type="button"
              aria-label="Desfazer exclusão"
              className="inline-flex items-center gap-1 rounded-md bg-[#1d1d1f] px-2 py-1.5 text-[11px] font-medium text-white hover:bg-ink-soft"
              onClick={(evento) => {
                evento.stopPropagation();
                onDesfazer();
              }}
            >
              <Undo2 size={13} />
              Desfazer
            </button>
          </div>
        )}
        {conteudo}
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
  selecionadoId,
  onSelect,
  arrasto,
  onInicioArrasto,
  onSobreArrasto,
  onSoltarArrasto,
  onEscolherImagem,
  onRemover,
  onRemoverParte,
  onDesfazer,
  temDesfazer,
  onInserir,
  onAtualizar,
}) {
  const tema = pagina.tema || {};
  const interativo = !onSelect;
  const mostrarAnuncios = anuncios && interativo;
  const blocos = pagina.blocos || [];
  const meio = Math.max(0, Math.floor(blocos.length / 2) - 1);
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
      onDesfazer,
      temDesfazer,
      onInserir,
      onAtualizar,
    }
    : null;

  return (
    <div
      className={onSelect ? "flex w-full flex-col" : "flex min-h-screen flex-col"}
      data-pagina-canvas
      style={{
        ...cssFundo(tema),
        color: tema.texto,
        fontFamily: FONTES[tema.fonte] || FONTES.sans,
        textAlign: tema.alinhamento === "esquerda" ? "left" : "center",
      }}
      onDragOver={onSobreArrasto ? (e) => e.preventDefault() : undefined}
      onDrop={onSoltarArrasto && !(pagina.blocos || []).length ? (e) => { e.preventDefault(); onSoltarArrasto(null, "depois", lerDadosArrasto(e)); } : undefined}
    >
      <div className="mx-auto w-full px-6 py-10" style={{ maxWidth: LARGURAS[tema.largura] || LARGURAS.media }}>
        {onInserir && blocos.length > 0 && (
          <PontoDeInsercao
            permitirEstrutura
            rotulo="Adicionar no começo"
            onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: blocos[0].id, posicao: "antes" })}
          />
        )}
        {blocos.map((bloco, index) => (
          <div key={bloco.id}>
            <ItemCanvas bloco={bloco} tema={tema} editor={editor} />
            {onInserir && (
              <PontoDeInsercao
                permitirEstrutura
                rotulo="Adicionar aqui"
                onEscolher={(tipo) => onInserir(tipo, { modo: "lado", destinoId: bloco.id, posicao: "depois" })}
              />
            )}
            {mostrarAnuncios && index === meio && <AnuncioSlot posicao="meio" />}
          </div>
        ))}
        {onInserir && !blocos.length && (
          <div className="flex items-center justify-center py-16">
            <ZonaVazia
              permitirEstrutura
              dica="Comece por aqui: escolha o que entra na página"
              onEscolher={(tipo) => onInserir(tipo, { modo: "fim" })}
            />
          </div>
        )}
        {mostrarAnuncios && <AnuncioSlot posicao="rodape" />}
        {marca && (
          <p className="pt-8 text-xs uppercase tracking-[0.2em] opacity-40">
            Feito no Single
          </p>
        )}
      </div>
    </div>
  );
}
