# CAPIMASO XP: manutenção por tarefa

## Como pedir mudanças ao Codex

Exemplo: "Leia AGENTS.md e README.md. Quero adicionar 2 Shorts sem mexer no design nem apagar imagens. Mantenha o padrão Windows XP; edite data/showcase.json e copie os MP4 e posters para public/. Rode os testes."

Exemplo: "Leia AGENTS.md. Ajuste apenas a aparência da janela Meus trabalhos para se parecer mais com o Explorador do Windows XP. Preserve o player HTML5 e não altere dados do usuário."

Exemplo: "Leia AGENTS.md. Preciso de uma nova aba no Meu computador. Faça mudança mínima em XPApps.tsx e no menu do desktop, mantendo os controles acessíveis."

## Guia de decisões

- **Cores e tema:** `app/xp.css`, preferir alterar regra original da seção em vez de adicionar override no final.
- **Navegação/janelas:** `components/XpDesktop.tsx`, objeto `labels` e `shortcuts`.
- **Meu portfólio e apps:** `components/XPApps.tsx`, switch final e apps específicos.
- **Adicionar trabalho:** `data/showcase.json` (observar `format` + `video` + `thumbnail`).
- **Foto, capa, vídeo:** `public/images`, `public/videos/shorts`; não mover assets existentes sem atualizar referências.
- **Player:** arquivo local renderiza `<video>` e YouTube usa `youtube-nocookie`; links Instagram antigos abrem externo até existir MP4.
- **Upload:** `/studio` funciona somente em dev; não oferecer botão de admin no portfólio público.
- **Preços e depoimentos:** verdadeiros e configuráveis em `data/services.ts` e `data/comments.ts`.

## Cuidados de implantação

O `npm run dev`/`npm run build` executa a sincronização de imagens originais quando faltam. O ZIP novo **não contém** os binários recuperáveis do GitHub original; não apagar a pasta `public` ao atualizar o repositório existente. Se GitHub não responder, pode-se reexecutar `npm run assets:sync`. Uma cópia limpa depende do repo original permanecer público enquanto não tiver sido sincronizado.

## Checklist de regressão

1. Perfil, Scarface, MegLuuh, Tranzit, ThumbBizu, MegLuuh recado, contatos, preços.
2. Abrir janela via ícone ou iniciar; focar, arrastar, minimizar, restaurar, maximizar, fechar.
3. Abrir player com MP4 local; poster vertical correto; fullscreen/volume sob controles do navegador.
4. Clicar em vídeo longo do YouTube. O embed não deve ser trocado por vídeo local.
5. Verificar layout em 360px, 768px, 1440px, com overflow contido.
6. Fazer upload em dev; confirmar arquivo e manifesto; confirmar rejeição em produção.

## Ajustes 2.1: idioma, papel de parede, player, cursor

- **Idioma:** `lib/i18n.ts` contém o dicionário, `components/LanguageContext.tsx` fornece `useT`. O default é inglês na primeira visita; a preferência `capimaso-xp-language` em `localStorage` sincroniza desktop e Estúdio. Preservar ambas as opções EN e PT.
- **Wallpaper:** `lib/wallpaper.ts` define `DEFAULT_WALLPAPER`, gerencia IndexedDB e calcula URLs. `components/WallpaperSettings.tsx` mostra as opções. Para publicar Bliss, adicionar um arquivo autorizado em `public/images/xp-bliss.jpg` e atualizar o default no arquivo de configuração. Nunca codificar a imagem carregada pelo usuário diretamente no código.
- **Vídeos:** `components/XPApps.tsx` contém `Player`, com autoplay mudo. Os tamanhos são feitos por CSS container query units em `app/xp.css` (`.player-screen`). Testar vídeo local portrait e YouTube landscape.
- **Cursores:** manter os originais `public/icons/cursor.svg`, `cursor-pointer.svg`, `cursor-text.svg` e `cursor-drag.svg`, recuperáveis pelo script de sincronização e usados em `app/xp.css`.
- **Menu Iniciar:** ícones `logoff` e `power` criados em `components/XPIcon.tsx`, renderizados em `components/XpDesktop.tsx` (função `StartMenu`).
- **Não apagar dados do usuário:** confira `data/showcase.json` antes de aplicar ZIPs futuros; ele é alterado em tempo de desenvolvimento pelo Estúdio.
