import { useId } from "react";

const COR = {
  fundo: "#ecece8",
  borda: "#d0d0cc",
  peca: "#3a3a3a",
  fraca: "#b4b4ae",
  ativo: "#4a9fd4",
  faixa: "rgba(74, 159, 212, 0.38)",
  margem: "rgba(214, 138, 58, 0.42)",
  linha: "#8a8a84",
};

function Quadro({ children, clipId }) {
  return (
    <svg viewBox="0 0 72 44" width="58" height="36" className="dica-desenho" aria-hidden>
      <rect x="0.5" y="0.5" width="71" height="43" rx="5" fill={COR.fundo} stroke={COR.borda} />
      {clipId ? (
        <clipPath id={clipId}>
          <rect x="1" y="1" width="70" height="42" rx="5" />
        </clipPath>
      ) : null}
      <g clipPath={clipId ? `url(#${clipId})` : undefined}>{children}</g>
    </svg>
  );
}

function Peca({ x, y, w, h, r = 2, ativo = false, fraca = false }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={ativo ? COR.ativo : fraca ? COR.fraca : COR.peca} />;
}

function linhasTexto(alinhamento) {
  const larguras = [44, 32, 38];
  return larguras.map((largura, i) => {
    const y = 11 + i * 8;
    let x = 14;
    if (alinhamento === "centro") x = 36 - largura / 2;
    if (alinhamento === "direita") x = 58 - largura;
    if (alinhamento === "justificado") {
      return <Peca key={i} x={12} y={y} w={48} h={3.5} r={1} />;
    }
    return <Peca key={i} x={x} y={y} w={largura} h={3.5} r={1} />;
  });
}

function dicaDisplay(valor) {
  if (valor === "block") return "Empilha tudo: uma peça embaixo da outra.";
  if (valor === "flex") return "Coloca as peças em sequência. A direção abaixo escolhe se a fileira é horizontal ou vertical.";
  if (valor === "grid") return "Distribui as peças em colunas regulares.";
  return "Mantém o jeito do modelo que você já escolheu para esta seção.";
}

function dicaJustify(valor) {
  if (valor === "flex-start") return "Junta as peças no começo da fileira.";
  if (valor === "center") return "Junta as peças no meio.";
  if (valor === "flex-end") return "Junta as peças no fim da fileira.";
  if (valor === "space-between") return "A primeira e a última vão para as pontas; o resto se espalha no meio.";
  if (valor === "space-around") return "Deixa um respiro parecido em volta de cada peça.";
  if (valor === "space-evenly") return "O vão entre as peças e as bordas fica igual.";
  return "Deixa a distribuição automática.";
}

function dicaAlign(valor) {
  if (valor === "stretch") return "Estica as peças para a mesma altura.";
  if (valor === "flex-start") return "Encosta as peças no topo.";
  if (valor === "center") return "Centraliza as peças na altura.";
  if (valor === "flex-end") return "Encosta as peças na base.";
  return "Segue o alinhamento automático.";
}

function dicaAlignSelf(valor) {
  if (valor === "stretch") return "Só este item estica para preencher a altura.";
  if (valor === "flex-start") return "Só este item sobe para o topo, sem mexer nos outros.";
  if (valor === "center") return "Só este item fica no meio da altura.";
  if (valor === "flex-end") return "Só este item desce para a base.";
  return "Este item acompanha o alinhamento das outras peças.";
}

function dicaRaio(valor) {
  if (valor === "" || valor == null) return "Cantos no padrão do tema.";
  const n = Number(valor);
  if (n === 0) return "Cantos retos, como um cartão cortado.";
  if (n >= 80) return "Cantos tão redondos que o bloco vira pílula.";
  return `Arredonda os cantos em ${n}px.`;
}

function dicaObjectFit(valor) {
  if (valor === "contain") return "A foto aparece inteira; pode sobrar uma faixa vazia.";
  if (valor === "fill") return "A foto estica até preencher, mesmo distorcendo.";
  return "A foto preenche o retângulo e corta o que sobrar.";
}

function dicaAlinhamento(valor) {
  if (valor === "esquerda") return "O texto encosta à esquerda.";
  if (valor === "centro") return "O texto fica no meio.";
  if (valor === "direita") return "O texto encosta à direita.";
  if (valor === "justificado") return "O texto estica até as duas margens.";
  return "Segue o alinhamento da página.";
}

function dicaTamanho(valor, titulo) {
  if (valor === "pequeno") return titulo ? "Título mais discreto." : "Texto mais compacto.";
  if (valor === "medio") return "Tamanho confortável para leitura.";
  if (valor === "grande") return titulo ? "Título bem visível, de chamada." : "Texto maior, mais fácil de ler de longe.";
  if (valor === "enorme") return "Título de capa, ocupa a faixa.";
  return "Usa o tamanho padrão deste bloco.";
}

export function metaAtributo(tipo, valor) {
  switch (tipo) {
    case "display":
      return { label: "Organizar as peças", dica: dicaDisplay(valor) };
    case "flexDirecao":
      return {
        label: "Direção da fileira",
        dica: valor === "column" ? "As peças caminham de cima para baixo." : "As peças caminham da esquerda para a direita.",
      };
    case "justify":
      return { label: "Distribuir na fileira", dica: dicaJustify(valor) };
    case "align":
      return { label: "Alinhar na altura", dica: dicaAlign(valor) };
    case "alignSelf":
      return { label: "Posição deste item", dica: dicaAlignSelf(valor) };
    case "flexQuebra":
      return {
        label: "Se não couber",
        dica: valor === "nowrap" ? "Tudo fica numa linha só, mesmo apertado." : "A peça que não couber desce para a linha de baixo.",
      };
    case "colunasGrade":
      return { label: "Colunas da grade", dica: `A grade passa a ter ${valor || 2} colunas iguais.` };
    case "gap":
      return {
        label: "Espaço entre as peças",
        dica: !valor ? "As peças se encostam." : `Afasta uma peça da outra em ${valor}px.`,
      };
    case "raio":
      return { label: "Cantos", dica: dicaRaio(valor) };
    case "minAltura":
      return {
        label: "Altura mínima",
        dica: !valor ? "A altura acompanha o conteúdo." : `O bloco não fica mais baixo que ${valor}px.`,
      };
    case "objectFit":
      return { label: "Encaixe da foto", dica: dicaObjectFit(valor) };
    case "itemLargura":
      return {
        label: "Largura da foto",
        dica: !valor ? "A foto usa a largura padrão." : `A foto fica com ${valor}px de largura.`,
      };
    case "margemCima":
      return { label: "Afastar o que está acima", dica: "Empurra os vizinhos de cima para longe, por fora do bloco." };
    case "margemBaixo":
      return { label: "Afastar o que está abaixo", dica: "Empurra os vizinhos de baixo para longe, por fora do bloco." };
    case "paddingCima":
      return { label: "Folga interna em cima", dica: "Abre espaço por dentro, no topo — o conteúdo desce." };
    case "paddingBaixo":
      return { label: "Folga interna embaixo", dica: "Abre espaço por dentro, na base — o conteúdo sobe." };
    case "paddingLados":
      return { label: "Folga interna nas laterais", dica: "Abre espaço por dentro, à esquerda e à direita." };
    case "alinhamento":
      return { label: "Alinhar o texto", dica: dicaAlinhamento(valor) };
    case "tamanhoTitulo":
      return { label: "Tamanho do título", dica: dicaTamanho(valor, true) };
    case "tamanhoTexto":
      return { label: "Tamanho do texto", dica: dicaTamanho(valor, false) };
    case "largura":
      return {
        label: "Largura da página",
        dica:
          valor === "estreita" ? "Coluna estreita, no centro."
            : valor === "larga" ? "Coluna larga, quase a tela toda."
              : valor === "completa" ? "O conteúdo vai de ponta a ponta."
                : "Largura média, confortável de ler.",
      };
    case "orientacao":
      return {
        label: "Direção do texto",
        dica: valor === "vertical" ? "O texto sobe na vertical, como uma lombada." : "O texto corre na horizontal, como sempre.",
      };
    default:
      return { label: tipo, dica: "" };
  }
}

function desenhoDisplay(valor) {
  if (valor === "block") {
    return (
      <>
        <Peca x={16} y={8} w={40} h={8} />
        <Peca x={16} y={18} w={40} h={8} fraca />
        <Peca x={16} y={28} w={40} h={8} />
      </>
    );
  }
  if (valor === "flex") {
    return (
      <>
        <Peca x={10} y={12} w={15} h={20} />
        <Peca x={28} y={12} w={15} h={20} ativo />
        <Peca x={46} y={12} w={15} h={20} />
      </>
    );
  }
  if (valor === "grid") {
    return (
      <>
        <Peca x={14} y={7} w={20} h={13} />
        <Peca x={38} y={7} w={20} h={13} />
        <Peca x={14} y={24} w={20} h={13} />
        <Peca x={38} y={24} w={20} h={13} />
      </>
    );
  }
  return (
    <>
      <rect x={14} y={8} width={44} height={28} rx={3} fill="none" stroke={COR.linha} strokeDasharray="3 2" />
      <Peca x={20} y={13} w={32} h={5} fraca />
      <Peca x={20} y={20} w={24} h={5} fraca />
      <Peca x={20} y={27} w={28} h={5} fraca />
    </>
  );
}

function desenhoDirecao(valor) {
  if (valor === "column") {
    return (
      <>
        <Peca x={24} y={6} w={24} h={9} />
        <Peca x={24} y={17.5} w={24} h={9} ativo />
        <Peca x={24} y={29} w={24} h={9} />
      </>
    );
  }
  return (
    <>
      <Peca x={8} y={12} w={16} h={20} />
      <Peca x={28} y={12} w={16} h={20} ativo />
      <Peca x={48} y={12} w={16} h={20} />
    </>
  );
}

function desenhoJustify(valor) {
  const w = 12;
  const h = 18;
  const y = 13;
  const xs = {
    "": [18, 30, 42],
    "flex-start": [8, 22, 36],
    center: [16, 30, 44],
    "flex-end": [24, 38, 52],
    "space-between": [8, 30, 52],
    "space-around": [11, 30, 49],
    "space-evenly": [10, 30, 50],
  };
  return (xs[valor] || xs[""]).map((x, i) => <Peca key={i} x={x} y={y} w={w} h={h} ativo={i === 1} />);
}

function desenhoAlign(valor) {
  const alturas = [12, 22, 16];
  const yDe = (h) => {
    if (valor === "flex-start") return 8;
    if (valor === "flex-end") return 36 - h;
    if (valor === "stretch") return 8;
    return 22 - h / 2;
  };
  return alturas.map((h, i) => {
    const altura = valor === "stretch" ? 28 : h;
    return <Peca key={i} x={12 + i * 16} y={yDe(altura)} w={12} h={altura} ativo={i === 1} />;
  });
}

function desenhoAlignSelf(valor) {
  const h = 12;
  const yDe = () => {
    if (valor === "flex-start") return 8;
    if (valor === "flex-end") return 24;
    if (valor === "stretch") return 8;
    return 16;
  };
  const altura = valor === "stretch" ? 28 : h;
  return (
    <>
      <Peca x={10} y={8} w={14} h={28} fraca />
      <Peca x={29} y={yDe()} w={14} h={altura} ativo />
      <Peca x={48} y={8} w={14} h={28} fraca />
    </>
  );
}

function desenhoQuebra(valor) {
  if (valor === "nowrap") {
    return (
      <>
        <Peca x={4} y={12} w={18} h={20} />
        <Peca x={24} y={12} w={18} h={20} />
        <Peca x={44} y={12} w={18} h={20} ativo />
        <Peca x={64} y={12} w={18} h={20} fraca />
      </>
    );
  }
  return (
    <>
      <Peca x={10} y={7} w={16} h={14} />
      <Peca x={28} y={7} w={16} h={14} />
      <Peca x={46} y={7} w={16} h={14} />
      <Peca x={10} y={24} w={16} h={14} ativo />
    </>
  );
}

function desenhoColunas(valor) {
  const n = Math.max(1, Number(valor) || 2);
  const gap = 3;
  const w = (52 - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => (
    <Peca key={i} x={10 + i * (w + gap)} y={8} w={w} h={28} ativo={i === 0} />
  ));
}

function desenhoGap(valor) {
  const gap = Math.max(2, Math.min(18, 3 + Number(valor || 0) * 0.22));
  const w = (48 - gap) / 2;
  return (
    <>
      <Peca x={12} y={10} w={w} h={24} />
      <rect x={12 + w} y={10} width={gap} height={24} fill={COR.faixa} />
      <Peca x={12 + w + gap} y={10} w={w} h={24} />
    </>
  );
}

function desenhoRaio(valor) {
  const n = valor === "" || valor == null ? 8 : Math.min(16, Number(valor) / 3);
  return <rect x={16} y={8} width={40} height={28} rx={n} fill={COR.peca} />;
}

function desenhoMinAltura(valor) {
  const h = valor ? Math.max(14, Math.min(30, 12 + Number(valor) * 0.03)) : 16;
  const y = 22 - h / 2;
  return (
    <>
      <Peca x={22} y={y} w={28} h={h} ativo />
      <path d={`M18 ${y} V${y + h} M54 ${y} V${y + h}`} stroke={COR.ativo} strokeWidth="1.2" />
    </>
  );
}

function desenhoObjectFit(valor, clipId) {
  const box = <rect x="22" y="6" width="28" height="32" rx="2" fill="none" stroke={COR.linha} />;
  if (valor === "contain") {
    return (
      <>
        {box}
        <rect x="25" y="14" width="22" height="16" rx="1.5" fill={COR.peca} />
        <circle cx="31" cy="19" r="2" fill={COR.ativo} />
      </>
    );
  }
  if (valor === "fill") {
    return (
      <>
        {box}
        <rect x="22" y="6" width="28" height="32" rx="2" fill={COR.peca} />
        <circle cx="30" cy="16" r="3.5" fill={COR.ativo} />
      </>
    );
  }
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x="22" y="6" width="28" height="32" rx="2" />
        </clipPath>
      </defs>
      {box}
      <g clipPath={`url(#${clipId})`}>
        <rect x="14" y="4" width="44" height="36" fill={COR.peca} />
        <circle cx="28" cy="16" r="4" fill={COR.ativo} />
      </g>
    </>
  );
}

function desenhoLarguraFoto(valor) {
  const w = valor ? Math.max(16, Math.min(52, Number(valor) * 0.07)) : 36;
  return <Peca x={36 - w / 2} y={8} w={w} h={28} r={3} ativo />;
}

function desenhoEspaco(tipo, valor) {
  const n = Math.max(3, Math.min(12, 3 + Number(valor || 0) * 0.1));
  const inner = { x: 18, y: 10, w: 36, h: 24 };
  if (tipo === "margemCima") {
    return (
      <>
        <rect x={inner.x} y={inner.y - n} width={inner.w} height={n} fill={COR.margem} />
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={2} fill={COR.peca} />
      </>
    );
  }
  if (tipo === "margemBaixo") {
    return (
      <>
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={2} fill={COR.peca} />
        <rect x={inner.x} y={inner.y + inner.h} width={inner.w} height={n} fill={COR.margem} />
      </>
    );
  }
  if (tipo === "paddingCima") {
    return (
      <>
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={2} fill={COR.peca} />
        <rect x={inner.x + 4} y={inner.y} width={inner.w - 8} height={n} fill={COR.faixa} />
      </>
    );
  }
  if (tipo === "paddingBaixo") {
    return (
      <>
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={2} fill={COR.peca} />
        <rect x={inner.x + 4} y={inner.y + inner.h - n} width={inner.w - 8} height={n} fill={COR.faixa} />
      </>
    );
  }
  return (
    <>
      <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={2} fill={COR.peca} />
      <rect x={inner.x} y={inner.y + 4} width={n} height={inner.h - 8} fill={COR.faixa} />
      <rect x={inner.x + inner.w - n} y={inner.y + 4} width={n} height={inner.h - 8} fill={COR.faixa} />
    </>
  );
}

function desenhoTamanho(valor, titulo) {
  const mapa = { "": 10, pequeno: 8, medio: 12, grande: 16, enorme: 20 };
  const h = mapa[valor] || (titulo ? 14 : 10);
  return (
    <>
      <Peca x={12} y={22 - h / 2} w={h * 0.7} h={h} r={1.5} ativo />
      <Peca x={16 + h * 0.7} y={26} w={36} h={3} fraca />
      <Peca x={16 + h * 0.7} y={31} w={28} h={3} fraca />
    </>
  );
}

function desenhoLarguraPagina(valor) {
  const mapa = { estreita: 22, media: 34, larga: 48, completa: 60 };
  const w = mapa[valor] || 34;
  return (
    <>
      <rect x="6" y="8" width="60" height="28" rx="3" fill="none" stroke={COR.linha} />
      <Peca x={36 - w / 2} y={12} w={w} h={20} r={2} ativo />
    </>
  );
}

function desenhoOrientacao(valor) {
  if (valor === "vertical") {
    return (
      <>
        <Peca x={32} y={8} w={4} h={28} />
        <Peca x={38} y={8} w={4} h={20} fraca />
      </>
    );
  }
  return (
    <>
      <Peca x={14} y={16} w={44} h={4} />
      <Peca x={14} y={24} w={32} h={4} fraca />
    </>
  );
}

export function DicaAtributo({ tipo, valor }) {
  const uid = useId().replace(/:/g, "");
  let miolo;
  if (tipo === "display") miolo = desenhoDisplay(valor);
  else if (tipo === "flexDirecao") miolo = desenhoDirecao(valor);
  else if (tipo === "justify") miolo = desenhoJustify(valor);
  else if (tipo === "align") miolo = desenhoAlign(valor);
  else if (tipo === "alignSelf") miolo = desenhoAlignSelf(valor);
  else if (tipo === "flexQuebra") miolo = desenhoQuebra(valor);
  else if (tipo === "colunasGrade") miolo = desenhoColunas(valor);
  else if (tipo === "gap") miolo = desenhoGap(valor);
  else if (tipo === "raio") miolo = desenhoRaio(valor);
  else if (tipo === "minAltura") miolo = desenhoMinAltura(valor);
  else if (tipo === "objectFit") miolo = desenhoObjectFit(valor, `${uid}-fit`);
  else if (tipo === "itemLargura") miolo = desenhoLarguraFoto(valor);
  else if (tipo === "alinhamento") miolo = linhasTexto(valor);
  else if (tipo === "tamanhoTitulo") miolo = desenhoTamanho(valor, true);
  else if (tipo === "tamanhoTexto") miolo = desenhoTamanho(valor, false);
  else if (tipo === "largura") miolo = desenhoLarguraPagina(valor);
  else if (tipo === "orientacao") miolo = desenhoOrientacao(valor);
  else if (tipo.startsWith("margem") || tipo.startsWith("padding")) miolo = desenhoEspaco(tipo, valor);
  else miolo = null;

  return <Quadro clipId={tipo === "flexQuebra" && valor === "nowrap" ? `${uid}-nowrap` : undefined}>{miolo}</Quadro>;
}

export function DicaCaixa({ zona = "conteudo", props = {} }) {
  const mCima = Math.max(4, Math.min(14, 4 + Number(props.margemCima || 0) * 0.08));
  const mBaixo = Math.max(4, Math.min(14, 4 + Number(props.margemBaixo || 0) * 0.08));
  const pCima = Math.max(4, Math.min(12, 4 + Number(props.paddingCima || 24) * 0.08));
  const pBaixo = Math.max(4, Math.min(12, 4 + Number(props.paddingBaixo || 24) * 0.08));
  const pLado = Math.max(4, Math.min(14, 4 + Number(props.paddingLados || 20) * 0.1));
  const margemAtiva = zona.startsWith("margem");
  const paddingAtivo = zona.startsWith("padding");

  return (
    <svg viewBox="0 0 160 88" className="dica-caixa" aria-hidden>
      <rect x="0.5" y="0.5" width="159" height="87" rx="8" fill={COR.fundo} stroke={COR.borda} />
      <rect x="10" y="10" width="140" height="68" rx="5" fill={margemAtiva ? COR.margem : "rgba(214,138,58,0.18)"} />
      <rect x="12" y={10 + mCima} width="136" height={64 - mCima - mBaixo} rx="4" fill={paddingAtivo ? COR.faixa : "rgba(74,159,212,0.22)"} />
      <rect
        x={12 + pLado}
        y={10 + mCima + pCima}
        width={132 - pLado * 2}
        height={60 - mCima - mBaixo - pCima - pBaixo}
        rx="3"
        fill={COR.peca}
      />
      <text x="80" y="18" textAnchor="middle" fill="#7a5a30" fontSize="8">margem</text>
      <text x="80" y="48" textAnchor="middle" fill="#fff" fontSize="8">conteúdo</text>
      {zona === "margemCima" && <rect x="12" y="10" width="136" height={mCima} fill={COR.ativo} opacity="0.55" />}
      {zona === "margemBaixo" && <rect x="12" y={78 - mBaixo} width="136" height={mBaixo} fill={COR.ativo} opacity="0.55" />}
      {zona === "paddingCima" && <rect x={12 + pLado} y={10 + mCima} width={132 - pLado * 2} height={pCima} fill={COR.ativo} opacity="0.55" />}
      {zona === "paddingBaixo" && <rect x={12 + pLado} y={70 - mBaixo - pBaixo} width={132 - pLado * 2} height={pBaixo} fill={COR.ativo} opacity="0.55" />}
      {zona === "paddingLados" && (
        <>
          <rect x="12" y={10 + mCima} width={pLado} height={60 - mCima - mBaixo} fill={COR.ativo} opacity="0.55" />
          <rect x={148 - pLado} y={10 + mCima} width={pLado} height={60 - mCima - mBaixo} fill={COR.ativo} opacity="0.55" />
        </>
      )}
    </svg>
  );
}
