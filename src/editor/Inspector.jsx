import { ESTILOS_BOTAO, TIPOS_CAMPO_FORM, TIPOS_PECA, blocoPadrao, campoFormularioPadrao, camposDoFormulario, nomeDoTipo } from "./templates";
import { ALINHAMENTOS_BLOCO, TAMANHOS_BOTAO, TAMANHOS_TEXTO, TAMANHOS_TITULO } from "./aparencia";
import { ALINHAMENTOS_TEMA, FONTES_OPCOES, ORIENTACOES_TEXTO } from "./fontes";
import { CabecalhoAjuste, Campo, CampoArquivo, CampoComDica, CampoCor, CampoFundo, CamposArranjo, CamposEspaco, CamposForma, CartaoAjuste, CartoesCaixa, CorpoFaceta, ListaPartes, PainelFacetas, Pills, inputClass, perfilLayout } from "./ajustesUI";
import { ListaIcones } from "./editorItens";
import { aplicarCaixaNaParte, fonteCaixaDaParte, idParte, indiceDaParte, parteDoBloco, partesDoBloco } from "./partes";
import { CartaoLayouts } from "./LayoutPickerModal";
import { CASCAS, ESTILOS, FORMAS_BOTAO, FORMAS_ICONE, FORMAS_TITULO, TEXTURAS, aplicarEstilo } from "./estilos";
import { ROTULO_PLANO, planoPermite } from "./planos";
import { cssFundo } from "./fundo";
import { useAuth } from "../context/AuthContext";
import { ICONES_CATALOGO } from "./icones";

const ACESSORIOS_BOTAO = [
  { id: "nenhum", nome: "Nenhum" },
  { id: "seta", nome: "Setinha" },
  { id: "icone", nome: "Ícone" },
];

function acessorioDoBotao(botao = {}) {
  if (botao.seta) return "seta";
  if (botao.icone || botao.iconeDireita) return "icone";
  return "nenhum";
}

function aplicarAcessorio(acessorio) {
  if (acessorio === "seta") {
    return { seta: true, iconeDireita: "", icone: "" };
  }
  if (acessorio === "icone") {
    return { seta: false, icone: "Mail", iconeDireita: "" };
  }
  return { seta: false, icone: "", iconeDireita: "", iconeCaixa: "" };
}

function CartoesDoBloco({ children, bloco, tema, set, onEscolherImagem, titulo = true, corpo = true, fundo = true, destaque = false, corKey = "corFundo", aberto = true, modo = "tudo" }) {
  const conteudo = modo !== "aparencia";
  const aparencia = modo !== "conteudo";
  const perfil = perfilLayout(bloco.tipo);
  const temTexto = titulo || corpo;

  const facetas = [
    fundo ? { id: "visual", nome: "Visual", dica: "Cor, degradê ou imagem atrás desta seção." } : null,
    temTexto || destaque ? { id: "texto", nome: "Texto", dica: "Tamanho, cor e alinhamento das palavras." } : null,
    { id: "arranjo", nome: "Arranjo", dica: "Como as peças de dentro (foto, título, botão…) se organizam." },
    { id: "forma", nome: "Forma", dica: "Cantos, altura mínima e encaixe de imagem." },
    { id: "espaco", nome: "Espaço", dica: "Margem empurra vizinhos · padding abre folga por dentro." },
  ];

  return (
    <div className="space-y-2">
      {conteudo && (
        <CartaoAjuste titulo={nomeDoTipo(bloco.tipo)} resumo={bloco.props.titulo || bloco.props.texto || bloco.props.ancora} abertoPadrao={aberto}>
          {children}
        </CartaoAjuste>
      )}
      {aparencia && (
        <>
          <CartaoLayouts bloco={bloco} set={set} tema={tema} />
          <PainelFacetas key={`bloco:${bloco.id}`} id={`bloco:${bloco.id}`} facetas={facetas} padrao={fundo ? "visual" : temTexto ? "texto" : "arranjo"}>
            {(faceta) => (
              <CorpoFaceta>
                {faceta === "visual" && fundo && (
                  <CampoFundo
                    fonte={bloco.props}
                    corKey={corKey}
                    fallbackCor={tema?.fundo || "#ffffff"}
                    onChange={set}
                    onArquivo={onEscolherImagem ? (file) => onEscolherImagem(file, bloco, "fundoImagem") : undefined}
                  />
                )}
                {faceta === "texto" && (
                  <CamposTextoAparencia
                    props={bloco.props}
                    tema={tema}
                    onChange={set}
                    titulo={titulo}
                    corpo={corpo}
                    destaque={destaque}
                  />
                )}
                {faceta === "arranjo" && (
                  <CamposArranjo props={bloco.props} onChange={set} escopo="bloco" />
                )}
                {faceta === "forma" && (
                  <CamposForma props={bloco.props} onChange={set} midia={perfil.midia} />
                )}
                {faceta === "espaco" && (
                  <CamposEspaco props={bloco.props} onChange={set} />
                )}
              </CorpoFaceta>
            )}
          </PainelFacetas>
        </>
      )}
    </div>
  );
}

function CamposTextoAparencia({ props, tema, onChange, titulo = true, corpo = true, destaque = false }) {
  return (
    <>
      {titulo && (
        <>
          <CampoComDica tipo="tamanhoTitulo" valor={props.tamanhoTitulo || ""}>
            <select className={inputClass} value={props.tamanhoTitulo || ""} onChange={(e) => onChange({ tamanhoTitulo: e.target.value })}>
              {TAMANHOS_TITULO.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </CampoComDica>
          <CampoCor label="Cor do título" value={props.corTitulo} fallback={tema?.texto || "#111111"} onChange={(corTitulo) => onChange({ corTitulo })} />
        </>
      )}
      {corpo && (
        <>
          <CampoComDica tipo="tamanhoTexto" valor={props.tamanhoTexto || ""}>
            <select className={inputClass} value={props.tamanhoTexto || ""} onChange={(e) => onChange({ tamanhoTexto: e.target.value })}>
              {TAMANHOS_TEXTO.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </CampoComDica>
          <CampoCor label="Cor do texto" value={props.corTexto} fallback={tema?.texto || "#111111"} onChange={(corTexto) => onChange({ corTexto })} />
        </>
      )}
      {destaque && (
        <CampoCor label="Destaque / botão" value={props.destaque} fallback={tema?.destaque || "#0071e3"} onChange={(destaqueProximo) => onChange({ destaque: destaqueProximo })} />
      )}
      <CampoComDica tipo="alinhamento" valor={props.alinhamento || ""}>
        <Pills
          wrap
          valor={props.alinhamento || ""}
          opcoes={ALINHAMENTOS_BLOCO}
          onChange={(alinhamento) => onChange({ alinhamento })}
        />
      </CampoComDica>
    </>
  );
}

function CamposBotao({ botao, onChange }) {
  const acessorio = acessorioDoBotao(botao);
  const iconeAtual = botao.icone || botao.iconeDireita || "Mail";

  return (
    <div className="space-y-2">
      <Campo label="Texto">
        <input className={inputClass} value={botao.rotulo || ""} onChange={(e) => onChange({ rotulo: e.target.value })} />
      </Campo>
      <Campo label="Descrição" dica="Linha menor embaixo do nome. Deixe vazio se não quiser.">
        <input
          className={inputClass}
          value={botao.subtitulo || ""}
          onChange={(e) => onChange({ subtitulo: e.target.value })}
          placeholder="Opcional"
        />
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
      <Campo label="Tamanho">
        <Pills
          valor={botao.tamanho || botao.tamanhoBotao || "medio"}
          opcoes={TAMANHOS_BOTAO.filter((item) => item.id)}
          onChange={(tamanho) => onChange({ tamanho })}
        />
      </Campo>
      <Campo label="Extra no botão">
        <Pills
          valor={acessorio}
          opcoes={ACESSORIOS_BOTAO}
          onChange={(valor) => onChange(aplicarAcessorio(valor))}
        />
      </Campo>
      {acessorio === "seta" && (
        <Campo label="Tipo de seta">
          <Pills
            valor={botao.iconeDireita === "ExternalLink" ? "ExternalLink" : "ArrowUpRight"}
            opcoes={[
              { id: "ArrowUpRight", nome: "Diagonal" },
              { id: "ExternalLink", nome: "Link externo" },
              { id: "ArrowRight", nome: "Para a direita" },
            ]}
            onChange={(iconeDireita) => onChange({ seta: true, iconeDireita, icone: "" })}
          />
        </Campo>
      )}
      {acessorio === "icone" && (
        <>
          <Campo label="Ícone">
            <select
              className={inputClass}
              value={iconeAtual}
              onChange={(e) => onChange({ icone: e.target.value, iconeDireita: "", seta: false })}
            >
              {ICONES_CATALOGO.map((nome) => (
                <option key={nome} value={nome}>{nome}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Posição do ícone">
            <Pills
              valor={botao.iconeDireita ? "direita" : "esquerda"}
              opcoes={[
                { id: "esquerda", nome: "Esquerda" },
                { id: "direita", nome: "Direita" },
              ]}
              onChange={(lado) => {
                if (lado === "direita") {
                  onChange({ iconeDireita: iconeAtual, icone: "", seta: false });
                } else {
                  onChange({ icone: iconeAtual, iconeDireita: "", seta: false });
                }
              }}
            />
          </Campo>
        </>
      )}
      {(acessorio === "seta" || acessorio === "icone") && (
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(botao.iconeCaixa)}
            onChange={(e) => onChange({ iconeCaixa: e.target.checked ? (botao.iconeCaixa || "#ffffff") : "" })}
          />
          Ícone dentro de uma caixinha
        </label>
      )}
      {botao.iconeCaixa ? (
        <CampoCor label="Cor da caixinha" value={botao.iconeCaixa} fallback="#ffffff" onChange={(iconeCaixa) => onChange({ iconeCaixa })} />
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <CampoCor label="Fundo" value={botao.fundo} fallback="#0071e3" onChange={(fundo) => onChange({ fundo })} />
        <CampoCor label="Texto" value={botao.cor} fallback="#ffffff" onChange={(cor) => onChange({ cor })} />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(botao.bordaLargura) || Boolean(botao.borda)}
          onChange={(e) => onChange(e.target.checked ? { borda: botao.borda || "#111111", bordaLargura: botao.bordaLargura || 2 } : { borda: "", bordaLargura: "" })}
        />
        Contorno
      </label>
      {(botao.bordaLargura || botao.borda) ? (
        <div className="grid grid-cols-2 gap-2">
          <CampoCor label="Cor do contorno" value={botao.borda} fallback="#111111" onChange={(borda) => onChange({ borda })} />
          <Campo label="Espessura">
            <input
              type="number"
              min="1"
              max="6"
              className={inputClass}
              value={botao.bordaLargura || 2}
              onChange={(e) => onChange({ bordaLargura: Number(e.target.value) || 2 })}
            />
          </Campo>
        </div>
      ) : null}
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(botao.sombraDura)}
          onChange={(e) => onChange({ sombraDura: e.target.checked ? (botao.sombraDura || "4px 4px 0 #111") : "" })}
        />
        Sombra deslocada
      </label>
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

function CamposDoFormulario({ bloco, set }) {
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
          <Campo label="Tipo" dica="Define o teclado e a validação.">
            <select className={inputClass} value={campo.tipo || "texto"} onChange={(e) => atualizarCampo(index, { tipo: e.target.value })}>
              {TIPOS_CAMPO_FORM.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Nome do campo" dica="O que a pessoa lê antes de preencher.">
            <input className={inputClass} value={campo.rotulo || ""} onChange={(e) => atualizarCampo(index, { rotulo: e.target.value })} />
          </Campo>
          {campo.tipo !== "check" && (
            <Campo label="Exemplo dentro do campo" dica="Texto cinza que desaparece ao digitar.">
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
  );
}

function CamposTexto({ props, tema, set, corpo = false, caixa, onCaixa }) {
  return (
    <>
      {corpo ? (
        <>
          <CampoComDica tipo="tamanhoTexto" valor={props.tamanhoTexto || ""}>
            <select className={inputClass} value={props.tamanhoTexto || ""} onChange={(e) => set({ tamanhoTexto: e.target.value })}>
              {TAMANHOS_TEXTO.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </CampoComDica>
          <CampoCor label="Cor" value={props.corTexto} fallback={tema?.texto || "#111111"} onChange={(corTexto) => set({ corTexto })} />
        </>
      ) : (
        <>
          <CampoComDica tipo="tamanhoTitulo" valor={props.tamanhoTitulo || ""}>
            <select className={inputClass} value={props.tamanhoTitulo || ""} onChange={(e) => set({ tamanhoTitulo: e.target.value })}>
              {TAMANHOS_TITULO.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </CampoComDica>
          <CampoCor label="Cor" value={props.corTitulo} fallback={tema?.texto || "#111111"} onChange={(corTitulo) => set({ corTitulo })} />
        </>
      )}
      {onCaixa && (
        <>
          <CampoComDica tipo="alinhamento" valor={caixa?.alinhamento || ""}>
            <Pills
              wrap
              valor={caixa?.alinhamento || ""}
              opcoes={ALINHAMENTOS_BLOCO}
              onChange={(alinhamento) => onCaixa({ alinhamento })}
            />
          </CampoComDica>
          <Campo label="Fonte">
            <select className={inputClass} value={caixa?.fonte || ""} onChange={(e) => onCaixa({ fonte: e.target.value })}>
              <option value="">Seguir o tema</option>
              {FONTES_OPCOES.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </Campo>
          <CampoComDica tipo="orientacao" valor={caixa?.orientacao || ""}>
            <Pills
              valor={caixa?.orientacao || ""}
              opcoes={[{ id: "", nome: "Tema" }, ...ORIENTACOES_TEXTO]}
              onChange={(orientacao) => onCaixa({ orientacao })}
            />
          </CampoComDica>
        </>
      )}
    </>
  );
}

function CamposTipografia({ fonte = {}, onChange }) {
  return (
    <CartaoAjuste titulo="Alinhamento e fonte" resumo="Deste texto, não da página inteira" abertoPadrao>
      <CampoComDica tipo="alinhamento" valor={fonte.alinhamento || ""}>
        <Pills
          wrap
          valor={fonte.alinhamento || ""}
          opcoes={ALINHAMENTOS_BLOCO}
          onChange={(alinhamento) => onChange({ alinhamento })}
        />
      </CampoComDica>
      <Campo label="Fonte">
        <select className={inputClass} value={fonte.fonte || ""} onChange={(e) => onChange({ fonte: e.target.value })}>
          <option value="">Seguir o tema</option>
          {FONTES_OPCOES.map((item) => (
            <option key={item.id} value={item.id}>{item.nome}</option>
          ))}
        </select>
      </Campo>
      <CampoComDica tipo="orientacao" valor={fonte.orientacao || ""}>
        <Pills
          valor={fonte.orientacao || ""}
          opcoes={[{ id: "", nome: "Tema" }, ...ORIENTACOES_TEXTO]}
          onChange={(orientacao) => onChange({ orientacao })}
        />
      </CampoComDica>
    </CartaoAjuste>
  );
}

function parteTemTexto(parte) {
  const id = parte?.id || "";
  return id !== "foto" && id !== "imagem" && id !== "campos";
}

function parteUsaCamposTexto(parte) {
  const id = parte?.id || "";
  return id === "titulo" || id === "subtitulo" || id === "corpo" || id === "legenda";
}

function perfilCaixaDaParte(bloco, parte) {
  const id = parte?.id || "";
  const midia = id === "imagem" || id === "foto" || (bloco.tipo === "galeria" && id.startsWith("item-"));
  return {
    midia,
    titulo: midia ? "Esta foto" : "Este item",
    resumo: midia ? "Tamanho, cantos e encaixe só desta imagem" : "Posição, cantos e tamanho só do que você clicou",
  };
}

function botaoDaCapa(props) {
  return {
    rotulo: props.cta,
    url: props.url,
    estilo: props.estiloBotao,
    novaAba: props.novaAba,
    fundo: props.fundoBotao,
    cor: props.corBotao,
    hoverFundo: props.hoverFundo,
    hoverCor: props.hoverCor,
    hoverEscala: props.hoverEscala,
    hoverSombra: props.hoverSombra,
  };
}

function gravarBotaoDaCapa(props, proximo) {
  return {
    cta: proximo.rotulo ?? props.cta,
    url: proximo.url ?? props.url,
    estiloBotao: proximo.estilo ?? props.estiloBotao,
    novaAba: proximo.novaAba ?? props.novaAba,
    fundoBotao: proximo.fundo ?? props.fundoBotao,
    corBotao: proximo.cor ?? props.corBotao,
    hoverFundo: proximo.hoverFundo ?? props.hoverFundo,
    hoverCor: proximo.hoverCor ?? props.hoverCor,
    hoverEscala: proximo.hoverEscala ?? props.hoverEscala,
    hoverSombra: proximo.hoverSombra ?? props.hoverSombra,
  };
}

function CamposConteudoParte({ bloco, parte, tema, set, onEscolherImagem, caixa, onCaixa }) {
  const props = bloco.props || {};
  const indice = indiceDaParte(parte.id);
  const chave = `${bloco.tipo}.${indice === null ? parte.id : "item"}`;

  const trocarItem = (campoLista, extras) => {
    const itens = props[campoLista] || [];
    set({ [campoLista]: itens.map((item, i) => (i === indice ? { ...item, ...extras } : item)) });
  };

  if (chave === "capa.foto" || chave === "imagem.imagem") {
    const campoUrl = bloco.tipo === "capa" ? "fotoUrl" : "url";
    return (
      <div className="space-y-3">
        <CampoArquivo
          label="Trocar a foto"
          previewUrl={props[campoUrl]}
          onArquivo={(file) => onEscolherImagem?.(file, bloco, campoUrl)}
        />
        <Campo label="Ou cole um endereço de imagem" dica="Serve qualquer link que termine em .jpg, .png ou .webp.">
          <input className={inputClass} value={props[campoUrl] || ""} onChange={(e) => set({ [campoUrl]: e.target.value })} />
        </Campo>
        {bloco.tipo === "capa" ? (
          <>
            <Campo label="Tamanho da foto" dica="Arraste para deixar maior ou menor.">
              <input type="range" min="64" max="260" value={props.fotoTamanho || 112} onChange={(e) => set({ fotoTamanho: Number(e.target.value) })} className="w-full" />
            </Campo>
            <Campo label="Cantos" dica="Zero é quadrado, no fim vira círculo.">
              <input type="range" min="0" max="140" value={props.fotoRaio ?? 140} onChange={(e) => set({ fotoRaio: Number(e.target.value) })} className="w-full" />
            </Campo>
          </>
        ) : (
          <>
            <Campo label="Texto alternativo" dica="Descreve a foto para quem não consegue vê-la.">
              <input className={inputClass} value={props.alt || ""} onChange={(e) => set({ alt: e.target.value })} />
            </Campo>
          </>
        )}
      </div>
    );
  }

  if (chave === "capa.titulo" || chave === "texto.titulo" || chave === "secao.titulo" || chave === "faixa.titulo" || chave === "formulario.titulo") {
    return (
      <div className="space-y-3">
        <Campo label="Texto">
          <input className={inputClass} value={props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} />
        </Campo>
        <CamposTexto props={props} tema={tema} set={set} caixa={caixa} onCaixa={onCaixa} />
      </div>
    );
  }

  if (chave === "capa.subtitulo" || chave === "secao.subtitulo" || chave === "faixa.subtitulo") {
    return (
      <div className="space-y-3">
        <Campo label="Texto">
          <textarea className={inputClass} rows={3} value={props.subtitulo || ""} onChange={(e) => set({ subtitulo: e.target.value })} />
        </Campo>
        <CamposTexto props={props} tema={tema} set={set} corpo caixa={caixa} onCaixa={onCaixa} />
      </div>
    );
  }

  if (chave === "texto.corpo") {
    return (
      <div className="space-y-3">
        <Campo label="Texto" dica="Enter pula linha e a página respeita isso.">
          <textarea className={inputClass} rows={9} value={props.corpo || ""} onChange={(e) => set({ corpo: e.target.value })} />
        </Campo>
        <CamposTexto props={props} tema={tema} set={set} corpo caixa={caixa} onCaixa={onCaixa} />
      </div>
    );
  }

  if (chave === "imagem.legenda") {
    return (
      <div className="space-y-3">
        <Campo label="Legenda">
          <input className={inputClass} value={props.caption || ""} onChange={(e) => set({ caption: e.target.value })} />
        </Campo>
        <CamposTexto props={props} tema={tema} set={set} corpo caixa={caixa} onCaixa={onCaixa} />
      </div>
    );
  }

  if (chave === "capa.botao") {
    return (
      <div className="space-y-3">
        <CamposBotao botao={botaoDaCapa(props)} onChange={(proximo) => set(gravarBotaoDaCapa(props, proximo))} />
        <Campo label="Tamanho do texto do botão">
          <select className={inputClass} value={props.tamanhoBotao || ""} onChange={(e) => set({ tamanhoBotao: e.target.value })}>
            {TAMANHOS_BOTAO.map((item) => (
              <option key={item.id || "padrao"} value={item.id}>{item.nome}</option>
            ))}
          </select>
        </Campo>
      </div>
    );
  }

  if (chave === "formulario.botao") {
    return (
      <div className="space-y-3">
        <Campo label="Texto do botão" dica="Diga o que acontece: “Enviar”, “Quero orçamento”.">
          <input className={inputClass} value={props.botao || ""} onChange={(e) => set({ botao: e.target.value })} />
        </Campo>
        <Campo label="E-mail que recebe" dica="É para cá que a mensagem vai.">
          <input className={inputClass} type="email" value={props.destEmail || ""} onChange={(e) => set({ destEmail: e.target.value })} />
        </Campo>
        <Campo label="Assunto do e-mail">
          <input className={inputClass} value={props.assunto || ""} onChange={(e) => set({ assunto: e.target.value })} />
        </Campo>
      </div>
    );
  }

  if (chave === "botoes.item") {
    const itens = props.itens || [];
    return <CamposBotao botao={itens[indice] || {}} onChange={(extras) => trocarItem("itens", extras)} />;
  }

  if (chave === "galeria.item") {
    const urls = props.urls || [];
    return (
      <div className="space-y-3">
        <CampoArquivo
          label="Trocar esta foto"
          previewUrl={urls[indice]}
          onArquivo={(file) => onEscolherImagem?.(file, bloco, "galeria")}
        />
        <Campo label="Endereço da imagem">
          <input
            className={inputClass}
            value={urls[indice] || ""}
            onChange={(e) => set({ urls: urls.map((url, i) => (i === indice ? e.target.value : url)) })}
          />
        </Campo>
      </div>
    );
  }

  if (chave === "redes.item" || chave === "navegacao.item") {
    const itens = props.itens || [];
    const item = itens[indice] || {};
    return (
      <div className="space-y-3">
        <Campo label="Texto">
          <input className={inputClass} value={item.rotulo || ""} onChange={(e) => trocarItem("itens", { rotulo: e.target.value })} />
        </Campo>
        {bloco.tipo === "redes" ? (
          <Campo label="Link">
            <input className={inputClass} value={item.url || ""} onChange={(e) => trocarItem("itens", { url: e.target.value })} />
          </Campo>
        ) : (
          <Campo label="Seção de destino" dica="Use a mesma âncora que está na seção, sem o #.">
            <input className={inputClass} value={item.ancora || ""} onChange={(e) => trocarItem("itens", { ancora: e.target.value })} />
          </Campo>
        )}
      </div>
    );
  }

  if (chave === "cartoes.item") {
    const item = (props.itens || [])[indice] || {};
    return (
      <div className="space-y-3">
        <Campo label="Título">
          <input className={inputClass} value={item.titulo || ""} onChange={(e) => trocarItem("itens", { titulo: e.target.value })} />
        </Campo>
        <Campo label="Texto">
          <textarea className={inputClass} rows={3} value={item.corpo || ""} onChange={(e) => trocarItem("itens", { corpo: e.target.value })} />
        </Campo>
        <Campo label="Ícone" dica="Nome do ícone, como Zap, Mail ou Palette.">
          <input className={inputClass} value={item.icone || ""} onChange={(e) => trocarItem("itens", { icone: e.target.value })} />
        </Campo>
      </div>
    );
  }

  if (chave === "depoimentos.item") {
    const item = (props.itens || [])[indice] || {};
    return (
      <div className="space-y-3">
        <CampoArquivo
          label="Foto do cliente"
          previewUrl={item.fotoUrl}
          onArquivo={(file) => onEscolherImagem?.(file, bloco, `depoimento:${indice}`)}
        />
        <Campo label="Ou cole a URL da foto">
          <input
            className={inputClass}
            value={item.fotoUrl || ""}
            onChange={(e) => trocarItem("itens", { fotoUrl: e.target.value })}
          />
        </Campo>
        <Campo label="Frase">
          <textarea className={inputClass} rows={3} value={item.citacao || ""} onChange={(e) => trocarItem("itens", { citacao: e.target.value })} />
        </Campo>
        <Campo label="Quem falou">
          <input className={inputClass} value={item.autor || ""} onChange={(e) => trocarItem("itens", { autor: e.target.value })} />
        </Campo>
      </div>
    );
  }

  if (chave === "icones.item") {
    return (
      <ListaIcones
        itens={props.itens || []}
        indiceAberto={indice}
        onChange={(itens) => set({ itens })}
      />
    );
  }

  if (chave === "formulario.campos") {
    return <CamposDoFormulario bloco={bloco} set={set} />;
  }

  return <p className="text-sm text-muted">Esta parte não tem ajustes próprios.</p>;
}

/** Ajustes de uma parte só: o texto, a foto ou o botão que você clicou na página. */
export function InspetorParte({ bloco, parte, tema, set, onEscolherImagem, aba = "conteudo" }) {
  const setCaixa = (extras) => {
    const proximo = aplicarCaixaNaParte(bloco, parte, extras);
    const patch = {};
    if (proximo.props.itens !== bloco.props.itens) patch.itens = proximo.props.itens;
    if (proximo.props.estiloPartes !== bloco.props.estiloPartes) patch.estiloPartes = proximo.props.estiloPartes;
    set(patch);
  };

  if (aba === "aparencia") {
    return (
      <div className="space-y-2">
        <CartoesCaixa
          idAcordeao={`${bloco.id}:${parte.id}`}
          fonte={fonteCaixaDaParte(bloco, parte)}
          onChange={setCaixa}
          layout={perfilCaixaDaParte(bloco, parte)}
          fallbackCor={tema?.fundo || "#ffffff"}
          onArquivo={onEscolherImagem ? (file) => onEscolherImagem(file, bloco, `parteFundo:${parte.id}`) : undefined}
          tipografia={
            parteTemTexto(parte) && !parteUsaCamposTexto(parte)
              ? <CamposTipografia fonte={fonteCaixaDaParte(bloco, parte)} onChange={setCaixa} />
              : null
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <CamposConteudoParte
        bloco={bloco}
        parte={parte}
        tema={tema}
        set={set}
        onEscolherImagem={onEscolherImagem}
        caixa={fonteCaixaDaParte(bloco, parte)}
        onCaixa={setCaixa}
      />
    </div>
  );
}

export function Inspector({ bloco, celula, parteId, onSelecionarParte, onChange, onAdicionarPeca, onEscolherImagem, tema, aba = "conteudo" }) {
  const parte = parteDoBloco(bloco, parteId);
  const partes = bloco ? partesDoBloco(bloco) : [];
  const set = (props) => onChange({ ...bloco, props: { ...bloco.props, ...props } });

  if (bloco && parte) {
    return (
      <div className="space-y-2">
        <CabecalhoAjuste
          titulo={parte.nome}
          dica={parte.dica}
          voltarPara={`Ajustar a ${nomeDoTipo(bloco.tipo).toLowerCase()} inteira`}
          onVoltar={() => onSelecionarParte?.(bloco.id)}
        />
        <ListaPartes
          partes={partes}
          parteAtiva={parte.id}
          onEscolher={(id) => onSelecionarParte?.(idParte(bloco.id, id))}
        />
        <InspetorParte aba={aba} bloco={bloco} parte={parte} tema={tema} set={set} onEscolherImagem={onEscolherImagem} />
      </div>
    );
  }

  return (
    <div>
      {bloco && partes.length && aba !== "aparencia" ? (
        <ListaPartes partes={partes} parteAtiva={null} onEscolher={(id) => onSelecionarParte?.(idParte(bloco.id, id))} />
      ) : null}
      <PainelBloco
        bloco={bloco}
        celula={celula}
        onChange={onChange}
        onAdicionarPeca={onAdicionarPeca}
        onEscolherImagem={onEscolherImagem}
        tema={tema}
        aba={aba}
      />
    </div>
  );
}

function opcoesAparencia(tipo) {
  switch (tipo) {
    case "imagem":
    case "rodape":
    case "redes":
    case "navegacao":
      return { titulo: false };
    case "galeria":
    case "botoes":
    case "icones":
      return { titulo: false, corpo: false };
    case "formulario":
      return { corpo: false, destaque: true };
    case "cartoes":
    case "capa":
      return { destaque: true };
    case "faixa":
      return { destaque: true, corKey: "fundo" };
    default:
      return {};
  }
}

function AparenciaPadrao({ bloco, tema, set, onEscolherImagem }) {
  const opts = opcoesAparencia(bloco.tipo);
  return (
    <CartoesDoBloco modo="aparencia" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} {...opts} />
  );
}

function PainelBloco({ bloco, celula, onChange, onAdicionarPeca, onEscolherImagem, tema, aba = "conteudo" }) {
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
    return <p className="text-sm text-muted">Clique no fundo, na página ou numa peça para ajustar.</p>;
  }

  const set = (props) => onChange({ ...bloco, props: { ...bloco.props, ...props } });

  if (aba === "aparencia") {
    return <AparenciaPadrao bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} />;
  }

  if (bloco.tipo === "capa") {
    return (
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} destaque>
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
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem}>
        <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
        <Campo label="Texto"><textarea className={inputClass} rows={8} value={bloco.props.corpo || ""} onChange={(e) => set({ corpo: e.target.value })} /></Campo>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "imagem") {
    return (
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false}>
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
          <CartaoAjuste key={index} titulo={`Botão ${index + 1}`} resumo={item.subtitulo ? `${item.rotulo} — ${item.subtitulo}` : item.rotulo} abertoPadrao={index === 0}>
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
          onClick={() => set({ itens: [...itens, { rotulo: "Novo botão", subtitulo: "", url: "https://", estilo: "preenchido", novaAba: true }] })}
        >
          Adicionar botão
        </button>
      </div>
    );
  }

  if (bloco.tipo === "formulario") {
    return (
      <div className="space-y-4">
        <Campo label="Título"><input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
        <Campo label="E-mail que recebe" dica="É para cá que a mensagem vai.">
          <input className={inputClass} type="email" value={bloco.props.destEmail || ""} onChange={(e) => set({ destEmail: e.target.value })} placeholder="voce@email.com" />
        </Campo>
        <Campo label="Assunto"><input className={inputClass} value={bloco.props.assunto || ""} onChange={(e) => set({ assunto: e.target.value })} /></Campo>
        <Campo label="Texto do botão"><input className={inputClass} value={bloco.props.botao || ""} onChange={(e) => set({ botao: e.target.value })} /></Campo>
        <CamposDoFormulario bloco={bloco} set={set} />
      </div>
    );
  }

  if (bloco.tipo === "galeria") {
    const urls = bloco.props.urls || [];
    return (
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false} corpo={false}>
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
      </div>
    );
  }

  if (bloco.tipo === "icones") {
    return (
      <div className="space-y-2">
        <ListaIcones itens={bloco.props.itens || []} onChange={(itens) => set({ itens })} />
      </div>
    );
  }

  if (bloco.tipo === "secao") {
    const filhos = bloco.props.blocos || [];
    const temColunas = filhos.some((filho) => filho.tipo === "grade");
    return (
      <div className="space-y-2">
        <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem}>
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
          <CartaoAjuste key={item.id || index} titulo={`Depoimento ${index + 1}`} resumo={item.autor} abertoPadrao={index === 0}>
            <CampoArquivo
              label="Foto do cliente"
              previewUrl={item.fotoUrl}
              onArquivo={(file) => onEscolherImagem?.(file, bloco, `depoimento:${index}`)}
            />
            <Campo label="Ou cole a URL da foto">
              <input
                className={inputClass}
                value={item.fotoUrl || ""}
                onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, fotoUrl: e.target.value } : atual)) })}
              />
            </Campo>
            <Campo label="Citação"><textarea className={inputClass} rows={3} value={item.citacao || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, citacao: e.target.value } : atual)) })} /></Campo>
            <Campo label="Autor"><input className={inputClass} value={item.autor || ""} onChange={(e) => set({ itens: itens.map((atual, i) => (i === index ? { ...atual, autor: e.target.value } : atual)) })} /></Campo>
            <button type="button" className="text-xs text-danger" onClick={() => set({ itens: itens.filter((_, i) => i !== index) })}>Remover</button>
          </CartaoAjuste>
        ))}
        <button type="button" className="text-sm text-accent" onClick={() => set({ itens: [...itens, { id: crypto.randomUUID(), citacao: "Nova frase.", autor: "Cliente", fotoUrl: "" }] })}>
          Adicionar depoimento
        </button>
      </div>
    );
  }

  if (bloco.tipo === "rodape") {
    return (
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} titulo={false}>
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
      </div>
    );
  }

  if (bloco.tipo === "contador") {
    return (
      <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} destaque>
        <Campo label="Chamada">
          <input className={inputClass} value={bloco.props.titulo || ""} onChange={(e) => set({ titulo: e.target.value })} />
        </Campo>
        <Campo label="Conta até">
          <input
            type="datetime-local"
            className={inputClass}
            value={bloco.props.alvo || ""}
            onChange={(e) => set({ alvo: e.target.value })}
          />
        </Campo>
        <Campo label="Quando zerar, mostrar">
          <input className={inputClass} value={bloco.props.textoFim || ""} onChange={(e) => set({ textoFim: e.target.value })} />
        </Campo>
        <Campo label="Segundos">
          <Pills
            valor={bloco.props.mostrarSegundos === false ? "nao" : "sim"}
            opcoes={[{ id: "sim", nome: "Mostrar" }, { id: "nao", nome: "Esconder" }]}
            onChange={(valor) => set({ mostrarSegundos: valor === "sim" })}
          />
        </Campo>
      </CartoesDoBloco>
    );
  }

  if (bloco.tipo === "faixa") {
    return (
      <div className="space-y-2">
        <CartoesDoBloco modo="conteudo" bloco={bloco} tema={tema} set={set} onEscolherImagem={onEscolherImagem} fundo={false} destaque>
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

function MiniEstilo({ preset }) {
  const { casca, cascaFundo, cascaRaio, texto } = preset.tema;
  const dentro = casca === "cheia" || casca === "coluna" || casca === "moldura";
  return (
    <span className="block h-12 w-full overflow-hidden rounded-lg" style={cssFundo(preset.tema)}>
      <span
        className="mx-auto mt-2 block h-8 w-[70%]"
        style={{
          background: dentro ? "transparent" : (cascaFundo || "#ffffff"),
          borderRadius: dentro ? 0 : Math.min(Number(cascaRaio ?? 16), 12),
          borderTop: casca === "coluna" ? `2px solid ${texto}` : undefined,
          opacity: casca === "coluna" ? 0.5 : 1,
        }}
      />
    </span>
  );
}

function CartaoEstilo({ tema, onChange }) {
  const { usuario } = useAuth();
  const plano = usuario?.plano || "free";
  const atual = tema.estilo || "";

  return (
    <>
      <CartaoAjuste titulo="Estilo da página" resumo={ESTILOS.find((item) => item.id === atual)?.nome || "Personalizado"} abertoPadrao>
        <div className="grid grid-cols-2 gap-2">
          {ESTILOS.map((preset) => {
            const liberado = planoPermite(plano, preset.plano);
            return (
              <button
                key={preset.id}
                type="button"
                disabled={!liberado}
                title={liberado ? preset.descricao : `Disponível no plano ${ROTULO_PLANO[preset.plano]}`}
                onClick={() => onChange(aplicarEstilo(tema, preset.id))}
                className={`rounded-xl p-1.5 text-left ring-1 transition ${
                  atual === preset.id ? "ring-2 ring-accent" : "ring-line hover:ring-ink/30"
                } ${liberado ? "" : "cursor-not-allowed opacity-50"}`}
              >
                <MiniEstilo preset={preset} />
                <span className="mt-1.5 flex items-center justify-between gap-1">
                  <span className="truncate text-xs">{preset.nome}</span>
                  {preset.plano !== "free" && (
                    <span className="shrink-0 rounded bg-ink px-1 text-[10px] uppercase text-paper">{ROTULO_PLANO[preset.plano]}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </CartaoAjuste>
      <CartaoAjuste titulo="Casca e acabamento" abertoPadrao={false}>
        <Campo label="Container">
          <Pills wrap valor={tema.casca || "coluna"} opcoes={CASCAS} onChange={(casca) => onChange({ ...tema, casca })} />
        </Campo>
        <Campo label="Textura do fundo">
          <Pills wrap valor={tema.textura || "nenhuma"} opcoes={TEXTURAS} onChange={(textura) => onChange({ ...tema, textura })} />
        </Campo>
        <Campo label="Formato dos botões">
          <Pills wrap valor={tema.botao || "pilula"} opcoes={FORMAS_BOTAO} onChange={(botao) => onChange({ ...tema, botao })} />
        </Campo>
        <Campo label="Formato dos ícones">
          <Pills wrap valor={tema.iconeForma || "simples"} opcoes={FORMAS_ICONE} onChange={(iconeForma) => onChange({ ...tema, iconeForma })} />
        </Campo>
        <Campo label="Títulos">
          <Pills wrap valor={tema.tituloForma || "pesado"} opcoes={FORMAS_TITULO} onChange={(tituloForma) => onChange({ ...tema, tituloForma })} />
        </Campo>
      </CartaoAjuste>
    </>
  );
}

export function ThemeInspector({ tema, onChange, onEscolherImagem, extras, escopo = "tudo", titulo, onTitulo }) {
  const mostraFundo = escopo !== "pagina";
  const mostraPagina = escopo !== "fundo";
  return (
    <div className="space-y-2">
      {mostraPagina && <CartaoEstilo tema={tema} onChange={onChange} />}
      {mostraPagina && onTitulo ? (
        <CartaoAjuste titulo="Nome da página" resumo={titulo}>
          <Campo label="Título">
            <input className={inputClass} value={titulo || ""} onChange={(e) => onTitulo(e.target.value)} />
          </Campo>
        </CartaoAjuste>
      ) : null}
      {mostraPagina ? extras : null}
      {mostraFundo && (
        <CartaoAjuste titulo="Fundo" resumo="Cor, degradê, imagem ou transparente">
          <CampoFundo
            fonte={tema}
            corKey="fundo"
            fallbackCor="#0b0b10"
            onChange={(patch) => onChange({ ...tema, ...patch })}
            onArquivo={onEscolherImagem ? (file) => onEscolherImagem(file, null, "temaFundo") : undefined}
          />
        </CartaoAjuste>
      )}
      {mostraPagina && (
        <>
          <CartaoAjuste titulo="Texto e destaque" abertoPadrao={escopo === "pagina"}>
            <Campo label="Texto"><input type="color" className="h-10 w-full" value={tema.texto} onChange={(e) => onChange({ ...tema, texto: e.target.value })} /></Campo>
            <Campo label="Destaque"><input type="color" className="h-10 w-full" value={tema.destaque} onChange={(e) => onChange({ ...tema, destaque: e.target.value })} /></Campo>
            <Campo label="Fonte">
              <select className={inputClass} value={tema.fonte || "sans"} onChange={(e) => onChange({ ...tema, fonte: e.target.value })}>
                {FONTES_OPCOES.map((fonte) => (
                  <option key={fonte.id} value={fonte.id}>{fonte.nome}</option>
                ))}
              </select>
            </Campo>
          </CartaoAjuste>
          <CartaoAjuste titulo="Largura e alinhamento" abertoPadrao={escopo === "pagina"} resumo="Como o conteúdo da página se acomoda">
            <CampoComDica tipo="alinhamento" valor={tema.alinhamento || "centro"}>
              <Pills
                wrap
                valor={tema.alinhamento || "centro"}
                opcoes={ALINHAMENTOS_TEMA}
                onChange={(alinhamento) => onChange({ ...tema, alinhamento })}
              />
            </CampoComDica>
            <CampoComDica tipo="orientacao" valor={tema.orientacao || "horizontal"}>
              <Pills
                valor={tema.orientacao || "horizontal"}
                opcoes={ORIENTACOES_TEXTO}
                onChange={(orientacao) => onChange({ ...tema, orientacao })}
              />
            </CampoComDica>
            <CampoComDica tipo="largura" valor={tema.largura || "media"}>
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
            </CampoComDica>
          </CartaoAjuste>
        </>
      )}
    </div>
  );
}
