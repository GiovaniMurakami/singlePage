import { Link } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { Seo } from "../components/Seo";
import { DATA_TERMOS, SITE_DOMINIO_CANONICO, SITE_NOME } from "../constants/site";
import { EMAIL_SUPORTE } from "../constants/suporte";

function ArtigoLegal({ title, description, path, children }) {
  return (
    <Shell>
      <Seo title={title} description={description} path={path} />
      <article className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{SITE_NOME}</p>
        <h1 className="font-display mt-2 text-3xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Vigente em {DATA_TERMOS}.</p>
        <div className="legal-texto mt-10 space-y-4 text-[15px] leading-7 text-ink-soft">
          {children}
        </div>
        <p className="mt-12 text-sm text-muted">
          Dúvida sobre dados? <a className="text-ink underline" href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a>
          {" · "}
          <Link className="text-ink underline" to="/termos">Termos</Link>
          {" · "}
          <Link className="text-ink underline" to="/privacidade">Privacidade</Link>
        </p>
      </article>
    </Shell>
  );
}

function Titulo({ children }) {
  return <h2 className="!mt-10 font-display text-xl text-ink md:text-2xl">{children}</h2>;
}

export function TermosPage() {
  return (
    <ArtigoLegal
      title="Termos de Uso"
      description="Regras para criar conta, publicar páginas e usar o Single."
      path="/termos"
    >
      <p>
        Estes termos regulam o uso do {SITE_NOME} ({SITE_DOMINIO_CANONICO}), editor para criar e publicar uma página na internet.
        Ao criar conta e marcar o aceite, você concorda com este documento e com a{" "}
        <Link className="text-ink underline" to="/privacidade">Política de Privacidade</Link>.
      </p>

      <Titulo>1. O serviço</Titulo>
      <p>
        O Single permite montar uma página visualmente, guardar rascunho, publicar em um endereço
        <code className="mx-1 rounded bg-paper px-1.5 py-0.5 text-[13px] text-ink">nome.singlepage.com.br</code>
        e receber recados de formulário no e-mail informado. O plano Free publica com anúncios e marca Single.
        Pro e Ultra removem anúncios e a marca, nos limites de cada plano.
      </p>
      <p>
        Você pode começar no editor sem cadastro. O rascunho fica só neste navegador até você criar conta e gravar na nuvem.
      </p>

      <Titulo>2. Conta</Titulo>
      <p>
        Você precisa de um e-mail verdadeiro e de uma senha com pelo menos 8 caracteres. A conta é pessoal.
        Avise se alguém acessar sem autorização. Podemos encerrar contas usadas para abuso, golpe ou violação destes termos.
      </p>

      <Titulo>3. Sua página</Titulo>
      <p>
        O conteúdo (textos, fotos, links, formulários) é seu. Você garante que tem direito de publicar o que colocar no ar
        e que isso não infringe lei, direito de terceiros nem as regras abaixo.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Não publique conteúdo ilegal, discriminatório, sexual envolvendo menores, malware ou golpe.</li>
        <li>Não use o endereço público para se passar por outra pessoa ou marca.</li>
        <li>Não sobrecarregue o serviço de propósito (spam, scraping agressivo, ataques).</li>
      </ul>
      <p>
        O endereço público é único. Se você excluir a página, o nome volta a ficar livre e outra pessoa pode usá-lo.
        Nomes reservados do produto (como www, api ou termos) não podem ser escolhidos.
      </p>

      <Titulo>4. Formulários e visitantes</Titulo>
      <p>
        Se a sua página tem formulário, você é o responsável pelos dados que receber. O Single só encaminha a mensagem
        para o e-mail que você configurar. Informe na sua página, se fizer sentido, para que serve o formulário.
      </p>

      <Titulo>5. Planos e pagamento</Titulo>
      <p>
        Preços e limites aparecem em <Link className="text-ink underline" to="/precos">/precos</Link>.
        Assinaturas Pro e Ultra são cobradas pelo Stripe. Cancelamento e reembolso seguem o portal da assinatura e a legislação aplicável.
        O plano Sob medida é combinado à parte, para site completo.
      </p>

      <Titulo>6. Propriedade do Single</Titulo>
      <p>
        Marca, editor, modelos e o código do produto são do Single. Você recebe uma licença limitada para usar o serviço
        enquanto a conta estiver ativa. Não copie o produto nem use a marca como se fosse sua.
      </p>

      <Titulo>7. Disponibilidade</Titulo>
      <p>
        Trabalhamos para o site ficar no ar, mas não prometemos disponibilidade ininterrupta. Manutenção, falha de nuvem
        ou de terceiros (hospedagem, e-mail, pagamento) pode afetar o acesso. O serviço é oferecido no estado em que se encontra.
      </p>

      <Titulo>8. Responsabilidade</Titulo>
      <p>
        Na medida permitida pela lei, o Single não responde por prejuízo indireto, perda de oportunidade ou conteúdo
        publicado por usuários. Se houver dever de indenizar, o valor máximo é o que você pagou nos 12 meses anteriores ao fato,
        ou R$ 100 se estiver no Free.
      </p>

      <Titulo>9. Encerramento</Titulo>
      <p>
        Você pode apagar páginas e pedir a exclusão da conta pelo e-mail de suporte. Podemos suspender o acesso em caso de
        violação destes termos ou risco à segurança. Conteúdo publicado some quando a página é excluída; cópias em cache ou e-mail já enviado podem permanecer por um tempo.
      </p>

      <Titulo>10. Lei e foro</Titulo>
      <p>
        Aplica-se a lei brasileira. Fica eleito o foro do domicílio do usuário, quando a lei do consumidor exigir,
        ou o foro de São Paulo/SP para as demais hipóteses.
      </p>

      <Titulo>11. Mudanças</Titulo>
      <p>
        Se estes termos mudarem de forma relevante, avisamos na interface ou por e-mail. O uso continuado depois do aviso
        vale como aceite da nova versão, salvo se a lei exigir consentimento específico.
      </p>
    </ArtigoLegal>
  );
}

export function PrivacidadePage() {
  return (
    <ArtigoLegal
      title="Política de Privacidade"
      description="Como o Single trata dados pessoais, de acordo com a LGPD."
      path="/privacidade"
    >
      <p>
        Esta política explica quais dados o Single trata, para quê, com quem compartilha e quais são os seus direitos
        pela Lei nº 13.709/2018 (LGPD).
      </p>

      <Titulo>1. Quem controla os dados</Titulo>
      <p>
        Controlador: Giovani Murakami, pessoa física responsável pelo Single. Contato para privacidade e direitos do titular:{" "}
        <a className="text-ink underline" href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a>.
      </p>

      <Titulo>2. Quais dados tratamos</Titulo>
      <ul className="list-disc space-y-2 pl-5">
        <li><strong className="font-medium text-ink">Conta:</strong> nome, e-mail, senha criptografada, plano, status da assinatura, aceite dos termos e data.</li>
        <li><strong className="font-medium text-ink">Página:</strong> título, endereço público, blocos, tema, fotos que você envia.</li>
        <li><strong className="font-medium text-ink">Formulário da página:</strong> o que o visitante preenche; o Single só encaminha ao e-mail do dono.</li>
        <li><strong className="font-medium text-ink">Uso:</strong> visitas, cliques e envios de formulário da página publicada, para o painel do dono.</li>
        <li><strong className="font-medium text-ink">Pagamento:</strong> identificadores Stripe da assinatura. Cartão fica com o Stripe, não no Single.</li>
        <li><strong className="font-medium text-ink">Suporte:</strong> o que você escreve no “Preciso de ajuda”.</li>
        <li><strong className="font-medium text-ink">Navegador sem conta:</strong> rascunho local no seu aparelho, sem ir para o servidor até você gravar.</li>
      </ul>

      <Titulo>3. Por que tratamos (bases legais)</Titulo>
      <ul className="list-disc space-y-2 pl-5">
        <li><strong className="font-medium text-ink">Execução de contrato:</strong> criar conta, salvar página, publicar, enviar formulário, cobrar plano pago.</li>
        <li><strong className="font-medium text-ink">Consentimento:</strong> o aceite no cadastro e o envio voluntário de formulário ou pedido de ajuda.</li>
        <li><strong className="font-medium text-ink">Legítimo interesse:</strong> segurança, prevenção a abuso, medições básicas da página publicada.</li>
        <li><strong className="font-medium text-ink">Obrigação legal:</strong> guardar o que a lei tributária ou de consumo exigir, quando couber.</li>
      </ul>

      <Titulo>4. Com quem compartilhamos</Titulo>
      <p>Não vendemos lista de e-mails. Usamos operadores para o produto funcionar:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Amazon Web Services (EUA): hospedagem da API, banco, arquivos de imagem e e-mail transacional.</li>
        <li>Stripe: checkout e portal da assinatura.</li>
        <li>Google AdSense: anúncios nas páginas publicadas no plano Free. O Google pode usar cookies próprios nessas páginas.</li>
      </ul>
      <p>
        Transferência internacional: servidores da AWS ficam em us-east-1. Isso é necessário para o serviço atual.
        Aplicam-se as salvaguardas contratuais dos fornecedores e os direitos da LGPD.
      </p>

      <Titulo>5. Cookies e armazenamento local</Titulo>
      <p>
        Usamos armazenamento local para sessão (login) e rascunho do editor. São necessários para o produto.
        Nas páginas Free publicadas, o Google AdSense pode gravar cookies de publicidade. Você pode limitar cookies no navegador;
        login e rascunho podem deixar de funcionar se você bloquear tudo.
      </p>

      <Titulo>6. Por quanto tempo guardamos</Titulo>
      <p>
        Dados da conta e das páginas enquanto a conta existir. Formulário: o e-mail enviado fica na sua caixa; o Single não
        guarda o conteúdo como arquivo permanente além do necessário para o envio. Eventos de painel acompanham a página.
        Pedido de exclusão: apagamos o que estiver sob nosso controle em prazo razoável, salvo obrigação legal de retenção.
      </p>

      <Titulo>7. Seus direitos</Titulo>
      <p>Você pode pedir confirmação, acesso, correção, anonimização, portabilidade, informação sobre compartilhamentos e exclusão.</p>
      <p>
        Para exercer: escreva para <a className="text-ink underline" href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a>{" "}
        com o assunto “LGPD” e o e-mail da conta. Também dá para alterar nome e senha em{" "}
        <Link className="text-ink underline" to="/conta">/conta</Link> e apagar páginas no painel.
        Se não resolver, cabe reclamação à ANPD.
      </p>

      <Titulo>8. Formulário da sua página</Titulo>
      <p>
        Quando um visitante manda recado, você é o controlador daqueles dados. Use só para o fim anunciado na página
        e apague quando não precisar mais. O Single atua como operador nesse encaminhamento.
      </p>

      <Titulo>9. Segurança e crianças</Titulo>
      <p>
        Senha vai com hash, acesso à API usa sessão autenticada, imagens sobem por URL temporária. Nenhum sistema é infalível.
        O Single não se destina a menores de 13 anos. Se identificarmos conta de criança sem base legal, podemos encerrar.
      </p>

      <Titulo>10. Mudanças</Titulo>
      <p>
        Se esta política mudar de forma relevante, atualizamos a data no topo e avisamos quando o impacto for grande.
        A versão vigente é a publicada em <Link className="text-ink underline" to="/privacidade">/privacidade</Link>.
      </p>
    </ArtigoLegal>
  );
}
