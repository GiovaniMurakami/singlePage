import { ehTipoEstrutura, nomeDoTipo } from "./templates";

function ehGrade(bloco) {
  return bloco?.tipo === "grade";
}

function ehContainer(bloco) {
  return bloco?.tipo === "secao" || bloco?.tipo === "faixa";
}

export function acharBloco(blocos, id) {
  const ctx = contextoDoAlvo(blocos, id);
  return ctx?.kind === "bloco" ? ctx.bloco : null;
}

export function contextoDoAlvo(blocos, id, caminho = []) {
  if (!id) return null;
  for (const bloco of blocos || []) {
    const aqui = [...caminho, { id: bloco.id, tipo: bloco.tipo, titulo: bloco.props?.titulo || "" }];
    if (bloco.id === id) return { kind: "bloco", bloco, caminho };
    if (ehGrade(bloco)) {
      for (let indice = 0; indice < (bloco.props.celulas || []).length; indice += 1) {
        const celula = bloco.props.celulas[indice];
        if (celula.id === id) return { kind: "celula", bloco, celula, indice, caminho: aqui };
        const nested = contextoDoAlvo(celula.blocos, id, aqui);
        if (nested) return nested;
      }
    }
    if (ehContainer(bloco)) {
      const nested = contextoDoAlvo(bloco.props.blocos, id, aqui);
      if (nested) return nested;
    }
  }
  return null;
}

export function listaIrmaos(blocos, id) {
  if ((blocos || []).some((bloco) => bloco.id === id)) return blocos;
  for (const bloco of blocos || []) {
    if (ehGrade(bloco)) {
      for (const celula of bloco.props.celulas || []) {
        const irmaos = listaIrmaos(celula.blocos, id);
        if (irmaos) return irmaos;
      }
    }
    if (ehContainer(bloco)) {
      const irmaos = listaIrmaos(bloco.props.blocos, id);
      if (irmaos) return irmaos;
    }
  }
  return null;
}

function mapearArvore(blocos, fn) {
  return (blocos || []).map((bloco) => {
    const proximo = fn(bloco);
    if (ehGrade(proximo)) {
      return {
        ...proximo,
        props: {
          ...proximo.props,
          celulas: (proximo.props.celulas || []).map((celula) => ({
            ...celula,
            blocos: mapearArvore(celula.blocos, fn),
          })),
        },
      };
    }
    if (ehContainer(proximo)) {
      return { ...proximo, props: { ...proximo.props, blocos: mapearArvore(proximo.props.blocos, fn) } };
    }
    return proximo;
  });
}

export function substituirBloco(blocos, proximo) {
  return mapearArvore(blocos, (bloco) => (bloco.id === proximo.id ? proximo : bloco));
}

export function removerBloco(blocos, id) {
  return (blocos || [])
    .filter((bloco) => bloco.id !== id)
    .map((bloco) => {
      if (ehGrade(bloco)) {
        return {
          ...bloco,
          props: {
            ...bloco.props,
            celulas: (bloco.props.celulas || []).map((celula) => ({
              ...celula,
              blocos: removerBloco(celula.blocos, id),
            })),
          },
        };
      }
      if (ehContainer(bloco)) {
        return { ...bloco, props: { ...bloco.props, blocos: removerBloco(bloco.props.blocos, id) } };
      }
      return bloco;
    });
}

function retirar(blocos, id, extraido) {
  const lista = [];
  for (const bloco of blocos || []) {
    if (bloco.id === id) {
      extraido.bloco = bloco;
      continue;
    }
    if (ehGrade(bloco)) {
      lista.push({
        ...bloco,
        props: {
          ...bloco.props,
          celulas: (bloco.props.celulas || []).map((celula) => ({
            ...celula,
            blocos: retirar(celula.blocos, id, extraido),
          })),
        },
      });
      continue;
    }
    if (ehContainer(bloco)) {
      lista.push({ ...bloco, props: { ...bloco.props, blocos: retirar(bloco.props.blocos, id, extraido) } });
      continue;
    }
    lista.push(bloco);
  }
  return lista;
}

export function inserirAoLado(blocos, novo, destinoId, posicao) {
  const indice = (blocos || []).findIndex((bloco) => bloco.id === destinoId);
  if (indice >= 0) {
    const lista = [...blocos];
    lista.splice(posicao === "depois" ? indice + 1 : indice, 0, novo);
    return lista;
  }
  return (blocos || []).map((bloco) => {
    if (ehGrade(bloco)) {
      return {
        ...bloco,
        props: {
          ...bloco.props,
          celulas: (bloco.props.celulas || []).map((celula) => ({
            ...celula,
            blocos: inserirAoLado(celula.blocos, novo, destinoId, posicao),
          })),
        },
      };
    }
    if (ehContainer(bloco)) {
      return { ...bloco, props: { ...bloco.props, blocos: inserirAoLado(bloco.props.blocos, novo, destinoId, posicao) } };
    }
    return bloco;
  });
}

export function inserirNoContainer(blocos, containerId, novo) {
  return (blocos || []).map((bloco) => {
    if (ehContainer(bloco) && bloco.id === containerId) {
      return { ...bloco, props: { ...bloco.props, blocos: [...(bloco.props.blocos || []), novo] } };
    }
    if (ehGrade(bloco)) {
      return {
        ...bloco,
        props: {
          ...bloco.props,
          celulas: (bloco.props.celulas || []).map((celula) => ({
            ...celula,
            blocos: inserirNoContainer(celula.blocos, containerId, novo),
          })),
        },
      };
    }
    if (ehContainer(bloco)) {
      return { ...bloco, props: { ...bloco.props, blocos: inserirNoContainer(bloco.props.blocos, containerId, novo) } };
    }
    return bloco;
  });
}

export function inserirNaCelula(blocos, celulaId, novo) {
  return (blocos || []).map((bloco) => {
    if (ehGrade(bloco)) {
      return {
        ...bloco,
        props: {
          ...bloco.props,
          celulas: (bloco.props.celulas || []).map((celula) => {
            if (celula.id === celulaId) return { ...celula, blocos: [...(celula.blocos || []), novo] };
            return { ...celula, blocos: inserirNaCelula(celula.blocos, celulaId, novo) };
          }),
        },
      };
    }
    if (ehContainer(bloco) && bloco.id === celulaId) {
      return { ...bloco, props: { ...bloco.props, blocos: [...(bloco.props.blocos || []), novo] } };
    }
    if (ehContainer(bloco)) {
      return { ...bloco, props: { ...bloco.props, blocos: inserirNaCelula(bloco.props.blocos, celulaId, novo) } };
    }
    return bloco;
  });
}

export function destinoDaInsercao(blocos, selecionadoId, tipo) {
  const ctx = contextoDoAlvo(blocos, selecionadoId);
  if (tipo === "secao") {
    if (!ctx) return { modo: "fim" };
    const topo = ctx.caminho[0]?.id || ctx.bloco.id;
    return { modo: "lado", destinoId: topo, posicao: "depois" };
  }
  if (tipo === "grade" || tipo === "faixa") {
    if (ctx?.kind === "bloco" && ctx.bloco.tipo === "secao") {
      return { modo: "dentro", containerId: ctx.bloco.id };
    }
    const secao = (ctx?.caminho || []).find((no) => no.tipo === "secao");
    if (secao) return { modo: "dentro", containerId: secao.id };
    if (!ctx) return { modo: "fim" };
    const destinoId = ctx.caminho[0]?.id || ctx.bloco.id;
    return { modo: "lado", destinoId, posicao: "depois" };
  }
  if (ctx?.kind === "celula") return { modo: "celula", celulaId: ctx.celula.id };
  if (ctx?.bloco?.tipo === "grade") {
    const celulas = ctx.bloco.props.celulas || [];
    const vazia = celulas.find((celula) => !(celula.blocos || []).length) || celulas[celulas.length - 1];
    if (vazia) return { modo: "celula", celulaId: vazia.id };
  }
  if (ctx?.bloco?.tipo === "secao" || ctx?.bloco?.tipo === "faixa") {
    return { modo: "dentro", containerId: ctx.bloco.id };
  }
  if (ctx?.kind === "bloco") return { modo: "lado", destinoId: ctx.bloco.id, posicao: "depois" };
  return { modo: "fim" };
}

export function rotuloDestino(blocos, selecionadoId, tipo) {
  const destino = destinoDaInsercao(blocos, selecionadoId, tipo || "texto");
  if (destino.modo === "celula") {
    const ctx = contextoDoAlvo(blocos, destino.celulaId);
    return `Entra na coluna ${(ctx?.indice ?? 0) + 1}`;
  }
  if (destino.modo === "dentro") {
    const ctx = contextoDoAlvo(blocos, destino.containerId);
    if (ctx?.bloco?.tipo === "secao") return `Entra na seção${ctx.bloco.props?.titulo ? ` “${ctx.bloco.props.titulo}”` : ""}`;
    return "Entra na faixa";
  }
  if (destino.modo === "lado") return "Entra abaixo do selecionado";
  return "Entra no fim da página";
}

export function inserirPorDestino(blocos, novo, destino) {
  if (!destino || destino.modo === "fim") return [...(blocos || []), novo];
  if (destino.modo === "celula") return inserirNaCelula(blocos, destino.celulaId, novo);
  if (destino.modo === "dentro") return inserirNoContainer(blocos, destino.containerId, novo);
  if (destino.modo === "lado") return inserirAoLado(blocos, novo, destino.destinoId, destino.posicao);
  return blocos;
}

export function moverBlocoArvore(blocos, origemId, destinoId, posicao) {
  if (!origemId || origemId === destinoId) return blocos;
  const extraido = { bloco: null };
  const sem = retirar(blocos, origemId, extraido);
  if (!extraido.bloco) return blocos;
  if (!destinoId) return [...sem, extraido.bloco];
  return inserirAoLado(sem, extraido.bloco, destinoId, posicao);
}

export function moverParaCelula(blocos, origemId, celulaId) {
  if (!origemId || !celulaId) return blocos;
  const extraido = { bloco: null };
  const sem = retirar(blocos, origemId, extraido);
  if (!extraido.bloco) return blocos;
  if (ehTipoEstrutura(extraido.bloco.tipo)) return [...sem, extraido.bloco];
  return inserirNaCelula(sem, celulaId, extraido.bloco);
}

export function moverParaContainer(blocos, origemId, containerId) {
  if (!origemId || !containerId || origemId === containerId) return blocos;
  const extraido = { bloco: null };
  const sem = retirar(blocos, origemId, extraido);
  if (!extraido.bloco) return blocos;
  if (extraido.bloco.tipo === "secao") return blocos;
  return inserirNoContainer(sem, containerId, extraido.bloco);
}

export function trocarIrmaos(blocos, id, dir) {
  const indice = (blocos || []).findIndex((bloco) => bloco.id === id);
  if (indice >= 0) {
    const destino = indice + dir;
    if (destino < 0 || destino >= blocos.length) return blocos;
    const lista = [...blocos];
    [lista[indice], lista[destino]] = [lista[destino], lista[indice]];
    return lista;
  }
  return (blocos || []).map((bloco) => {
    if (ehGrade(bloco)) {
      return {
        ...bloco,
        props: {
          ...bloco.props,
          celulas: (bloco.props.celulas || []).map((celula) => ({
            ...celula,
            blocos: trocarIrmaos(celula.blocos, id, dir),
          })),
        },
      };
    }
    if (ehContainer(bloco)) {
      return { ...bloco, props: { ...bloco.props, blocos: trocarIrmaos(bloco.props.blocos, id, dir) } };
    }
    return bloco;
  });
}

export function clonarBloco(bloco) {
  const copia = JSON.parse(JSON.stringify(bloco));
  const renovar = (no) => {
    if (no.id) no.id = crypto.randomUUID();
    (no.props?.celulas || []).forEach((celula) => {
      celula.id = crypto.randomUUID();
      (celula.blocos || []).forEach(renovar);
    });
    (no.props?.blocos || []).forEach(renovar);
  };
  renovar(copia);
  return copia;
}

export function duplicarBloco(blocos, id) {
  const ctx = contextoDoAlvo(blocos, id);
  if (!ctx || ctx.kind !== "bloco") return { blocos, novoId: null };
  const copia = clonarBloco(ctx.bloco);
  return { blocos: inserirAoLado(blocos, copia, id, "depois"), novoId: copia.id };
}

export function listarArvore(blocos) {
  return (blocos || []).map((bloco) => {
    if (ehGrade(bloco)) {
      return {
        id: bloco.id,
        tipo: "grade",
        nome: "Colunas",
        filhos: (bloco.props.celulas || []).map((celula, indice) => ({
          id: celula.id,
          tipo: "celula",
          nome: `Coluna ${indice + 1}`,
          filhos: listarArvore(celula.blocos),
        })),
      };
    }
    if (ehContainer(bloco)) {
      return {
        id: bloco.id,
        tipo: bloco.tipo,
        nome: bloco.props.titulo || (bloco.tipo === "secao" ? "Seção" : "Faixa"),
        filhos: listarArvore(bloco.props.blocos),
      };
    }
    return {
      id: bloco.id,
      tipo: bloco.tipo,
      nome: bloco.props.titulo || bloco.props.texto || nomeDoTipo(bloco.tipo),
      filhos: [],
    };
  });
}

export function caminhoDoAlvo(blocos, id) {
  const ctx = contextoDoAlvo(blocos, id);
  if (!ctx) return [];
  const itens = ctx.caminho.map((no) => ({
    id: no.id,
    nome: no.titulo || nomeDoTipo(no.tipo),
  }));
  if (ctx.kind === "celula") {
    itens.push({ id: ctx.celula.id, nome: `Coluna ${ctx.indice + 1}` });
  } else {
    itens.push({
      id: ctx.bloco.id,
      nome: ctx.bloco.props?.titulo || ctx.bloco.props?.texto || nomeDoTipo(ctx.bloco.tipo),
    });
  }
  return itens;
}

export function templateColunas(colunas, proporcao) {
  if (colunas === 3) return "1fr 1fr 1fr";
  if (colunas === 4) return "1fr 1fr 1fr 1fr";
  if (proporcao === "esquerda") return "1.45fr 1fr";
  if (proporcao === "direita") return "1fr 1.45fr";
  return "1fr 1fr";
}
