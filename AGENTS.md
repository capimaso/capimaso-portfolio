# Instructions for Codex — CAPIMASO Windows 7

Read this file FIRST when editing this repository, even without prior chat context.

## Mission
- This is Tiago's **Windows 7 Aero desktop** portfolio for photography, video editing and thumbnails, **not** a generic landing page.
- Owner/display identity: Tiago / CAPIMASO. Do not replace with generic fabricated copy.
- Main language: Portuguese (Brazil).
- Preserve all existing user images, thumbnails, avatars, guestbook comments, project links and prices. Local videos were explicitly removed by the owner in favor of Google Drive. Never silently delete other binary assets.
- Keep the Win7 look: scoped 7.css, Segoe UI/Tahoma, Aero titlebars/taskbar, original Orb, Explorer, Photo Viewer and WMP12 metaphors. XP/boot sources are inactive legacy; do not reintroduce them into public routes.
- No Tailwind resets, generic glassmorphism, neon gradients, bento cards, emoji clutter or unnecessary animation frameworks.
- Desktop controls must actually work; mobile layout stays usable and keyboard buttons retain semantics.

## Before changes
1. Read `README.md`, `MUDANCAS.md`, `docs/CODEX-GUIDE.md`.
2. Run `npm install` and `npm run dev` if possible; don't assume missing original assets are safe to delete.
3. Data edits normally belong in `data/*`, not component JSX.
4. Keep media dimensions: short poster portrait, long poster landscape.
5. Video short = Google Drive file link with embedded `/preview` player; long = YouTube URL; intro = `data/media.ts`. Do not add local video binaries.

## Architecture
- `/` opens the Win7 public logon and desktop in `src/os/win7/`, isolated with CSS Modules.
- `/xp` and `/win7` are permanent server redirects to `/` in `next.config.ts`.
- Public origin uses server-side `SITE_URL` before build. `data/site.ts` and
  `lib/site-metadata.ts` define home sharing metadata; canonical/social image
  URLs and sitemap entries are omitted until the actual origin is configured.
  Never invent a domain or infer one from request headers. `app/robots.ts`
  excludes Studio/APIs; `app/sitemap.ts` includes only the canonical root.
  See `test:metadata`; changing the public origin requires rebuilding.
- BIOS, OS selection and the XP desktop have no active routes/imports. Preserve legacy source/assets unless explicitly asked to remove them; they are not the current implementation.
- Photography uses `src/server/drive/` and `/api/photos`; Explorer and PhotoViewer
  live in `src/os/win7/apps/`. Games are cancelled; do not reintroduce them.
- Win7 now includes Videos (short/long) and Thumbnails via `MediaExplorer.tsx`.
  `MediaCatalog.tsx` receives the shared showcase and thumbnail list from the
  server page. `MediaViewers.tsx` routes videos to `WmpPlayer.tsx` and keeps a
  separate local thumbnail viewer. WMP12 Now Playing uses the official YouTube
  IFrame API for real transport controls; Drive keeps native `/preview` controls.
  `apps/video-audio.ts` combines the tray master volume/mute with each YouTube
  player's own settings. Preserve individual slider values, muted autoplay,
  master mute priority and cleanup on close/change/failure. Drive/native fallback
  iframes have no external master-volume integration; do not fake that control.
  Never claim that this removes provider branding. See `test:player` and the
  playback verification document before changing media sources.
- The Win7-only migration is implemented. Keep existing links working through
  redirects, and preserve all migrated portfolio data. See `MUDANCAS.md`.
- Win7 `apps/Profile.tsx` reuses profile, skills, services and guestbook data in
  accessible property-sheet tabs. `data/win7-profile.ts` holds Win7-only role,
  equipment and the separate introduction entry. Never invent equipment; hide
  its tab while no real camera/lens has been provided. Contacts include both
  @capimaso (video) and @capimaso.jpg (photography).
- Drive credentials are server-only environment variables. Never print or commit
  `.env.local`. Keep listing/proxy access within the configured public root;
  client paths are hints and must be verified against Drive folder listings.
- Win7 original wallpaper/Orb/cursors live in `public/assets/win7/`; cursor
  directory is singular (`cursor/`). Orb is 106x318, three vertical frames.
- `src/os/win7/Win7Desktop.tsx`: public logon/session and desktop composition.
- `src/os/win7/window-state.ts`: window state; chrome, gestures and motion stay separate.
- `src/os/win7/apps/`: active portfolio and system-like apps.
- `src/os/win7/studio/`: local Win7 upload form, using CSS Modules and useT.
- `data/showcase.json`: list of work. Only edits here for new/updated projects.
  Edit `title` to rename a video; keep stable IDs and provider links. Optional
  covers in `public/images/posters/custom/<id>.(png|jpg|jpeg|webp|avif)` override
  the original poster through server-only `src/server/video-covers.ts`.
  Keep original assets/manifest paths as fallback; see that folder's LEIA-ME.
- `app/studio/page.tsx`: server guard; renders the local form only in development, returns 404 in production. Never expose a public admin shortcut.
- `app/api/studio/upload/route.ts`: DEV-ONLY disk persistence. Do not enable on production without authentication+storage.
- `scripts/sync-original-assets.mjs`: recover original public assets without overwriting.

## On every change
- Keep existing project entries (`scarface`, `megluuh`, `tranzit`) unless explicitly asked otherwise.
- Don't turn legacy Instagram links into fake MP4 files.
- New short videos require a real Google Drive file link and poster; no autoplay with sound. Never invent Drive IDs.
- Thumbnail gallery automatically reads `public/images/thumbs/`.
- New video posters are saved to `public/images/posters/`, separately from the thumbnail gallery. Preserve existing poster paths; never relocate or overwrite older assets automatically.
- Run `npm run check` (works offline), plus `npm run build` and `npm run typecheck` where dependencies are available.
- Document behavioral changes in `MUDANCAS.md`.

## Interface atual
- UI é bilíngue (`en` padrão e `pt`) com dicionário em `lib/locale-dictionary.ts` e contexto em `src/shared/LanguageContext.tsx`. Usar `useT` nos componentes; o servidor pode usar `tr` para conteúdo inicial sem JavaScript.
- Preservar a chave de idioma `capimaso-xp-language` para compatibilidade com preferências existentes; o nome histórico não significa dependência do XP.
- Wallpapers Win7: `src/os/win7/DesktopSettings.tsx`, chave `capimaso-win7-wallpaper`; imagens do navegador não são conteúdo público.
- Player deve preservar proporção 16:9 / 9:16. YouTube mantém autoplay mudo; Google Drive inicia pelo controle do próprio player, sem autoplay forçado.
- Ícones e cursores Win7 são originais de `public/assets/win7/`. Manter CSS scoped e CSS Modules; não importar o reset global do 7.css.
- Reiniciar usa navegação de documento para `/`, voltando ao logon mesmo quando já estiver na raiz.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
