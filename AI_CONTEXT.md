# AI Context — single-page

SPA React do construtor **Single**. Backend: `singlePageBack`.

## Stack

React 19, Vite 7, Tailwind 4, TanStack Query, Axios, React Router 7, Lucide.

## Superfícies

- `/` landing
- `/entrar` `/cadastrar`
- `/precos` checkout Stripe
- `/app` lista de páginas
- `/app/:id` editor visual (blocos + tema)
- `/criar` editor sem conta
- `/p/:slug` e `/:slug` página pública
- `/conta` portal Stripe

Editor: paleta à esquerda, canvas ao centro, inspetor à direita.

## Fluxo para production (obrigatório)

Nunca mandar commit direto em `production`. Sempre:

1. Branch de fix/feature a partir de `homolog` (ou `production` se estiver igual).
2. Merge da branch em **`homolog`** e `git push origin homolog`.
3. Gerar **GitHub Release** (`gh release create vX.Y.Z --target homolog`).
4. Merge de `homolog` em **`production`** e `git push origin production`.

O Amplify está ligado ao GitHub: push em `homolog` e `production` dispara o build sozinho. Não usar zip manual.

App Amplify: `d150flg7vmncut` (repo `GiovaniMurakami/singlePage`).  
`homolog.singlepage.com.br` → branch homolog. Apex e `www` → production.

Env de build: só `VITE_API_URL`  
- production: `https://api.singlepage.com.br`  
- homolog: `https://api.homolog.singlepage.com.br`

## Decisões desta sessão

- **AdSense:** meta `google-adsense-account`, script `adsbygoogle.js` e `public/ads.txt` com `ca-pub-7785538630070819`. Pub ID não é segredo.
- **HSTS:** `customHttp.yml` + header no app Amplify. Aviso de “site inseguro” depois de trocar certificado costuma ser cache do Chrome (anônimo / limpar HSTS).
- **Amplify antigo** (`d1pkrtv5p6zo1m`) era deploy manual, sem Git. Não dá para conectar o repo sem apagar as branches manuais — recriamos o app ligado ao GitHub.
- **Ajuda:** o botão “Preciso de ajuda” não aparece em página publicada (`/:slug`, `/p/:slug`). Continua na home, auth, preços, conta e editor.
- **Espaço editor vs publicado:** `semMarca` precisa preservar `className` (ex. `mt-8` do botão da capa). `estiloDoItem` deixa `extra` (largura/altura da foto) ganhar de `caixaDoBloco`. Não forçar `width: 100%` no flex de parte — estourava a foto no ar. Padding/margem da foto no wrapper; tamanho no `<img>`. Canvas do editor sem `max-w-3xl` extra: a largura é a do tema da página.
- **Anúncios Free:** trilhos laterais `position: absolute`, fundo neutro `#f3f4f6`, independentes do tema da página. Em viewport &lt; 1200px, faixa sticky embaixo. Página Pro/Ultra não renderiza anúncio (`anuncios: false` da API).
- **Fundo / layout / padding** de uma parte grava no **item** (`estiloPartes` / item da lista), não no bloco.
- **Foto da capa:** o tamanho publicado é o mesmo do editor. Quadrado usa `fotoTamanho` (largura e altura). Layout “Largura da foto” (`itemLargura`) vira retângulo com altura automática nos dois lados. O wrapper flex não pode crescer até o tamanho nativo da imagem.
- **E-mails SES:** ajuda, verificação de conta, senha, plano, página publicada e formulário saem por `noreply@singlepage.com.br`. Ajuda vai para `giovani.murakami@outlook.com`.

## Preços (UI)

Pro R$ 9,90/mês · Ultra R$ 49,90/mês. A cobrança real é o `STRIPE_PRICE_*` do back.
