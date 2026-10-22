# Windows 7 shell — validação de 22/10/2026

## Escopo entregue

Desktop Harmony com seleção simples/múltipla, taskbar Aero de 40px, relógio,
menu Iniciar em duas colunas com busca EN/PT, troca para XP e Reiniciar.
Gerenciador com uma janela por aplicativo, foco, arraste, oito bordas de resize,
minimizar, maximizar/restaurar, fechar e Mostrar área de trabalho.
Sobre e Contato usam os dados reais; Fotografias e Games estão em preparação.
Integração Drive e jogos funcionais não fazem parte desta rodada.

## Verificações executadas

- `npm run check`: conteúdo XP e presença de todos os assets mapeados no Win7;
  dimensões originais do Orb confirmadas.
- `npm run typecheck` e `npm run build`: passaram, sem depender do Drive.
- `npm run test:win7`: seis testes de abertura única/foco, taskbar, geometria,
  maximização, restaurar somente janelas visíveis e não ressuscitar janelas fechadas.
- Edge headless / Playwright, tanto em desenvolvimento quanto em produção:
  seleção e Ctrl+clique, Orb normal/hover/pressed, busca sem resultados e Enter,
  arraste, oito direções de resize, teclado na barra de título, minimizar e
  alternar pela taskbar, fechar, Mostrar desktop, idioma, XP e Reiniciar.
- Layouts com toque em 360x800, 768x900 e 800x360. Mobile estreito maximiza na
  área acima da taskbar; retornar à largura desktop restaura o retângulo anterior.
- Navegação Win7 → XP → boot sem vazamento de fonte ou cursor.
- Sem erros JavaScript ou respostas de erro nos assets Win7 durante os testes.
- Comparação com a referência anterior: fontes, bordas, cores e geometria do XP
  em 360/768/1440px idênticas; hashes anteriores de data/ e public/ inalterados.
  Estúdio mantém seus estilos e retorno a /xp.

Capturas e scripts de verificação do navegador estão localmente em
`.git/codex-verification/`, fora dos commits. Os testes de estado reproduzíveis
ficam em `scripts/test-win7-state.mjs`, sem framework adicional.

## Referências e recursos

Comparação com as capturas em `docs/references/`, especialmente a imagem
`vlcsnap-2026-10-22-12h48m53s066.png` para menu/taskbar e
`vlcsnap-2026-10-22-12h48m57s539.png` para molduras Aero. Wallpapers, Orb,
cursores e ícones são os arquivos fornecidos pelo proprietário, sem geração
de imagem ou conversão. Molduras e controles geométricos são CSS.

SHA-256 dos dois recursos principais recebidos:

| Recurso | SHA-256 |
| --- | --- |
| `public/assets/win7/wallpapers/harmony.jpg` | `6ea9f8468c76aa511a5b3cfc36fb212b86e7abd377f147042d2f25572bf206a2` |
| `public/assets/win7/theme/start-orb.png` | `9c501eb153c07da7298e09c048884d1284c81f1cdf3f52f53a82b52cc5e44168` |

O Orb tem três quadros verticais de 106px. CSS usa tamanho 54x162 e Y=0/-54/-108.
Cursores animados ANI e o pacote CRS não são usados: o shell usa CUR suportados
pelo navegador. Não há cursor de texto recebido; usa default. Rede e Central de
Ações no tray são ícones decorativos, sem acesso ao sistema do visitante.
