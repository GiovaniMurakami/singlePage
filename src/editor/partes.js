const SEPARADOR = "::";

export function idParte(blocoId, parteId) {
  return `${blocoId}${SEPARADOR}${parteId}`;
}

export function separarAlvo(id) {
  if (!id) return { blocoId: null, parteId: null };
  const [blocoId, parteId] = String(id).split(SEPARADOR);
  return { blocoId, parteId: parteId || null };
}

const PARTES_FIXAS = {
  capa: [
    { id: "foto", nome: "Foto", dica: "A imagem redonda do topo" },
    { id: "titulo", nome: "Título", dica: "O nome em letra grande" },
    { id: "subtitulo", nome: "Frase", dica: "A linha logo abaixo do título" },
    { id: "botao", nome: "Botão", dica: "Para onde a pessoa clica" },
  ],
  texto: [
    { id: "titulo", nome: "Título", dica: "O nome deste trecho" },
    { id: "corpo", nome: "Parágrafo", dica: "O texto corrido" },
  ],
  imagem: [
    { id: "imagem", nome: "Foto", dica: "A imagem em si" },
    { id: "legenda", nome: "Legenda", dica: "A linha embaixo da foto" },
  ],
  formulario: [
    { id: "titulo", nome: "Título", dica: "O convite acima dos campos" },
    { id: "campos", nome: "Campos", dica: "O que a pessoa preenche" },
    { id: "botao", nome: "Botão de enviar", dica: "O texto do botão" },
  ],
  secao: [
    { id: "titulo", nome: "Título da seção", dica: "Aparece acima do conteúdo" },
    { id: "subtitulo", nome: "Subtítulo", dica: "Uma linha de apoio" },
  ],
  faixa: [
    { id: "titulo", nome: "Título da faixa" },
    { id: "subtitulo", nome: "Subtítulo" },
  ],
};

const PARTES_LISTA = {
  botoes: { chave: "itens", nome: (item, indice) => item?.rotulo || `Botão ${indice + 1}`, dica: "Um link" },
  galeria: { chave: "urls", nome: (_item, indice) => `Foto ${indice + 1}`, dica: "Uma foto da galeria" },
  redes: { chave: "itens", nome: (item, indice) => item?.rotulo || `Rede ${indice + 1}`, dica: "Um link de rede" },
  icones: { chave: "itens", nome: (item, indice) => item?.nome || `Ícone ${indice + 1}`, dica: "Um ícone" },
  cartoes: { chave: "itens", nome: (item, indice) => item?.titulo || `Cartão ${indice + 1}`, dica: "Um cartão" },
  depoimentos: { chave: "itens", nome: (item, indice) => item?.autor || `Depoimento ${indice + 1}`, dica: "Uma frase" },
  navegacao: { chave: "itens", nome: (item, indice) => item?.rotulo || `Item ${indice + 1}`, dica: "Um item do menu" },
};

export function indiceDaParte(parteId) {
  const casa = /^item-(\d+)$/.exec(parteId || "");
  return casa ? Number(casa[1]) : null;
}

export function partesDoBloco(bloco) {
  if (!bloco) return [];
  const fixas = PARTES_FIXAS[bloco.tipo];
  if (fixas) return fixas;
  const lista = PARTES_LISTA[bloco.tipo];
  if (!lista) return [];
  return (bloco.props?.[lista.chave] || []).map((item, indice) => ({
    id: `item-${indice}`,
    nome: lista.nome(item, indice),
    dica: lista.dica,
  }));
}

export function parteDoBloco(bloco, parteId) {
  if (!parteId) return null;
  return partesDoBloco(bloco).find((parte) => parte.id === parteId) || null;
}

const CAMPOS_DA_PARTE = {
  capa: {
    foto: { fotoUrl: "" },
    titulo: { titulo: "" },
    subtitulo: { subtitulo: "" },
    botao: { cta: "", url: "" },
  },
  texto: { titulo: { titulo: "" }, corpo: { corpo: "" } },
  imagem: { imagem: { url: "" }, legenda: { caption: "" } },
  formulario: { titulo: { titulo: "" } },
  secao: { titulo: { titulo: "" }, subtitulo: { subtitulo: "" } },
  faixa: { titulo: { titulo: "" }, subtitulo: { subtitulo: "" } },
};

/** Remove a parte: item de lista sai da lista, campo fixo volta a vazio. */
export function removerParteDoBloco(bloco, parteId) {
  if (!bloco || !parteId) return bloco;
  const indice = indiceDaParte(parteId);
  const lista = PARTES_LISTA[bloco.tipo];
  if (indice !== null && lista) {
    const itens = bloco.props?.[lista.chave] || [];
    return {
      ...bloco,
      props: { ...bloco.props, [lista.chave]: itens.filter((_item, i) => i !== indice) },
    };
  }
  const limpeza = CAMPOS_DA_PARTE[bloco.tipo]?.[parteId];
  if (!limpeza) return bloco;
  return { ...bloco, props: { ...bloco.props, ...limpeza } };
}

export function podeRemoverParte(bloco, parteId) {
  if (!bloco || !parteId) return false;
  if (indiceDaParte(parteId) !== null) return true;
  return Boolean(CAMPOS_DA_PARTE[bloco.tipo]?.[parteId]);
}
