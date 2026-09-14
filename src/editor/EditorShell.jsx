import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Menu,
  Monitor,
  Plus,
  Redo2,
  Smartphone,
  Undo2,
  X,
} from "lucide-react";
import { seletorCorAberto } from "./seletorCor";
import { PageRenderer } from "./PageRenderer";
import { Inspector, ThemeInspector } from "./Inspector";
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
  substituirBloco,
} from "./blocosArvore";
import { LayoutPickerModal } from "./LayoutPickerModal";
import { aplicarLayout } from "./blocoLayouts";
import { encerrarLevantamento, iniciarLevantamento } from "./arrastoVisual";
import { cssFundo } from "./fundo";
import { parteDoBloco, removerParteDoBloco, separarAlvo } from "./partes";
import { ALVO_FUNDO, ALVO_PAGINA, ehAlvoEspecial } from "./alvos";
import { ROTULO_PLANO, planoPermite } from "./planos";
import { useAuth } from "../context/AuthContext";

function lerArrasto(evento) {
  try {
    return JSON.parse(evento.dataTransfer.getData("text/plain") || "{}");
  } catch {
    return {};
  }
}

function snapshot(pagina, selecionadoId) {
  return {
    blocos: pagina.blocos,
    tema: pagina.tema,
    titulo: pagina.titulo,
    selecionadoId,
  };
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
              className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs ${
                ativo ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper"
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

function BotaoBarra({ titulo, ativo, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      disabled={disabled}
      data-ativo={ativo ? "true" : undefined}
      className="editor-barra-btn"
      onClick={onClick}
    >
      {children}
    </button>
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
  const [selecionadoId, setSelecionadoId] = useState(ALVO_PAGINA);
  const [aba, setAba] = useState("conteudo");
  const [visao, setVisao] = useState("desktop");
  const [arrasto, setArrasto] = useState(null);
  const [layoutsBlocoId, setLayoutsBlocoId] = useState(null);
  const [painelAberto, setPainelAberto] = useState(true);
  const [painelLado, setPainelLado] = useState("direita");
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const plano = usuario?.plano || "free";
  const [painelModo, setPainelModo] = useState("propriedades");
  const [menuMais, setMenuMais] = useState(false);
  const [largura, setLargura] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const historicoRef = useRef([]);
  const futuroRef = useRef([]);
  const [historicoTick, setHistoricoTick] = useState(0);
  const podeDesfazer = historicoTick >= 0 && historicoRef.current.length > 0;
  const podeRefazer = historicoTick >= 0 && futuroRef.current.length > 0;

  const { blocoId: alvoId, parteId } = separarAlvo(selecionadoId);
  const alvo = useMemo(() => (ehAlvoEspecial(selecionadoId) ? null : contextoDoAlvo(pagina.blocos, alvoId)), [pagina.blocos, selecionadoId, alvoId]);
  const bloco = alvo?.kind === "bloco" ? alvo.bloco : null;
  const layoutsBloco = layoutsBlocoId ? acharBloco(pagina.blocos, layoutsBlocoId) : null;
  const parte = parteDoBloco(bloco, parteId);
  const arvore = useMemo(() => listarArvore(pagina.blocos), [pagina.blocos]);
  const migalhas = useMemo(() => (ehAlvoEspecial(selecionadoId) ? [] : caminhoDoAlvo(pagina.blocos, alvoId)), [pagina.blocos, selecionadoId, alvoId]);
  const celular = largura >= 1024 && visao === "celular";

  const aplicarSnapshot = (estado) => {
    onChange({ ...pagina, blocos: estado.blocos, tema: estado.tema, titulo: estado.titulo });
    setSelecionadoId(estado.selecionadoId ?? ALVO_PAGINA);
  };

  const registrarHistorico = () => {
    historicoRef.current.push(snapshot(pagina, selecionadoId));
    if (historicoRef.current.length > 50) historicoRef.current.shift();
    futuroRef.current = [];
    setHistoricoTick((n) => n + 1);
  };

  const desfazerAcao = () => {
    const anterior = historicoRef.current.pop();
    if (!anterior) return;
    futuroRef.current.push(snapshot(pagina, selecionadoId));
    aplicarSnapshot(anterior);
    setHistoricoTick((n) => n + 1);
  };

  const refazerAcao = () => {
    const proximo = futuroRef.current.pop();
    if (!proximo) return;
    historicoRef.current.push(snapshot(pagina, selecionadoId));
    aplicarSnapshot(proximo);
    setHistoricoTick((n) => n + 1);
  };

  const removerSelecionado = (id) => {
    registrarHistorico();
    gravar(removerBloco(pagina.blocos, id), ALVO_PAGINA);
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
    onChange({ ...pagina, blocos: substituirBloco(pagina.blocos, proximo) });
  };

  const abrirPropriedades = (id) => {
    setSelecionadoId(id);
    setAba("conteudo");
    setPainelModo("propriedades");
    setPainelAberto(true);
    setMenuMais(false);
  };

  const adicionarPeca = (tipo) => {
    const novo = blocoPadrao(tipo);
    const destino = destinoDaInsercao(pagina.blocos, ehAlvoEspecial(selecionadoId) ? null : alvoId, tipo);
    registrarHistorico();
    gravar(inserirPorDestino(pagina.blocos, novo, destino), novo.id);
    abrirPropriedades(novo.id);
  };

  const inserirEm = (tipo, destino) => {
    const novo = blocoPadrao(tipo);
    registrarHistorico();
    gravar(inserirPorDestino(pagina.blocos, novo, destino), novo.id);
    abrirPropriedades(novo.id);
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
        abrirPropriedades(novo.id);
        return;
      }
      if (extra?.containerId && dados.tipo !== "secao") {
        gravar(inserirPorDestino(pagina.blocos, novo, { modo: "dentro", containerId: extra.containerId }), novo.id);
        abrirPropriedades(novo.id);
        return;
      }
      if (destinoId) {
        gravar(inserirPorDestino(pagina.blocos, novo, { modo: "lado", destinoId, posicao }), novo.id);
        abrirPropriedades(novo.id);
        return;
      }
      gravar(inserirPorDestino(pagina.blocos, novo, destinoDaInsercao(pagina.blocos, selecionadoId, dados.tipo)), novo.id);
      abrirPropriedades(novo.id);
    }
  };

  const selecionar = (id) => {
    abrirPropriedades(id);
  };

  const moverPainel = (lado) => {
    if (painelAberto && painelLado === lado) {
      setPainelAberto(false);
      return;
    }
    setPainelLado(lado);
    setPainelAberto(true);
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
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "z" && !evento.shiftKey) {
        if (digitando) return;
        if (!historicoRef.current.length) return;
        evento.preventDefault();
        desfazerAcao();
        return;
      }
      if ((evento.ctrlKey || evento.metaKey) && (evento.key.toLowerCase() === "y" || (evento.key.toLowerCase() === "z" && evento.shiftKey))) {
        if (digitando) return;
        if (!futuroRef.current.length) return;
        evento.preventDefault();
        refazerAcao();
        return;
      }
      if (digitando) return;
      if (evento.key === "Escape") {
        if (seletorCorAberto()) return;
        if (menuMais) {
          setMenuMais(false);
          return;
        }
        if (painelAberto) {
          setPainelAberto(false);
          return;
        }
        setSelecionadoId(ALVO_PAGINA);
        return;
      }
      if ((evento.key === "Delete" || evento.key === "Backspace") && selecionadoId && !ehAlvoEspecial(selecionadoId)) {
        evento.preventDefault();
        if (parteId && bloco) removerParte(bloco.id, parteId);
        else if (alvo?.kind === "bloco") removerSelecionado(alvo.bloco.id);
      }
    };
    window.addEventListener("keydown", atalho);
    return () => window.removeEventListener("keydown", atalho);
  });

  const rotuloPainel = painelModo === "pecas"
    ? "Adicionar"
    : painelModo === "arvore"
      ? "Elementos"
      : selecionadoId === ALVO_FUNDO
        ? "Fundo"
        : selecionadoId === ALVO_PAGINA
          ? "Página"
          : parte?.nome || (bloco ? nomeDoTipo(bloco.tipo) : alvo?.kind === "celula" ? "Coluna" : "Página");

  const mostrarAbas = painelModo === "propriedades" && selecionadoId !== ALVO_FUNDO;

  return (
    <div className="relative h-dvh max-h-dvh overflow-hidden bg-[#111]">
      <section
        className="h-full min-h-0 overflow-y-auto"
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
        )}
      </section>

      <div className="editor-ui editor-barra">
        <BotaoBarra titulo="Adicionar" ativo={painelModo === "pecas" && painelAberto} onClick={() => {
          setPainelModo("pecas");
          setPainelAberto(true);
          setMenuMais(false);
        }}>
          <Plus size={16} />
        </BotaoBarra>
        <BotaoBarra titulo="Desfazer" disabled={!podeDesfazer} onClick={desfazerAcao}>
          <Undo2 size={15} />
        </BotaoBarra>
        <BotaoBarra titulo="Refazer" disabled={!podeRefazer} onClick={refazerAcao}>
          <Redo2 size={15} />
        </BotaoBarra>
        <BotaoBarra
          titulo={visao === "celular" ? "Ver desktop" : "Ver celular"}
          ativo={visao === "celular"}
          onClick={() => setVisao((atual) => (atual === "celular" ? "desktop" : "celular"))}
        >
          {visao === "celular" ? <Monitor size={15} /> : <Smartphone size={15} />}
        </BotaoBarra>
        <div className="editor-acoes">{acoes}</div>
        <div className="editor-barra-mais">
          <BotaoBarra titulo="Mais ações" ativo={menuMais} onClick={() => setMenuMais((atual) => !atual)}>
            <Menu size={15} />
          </BotaoBarra>
          {menuMais && (
            <div className="editor-barra-menu">
              <Link to={voltarPara} onClick={() => setMenuMais(false)}>{voltarLabel}</Link>
              {onTrocarModelo && (
                <button type="button" onClick={() => { setMenuMais(false); onTrocarModelo(); }}>
                  Trocar modelo
                </button>
              )}
              <button type="button" onClick={() => { setMenuMais(false); abrirPropriedades(ALVO_PAGINA); }}>
                Página
              </button>
              <button type="button" onClick={() => { setMenuMais(false); abrirPropriedades(ALVO_FUNDO); }}>
                Fundo
              </button>
            </div>
          )}
        </div>
      </div>

      {painelAberto && (
        <aside className="editor-ui editor-painel" data-lado={painelLado} data-editor-chrome>
          <div className="editor-painel-topo">
            {mostrarAbas ? (
              <div className="editor-painel-abas">
                <button
                  type="button"
                  className="editor-painel-aba"
                  data-ativa={aba === "conteudo" ? "true" : undefined}
                  onClick={() => setAba("conteudo")}
                >
                  {rotuloPainel}
                </button>
                <button
                  type="button"
                  className="editor-painel-aba"
                  data-ativa={aba === "aparencia" ? "true" : undefined}
                  onClick={() => setAba("aparencia")}
                >
                  Aparência
                </button>
              </div>
            ) : (
              <p className="min-w-0 flex-1 truncate px-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c8c8c8]">
                {rotuloPainel}
              </p>
            )}
            <button
              type="button"
              className="editor-barra-btn"
              title="Fechar"
              aria-label="Fechar painel"
              onClick={() => setPainelAberto(false)}
            >
              <X size={15} />
            </button>
          </div>

          {painelModo === "propriedades" && migalhas.length > 0 && (
            <p className="flex flex-wrap items-center gap-1 px-3 pt-2 text-[11px] text-[#9b9b9b]">
              <button type="button" className="hover:text-white" onClick={() => abrirPropriedades(ALVO_PAGINA)}>Página</button>
              {migalhas.map((item) => (
                <span key={item.id} className="flex items-center gap-1">
                  <span>›</span>
                  <button type="button" className="hover:text-white" onClick={() => abrirPropriedades(item.id)}>{item.nome}</button>
                </span>
              ))}
              {parte && (
                <span className="flex items-center gap-1">
                  <span>›</span>
                  <span className="font-medium text-white">{parte.nome}</span>
                </span>
              )}
            </p>
          )}

          <div className="editor-painel-corpo">
            {painelModo === "pecas" && (
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9b9b9b]">Estrutura</p>
                {TIPOS_ESTRUTURA.map((tipo) => (
                  <button
                    key={tipo.tipo}
                    type="button"
                    draggable
                    className="editor-peca"
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
                    <span className="editor-peca-icone">
                      {tipo.icone ? <IconeLucide nome={tipo.icone} size={14} /> : <Plus size={14} />}
                    </span>
                    <span>
                      <strong className="block text-sm">{tipo.nome}</strong>
                      <span className="block text-[11px] text-[#9b9b9b]">{tipo.descricao}</span>
                    </span>
                  </button>
                ))}
                <p className="pt-2 text-[11px] uppercase tracking-[0.16em] text-[#9b9b9b]">Peças</p>
                {TIPOS_PECA.map((tipo) => {
                  const liberada = planoPermite(plano, tipo.plano);
                  return (
                    <button
                      key={tipo.tipo}
                      type="button"
                      draggable={liberada}
                      className="editor-peca"
                      data-travada={liberada ? undefined : "true"}
                      title={liberada ? undefined : `Disponível no plano ${ROTULO_PLANO[tipo.plano]}`}
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
                      onClick={() => (liberada ? adicionarPeca(tipo.tipo) : navegar("/precos"))}
                    >
                      <span className="editor-peca-icone">
                        {tipo.icone ? <IconeLucide nome={tipo.icone} size={14} /> : <Plus size={14} />}
                      </span>
                      <span>
                        <strong className="block text-sm">
                          {tipo.nome}
                          {!liberada && <span className="editor-peca-selo">{ROTULO_PLANO[tipo.plano]}</span>}
                        </strong>
                        <span className="block text-[11px] text-[#9b9b9b]">{tipo.descricao}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {painelModo === "arvore" && (
              <div className="editor-arvore space-y-2">
                <button
                  type="button"
                  className={`flex w-full items-center rounded-lg px-2 py-1.5 text-left text-xs ${
                    selecionadoId === ALVO_FUNDO ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper"
                  }`}
                  onClick={() => abrirPropriedades(ALVO_FUNDO)}
                >
                  Fundo
                </button>
                <button
                  type="button"
                  className={`flex w-full items-center rounded-lg px-2 py-1.5 text-left text-xs ${
                    selecionadoId === ALVO_PAGINA ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper"
                  }`}
                  onClick={() => abrirPropriedades(ALVO_PAGINA)}
                >
                  Página
                </button>
                {arvore.length ? (
                  <ArvorePagina nos={arvore} selecionadoId={alvoId} onSelect={abrirPropriedades} />
                ) : (
                  <p className="text-xs text-[#9b9b9b]">Ainda vazia. Use + para começar.</p>
                )}
              </div>
            )}

            {painelModo === "propriedades" && selecionadoId === ALVO_FUNDO && (
              <ThemeInspector
                escopo="fundo"
                tema={pagina.tema}
                onChange={(tema) => onChange({ ...pagina, tema })}
                onEscolherImagem={onEscolherImagem}
              />
            )}

            {painelModo === "propriedades" && selecionadoId === ALVO_PAGINA && (
              <ThemeInspector
                escopo="pagina"
                tema={pagina.tema}
                titulo={pagina.titulo}
                onTitulo={(titulo) => onChange({ ...pagina, titulo })}
                onChange={(tema) => onChange({ ...pagina, tema })}
                onEscolherImagem={onEscolherImagem}
                extras={ajustesPagina}
              />
            )}

            {painelModo === "propriedades" && !ehAlvoEspecial(selecionadoId) && (
              <Inspector
                aba={aba}
                bloco={bloco}
                celula={alvo?.kind === "celula" ? alvo : null}
                parteId={parteId}
                onSelecionarParte={(id) => abrirPropriedades(id)}
                onChange={atualizarBloco}
                onAdicionarPeca={adicionarPeca}
                onEscolherImagem={onEscolherImagem}
                tema={pagina.tema}
              />
            )}
          </div>

          <div className="editor-painel-base">
            <button
              type="button"
              title="Elementos"
              data-ativo={painelModo === "arvore" ? "true" : undefined}
              onClick={() => setPainelModo((atual) => (atual === "arvore" ? "propriedades" : "arvore"))}
            >
              <Layers size={15} />
            </button>
            <button type="button" title="Painel à esquerda" data-ativo={painelLado === "esquerda" ? "true" : undefined} onClick={() => moverPainel("esquerda")}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" title="Painel à direita" data-ativo={painelLado === "direita" ? "true" : undefined} onClick={() => moverPainel("direita")}>
              <ChevronRight size={16} />
            </button>
            <button type="button" className="editor-pronto" onClick={() => setPainelAberto(false)}>
              Pronto
            </button>
          </div>
        </aside>
      )}

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
