# CAPIMASO XP: manutenção por tarefa

## Como pedir mudanças ao Codex

Exemplo: "Leia AGENTS.md e README.md. Quero adicionar 2 Shorts com links do Google Drive sem mexer no design nem apagar imagens. Mantenha o padrão Windows XP; edite data/showcase.json e copie apenas os posters para public/images/. Rode os testes."

Exemplo: "Leia AGENTS.md. Ajuste apenas a aparência da janela Meus trabalhos para se parecer mais com o Explorador do Windows XP. Preserve o player do Google Drive e não altere dados do usuário."

Exemplo: "Leia AGENTS.md. Preciso de uma nova aba no Meu computador. Faça mudança mínima em XPApps.tsx e no menu do desktop, mantendo os controles acessíveis."

## Guia de decisões

- **Cores e tema:** `app/xp.css`, preferir alterar regra original da seção em vez de adicionar override no final.
- **Navegação/janelas:** `components/XpDesktop.tsx`, objeto `labels` e `shortcuts`.
- **Meu portfólio e apps:** `components/XPApps.tsx`, switch final e apps específicos.
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

- **Idioma:** `lib/i18n.ts` contém o dicionário, `components/LanguageContext.tsx` fornece `useT`. O default é inglês na primeira visita; a preferência `capimaso-xp-language` em `localStorage` sincroniza desktop e Estúdio. Preservar ambas as opções EN e PT.
- **Wallpaper:** `lib/wallpaper.ts` define `DEFAULT_WALLPAPER`, gerencia IndexedDB e calcula URLs. `components/WallpaperSettings.tsx` mostra as opções. Para publicar Bliss, adicionar um arquivo autorizado em `public/images/xp-bliss.jpg` e atualizar o default no arquivo de configuração. Nunca codificar a imagem carregada pelo usuário diretamente no código.
- **Vídeos:** `components/XPApps.tsx` contém `Player`, com autoplay mudo no YouTube e reprodução manual no Google Drive. Os tamanhos são feitos por CSS container query units em `app/xp.css` (`.player-screen`). Testar Google Drive portrait e YouTube landscape.
- **Cursores:** manter os originais `public/icons/cursor.svg`, `cursor-pointer.svg`, `cursor-text.svg` e `cursor-drag.svg`, recuperáveis pelo script de sincronização e usados em `app/xp.css`.
- **Menu Iniciar:** ícones `logoff` e `power` criados em `components/XPIcon.tsx`, renderizados em `components/XpDesktop.tsx` (função `StartMenu`).
- **Não apagar dados do usuário:** confira `data/showcase.json` antes de aplicar ZIPs futuros; ele é alterado em tempo de desenvolvimento pelo Estúdio.
