import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EditorShell } from "../editor/EditorShell";
import { TemplatePicker } from "../editor/TemplatePicker";
import { aplicarImagemNoBloco, paginaInicial, slugify } from "../editor/templates";
import { substituirBloco } from "../editor/blocosArvore";
import { lerRascunho, limparRascunho, salvarRascunho } from "../editor/rascunho";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { criarPagina, mensagemErro } from "../services/backendApi";

function lerArquivoComoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.readAsDataURL(file);
  });
}

export function GuestEditorPage() {
  const { autenticado } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [pagina, setPagina] = useState(() => lerRascunho() || paginaInicial());
  const [salvando, setSalvando] = useState(false);
  const [escolhendo, setEscolhendo] = useState(() => params.get("modelos") === "1" || !lerRascunho());

  useEffect(() => {
    salvarRascunho(pagina);
  }, [pagina]);

  const fecharModelos = () => {
    setEscolhendo(false);
    if (params.get("modelos")) {
      params.delete("modelos");
      setParams(params, { replace: true });
    }
  };

  const onEscolherImagem = async (file, bloco, destino) => {
    try {
      const url = await lerArquivoComoDataUrl(file);
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
      addToast("Imagem adicionada no rascunho.");
    } catch (error) {
      addToast(error.message, "erro");
    }
  };

  if (escolhendo) {
    return (
      <TemplatePicker
        onEscolher={(proxima) => {
          setPagina(proxima);
          fecharModelos();
        }}
        onCancelar={lerRascunho() ? fecharModelos : undefined}
      />
    );
  }

  return (
    <EditorShell
      pagina={pagina}
      onChange={setPagina}
      voltarPara="/"
      voltarLabel="Início"
      onEscolherImagem={onEscolherImagem}
      onTrocarModelo={() => setEscolhendo(true)}
      acoes={(
        <>
          <span className="self-center text-xs text-muted">Rascunho no navegador</span>
          {autenticado ? (
            <button
              type="button"
              disabled={salvando}
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-60"
              onClick={async () => {
                setSalvando(true);
                try {
                  const criada = await criarPagina({
                    titulo: pagina.titulo,
                    slug: slugify(pagina.titulo),
                    tema: pagina.tema,
                    blocos: pagina.blocos,
                  });
                  limparRascunho();
                  navigate(`/app/${criada.id}`);
                } catch (error) {
                  addToast(mensagemErro(error, "Entre e tente de novo para gravar na conta."), "erro");
                } finally {
                  setSalvando(false);
                }
              }}
            >
              {salvando ? "Salvando…" : "Salvar na conta"}
            </button>
          ) : (
            <Link to="/cadastrar" className="rounded-full bg-ink px-4 py-2 text-sm text-paper">Criar conta para publicar</Link>
          )}
        </>
      )}
    />
  );
}
