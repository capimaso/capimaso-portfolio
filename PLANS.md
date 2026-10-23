# CAPIMASO Dual Boot — arquitetura baseada em referências verificadas

## 1. Objetivo e estado

Rodada concluída: base scoped 7.css, hook central de janelas, gestos separados
e busca integrada a apps/pastas implementados. Validação em
[docs/WIN7-REFACTOR-VERIFICATION.md](docs/WIN7-REFACTOR-VERIFICATION.md).

Auditoria posterior: logon público, hover suave de 200 ms, refinamentos Aero/Explorer
e SoundManager implementados. A configuração visual consolidada pelo proprietário
usa blur de 15 px na taskbar e 10 px nos títulos; substitui os valores anteriores.

Preservar Tiago / CAPIMASO, o XP e todo o conteúdo existente. Consolidar o Windows 7
com 7.css e separação entre estado, gestos, apresentação e aplicativos. Stack:
Next.js App Router, React e TypeScript. Sem Vue, styled-components, Tailwind ou
outro motor de DOM. Zero imagens geradas por IA.

| Rota | Responsabilidade | Estado |
| --- | --- | --- |
| / | BIOS pulável + Boot Manager com teclado/mouse/toque e links reais | Implementado |
| /xp | Portfólio Luna de vídeos | Preservar integralmente |
| /win7 | Desktop Aero e fotografias públicas do Drive | Refatoração incremental |
| /studio | Estúdio XP, upload somente em desenvolvimento | Preservar |
| /api/photos | Listagem normalizada e paginada | Preservar contrato |
| /api/photos/[id]/image | Proxy de miniaturas, originais e downloads | Preservar segurança |

## 2. Fontes estudadas em 22/10/2026

| Fonte | Inspeção | Decisão |
| --- | --- | --- |
| [7.css](https://github.com/khang-nd/7.css), versão fixada 0.21.1 | README, documentação, dist/7.scoped.css | Base obrigatória de botões, controles, molduras, títulos e Aero; classes e variáveis oficiais |
| [7-Aero-Stylesheet](https://github.com/Z2r-YT/7-Aero-Stylesheet), 26dde84 | aero.css, stylesheet.css, TaskbarGradient.js | Referência complementar de vidro e reflexos; não importar resets/fontes remotas/CSS inteiro |
| [win7-ui-clone](https://github.com/Viiict0r/win7-ui-clone), 5074658 | TaskBar, StartButton, StartIcon e styles | Separar Orb, tarefas e composição; o código é um protótipo de taskbar, não um gerenciador completo |
| [DeskPane](https://github.com/0obriano0/DeskPane), c0118bd | core/WindowManager.ts, DragResizeHandler.ts, adapters/react/useWindowManager.ts | Hook central com ações estáveis, estado independente do chrome, restauração, z-index limitado, gestos por frame e cleanup |
| [nainemom/win7](https://github.com/nainemom/win7), 28fad3a | system/services/wm.js e components/Window.vue | Catálogo separado do shell, foco central e apps preservados ao minimizar; adaptar a reducer React, sem Vue |
| [AuthUX](https://github.com/world-windows-federation/AuthUX), 9e15ddd | README e estrutura nativa consolelogon/DirectUI | Referência visual de logon futuro, não uma biblioteca web nem autenticação para o site |
| [Win7 Simu — Explorer](https://visnalize.com/win7simu/simulated/fileexplorer) | Página/captura oficial | Comparar breadcrumbs, sidebar, miniaturas e barras |
| [explorer7](https://github.com/world-windows-federation/explorer7) | README e capturas de Start, programas e taskbar | Comparar proporções, reflexos e bandeja; projeto nativo, não dependência React |

Capturas reais em docs/references/ continuam sendo referência de medidas.
7.css é MIT; manter avisos da dependência. Os demais projetos são fontes de
arquitetura/visual, sem copiar módulos. Registrar origem/licença caso recursos
ou código venham a ser incorporados. Não executar instaladores nativos das fontes.

## 3. Organização e isolamento

- app/: entradas App Router e APIs existentes.
- src/boot/: BootScreen, BiosScreen, BootManager e CSS Modules.
- src/os/xp/: componentes ativos preservados; xp.css limitado a .xp-shell,
  também no Estúdio. Manter storage, IndexedDB, wallpapers e dados de vídeos.
- src/os/win7/Win7Desktop.tsx: composição, atalhos e preferência de idioma.
- StartOrb.tsx, StartMenu.tsx, Taskbar.tsx: responsabilidades separadas do shell.
- WindowManager.tsx: composição React; WindowChrome.tsx: markup oficial 7.css.
- useWindowManager.ts: ações, estado e área útil; window-state.ts: reducer puro.
- useWindowGesture.ts: pointer capture e requestAnimationFrame;
  window-geometry.ts: movimento/resize sem dependência de DOM.
- program-catalog.ts: catálogo local, aliases e filtro EN/PT.
- seven.css: import oficial scoped em camada; win7.module.css: layout/adaptações.
- apps/: Explorer, PhotoViewer e acessórios existentes; apps/games/: futuro.
- Logon.tsx e logon.module.css: boas-vindas públicas antes do desktop.
- src/shared/LanguageContext.tsx e lib/locale-dictionary.ts: useT, inglês inicial,
  português e preferência compartilhada preservados.
- src/lib/photos.ts: contratos compartilhados sem credenciais.
- src/server/drive/: integração server-only; app/api/photos/: endpoints.
- public/assets/win7/: icons/, wallpapers/, theme/, cursor/, sounds/, games/.
- docs/references/: capturas reais; public/images/, public/icons/ e data/*
  preservados. Cursores ficam em cursor/ (singular).

Importar 7.css/dist/7.scoped.css via seven.css na camada win7-base, apenas pela
entrada Win7; aplicar .win7 no shell. CSS Modules controla layout e exceções
locais, sem redesenhar os controles da biblioteca. Não carregar a versão global.
Validar navegação client-side entre sistemas sem depender da remoção do CSS.

Janelas usam window glass, active, title-bar, title-bar-text, title-bar-controls,
is-minimize, is-maximize/is-restore, is-close e window-body. Classes explícitas
dos botões mantêm ícones em EN/PT. Ajustar somente o posicionamento de dialogs:
o :target padrão da biblioteca não corresponde ao estado das janelas React.

7.css não oferece Taskbar pronta: Taskbar e StartMenu reutilizam sua superfície
window glass e variáveis --w7-*, com layout específico do shell. Usar vidro da
base (blur de 4 px) sem empilhar filtros ou aplicar opacidade ao conteúdo.
Remover molduras, gradientes e glifos manuais equivalentes aos da dependência.

Orb original 106×318: três frames nativos 106×106, posições Y 0/-106/-212,
redução uniforme exata a 50%. Sem cover, stretch ou processamento do PNG.
Menu mantém DOM e inert/aria-hidden/visibility quando fechado. Hover/pressed
e brilhos usam fade de 200 ms, respeitando movimento reduzido. Orb cruza frames
fixos por opacidade sem interpolar posições da sprite.

## 4. Gerenciador de janelas

Adaptar conceitos DeskPane ao reducer atual; React permanece dono do DOM.
Não incorporar outro engine imperativo concorrente. Hook useWindowManager com
ações explícitas de abrir, focar, minimizar, maximizar/restaurar, fechar,
alternar tarefa, mostrar desktop e ajustar área útil.

- Um ID mantém uma janela. Reabrir restaura/foca; novos destinos do Explorer ou
  fotos do visualizador atualizam props sem destruir a geometria.
- A ordem das janelas é a única fonte do z-index, derivado e limitado; shell
  acima das janelas. Foco nunca seleciona janela minimizada.
- Minimizar preserva componentes montados; fechar desmonta/cancela recursos.
  Maximizar preserva o retângulo normal para restaurar exatamente.
- Pointer capture; ignorar botões secundários/ponteiros extras; atualização
  no máximo uma vez por frame e flush da última posição em pointerup.
  Limpar captura/frames em cancel, perda de captura, minimizar, maximizar e fechar.
- Geometria pura cobre oito bordas, mínimos e limites da área útil.
  Manter movimento por setas e resize por Shift+setas.
- Foco de inputs deve ser preservado; fechar/minimizar ativa a próxima janela
  visível ou devolve foco ao shell. Mostrar desktop restaura só as que minimizou.
- Abaixo de 720 px: tela cheia acima da taskbar, sem drag/resize; preservar
  retângulo desktop. Usar 100dvh, safe areas, controles acessíveis e rolagem interna.

## 5. Drive, Explorer, Photo Viewer e busca

Preservar API v3 via fetch server-only. DRIVE_FOLDER_ID aceita ID/link público;
GOOGLE_DRIVE_API_KEY e DRIVE_FOLDER_RESOURCE_KEY opcional ficam só no servidor.
Sem NEXT_PUBLIC, OAuth ou login para o acervo público. Nunca imprimir/versionar
.env.local. XP, boot e build não dependem das credenciais.

Listar filhos por parents/trashed=false, pastas e raster compatível, paginando
com nextPageToken e retornando pasta/breadcrumbs/itens/dimensões. Cache por 60 s
e refresh explícito; não criar catálogo data/photos.json.
path é apenas dica: verificar cada vínculo pai/filho por listagem, inclusive
quando files.get omite parents. Proxy valida árvore, MIME e hosts Google;
não aceita URLs arbitrárias nem expõe chave. download=1 preserva attachment,
nome e bytes originais. PhotoViewer mantém Blob validado, reutiliza bytes para
download, cancela requests antigas e revoga URLs, sem pré-baixar o acervo.

Explorer conserva histórico, breadcrumbs, sidebar, seleção, skeletons,
paginação e miniaturas; adaptar chrome/controles. Viewer mantém fundo escuro,
anterior/próximo, zoom e download. Tratar rede/quota/permissão com retry manual.

Busca combina apps locais (Calculadora, Bloco de notas, Fotografias, Sobre,
Contato, Games e Lixeira) e pastas REAIS da raiz pública. Normalizar acentos e
aliases EN/PT. Buscar Drive com debounce/cancelamento apenas quando há texto;
paginação explícita, sem crawling recursivo a cada tecla. Apps locais continuam
disponíveis se o Drive falhar. Resultado de pasta envia destino real ao Explorer
existente, incluindo ancestrais para validação; teclado e mouse funcionam igual.

## 6. Assets e futuro

Preservar Harmony, Orb e cursores recebidos, sem editar binários para acertar CSS.
Ausentes em ASSETS_NEEDED.md, incluindo ícone da Calculadora, logon e jogos.
Buscar primeiro no acervo local, depois [Win7 Icons](https://win7icons.visnalize.com/)
e [nandomp4](https://www.nandomp4.com/). Não inventar recursos ou personagens.

Logon implementado: avatar real, CAPIMASO, Harmony e entrada por Enter/seta;
campo de senha somente visual, nunca lido/enviado/armazenado, sem autenticação.
Após entrar, uma cobertura preta fixa com cursor wait aparece por 700 ms antes
de montar o desktop. O timer é cancelado ao sair da rota. Logon usa harmony.jpg;
desktop usa desktop-logo.jpg fornecido pelo proprietário, sem sobrescrever assets.
Control Panel permanece futuro. Games permanece identificado como pendente.

Solitaire futuro: Klondike 52 cartas, sete colunas, uma carta por compra,
alternância de cores/fundações, reciclar, revelar, desfazer, reiniciar e vitória;
mouse/toque/teclado, seleção/destino alternativo ao arraste, confirmação ao
reiniciar. Minimizar preserva estado. Purble Place: menu das três modalidades;
Purble Pairs 4×4 com oito pares apenas com assets suficientes, comparação,
bloqueio durante animação, tentativas, reinício e vitória. Sem arte, registrar
limitação e manter indisponível. Sons opcionais após ativação explícita.

## 7. Execução e aceite

1. Atualizar plano e registrar fontes/limites verificados. Commit de arquitetura.
2. Integrar 7.css scoped e migrar markup, remover chrome manual; Orb separado,
   Taskbar/StartMenu no vidro da base. Commit de tema.
3. Hook central e gestos separados; validar foco, empilhamento, minimizar,
   maximizar/restaurar, oito bordas e mobile. Commit de gerenciamento.
4. Catálogo local + busca paginada de pastas reais, destinos no Explorer,
   funcionamento local offline e erros traduzidos. Commit de busca.
5. Comparar desktop/Explorer/Taskbar com Win7 Simu, explorer7 e referências locais
   em 360/768/1440 px. Navegar XP/Win7/Estúdio e conferir isolamento.
6. npm run check, npm run typecheck, npm run build, testes de fotos/janelas e
   navegador. Conferir hashes de dados/assets e ausência de chave no frontend;
   documentar ganhos observados e limitações. Não fazer deploy automaticamente.
7. Jogos e Control Panel somente em rodadas posteriores. Logon e infraestrutura
   de sons foram concluídos na auditoria posterior; WAV reais continuam pendentes.
