# CAPIMASO — Windows 7 Portfolio

Portfólio de **Tiago / CAPIMASO**: fotografia, edição de vídeo e thumbnails em
uma área de trabalho Windows 7. Interface EN/PT, inglês na primeira visita,
com preferência salva no navegador. Next.js, React, TypeScript e 7.css isolado.

## Rodar localmente

Requisitos: Node.js 20.9+ e npm.

```sh
npm install
npm run dev
```

- [Portfólio](http://localhost:3000/): logon público e desktop Win7.
- [Estúdio local](http://localhost:3000/studio): disponível somente em desenvolvimento.
- `/xp` e `/win7`: redirecionamentos permanentes para `/`, preservando consultas.

A BIOS e o seletor de sistemas foram retirados da experiência pública. O logon
não exige senha; seu campo visual não é enviado ou armazenado. Enter ou a seta
abre o desktop após a transição de 700 ms. Reiniciar no Iniciar recarrega a
entrada e volta ao logon, preservando preferências do navegador.

## Conteúdo e navegação

- **Fotografias:** Explorer com pastas reais do Drive, histórico, breadcrumbs,
  miniaturas e paginação. Photo Viewer tem anterior/próximo, zoom e download.
- **Vídeos:** pastas de curtos (9:16) e longos (16:9). WMP12 Em reprodução usa
  controles reais via API YouTube nos longos; os curtos mantêm `/preview` do
  Drive e reprodução manual. Marcas/avisos dos provedores podem aparecer.
- **Thumbnails:** lista automaticamente as imagens de `public/images/thumbs/`,
  com visualizador e download. Capas novas de vídeos ficam em `public/images/posters/`.
- **Meu perfil:** apresentação/intro, Premiere Pro, After Effects, Photoshop,
  serviços/preços e recados reais. Equipamento mostra a câmera confirmada:
  Fujifilm FinePix S2800HD.
- **Contato:** canais reais de vídeo e fotografia, incluindo `@capimaso` e
  `@capimaso.jpg`, e-mail, Discord e YouTube.
- **Painel de Controle:** wallpapers Harmony/Desktop Logo e mute global.
  Bandeja com volume, idioma, relógio e Mostrar área de trabalho.

O volume da bandeja controla sons do sistema e vídeos YouTube via API:
saída = volume geral × volume próprio do WMP12. Silenciar o geral mantém o
vídeo silenciado mesmo ao mexer no volume local, sem apagar esse ajuste.
O `/preview` do Drive e o fallback sem API usam os controles internos do
provedor e não permitem esse controle geral externo.

Jogos foram cancelados. Calculadora e Bloco de notas continuam disponíveis pela
busca/Iniciar. No desktop, um clique seleciona e duplo clique/Enter abre;
no celular, um toque abre em tela cheia acima da taskbar. Janelas podem ser
movidas/redimensionadas no desktop; setas na barra de título movem e
Shift+setas redimensionam. Minimizar conserva estado e reprodução.

## Adicionar um Reel/Short

1. Envie o vídeo ao Drive e compartilhe como **Qualquer pessoa com o link → Leitor**.
2. Em `npm run dev`, abra `/studio`, preencha os dados e selecione uma capa.
3. Confira as prévias e adicione ao showcase. Apenas link e imagem são gravados;
   o vídeo continua no Drive. A galeria de thumbnails não recebe essa capa.
4. Revise e versione `data/showcase.json` e o novo arquivo em `public/images/posters/`.

O Estúdio usa o tema Win7 e retorna a `/`. Não aparece no menu público.
Em produção, a página responde 404 e a API de upload responde 403. Não habilitar
gravação em produção sem autenticação e armazenamento apropriados.

Para cadastro manual, altere somente o manifesto: `id`, `title`, `description`,
`category`, `format`, `video`, `thumbnail` e `software`. Curtos usam links reais de
arquivo do Drive e poster vertical; longos usam YouTube e poster horizontal.
Thumbnail vazia em um longo usa a capa YouTube. Instagram legado permanece externo.
Nunca inventar IDs, converter links em MP4 falso ou adicionar vídeos binários ao Git.

## Fotografias no Drive

Copie `.env.example` para `.env.local` e configure no servidor:

- `GOOGLE_DRIVE_API_KEY`: chave de projeto com Drive API v3 habilitada.
- `DRIVE_FOLDER_ID`: ID ou link da raiz pública compartilhada como Leitor.
- `DRIVE_FOLDER_RESOURCE_KEY`: opcional, caso a pasta utilize resourcekey.

Não usar prefixo `NEXT_PUBLIC_`, imprimir ou versionar as credenciais. Restrinja
a chave à Drive API. Listagem, imagens e downloads são limitados à raiz
configurada, com caminhos verificados por listagens de pai/filho. O proxy aceita
somente imagens raster e hosts Google; não é um proxy arbitrário de vídeos.
Atualizar recarrega a pasta; cache de listagem de 60 s. Sem configuração,
o desktop e o conteúdo de vídeos/perfil continuam disponíveis.

## Onde editar

| Conteúdo | Fonte |
| --- | --- |
| Identidade e bio | [data/profile.ts](data/profile.ts) |
| Perfil Win7 e equipamento real | [data/win7-profile.ts](data/win7-profile.ts) |
| Projetos | [data/showcase.json](data/showcase.json) |
| Softwares | [data/skills.ts](data/skills.ts) |
| Serviços e pacotes | [data/services.ts](data/services.ts) |
| Recados | [data/comments.ts](data/comments.ts) |
| Contatos Win7 | [data/win7-socials.ts](data/win7-socials.ts) |
| Vídeo de apresentação | [data/media.ts](data/media.ts) |
| Traduções | [lib/locale-dictionary.ts](lib/locale-dictionary.ts) |
| Identidade de compartilhamento | [data/site.ts](data/site.ts) |
| Desktop, janelas e aplicativos | [src/os/win7/](src/os/win7/) |
| Formulário do Estúdio | [src/os/win7/studio/](src/os/win7/studio/) |

## Verificar e publicar

```sh
npm run check
npm run typecheck
npm run test:win7
npm run test:photos
npm run test:sounds
npm run test:player
npm run test:studio
npm run test:metadata
npm run build
```

`check` funciona offline, sem instalar dependências. `test:studio` usa diretório
temporário isolado e não altera o acervo. `npm run probe:videos` é um diagnóstico
opcional de rede, separado dos testes: não salva vídeos nem lê credenciais.

Para produção: `npm run build` e `npm start`, ou build Next.js na hospedagem.
Antes do build, configure `SITE_URL` com o endereço público real, por exemplo
`https://seu-dominio.com` (sem caminho, parâmetros ou fragmento). A configuração
fica no servidor e é documentada em [.env.example](.env.example).
Ela define a URL canônica, Open Graph/Twitter e o único endereço do sitemap.
Título e descrição de compartilhamento acompanham a página inicial; a imagem
usa o wallpaper Win7 original existente.

Sem `SITE_URL`, o site continua funcionando, mas omite URL canônica, imagens
sociais e URLs do sitemap, sem inventar domínio nem publicar `localhost`.
Uma configuração inválida interrompe o build com mensagem clara, sem exibir
seu valor. Depois de alterar o domínio, refaça o build. `/robots.txt` permite
o portfólio e exclui Estúdio/APIs do rastreamento; `/sitemap.xml` lista só `/`.
As rotas antigas continuam redirecionando e o Estúdio permanece local.

Configure as variáveis do Drive no servidor de destino quando usar fotografias.
Nenhum deploy é executado automaticamente.

`predev` e `prebuild` recuperam imagens originais ausentes, sem sobrescrever as
existentes ou baixar vídeos. Para repetir: `npm run assets:sync`. Preserve `public/`
e o manifesto ao atualizar. Assets antigos e fontes XP/boot permanecem no
repositório como legado, sem rotas, imports ou CSS na aplicação ativa.

Consulte [MUDANCAS.md](MUDANCAS.md), [guia de manutenção](docs/CODEX-GUIDE.md),
[plano](PLANS.md) e [verificação de reprodução](docs/WMP12-PLAYBACK-VERIFICATION.md).
Pendências de conteúdo: capas melhores para os dois curtos cuja prévia do Drive
veio preta, adiadas pelo proprietário. Não preencher dados por suposição.
