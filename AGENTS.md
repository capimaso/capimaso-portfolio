# Instructions for Codex — CAPIMASO XP Edition

Read this file FIRST when editing this repository, even without prior chat context.

## Mission
- This is a video editor's **authentic Windows XP Luna desktop** portfolio, **not** a generic landing page.
- Owner/display identity: Tiago / CAPIMASO. Do not replace with generic fabricated copy.
- Main language: Portuguese (Brazil).
- Preserve all existing user images, thumbnails, avatars, guestbook comments, project links and prices. Local videos were explicitly removed by the owner in favor of Google Drive. Never silently delete other binary assets.
- Keep the core look XP-correct: Tahoma typography, WinXP blue taskbar/titlebars, green Start button, cream `#ece9d8` controls, classic explorer sidebar, Outlook Express, Notepad and Media Player metaphors.
- No Tailwind resets, generic glassmorphism, neon gradients, bento cards, emoji clutter or unnecessary animation frameworks.
- Desktop controls must actually work; mobile layout stays usable and keyboard buttons retain semantics.

## Before changes
1. Read `README.md`, `MUDANCAS.md`, `docs/CODEX-GUIDE.md`.
2. Run `npm install` and `npm run dev` if possible; don't assume missing original assets are safe to delete.
3. Data edits normally belong in `data/*`, not component JSX.
4. Keep media dimensions: short poster portrait, long poster landscape.
5. Video short = Google Drive file link with embedded `/preview` player; long = YouTube URL; intro = `data/media.ts`. Do not add local video binaries.

## Architecture
- `/` is BIOS + Boot Manager (`src/boot/`); `/xp` is the existing video desktop.
- `/win7` is a temporary notice until the next stage in `PLANS.md`.
- Scope every XP CSS selector to `.xp-shell`; both XP and Studio use that shell.
- `src/os/xp/XpDesktop.tsx`: desktop, window manager, start menu, taskbar.
- `src/os/xp/XPApps.tsx`: app-like window contents, portfolio showcase.
- `src/os/xp/XPIcon.tsx`: local vector icons.
- `src/os/xp/XPImage.tsx`: serves local image first, then original GitHub if not synchronized.
- `src/os/xp/xp.css`: all styling; extend by sections rather than piling on overrides.
- `data/showcase.json`: list of work. Only edits here for new/updated projects.
- `app/studio/page.tsx`: local form for a Google Drive video link and thumbnail upload.
- `app/api/studio/upload/route.ts`: DEV-ONLY disk persistence. Do not enable on production without authentication+storage.
- `scripts/sync-original-assets.mjs`: recover original public assets without overwriting.

## On every change
- Keep existing project entries (`scarface`, `megluuh`, `tranzit`) unless explicitly asked otherwise.
- Don't turn legacy Instagram links into fake MP4 files.
- New short videos require a real Google Drive file link and poster; no autoplay with sound. Never invent Drive IDs.
- Thumbnail gallery automatically reads `public/images/thumbs/`.
- Run `npm run check` (works offline), plus `npm run build` and `npm run typecheck` where dependencies are available.
- Document behavioral changes in `MUDANCAS.md`.

## Edição 2.1
- UI é bilíngue (`en` padrão e `pt`) com dicionário em `lib/i18n.ts`. Não criar texto apenas em português fora do Estúdio; usar `useT` para rótulos públicos.
- Wallpapers: `src/os/xp/WallpaperSettings.tsx` e `lib/wallpaper.ts`; imagens do navegador não são conteúdo público.
- Player deve preservar proporção 16:9 / 9:16. YouTube mantém autoplay mudo; Google Drive inicia pelo controle do próprio player, sem autoplay forçado.
- Ícones do Start são SVG, cursores seguem de `public/icons/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
