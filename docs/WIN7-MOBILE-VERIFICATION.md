# Win7 — polimento e auditoria mobile

Validação em 22/10/2026, build de produção local, Microsoft Edge via Playwright.
Toque emulado em 375×812 e viewport curto 375×430; interfaces EN e PT. Motion
também conferido em desktop 1440×900 e com preferência por movimento reduzido.

| Verificação | Resultado |
| --- | --- |
| Taskbar em 375×812 | 375×56 px, fixa no rodapé; altura inclui safe area quando presente |
| Janelas em 375×812 | x=0, largura=375, altura=756; preenchem a área acima da taskbar |
| Rolagem horizontal da página | scrollWidth=375, innerWidth=375, scrollX=0 em todos os apps auditados |
| Alvos principais | 44 px ou mais em fechar/minimizar, tarefa, volume, idioma, Mostrar Desktop e fechar Iniciar |
| Iniciar | Área útil inteira, fechar visível, busca no topo, sem foco inicial no input |
| Teclado/layout curto | Drawer cabe em 375×430; lista/coluna direita rolam internamente sem esconder cabeçalho |
| Taskbar com várias janelas | Gesto de toque via CDP rolou a lista de tarefas sem mover a página |
| Volume e idioma | Popup contido no viewport; idioma alternável pelo botão compacto |
| Motion | 250 ms ease-in-out; translate até o botão medido, scale(.1), opacity 0 e percurso inverso |

Apps auditados: Sobre, Contato, Games, Calculadora, Bloco de notas, Painel de
Controle, Explorer e Photo Viewer. Dados de Drive foram simulados só no navegador
de teste, com nome longo e imagem real Harmony; nenhum fixture foi publicado ou
adicionado ao portfólio. A integração com Drive não foi modificada nesta rodada.

Motion conferido nos controles da janela, tarefa ativa e Mostrar Desktop. Cada
janela vai ao próprio botão, inclusive por Mostrar Desktop; restauração seletiva,
geometria, inversão rápida e maximização foram mantidas. `getBoundingClientRect`
mede janela/destino. WAAPI controla frames e interrupções; CSS declara as mesmas
transições de transform/opacity em 0,25 s sem animar left/top/width/height durante
arraste. Movimento reduzido dispensa a animação.

`npm run check`, `npm run typecheck`, `npm run build` e 13 testes do gerenciador
de janelas aprovados. Build mantém o aviso pré-existente de metadataBase.

Limite da auditoria: emulação Chromium/Edge, sem aparelho físico ou teclado
virtual nativo de iOS/Android. O viewport curto verifica o layout reduzido;
não comprova o comportamento de todos os teclados e barras de navegador reais.
