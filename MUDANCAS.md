## Drive ativado e verificado em produção — 09/11/2026

- `GOOGLE_DRIVE_API_KEY` e `DRIVE_FOLDER_ID` configurados como Secret apenas
  em Production na Vercel; nenhum valor foi incluído no Git. Após a verificação
  de identidade do proprietário, redeploy da main concluído com sucesso.
- No endereço público, `/api/photos` responde 200 e lista as três pastas reais.
  Explorer e Photo Viewer abriram miniatura e fotografia original no navegador.
- Os cinco streams de curtos respondem 206/video-mp4 com Content-Range correto. No Edge
  em 1440 px/EN e 375 px/PT, Stefany reproduziu no WMP12 com volumes geral e
  individual, prioridade do mute, teclado, minimizar/restaurar e tela cheia.
  Fechar liberou a mídia; falha simulada voltou ao `/preview`. Sem erros de página
  ou rolagem horizontal. A pendência de configuração descrita abaixo foi resolvida.

## Curtos com WMP12 e diagnóstico de fotografias — 09/11/2026

- Os cinco curtos agora usam vídeo nativo com controles WMP12 reais: play/pausa,
  parar, progresso/seek, tempo, mute, volume individual e master da bandeja.
  Começam pausados/mudos e preservam 9:16. Longos continuam com a API YouTube.
- Nova rota server-only `/api/videos/[project-id]/stream`: allowlist do catálogo,
  metadados/download público verificados, MIME de vídeo, Range limitado a 4 MiB,
  HEAD sem baixar vídeo e resposta transmitida sem disco/buffer do arquivo todo.
  Não aceita IDs/URLs livres nem amplia a raiz da galeria. Links e capas mantidos.
- Falha de chave/rede/codec ou timeout restaura o `/preview` original do Drive;
  fechar/trocar/falhar libera a mídia e a assinatura de áudio.
- Prova real no Edge aprovou os cinco arquivos: metadados, reprodução, pausa,
  seek distante, volume e parar. 27 testes offline de streaming/fotos/player,
  check, typecheck e build aprovados. Detalhes no documento de reprodução.
- Fotos: a API local lista as três pastas e entrega miniaturas reais. Em produção
  `/api/photos` ainda retorna 503 `not_configured`, pela ausência das variáveis
  `GOOGLE_DRIVE_API_KEY` e/ou `DRIVE_FOLDER_ID`. Ambas existem localmente; não
  foram expostas nem versionadas. Configurações da Vercel abertas, exigindo login.
  O original de uma foto e nova rodada de UI receberam limite temporário 429
  do Google; nenhuma tentativa de contornar esse bloqueio foi feita.

## Logon Windows 7 Ultimate — 07/11/2026

- Logon ajustado à referência recebida: foto original CAPIMASO de 132 px dentro
  de moldura Aero de 148 px, campo centralizado com seta à direita, Segoe UI
  regular no nome e Light na marca Windows 7 Ultimate. Rodapé com bandeira SVG
  recriada, edição e © 2009 Microsoft Corporation; nenhum avatar foi substituído.
- Facilidade de Acesso no canto inferior esquerdo, com ícone original do acervo:
  diálogo nativo com texto maior e alto contraste para o logon, e mute real do
  SoundManager compartilhado com o desktop. Esc fecha e devolve o foco ao botão.
- Botão vermelho dividido no canto inferior direito: Desligar encerra a sessão
  visual, mostra Ligar e transfere o foco; a seta abre opções de Reiniciar e
  Desligar. Ligar/Reiniciar recarregam `/` e repetem a inicialização.
- EN/PT movido ao canto superior esquerdo. Layout adaptado ao celular, alvos
  de toque ampliados e rolagem vertical em telas baixas; senha continua apenas
  visual, sem leitura, armazenamento ou envio.
- Check, build, typecheck e 25 testes de sons/janelas aprovados. Edge em EN/PT,
  com seis tamanhos de tela de 320 a 1440 px, verificou imagens e marca,
  texto/contraste/mute, teclado e foco, menu de energia, reiniciar, desligar/ligar
  e entrada no desktop, sem erros de página ou rolagem horizontal. Texto ampliado
  também conferido em celular de pouca altura, sem sobrepor os controles.

## Ajustes de Imagens, títulos e inicialização — 07/11/2026

- Desktop e Iniciar reorganizados com Imagens, usando o ícone original da
  biblioteca antes usado por Thumbnails. Dentro ficam Fotografias e Thumbnails;
  breadcrumbs e Voltar retornam ao pai, mantendo janelas, IDs e dados existentes.
  Thumbnails passa a usar um ícone original de pasta para distinguir a filha
  da biblioteca Imagens.
- Removido o text-shadow branco repetido do 7.css nos nomes das janelas, que
  aparecia como uma faixa clara recortada atrás do texto. Vidro e controles mantidos.
- Nova fase de inicialização Win7 antes do logon, com fallback preto/Orb original,
  botão de pular e duração limitada. `data/win7-startup.ts` está preparado para
  o vídeo HTTPS real, ainda não recebido. Nenhum vídeo local inventado/adicionado.
- Startup tenta tocar ao abrir a fase de boot; rejeição do navegador é observável
  e oferece Iniciar com som antes do login. A primeira interação repete a tentativa;
  login não repete startup já liberado. Não se promete áudio sem gesto em todos
  os navegadores: https://developer.chrome.com/blog/autoplay/.
- Diagnóstico de fotos: API local responde 200 com três pastas, mas produção
  responde 503 `not_configured`. É necessário configurar variáveis Drive na
  Vercel e refazer deploy. Página de configuração aberta, mas exige login do
  proprietário; nenhuma chave foi exibida ou enviada ao Git.
- Curtos: nova prova pública obteve HTML em três links e resposta 206/MP4 em
  dois, porém ambos falharam no teste de reprodução nativa no navegador.
  Drive `/preview` foi preservado; controles externos continuam dependendo de
  uma fonte real controlável. Não foram criados botões falsos nem extraídos streams.
- Check, build, typecheck e 32 testes de janelas/sons/player aprovados. Edge em
  EN/PT e 1440/375 px conferiu hierarquia, retorno ao pai, fotos locais e títulos.
  Startup tocou antes do logon no cenário com autoplay permitido; bloqueio
  simulado mostrou Iniciar com som e liberou o áudio sem precisar entrar no desktop.

## Nome, Orb e edição simples das capas — 07/11/2026

- Título público da aba e compartilhamento alterado para `capimaso`.
  Favicon passa a usar o primeiro frame do Orb original em um SVG que embute
  a sprite recebida, sem redesenhar nem modificar o PNG ou excluir o ícone antigo.
- Pasta `public/images/posters/custom/` pronta para capas pelo ID do vídeo:
  basta adicionar a imagem; nomes continuam no campo `title` do manifesto.
  Incluída tabela de nomes/proporções e instruções para todos os vídeos/intro.
  Capas anteriores, links, IDs e dados existentes preservados como fallback.
- Galeria Thumbnails continua automática em `public/images/thumbs/`, separada
  das capas. Novas imagens/títulos ficam disponíveis na Vercel após novo deploy.
- Check, seis testes de metadados/capas, build e typecheck aprovados. Edge em
  1440 e 375 px confirmou título, favicon e fallback; cópia temporária isolada
  confirmou detecção automática da capa e foi removida. Orb decodificado e
  bytes da sprite embutida comparados com o original, sem alterações no PNG.

## Preparação do deploy na main — 07/11/2026

- Publicação autorizada pelo proprietário pelo fluxo Git/Vercel já existente.
  Migração Win7, biblioteca de mídia, WMP12, volume geral/individual, perfil,
  Estúdio local e metadados reunidos para integração à main, preservando dados.
- Next.js atualizado de 16.3.6 para 16.4.5 após a auditoria indicar correções
  necessárias. Instalação final com zero vulnerabilidades reportadas pelo npm.
  Referência: https://github.com/advisories/GHSA-673q-mjm6-r5xr.
- Endereço público confirmado no repositório GitHub:
  https://capimaso-portfolio.vercel.app. Segredos permanecem fora do Git;
  recursos binários locais sem uso não são incluídos nem apagados.
- Rastreamento do servidor limitado aos sons originais da raiz usados pela
  home; eliminada a inclusão indiscriminada do projeto na análise Turbopack.
- Check, 46 testes, build e typecheck aprovados com Next.js 16.4.5, sem os
  avisos de rastreamento abrangente. Somente os assets usados foram preparados
  para versionamento; referências e recursos locais restantes preservados.

## Preparação para publicação — metadados e domínio — 06/11/2026

- Origem pública configurável por `SITE_URL` antes do build, sem domínio
  inventado ou fallback localhost. Sem configuração, a home funciona e omite
  canonical, imagens de compartilhamento e URLs do sitemap. URL inválida dá
  erro claro sem imprimir seu valor. Nenhuma alteração em `.env.local`.
- Identidade de compartilhamento centralizada em `data/site.ts`. Título e
  descrição alinhados na home, Open Graph e Twitter, com idioma inicial EN e
  texto no dicionário. Compartilhamento reutiliza o wallpaper Win7 original.
- `/robots.txt` permite a home e exclui Estúdio/APIs. `/sitemap.xml` inclui
  somente a raiz quando o domínio estiver configurado; rotas antigas mantêm
  redirects, e o Estúdio conserva sua guarda de desenvolvimento.
- Novo `test:metadata` verifica origem, configuração ausente/inválida, canonical,
  imagem existente, compartilhamento e indexação. Domínio real ainda aguarda
  informação do proprietário. Capas seguem adiadas. Nenhum deploy realizado.
- Check, typecheck, quatro testes de metadados e builds com/sem origem
  aprovados, sem o aviso anterior de metadataBase. Edge/HTTP de produção
  validou canonical e imagens absolutos com origem de teste, sitemap com
  somente a raiz, ausência de URLs inventadas sem origem, redirects 308,
  Estúdio 404/API 403 e perfil mobile. Estúdio dev segue noindex e sem canonical
  da home. Origem de teste não salva em configuração; build normal restaurado.

## Equipamento do perfil — 06/11/2026

- Câmera Fujifilm FinePix S2800HD confirmada pelo proprietário e adicionada
  aos dados do perfil Win7. A aba Equipamento passa a aparecer com esse modelo,
  com rótulo Câmera/Camera em PT/EN, sem acrescentar especificações ou acessórios.
- Troca das capas de Corte PIB e Investiu MKT adiada pelo proprietário;
  mantidos os arquivos e caminhos existentes.
- Check, build e typecheck aprovados. Perfil conferido no Edge em EN/PT,
  1440 e 375 px: cinco abas, modelo correto, navegação por teclado e sem
  overflow. Build mantém o aviso anterior de metadataBase.

## Volume geral e volume individual dos vídeos — 06/11/2026

- A bandeja passa a controlar também os vídeos YouTube (inclusive a introdução)
  pela API: saída = geral × individual. Ajustar o geral não sobrescreve a barra
  do WMP12. Mute geral e volume zero prevalecem mesmo ao ajustar o vídeo.
- Mute local permanece independente; voltar o geral restaura a preferência
  individual. Autoplay segue mudo. Minimizar conserva a assinatura do volume;
  fechar/trocar/falhar remove a assinatura antes de destruir o player.
- Drive `/preview` e fallback sem API continuam dependendo do volume interno
  do provedor; o volume geral externo não controla esses iframes. Fontes,
  catálogo e assets preservados, sem downloads ou proxy de vídeos.
- Check, build, typecheck e 16 testes de player/sons aprovados. Edge de produção
  em 1440 e 375 px confirmou a saída real pela API, independência dos sliders,
  prioridade dos mutes, volume zero, minimizar/restaurar e fechar/reabrir.
  Sem erros de página ou overflow. Build mantém o aviso de metadataBase.

## WMP12 — alinhamento da barra de volume — 06/11/2026

- Removido dos sliders do WMP12 o deslocamento vertical herdado do 7.css;
  o botão circular fica centralizado no trilho, inclusive no progresso do vídeo.
  Dimensões do botão normalizadas entre Chromium e Firefox, mantendo foco e
  interação nativos e a área de toque no celular.
- O preenchimento azul da barra de volume acompanha o valor ajustado.
- Check, build, typecheck e três testes do player aprovados. Edge em 1440 e
  375 px: volume real do YouTube em 0/35/100, teclado, clique e ausência de
  overflow conferidos, com inspeção visual do alinhamento. Build mantém o
  aviso anterior de metadataBase.

## Consolidação — somente Windows 7 — 06/11/2026

- A raiz `/` abre diretamente o logon/desktop Win7. BIOS e seleção de sistema
  retirados da experiência pública. `/xp` e `/win7` passam a redirecionar por
  HTTP 308 para `/`, preservando consultas e funcionando sem JavaScript.
  Removidas as páginas/layout XP e a entrada duplicada Win7; fontes e assets
  antigos continuam preservados como legado sem imports/CSS na aplicação ativa.
- Iniciar não oferece mais Windows XP. Reiniciar usa navegação de documento
  para a raiz, voltando ao logon também quando já estiver em `/`, com idioma e
  wallpaper mantidos. Acrescentado aviso visível para navegador sem JavaScript.
- Metadados passam a apresentar o portfólio de fotografia/vídeo no Win7;
  compartilhamento usa o wallpaper Win7 existente, sem modificar o asset antigo.
- Estúdio adaptado para Aero/7.css e CSS Modules em `src/os/win7/studio/`, com
  useT, EN/PT, prévia Drive manual e retorno a `/`. Em produção, a página agora
  responde 404; a API continua bloqueada com 403. Nenhum atalho de admin público.
- Novos cadastros do Estúdio salvam capas em `public/images/posters/`, separadas
  da galeria Thumbnails. Caminhos antigos, dados e todos os assets existentes
  foram preservados. A guarda de origem e validação de link/imagem permanecem.
- `npm run check` verifica a aplicação Win7 ativa e ausência de dependências
  XP/boot, mantendo validações do acervo. Novo `npm run test:studio` testa gravação
  isolada de poster/link, preservação dos projetos e bloqueios de produção,
  origem externa, link inválido e imagem falsa, sem alterar o repositório.
- README, AGENTS, plano e guia de manutenção atualizados para a arquitetura
  atual. A chave histórica de idioma `capimaso-xp-language` permanece para não
  perder as preferências dos visitantes.
- Check, typecheck, build e 38 testes aprovados. Edge de produção em EN/PT e
  375/768/1440 px confirmou entrada direta, perfil/vídeos/fotos, reinício na raiz,
  preferências e ausência de XP/overflow. HTTP validou 308 com query preservada,
  Estúdio 404/API 403 em produção e aviso sem JavaScript. Formulário Aero em dev
  conferido em EN/PT e 375/1440 px com prévias, envio simulado sem gravação real
  e retorno ao logon. O teste da API grava somente em diretório temporário.
  Build conserva o aviso anterior de metadataBase.

## Acervo novo e Meu perfil no Win7 — 06/11/2026

- Adicionados Dono da Bublitz, 1 Corte PIB e Investiu MKT 1 como novos curtos,
  com os três links reais do Drive fornecidos pelo proprietário. Títulos lidos
  dos arquivos públicos; descrições e softwares não informados ficam vazios.
  Scarface, Stefany, MegLuuh e Tranzit permanecem intactos.
- Posters 9:16 obtidos das prévias públicas do próprio Drive, em
  `public/images/posters/`, separados da galeria Thumbnails. Os posters de
  Corte PIB e Investiu MKT vieram pretos; foram preservados como fornecidos
  pelo Drive, sem fabricar imagens. Tentativa de obter outro quadro pelo player
  não conseguiu carregar esses vídeos neste ambiente. Capas melhores continuam
  dependendo de imagens do proprietário. Nenhum vídeo foi salvo no repositório.
- Sobre passa a se chamar Meu perfil, em layout de propriedades Win7, com abas
  Sobre mim, Programas, Serviços e Recados. Teclado por setas/Home/End,
  painéis associados aos tabs e preservação da aba ao minimizar/restaurar.
- Perfil reutiliza bio, identidade e disponibilidade existentes e exibe edição
  de vídeo e fotografia. Atalhos abrem Vídeos, Fotografias, Thumbnails e Contato.
  Vídeo de apresentação do XP abre no WMP12, separado da pasta de trabalhos.
- Programas mostra Premiere Pro, After Effects e Photoshop; Serviços mantém
  todos os preços e dez pacotes originais; Recados mantém texto, data, link e
  avatar reais. EN/PT usa o dicionário existente, sem duplicar os dados do XP.
- Contato reúne os perfis reais @capimaso e @capimaso.jpg, além dos contatos
  existentes. Dados específicos e equipamento ficam em `data/win7-profile.ts`.
  Modelo da câmera ainda não informado: a aba Equipamento só aparece quando
  houver dados reais, sem modelo inventado ou aviso provisório público.
- A retirada do XP/BIOS fica para a próxima etapa de consolidação, após confirmar
  os dados restantes. XP, boot e Estúdio continuam acessíveis nesta rodada.
- Check, typecheck, build e 37 testes aprovados. Edge de produção em
  375/768/1440 px, EN/PT: abas, teclado, painéis acessíveis, estado ao minimizar,
  três softwares, 15 linhas de serviços/pacotes, recado/avatar/data, intro no
  WMP12, dois Instagrams e os três novos links em `/preview` aprovados.
  Posters decodificados e iframes 9:16 sem autoplay; zero erros de página e
  sem overflow horizontal. Descrições de serviços quebram linha no mobile.
  A abertura do embed não comprova reprodução dos novos arquivos de ponta a
  ponta; o Drive não carregou os quadros alternativos durante a tentativa.
  Build conserva o aviso anterior de metadataBase.

## WMP12 — modo Em reprodução com as referências do proprietário — 06/11/2026

- Janela Windows Media Player adaptada às três capturas recebidas: fundo preto
  com iluminação azul discreta, título no alto, botão Mostrar lista, progresso
  fino e barra metálica central com botão circular azul. CSS Modules e SVGs de
  controles, sem alterar ou gerar imagens do acervo e sem dependências novas.
- YouTube continua sendo a fonte dos longos, agora comandado pela IFrame API
  oficial: play/pausa, parar/voltar ao início, seek, tempo, volume e mute reais.
  Autoplay permanece mudo. A integração não remove marcas, anúncios ou avisos
  do provedor e não extrai streams. Até estar pronta, os controles ficam inativos.
- Próximo/anterior respeitam a pasta de curtos ou longos; Mostrar lista abre a
  seleção dos projetos dessa pasta, com descrição e software. Tela cheia inclui
  vídeo e controles. Minimizar/restaurar preserva o player; trocar vídeo ou fechar
  destrói a instância antiga e cancela polling/timers.
- Curtos mantêm `/preview` do Drive e reprodução manual. A moldura usa o novo
  visual, mas play/seek/volume continuam dentro do vídeo; a barra externa oferece
  somente ações que funcionam (lista, anterior/próximo, tela cheia e original).
- Se a API YouTube falhar, o vídeo volta aos controles nativos e mantém o acesso
  ao original. Sem botões fictícios ou promessa de reprodução independente.
- Teclado: Espaço/K reproduz/pausa, setas buscam 5 s, M alterna mute e F alterna
  tela cheia quando o foco está no player; inputs e botões mantêm suas teclas
  nativas. Lista fecha com Escape. Interface e rótulos continuam EN/PT.
- Adicionado `npm run test:player` para carregamento compartilhado da API,
  falha/timeout com nova tentativa e valores de tempo ausentes/longos.
- Check, typecheck, build e 37 testes aprovados. Edge de produção, EN/PT em
  375/768/1440 px, validou vídeo YouTube real, play/pausa, seek confirmado após
  5 s, stop, volume/mute, atalhos, fullscreen, lista e preservação do iframe ao
  minimizar. Drive manteve `/preview`, proporção 9:16 e ausência de autoplay.
  Sem overflow horizontal ou erros de página; falha da API simulada confirmou
  fallback/reabertura, Escape/foco e viewport 375×430. MetadataBase mantém o
  aviso preexistente. A barra preserva o destino de seek enquanto aguarda a API,
  evitando que eventos de buffering revertam a posição escolhida.

## WMP12 — prova das fontes e inventário visual — 06/11/2026

- Adicionado `npm run probe:videos`: diagnóstico público dos links atuais,
  separado dos testes offline, sem ler credenciais nem salvar vídeos. O pedido
  Range é cancelado após receber os cabeçalhos; erros de rede são classificados.
- Nos dois curtos, o download público consultado retornou HTTP 200 `text/html`,
  sem resposta parcial de mídia validada. Os longos permanecem como links YouTube.
  Isso não indica falha dos embeds e não descarta investigação futura via API.
- Inspecionados visualmente os 38 ICO da pasta WMP12 Icons. Há ícones de mídia
  e ações, mas não foram encontrados sprites da barra de reprodução, `wmploc.dll`
  ou captura de referência do WMP12 no acervo local.
- O player completo depende de confirmar a origem real dos vídeos e a referência
  visual. Os links originais e os embeds existentes continuam funcionando;
  nenhum controle fictício, proxy de vídeo ou extração de streams foi adicionado.
- Evidências, limites e critérios da próxima prova em
  [docs/WMP12-PLAYBACK-VERIFICATION.md](docs/WMP12-PLAYBACK-VERIFICATION.md).
- Check, typecheck, build e sintaxe do diagnóstico aprovados; prova pública
  executada duas vezes com o mesmo resultado. Build mantém o aviso anterior
  de metadataBase. Nenhuma mudança na interface ou nos dados do acervo nesta rodada.

## Entrega — pastas de vídeos e thumbnails no Win7 — 06/11/2026

- Fotografias, Vídeos e Thumbnails aparecem como bibliotecas irmãs no desktop,
  Iniciar e busca EN/PT. Vídeos abre duas pastas: Vídeos curtos e Vídeos longos,
  com histórico voltar/avançar, breadcrumb, seleção e abertura por teclado,
  duplo clique no desktop ou toque no mobile.
- Catálogo compartilhado com o XP: os quatro projetos de `data/showcase.json`
  mantêm dados, links e capas. Thumbnails lista automaticamente as imagens de
  `public/images/thumbs/`, sem mover arquivos nem confundir a galeria com posters.
- Vídeos abrem em janela Win7 própria, usando nesta etapa os embeds atuais:
  Drive manual e YouTube com autoplay mudo; proporções 9:16 e 16:9 preservadas.
  Minimizar/restaurar mantém a instância do iframe; escolher outro vídeo atualiza
  a mesma janela sem perder a geometria. O WMP12 personalizado continua pendente.
- Thumbnails abre um visualizador local separado do acervo Drive, com imagem
  ajustada à janela, anterior/próxima por botão ou setas e download do arquivo.
- Games e promessas de jogos removidos do desktop, Iniciar, busca, taskbar e
  Explorer. Nenhum asset recebido foi apagado. XP, BIOS e Estúdio continuam
  disponíveis durante a migração; a retirada ocorrerá após migrar o perfil.
- Próximo trabalho: prova de reprodução para o player WMP12, inspeção dos ícones
  existentes e definição da fonte de mídia antes de fechar o visual/controles.
- Validação: check, typecheck, build e 34 testes aprovados. Edge de produção em
  375/768/1440 px, EN/PT, confirmou pastas, seleção/abertura, histórico, busca,
  proporções dos iframes, preservação ao minimizar e visualizador de thumbnails,
  sem overflow horizontal da página. A conferência dos embeds não comprova
  reprodução externa ponta a ponta nem o futuro player WMP12. O build mantém
  o aviso preexistente de metadataBase.

## Próxima fase — portfólio unificado no Windows 7 — 06/11/2026

Plano solicitado pelo proprietário; a entrega acima registra os itens concluídos.
Esta seção substitui o planejamento anterior de manter dois desktops e de adicionar
jogos. As entradas anteriores registram o histórico das entregas.

### Direção e escopo

- Windows 7 será a única experiência pública, reunindo fotografia, edição de vídeo
  e thumbnails. Remover a BIOS e o seletor de sistemas; a raiz abrirá o logon Win7.
- Após migrar e conferir o conteúdo importante, retirar a experiência XP pública
  e os atalhos de troca de sistema. Planejar redirecionamentos de `/xp` e `/win7`
  para a entrada definitiva, preservando links existentes.
- Jogos cancelados: não implementar Solitaire, Purble Place ou outros jogos.
  Remover a janela Games, atalhos, busca e avisos de futura disponibilidade.
  Preservar os assets recebidos; cancelar o recurso não autoriza apagar binários.
- Manter identidade Tiago / CAPIMASO, EN/PT, acessibilidade, funcionamento mobile
  e os recursos atuais de fotografias, janelas, personalização e áudio.

### Pastas de vídeos e thumbnails no Explorer

Organização desejada, com Fotografias, Vídeos e Thumbnails no mesmo nível:

```text
CAPIMASO
├── Fotografias
├── Vídeos
│   ├── Vídeos curtos
│   └── Vídeos longos
└── Thumbnails
```

- Adaptar a navegação ao Explorer Win7 existente: pastas, breadcrumbs,
  voltar/avançar, miniaturas, seleção e abertura por mouse, teclado e toque.
- Migrar o catálogo de [data/showcase.json](data/showcase.json), incluindo Scarface,
  Stefany, MegLuuh e Tranzit, preservando títulos, descrições, links, capas e formatos.
  Curtos e posters verticais em 9:16; longos em 16:9.
- A pasta Thumbnails será irmã de Vídeos, sem confundir a galeria de trabalhos
  gráficos com as capas dos vídeos. Reaproveitar a leitura automática de
  [public/images/thumbs/](public/images/thumbs/) por [lib/thumbnails.ts](lib/thumbnails.ts).
- Essas são pastas da interface: não mover os vídeos para o repositório nem
  exigir uma reorganização do Drive nesta etapa. Fotos continuam no Drive;
  vídeos mantêm inicialmente os links reais do catálogo, e thumbs os arquivos atuais.
- Preservar o cadastro local do Estúdio e adaptar seus caminhos/estilos para não
  depender do desktop XP removido. Continuar bloqueando gravação em produção.

### Player de vídeo — Windows Media Player 12

- Objetivo: janela e controles fiéis ao Windows Media Player do Windows 7,
  com reprodução/pausa, progresso, tempo, volume e tela cheia funcionais.
  Preservar a proporção e permitir minimizar/restaurar sem perder o estado.
- Há ícones locais em [WMP12 Icons](public/assets/win7/icons/WMP12%20Icons/)
  e [Windows Media Player](public/assets/win7/icons/Windows%20Media%20Player/).
  Inspecioná-los antes de solicitar recursos adicionais; ícones não comprovam
  que existam todas as artes dos controles ou da interface.
- Antes do acabamento, validar a fonte de reprodução. O player atual do XP usa
  iframes do YouTube e `/preview` do Google Drive. Uma moldura WMP ao redor deles
  não satisfaz, por si só, o objetivo de abandonar a aparência desses players.
- YouTube permite controle por API e ocultar seus controles, mas não oferece
  garantia de eliminar sua identidade visual; `modestbranding` não tem efeito.
  Não prometer um player totalmente sem marca mantendo apenas o embed atual.
- Investigar uma fonte de mídia compatível com `<video>` e controles próprios,
  sem adicionar vídeos locais ao Git. Para arquivos no Drive, validar acesso,
  busca por tempo, carregamento parcial, formatos, quota e limites de hospedagem
  antes de adotar uma solução. Não reaproveitar o proxy de fotos sem adaptar e
  verificar seu contrato de segurança; não expor credenciais no navegador.
- Preservar os links atuais enquanto a alternativa é validada. Caso sejam
  necessários os arquivos originais dos vídeos longos ou outra hospedagem,
  registrar a dependência e combinar a origem real com o proprietário.
- Se faltarem referências visuais ou assets após a inspeção local, solicitar
  captura do WMP12 e os recursos específicos ao proprietário, que se ofereceu
  para encontrá-los. Não fabricar assets ou controles meramente decorativos.

Referências técnicas consultadas para o planejamento:
[parâmetros do YouTube](https://developers.google.com/youtube/player_parameters),
[IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) e
[download de arquivos no Drive](https://developers.google.com/workspace/drive/api/guides/manage-downloads).

### Meu perfil — conteúdo do XP adaptado ao Win7

- O Sobre atual do Win7 apresenta foto, nome, atividade, bio e disponibilidade.
  Ampliá-lo com a apresentação e os acessos importantes do XP, usando composição
  visual do Windows 7, sem copiar o tema Luna.
- Migrar os recursos úteis identificados em [XPApps.tsx](src/os/xp/XPApps.tsx):
  apresentação/boas-vindas, vídeo de introdução, trabalhos, softwares, serviços,
  pacotes/preços, recados reais de clientes e contatos. Distribuir em seções e
  janelas apropriadas, evitando concentrar todo o portfólio em uma única tela.
- Reaproveitar [perfil](data/profile.ts), [vídeo de apresentação](data/media.ts),
  [softwares](data/skills.ts), [serviços](data/services.ts) e [recados](data/comments.ts),
  preservando conteúdo, preços, avatares e links reais.
- Exibir Premiere Pro, After Effects e Photoshop: os três já estão cadastrados
  em [data/skills.ts](data/skills.ts); Photoshop precisa ganhar visibilidade no Win7.
- Incluir fotografia na apresentação e uma seção de equipamento com o modelo real
  da câmera. Modelo ainda não localizado nos dados: pedir ao proprietário antes
  de preencher, sem inventar câmera, lente ou outros equipamentos.
- Conciliar os contatos de vídeo e fotografia, preservando os perfis distintos
  `@capimaso` e `@capimaso.jpg`, além de e-mail, Discord e YouTube existentes.

### Ordem da próxima implementação

1. Concluído: pastas Vídeos/curtos/longos e Thumbnails no Win7 com o acervo
   atual, reaproveitando os dados do XP e preservando Fotografias.
2. Fazer a prova de reprodução e definir a fonte de mídia; então construir o WMP12
   com as referências/assets necessários e controles reais.
3. Ampliar Meu perfil, softwares, equipamento, serviços e recados; confirmar o
   modelo da câmera com o proprietário.
4. Conferir a migração e retirar XP/BIOS/seletor da experiência
   pública. Revisar Estúdio, rotas, redirecionamentos e atalhos remanescentes.
5. Atualizar [AGENTS.md](AGENTS.md), [PLANS.md](PLANS.md), [README.md](README.md)
   e [guia de manutenção](docs/CODEX-GUIDE.md) para a arquitetura apenas Win7;
   executar check, typecheck, build e testes relevantes, além da regressão visual
   desktop/mobile e da preservação dos dados/assets.

Na rodada inicial houve somente análise e atualização deste planejamento; nenhuma
rota, aplicativo, configuração de mídia ou arquivo do acervo foi removido.

## Auditoria mobile — 375 px

- Taskbar de 56 px com alvos de toque de 44 px, tarefas com rolagem interna,
  idioma em botão compacto alternável, volume e Mostrar Desktop acessíveis.
- Iniciar ocupa a área acima da barra, com fechar explícito de 44 px, pesquisa
  no topo e sem autofocus no input ao abrir. Colunas rolam internamente em
  alturas curtas. Desktop fixo e conteúdo das janelas contido, sem scroll lateral
  da página; janelas móveis preenchem a área útil, preservando a barra.
- Controles de janela e de conteúdo com toque ampliado; inputs de 16 px para
  evitar zoom de foco, mantendo desktop XP e o layout Win7 amplo isolados.
- Check, typecheck e build aprovados. Emulação Edge com toque em 375×812 e
  375×430, EN/PT: apps/Viewer sem overflow horizontal da página, fechar Iniciar,
  slider, idioma e swipe real na lista de tarefas aprovados. Auditoria em
  docs/WIN7-MOBILE-VERIFICATION.md; não substitui teste em aparelho físico.

## Polimento Aero — 250 ms

- Minimização/restauração e maximização usam 250 ms ease-in-out para transform
  e opacity. Mostrar Desktop agora envia cada janela ao seu botão de tarefa,
  mantendo restauração seletiva e reversão da animação em andamento.

## Seleção e hover de ícones Win7

- Arrastar com botão esquerdo em área vazia desenha seleção azul translúcida
  com borda de 1 px. Interseção parcial seleciona; mover a caixa atualiza os
  ícones em tempo real. Soltar remove a caixa; clique vazio limpa a seleção.
- Hook com pointer capture, atualizações por frame, leitura inicial dos limites
  e cleanup em Escape/cancelamento/perda de captura/blur/resize/desmontagem.
  Janelas e taskbar não iniciam seleção; toque continua abrindo apps no mobile.
- Desktop e tiles de arquivos/pastas do Explorer têm transition:none, inclusive
  pseudo-elementos. Fades de taskbar, Orb, Iniciar e controles preservados.
- Check, typecheck e build aprovados. Edge em 1440/360 px confirmou interseção
  pelas bordas, dois sentidos, desseleção ao reduzir a caixa, clique vazio,
  Escape, Ctrl+clique, teclado, exclusão de janelas e abertura por toque.

## Animações Aero de janelas

- Minimizar por controle, taskbar ou Mostrar Área de Trabalho mantém a janela
  visível durante 300 ms, com translate/scale(.1)/opacity até o destino medido.
  Restauração faz o percurso inverso; maximizar/restaurar tamanho usa FLIP.
- Estado, geometria e apps continuam no reducer; o hook de apresentação adia
  hidden até terminar, permite reversão a partir do frame atual e cancela ao
  fechar. Janelas minimizadas ficam inert durante a saída. Movimento reduzido
  dispensa a animação. Treze testes de janelas aprovados.
- Check, typecheck e build aprovados. Edge de produção confirmou animações
  e reversão, destinos da taskbar/Mostrar Desktop, redução de movimento e
  preservação de conteúdo/geometria. Redimensionar de mobile para desktop
  não revela janelas minimizadas. Popup validado em 1440 e 360 px.
- Áudio validado com autoplay permitido e bloqueado: MP3 no logon ou nova
  tentativa na entrada, sem startup do desktop; slider, Ding e teclado funcionam.

## Áudio — boas-vindas e volume global

- Bandeja recebe alto-falante SVG e popup vertical conforme volume.png, com
  slider 0–100%, mute sincronizado com Painel de Controle, teclado/Escape e
  fechamento externo. Ajuste atualiza áudio imediatamente e toca Ding após
  150 ms sem novos movimentos, respeitando mute/volume zero.
- Startup agora usa `windows-7-startup.mp3` ao aparecer o logon, sem disparo
  na montagem do desktop. Se autoplay for bloqueado, tenta novamente na entrada.
- Volume inicial de 80%, ajustável em tempo real em todos os áudios existentes
  e futuros. Ding original adicionado ao mapa; mute preservado. Nove testes de
  áudio aprovados, incluindo volume, limites e fallback de autoplay.

## Sons reais — mapeamento dos arquivos recebidos

- Varredura recursiva identificou 303 WAVs e 3 MIDIs, na raiz e em 13 temas.
  Os cinco eventos usam os WAVs originais da raiz, PCM estéreo 44,1 kHz/16 bits.
  Nenhum arquivo foi renomeado, convertido ou removido.
- `src/lib/sounds-map.ts` centraliza URLs com nomes Microsoft; SoundManager e
  detecção server-only compartilham a configuração. Mute, ativação por entrada,
  volume 40% e fallback silencioso continuam funcionando.
- Testes cobrem os nomes reais, disponibilidade no servidor, ausência de arquivos,
  variantes de tema, diretórios, replay, mute e falhas de reprodução.
- Check, typecheck, build e sete testes de áudio aprovados. Edge de produção
  confirmou os cinco eventos `playing`, URLs originais e decodificação estéreo
  dos WAVs; falha de rede do Explorer foi simulada para validar o som de erro.

## Painel de Controle Win7

- Nova janela acessível pelo Iniciar e pela busca, em ícones grandes conforme config.png. Personalizar troca entre os dois wallpapers reais, com preferência local exclusiva do Win7; logon e XP preservados.
- Som controla o SoundManager global: mute pausa áudio corrente e bloqueia todos os eventos até reativar. Cinco testes de áudio aprovados, incluindo assinatura de estado e mute/desmute.
- Só são apresentados os dois ajustes funcionais desta rodada. Personalização usa o monitor/pincel original imageres_151.ico, identificado no acervo local; grade mantém a largura das colunas da referência.

## Ícone dinâmico do Menu Iniciar

- Validação final: check, typecheck, build, 12 testes de janelas e 5 de áudio
  aprovados. Navegador confirmou também prévia por teclado/pastas, reinício do
  prazo ao trocar item, persistência de Harmony após reload e rotas XP/Estúdio.
- Referência `menu iniciar 2.png`: após 500 ms no mesmo item, o avatar cruza
  por opacidade com o ícone original de 64 px. Sair antes do prazo cancela;
  sair depois restaura o avatar em 200 ms, mantendo o ícone durante o fade.
- Funciona nos programas, atalhos da direita e pastas reais da busca. Trocar
  item, pesquisa, lista de programas, fechar menu ou desmontar cancela o timer;
  foco por teclado oferece a mesma prévia.
- Edge de produção em 1440 px/EN e 360 px/PT confirmou atraso de 507–510 ms,
  cancelamento, opacidades intermediárias e restauração após fechar/reabrir.

## Contato de fotografia

- Instagram do Contato Win7 atualizado para @capimaso.jpg, incluindo link e cópia. Contatos XP preservados; dados específicos em data/win7-socials.ts.

## Correção pontual — cursor da transição

- Check, typecheck e build aprovados; Edge em produção confirmou opacidades intermediárias no Orb, taskbar, menu e controles, inclusive com movimento reduzido. Busy.cur retornou HTTP 200 com cabeçalho CUR válido.
- Tela preta de 700 ms usa /assets/win7/cursor/Busy.cur, extraído sem alterar pixels do Busy.ani fornecido. Frame estático compatível com navegador, hotspot original 16,16; nenhum asset gerado por IA.

## Correção pontual — hover dos controles

- Transições explícitas de 200 ms nos botões da taskbar, itens do Iniciar e controles das janelas, incluindo as camadas de brilho. O Orb declara background-position no botão e mantém o fade entre frames originais.
- Movimento reduzido continua removendo animações espaciais, sem anular o feedback de cor/opacidade dos controles.

# Windows 7 — Google Drive — 22/10/2026

## Transição de entrada — 700 ms

- Entrar por seta/Enter mostra uma cobertura preta fixa, z-index 9999 e cursor
  wait por 700 ms antes de montar o desktop. Timer é limpo ao sair da rota;
  wallpaper do desktop é pré-carregado durante a espera.
- Logon mantém harmony.jpg e desktop mantém desktop-logo.jpg fornecido pelo
  proprietário. Os binários existentes não foram sobrescritos nesta correção.
- Check, typecheck e build aprovados. Navegador de produção confirmou entrada por
  clique/Enter em 1440/360 px, overlay preto com cursor wait por cerca de 700 ms,
  fades de 200 ms, troca correta dos wallpapers e preferência por movimento reduzido.

## Ajuste de hover suave

- Removido o bloqueio global de transições. Controles e brilhos voltam a usar
  fade de 200 ms; taskbar e itens do Iniciar usam camadas de brilho com opacidade.
- Orb cruza os três frames fixos por opacidade, sem animar a posição da sprite
  (evita mostrar recortes entre estados). Movimento reduzido desativa os fades.

## Auditoria final — validação

- Check, typecheck, build e 26 testes aprovados. Auditoria Edge em dev/produção
  em 360/768/1440 confirmou Logon, Aero, hover instantâneo, Explorer e silêncio
  para WAV ausentes. Drive real e regressão do XP/Estúdio aprovados.
- Relatório, referências e limites em docs/WIN7-FINAL-AUDIT.md; nenhum segredo
  encontrado nos bundles públicos. Wallpaper reutilizado tem hash idêntico à fonte.

## Auditoria final — Áudio

- SoundManager global habilitado pela entrada: logon, startup do desktop,
  voltar/avançar, minimizar (incluindo taskbar/mostrar desktop) e falhas reais da
  galeria/busca. Erros consecutivos têm limite para evitar repetição excessiva.
- Servidor informa apenas WAV existentes; ausência não gera requests nem som.
  Arquivos ausentes documentados em public/assets/win7/sounds/README.md. Rejeição
  de autoplay/decodificação é silenciosa; sair libera os elementos de áudio.

## Auditoria final — Explorer

- Refresh verde/azul dentro da barra de endereço; histórico mantém botões redondos
  com gel radial e brilho interno, sem fade. Rodapé branco com contagem à esquerda.
- Scrollbars WebKit com thumb azul em gradiente e setas da biblioteca 7.css;
  fallback nativo colorido nos demais motores. Galeria, histórico e proxy preservados.

## Auditoria final — Aero

- Taskbar com gradiente escuro translúcido, blur de 15 px, borda branca superior
  e preta inferior; camadas opacas herdadas desativadas somente nela.
- Títulos com vidro/reflexos 7.css e blur de 10 px; sombra difusa 0 10px 30px nas
  janelas. Controles preservam glifos oficiais com gradiente vertical e brilho.
- Ícones mantêm fundo transparente e seleção azul; texto usa sombra 1px 1px 3px.

## Auditoria final — Hover

- Estados hover/pressed/focus são instantâneos em botões, links e campos do Win7,
  incluindo pseudo-elementos e brilho do 7.css. Animação de pulso removida dos
  controles. Menu Iniciar abre/fecha imediatamente; seleção dos ícones é preservada.

## Auditoria final — Logon

- `/win7` apresenta boas-vindas com Harmony, avatar real, CAPIMASO e entrada por
  Enter/seta. Campo visual opcional: não é lido, armazenado ou enviado; formulário
  é limpo na entrada. Idiomas EN/PT e mobile mantidos.
- Desktop usa desktop-logo.jpg: cópia exata do wallpaper oficial Harmony já
  disponível, pois o caminho solicitado estava ausente. Origem em ASSETS_NEEDED.md.

## Base visual 7.css — refatoração incremental

- Validação final em docs/WIN7-REFACTOR-VERIFICATION.md: 22 testes automatizados,
  fluxos de navegador em dev/produção, Drive real e hashes do XP preservados.
  Chave ausente dos bundles e arquivos versionados; sem novas imagens geradas.
  Comparação visual com capturas locais, Win7 Simu e explorer7 registrada.

- Busca separada em catálogo bilíngue e consulta paginada das pastas reais da
  raiz do Drive. Debounce/cancelamento e cache de 60 s evitam consultas ociosas;
  falha remota não impede Calculadora/Bloco de notas e outros atalhos locais.
  Resultado de pasta restaura o Explorer existente no endereço correto, mantendo
  geometria; o caminho continua sendo validado pelo backend original.

- useWindowManager centraliza ações e área útil; useWindowGesture separa captura
  de ponteiro, atualização por frame e cleanup. Geometria pura cobre oito bordas.
  Foco repetido é idempotente; frames atrasados não alteram janelas minimizadas
  ou maximizadas. Fechar não rouba mais foco da próxima janela visível.
- Testes do gerenciador ampliados e fluxos de navegador verificaram drag/resize,
  restauração exata, taskbar, mostrar desktop, idiomas e transição XP/Win7.

- Plano reescrito com fontes e código consultados, limites dos projetos e etapas
  futuras de logon. 7.css 0.21.1 fixado no manifesto e lockfile.
- Distribuição oficial scoped na camada win7-base: molduras, estados de título,
  glifos e controles vêm da biblioteca. Taskbar e StartMenu reutilizam seu vidro
  sem filtros duplicados; adaptações locais tratam layout e dialogs do React.
- StartOrb separado, frames nativos e escala uniforme; fade/scale do menu e
  preferência por movimento reduzido mantidos. XP/boot/Estúdio seguem isolados.

## QA Win7 ? fidelidade do Aero e Menu Iniciar (2026-10-22)

- Taskbar e molduras Aero usam camadas mais transparentes, blur de 7 px e reflexos internos; conte?do das janelas permanece leg?vel.
- Start Orb preserva frames nativos de 106x106 da sprite 106x318 e reduz ambos os eixos exatamente a 50%, incluindo normal, hover e pressed.
- Menu Iniciar permanece montado para animar abertura e fechamento com fade/scale; fechado fica invis?vel, inert e fora da navega??o. Respeita prefer?ncia por movimento reduzido e reinicia a busca ao abrir.
- Acess?rios t?m estilos locais no Win7; nenhum CSS do XP foi alterado.

## QA Win7 ? originais, downloads e busca (2026-10-22)

- Photo Viewer carrega e valida o original pelo proxy antes de exibir, cancela requisi??es antigas e libera URLs tempor?rias. O download reutiliza os mesmos bytes, mant?m o nome e aguarda 60 segundos antes de liberar seu Blob.
- Erros do Drive aparecem no visualizador com tentativa manual; transfer?ncias de originais t?m timeout de 60 segundos. Nenhuma chave chega ao cliente.
- Busca e Todos os programas incluem acess?rios funcionais Calculadora e Bloco de notas, al?m de pastas e aplicativos existentes; busca aceita nomes em portugu?s e ingl?s e termos como fotos e bibliotecas. ?cone da Calculadora pendente registrado em ASSETS_NEEDED.md.
- Verifica??o: API real retornou original JPEG (HTTP 200); navegador confirmou visualiza??o, navega??o, zoom e download com bytes id?nticos. Testes automatizados cobrem respostas inv?lidas e prote??o do proxy.

- Check, typecheck, build, nove testes do backend e sete do gerenciador passaram.
  Teste real listou pastas, abriu imagens e validou download idêntico por hash.
  Testes simulados de erro, paginação e mobile passaram também em produção.
  Google aplicou limite temporário aos originais na reconferência; caso tratado
  sem contorno. Detalhes e limites em `docs/PHOTOS-VERIFICATION.md`.
- `.env.local` preservado e não versionado; nenhuma ocorrência da chave real
  encontrada nos arquivos versionados ou bundles do navegador.

- Limites de quota e bloqueios temporários HTML do Google retornam 429 com
  Retry-After, sem repassar a página do provedor nem tentar contornar o bloqueio.

- Photo Viewer em janela Aero independente, fundo escuro, anterior/próximo na
  mesma pasta (inclusive próximas páginas), zoom 5–800%, ajuste à janela e
  download dos bytes originais. Teclas esquerda/direita, +/- e 0 suportadas.
- Download só inicia após resposta válida; falhas de imagem, paginação ou
  download exibem erro e opção de tentar novamente. Fechar cancela requisições.

- Explorer de fotografias conectado à raiz real, com histórico voltar/avançar,
  breadcrumbs clicáveis, sidebar, miniaturas em molduras, seleção, paginação,
  skeletons e mensagens de erro EN/PT. Enter/duplo clique abre; mobile usa um toque.
- Caminhos do cliente são apenas dicas: cada vínculo pai/filho é verificado por
  listagem do Drive, inclusive quando files.get omite parents no acervo público.

- APIs de listagem paginada e proxy de miniaturas/originais em `/api/photos`.
  Apenas pastas e imagens raster compatíveis; navegação limitada à raiz configurada.
- Credenciais lidas somente no servidor. `DRIVE_FOLDER_ID` aceita ID ou link de
  pasta, sem alterar `.env.local`. Erros retornam códigos seguros, sem respostas
  brutas do provedor. A chave vai em header e nunca no JSON ou URL do cliente.
- Cache de metadados/listagem por 60s, atualização explícita, suporte a resource
  keys e validação de ancestralidade antes de entregar arquivos. Download usa
  bytes originais e Content-Disposition attachment com nome UTF-8.

# Windows 7 — desktop — 22/10/2026

- `npm run check`, `npm run typecheck`, `npm run build` e seis testes em
  `npm run test:win7` passaram. Fluxos Edge/Playwright também passaram no servidor
  de produção, incluindo toque em retrato/paisagem e transições entre sistemas.
  Comparação do XP confirma geometria/estilos e hashes anteriores preservados.
  Relatório em `docs/WIN7-VERIFICATION.md` e inventário em `ASSETS_NEEDED.md`.

- Shell conectado ao gerenciador Aero: abrir por duplo clique/Enter (um toque
  no mobile), foco, arraste, oito bordas de redimensionamento, minimizar,
  maximizar/restaurar, fechar e alternar pela taskbar. Mostrar desktop preserva
  as janelas e restaura somente as que estavam visíveis.
- Geometria limitada à área útil; mobile abre em tela cheia acima da taskbar,
  preservando a geometria desktop. Barra de título oferece movimento por setas
  e redimensionamento por Shift+setas; controles mantêm rótulos EN/PT.
- Sobre/Contato usam informações reais. Fotografias e Games abrem janelas de
  preparação; esta rodada não implementa Drive. Jogos foram posteriormente cancelados.

- Componentes de taskbar e menu Iniciar em duas colunas usam Aero, busca
  bilíngue, relógio/data locais, atalhos e Reiniciar. O Start Orb usa o sprite
  original 106x318: quadros de 54px em Y=0/-54/-108 após escala.

- `/win7` recebe shell independente com Harmony, ícones ICO reais e cursores
  locais. Seleção por clique, Ctrl/Cmd para múltiplos e navegação por setas.
- CSS Modules limita o tema à área Windows 7. EN/PT compartilha a preferência
  existente, sem modificar o wallpaper ou os dados do XP.

# Dual boot — BIOS e Boot Manager — 22/10/2026

- `.env.example` documenta DRIVE_FOLDER_ID, GOOGLE_DRIVE_API_KEY e
  DRIVE_FOLDER_RESOURCE_KEY opcional, sem valores nem variáveis públicas.
  A integração fotográfica permanece para a próxima etapa.

- `/` agora mostra BIOS textual de 1,5s, pulável por teclado ou botão, seguida
  de escolha manual XP/Vídeos ou Win7/Fotos. Setas, Home/End, Enter, Tab,
  mouse e toque suportados; links disponíveis mesmo sem JavaScript.
- Movimento reduzido elimina a espera. EN/PT usa o mesmo idioma salvo pelo XP.
- Menu Iniciar do XP tem link Escolher sistema. `/win7` mostra aviso bilíngue
  com retorno ao boot/XP até a implementação do desktop na próxima etapa.
- Sem imagens novas, sons automáticos ou configuração de hardware fictícia.
- Validação final: `npm run check`, `npm run typecheck` e `npm run build`
  passaram. Edge/Playwright validou teclado, clique, toque em 360px, ausência
  de JavaScript, movimento reduzido e retorno XP → boot sem vazamento de tema.
  Janelas, galeria, wallpaper e proporções dos embeds preservados. Em produção,
  as quatro páginas retornam 200 e a API de upload retorna 403. Reprodução
  remota dos provedores não foi testada. Detalhes em `docs/XP-BASELINE.md`.

# Dual boot — migração XP — 22/10/2026

- Desktop ativo movido para `src/os/xp/` e publicado em `/xp`.
- Tema limitado ao contêiner `.xp-shell`, inclusive no Estúdio. Layout raiz
  mantém somente estrutura; regras de fontes, controles e cursores não vazam.
- Estúdio retorna a `/xp`; API, dados, mídias, preferências e players preservados.
- Contexto de idioma compartilhado em `src/shared/`; exports de compatibilidade
  preservam os componentes antigos sem reativá-los.
- Check/typecheck passaram. Edge/Playwright confirmou as mesmas medidas, fontes,
  cores e bordas iniciais em 360/768/1440px, Estúdio estilizado e hashes de todos
  os dados/assets inalterados.

# Correção do build na Vercel — 18/10/2026

- Logs do deployment `dpl_6ud6GjyMJU4BUNestoJNtLYR4Kws` confirmaram falha na checagem TypeScript: componentes do desktop antigo, não importados pela aplicação XP atual, e duas traduções duplicadas.
- `tsconfig.json` passa a usar as rotas de `app/`, a configuração Next e os tipos gerados como entradas. Todos os componentes, helpers e dados importados continuam sendo verificados com `strict: true`. Arquivos legados preservados; nenhuma dependência de animação adicionada.
- Removidas somente as cópias idênticas de `Meus trabalhos` e `Ferramentas` em `lib/locale-dictionary.ts`, mantendo os mesmos textos EN/PT.
- `npm run check`, `npm run typecheck` e `npm run build` concluídos com sucesso. Conteúdo, imagens, thumbnails, projetos e links do Drive preservados.

# Google Drive nos vídeos curtos — 18/10/2026

- Reels/Shorts usam o player incorporado do Google Drive em 9:16, preservando o tema XP e todas as thumbnails. Vídeos longos e apresentação continuam no YouTube.
- Scarface e Stefany configurados em `data/showcase.json` com os links reais fornecidos pelo proprietário. Títulos, descrições, capas e demais projetos preservados.
- Estúdio local recebe link do Drive e upload da capa; grava apenas imagem e manifesto. Removidos upload de vídeo e captura de frame local. A API continua bloqueada em produção.
- Drive usa reprodução pelo controle do player, sem forçar autoplay com áudio. Fullscreen e link para abrir no Drive disponíveis. EN/PT preservados.
- Removidos, a pedido do proprietário, os 10 arquivos MP4 de `public/videos/` (719.908.459 bytes, cerca de 687 MiB). Nenhuma imagem removida. A sincronização não restaura vídeos; o Git ignora novos binários nessa pasta.
- A exclusão dos arquivos não remove blobs de commits antigos. Nenhum histórico Git foi reescrito.
- Validação: `npm run check` passou; navegador conferido em 360, 768 e 1440 px, com os dois iframes Drive em 9:16, YouTube preservado e Estúdio EN/PT. API testada com link/capa reais, rejeição de links inválidos e bloqueio em produção; dados temporários de teste removidos. `npm run build` compilou, mas build/typecheck seguem bloqueados pelos mesmos 51 erros TypeScript da versão anterior (componentes legados e chaves repetidas nos dicionários), sem erros novos.

# ✅ Atualização 2.1 — correções solicitadas (17/10/2026)

Esta é uma atualização **incremental** da edição Windows XP Luna.

- **Personalização de wallpaper:** novas configurações reais de exibição, presets, seleção de imagem do computador, arquivo estático em `public/images`, armazenamento no navegador via IndexedDB, persistência de preferências via `localStorage`. Nova pasta técnica: `lib/wallpaper.ts`; novo componente: `components/WallpaperSettings.tsx`.
- **Menu Iniciar:** substituí os caracteres `🔑` e `⏻` por SVGs desenhados com contorno e preenchimento no próprio `components/XPIcon.tsx`. Ajustei caixa e alinhamento no CSS.
- **Player:** redefini o layout para ocupar somente a altura disponível da janela, com enquadramento 16:9 em vídeos longos e 9:16 em curtos. YouTube usa parâmetros `autoplay=1&mute=1&playsinline=1`, `allow=autoplay`; MP4/WebM locais usam `autoPlay muted playsInline`. Início sem áudio é a configuração mais compatível com bloqueadores de autoplay.
- **Internacionalização EN/PT:** introduzi `lib/locale-dictionary.ts` e `components/LanguageContext.tsx`, alternador EN/PT na barra de tarefas, primeira visita em EN e persistência da preferência. Tratei o conteúdo das principais janelas e do Estúdio. Traduções de novos conteúdos são manuais no dicionário.
- **Cursores originais:** reativei as referências CSS aos quatro `public/icons/cursor*.svg`, com fallback nativo, usando os arquivos da versão original quando presentes.
- **Documentação e checagens** atualizadas; metadados em inglês por padrão. Nenhum vídeo/thumbnail/biografia original removido intencionalmente.

**Testes executados neste ambiente:** checagens de integridade do manifesto e arquivos, análise sintática dos componentes TypeScript/TSX e análise sintática do CSS. **Build real não executado aqui:** registro npm inacessível (`EAI_AGAIN`), e a pasta `node_modules` não foi instalada. Rode `npm run build` no seu Windows antes de publicar.

---

# 📋 Registro de mudanças — CAPIMASO XP v2.0

Comparação feita com o repositório público `capimaso/capimaso-portfolio`, branch `main`, consultado em **15/10/2026**.

| Antes | Agora | Por quê |
| --- | --- | --- |
| Identidade híbrida Y2K/retro/painéis modernos, com CSS longo e sobreposto | Interface reconstruída em **XP Luna Blue** com dimensões e características clássicas | Coerência visual: desktop reconhecível em vez de estética genérica de IA |
| Tela inicial com múltiplos slogans técnicos e “Watch My Reel” | Bem-vindo ao meu computador, texto pessoal mais objetivo e botão **azul** “Vídeo de apresentação” | Personalidade real, menos clichês e CTA visível |
| Em Reels, embed/link Instagram/YouTube | **MP4/WebM local em `<video>` com controles nativos**; Instagram legado mantém link externo até receber o MP4 | Player confiável com controle sobre a mídia |
| Thumbnails vinculadas a links ou imagens diversas | Capa explícita por projeto; 9:16 curto e 16:9 longo; captura de frame no Estúdio | Evitar miniaturas cortadas sem critério ou sem imagem |
| Edição de projetos em TypeScript e vários pontos distintos | `data/showcase.json` centraliza as entradas; `/studio` edita com upload local | Facilita manutenção por Codex sem contexto |
| CSS `styles/globals.css` + `styles/portfolio-upgrades.css` (grande superfície de regras) | Um arquivo **`app/xp.css`**, organizado por aplicações/áreas | Menos conflitos, menos estilos “vibecoded” |
| Janelas com animações e decoração próprias | Barra de título, controles e taskbar inspirados no XP; arrastar, minimizar, maximizar, restaurar e foco | Coerência de comportamento com o desktop clássico |
| README longo, repetitivo e parcialmente desatualizado | README documentado por tarefas + `AGENTS.md` + guia Codex | Alterações futuras mais previsíveis |
| Parede visual original do repositório | Fundo `xp-hills.svg` inspirado no Bliss (original), com alternância para `wallpaper.svg` antigo | Experiência XP sem redistribuir foto protegida |
| Dados editoriais e imagens espalhados | Biografia, preços, serviços, contatos, thumbnail `ThumbBizu` e depoimento MegLuuh **mantidos** | Preservar a autoria do projeto |

Para um diagnóstico de código e UI/UX do projeto anterior, leia [`docs/ANALISE-DO-ORIGINAL.md`](docs/ANALISE-DO-ORIGINAL.md).

## Arquitetura

O núcleo foi simplificado: Next.js/React/TypeScript, sem necessidade de Framer Motion ou Tailwind. Os arquivos anteriores `styles/`, `components/Desktop.tsx` etc. podem continuar no seu repo ao sobrepor o ZIP; **não são importados pela interface nova**. Evite removê-los antes de verificar a migração. Remoção futura pode ser feita após sua confirmação.

## Limites honestos

- **Vídeo do Instagram já existente (Scarface):** o repositório atual guarda o link e a capa, **não o MP4**. A nova versão preserva o link e não finge que possui o arquivo. Faça upload do MP4 no Estúdio para reprodução local.
- **Vídeo de introdução:** o vídeo atual permanece no YouTube (`data/media.ts`) e o botão azul o abre no player embutido. Você pode trocar pelo MP4 local quando tiver o arquivo.
- **Upload em produção:** propositalmente bloqueado. Para que arquivos fiquem disponíveis a todos na Vercel, faça commit/push após o upload no Estúdio local. Para upload direto da web seria necessário configurar armazenamento/autenticação.
- **Fotos/arquivos binários originais:** devido à limitação de transferência do ambiente de edição, não estão embutidos neste ZIP. São preservados no repo atual e restaurados pelo script `npm run assets:sync` ao inicializar uma cópia limpa com internet.
- **Build:** análise estática dos arquivos foi realizada; `npm install` e o build real dependem das bibliotecas e de acesso à internet do ambiente de publicação. Confira-os antes de substituir o site público.
- **Licença do Bliss:** não é distribuída a foto da Microsoft. O papel de parede incluído é uma interpretação vetorial original.

## Testes manuais importantes

1. Desktop, menu Iniciar, janela com arrastar, minimizar e maximizar.
2. Touch/celular: a janela ocupa a área útil, sem horizontal scroll.
3. Reels: poster vertical e `video` local com controles.
4. Longos: iframe YouTube; sem download de vídeo longo.
5. Estúdio: arquivo real, poster gerado ou upload próprio, título/descrição, validação e persistência em disco local.
6. Recados, preços e email compatíveis com o original.

## Correção 2.1.1 — resolução de módulo

- O dicionário passou a se chamar `lib/locale-dictionary.ts`, evitando conflito com `lib/i18n.tsx` deixado por versões anteriores ao copiar arquivos por cima.
- Os imports do desktop, do contexto e do Estúdio foram atualizados; verificação de regressão adicionada a `npm run check`.
- Se existir `lib/i18n.tsx` antigo, você pode apagá-lo após confirmar que não é usado por outros arquivos.


## 2.2 — Wallpaper clássico como padrão
- Bliss em `public/images/xp-bliss.jpg` vira o fundo inicial para novos visitantes. A imagem é fornecida pelo proprietário do site e não faz parte do ZIP.
- Preferências agora incluem Bliss, ilustração XP, fundo do repositório e upload de imagem; removido o campo "Site Image File".
- Botão Restore Default restaura o Bliss. Preferências já salvas nos navegadores são respeitadas até serem alteradas.
