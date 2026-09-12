import { useState } from "react";
import { ESTILOS_BOTAO, TIPOS_CAMPO_FORM, TIPOS_PECA, blocoPadrao, campoFormularioPadrao, camposDoFormulario, nomeDoTipo } from "./templates";
import { ANIMACOES_ICONE, ICONES_CATALOGO, IconeLucide, iconePadrao } from "./icones";
import { ALINHAMENTOS_BLOCO, TAMANHOS_TEXTO, TAMANHOS_TITULO } from "./aparencia";
import { Campo, CampoArquivo, CampoCor, CampoFundo, CamposEspaco, CamposLayout, CartaoAjuste, Pills, inputClass } from "./ajustesUI";

function CamposAparencia({ props, tema, onChange, onEscolherImagem, bloco, titulo = true, corpo = true, fundo = true, destaque = false, corKey = "corFundo" }) {
  return (
    <>
      {fundo && (
        <CampoFundo
          fonte={props}
          corKey={corKey}
          fallbackCor={tema?.fundo || "#ffffff"}
          onChange={onChange}
          onArquivo={onEscolherImagem && bloco ? (file) => onEscolherImagem(file, bloco, "fundoImagem") : undefined}
        />
      )}
      {titulo && (
        <>
          <Campo label="Tamanho do título">
            <select className={inputClass} value={props.tamanhoTitulo || ""} onChange={(e) => onChange({ tamanhoTitulo: e.target.value })}>
              {TAMANHOS_TITULO.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </Campo>
          <CampoCor label="Cor do título" value={props.corTitulo} fallback={tema?.texto || "#111111"} onChange={(corTitulo) => onChange({ corTitulo })} />
        </>
      )}
      {corpo && (
        <>
          <Campo label="Tamanho do texto">
            <select className={inputClass} value={props.tamanhoTexto || ""} onChange={(e) => onChange({ tamanhoTexto: e.target.value })}>
              {TAMANHOS_TEXTO.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </Campo>
          <CampoCor label="Cor do texto" value={props.corTexto} fallback={tema?.texto || "#111111"} onChange={(corTexto) => onChange({ corTexto })} />
        </>
      )}
      {destaque && (
        <CampoCor label="Destaque / botão" value={props.destaque} fallback={tema?.destaque || "#0071e3"} onChange={(destaqueProximo) => onChange({ destaque: destaqueProximo })} />
      )}
      <Campo label="Alinhamento">
        <select className={inputClass} value={props.alinhamento || ""} onChange={(e) => onChange({ alinhamento: e.target.value })}>
          {ALINHAMENTOS_BLOCO.map((item) => (
            <option key={item.id} value={item.id}>{item.nome}</option>
          ))}
        </select>
      </Campo>
    </>
  );
}

function CartoesDoBloco({ children, bloco, tema, set, onEscolherImagem, titulo = true, corpo = true, fundo = true, destaque = false, corKey = "corFundo", aberto = true }) {
  return (
    <div className="space-y-2">
      <CartaoAjuste titulo={nomeDoTipo(bloco.tipo)} resumo={bloco.props.titulo || bloco.props.texto || bloco.props.ancora} abertoPadrao={aberto}>
        {children}
      </CartaoAjuste>
      <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
        <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} titulo={titulo} corpo={corpo} fundo={fundo} destaque={destaque} corKey={corKey} />
      </CartaoAjuste>
      <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
        <CamposLayout props={bloco.props} onChange={set} />
      </CartaoAjuste>
      <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
        <CamposEspaco props={bloco.props} onChange={set} />
      </CartaoAjuste>
    </div>
  );
}

function CamposBotao({ botao, onChange }) {
  return (
    <div className="space-y-2">
      <Campo label="Texto">
        <input className={inputClass} value={botao.rotulo || ""} onChange={(e) => onChange({ rotulo: e.target.value })} />
      </Campo>
      <Campo label="Link">
        <input className={inputClass} value={botao.url || ""} onChange={(e) => onChange({ url: e.target.value })} placeholder="https:// ou mailto:" />
      </Campo>
      <Campo label="Estilo">
        <select className={inputClass} value={botao.estilo || "preenchido"} onChange={(e) => onChange({ estilo: e.target.value })}>
          {ESTILOS_BOTAO.map((estilo) => (
            <option key={estilo.id} value={estilo.id}>{estilo.nome}</option>
          ))}
        </select>
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <CampoCor label="Fundo" value={botao.fundo} fallback="#0071e3" onChange={(fundo) => onChange({ fundo })} />
        <CampoCor label="Texto" value={botao.cor} fallback="#ffffff" onChange={(cor) => onChange({ cor })} />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(botao.novaAba)}
          onChange={(e) => onChange({ novaAba: e.target.checked })}
        />
        Abrir em nova aba
      </label>
      <CamposHover item={botao} onChange={onChange} />
    </div>
  );
}

function CamposHover({ item, onChange }) {
  return (
    <div className="space-y-2 rounded-xl bg-paper px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Hover</p>
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

export function Inspector({ bloco, celula, onChange, onAdicionarPeca, onEscolherImagem, tema }) {
  if (!bloco && celula) {
    return (
      <CartaoAjuste titulo={`Coluna ${(celula.indice ?? 0) + 1}`} resumo="Vazia — escolha uma peça">
        <p className="text-sm text-muted">Clique numa peça abaixo ou à esquerda para preencher esta coluna.</p>
        <div className="flex flex-wrap gap-1">
          {TIPOS_PECA.slice(0, 8).map((tipo) => (
            <button
              key={tipo.tipo}
              type="button"
              className="rounded-full border border-line px-2 py-1 text-[11px] hover:bg-paper-2"
              onClick={() => onAdicionarPeca?.(tipo.tipo)}
            >
              {tipo.nome}
            </button>
          ))}
        </div>
      </CartaoAjuste>
    );
  }

  if (!bloco) {
    return <p className="text-sm text-muted">Clique numa seção, coluna ou peça para configurar.</p>;
  }

  const set = (props) => onChange({ ...bloco, props: { ...bloco.props, ...props } });

  if (bloco.tipo === "capa") {
    return (
      <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} destaque>
        <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
        <Campo label="Subtítulo"><textarea className={inputClass} rows={3} value={bloco.props.subtitulo || ""} onChange={(e) => set({ subtitulo: e.target.value })} /></Campo>
        <CampoArquivo
          label="Foto"
          previewUrl={bloco.props.fotoUrl}
          onArquivo={(file) => onEscolherImagem?.(file, bloco, "fotoUrl")}
        />
        <Campo label="Ou cole a URL"><input className={inputClass} value={bloco.props.fotoUrl || ""} onChange={(e) => set({ fotoUrl: e.target.value })} /></Campo>
        <CamposBotao
          botao={{
            rotulo: bloco.props.cta,
            url: bloco.props.url,
            estilo: bloco.props.estiloBotao,
            novaAba: bloco.props.novaAba,
            fundo: bloco.props.fundoBotao,
            cor: bloco.props.corBotao,
            hoverFundo: bloco.props.hoverFundo,
            hoverCor: bloco.props.hoverCor,
            hoverEscala: bloco.props.hoverEscala,
            hoverSombra: bloco.props.hoverSombra,
          }}
          onChange={(proximo) => set({
            cta: proximo.rotulo ?? bloco.props.cta,
            url: proximo.url ?? bloco.props.url,
            estiloBotao: proximo.estilo ?? bloco.props.estiloBotao,
            novaAba: proximo.novaAba ?? bloco.props.novaAba,
            fundoBotao: proximo.fundo ?? bloco.props.fundoBotao,
            corBotao: proximo.cor ?? bloco.props.corBotao,
            hoverFundo: proximo.hoverFundo ?? bloco.props.hoverFundo,
            hoverCor: proximo.hoverCor ?? bloco.props.hoverCor,
            hoverEscala: proximo.hoverEscala ?? bloco.props.hoverEscala,
            hoverSombra: proximo.hoverSombra ?? bloco.props.hoverSombra,
          })}
        />
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "texto") {
    return (
      <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem}>
        <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
        <Campo label="Texto"><textarea className={inputClass} rows={8} value={bloco.props.corpo || ""} onChange={(e) => set({ corpo: e.target.value })} /></Campo>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "imagem") {
    return (
      <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false}>
        <CampoArquivo
          label="Imagem"
          previewUrl={bloco.props.url}
          onArquivo={(file) => onEscolherImagem?.(file, bloco, "url")}
        />
        <Campo label="Ou cole a URL"><input className={inputClass} value={bloco.props.url || ""} onChange={(e) => set({ url: e.target.value })} /></Campo>
        <Campo label="Alt"><input className={inputClass} value={bloco.props.alt || ""} onChange={(e) => set({ alt: e.target.value })} /></Campo>
        <Campo label="Legenda"><input className={inputClass} value={bloco.props.caption || ""} onChange={(e) => set({ caption: e.target.value })} /></Campo>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "botoes") {
    const itens = bloco.props.itens || [];
    return (
      <div className="space-y-2">
        {itens.map((item, index) => (
          <CartaoAjuste key={index} titulo={`Botão ${index + 1}`} resumo={item.rotulo} abertoPadrao={index === 0}>
            <CamposBotao
              botao={item}
              onChange={(proximo) => {
                const next = itens.map((atual, i) => (i === index ? { ...atual, ...proximo } : atual));
                set({ itens: next });
              }}
            />
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>
              Remover botão
            </button>
          </CartaoAjuste>
        ))}
        <button
          type="button"
          className="text-sm text-accent"
          onClick={() => set({ itens: [...itens, { rotulo: "Novo botão", url: "https://", estilo: "contorno", novaAba: true }] })}
        >
          Adicionar botão
        </button>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} titulo={false} corpo={false} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "formulario") {
    const campos = camposDoFormulario(bloco.props);
    const gravarCampos = (proxima) => set({ campos: proxima });
    const atualizarCampo = (index, extras) => {
      gravarCampos(campos.map((campo, i) => (i === index ? { ...campo, ...extras } : campo)));
    };
    const moverCampo = (index, dir) => {
      const destino = index + dir;
      if (destino < 0 || destino >= campos.length) return;
      const proxima = [...campos];
      [proxima[index], proxima[destino]] = [proxima[destino], proxima[index]];
      gravarCampos(proxima);
    };
    return (
      <div className="space-y-4">
        <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
        <Campo label="E-mail que recebe">
          <input className={inputClass} type="email" value={bloco.props.destEmail || ""} onChange={(e) => set({ destEmail: e.target.value })} placeholder="voce@email.com" />
        </Campo>
        <Campo label="Assunto"><input className={inputClass} value={bloco.props.assunto || ""} onChange={(e) => set({ assunto: e.target.value })} /></Campo>
        <Campo label="Texto do botão"><input className={inputClass} value={bloco.props.botao || ""} onChange={(e) => set({ botao: e.target.value })} /></Campo>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Campos</p>
          {campos.map((campo, index) => (
            <div key={campo.id || index} className="space-y-2 rounded-xl border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted">Campo {index + 1}</p>
                <div className="flex gap-1">
                  <button type="button" className="rounded-lg border border-line px-2 py-1 text-xs" onClick={() => moverCampo(index, -1)}>↑</button>
                  <button type="button" className="rounded-lg border border-line px-2 py-1 text-xs" onClick={() => moverCampo(index, 1)}>↓</button>
                </div>
              </div>
              <Campo label="Tipo">
                <select className={inputClass} value={campo.tipo || "texto"} onChange={(e) => atualizarCampo(index, { tipo: e.target.value })}>
                  {TIPOS_CAMPO_FORM.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Rótulo">
                <input className={inputClass} value={campo.rotulo || ""} onChange={(e) => atualizarCampo(index, { rotulo: e.target.value })} />
              </Campo>
              {campo.tipo !== "check" && (
                <Campo label="Placeholder">
                  <input className={inputClass} value={campo.placeholder || ""} onChange={(e) => atualizarCampo(index, { placeholder: e.target.value })} />
                </Campo>
              )}
              {campo.tipo === "lista" && (
                <Campo label="Opções (uma por linha)">
                  <textarea className={inputClass} rows={3} value={campo.opcoes || ""} onChange={(e) => atualizarCampo(index, { opcoes: e.target.value })} />
                </Campo>
              )}
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(campo.obrigatorio)} onChange={(e) => atualizarCampo(index, { obrigatorio: e.target.checked })} />
                Obrigatório
              </label>
              <button type="button" className="text-xs text-danger" onClick={() => gravarCampos(campos.filter((_, i) => i !== index))}>
                Remover campo
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-accent"
            onClick={() => gravarCampos([...campos, campoFormularioPadrao()])}
          >
            Adicionar campo
          </button>
        </div>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} corpo={false} destaque />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "galeria") {
    const urls = bloco.props.urls || [];
    return (
      <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false} corpo={false}>
        <CampoArquivo
          label="Adicionar foto"
          onArquivo={(file) => onEscolherImagem?.(file, bloco, "galeria")}
        />
        {urls.map((url, index) => (
          <CartaoAjuste key={index} titulo={`Foto ${index + 1}`} abertoPadrao={false}>
            <Campo label="URL">
              <input className={inputClass} value={url} onChange={(e) => set({ urls: urls.map((atual, i) => (i === index ? e.target.value : atual)) })} />
            </Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ urls: urls.filter((_, i) => i !== index) })}>
              Remover
            </button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ urls: [...urls, ""] })}>
          Adicionar foto
        </button>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "redes") {
    const itens = bloco.props.itens || [];
    return (
      <div className="space-y-2">
        {itens.map((item, index) => (
          <CartaoAjuste key={index} titulo={`Rede ${index + 1}`} resumo={item.rotulo} abertoPadrao={index === 0}>
            <Campo label="Nome"><input className={inputClass} value={item.rotulo || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, rotulo: e.target.value } : atual)) })} /></Campo>
            <Campo label="Link"><input className={inputClass} value={item.url || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, url: e.target.value } : atual)) })} /></Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>Remover</button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, { rotulo: "Nova rede", url: "https://" }] })}>
          Adicionar rede
        </button>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} titulo={false} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "navegacao") {
    const itens = bloco.props.itens || [];
    return (
      <div className="space-y-2">
        {itens.map((item, index) => (
          <CartaoAjuste key={index} titulo={`Item ${index + 1}`} resumo={item.rotulo} abertoPadrao={index === 0}>
            <Campo label="Texto"><input className={inputClass} value={item.rotulo || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, rotulo: e.target.value } : atual)) })} /></Campo>
            <Campo label="Âncora"><input className={inputClass} value={item.ancora || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, ancora: e.target.value } : atual)) })} /></Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>Remover</button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, { rotulo: "Seção", ancora: "secao" }] })}>
          Adicionar item
        </button>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} titulo={false} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "icones") {
    return (
      <div className="space-y-2">
        <InspetorIcones bloco={bloco} set={set} />
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} titulo={false} corpo={false} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "secao") {
    const filhos = bloco.props.blocos || [];
    const temColunas = filhos.some((filho) => filho.tipo === "grade");
    return (
      <div className="space-y-2">
        <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem}>
          <p className="text-xs text-muted">A seção segura colunas e peças. Cada peça abaixo é um card à parte.</p>
          <Campo label="Âncora"><input className={inputClass} value={bloco.props.ancora || ""} onChange={(e) => set({ ancora: e.target.value })} /></Campo>
          <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
          <Campo label="Subtítulo"><input className={inputClass} value={bloco.props.subtitulo || ""} onChange={(e) => set({ subtitulo: e.target.value })} /></Campo>
          {!temColunas && (
            <button type="button" className="text-sm text-accent" onClick={() => onAdicionarPeca?.("grade")}>
              Adicionar colunas
            </button>
          )}
        </CartoesDoBloco>
        {filhos.map((filho) => (
          <Inspector
            key={filho.id}
            bloco={filho}
            onChange={(proximo) => onChange({
              ...bloco,
              props: { ...bloco.props, blocos: filhos.map((atual) => (atual.id === proximo.id ? proximo : atual)) },
            })}
            onAdicionarPeca={onAdicionarPeca}
            onEscolherImagem={onEscolherImagem}
            tema={tema}
          />
        ))}
      </div>
    );
  }

  if (bloco.tipo === "depoimentos") {
    const itens = bloco.props.itens || [];
    return (
      <div className="space-y-2">
        {itens.map((item, index) => (
          <CartaoAjuste key={index} titulo={`Depoimento ${index + 1}`} resumo={item.autor} abertoPadrao={index === 0}>
            <Campo label="Citação"><textarea className={inputClass} rows={3} value={item.citacao || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, citacao: e.target.value } : atual)) })} /></Campo>
            <Campo label="Autor"><input className={inputClass} value={item.autor || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, autor: e.target.value } : atual)) })} /></Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>Remover</button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, { citacao: "Nova frase.", autor: "Cliente" }] })}>
          Adicionar depoimento
        </button>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "rodape") {
    return (
      <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false}>
        <Campo label="Texto"><input className={inputClass} value={bloco.props.texto || ""} onChange={(e) => set({ texto: e.target.value })} /></Campo>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "grade") {
    const colunas = bloco.props.colunas || 2;
    const celulas = bloco.props.celulas || [];
    const ajustarColunas = (proxima) => {
      const n = Number(proxima);
      const lista = [...celulas];
      while (lista.length < n) lista.push({ id: crypto.randomUUID(), blocos: [] });
      set({ colunas: n, celulas: lista.slice(0, n), proporcao: n === 2 ? bloco.props.proporcao : "iguais" });
    };
    return (
      <div className="space-y-2">
        <CartaoAjuste titulo="Colunas" resumo={`${colunas} frentes`}>
          <Campo label="Quantas">
            <select className={inputClass} value={colunas} onChange={(e) => ajustarColunas(e.target.value)}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </Campo>
          {colunas === 2 && (
            <Campo label="Proporção">
              <select className={inputClass} value={bloco.props.proporcao || "iguais"} onChange={(e) => set({ proporcao: e.target.value })}>
                <option value="iguais">Iguais</option>
                <option value="esquerda">Esquerda maior</option>
                <option value="direita">Direita maior</option>
              </select>
            </Campo>
          )}
          <Campo label="Espaço entre colunas">
            <input type="range" min="8" max="48" value={bloco.props.gap || 24} onChange={(e) => set({ gap: Number(e.target.value) })} className="w-full" />
          </Campo>
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
        {celulas.map((celula, index) => (
          <CartaoAjuste key={celula.id || index} titulo={`Coluna ${index + 1}`} resumo={`${(celula.blocos || []).length} peça(s)`} abertoPadrao={false}>
            <div className="flex flex-wrap gap-1">
              {TIPOS_PECA.slice(0, 8).map((tipo) => (
                <button
                  key={tipo.tipo}
                  type="button"
                  className="rounded-full border border-line px-2 py-1 text-[11px] hover:bg-paper"
                  onClick={() => {
                    const novo = blocoPadrao(tipo.tipo);
                    set({
                      celulas: celulas.map((atual, i) => (
                        i === index ? { ...atual, blocos: [...(atual.blocos || []), novo] } : atual
                      )),
                    });
                  }}
                >
                  + {tipo.nome}
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              {(celula.blocos || []).map((filho) => (
                <Inspector
                  key={filho.id}
                  bloco={filho}
                  onChange={(proximo) => onChange({
                    ...bloco,
                    props: {
                      ...bloco.props,
                      celulas: celulas.map((atual, i) => (
                        i === index
                          ? { ...atual, blocos: (atual.blocos || []).map((item) => (item.id === proximo.id ? proximo : item)) }
                          : atual
                      )),
                    },
                  })}
                  onEscolherImagem={onEscolherImagem}
                  tema={tema}
                />
              ))}
            </div>
          </CartaoAjuste>
        ))}
      </div>
    );
  }

  if (bloco.tipo === "cartoes") {
    const itens = bloco.props.itens || [];
    return (
      <div className="space-y-2">
        <CartaoAjuste titulo="Cartões" resumo={`${itens.length} cards`}>
          <Campo label="Colunas">
            <select className={inputClass} value={bloco.props.colunas || 3} onChange={(e) => set({ colunas: Number(e.target.value) })}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </Campo>
        </CartaoAjuste>
        {itens.map((item, index) => (
          <CartaoAjuste key={index} titulo={`Card ${index + 1}`} resumo={item.titulo} abertoPadrao={index === 0}>
            <Campo label="Ícone"><input className={inputClass} value={item.icone || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, icone: e.target.value } : atual)) })} /></Campo>
            <Campo label="Título"><input className={inputClass} value={item.titulo || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, titulo: e.target.value } : atual)) })} /></Campo>
            <Campo label="Texto"><textarea className={inputClass} rows={3} value={item.corpo || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, corpo: e.target.value } : atual)) })} /></Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>Remover</button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, { icone: "Star", titulo: "Novo", corpo: "Descreva o card." }] })}>
          Adicionar card
        </button>
        <CartaoAjuste titulo="Fundo e texto" abertoPadrao={false}>
          <CamposAparencia props={bloco.props} tema={tema} onChange={set} onEscolherImagem={onEscolherImagem} bloco={bloco} destaque />
        </CartaoAjuste>
        <CartaoAjuste titulo="Layout e cantos" abertoPadrao={false}>
          <CamposLayout props={bloco.props} onChange={set} />
        </CartaoAjuste>
        <CartaoAjuste titulo="Margem e padding" abertoPadrao={false}>
          <CamposEspaco props={bloco.props} onChange={set} />
        </CartaoAjuste>
      </div>
    );
  }

  if (bloco.tipo === "faixa") {
    return (
      <div className="space-y-2">
        <CartoesDoBloco bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} fundo={false} destaque>
          <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
          <Campo label="Subtítulo"><textarea className={inputClass} rows={2} value={bloco.props.subtitulo || ""} onChange={(e) => set({ subtitulo: e.target.value })} /></Campo>
          <CampoFundo
            fonte={bloco.props}
            corKey="fundo"
            fallbackCor="#111111"
            onChange={set}
            onArquivo={onEscolherImagem ? (file) => onEscolherImagem(file, bloco, "fundoImagem") : undefined}
          />
          <CampoCor label="Cor do texto da faixa" value={bloco.props.texto} fallback="#f5f5f7" onChange={(texto) => set({ texto })} />
        </CartoesDoBloco>
        {(bloco.props.blocos || []).map((filho) => (
          <Inspector
            key={filho.id}
            bloco={filho}
            onChange={(proximo) => onChange({
              ...bloco,
              props: { ...bloco.props, blocos: (bloco.props.blocos || []).map((atual) => (atual.id === proximo.id ? proximo : atual)) },
            })}
            onEscolherImagem={onEscolherImagem}
            tema={tema}
          />
        ))}
      </div>
    );
  }

  return <p className="text-sm text-muted">Este bloco ainda não tem opções.</p>;
}

function InspetorIcones({ bloco, set }) {
  const itens = bloco.props.itens || [];
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(0);
  const filtrados = ICONES_CATALOGO.filter((nome) => nome.toLowerCase().includes(busca.toLowerCase()));

  const atualizar = (index, extras) => {
    set({ itens: itens.map((item, i) => (i === index ? { ...item, ...extras } : item)) });
  };

  return (
    <div className="space-y-3">
      {itens.map((item, index) => (
        <div key={index} className="space-y-2 rounded-2xl border border-line p-3">
          <button type="button" className="flex w-full items-center justify-between text-sm" onClick={() => setAberto(aberto === index ? -1 : index)}>
            <span className="flex items-center gap-2">
              <IconeLucide nome={item.nome} size={16} />
              {item.nome}
            </span>
            <span className="text-xs text-muted">{aberto === index ? "Fechar" : "Editar"}</span>
          </button>
          {aberto === index && (
            <div className="space-y-3">
              <Campo label="Buscar ícone">
                <input className={inputClass} value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="instagram, mail…" />
              </Campo>
              <div className="grid max-h-40 grid-cols-6 gap-1 overflow-auto">
                {filtrados.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    title={nome}
                    className={`flex h-9 items-center justify-center rounded-lg ${item.nome === nome ? "bg-accent text-white" : "bg-paper hover:bg-paper-2"}`}
                    onClick={() => atualizar(index, { nome })}
                  >
                    <IconeLucide nome={nome} size={16} color="currentColor" />
                  </button>
                ))}
              </div>
              <Campo label="Link"><input className={inputClass} value={item.url || ""} onChange={(e) => atualizar(index, { url: e.target.value })} /></Campo>
              <div className="grid grid-cols-2 gap-2">
                <Campo label="Cor"><input type="color" className="h-10 w-full" value={item.cor || "#ffffff"} onChange={(e) => atualizar(index, { cor: e.target.value })} /></Campo>
                <Campo label="Fundo"><input type="color" className="h-10 w-full" value={item.fundo || "#0071e3"} onChange={(e) => atualizar(index, { fundo: e.target.value })} /></Campo>
              </div>
              <Campo label="Tamanho">
                <input type="range" min="14" max="48" value={item.tamanho || 22} onChange={(e) => atualizar(index, { tamanho: Number(e.target.value) })} className="w-full" />
              </Campo>
              <Campo label="Fundo (espaço)">
                <input type="range" min="4" max="24" value={item.padding || 12} onChange={(e) => atualizar(index, { padding: Number(e.target.value) })} className="w-full" />
              </Campo>
              <Campo label="Arredondado">
                <input type="range" min="0" max="40" value={item.raio ?? 18} onChange={(e) => atualizar(index, { raio: Number(e.target.value) })} className="w-full" />
              </Campo>
              <Campo label="Traço">
                <input type="range" min="1" max="3" step="0.5" value={item.traco || 2} onChange={(e) => atualizar(index, { traco: Number(e.target.value) })} className="w-full" />
              </Campo>
              <Campo label="Animação">
                <select className={inputClass} value={item.animacao || "nenhuma"} onChange={(e) => atualizar(index, { animacao: e.target.value })}>
                  {ANIMACOES_ICONE.map((animacao) => (
                    <option key={animacao.id} value={animacao.id}>{animacao.nome}</option>
                  ))}
                </select>
              </Campo>
              <CamposHover item={item} onChange={(extras) => atualizar(index, extras)} />
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" checked={item.novaAba !== false} onChange={(e) => atualizar(index, { novaAba: e.target.checked })} />
                Abrir em nova aba
              </label>
              <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>
                Remover ícone
              </button>
            </div>
          )}
        </div>
      ))}
      <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, iconePadrao()] })}>
        Adicionar ícone
      </button>
    </div>
  );
}

export function ThemeInspector({ tema, onChange, onEscolherImagem }) {
  return (
    <div className="space-y-2">
      <CartaoAjuste titulo="Fundo da página" resumo="Cor, degradê ou imagem">
        <CampoFundo
          fonte={tema}
          corKey="fundo"
          fallbackCor="#0b0b10"
          onChange={(patch) => onChange({ ...tema, ...patch })}
          onArquivo={onEscolherImagem ? (file) => onEscolherImagem(file, null, "temaFundo") : undefined}
        />
      </CartaoAjuste>
      <CartaoAjuste titulo="Texto e destaque" abertoPadrao={false}>
        <Campo label="Texto"><input type="color" className="h-10 w-full" value={tema.texto} onChange={(e) => onChange({ ...tema, texto: e.target.value })} /></Campo>
        <Campo label="Destaque"><input type="color" className="h-10 w-full" value={tema.destaque} onChange={(e) => onChange({ ...tema, destaque: e.target.value })} /></Campo>
        <Campo label="Fonte">
          <select className={inputClass} value={tema.fonte} onChange={(e) => onChange({ ...tema, fonte: e.target.value })}>
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Mono</option>
          </select>
        </Campo>
      </CartaoAjuste>
      <CartaoAjuste titulo="Layout" abertoPadrao={false}>
        <Campo label="Alinhamento">
          <Pills
            valor={tema.alinhamento || "centro"}
            opcoes={[{ id: "centro", nome: "Centro" }, { id: "esquerda", nome: "Esquerda" }]}
            onChange={(alinhamento) => onChange({ ...tema, alinhamento })}
          />
        </Campo>
        <Campo label="Largura">
          <Pills
            wrap
            valor={tema.largura || "media"}
            opcoes={[
              { id: "estreita", nome: "Estreita" },
              { id: "media", nome: "Média" },
              { id: "larga", nome: "Larga" },
              { id: "completa", nome: "Completa" },
            ]}
            onChange={(largura) => onChange({ ...tema, largura })}
          />
        </Campo>
      </CartaoAjuste>
    </div>
  );
}
