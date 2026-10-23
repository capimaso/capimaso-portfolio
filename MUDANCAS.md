## Painel de Controle Win7

- Nova janela acessível pelo Iniciar e pela busca, em ícones grandes conforme config.png. Personalizar troca entre os dois wallpapers reais, com preferência local exclusiva do Win7; logon e XP preservados.
- Som controla o SoundManager global: mute pausa áudio corrente e bloqueia todos os eventos até reativar. Cinco testes de áudio aprovados, incluindo assinatura de estado e mute/desmute.
- Só são apresentados os dois ajustes funcionais desta rodada. Personalização usa o monitor/pincel original imageres_151.ico, identificado no acervo local; grade mantém a largura das colunas da referência.

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
  futuras de logon/jogos. 7.css 0.21.1 fixado no manifesto e lockfile.
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
  preparação; esta rodada não implementa Drive nem jogos.

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
