export function Tooltip({ passo, titulo, texto, children, lado = "baixo" }) {
  const posicao = {
    baixo: "left-0 top-full mt-2",
    direita: "left-full top-0 ml-2",
    esquerda: "right-full top-0 mr-2",
  }[lado];

  return (
    <div className="group/tip relative">
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-20 w-64 rounded-2xl bg-ink px-3 py-2.5 text-left text-xs leading-5 text-paper opacity-0 shadow-xl transition group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${posicao}`}
      >
        {passo && <p className="mb-0.5 font-semibold text-[#7dd3fc]">Passo {passo}</p>}
        <p className="font-medium">{titulo}</p>
        <p className="mt-0.5 text-white/70">{texto}</p>
      </div>
    </div>
  );
}
