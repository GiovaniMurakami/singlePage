const PASSOS = [
  { n: 1, nome: "Estrutura", dica: "Na esquerda: seção, depois colunas. A seção segura o que vem dentro." },
  { n: 2, nome: "Peças", dica: "Clique numa coluna vazia e coloque texto, foto ou botão." },
  { n: 3, nome: "Clique", dica: "No meio: clique na seção, na coluna ou na peça. A árvore à esquerda também seleciona." },
  { n: 4, nome: "Ajustes", dica: "Na direita: texto, link, cor e foto do que está selecionado." },
];

export function GuiaEditor({ passoAtivo = 1, onFechar }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper-2 px-4 py-2.5">
      <p className="mr-2 text-xs font-medium text-muted">Como usar</p>
      {PASSOS.map((passo) => {
        const ativo = passo.n === passoAtivo;
        const feito = passo.n < passoAtivo;
        return (
          <div
            key={passo.n}
            className={`max-w-xs rounded-2xl px-3 py-1.5 text-xs leading-4 ${
              ativo ? "bg-accent text-white" : feito ? "bg-accent-soft text-accent" : "bg-paper text-muted"
            }`}
            title={passo.dica}
          >
            <strong className="mr-1">{passo.n}.</strong>
            {passo.nome}
            {ativo && <span className="mt-0.5 block font-normal opacity-90">{passo.dica}</span>}
          </div>
        );
      })}
      {onFechar && (
        <button type="button" className="ml-auto text-xs text-muted hover:text-ink" onClick={onFechar}>
          Entendi
        </button>
      )}
    </div>
  );
}
