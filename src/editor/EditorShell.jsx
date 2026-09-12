import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Monitor, Plus, Smartphone } from "lucide-react";
import { Pills } from "./ajustesUI";
import { PageRenderer } from "./PageRenderer";
import { Inspector, ThemeInspector } from "./Inspector";
import { GuiaEditor } from "./GuiaEditor";
import { Tooltip } from "./Tooltip";
import { IconeLucide } from "./icones";
import { TIPOS_ESTRUTURA, TIPOS_PECA, blocoPadrao, ehTipoEstrutura } from "./templates";
import {
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
}) {
  const [selecionadoId, setSelecionadoId] = useState(pagina.blocos[0]?.id || null);
  const [aba, setAba] = useState("bloco");
  const [paleta, setPaleta] = useState("estrutura");
  const [visao, setVisao] = useState("desktop");
  const [arrasto, setArrasto] = useState(null);
  const [guiaAberta, setGuiaAberta] = useState(() => window.localStorage.getItem("single.guia-editor") !== "oculto");
  const historicoRef = useRef([]);

  const { blocoId: alvoId, parteId } = separarAlvo(selecionadoId);
  const alvo = useMemo(() => contextoDoAlvo(pagina.blocos, alvoId), [pagina.blocos, alvoId]);
  const bloco = alvo?.kind === "bloco" ? alvo.bloco : null;
  const parte = parteDoBloco(bloco, parteId);
  const arvore = useMemo(() => listarArvore(pagina.blocos), [pagina.blocos]);
  const migalhas = useMemo(() => caminhoDoAlvo(pagina.blocos, alvoId), [pagina.blocos, alvoId]);
  const tiposPaleta = paleta === "estrutura" ? TIPOS_ESTRUTURA : TIPOS_PECA;
  const dicaDestino = rotuloDestino(pagina.blocos, alvoId, paleta === "estrutura" ? "grade" : "texto");
  const passoAtivo = !selecionadoId ? 1 : parteId ? 3 : 2;
  const celular = visao === "celular";

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
  };

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

  return (
    <div className="grid min-h-screen grid-rows-[auto_auto_minmax(0,1fr)] bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-2/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to={voltarPara} className="text-sm text-muted">{voltarLabel}</Link>
          <input
            className="rounded-lg border border-line px-2 py-1 text-sm"
            value={pagina.titulo}
            onChange={(e) => onChange({ ...pagina, titulo: e.target.value })}
            aria-label="Título da página"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pills
            valor={visao}
            onChange={setVisao}
            className="min-w-[13rem]"
            opcoes={[
              { id: "desktop", nome: "Desktop", icone: <Monitor size={14} /> },
              { id: "celular", nome: "Celular", icone: <Smartphone size={14} /> },
            ]}
          />
          {onTrocarModelo && (
            <button type="button" className="rounded-full border border-line px-4 py-2 text-sm" onClick={onTrocarModelo}>
              Trocar modelo
            </button>
          )}
          {acoes}
        </div>
      </header>

      {guiaAberta && (
        <GuiaEditor
          passoAtivo={passoAtivo}
          onFechar={() => {
            window.localStorage.setItem("single.guia-editor", "oculto");
            setGuiaAberta(false);
          }}
        />
      )}

      <div className="grid h-full min-h-0 lg:grid-cols-[16.5rem_minmax(0,1fr)_20rem]">
        <aside className="overflow-auto border-r border-line p-4">
          <Pills
            valor={paleta}
            onChange={setPaleta}
            opcoes={[
              { id: "estrutura", nome: "Estrutura" },
              { id: "pecas", nome: "Peças" },
            ]}
          />
          <Tooltip
            passo="1"
            titulo="Adicionar"
            texto="Clique para colocar no fim do que está selecionado, ou arraste até o lugar exato. Na página, o + entre os blocos faz o mesmo."
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
                className="flex min-h-11 w-full cursor-grab items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm hover:bg-paper-2 active:cursor-grabbing"
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
                <span>
                  <strong className="block">{tipo.nome}</strong>
                  <span className="text-xs text-muted">{tipo.descricao}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-1 text-xs uppercase tracking-[0.16em] text-muted">Nesta página</p>
            <p className="mb-2 text-[11px] leading-4 text-muted">Clique num item para rolar até ele.</p>
            {arvore.length ? (
              <ArvorePagina nos={arvore} selecionadoId={alvoId} onSelect={selecionar} />
            ) : (
              <p className="text-xs text-muted">Ainda vazia. Comece por uma seção.</p>
            )}
          </div>
        </aside>

        <section
          className="flex min-h-full flex-col overflow-auto bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:18px_18px] p-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!arrasto && !lerArrasto(e).kind) return;
            if (!pagina.blocos.length) soltarNoCanvas(null, "depois");
          }}
        >
          <Tooltip passo="2" titulo="Clique no que quer mudar" texto="Passe o mouse para ver o nome de cada parte. Entre dois blocos aparece um + para adicionar ali." lado="baixo">
            <p className="mb-3 text-center text-xs text-muted">
              {celular
                ? "Visual do celular — clique para editar"
                : "Clique no texto, na foto ou no botão. Entre os blocos aparece um + para adicionar"}
            </p>
          </Tooltip>

          {celular ? (
            <div className="relative mx-auto w-[360px]">
              <div className="rounded-[2.4rem] p-[10px] ring-1 ring-black/10" style={cssFundo(pagina.tema || {})}>
                <div className="preview-celular h-[680px] overflow-auto rounded-[1.9rem]" style={cssFundo(pagina.tema || {})}>
                  <PageRenderer
                    pagina={pagina}
                    selecionadoId={selecionadoId}
                    onSelect={selecionar}
                    onEscolherImagem={onEscolherImagem}
                    onRemover={removerSelecionado}
                    onRemoverParte={removerParte}
                    onInserir={inserirEm}
                    onAtualizar={atualizarBloco}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col">
              <div className="flex min-h-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-line">
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
                />
              </div>
            </div>
          )}
        </section>

        <aside className="overflow-auto border-l border-line p-4">
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
            <ThemeInspector tema={pagina.tema} onChange={(tema) => onChange({ ...pagina, tema })} onEscolherImagem={onEscolherImagem} />
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
    </div>
  );
}
