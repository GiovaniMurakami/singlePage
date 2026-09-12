import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { atualizarPagina, buscarPagina, mensagemErro, publicarPagina, uploadImagem } from "../services/backendApi";
import { useToast } from "../context/ToastContext";
import { EditorShell } from "../editor/EditorShell";
import { aplicarImagemNoBloco } from "../editor/templates";
import { substituirBloco } from "../editor/blocosArvore";

export function EditorPage() {
  const { paginaId } = useParams();
  const { addToast } = useToast();
  const consulta = useQuery({ queryKey: ["pagina", paginaId], queryFn: () => buscarPagina(paginaId) });
  const [pagina, setPagina] = useState(null);

  useEffect(() => {
    if (consulta.data) setPagina(consulta.data);
  }, [consulta.data]);

  const salvar = useMutation({
    mutationFn: () => atualizarPagina(paginaId, {
      titulo: pagina.titulo,
      slug: pagina.slug,
      tema: pagina.tema,
      blocos: pagina.blocos,
    }),
    onSuccess: (data) => {
      setPagina(data);
      addToast("Página salva.");
    },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  const publicar = useMutation({
    mutationFn: (publicada) => publicarPagina(paginaId, publicada),
    onSuccess: (data) => {
      setPagina(data);
      addToast(data.publicada ? "Página no ar." : "Página despublicada.");
    },
    onError: (error) => addToast(mensagemErro(error), "erro"),
  });

  const onEscolherImagem = async (file, bloco, destino) => {
    try {
      const url = await uploadImagem(file);
      if (destino === "temaFundo" || !bloco) {
        setPagina((atual) => ({
          ...atual,
          tema: { ...atual.tema, fundoModo: "imagem", fundoImagem: url },
        }));
        addToast("Fundo da página atualizado.");
        return;
      }
      setPagina((atual) => ({
        ...atual,
        blocos: substituirBloco(atual.blocos, aplicarImagemNoBloco(bloco, url, destino)),
      }));
      addToast("Imagem enviada.");
    } catch (error) {
      addToast(mensagemErro(error), "erro");
    }
  };

  if (!pagina) return <div className="p-8 text-sm text-muted">Carregando editor…</div>;

  return (
    <EditorShell
      pagina={pagina}
      onChange={setPagina}
      voltarPara="/app"
      voltarLabel="Páginas"
      onEscolherImagem={onEscolherImagem}
      acoes={(
        <>
          <input
            className="w-36 rounded-lg border border-line px-2 py-1 text-sm"
            value={pagina.slug}
            onChange={(e) => setPagina({ ...pagina, slug: e.target.value })}
            aria-label="Endereço da página"
          />
          <button type="button" onClick={() => salvar.mutate()} className="rounded-full border border-line px-4 py-2 text-sm">Salvar</button>
          <button type="button" onClick={() => publicar.mutate(!pagina.publicada)} className="rounded-full bg-ink px-4 py-2 text-sm text-paper">
            {pagina.publicada ? "Despublicar" : "Publicar"}
          </button>
          {pagina.publicada && <Link to={`/p/${pagina.slug}`} target="_blank" className="rounded-full px-4 py-2 text-sm text-accent">Ver</Link>}
        </>
      )}
    />
  );
}
