import * as Lucide from "lucide-react";

export const ANIMACOES_ICONE = [
  { id: "nenhuma", nome: "Nenhuma" },
  { id: "flutuar", nome: "Flutuar" },
  { id: "pulso", nome: "Pulso" },
  { id: "girar", nome: "Girar" },
  { id: "pular", nome: "Pular" },
];

export const ICONES_CATALOGO = [
  "Instagram", "Youtube", "Twitter", "Linkedin", "Github", "Facebook", "Twitch",
  "Mail", "Send", "Phone", "MessageCircle", "AtSign",
  "Globe", "Link", "Share2", "MapPin", "Navigation", "Home",
  "Camera", "Image", "Video", "Music", "Headphones", "Mic", "Podcast", "Play",
  "Heart", "Star", "Sparkles", "Award", "Bookmark",
  "User", "Users", "Briefcase", "Calendar", "Clock", "Coffee",
  "ShoppingBag", "CreditCard", "Wallet",
  "BookOpen", "FileText", "Quote", "Palette", "PenTool",
  "Zap", "Sun", "Moon", "Leaf", "Cloud",
  "Shield", "Lock", "Wifi", "Download", "ArrowRight", "Check",
];

export function iconePadrao(extras = {}) {
  return {
    id: crypto.randomUUID(),
    nome: "Heart",
    cor: "#ffffff",
    fundo: "#0071e3",
    tamanho: 22,
    raio: 18,
    padding: 12,
    traco: 2,
    animacao: "nenhuma",
    url: "",
    novaAba: true,
    hoverFundo: "#0058b0",
    hoverCor: "#ffffff",
    hoverEscala: 1.08,
    hoverSombra: true,
    ...extras,
  };
}

export function IconeLucide({ nome, size = 22, color = "currentColor", strokeWidth = 2 }) {
  const Comp = Lucide[nome];
  if (!Comp) return <Lucide.HelpCircle size={size} color={color} strokeWidth={strokeWidth} />;
  return <Comp size={size} color={color} strokeWidth={strokeWidth} />;
}

export function classeAnimacaoIcone(animacao) {
  if (animacao === "flutuar") return "anim-flutuar";
  if (animacao === "pulso") return "anim-pulso";
  if (animacao === "girar") return "anim-girar";
  if (animacao === "pular") return "anim-pular";
  return "";
}
