import { IMG_S3 } from "../../editor/templates";

/** Mock do editor: canvas cheio + barra e painel flutuantes. */
export function HeroProduto() {
  return (
    <div className="hero-produto" aria-hidden="true">
      <div className="hero-produto-janela">
        <div className="hero-produto-canvas">
          <div className="hero-produto-pagina">
            <div className="hero-produto-bloco hero-produto-bloco-ativo">
              <span className="hero-produto-chip">Capa</span>
              <img src={IMG_S3("perfil.jpg")} alt="" className="hero-produto-foto" />
              <p className="hero-produto-h1">Lia Monteiro</p>
              <p className="hero-produto-sub">Direção de arte e ilustração.</p>
              <span className="hero-produto-botao">Pedir orçamento</span>
            </div>
            <div className="hero-produto-bloco hero-produto-bloco-suave">
              <p className="hero-produto-h2">Sobre</p>
              <p className="hero-produto-p">Marcas pequenas que querem parecer o que são.</p>
            </div>
          </div>

          <div className="hero-produto-barra">
            <span>+</span>
            <span>↩</span>
            <span>↪</span>
            <span className="hero-produto-barra-cta">Publicar</span>
          </div>

          <aside className="hero-produto-ajustes">
            <div className="hero-produto-ajustes-abas">
              <span className="ativo">Capa</span>
              <span>Aparência</span>
            </div>
            <p className="hero-produto-ajustes-titulo">Título</p>
            <p className="hero-produto-ajustes-dica">O nome em letra grande</p>
            <label className="hero-produto-campo">
              <span>Texto</span>
              <span className="hero-produto-input">Lia Monteiro</span>
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
