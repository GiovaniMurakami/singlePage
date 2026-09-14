import { useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { DEGRADES_PRONTOS, modoFundo } from "./fundo";
import { ALIGN_BLOCO, JUSTIFY_BLOCO, OBJECT_FIT, RAIOS_BLOCO } from "./aparencia";
import { DicaAtributo, DicaCaixa, metaAtributo } from "./dicasLayout";

export const inputClass = "w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent";

const memoriaFacetas = new Map();

/**
 * Navegação por intenção: mostra uma fatia de ajustes por vez.
 * Evita o “tudo aberto” que mistura fundo, tipografia, layout e espaço.
 */
export function PainelFacetas({ id, facetas, padrao, children }) {
  const lista = facetas.filter(Boolean);
  const inicial = () => {
    const guardado = id ? memoriaFacetas.get(id) : null;
    if (guardado && lista.some((item) => item.id === guardado)) return guardado;
    if (padrao && lista.some((item) => item.id === padrao)) return padrao;
    return lista[0]?.id || "";
  };
  const [ativa, setAtiva] = useState(inicial);
  const atual = lista.some((item) => item.id === ativa) ? ativa : lista[0]?.id;
  const meta = lista.find((item) => item.id === atual);

  const escolher = (idFaceta) => {
    setAtiva(idFaceta);
    if (id) memoriaFacetas.set(id, idFaceta);
  };

  if (!lista.length) return null;

  return (
    <div className="space-y-3">
      <div className="editor-facetas" role="tablist" aria-label="Tipo de ajuste">
        {lista.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={atual === item.id}
            data-ativa={atual === item.id ? "true" : undefined}
            className="editor-faceta"
            title={item.dica}
            onClick={() => escolher(item.id)}
          >
            {item.nome}
          </button>
        ))}
      </div>
      {meta?.dica ? (
        <p className="editor-guia-faceta">{meta.dica}</p>
      ) : null}
      <div className="editor-faceta-corpo" role="tabpanel">
        {typeof children === "function" ? children(atual) : children}
      </div>
    </div>
  );
}

/** Bloco de conteúdo de uma faceta — fundo claro, tipografia estável. */
export function CorpoFaceta({ children, className = "" }) {
  return (
    <div className={`space-y-3 rounded-2xl border border-line bg-paper-2 px-3 py-3 text-ink ${className}`}>
      {children}
    </div>
  );
}

export function Pills({ valor, opcoes, onChange, className = "", wrap = false }) {
  return (
    <div className={`${wrap ? "flex flex-wrap gap-1" : "flex rounded-full bg-paper p-1 ring-1 ring-line"} ${className}`}>
      {opcoes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs ${
            wrap ? "border border-line" : "flex-1"
          } ${valor === item.id ? "bg-ink text-paper" : "ui-dica"}`}
          onClick={(evento) => {
            evento.preventDefault();
            evento.stopPropagation();
            onChange(item.id);
          }}
        >
          {item.icone}
          {item.nome}
        </button>
      ))}
    </div>
  );
}

export function Campo({ label, dica, desenho, children }) {
  return (
    <div className="block space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1">
          <span className="ui-dica block text-xs uppercase tracking-[0.16em]">{label}</span>
          {dica ? <span className="ui-dica mt-0.5 block text-[11px] leading-4">{dica}</span> : null}
        </span>
        {desenho ? <span className="shrink-0">{desenho}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function CampoComDica({ tipo, valor, children }) {
  const meta = metaAtributo(tipo, valor);
  return (
    <Campo label={meta.label} dica={meta.dica} desenho={<DicaAtributo tipo={tipo} valor={valor} />}>
      {children}
    </Campo>
  );
}

/** Cabeçalho do que está sendo editado, com caminho de volta. */
export function CabecalhoAjuste({ titulo, dica, voltarPara, onVoltar }) {
  return (
    <div className="mb-3 rounded-2xl bg-paper px-3 py-2.5">
      {voltarPara && onVoltar && (
        <button type="button" className="ui-dica mb-1 flex items-center gap-1 text-[11px] hover:text-ink" onClick={onVoltar}>
          <ChevronLeft size={12} />
          {voltarPara}
        </button>
      )}
      <p className="text-sm font-medium text-ink">{titulo}</p>
      {dica ? <p className="ui-dica mt-0.5 text-[11px] leading-4">{dica}</p> : null}
    </div>
  );
}

/** Atalhos para as partes internas do bloco (foto, título, botão…). */
export function ListaPartes({ partes, parteAtiva, onEscolher }) {
  if (!partes?.length) return null;
  return (
    <div className="mb-3 space-y-1.5">
      <p className="ui-dica text-[11px] leading-4">
        Clique na página ou escolha aqui o que quer mudar:
      </p>
      <div className="flex flex-wrap gap-1">
        {partes.map((parte) => (
          <button
            key={parte.id}
            type="button"
            title={parte.dica}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              parteAtiva === parte.id ? "border-ink bg-ink text-paper" : "border-line hover:bg-paper-2"
            }`}
            onClick={() => onEscolher(parte.id)}
          >
            {parte.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CartaoAjuste({ titulo, resumo, abertoPadrao = true, aberto: abertoExterno, onAberto, children }) {
  const [abertoLocal, setAbertoLocal] = useState(abertoPadrao);
  const controlado = abertoExterno !== undefined;
  const aberto = controlado ? abertoExterno : abertoLocal;
  const setAberto = (proximo) => {
    const valor = typeof proximo === "function" ? proximo(aberto) : proximo;
    if (!controlado) setAbertoLocal(valor);
    onAberto?.(valor);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-2 text-ink">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
        onClick={() => setAberto((atual) => !atual)}
      >
        <span className="min-w-0">
          <strong className="block truncate text-sm text-ink">{titulo}</strong>
          {resumo ? <span className="ui-dica block truncate text-xs">{resumo}</span> : null}
        </span>
        <ChevronDown size={16} className={`ui-dica shrink-0 transition ${aberto ? "rotate-180" : ""}`} />
      </button>
      {aberto && <div className="space-y-3 border-t border-line px-3 py-3 text-ink">{children}</div>}
    </div>
  );
}

export function CampoCor({ label, value, fallback, onChange }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs uppercase tracking-[0.16em] text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-10 w-full"
          value={value || fallback}
          onPointerDown={(evento) => evento.stopPropagation()}
          onClick={(evento) => evento.stopPropagation()}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <button type="button" className="shrink-0 text-xs text-muted hover:text-ink" onClick={() => onChange("")}>
            Tema
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function CampoArquivo({ label, previewUrl, onArquivo }) {
  const [enviando, setEnviando] = useState(false);
  if (!onArquivo) return null;
  return (
    <div className="space-y-1.5">
      <span className="text-xs uppercase tracking-[0.16em] text-muted">{label}</span>
      {previewUrl ? (
        <img src={previewUrl} alt="" className="h-28 w-full rounded-xl object-cover ring-1 ring-line" />
      ) : null}
      <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-line bg-paper px-3 text-sm transition hover:bg-paper-2">
        {enviando ? "Enviando…" : previewUrl ? "Trocar imagem" : "Enviar do computador"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          disabled={enviando}
          onChange={async (evento) => {
            const file = evento.target.files?.[0];
            evento.target.value = "";
            if (!file) return;
            setEnviando(true);
            try {
              await onArquivo(file);
            } finally {
              setEnviando(false);
            }
          }}
        />
      </label>
    </div>
  );
}

export function CamposEspaco({ props, onChange }) {
  const [zona, setZona] = useState("conteudo");
  const slider = (tipo, chave, min, max, vazio) => {
    const atual = props[chave] === "" || props[chave] == null ? vazio : props[chave];
    return (
      <CampoComDica tipo={tipo} valor={atual}>
        <div
          className="flex items-center gap-2"
          onPointerEnter={() => setZona(chave)}
          onFocusCapture={() => setZona(chave)}
        >
          <input
            type="range"
            min={min}
            max={max}
            value={atual}
            onChange={(e) => onChange({ [chave]: Number(e.target.value) })}
            className="w-full"
          />
          <span className="w-10 text-right text-xs text-muted">{props[chave] === "" || props[chave] == null ? "auto" : `${props[chave]}`}</span>
        </div>
      </CampoComDica>
    );
  };
  return (
    <div className="space-y-3">
      <DicaCaixa zona={zona} props={props} />
      <p className="ui-dica text-[11px] leading-4">
        Laranja é margem: empurra o que está fora. Azul é padding: abre folga por dentro.
      </p>
      {slider("margemCima", "margemCima", 0, 96, 0)}
      {slider("margemBaixo", "margemBaixo", 0, 96, 0)}
      {slider("paddingCima", "paddingCima", 0, 80, 24)}
      {slider("paddingBaixo", "paddingBaixo", 0, 80, 24)}
      {slider("paddingLados", "paddingLados", 0, 64, 20)}
      <button
        type="button"
        className="text-xs text-muted hover:text-ink"
        onClick={() => onChange({
          margemCima: "",
          margemBaixo: "",
          paddingCima: "",
          paddingBaixo: "",
          paddingLados: "",
        })}
      >
        Voltar ao espaço padrão
      </button>
    </div>
  );
}

const ORGANIZACOES = [
  { id: "", nome: "Modelo" },
  { id: "block", nome: "Pilha" },
  { id: "flex", nome: "Fileira" },
  { id: "grid", nome: "Grade" },
];

const DIRECOES = [
  { id: "row", nome: "Lado a lado" },
  { id: "column", nome: "Empilhado" },
];

function definidoNumero(valor) {
  return valor !== "" && valor != null;
}

/** Só a organização das peças — sem cantos, altura ou mídia. */
export function CamposArranjo({ props, onChange, escopo = "bloco" }) {
  const display = props.display || "";
  const usaFlex = display === "flex" || (!display && (props.justify || props.align || props.flexDirecao));
  const usaGrade = display === "grid";
  const mostraOrganizacao = escopo === "bloco" || display || props.justify || props.align || props.flexDirecao;
  const mostraPosicao = escopo === "parte" || props.alignSelf;

  const limparOrganizacao = {
    flexDirecao: "",
    flexQuebra: "",
    justify: "",
    align: "",
    gap: "",
    colunasGrade: "",
  };

  return (
    <div className="space-y-3">
      {mostraOrganizacao && (
        <CampoComDica tipo="display" valor={display}>
          <Pills
            wrap
            valor={display}
            opcoes={ORGANIZACOES}
            onChange={(valor) => onChange({
              display: valor,
              ...(valor === "flex" ? {
                ...limparOrganizacao,
                flexDirecao: props.flexDirecao || "row",
                flexQuebra: props.flexQuebra || "wrap",
                justify: props.justify || "center",
                align: props.align || "center",
                gap: definidoNumero(props.gap) ? props.gap : 16,
              } : {}),
              ...(valor === "grid" ? {
                ...limparOrganizacao,
                colunasGrade: props.colunasGrade || 2,
                justify: props.justify || "center",
                align: props.align || "center",
                gap: definidoNumero(props.gap) ? props.gap : 16,
              } : {}),
              ...(valor === "" || valor === "block" ? limparOrganizacao : {}),
            })}
          />
        </CampoComDica>
      )}

      {usaFlex && (
        <>
          <CampoComDica tipo="flexDirecao" valor={props.flexDirecao || "row"}>
            <Pills wrap valor={props.flexDirecao || "row"} opcoes={DIRECOES} onChange={(flexDirecao) => onChange({ flexDirecao })} />
          </CampoComDica>
          <CampoComDica tipo="flexQuebra" valor={props.flexQuebra || "wrap"}>
            <Pills
              valor={props.flexQuebra || "wrap"}
              opcoes={[{ id: "wrap", nome: "Desce" }, { id: "nowrap", nome: "Aperta" }]}
              onChange={(flexQuebra) => onChange({ flexQuebra })}
            />
          </CampoComDica>
        </>
      )}

      {usaGrade && (
        <CampoComDica tipo="colunasGrade" valor={props.colunasGrade || 2}>
          <Pills
            valor={String(props.colunasGrade || 2)}
            opcoes={[{ id: "1", nome: "1" }, { id: "2", nome: "2" }, { id: "3", nome: "3" }, { id: "4", nome: "4" }]}
            onChange={(valor) => onChange({ colunasGrade: Number(valor) })}
          />
        </CampoComDica>
      )}

      {(usaFlex || usaGrade) && (
        <>
          <CampoComDica tipo="justify" valor={props.justify || "center"}>
            <Pills
              wrap
              valor={props.justify || "center"}
              opcoes={JUSTIFY_BLOCO}
              onChange={(justify) => onChange({ justify })}
            />
          </CampoComDica>
          <CampoComDica tipo="align" valor={props.align || "center"}>
            <Pills
              wrap
              valor={props.align || "center"}
              opcoes={ALIGN_BLOCO}
              onChange={(align) => onChange({ align })}
            />
          </CampoComDica>
          <CampoComDica tipo="gap" valor={props.gap ?? 16}>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="64" value={props.gap ?? 16} onChange={(e) => onChange({ gap: Number(e.target.value) })} className="w-full" />
              <span className="w-10 text-right text-xs text-muted">{props.gap ?? 16}</span>
            </div>
          </CampoComDica>
        </>
      )}

      {mostraPosicao && (
        <CampoComDica tipo="alignSelf" valor={props.alignSelf || ""}>
          <Pills
            wrap
            valor={props.alignSelf || ""}
            opcoes={[{ id: "", nome: "Junto" }, ...ALIGN_BLOCO]}
            onChange={(alignSelf) => onChange({ alignSelf })}
          />
        </CampoComDica>
      )}

      {!mostraOrganizacao && !mostraPosicao ? (
        <p className="ui-dica text-[11px] leading-4">
          Neste item não há peças internas para rearranjar. Use Forma ou Espaço.
        </p>
      ) : null}

      {(mostraOrganizacao || mostraPosicao) && (
        <button
          type="button"
          className="text-xs text-muted hover:text-ink"
          onClick={() => onChange({
            display: "",
            flexDirecao: "",
            flexQuebra: "",
            justify: "",
            align: "",
            alignSelf: "",
            gap: "",
            colunasGrade: "",
          })}
        >
          Voltar ao arranjo padrão
        </button>
      )}
    </div>
  );
}

/** Cantos, altura mínima e encaixe de mídia — a “caixa”, não a organização. */
export function CamposForma({ props, onChange, midia = false }) {
  return (
    <div className="space-y-3">
      <CampoComDica tipo="raio" valor={props.raio}>
        <Pills
          wrap
          valor={props.raio === "" || props.raio == null ? "" : String(props.raio)}
          opcoes={RAIOS_BLOCO}
          onChange={(valor) => onChange({ raio: valor === "" ? "" : Number(valor) })}
        />
        <input
          type="range"
          min="0"
          max="48"
          value={props.raio === "" || props.raio == null ? 16 : Math.min(48, Number(props.raio))}
          onChange={(e) => onChange({ raio: Number(e.target.value) })}
          className="mt-2 w-full"
        />
      </CampoComDica>

      <CampoComDica tipo="minAltura" valor={props.minAltura}>
        <div className="flex items-center gap-2">
          <input type="range" min="0" max="720" value={props.minAltura === "" || props.minAltura == null ? 0 : props.minAltura} onChange={(e) => onChange({ minAltura: Number(e.target.value) })} className="w-full" />
          <span className="w-12 text-right text-xs text-muted">{props.minAltura === "" || props.minAltura == null ? "auto" : `${props.minAltura}`}</span>
        </div>
      </CampoComDica>

      {midia && (
        <>
          <CampoComDica tipo="itemLargura" valor={props.itemLargura}>
            <div className="flex items-center gap-2">
              <input type="range" min="80" max="720" value={props.itemLargura === "" || props.itemLargura == null ? 720 : props.itemLargura} onChange={(e) => onChange({ itemLargura: Number(e.target.value) })} className="w-full" />
              <span className="w-12 text-right text-xs text-muted">{props.itemLargura === "" || props.itemLargura == null ? "auto" : `${props.itemLargura}`}</span>
            </div>
          </CampoComDica>
          <CampoComDica tipo="objectFit" valor={props.objectFit || "cover"}>
            <Pills valor={props.objectFit || "cover"} opcoes={OBJECT_FIT} onChange={(objectFit) => onChange({ objectFit })} />
          </CampoComDica>
        </>
      )}

      <button
        type="button"
        className="text-xs text-muted hover:text-ink"
        onClick={() => onChange({
          raio: "",
          minAltura: "",
          ...(midia ? { itemLargura: "", objectFit: "" } : {}),
        })}
      >
        Voltar à forma padrão
      </button>
    </div>
  );
}

/** Compat: arranjo + forma juntos (preferir as facetas). */
export function CamposLayout({ props, onChange, midia = false, escopo = "bloco" }) {
  return (
    <div className="space-y-4">
      <CamposArranjo props={props} onChange={onChange} escopo={escopo} />
      <div className="border-t border-line pt-3">
        <CamposForma props={props} onChange={onChange} midia={midia} />
      </div>
    </div>
  );
}

/** Fundo, arranjo, forma e espaço do item — um grupo por vez. */
export function CartoesCaixa({ idAcordeao, fonte = {}, onChange, layout = {}, onArquivo, fallbackCor = "#ffffff", tipografia = null }) {
  const facetas = [
    tipografia ? { id: "texto", nome: "Texto", dica: "Fonte, peso e alinhamento só deste item." } : null,
    { id: "visual", nome: "Visual", dica: "Cor, degradê ou imagem atrás deste item." },
    { id: "arranjo", nome: "Posição", dica: "Onde este item se encaixa em relação aos vizinhos." },
    { id: "forma", nome: "Forma", dica: layout.resumo || "Cantos, altura e encaixe só do que você clicou." },
    { id: "espaco", nome: "Espaço", dica: "Margem empurra o que está fora · padding abre folga por dentro." },
  ];

  return (
    <PainelFacetas key={idAcordeao || "caixa"} id={idAcordeao || "caixa"} facetas={facetas} padrao={tipografia ? "texto" : "forma"}>
      {(faceta) => (
        <CorpoFaceta>
          {faceta === "texto" && tipografia}
          {faceta === "visual" && (
            <CampoFundo fonte={fonte} fallbackCor={fallbackCor} onChange={onChange} onArquivo={onArquivo} />
          )}
          {faceta === "arranjo" && (
            <CamposArranjo props={fonte} onChange={onChange} escopo="parte" />
          )}
          {faceta === "forma" && (
            <CamposForma props={fonte} onChange={onChange} midia={layout.midia} />
          )}
          {faceta === "espaco" && (
            <CamposEspaco props={fonte} onChange={onChange} />
          )}
        </CorpoFaceta>
      )}
    </PainelFacetas>
  );
}

/** Quais campos de layout fazem sentido para cada tipo de bloco. */
export function perfilLayout(tipo) {
  switch (tipo) {
    case "imagem":
    case "galeria":
      return { midia: true, titulo: "Organizar e encaixar a foto", resumo: "Como as fotos se arrumam nesta seção" };
    case "cartoes":
    case "depoimentos":
      return { midia: true, titulo: "Organizar o conteúdo", resumo: "Como os cards se encaixam" };
    default:
      return { midia: false, titulo: "Organizar o conteúdo", resumo: "Como as peças desta seção se encaixam" };
  }
}

export function CampoFundo({ fonte, corKey = "corFundo", fallbackCor = "#ffffff", onChange, onArquivo }) {
  const modo = modoFundo(fonte);
  const cor = fonte[corKey] || fallbackCor;
  const setModo = (fundoModo) => {
    if (fundoModo === "transparente") {
      onChange({
        fundoModo: "transparente",
        [corKey]: "transparent",
        ...(corKey === "corFundo" ? {} : { fundo: "transparent" }),
      });
      return;
    }
    onChange({ fundoModo });
  };

  return (
    <div className="space-y-3">
      <Pills
        valor={modo === "transparente" ? "transparente" : modo}
        wrap
        opcoes={[
          { id: "solido", nome: "Cor" },
          { id: "degrade", nome: "Degradê" },
          { id: "imagem", nome: "Imagem" },
          { id: "transparente", nome: "Transparente" },
        ]}
        onChange={setModo}
      />

      {modo === "transparente" && (
        <p className="ui-dica text-[11px] leading-4">Sem cor de fundo — o conteúdo fica sobre o que estiver atrás.</p>
      )}

      {modo === "solido" && (
        <CampoCor label="Cor" value={fonte[corKey] === "transparent" ? "" : fonte[corKey]} fallback={fallbackCor} onChange={(valor) => onChange({ [corKey]: valor, fundoModo: "solido" })} />
      )}

      {modo === "degrade" && (
        <>
          <div className="grid grid-cols-3 gap-1">
            {DEGRADES_PRONTOS.map((item) => (
              <button
                key={item.nome}
                type="button"
                title={item.nome}
                className="h-9 rounded-lg ring-1 ring-line"
                style={{
                  background: item.tipo === "radial"
                    ? `radial-gradient(circle at 50% 0%, ${item.de}, ${item.para})`
                    : `linear-gradient(${item.angulo}deg, ${item.de}, ${item.para})`,
                }}
                onClick={() => onChange({
                  fundoModo: "degrade",
                  fundoDe: item.de,
                  fundoPara: item.para,
                  fundoAngulo: item.angulo,
                  fundoDegradeTipo: item.tipo,
                })}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CampoCor label="De" value={fonte.fundoDe} fallback={cor === "transparent" ? fallbackCor : cor} onChange={(fundoDe) => onChange({ fundoModo: "degrade", fundoDe })} />
            <CampoCor label="Para" value={fonte.fundoPara} fallback="#155eff" onChange={(fundoPara) => onChange({ fundoModo: "degrade", fundoPara })} />
          </div>
          <Campo label="Tipo">
            <select
              className={inputClass}
              value={fonte.fundoDegradeTipo || "linear"}
              onChange={(e) => onChange({ fundoModo: "degrade", fundoDegradeTipo: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </Campo>
          {(fonte.fundoDegradeTipo || "linear") === "linear" && (
            <Campo label="Ângulo">
              <input
                type="range"
                min="0"
                max="360"
                value={fonte.fundoAngulo ?? 160}
                onChange={(e) => onChange({ fundoModo: "degrade", fundoAngulo: Number(e.target.value) })}
                className="w-full"
              />
            </Campo>
          )}
        </>
      )}

      {modo === "imagem" && (
        <>
          <CampoArquivo
            label="Imagem de fundo"
            previewUrl={fonte.fundoImagem}
            onArquivo={onArquivo}
          />
          <Campo label="Ou cole a URL">
            <input
              className={inputClass}
              value={fonte.fundoImagem || ""}
              onChange={(e) => onChange({ fundoModo: "imagem", fundoImagem: e.target.value })}
            />
          </Campo>
          <Campo label="Ajuste">
            <select
              className={inputClass}
              value={fonte.fundoAjuste || "cover"}
              onChange={(e) => onChange({ fundoModo: "imagem", fundoAjuste: e.target.value })}
            >
              <option value="cover">Preencher</option>
              <option value="contain">Cabendo</option>
              <option value="repeat">Repetir</option>
            </select>
          </Campo>
          <CampoCor
            label="Véu (escurece a foto)"
            value={fonte.fundoOverlay}
            fallback="#00000055"
            onChange={(fundoOverlay) => onChange({ fundoModo: "imagem", fundoOverlay })}
          />
        </>
      )}
    </div>
  );
}
