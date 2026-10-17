# Análise do repositório original — CAPIMASO

Repositório analisado: `capimaso/capimaso-portfolio`, branch `main`, commit `8959ea5a72142ac25a9a443394501c5053424e2e` (07/10/2026).

## O que estava bem estruturado

- Next.js 16, React 19, TypeScript e conteúdo separado em `data/`.
- Gerenciador de janelas com arrastar, minimizar, maximizar, foco e taskbar.
- Projetos reais, links de vídeo, thumbnails, recados, preços e contatos em arquivos editáveis.
- Galeria de imagens em `public/images/thumbs/` lida no servidor.
- Possibilidade de alternar idioma na interface anterior.

## Onde o visual fugia do Windows XP

1. **Cor-base:** o original usava variáveis como `--xp-blue: #0c6aa6`, `--xp-blue-deep: #08385e` e fundo geral petróleo. Isso remete a interfaces Y2K/tech, não ao **Luna Blue** com azuis saturados do XP.
2. **Caminhos de estilo:** `styles/globals.css` tinha **32.854 bytes** e `styles/portfolio-upgrades.css` tinha **9.413 bytes**, totalizando **42.267 bytes** de CSS, com modificações sobrepostas (ex.: cards de shorts, botão de reel e iframe). Difícil saber qual regra manda.
3. **Animações:** desktop com animação de entrada, `Framer Motion` nas janelas e overlay CRT. Esses efeitos não eram característicos do desktop XP comum.
4. **Janelas:** bordas, sombras e fundos próximos de um dashboard moderno. O XP combina título azul vivo com chanfros, painel creme e área branca de conteúdo.
5. **Introdução:** slogans como `SYSTEM ONLINE`, `READY`, workstation e `WATCH MY REEL` davam ar de template, apesar do material pessoal real disponível em `data/profile.ts`.
6. **Apps:** a ideia de Bloco de Notas, Explorador e Outlook era interessante, mas misturava visual único da marca com referências do Windows. A reconstrução adota padrões de cada aplicativo.
7. **Mídia:** `PlayerContent` fazia iframe Instagram e YouTube. Para Shorts era impossível oferecer controles nativos ou poster estável quando o Instagram alterava o embed; o CSS tentava contornar dimensões do iframe.
8. **Minimização e barra:** clicar na taskbar sempre colocava janela na frente; na versão nova, clicar na janela ativa minimiza e outro clique restaura.

## Decisões preservadas

- Projetos `scarface`, `megluuh` e `tranzit`, assim como títulos, descrições, links e thumbnail conhecida.
- Recado da MegLuuh, com foto e link.
- Contatos, ferramentas (Premiere, After Effects, Photoshop) e valores de serviços e pacotes.
- Ideia central do desktop e a galeria automática de thumbnails.
- Nome e marca CAPIMASO, sem gerar portfólio fictício.
- Arquivos originais recuperáveis por script, sem substituir imagens de autoria do proprietário.

## Trade-offs e pendências reais

- A alternância **PT/EN** presente na versão original não foi portada para todas as telas na primeira reconstrução; o novo conteúdo está padronizado em PT-BR. Restaurar um sistema de i18n completo é uma evolução recomendada caso o público seja bilíngue.
- Não foi possível importar arquivos binários do GitHub para o ZIP durante esta execução; a restauração automática usa um commit fixo para manter disponibilidade e preservar originais.
- O vídeo Scarface estava identificado por **URL do Instagram, não por MP4 local**. A conversão exige o arquivo exportado do dono. O player nativo está pronto, mas não é possível inventar o arquivo.
- Não foi possível executar `npm install`/`next build` no ambiente offline do pacote. O código passou por validação de sintaxe e verificações offline; faça o build antes de subir para produção.
