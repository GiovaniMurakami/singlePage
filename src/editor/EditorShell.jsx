import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppWindow, Layers, Monitor, Plus, SlidersHorizontal, Smartphone } from "lucide-react";
import { Pills } from "./ajustesUI";
import { seletorCorAberto } from "./seletorCor";
import { PageRenderer } from "./PageRenderer";
import { Inspector, ThemeInspector } from "./Inspector";
import { GuiaEditor } from "./GuiaEditor";
import { Tooltip } from "./Tooltip";
import { IconeLucide } from "./icones";
import { TIPOS_ESTRUTURA, TIPOS_PECA, blocoPadrao, ehTipoEstrutura, nomeDoTipo } from "./templates";
import {
  acharBloco,
  caminhoDoAlvo,
  contextoDoAlvo,
  destinoDaInsercao,
  inserirPorDestino,
  listarArvore,
  moverBlocoArvore,
  moverParaCelula,
  moverParaContainer,
  removerBloco,
  rotuloDestino,
  substituirBloco,
} from "./blocosArvore";
import { LayoutPickerModal } from "./LayoutPickerModal";
import { aplicarLayout } from "./blocoLayouts";
import { encerrarLevantamento, iniciarLevantamento } from "./arrastoVisual";
import { cssFundo } from "./fundo";
import { parteDoBloco, removerParteDoBloco, separarAlvo } from "./partes";

function lerArrasto(evento) {
  try {
    return JSON.parse(evento.dataTransfer.getData("text/plain") || "{}");
  } catch {
    return {};
  }
}

function ArvorePagina({ nos, selecionadoId, onSelect, nivel = 0 }) {
  if (!nos?.length) return null;
  return (
    <ul className={nivel ? "mt-1 space-y-0.5 border-l border-line pl-2" : "space-y-0.5"}>
      {nos.map((no) => {
        const ativo = selecionadoId === no.id;
        return (
          <li key={no.id}>
            <button
              type="button"
              className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-xs ${
                ativo ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-2"
              }`}
              onClick={() => onSelect(no.id)}
            >
              <span className="truncate">{no.nome}</span>
            </button>
            {no.filhos?.length ? (
              <ArvorePagina nos={no.filhos} selecionadoId={selecionadoId} onSelect={onSelect} nivel={nivel + 1} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function EditorShell({
  pagina,
  onChange,
  voltarPara = "/",
  voltarLabel = "Início",
  acoes,
  onEscolherImagem,
  onTrocarModelo,
  ajustesPagina,
}) {
  const [selecionadoId, setSelecionadoId] = useState(pagina.blocos[0]?.id || null);
  const [aba, setAba] = useState("bloco");
  const [paleta, setPaleta] = useState("estrutura");
  const [visao, setVisao] = useState("desktop");
  const [arrasto, setArrasto] = useState(null);
  const [guiaAberta, setGuiaAberta] = useState(() => window.localStorage.getItem("single.guia-editor") !== "oculto");
  const [layoutsBlocoId, setLayoutsBlocoId] = useState(null);
  const [painel, setPainel] = useState("pagina");
  const [largura, setLargura] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const historicoRef = useRef([]);

  const { blocoId: alvoId, parteId } = separarAlvo(selecionadoId);
  const alvo = useMemo(() => contextoDoAlvo(pagina.blocos, alvoId), [pagina.blocos, alvoId]);
  const bloco = alvo?.kind === "bloco" ? alvo.bloco : null;
  const layoutsBloco = layoutsBlocoId ? acharBloco(pagina.blocos, layoutsBlocoId) : null;
  const parte = parteDoBloco(bloco, parteId);
  const arvore = useMemo(() => listarArvore(pagina.blocos), [pagina.blocos]);
  const migalhas = useMemo(() => caminhoDoAlvo(pagina.blocos, alvoId), [pagina.blocos, alvoId]);
  const tiposPaleta = paleta === "estrutura" ? TIPOS_ESTRUTURA : TIPOS_PECA;
  const dicaDestino = rotuloDestino(pagina.blocos, alvoId, paleta === "estrutura" ? "grade" : "texto");
  const passoAtivo = !selecionadoId ? 1 : parteId ? 3 : 2;
  const telaEstreita = largura < 1024;
  const celular = !telaEstreita && visao === "celular";

  const registrarHistorico = () => {
    historicoRef.current.push({
      blocos: pagina.blocos,
      selecionadoId,
    });
    if (historicoRef.current.length > 50) historicoRef.current.shift();
  };

  const desfazerAcao = () => {
    const anterior = historicoRef.current.pop();
    if (!anterior) return;
    onChange({ ...pagina, blocos: anterior.blocos });
    setSelecionadoId(anterior.selecionadoId ?? null);
  };

  const removerSelecionado = (id) => {
    registrarHistorico();
    gravar(removerBloco(pagina.blocos, id), null);
  };

  const removerParte = (blocoId, idDaParte) => {
    const ctx = contextoDoAlvo(pagina.blocos, blocoId);
    if (ctx?.kind !== "bloco") return;
    registrarHistorico();
    gravar(substituirBloco(pagina.blocos, removerParteDoBloco(ctx.bloco, idDaParte)), blocoId);
  };

  const gravar = (blocos, id = selecionadoId) => {
    onChange({ ...pagina, blocos });
    if (id !== undefined) setSelecionadoId(id);
  };

  const atualizarBloco = (proximo) => {
    // Não troca a seleção: se estiver numa parte (bloco::foto), manter o foco do input.
    onChange({ ...pagina, blocos: substituirBloco(pagina.blocos, proximo) });
  };

  const adicionarPeca = (tipo) => {
    const novo = blocoPadrao(tipo);
    const destino = destinoDaInsercao(pagina.blocos, alvoId, tipo);
    registrarHistorico();
    gravar(inserirPorDestino(pagina.blocos, novo, destino), novo.id);
    setAba("bloco");
    setPainel("pagina");
  };

  const inserirEm = (tipo, destino) => {
    const novo = blocoPadrao(tipo);
    registrarHistorico();
    gravar(inserirPorDestino(pagina.blocos, novo, destino), novo.id);
    setAba("bloco");
  };

  const soltarNoCanvas = (destinoId, posicao, dadosEvento, extra) => {
    const dados = dadosEvento?.kind ? dadosEvento : arrasto;
    setArrasto(null);
    if (!dados) return;
    registrarHistorico();
    if (dados.kind === "bloco") {
      if (extra?.celulaId) {
        gravar(moverParaCelula(pagina.blocos, dados.id, extra.celulaId), dados.id);
        return;
      }
      if (extra?.containerId || posicao === "dentro") {
        gravar(moverParaContainer(pagina.blocos, dados.id, extra?.containerId || destinoId), dados.id);
        return;
      }
      gravar(moverBlocoArvore(pagina.blocos, dados.id, destinoId, posicao), dados.id);
      return;
    }
    if (dados.kind === "peca") {
      const novo = blocoPadrao(dados.tipo);
      if (extra?.celulaId && !ehTipoEstrutura(dados.tipo)) {
        gravar(inserirPorDestino(pagina.blocos, novo, { modo: "celula", celulaId: extra.celulaId }), novo.id);
        return;
      }
      if (extra?.containerId && dados.tipo !== "secao") {
        gravar(inserirPorDestino(pagina.blocos, novo, { modo: "dentro", containerId: extra.containerId }), novo.id);
        return;
      }
      if (destinoId) {
        gravar(inserirPorDestino(pagina.blocos, novo, { modo: "lado", destinoId, posicao }), novo.id);
        return;
      }
      gravar(inserirPorDestino(pagina.blocos, novo, destinoDaInsercao(pagina.blocos, selecionadoId, dados.tipo)), novo.id);
    }
    setAba("bloco");
  };

  const selecionar = (id) => {
    setSelecionadoId(id);
    setAba("bloco");
    if (id && largura < 1024) setPainel("ajustes");
  };

  const selecionarNaBarra = (id) => {
    selecionar(id);
    if (largura >= 1024) setPainel("pagina");
  };

  useEffect(() => {
    const onResize = () => setLargura(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const atalho = (evento) => {
      const foco = evento.target;
      const digitando = foco?.isContentEditable
        || ["INPUT", "TEXTAREA", "SELECT"].includes(foco?.tagName);
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "z") {
        if (digitando) return;
        if (!historicoRef.current.length) return;
        evento.preventDefault();
        desfazerAcao();
        return;
      }
      if (digitando) return;
      if (evento.key === "Escape") {
        if (seletorCorAberto()) return;
        setSelecionadoId(null);
        return;
      }
      if ((evento.key === "Delete" || evento.key === "Backspace") && selecionadoId) {
        evento.preventDefault();
        if (parteId && bloco) removerParte(bloco.id, parteId);
        else if (alvo?.kind === "bloco") removerSelecionado(alvo.bloco.id);
      }
    };
    window.addEventListener("keydown", atalho);
    return () => window.removeEventListener("keydown", atalho);
  });

  const rotuloSelecao = parte?.nome || (bloco ? nomeDoTipo(bloco.tipo) : "página");

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-paper pt-[env(safe-area-inset-top)]">
      <header className="flex shrink-0 items-center gap-2 border-b border-line bg-paper-2/90 px-3 py-2 sm:gap-3 sm:px-4">
        <Link to={voltarPara} className="shrink-0 text-sm text-muted">{voltarLabel}</Link>
        <input
          className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm sm:max-w-[14rem]"
          value={pagina.titulo}
          onChange={(e) => onChange({ ...pagina, titulo: e.target.value })}
          aria-label="Título da página"
        />
        <div className="hidden shrink-0 lg:block">
          <Pills
            valor={visao}
            onChange={setVisao}
            className="min-w-[9.5rem]"
            opcoes={[
              { id: "desktop", nome: "Desk", icone: <Monitor size={14} /> },
              { id: "celular", nome: "Cel", icone: <Smartphone size={14} /> },
            ]}
          />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {onTrocarModelo && (
            <button type="button" className="hidden rounded-full px-3 py-2 text-sm text-muted hover:text-ink sm:inline" onClick={onTrocarModelo}>
              Modelo
            </button>
          )}
          {acoes}
        </div>
      </header>

      {guiaAberta && (
        <div className="shrink-0">
          <GuiaEditor
            passoAtivo={passoAtivo}
            onFechar={() => {
              window.localStorage.setItem("single.guia-editor", "oculto");
              setGuiaAberta(false);
            }}
          />
        </div>
      )}

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[16.5rem_minmax(0,1fr)_20rem]">
        <aside className={`min-h-0 min-w-0 overflow-x-hidden overflow-y-auto border-r border-line p-4 ${painel === "blocos" ? "block" : "hidden"} lg:block`}>
          <Pills
            valor={paleta}
            onChange={setPaleta}
            className="min-w-0"
            opcoes={[
              { id: "estrutura", nome: "Estrutura" },
              { id: "pecas", nome: "Peças" },
            ]}
          />
          <Tooltip
            passo="1"
            titulo="Adicionar"
            texto="Clique para colocar abaixo do que está selecionado. Na página, o + escolhe o lugar."
          >
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Adicionar</p>
          </Tooltip>
          <p className="mt-1 text-xs text-muted">{dicaDestino}.</p>
          <div className="mt-3 space-y-2">
            {tiposPaleta.map((tipo) => (
              <button
                key={tipo.tipo}
                type="button"
                draggable
                className="flex min-h-11 w-full min-w-0 cursor-grab items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm hover:bg-paper-2 active:cursor-grabbing"
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "copy";
                  e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "peca", tipo: tipo.tipo }));
                  iniciarLevantamento(e.currentTarget, e);
                  setArrasto({ kind: "peca", tipo: tipo.tipo });
                }}
                onDragEnd={() => {
                  encerrarLevantamento();
                  setArrasto(null);
                }}
                onClick={() => adicionarPeca(tipo.tipo)}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-paper-2 text-ink-soft">
                  {tipo.icone ? <IconeLucide nome={tipo.icone} size={14} /> : <Plus size={14} />}
                </span>
                <span className="min-w-0">
                  <strong className="block truncate">{tipo.nome}</strong>
                  <span className="block truncate text-xs text-muted">{tipo.descricao}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-1 text-xs uppercase tracking-[0.16em] text-muted">Nesta página</p>
            <p className="mb-2 text-[11px] leading-4 text-muted">Clique num item para rolar até ele.</p>
            {arvore.length ? (
              <ArvorePagina nos={arvore} selecionadoId={alvoId} onSelect={selecionarNaBarra} />
            ) : (
              <p className="text-xs text-muted">Ainda vazia. Comece por uma seção.</p>
            )}
          </div>
        </aside>

        <section
          className={`flex h-full min-h-0 flex-col overflow-y-auto bg-paper ${painel === "pagina" ? "flex" : "hidden"} lg:flex`}
          onClick={(evento) => {
            const alvo = evento.target;
            if (seletorCorAberto()) return;
            if (!(alvo instanceof Element)) return;
            if (alvo === document.documentElement || alvo === document.body) return;
            if (alvo.closest("[data-editor-chrome], .bloco-editor, .parte-alvo, .ponto-insercao, .zona-vazia, .celula-editor, [data-pagina-canvas]")) return;
            setSelecionadoId(null);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!arrasto && !lerArrasto(e).kind) return;
            if (!pagina.blocos.length) soltarNoCanvas(null, "depois");
          }}
        >
          {celular ? (
            <div className="mx-auto w-full max-w-[360px] p-3 sm:p-6">
              <div className="rounded-[2.4rem] p-[10px] ring-1 ring-black/10" style={cssFundo(pagina.tema || {})}>
                <div className="preview-celular h-[min(680px,70dvh)] overflow-auto rounded-[1.9rem]">
                  <PageRenderer
                    pagina={pagina}
                    selecionadoId={selecionadoId}
                    onSelect={selecionar}
                    onEscolherImagem={onEscolherImagem}
                    onRemover={removerSelecionado}
                    onRemoverParte={removerParte}
                    onInserir={inserirEm}
                    onAtualizar={atualizarBloco}
                    onAbrirLayouts={setLayoutsBlocoId}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-full w-full grow flex-col" style={cssFundo(pagina.tema || {})}>
              <PageRenderer
                pagina={pagina}
                selecionadoId={selecionadoId}
                onSelect={selecionar}
                arrasto={arrasto}
                onInicioArrasto={(dados) => setArrasto(dados)}
                onSobreArrasto={(id, posicao, extra) => setArrasto((atual) => (
                  atual ? { ...atual, sobreId: id, posicao, sobreCelulaId: extra?.celulaId, sobreContainerId: extra?.containerId } : atual
                ))}
                onSoltarArrasto={soltarNoCanvas}
                onEscolherImagem={onEscolherImagem}
                onRemover={removerSelecionado}
                onRemoverParte={removerParte}
                onInserir={inserirEm}
                onAtualizar={atualizarBloco}
                onAbrirLayouts={setLayoutsBlocoId}
              />
            </div>
          )}
        </section>

        <aside className={`min-h-0 overflow-y-auto border-l border-line p-4 ${painel === "ajustes" ? "block" : "hidden"} lg:block`}>
          <Tooltip passo="3" titulo="Ajuste aqui" texto="Muda só o que está selecionado na página." lado="esquerda">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Ajustes</p>
          </Tooltip>
          {migalhas.length > 0 && (
            <p className="mb-3 flex flex-wrap items-center gap-1 text-[11px] text-muted">
              <button type="button" className="hover:text-ink" onClick={() => setSelecionadoId(null)}>Página</button>
              {migalhas.map((item) => (
                <span key={item.id} className="flex items-center gap-1">
                  <span>›</span>
                  <button type="button" className="hover:text-ink" onClick={() => selecionar(item.id)}>{item.nome}</button>
                </span>
              ))}
              {parte && (
                <span className="flex items-center gap-1">
                  <span>›</span>
                  <span className="font-medium text-ink">{parte.nome}</span>
                </span>
              )}
            </p>
          )}
          <Pills
            valor={aba}
            onChange={setAba}
            className="mb-4"
            opcoes={[
              { id: "bloco", nome: "Bloco" },
              { id: "tema", nome: "Tema" },
            ]}
          />
          {aba === "tema" ? (
            <ThemeInspector tema={pagina.tema} onChange={(tema) => onChange({ ...pagina, tema })} onEscolherImagem={onEscolherImagem} extras={ajustesPagina} />
          ) : (
            <Inspector
              bloco={bloco}
              celula={alvo?.kind === "celula" ? alvo : null}
              parteId={parteId}
              onSelecionarParte={(id) => setSelecionadoId(id)}
              onChange={atualizarBloco}
              onAdicionarPeca={adicionarPeca}
              onEscolherImagem={onEscolherImagem}
              tema={pagina.tema}
            />
          )}
        </aside>
      </div>

      {selecionadoId && painel === "pagina" && (
        <div className="shrink-0 border-t border-line bg-paper-2 px-3 py-2 lg:hidden">
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-4 text-sm text-paper"
            onClick={() => setPainel("ajustes")}
          >
            Ajustar {rotuloSelecao}
          </button>
        </div>
      )}

      <nav className="grid shrink-0 grid-cols-3 border-t border-line bg-paper-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] lg:hidden" aria-label="Painéis do editor">
        {[
          { id: "blocos", nome: "Peças", icone: Layers },
          { id: "pagina", nome: "Página", icone: AppWindow },
          { id: "ajustes", nome: "Ajustes", icone: SlidersHorizontal },
        ].map((item) => {
          const Icone = item.icone;
          const ativo = painel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] ${ativo ? "text-ink" : "text-muted"}`}
              onClick={() => setPainel(item.id)}
            >
              <span className="relative">
                <Icone size={18} />
                {item.id === "ajustes" && selecionadoId && !ativo && (
                  <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </span>
              {item.nome}
            </button>
          );
        })}
      </nav>
      {layoutsBloco && (
        <LayoutPickerModal
          tipo={layoutsBloco.tipo}
          atualId={layoutsBloco.props.layoutId}
          propsBloco={layoutsBloco.props}
          tema={pagina.tema}
          onEscolher={(id) => {
            atualizarBloco({ ...layoutsBloco, props: aplicarLayout(layoutsBloco.tipo, id, layoutsBloco.props) });
            setLayoutsBlocoId(null);
          }}
          onFechar={() => setLayoutsBlocoId(null)}
        />
      )}
    </div>
  );
}
