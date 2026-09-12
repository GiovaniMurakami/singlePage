import { useState } from "react";
import { ANIMACOES_ICONE, ICONES_CATALOGO, IconeLucide, iconePadrao } from "./icones";
import { Campo, CartaoAjuste, inputClass } from "./ajustesUI";

function chaveItem(item, indice) {
  return item?.id || `idx-${indice}`;
}

/** Edição de um único ícone — isolado para não remountar o resto da lista. */
export function EditorIcone({ item, onChange, onRemover }) {
  const [busca, setBusca] = useState("");
  const filtrados = ICONES_CATALOGO.filter((nome) => nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-3">
      <Campo label="Buscar ícone" dica="Digite Instagram, Mail, Heart…">
        <input className={inputClass} value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="instagram, mail…" />
      </Campo>
      <div className="grid max-h-40 grid-cols-6 gap-1 overflow-auto">
        {filtrados.map((nome) => (
          <button
            key={nome}
            type="button"
            title={nome}
            className={`flex h-9 items-center justify-center rounded-lg ${item.nome === nome ? "bg-accent text-white" : "bg-paper hover:bg-paper-2"}`}
            onClick={() => onChange({ nome })}
          >
            <IconeLucide nome={nome} size={16} color="currentColor" />
          </button>
        ))}
      </div>
      <Campo label="Link">
        <input className={inputClass} value={item.url || ""} onChange={(e) => onChange({ url: e.target.value })} />
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <Campo label="Cor do ícone">
          <input type="color" className="h-10 w-full" value={item.cor || "#ffffff"} onChange={(e) => onChange({ cor: e.target.value })} />
        </Campo>
        <Campo label="Fundo do ícone">
          <input type="color" className="h-10 w-full" value={item.fundo || "#0071e3"} onChange={(e) => onChange({ fundo: e.target.value })} />
        </Campo>
      </div>
      <Campo label="Tamanho do ícone" dica="Só deste ícone, não da foto da página.">
        <input type="range" min="14" max="48" value={item.tamanho || 22} onChange={(e) => onChange({ tamanho: Number(e.target.value) })} className="w-full" />
      </Campo>
      <Campo label="Espaço interno">
        <input type="range" min="4" max="24" value={item.padding || 12} onChange={(e) => onChange({ padding: Number(e.target.value) })} className="w-full" />
      </Campo>
      <Campo label="Cantos do ícone">
        <input type="range" min="0" max="40" value={item.raio ?? 18} onChange={(e) => onChange({ raio: Number(e.target.value) })} className="w-full" />
      </Campo>
      <Campo label="Espessura do traço">
        <input type="range" min="1" max="3" step="0.5" value={item.traco || 2} onChange={(e) => onChange({ traco: Number(e.target.value) })} className="w-full" />
      </Campo>
      <Campo label="Animação">
        <select className={inputClass} value={item.animacao || "nenhuma"} onChange={(e) => onChange({ animacao: e.target.value })}>
          {ANIMACOES_ICONE.map((animacao) => (
            <option key={animacao.id} value={animacao.id}>{animacao.nome}</option>
          ))}
        </select>
      </Campo>
      <CamposHoverItem item={item} onChange={onChange} />
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={item.novaAba !== false} onChange={(e) => onChange({ novaAba: e.target.checked })} />
        Abrir em nova aba
      </label>
      {onRemover && (
        <button type="button" className="text-xs text-danger" onClick={onRemover}>
          Remover ícone
        </button>
      )}
    </div>
  );
}

function CamposHoverItem({ item, onChange }) {
  return (
    <div className="space-y-2 rounded-xl bg-paper px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Ao passar o mouse</p>
      <div className="grid grid-cols-2 gap-2">
        <Campo label="Fundo">
          <input type="color" className="h-10 w-full" value={item.hoverFundo || item.fundo || "#1d1d1f"} onChange={(e) => onChange({ hoverFundo: e.target.value })} />
        </Campo>
        <Campo label="Cor">
          <input type="color" className="h-10 w-full" value={item.hoverCor || item.cor || "#ffffff"} onChange={(e) => onChange({ hoverCor: e.target.value })} />
        </Campo>
      </div>
      <Campo label="Escala">
        <input type="range" min="1" max="1.2" step="0.01" value={item.hoverEscala || 1.04} onChange={(e) => onChange({ hoverEscala: Number(e.target.value) })} className="w-full" />
      </Campo>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={item.hoverSombra !== false} onChange={(e) => onChange({ hoverSombra: e.target.checked })} />
        Sombra no hover
      </label>
    </div>
  );
}

/** Lista de ícones do bloco, com um card por item. */
export function ListaIcones({ itens = [], onChange, indiceAberto }) {
  const atualizar = (index, extras) => {
    onChange(itens.map((item, i) => (i === index ? { ...item, ...extras } : item)));
  };

  if (indiceAberto != null && itens[indiceAberto]) {
    return (
      <EditorIcone
        item={itens[indiceAberto]}
        onChange={(extras) => atualizar(indiceAberto, extras)}
        onRemover={() => onChange(itens.filter((_, i) => i !== indiceAberto))}
      />
    );
  }

  return (
    <div className="space-y-2">
      {itens.map((item, index) => (
        <CartaoAjuste
          key={chaveItem(item, index)}
          titulo={item.nome || `Ícone ${index + 1}`}
          resumo={item.url}
          abertoPadrao={index === 0}
        >
          <EditorIcone
            item={item}
            onChange={(extras) => atualizar(index, extras)}
            onRemover={() => onChange(itens.filter((_, i) => i !== index))}
          />
        </CartaoAjuste>
      ))}
      <button type="button" className="text-sm text-accent" onClick={() => onChange([...itens, iconePadrao()])}>
        Adicionar ícone
      </button>
    </div>
  );
}

/** Lista genérica de botões/links com campos texto + url. */
export function ListaLinks({ itens = [], onChange, rotuloNovo = "Novo link", campoUrl = "url", campoRotulo = "rotulo" }) {
  const atualizar = (index, extras) => {
    onChange(itens.map((item, i) => (i === index ? { ...item, ...extras } : item)));
  };

  return (
    <div className="space-y-2">
      {itens.map((item, index) => (
        <CartaoAjuste
          key={chaveItem(item, index)}
          titulo={item[campoRotulo] || `Item ${index + 1}`}
          abertoPadrao={index === 0}
        >
          <Campo label="Texto">
            <input
              className={inputClass}
              value={item[campoRotulo] || ""}
              onChange={(e) => atualizar(index, { [campoRotulo]: e.target.value })}
            />
          </Campo>
          <Campo label={campoUrl === "ancora" ? "Seção de destino" : "Link"}>
            <input
              className={inputClass}
              value={item[campoUrl] || ""}
              onChange={(e) => atualizar(index, { [campoUrl]: e.target.value })}
            />
          </Campo>
          <button type="button" className="text-xs text-danger" onClick={() => onChange(itens.filter((_, i) => i !== index))}>
            Remover
          </button>
        </CartaoAjuste>
      ))}
      <button
        type="button"
        className="text-sm text-accent"
        onClick={() => onChange([...itens, { id: crypto.randomUUID(), [campoRotulo]: rotuloNovo, [campoUrl]: campoUrl === "ancora" ? "secao" : "https://" }])}
      >
        Adicionar
      </button>
    </div>
  );
}
