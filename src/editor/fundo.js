export const DEGRADES_PRONTOS = [
  { nome: "Noite", de: "#0b0b10", para: "#312e81", angulo: 165, tipo: "linear" },
  { nome: "Pôr do sol", de: "#fb7185", para: "#f59e0b", angulo: 140, tipo: "linear" },
  { nome: "Oceano", de: "#022c22", para: "#38bdf8", angulo: 160, tipo: "linear" },
  { nome: "Lilás", de: "#5b21b6", para: "#f5d0fe", angulo: 150, tipo: "linear" },
  { nome: "Papel", de: "#f8fafc", para: "#cbd5e1", angulo: 180, tipo: "linear" },
  { nome: "Halo", de: "#fff7ed", para: "#7c3aed", angulo: 180, tipo: "radial" },
];

export function modoFundo(fonte = {}) {
  if (fonte.fundoModo) return fonte.fundoModo;
  if (fonte.fundoImagem) return "imagem";
  if (fonte.fundoDe || fonte.fundoPara) return "degrade";
  return "solido";
}

export function temFundoProprio(fonte = {}) {
  const modo = modoFundo(fonte);
  if (modo === "degrade" && (fonte.fundoDe || fonte.fundoPara)) return true;
  if (modo === "imagem" && fonte.fundoImagem) return true;
  return Boolean(fonte.corFundo);
}

export function corBaseFundo(fonte = {}, fallback = "#f5f5f7") {
  if (modoFundo(fonte) === "degrade") return fonte.fundoDe || fonte.fundo || fonte.corFundo || fallback;
  return fonte.fundo || fonte.corFundo || fallback;
}

export function cssFundo(fonte = {}, corKey = "fundo") {
  const modo = modoFundo(fonte);
  const cor = fonte[corKey] || fonte.corFundo;
  if (modo === "degrade") {
    const de = fonte.fundoDe || cor || "#0b0b10";
    const para = fonte.fundoPara || "#155eff";
    if (fonte.fundoDegradeTipo === "radial") {
      return { backgroundImage: `radial-gradient(circle at 50% 8%, ${de}, ${para})` };
    }
    return { backgroundImage: `linear-gradient(${fonte.fundoAngulo ?? 160}deg, ${de}, ${para})` };
  }
  if (modo === "imagem" && fonte.fundoImagem) {
    const overlay = fonte.fundoOverlay;
    const img = `url("${fonte.fundoImagem}")`;
    return {
      backgroundImage: overlay ? `linear-gradient(${overlay}, ${overlay}), ${img}` : img,
      backgroundSize: fonte.fundoAjuste === "repeat" ? "auto" : (fonte.fundoAjuste || "cover"),
      backgroundPosition: fonte.fundoPosicao || "center",
      backgroundRepeat: fonte.fundoAjuste === "repeat" ? "repeat" : "no-repeat",
    };
  }
  if (cor) return { background: cor };
  return {};
}
