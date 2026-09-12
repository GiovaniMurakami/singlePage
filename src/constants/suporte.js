export const EMAIL_SUPORTE = "giovani.murakami@outlook.com";

export const ASSUNTOS_AJUDA = [
  { id: "publicar", rotulo: "Não consigo publicar" },
  { id: "editor", rotulo: "Dúvida no editor" },
  { id: "modelo", rotulo: "Quero um modelo diferente" },
  { id: "plano", rotulo: "Plano e pagamento" },
  { id: "sob-medida", rotulo: "Site completo / reunião" },
  { id: "dominio", rotulo: "Domínio ou endereço da página" },
  { id: "formulario", rotulo: "Formulário / e-mail" },
  { id: "outro", rotulo: "Outro" },
];

export function mailtoReuniaoSobMedida() {
  const params = new URLSearchParams({
    subject: "Single — reunião para site completo",
    body: [
      "Quero um site completo, com backend e features personalizadas.",
      "",
      "Nome:",
      "Empresa / projeto:",
      "O que o site precisa fazer:",
      "Quando podemos conversar:",
    ].join("\n"),
  });
  return `mailto:${EMAIL_SUPORTE}?${params.toString()}`;
}
