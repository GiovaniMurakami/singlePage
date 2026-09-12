const PASSOS = [
  { n: 1, nome: "Adicionar", dica: "Passe o mouse entre dois blocos e clique no + para colocar algo naquele lugar." },
  { n: 2, nome: "Clicar", dica: "Clique direto no que quer mudar: a foto, o título ou o botão. O nome aparece ao passar o mouse." },
  { n: 3, nome: "Ajustar", dica: "O painel da direita muda só o que está selecionado. Ctrl+Z desfaz, Delete apaga." },
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
            className={`max-w-sm rounded-2xl px-3 py-1.5 text-xs leading-4 ${
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
