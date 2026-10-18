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
