# CAPIMASO XP: manutenção por tarefa

O desktop XP está em `/xp`; `/` é o boot. O Estúdio continua em
`/studio` e recebe seu próprio layout `.xp-shell`. Estilos XP nunca devem
selecionar elementos fora desse contêiner. Entradas Next permanecem em `app/`;
implementação ativa está em `src/os/xp/`. Ver plano completo em `PLANS.md`.

O Windows 7 está em `/win7`, implementado em `src/os/win7/` com CSS Modules.
`Logon.tsx` antecede o desktop em toda entrada na rota; é uma apresentação pública,
sem autenticação, persistência ou transmissão do campo visual. A entrada mostra
tela preta fixa com cursor original Busy.cur (frame do Busy.ani) por 700 ms, com cleanup do timer ao desmontar.
Harmony no logon, desktop-logo.jpg na área de trabalho. Eventos de áudio passam
pelo SoundManager do contexto. Startup tenta tocar ao aparecer o logon; se o
autoplay for bloqueado, é repetido na interação de entrada. Demais sons exigem
essa interação. O servidor lista
WAV existentes pelos caminhos de `src/lib/sounds-map.ts`, compartilhado com o
player. Os seis eventos usam arquivos originais da raiz (startup MP3, demais WAVs); incluir ou
trocar arquivos exige reiniciar dev/rebuild. Ver `test:sounds` e `ASSETS.md`.
Hover/pressed e brilhos usam fade de 200 ms, exceto ícones do desktop e tiles
de arquivos/pastas, que realçam instantaneamente. Orb cruza frames por opacidade,
com background-position declarado no botão. Movimento reduzido remove apenas animações espaciais, preservando realces de cor/opacidade. Taskbar usa blur
15 px e títulos 10 px. Scrollbars herdam setas do 7.css e thumb azul local.
O tema usa `7.css/dist/7.scoped.css` na camada `win7-base` via `seven.css` e
contêiner `.win7`; não importar sua versão global. Molduras usam classes oficiais
`window glass`, `title-bar` e controles `is-*`. Taskbar/Menu reutilizam o vidro
da biblioteca, com layout local. `useWindowManager` adapta estado/área útil;
`useWindowGesture` trata ponteiro e frames, `window-geometry` contém geometria pura.
`program-catalog` e `useStartSearch` combinam apps locais e pastas públicas da raiz
sem crawling recursivo; destinos de busca são enviados ao Explorer existente.
`window-state.ts` concentra abertura, foco, geometria, minimização e restauração;
`WindowChrome.tsx` trata gestos e teclado. `npm run test:win7` verifica as regras.
O CSS aplica a sprite original do Orb em três posições, sem recortar ou alterar
o PNG. Cursores usam o caminho singular `public/assets/win7/cursor/`.
`useDesktopSelection.ts` trata o retângulo por arraste: somente área vazia,
botão esquerdo/mouse, interseção inclusiva dos ícones, pointer capture e rAF.
Não limpar seleção ao interagir com janelas/controles; Ctrl+clique e teclado
continuam nos atalhos. Cancelamento, saída da rota e resize liberam captura/frame.
Fotografias usa Explorer/PhotoViewer e `/api/photos`, com dados reais do Drive.
Jogos ainda estão em preparação; não apresentar Solitaire ou Purble Place como
jogáveis até essa etapa ser implementada. Não fabricar acervo.

`apps/ControlPanel.tsx` oferece ícones grandes e dois ajustes reais: wallpapers
do `DesktopSettings.tsx` (chave própria `capimaso-win7-wallpaper`, sem afetar o XP
ou o logon) e mute global do SoundManager. `useSystemMuted` assina o estado;
silenciar pausa áudios ativos e bloqueia novos eventos até reativar.
`VolumeControl.tsx` controla o mesmo manager na bandeja: volume inicial 80%,
slider vertical 0–100%, Ding após 150 ms sem mudanças, mute e Escape.
`useWindowMotion.ts` anima transform/opacity por WAAPI durante 300 ms, adia
hidden e mantém janelas inert ao minimizar. `minimizeTarget` guarda o destino
taskbar/Mostrar Desktop para a restauração; maximizar usa FLIP. Cancelar e
reverter a partir do frame atual; movimento reduzido ignora animações.
Menu Iniciar troca o avatar pelo ícone original após 500 ms de hover/foco,
com crossfade de 200 ms. Cancelar ao sair/trocar item, mudar busca/lista, fechar
ou desmontar; manter a última imagem montada durante o fade de retorno.
Contato Win7 usa `data/win7-socials.ts`, com Instagram de fotografia separado.

O backend está em `src/server/drive/`, marcado server-only. Credenciais apenas
em ambiente, nunca no código ou logs. `DRIVE_FOLDER_ID` aceita ID ou link de pasta.
Client paths são dicas, verificadas por listagens pai/filho; não confie em
`files.get.parents`, pois pode faltar em arquivos públicos. O proxy permite
somente imagens raster dentro da raiz e hosts Google para bytes/miniaturas.
Use `npm run test:photos` para erros, limites de escopo, proxy e paginação.

## Como pedir mudanças ao Codex

Exemplo: "Leia AGENTS.md e README.md. Quero adicionar 2 Shorts com links do Google Drive sem mexer no design nem apagar imagens. Mantenha o padrão Windows XP; edite data/showcase.json e copie apenas os posters para public/images/. Rode os testes."

Exemplo: "Leia AGENTS.md. Ajuste apenas a aparência da janela Meus trabalhos para se parecer mais com o Explorador do Windows XP. Preserve o player do Google Drive e não altere dados do usuário."

Exemplo: "Leia AGENTS.md. Preciso de uma nova aba no Meu computador. Faça mudança mínima em XPApps.tsx e no menu do desktop, mantendo os controles acessíveis."

## Guia de decisões

- **Cores e tema:** `src/os/xp/xp.css`, preferir alterar regra original da seção em vez de adicionar override no final.
- **Navegação/janelas:** `src/os/xp/XpDesktop.tsx`, objeto `labels` e `shortcuts`.
- **Meu portfólio e apps:** `src/os/xp/XPApps.tsx`, switch final e apps específicos.
- **Adicionar trabalho:** `data/showcase.json` (observar `format` + `video` + `thumbnail`).
- **Foto, capa, vídeo:** capas em `public/images`, vídeos no Google Drive; não incluir MP4/WebM no projeto.
- **Player:** curtos usam links de arquivo do Google Drive convertidos para `/preview` por `lib/google-drive.mjs`; longos usam `youtube-nocookie`. Links Instagram legados continuam externos.
- **Upload:** `/studio` funciona somente em dev; não oferecer botão de admin no portfólio público.
- **Preços e depoimentos:** verdadeiros e configuráveis em `data/services.ts` e `data/comments.ts`.

## Cuidados de implantação

O `tsconfig.json` verifica as entradas em `app/`, `next.config.ts`, os tipos gerados pelo Next e todos os módulos importados por essas entradas, inclusive componentes e dados fora de `app/`. A checagem estrita permanece ativa. Os componentes antigos (`Desktop.tsx`, `WindowContents.tsx` e auxiliares) e `lib/i18n.ts` estão preservados, mas não fazem parte da aplicação atual. Não voltar a incluir indiscriminadamente todos os arquivos legados no build. O dicionário atual é `lib/locale-dictionary.ts`; cada chave deve aparecer uma única vez.

O `npm run dev`/`npm run build` executa a sincronização de imagens originais quando faltam. Vídeos não são recuperados para evitar reintroduzir binários removidos. O ZIP novo **não contém** os binários recuperáveis do GitHub original; não apagar a pasta `public` ao atualizar o repositório existente. Se GitHub não responder, pode-se reexecutar `npm run assets:sync`. Uma cópia limpa depende do repo original permanecer público enquanto não tiver sido sincronizado.

## Checklist de regressão

1. Perfil, Scarface, MegLuuh, Tranzit, ThumbBizu, MegLuuh recado, contatos, preços.
2. Abrir janela via ícone ou iniciar; focar, arrastar, minimizar, restaurar, maximizar, fechar.
3. Abrir curto do Google Drive; poster e player verticais corretos; testar reprodução e fullscreen no player do Drive.
4. Clicar em vídeo longo do YouTube. O embed não deve ser trocado por vídeo local.
5. Verificar layout em 360px, 768px, 1440px, com overflow contido.
6. Adicionar link Drive e capa em dev; confirmar apenas imagem e manifesto gravados; confirmar rejeição em produção.

## Ajustes 2.1: idioma, papel de parede, player, cursor

- **Idioma:** `lib/locale-dictionary.ts` contém o dicionário, `src/shared/LanguageContext.tsx` fornece `useT`. O default é inglês na primeira visita; a preferência `capimaso-xp-language` em `localStorage` sincroniza desktop e Estúdio. Preservar ambas as opções EN e PT.
- **Wallpaper:** `lib/wallpaper.ts` define `DEFAULT_WALLPAPER`, gerencia IndexedDB e calcula URLs. `src/os/xp/WallpaperSettings.tsx` mostra as opções. Para publicar Bliss, adicionar um arquivo autorizado em `public/images/xp-bliss.jpg` e atualizar o default no arquivo de configuração. Nunca codificar a imagem carregada pelo usuário diretamente no código.
- **Vídeos:** `src/os/xp/XPApps.tsx` contém `Player`, com autoplay mudo no YouTube e reprodução manual no Google Drive. Os tamanhos são feitos por CSS container query units em `src/os/xp/xp.css` (`.player-screen`). Testar Google Drive portrait e YouTube landscape.
- **Cursores:** manter os originais `public/icons/cursor.svg`, `cursor-pointer.svg`, `cursor-text.svg` e `cursor-drag.svg`, recuperáveis pelo script de sincronização e usados em `src/os/xp/xp.css`.
- **Menu Iniciar:** ícones `logoff` e `power` criados em `src/os/xp/XPIcon.tsx`, renderizados em `src/os/xp/XpDesktop.tsx` (função `StartMenu`).
- **Não apagar dados do usuário:** confira `data/showcase.json` antes de aplicar ZIPs futuros; ele é alterado em tempo de desenvolvimento pelo Estúdio.
