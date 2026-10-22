# Fotografias — integração e validação — 22/10/2026

## Entrega

Explorer de Fotografias lista a raiz pública configurada e navega por subpastas,
com breadcrumbs, histórico, miniaturas, seleção, paginação, skeletons e erros.
Photo Viewer é uma janela independente, com fundo escuro, anterior/próximo na
mesma pasta, zoom, ajuste à janela e download do original. Mobile usa um toque
e janela na área útil inteira. Nomes e imagens vêm do acervo real.

## Contrato das APIs

| Rota | Comportamento |
| --- | --- |
| `GET /api/photos` | Lista raiz; responde folder, breadcrumbs, items e nextPageToken opcional |
| `GET /api/photos?folderId=...&path=...&pageToken=...` | Lista página de subpasta; path é a sequência de IDs ancestrais separados por `/` |
| `GET /api/photos?folderId=...&path=...&refresh=1` | Atualiza a pasta, invalidando as páginas da listagem em cache |
| `GET /api/photos/[id]/image?variant=thumbnail&path=...` | Proxy da miniatura; fallback para bytes originais se a miniatura expirar |
| `GET /api/photos/[id]/image?variant=original&path=...` | Proxy do original |
| `GET /api/photos/[id]/image?variant=original&path=...&download=1` | Original com attachment e nome UTF-8 |

Itens públicos contêm id, name, kind, mimeType e dimensões opcionais. Nenhuma
resposta contém API Key ou URL temporária de thumbnail do provedor. O frontend
usa `src/lib/photos.ts` para tipos e URLs locais.

`path` não concede permissão: os vínculos pai/filho são verificados por listagens
do Drive. Isso funciona também sem cache anterior e quando files.get omite
parents no Drive público. Metadados, listagens e provas de pertencimento ficam
em cache de memória limitado por 60s; alterações de acesso podem refletir essa
janela. Os bytes não são persistidos no repositório nem transformados.

Downloads exigem resposta válida antes de iniciar o salvamento. Imagens ativas
como SVG e arquivos fora da raiz são rejeitados. Redirecionamentos de mídia são
restritos a hosts Google permitidos, sem encaminhar a chave aos hosts de imagem.

## Testes executados

- `.env.local` usado somente no servidor/testes locais; permaneceu ignorado e
  não foi alterado nem incluído nos commits. DRIVE_FOLDER_ID continha um link
  completo; o parser aceita esse formato e o ID puro.
- Teste real via terminal: raiz retornou duas pastas; uma subpasta retornou
  38 imagens. Miniatura retornou JPEG de 8.717 bytes; original retornou JPEG
  de 1.547.271 bytes com attachment.
- Edge/Playwright com o acervo real: subpastas, voltar/avançar, thumbnail e
  original decodificados, proporção, anterior/próximo e zoom/ajuste passaram.
  Download pelo botão teve SHA-256 idêntico ao original entregue pelo proxy.
- Cenários simulados no navegador: falha de rede e tentar novamente, paginação
  do Explorer, viewer atravessando páginas contendo apenas pastas, e uso por
  toque em 360px. Passaram também no servidor de produção.
- `npm run test:photos`: nove testes sem credenciais reais, cobrindo contrato,
  paginação, arquivo fora da raiz, proxy/download, MIME, caminhos sem cache,
  redirecionamento externo, configuração ausente, quota e bloqueio HTML temporário.
- `npm run test:win7`: sete testes, incluindo reabrir outra fotografia na mesma
  janela sem perder geometria ou duplicar o viewer.
- `npm run check`, `npm run typecheck` e `npm run build` passaram.
- Comparação do XP em 360/768/1440px e Estúdio passou; dados e hashes anteriores
  de assets preservados.
- Busca pela chave real em arquivos versionados e bundles `.next/static` não
  encontrou ocorrências. O scanner não imprime a chave.

### Limitação observada no provedor

Depois dos testes reais bem-sucedidos, a reconferência de originais no servidor
de produção recebeu HTML 403 do Google indicando consultas automatizadas na
rede. Listagem e miniaturas continuaram acessíveis. Não se tentou contornar o
bloqueio. Esse caso agora retorna JSON 429 com Retry-After: 60, e a interface
oferece tentar novamente. A validação restante da interface em produção usou
respostas simuladas; não se afirma uma segunda rodada de download real nesse
servidor enquanto o limite persistia.

Artefatos e scripts de navegador estão localmente em `.git/codex-verification/`.
Não contêm cópia do arquivo de ambiente e não fazem parte dos commits.

Referências técnicas: [listagem pública](https://developers.google.com/workspace/drive/api/guides/search-files),
[metadados e miniaturas](https://developers.google.com/workspace/drive/api/reference/rest/v3/files),
[resource keys](https://developers.google.com/workspace/drive/api/guides/resource-keys).
