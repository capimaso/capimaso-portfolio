# WMP12 — prova de fonte de reprodução — 06/11/2026

## API oficial e curtos nativos — 09/11/2026

Esta prova substitui a limitação dos downloads públicos abaixo. Metadados e
`files.get?alt=media` pela API oficial, com chave somente no servidor, responderam
corretamente para os cinco curtos públicos. Não houve scraping do `/preview`,
extração de tokens, troca de links ou gravação de vídeos locais.
Referência: [downloads e Range na API oficial](https://developers.google.com/workspace/drive/api/guides/manage-downloads).

No Edge, todos os cinco carregaram metadados e reproduziram com HTMLVideoElement:

| ID | Resolução | Duração | Seek testado |
| --- | --- | --- | --- |
| scarface | 2160×3840 | 30,15 s | 18 s |
| stefany | 1080×1920 | 61,93 s | 37 s |
| dono-da-bublitz | 1080×1920 | 30,58 s | 18 s |
| corte-pib-1 | 1080×1920 | 40,94 s | 24 s |
| investiu-mkt-1 | 1080×1920 | 33,40 s | 20 s |

Em todos: início pausado/mudo, controles nativos do navegador ocultos, reprodução
real, pausa, seek distante, volume próprio de 50% resultando em 40% com master
80%, e parar/voltar ao zero pelo WMP12. Nenhum iframe estava presente nessa prova.

Implementação: [serviço](../src/server/drive/videos.ts),
[rota](../app/api/videos/[id]/stream/route.ts) e
[hook nativo](../src/os/win7/apps/useNativeVideoPlayer.ts).
Range de até 4 MiB, HEAD sem mídia, allowlist por projeto e rejeição de HTML,
redirects e Range ignorado. Chave ausente, erro de rede/codec ou metadados sem
resposta em 25 s restauram o `/preview` original, sem botões de transporte falsos.

`test:video-stream` tem 10 testes offline para allowlist, chave ausente, headers
seguros, Range parcial/aberto/sufixo/416, HEAD/cache, MIME/permissão, erros do
provedor e transmissão. `test:photos` (10) e `test:player` (7) continuam aprovados.
Rodadas adicionais de UI/master/mobile foram interrompidas por resposta temporária
429/HTML do Google; não foram contornadas ou consideradas reprodução aprovada.
Produção ainda exige configurar a chave na Vercel; galeria também exige a raiz.

## Nova prova dos curtos — 07/11/2026

Novo pedido Range encontrou 206/video-mp4 em Dono da Bublitz e Investiu MKT,
enquanto Scarface, Stefany e Corte PIB retornaram HTML. Em contexto novo do
Edge, os dois candidatos não carregaram metadados em 30 segundos e não
passaram na prova de reprodução/seek. Portanto nenhum foi promovido a fonte
`<video>`. As fontes e os embeds originais foram preservados; WMP nativo nos
curtos aguarda URLs controláveis reais (ou links equivalentes no YouTube).
Esse resultado substitui qualquer interpretação de que 206, sozinho, comprova
reprodução no navegador. Nenhum binário foi salvo, e nenhuma credencial foi usada.

## Volume geral e individual — 06/11/2026

O WMP12 aplica volume geral da bandeja × volume individual via `setVolume`
da [API oficial YouTube](https://developers.google.com/youtube/iframe_api_reference#Playback_controls).
Mute geral/volume geral zero dominam o local, sem alterar o valor ou a
preferência de mute do vídeo. Cada instância começa em 80 e muda apenas seu
próprio ajuste; autoplay continua mudo. Minimizar conserva a instância e a
assinatura do master; fechar, trocar ou falhar desconecta antes de destruir.
O polling nunca copia o volume efetivo da API para a barra individual.

Drive `/preview` e fallback sem API mantêm os controles internos do provedor:
o master externo não alcança esses iframes. Não há acesso a streams, credenciais
ou alteração de fonte para contornar essa limitação.

## Atualização — referências recebidas e interface implementada

As três capturas fornecidas pelo proprietário definem o modo Em reprodução:
fundo preto/azul, progresso fino, transporte central e botão azul circular.
[WmpPlayer.tsx](../src/os/win7/apps/WmpPlayer.tsx) implementa essa apresentação
em CSS Modules e SVGs de interface, sem modificar os assets ou produzir raster.

Os longos agora usam a API oficial para play/pausa, seek, tempo, parar, volume
e mute, mantendo a fonte YouTube. Há timeout e fallback para o embed nativo se
a API não carregar ou retornar erro. O autoplay é mudo. A marca, anúncios e
avisos do provedor podem aparecer; não se afirma reprodução independente.

Os curtos mantêm o `/preview` Drive, com reprodução manual e seus controles
internos. A barra externa oferece somente troca de vídeo, lista e tela cheia.
Não há botão externo de play ou progresso fictício. Lista e anterior/próximo
respeitam o formato do vídeo. Minimizar mantém a instância; trocar ou fechar
cancela timers/polling e destrói o player anterior.

O teste `npm run test:player` cobre o carregamento compartilhado do SDK,
falha/timeout com nova tentativa e formatação de tempos. A investigação abaixo
continua válida para uma futura origem que permita `<video>` sem interface dos
provedores; as capturas resolvem a referência visual, sem resolver essa origem.

Verificação no Edge de produção em 375/768/1440 px e EN/PT: reprodução real do
YouTube, play/pausa, seek (posição novamente conferida após 5,5 s), stop, volume,
mute, teclado, lista, fullscreen e preservação do iframe ao minimizar aprovados.
Drive preservou `/preview`, sem autoplay, com proporção 9:16. Zero erros de
página ou overflow horizontal nas verificações. Falha da API foi simulada em
375×430 para conferir fallback, Escape/foco e fechar/reabrir com nova tentativa.
Teste de seek também corrigiu uma corrida real entre eventos de buffering e
eventos nativos do slider: a UI conserva o destino enquanto a API confirma a
mudança, com expiração para retornar ao tempo observado caso ela não se confirme.

Check, typecheck, build e 37 testes offline aprovados. O build conserva o aviso
preexistente de metadataBase. Não foi validada reprodução nativa por `<video>`
nem eliminação de anúncios/marcas do provedor. Os testes de Drive desta rodada
conferem integração/layout e não confirmam reprodução dos curtos de ponta a ponta.

O objetivo é usar controles reais do Windows Media Player 12 no Win7. A prova
desta rodada determina se os links atuais podem alimentar esse player sem
depender da interface dos provedores. O catálogo, os embeds e o proxy de fotos
permanecem preservados.

## Resultado com o catálogo atual

| Projeto | Fonte atual | Verificação | Conclusão nesta rodada |
| --- | --- | --- | --- |
| Scarface | Arquivo público do Drive | Pedido público de download com `Range: bytes=0-1023`: HTTP 200, `text/html` | Não é uma resposta parcial de mídia validada |
| Stefany | Arquivo público do Drive | Pedido público de download com `Range: bytes=0-1023`: HTTP 200, `text/html` | Não é uma resposta parcial de mídia validada |
| MegLuuh | Link YouTube | URL do catálogo e documentação oficial da IFrame API | Reprodução atual depende do player YouTube |
| Tranzit | Link YouTube | URL do catálogo e documentação oficial da IFrame API | Reprodução atual depende do player YouTube |

Os resultados do Drive descrevem somente o acesso público de download testado,
sem sessão, cookies ou credenciais. Não significam que o arquivo foi apagado,
que o embed falhou ou que acesso via API seja impossível. Não foram feitas
mudanças em compartilhamento, hospedagem ou organização do Drive.

Foi solicitado apenas o primeiro intervalo; a resposta foi cancelada após os
cabeçalhos, sem gravar vídeos em disco. Nenhuma URL temporária ou token foi
extraído de páginas HTML. Não houve alteração do proxy de fotos ou uso das
credenciais da galeria fora de sua raiz pública configurada.

## Repetir a prova

```sh
npm run probe:videos
```

[scripts/probe-video-sources.mjs](../scripts/probe-video-sources.mjs) lê o catálogo
atual e faz somente pedidos públicos. Não carrega variáveis de ambiente, não
imprime URLs, não exige chave e não salva bytes de vídeo. O relatório contém
ID do projeto, tipo de fonte, status HTTP, tipo de conteúdo e resultado do Range.

Um resultado parcial `206` com `video/*` e `Content-Range` válido seria apenas
candidato à próxima prova, não aprovação automática para publicação. Ainda é
necessário verificar no navegador reprodução, pausa, seek em posições distantes,
repetição do pedido sem sessão anterior, codec, volume e tela cheia. HTTP 200
com HTML não deve ser encaminhado ao `<video>` como se fosse mídia.

O comando é um diagnóstico de rede opcional, separado dos testes offline. Uma
resposta de erro, timeout ou desafio HTML é registrada como fonte não validada;
não aciona fallback inseguro, não troca o conteúdo do projeto e não encerra com
falha de build. A validade dos links originais continua sendo responsabilidade
dos embeds existentes.

## O que os embeds permitem

O YouTube oferece reprodução/pausa, tempo, seek e volume pela IFrame Player API.
Isso permite controles externos funcionais, mas o vídeo continua sendo servido
pelo player YouTube, sujeito à sua interface e marca. `modestbranding` foi
descontinuado e não elimina essa dependência. Não extrair streams de páginas
YouTube nem encobrir elementos para simular uma fonte de mídia independente.

O `/preview` do Drive atual também é uma interface incorporada, não o arquivo
binário do vídeo. Nesta rodada não foi identificada uma API de controle desse
embed que permita implementar os controles completos solicitados. Mantê-lo
funcionando é o fallback durante a validação da nova origem.

O Drive documenta download de arquivos binários por `files.get?alt=media` e
pedidos parciais com Range. Esse é um caminho a investigar se os arquivos
estiverem dentro de uma raiz pública explicitamente configurada e verificada.
A galeria atual aceita apenas imagens; não ampliar seus limites nem transformar
links enviados pelo cliente em um proxy arbitrário de vídeos.

## Assets inspecionados

A grade dos arquivos de [WMP12 Icons](../public/assets/win7/icons/WMP12%20Icons/)
foi aberta e conferida visualmente no Edge. Há 38 ICO: ícones de reprodução,
mídias, dispositivos, bibliotecas e ações. Exemplos: `WMP 12 2.ico` tem um símbolo
de play, `WMP 12 14.ico` representa um vídeo e `WMP 12 23.ico` representa grade.

Também existem ícones em
[Windows Media Player](../public/assets/win7/icons/Windows%20Media%20Player/).
Não foram encontrados `wmploc.dll`, sprites da barra de transporte ou uma captura
do WMP12 nas referências locais. Um ícone de play isolado não define a geometria,
os estados hover/pressed ou a aparência completa da barra. Nenhum asset original
foi alterado, apagado ou substituído.

## Dependências para a implementação completa

1. Confirmar uma origem real para os arquivos originais dos vídeos, especialmente
   os longos hoje disponíveis apenas como links YouTube no catálogo. Preferir
   uma origem HTTPS que entregue mídia e suporte seek; se for Drive, validar
   primeiro a API, o escopo público, as respostas parciais e a hospedagem.
2. Confirmar o modo visual do WMP12 e obter uma captura correspondente; usar os
   ícones recebidos e pedir somente os recursos que faltarem ao proprietário.
3. Com uma fonte aprovada, implementar vídeo e controles reais, testar eventos
   e erros, teclado/toque, proporções, fullscreen, minimizar/restaurar e limpeza
   ao fechar. Só então ativar a nova reprodução no catálogo.

Não há garantia de streaming confiável, custo de tráfego ou compatibilidade de
codec nesta rodada. A prova atual não autoriza trocar os links existentes por
URLs de download construídas automaticamente.

## Fontes oficiais

- [Parâmetros do YouTube](https://developers.google.com/youtube/player_parameters).
- [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference).
- [Downloads e acesso parcial no Drive](https://developers.google.com/workspace/drive/api/guides/manage-downloads).
