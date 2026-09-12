import httpClient from "./httpClient";

export const cadastrarUsuario = (dados) => httpClient.post("/usuario/cadastrar", dados).then((r) => r.data);
export const loginUsuario = (dados) => httpClient.post("/usuario/login", dados).then((r) => r.data);
export const logoutUsuario = (refreshToken) => httpClient.post("/usuario/logout", { refreshToken }).then((r) => r.data);
export const buscarPerfil = () => httpClient.get("/usuario/perfil").then((r) => r.data);

export const listarPaginas = () => httpClient.get("/pagina").then((r) => r.data);
export const criarPagina = (dados) => httpClient.post("/pagina", dados).then((r) => r.data);
export const buscarPagina = (id) => httpClient.get(`/pagina/${id}`).then((r) => r.data);
export const atualizarPagina = (id, dados) => httpClient.put(`/pagina/${id}`, dados).then((r) => r.data);
export const publicarPagina = (id, publicada) => httpClient.post(`/pagina/${id}/publicar`, { publicada }).then((r) => r.data);
export const excluirPagina = (id) => httpClient.delete(`/pagina/${id}`).then((r) => r.data);
export const buscarPaginaPublica = (slug) => httpClient.get(`/p/${slug}`).then((r) => r.data);

export const listarPlanos = () => httpClient.get("/assinatura/planos").then((r) => r.data);
export const criarCheckout = (plano) => httpClient.post("/assinatura/checkout", { plano }).then((r) => r.data);
export const criarPortal = () => httpClient.post("/assinatura/portal").then((r) => r.data);

export async function uploadImagem(file) {
  const { uploadUrl, urlPublica } = await httpClient.post("/imagem/upload-url", {
    contentType: file.type || "image/jpeg",
    tamanhoBytes: file.size,
  }).then((r) => r.data);
  const resposta = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "image/jpeg" },
  });
  if (!resposta.ok) {
    throw new Error(`Falha no upload da imagem (${resposta.status}).`);
  }
  return urlPublica;
}

export function mensagemErro(error, fallback = "Não foi possível concluir a ação.") {
  return error?.response?.data?.mensagem || error?.message || fallback;
}
