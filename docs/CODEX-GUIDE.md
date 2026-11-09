# CAPIMASO Windows 7 — manutenção

## Entradas atuais

- `/`: inicialização, logon público e desktop Win7, composto por [app/page.tsx](../app/page.tsx).
- `/xp` e `/win7`: redirecionamentos permanentes para `/` em
  [next.config.ts](../next.config.ts). Não recriar páginas concorrentes.
- `/studio`: formulário local Win7, só em desenvolvimento. Página 404 em produção;
  API de gravação continua retornando 403 fora de `npm run dev`.
- `/api/photos` e `/api/photos/[id]/image`: integração server-only de fotografias.

XP e BIOS não fazem parte da árvore ativa. Fontes antigas em `src/os/xp/` e
`src/boot/` permanecem como legado, sem imports/CSS nas entradas atuais. Não
apagar assets antigos: o proprietário solicitou preservar o acervo. Os relatórios
XP/dual boot em docs são históricos; este guia e o início de MUDANCAS descrevem
a aplicação atual.

## Desktop, aparência e janelas

[src/os/win7/](../src/os/win7/) contém a implementação ativa. Importar
`7.css/dist/7.scoped.css` na camada `win7-base`, via `seven.css`, com contêiner
`.win7`. Nunca importar a distribuição global ou um reset. CSS Modules trata
layout e adaptações locais. Segoe UI/Tahoma, Orb e cursores originais.

- `Win7Desktop.tsx`: idioma, sessão, logon e composição. O campo visual do logon
  não é autenticação e nunca é lido/enviado/armazenado. Entrada por Enter/seta,
  Harmony no logon e cobertura preta com Busy.cur durante 700 ms antes do desktop.
- `Logon.tsx` / `logon.module.css`: foto de 132 px com moldura de 148 px,
  Windows 7 Ultimate, copyright e Segoe UI. Diálogo nativo de Facilidade de
  Acesso (Esc e retorno de foco): texto maior e contraste restritos ao logon;
  mute usa o SoundManager compartilhado. Menu de energia usa Popover API.
  Desligar encerra só a sessão visual, com foco em Ligar; Ligar/Reiniciar são
  navegações de documento para `/`, repetindo o boot. Não executar comandos do SO.
- `window-state.ts`: abertura, foco, geometria, minimizar e restaurar.
  `useWindowManager.ts` adapta estado/área útil; `WindowChrome.tsx` usa classes
  oficiais do 7.css, `useWindowGesture.ts` trata ponteiro/teclado e cleanup.
- `useWindowMotion.ts`: minimizar/restaurar e maximizar por WAAPI, 250 ms;
  destino real da taskbar, reversão e movimento reduzido. Minimizar mantém
  conteúdo montado; fechar desmonta e cancela recursos.
- `useDesktopSelection.ts`: caixa de seleção só em área vazia, pointer capture,
  interseção inclusiva, rAF e cleanup. Clique seleciona; duplo clique/Enter abre;
  mobile abre por toque. Ícones/tiles têm hover imediato, sem animar geometria.
- `StartMenu.tsx`: apps locais e pastas reais do Drive com busca paginada. Avatar
  muda após 500 ms de hover/foco, com fade de 200 ms e cancelamento ao sair.
  Reiniciar é um link de documento para `/`, para reiniciar também na raiz.
  Não substituí-lo por Link que apenas navegue para a mesma rota sem resetar sessão.
- `DesktopSettings.tsx`: wallpapers exclusivos do Win7, chave
  `capimaso-win7-wallpaper`. Preservar arquivos originais, Orb 106×318 com três
  frames e diretório singular `public/assets/win7/cursor/`.

Taskbar usa blur 15 px, títulos 10 px. Movimento reduzido remove animações
espaciais, mantendo feedback de cor/opacidade. Em 375 px: taskbar 56 px mais
safe area, alvos principais 44 px, tarefas roláveis, Iniciar na área útil sem
autofocus mobile e janelas em tela cheia acima da barra. Sem overflow de página.

## Dados, perfil e mídia

Editar dados em `data/*`, não embutir novos trabalhos em JSX.

| Conteúdo | Fonte |
| --- | --- |
| Identidade, bio e disponibilidade | [data/profile.ts](../data/profile.ts) |
| Projetos | [data/showcase.json](../data/showcase.json) |
| Softwares | [data/skills.ts](../data/skills.ts) |
| Serviços/pacotes e recados reais | [data/services.ts](../data/services.ts), [data/comments.ts](../data/comments.ts) |
| Complementos do perfil e equipamento | [data/win7-profile.ts](../data/win7-profile.ts) |
| Contatos de vídeo e fotografia | [data/win7-socials.ts](../data/win7-socials.ts) |
| Introdução | [data/media.ts](../data/media.ts) |

`apps/Profile.tsx` monta abas de propriedades com teclado, preços e depoimentos
preservados. Não inventar câmera/lente: a aba Equipamento fica oculta sem dados.
`MediaCatalog.introduction` mantém a introdução separada dos trabalhos e abre
`intro` no WMP12 com uma lista própria. Contato preserva ambos os Instagrams.

Desktop oferece Imagens (ícone antes usado por Thumbnails) e Vídeos; Fotografias
e Thumbnails são janelas filhas acessíveis pela pasta Imagens e pela busca.
Preservar IDs `photos`/`thumbnails` e o estado existente ao navegar pelo pai.
Títulos das janelas removem o text-shadow branco repetido da base 7.css.
`MediaExplorer.tsx` oferece Imagens, Vídeos/curtos/longos e Thumbnails, com superfícies do
Explorer. Catálogo e galeria são lidos no servidor e passados por `MediaCatalog`;
não importar filesystem no cliente. Thumbnails lê `public/images/thumbs/`.
Capas novas ficam em `public/images/posters/`; não mover arquivos anteriores.
`src/server/video-covers.ts` aplica capas opcionais de `public/images/posters/custom/`
pelo ID estável, inclusive `intro`, sem alterar o manifesto ou os assets antigos.
Aceita PNG/JPG/JPEG/WebP/AVIF e arquivos regulares; sem capa usa o caminho anterior.
Nunca importar esse helper de filesystem no cliente. Títulos seguem em
`data/showcase.json` (introdução em `data/media.ts`); instruções e nomes prontos
estão em `public/images/posters/custom/LEIA-ME.md`.

`WmpPlayer.tsx` segue as três referências recebidas, modo Em reprodução.
`useYouTubePlayer.ts` oferece controles reais pela API oficial, carregada por
`youtube-api.ts` com timeout/retry. Autoplay mudo e fallback nativo em falha.
Durante seek, manter destino até confirmação/expiração, evitando reversão por
eventos atrasados de buffering. Não extrair streams nem prometer eliminar marca.
Curtos usam `useNativeVideoPlayer.ts` e HTMLVideoElement, começando pausados e
mudos, com o mesmo transporte WMP12. A fonte é `/api/videos/<project-id>/stream`,
restrita ao catálogo, API Drive oficial e chave server-only. Sem fonte/codec,
erro ou timeout de metadados volta ao `/preview` manual com controles internos.
Preservar 9:16 e 16:9, estado ao minimizar e cleanup ao fechar/trocar.
Ver [prova de reprodução](WMP12-PLAYBACK-VERIFICATION.md).

## Idioma e áudio

`lib/locale-dictionary.ts` e `src/shared/LanguageContext.tsx` são as fontes ativas.
Usar `useT` nos componentes; servidor pode usar `tr` para texto inicial/no-JS.
Preservar inglês inicial, opção PT e chave histórica `capimaso-xp-language`:
renomeá-la sem migração perde a preferência dos visitantes. Esse nome não
significa dependência da interface antiga.

SoundManager é global no desktop. Sons originais mapeados em `src/lib/sounds-map.ts`;
servidor anuncia só os existentes. Startup tenta tocar na fase `boot` antes do
logon, com sinal observável de bloqueio e botão Iniciar com som na tela de boot.
A primeira interação também repete a tentativa bloqueada; não tocar startup
novamente ao montar desktop. Não prometer contornar a política de autoplay.
`Startup.tsx` aceita o vídeo HTTPS de `data/win7-startup.ts` (ainda vazio até
receber o recurso real), com fallback visual, pular, erro/fim/timeout e movimento
reduzido. Sem BIOS ou seletor de sistemas, e sem binários de vídeo no Git.
Volume inicial 80%, mute compartilhado com Painel de Controle e Ding após ajuste
da bandeja. Ausência/falha/autoplay bloqueado permanecem silenciosos. Novos sons
exigem reiniciar dev/rebuild. O volume/mute da bandeja é o master: em curtos e YouTube,
`apps/video-audio.ts` aplica master × volume próprio do WMP12 sem alterar o
slider local. Mute geral domina o local, e as preferências locais sobrevivem a
ajustes do master e minimizar. YouTube mantém autoplay mudo; curtos são manuais
e começam mudos. Desconectar
remove a assinatura ao fechar/trocar/falhar. Drive `/preview` e fallback nativo
sem API continuam com controles internos; não oferecem volume master externo.

## Drive e Estúdio

Credenciais somente no servidor. Nunca imprimir/versionar `.env.local` ou usar
`NEXT_PUBLIC_` para chave. Raiz pública aceita ID/link e resourcekey opcional.
Verificar client paths por listagens pai/filho, incluindo instâncias sem cache;
não confiar somente em `files.get.parents`. Proxy limitado à árvore configurada,
MIME raster e hosts Google. Downloads preservam nome/bytes; cache de 60 s,
Refresh explícito e erros com retry. Não fabricar acervo nem ampliar esse proxy
para aceitar URLs arbitrárias de vídeo.

`src/server/drive/videos.ts` é uma rota separada por allowlist dos curtos no
catálogo. Não muda a raiz/autorização de fotos. Resolve somente links já
registrados, confere metadados públicos e `canDownload`, aceita apenas MIME de
vídeo e usa `files.get?alt=media` oficial, com chave em header server-only.
Range inválido/múltiplo retorna 416; intervalos são limitados a 4 MiB, mantendo
offsets e tamanho total reais. HEAD não baixa mídia. Corpo é transmitido como
stream sem cópias em disco/buffer do arquivo completo. HTML, redirects e Range
ignorado não são tratados como vídeo. Não usar scraping, tokens do iframe ou
novas URLs de hospedagem inventadas. `GOOGLE_DRIVE_API_KEY` precisa existir na
Vercel em Production, e fotos precisam também de `DRIVE_FOLDER_ID`.

`app/studio/page.tsx` faz a guarda server-side e carrega
`src/os/win7/studio/Studio.tsx`. O formulário usa Win7/CSS Modules/useT, prévia
Drive manual, URL local revogável para capa e links de retorno a `/`.
`app/api/studio/upload/route.ts` continua dev-only, com validação de origem,
link, tamanho e assinatura da imagem. Grava poster com nome único e manifesto
via arquivo temporário/rename. Nenhum vídeo é baixado; sem admin público.
Não habilitar gravação em produção sem autenticação e storage apropriados.

## Verificação

Metadados da home usam `data/site.ts` e `lib/site-metadata.ts`. `SITE_URL`
é a origem HTTP(S) pública real configurada antes do build, sem caminho,
credenciais, query ou hash. Não inferir domínio a partir de headers, localhost
ou um endereço de exemplo. Sem configuração, omitir canonical, imagem social
e URLs de sitemap; não quebrar o desktop nem anunciar localhost em produção.
Canonical/Open Graph/Twitter ficam na home, sem propagar canonical da home
para Estúdio/404. A imagem é o wallpaper Win7 existente, sem novo asset.
`app/robots.ts` anuncia o sitemap somente com origem conhecida e exclui APIs e
Estúdio. `app/sitemap.ts` inclui só a raiz canônica, sem redirects legados.
Alterar `SITE_URL` requer rebuild; testar com `npm run test:metadata`.

Executar `npm run check`, `npm run typecheck`, `npm run build` e testes relevantes:
`test:win7`, `test:photos`, `test:sounds`, `test:player`, `test:video-stream`, `test:studio`, `test:metadata`, `test:media`.
O último executa a gravação em diretório temporário isolado, preservando os dados
do repositório. Conferir redirecionamentos por HTTP sem JavaScript, reinício já
na raiz, preferências EN/PT/wallpaper e 375/768/1440 px. Nunca publicar fixtures.

O typecheck inclui entradas `app/`, configuração e tipos Next gerados, alcançando
os módulos importados por elas. Fontes legadas sem import não devem voltar ao
build por um include indiscriminado. Após remover rotas, gerar build/tipos atuais
antes de interpretar erros de validators antigos como erros da implementação.
Manter os dados/arquivos antigos e registrar mudanças em MUDANCAS.
