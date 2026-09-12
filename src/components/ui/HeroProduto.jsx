import { IMG_S3 } from "../../editor/templates";
import { IconeLucide } from "../../editor/icones";

const PECAS = [
  { nome: "Capa", icone: "User" },
  { nome: "Texto", icone: "Type" },
  { nome: "Imagem", icone: "Image" },
  { nome: "Botões", icone: "MousePointerClick" },
  { nome: "Formulário", icone: "Mail" },
];

/** Mock do editor: mostra o produto (paleta + página + ajustes), não uma foto genérica. */
export function HeroProduto() {
  return (
    <div className="hero-produto" aria-hidden="true">
      <div className="hero-produto-janela">
        <header className="hero-produto-topo">
          <span className="hero-produto-marca">Single</span>
          <span className="hero-produto-titulo">Bia Sol</span>
          <span className="hero-produto-pill">Desktop</span>
          <span className="hero-produto-cta">Publicar</span>
        </header>

        <div className="hero-produto-corpo">
          <aside className="hero-produto-paleta">
            <p className="hero-produto-rotulo">Adicionar</p>
            {PECAS.map((peca) => (
              <div key={peca.nome} className="hero-produto-peca">
                <span className="hero-produto-peca-icone">
                  <IconeLucide nome={peca.icone} size={12} color="currentColor" />
                </span>
                {peca.nome}
              </div>
            ))}
          </aside>

          <div className="hero-produto-canvas">
            <div className="hero-produto-pagina">
              <div className="hero-produto-bloco hero-produto-bloco-ativo">
                <span className="hero-produto-chip">Capa › Título</span>
                <img src={IMG_S3("perfil.jpg")} alt="" className="hero-produto-foto" />
                <p className="hero-produto-h1">Bia Sol</p>
                <p className="hero-produto-sub">Cerâmica, cor e mesa posta.</p>
                <span className="hero-produto-botao">Pedir um conjunto</span>
              </div>
              <div className="hero-produto-mais">
                <span>+</span> Adicionar aqui
              </div>
              <div className="hero-produto-bloco hero-produto-bloco-suave">
                <p className="hero-produto-h2">Sobre</p>
                <p className="hero-produto-p">Escreva o essencial. Depois você publica.</p>
              </div>
            </div>
          </div>

          <aside className="hero-produto-ajustes">
            <p className="hero-produto-rotulo">Ajustes</p>
            <p className="hero-produto-ajustes-titulo">Título</p>
            <p className="hero-produto-ajustes-dica">O nome em letra grande</p>
            <div className="hero-produto-partes">
              <span>Foto</span>
              <span className="ativo">Título</span>
              <span>Frase</span>
              <span>Botão</span>
            </div>
            <label className="hero-produto-campo">
              <span>Texto</span>
              <span className="hero-produto-input">Bia Sol</span>
            </label>
            <label className="hero-produto-campo">
              <span>Cor</span>
              <span className="hero-produto-cor" />
            </label>
          </aside>
        </div>
      </div>
    </div>
  );
}
