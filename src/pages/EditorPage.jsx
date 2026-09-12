import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { atualizarPagina, buscarPagina, mensagemErro, publicarPagina, uploadImagem } from "../services/backendApi";
import { useToast } from "../context/ToastContext";
import { EditorShell } from "../editor/EditorShell";
import { aplicarImagemNoBloco, slugify } from "../editor/templates";
import { substituirBloco } from "../editor/blocosArvore";
import { enderecoReservado, getSiteBaseUrl, urlPublicaPagina } from "../constants/site";

export function EditorPage() {
  const { paginaId } = useParams();
  const { addToast } = useToast();
  const consulta = useQuery({ queryKey: ["pagina", paginaId], queryFn: () => buscarPagina(paginaId) });
  const [pagina, setPagina] = useState(null);
  const enderecoManual = useRef(false);

  useEffect(() => {
    if (consulta.data) {
      setPagina(consulta.data);
      enderecoManual.current = false;
    }
  }, [consulta.data]);

  const salvar = useMutation({
    mutationFn: () => {
      const endereco = slugify(pagina.slug || pagina.titulo);
      if (enderecoReservado(endereco)) {
        throw new Error("Este endereço é reservado. Escolha outro nome.");
      }
      return atualizarPagina(paginaId, {
        titulo: pagina.titulo,
        slug: endereco,
        tema: pagina.tema,
        blocos: pagina.blocos,
      });
    },
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

  const endereco = slugify(pagina.slug || pagina.titulo);
  const linkPublico = urlPublicaPagina(endereco);
  const base = getSiteBaseUrl().replace(/^https?:\/\//, "");

  return (
    <EditorShell
      pagina={pagina}
      onChange={(proxima) => {
        setPagina((atual) => {
          if (!atual) return proxima;
          if (proxima.titulo !== atual.titulo && !enderecoManual.current) {
            return { ...proxima, slug: slugify(proxima.titulo) };
          }
          return proxima;
        });
      }}
      voltarPara="/app"
      voltarLabel="Páginas"
      onEscolherImagem={onEscolherImagem}
      acoes={(
        <>
          <label className="flex min-w-[14rem] flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted">Endereço no domínio</span>
            <span className="flex items-center gap-0 rounded-lg border border-line bg-paper-2 px-2 py-1 text-sm">
              <span className="shrink-0 text-muted">{base}/</span>
              <input
                className="min-w-0 flex-1 bg-transparent outline-none"
                value={pagina.slug}
                onChange={(e) => {
                  enderecoManual.current = true;
                  setPagina({ ...pagina, slug: slugify(e.target.value) });
                }}
                aria-label="Endereço da página no domínio"
                placeholder="nome-da-pagina"
              />
            </span>
          </label>
          <button type="button" onClick={() => salvar.mutate()} className="rounded-full border border-line px-4 py-2 text-sm">Salvar</button>
          <button type="button" onClick={() => publicar.mutate(!pagina.publicada)} className="rounded-full bg-ink px-4 py-2 text-sm text-paper">
            {pagina.publicada ? "Despublicar" : "Publicar"}
          </button>
          {pagina.publicada && (
            <a href={linkPublico} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-sm text-accent">
              Ver
            </a>
          )}
        </>
      )}
    />
  );
}
