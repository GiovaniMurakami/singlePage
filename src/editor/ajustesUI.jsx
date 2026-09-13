import { useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { DEGRADES_PRONTOS, modoFundo } from "./fundo";
import { ALIGN_BLOCO, DIRECOES_FLEX, DISPLAYS_BLOCO, JUSTIFY_BLOCO, OBJECT_FIT, RAIOS_BLOCO } from "./aparencia";

export const inputClass = "w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent";

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

export function Campo({ label, dica, children }) {
  return (
    <div className="block space-y-1.5">
      <span className="ui-dica block text-xs uppercase tracking-[0.16em]">{label}</span>
      {dica ? <span className="ui-dica block text-[11px] leading-4">{dica}</span> : null}
      {children}
    </div>
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
  const slider = (label, chave, min, max, vazio) => (
    <Campo label={label}>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={props[chave] === "" || props[chave] == null ? vazio : props[chave]}
          onChange={(e) => onChange({ [chave]: Number(e.target.value) })}
          className="w-full"
        />
        <span className="w-10 text-right text-xs text-muted">{props[chave] === "" || props[chave] == null ? "auto" : `${props[chave]}`}</span>
      </div>
    </Campo>
  );
  return (
    <div className="space-y-3">
      {slider("Margem de cima", "margemCima", 0, 96, 0)}
      {slider("Margem de baixo", "margemBaixo", 0, 96, 0)}
      {slider("Padding de cima", "paddingCima", 0, 80, 24)}
      {slider("Padding de baixo", "paddingBaixo", 0, 80, 24)}
      {slider("Padding das laterais", "paddingLados", 0, 64, 20)}
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

function ativarCaixaFlex(props, extras) {
  if (props.display === "flex" || props.display === "grid") return extras;
  return {
    display: "flex",
    flexDirecao: props.flexDirecao || "row",
    flexQuebra: props.flexQuebra || "wrap",
    gap: definidoNumero(props.gap) ? props.gap : 16,
    ...extras,
  };
}

export function CamposLayout({ props, onChange, midia = false }) {
  const display = props.display || "";
  return (
    <div className="space-y-3">
      <Campo label="Display" dica="Como o conteúdo se organiza neste item.">
        <Pills
          valor={display}
          opcoes={DISPLAYS_BLOCO}
          onChange={(valor) => onChange({
            display: valor,
            ...(valor === "flex" ? {
              flexDirecao: props.flexDirecao || "row",
              flexQuebra: props.flexQuebra || "wrap",
              justify: props.justify || "center",
              align: props.align || "center",
              gap: definidoNumero(props.gap) ? props.gap : 16,
            } : {}),
            ...(valor === "grid" ? {
              colunasGrade: props.colunasGrade || 2,
              justify: props.justify || "center",
              align: props.align || "center",
              gap: definidoNumero(props.gap) ? props.gap : 16,
            } : {}),
          })}
        />
      </Campo>
      <Campo label="Justify content" dica="Eixo principal: início, centro, fim ou espaço entre os itens.">
        <Pills
          wrap
          valor={props.justify || ""}
          opcoes={[{ id: "", nome: "Auto" }, ...JUSTIFY_BLOCO]}
          onChange={(justify) => onChange(justify || props.align ? ativarCaixaFlex(props, { justify }) : { justify })}
        />
      </Campo>
      <Campo label="Align items" dica="Eixo cruzado: topo, centro, base ou esticar.">
        <Pills
          wrap
          valor={props.align || ""}
          opcoes={[{ id: "", nome: "Auto" }, ...ALIGN_BLOCO]}
          onChange={(align) => onChange(align || props.justify ? ativarCaixaFlex(props, { align }) : { align })}
        />
      </Campo>
      <Campo label="Align self" dica="Posição deste item dentro do bloco pai.">
        <Pills
          wrap
          valor={props.alignSelf || ""}
          opcoes={[{ id: "", nome: "Auto" }, ...ALIGN_BLOCO]}
          onChange={(alignSelf) => onChange({ alignSelf })}
        />
      </Campo>
      {display === "flex" && (
        <>
          <Campo label="Direção">
            <Pills valor={props.flexDirecao || "row"} opcoes={DIRECOES_FLEX} onChange={(flexDirecao) => onChange({ flexDirecao })} />
          </Campo>
          <Campo label="Quebra">
            <Pills
              valor={props.flexQuebra || "wrap"}
              opcoes={[{ id: "nowrap", nome: "Não" }, { id: "wrap", nome: "Sim" }]}
              onChange={(flexQuebra) => onChange({ flexQuebra })}
            />
          </Campo>
        </>
      )}
      {display === "grid" && (
        <Campo label="Colunas da grade">
          <Pills
            valor={String(props.colunasGrade || 2)}
            opcoes={[{ id: "1", nome: "1" }, { id: "2", nome: "2" }, { id: "3", nome: "3" }, { id: "4", nome: "4" }]}
            onChange={(valor) => onChange({ colunasGrade: Number(valor) })}
          />
        </Campo>
      )}
      {(display === "flex" || display === "grid") && (
        <Campo label="Espaço entre itens">
          <input type="range" min="0" max="64" value={props.gap ?? 16} onChange={(e) => onChange({ gap: Number(e.target.value) })} className="w-full" />
        </Campo>
      )}
      <Campo label="Cantos" dica="Arredondamento deste item.">
        <Pills
          wrap
          valor={props.raio === "" || props.raio == null ? "" : String(props.raio)}
          opcoes={RAIOS_BLOCO}
          onChange={(valor) => onChange({ raio: valor === "" ? "" : Number(valor) })}
        />
      </Campo>
      {definidoNumero(props.raio) && !RAIOS_BLOCO.some((item) => item.id !== "" && Number(item.id) === Number(props.raio)) && (
        <p className="text-[11px] text-muted">{props.raio}px</p>
      )}
      <Campo label="Ajuste fino do raio">
        <input type="range" min="0" max="48" value={props.raio === "" || props.raio == null ? 16 : Math.min(48, Number(props.raio))} onChange={(e) => onChange({ raio: Number(e.target.value) })} className="w-full" />
      </Campo>
      <Campo label="Altura mínima">
        <div className="flex items-center gap-2">
          <input type="range" min="0" max="720" value={props.minAltura === "" || props.minAltura == null ? 0 : props.minAltura} onChange={(e) => onChange({ minAltura: Number(e.target.value) })} className="w-full" />
          <span className="w-12 text-right text-xs text-muted">{props.minAltura === "" || props.minAltura == null ? "auto" : `${props.minAltura}`}</span>
        </div>
      </Campo>
      <Campo label="Overflow">
        <Pills
          valor={props.overflow || ""}
          opcoes={[{ id: "", nome: "Visível" }, { id: "hidden", nome: "Cortar" }]}
          onChange={(overflow) => onChange({ overflow })}
        />
      </Campo>
      {midia && (
        <>
          <Campo label="Largura da foto" dica="Só vale para fotos deste bloco.">
            <div className="flex items-center gap-2">
              <input type="range" min="80" max="720" value={props.itemLargura === "" || props.itemLargura == null ? 720 : props.itemLargura} onChange={(e) => onChange({ itemLargura: Number(e.target.value) })} className="w-full" />
              <span className="w-12 text-right text-xs text-muted">{props.itemLargura === "" || props.itemLargura == null ? "auto" : `${props.itemLargura}`}</span>
            </div>
          </Campo>
          <Campo label="Encaixe da imagem" dica="Como a foto preenche o espaço.">
            <Pills valor={props.objectFit || "cover"} opcoes={OBJECT_FIT} onChange={(objectFit) => onChange({ objectFit })} />
          </Campo>
        </>
      )}
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
          raio: "",
          minAltura: "",
          overflow: "",
          ...(midia ? { itemLargura: "", objectFit: "" } : {}),
        })}
      >
        Voltar ao layout padrão
      </button>
    </div>
  );
}

const acordeaoCaixa = new Map();

/** Fundo, layout e padding do item selecionado — não do bloco. */
export function CartoesCaixa({ idAcordeao, fonte = {}, onChange, layout = {}, onArquivo, fallbackCor = "#ffffff" }) {
  const [abertos, setAbertos] = useState(() => acordeaoCaixa.get(idAcordeao) || {
    fundo: false,
    layout: true,
    espaco: false,
  });
  const setChave = (chave, valor) => {
    setAbertos((atual) => {
      const proximo = { ...atual, [chave]: valor };
      if (idAcordeao) acordeaoCaixa.set(idAcordeao, proximo);
      return proximo;
    });
  };
  return (
    <>
      <CartaoAjuste titulo="Fundo" resumo="Cor, degradê ou imagem deste item" aberto={abertos.fundo} onAberto={(valor) => setChave("fundo", valor)}>
        <CampoFundo fonte={fonte} fallbackCor={fallbackCor} onChange={onChange} onArquivo={onArquivo} />
      </CartaoAjuste>
      <CartaoAjuste titulo={layout.titulo || "Layout e cantos"} aberto={abertos.layout} onAberto={(valor) => setChave("layout", valor)}>
        <CamposLayout props={fonte} onChange={onChange} midia={layout.midia} />
      </CartaoAjuste>
      <CartaoAjuste titulo="Margem e padding" aberto={abertos.espaco} onAberto={(valor) => setChave("espaco", valor)}>
        <CamposEspaco props={fonte} onChange={onChange} />
      </CartaoAjuste>
    </>
  );
}

/** Quais campos de layout fazem sentido para cada tipo de bloco. */
export function perfilLayout(tipo) {
  switch (tipo) {
    case "imagem":
    case "galeria":
      return { midia: true, titulo: "Layout e foto" };
    case "cartoes":
    case "depoimentos":
      return { midia: true, titulo: "Layout e cantos" };
    default:
      return { midia: false, titulo: "Layout e cantos" };
  }
}

function definidoNumero(valor) {
  return valor !== "" && valor != null;
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
