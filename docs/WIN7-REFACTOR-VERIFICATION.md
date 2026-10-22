# Refatoração Windows 7 — 22/10/2026

## Resultado e fontes

Implementação incremental, mantendo as APIs e a galeria existentes. Fontes,
arquivos consultados e revisões estão no [PLANS.md](../PLANS.md).

- 7.css 0.21.1 fixado e importado via distribuição scoped na camada win7-base.
  Moldura, título, glifos de controle, estados ativo/inativo e vidro são oficiais
  da biblioteca. Taskbar e menu usam a mesma superfície; 7.css não contém uma
  Taskbar pronta. CSS local cuida da composição e das exceções de layout.
- useWindowManager mantém o reducer React, sem DOM imperativo concorrente;
  useWindowGesture trata pointer capture, frames e cleanup. Geometria está em
  módulo puro, e o z-index é derivado da ordem dos IDs, sem contador crescente.
- Catálogo local bilíngue e pastas da raiz pública pesquisáveis com debounce,
  cache de 60 s e paginação explícita. Resultado de pasta abre o destino real
  no Explorer existente. Não há crawling recursivo ou download de fotos na busca.

## Comparação visual realizada

Capturas locais: docs/references/ (desktop/menu e Explorer originais).
Referências externas efetivamente inspecionadas:

- [Win7 Simu — captura oficial do Explorer](https://visnalize.com/assets/features/fileexplorer.png).
- [explorer7 — captura do menu e taskbar](https://github.com/user-attachments/assets/a428c168-b1ca-49cc-aac0-7959cd892cba),
  publicada no [README do projeto](https://github.com/world-windows-federation/explorer7).

Capturas de execução em 360, 768 e 1440 px e referências baixadas ficaram em
`.git/codex-verification/`, fora do código público. Nenhuma imagem foi gerada
por IA nem incorporada ao acervo do usuário.

Ganhos observados: glifos e relevo dos botões de título consistentes, incluindo
restaurar; contraste entre estados ativo/inativo; bordas internas e reflexos do
vidro unificados entre Explorer, visualizador e shell; blur de 4 px da biblioteca
substitui os filtros manuais do shell. Orb preserva os três frames nativos
e escala exata a 50%. Fade/scale do menu mantém entrada/saída e movimento reduzido.

## Validação

- `npm run check`, `npm run typecheck`, `npm run build` passaram.
- `npm run test:win7`: 12 testes; `npm run test:photos`: 10 testes.
- Navegador Edge/Playwright em desenvolvimento e build de produção: seleção,
  sprite normal/hover/pressed, busca, oito bordas de resize, drag, teclado,
  minimizar/restaurar, maximizar/restaurar com geometria exata, taskbar e mostrar
  desktop; layouts mobile/retrato/paisagem e preferência por movimento reduzido.
  Produção também verificou flush de pointerup antes do próximo frame, destaque
  de tarefa com foco, texto do Bloco de notas preservado ao minimizar e devolução
  do foco à próxima janela ao fechar.
- Busca com Drive indisponível preserva programas locais; sem busca não faz
  consultas. Paginação e nomes com acentos testados; pasta encontrada abre
  endereço correto e reutiliza a janela, incluindo quando minimizada.
- Drive real: pastas/subpastas, breadcrumbs, miniaturas, original decodificado,
  proporção, anterior/próximo, zoom e download com bytes idênticos por SHA-256.
  Erros/retry, paginação e controles mobile também exercitados com respostas
  simuladas, inclusive falha temporária do original e recuperação manual.
- XP: métricas de geometria/estilos em 360/768/1440 comparadas ao baseline,
  normalizando somente a porta do servidor de teste. Dados/assets existentes
  mantêm seus hashes. Estúdio mantém estilo e links para XP. Navegação entre
  sistemas confirma isolamento do CSS.
- Chave real: zero ocorrências nos arquivos versionados e em `.next/static`;
  `.env.local` não está versionado. Nenhuma alteração na integração server-only.

O build emite o aviso preexistente de metadataBase ausente; não impede a geração.

## Limites preservados

Não alegar reprodução pixel a pixel: Explorer mantém suas ferramentas de
portfólio e dados reais; a busca cobre a raiz pública paginada, sem indexar toda
a árvore. Ícone original da Calculadora e recursos de logon/jogos continuam
registrados em ASSETS_NEEDED.md. AuthUX permanece referência de logon futuro;
Games e Control Panel não foram implementados nesta rodada.
