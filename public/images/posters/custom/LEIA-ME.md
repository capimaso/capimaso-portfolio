# Trocar capas e nomes dos vídeos

Coloque suas capas **nesta pasta**, usando o ID do vídeo como nome do arquivo.
O site encontra a imagem automaticamente: não precisa alterar `thumbnail`.

| Vídeo atual | Nome da capa (exemplo JPG) | Proporção |
| --- | --- | --- |
| 3 programas que todo PC Gamer deveria ter | `scarface.jpg` | 9:16 |
| Ela não espera o sonho acontecer. Ela vive. | `stefany.jpg` | 9:16 |
| A tríade do caos: Huntress, Nurse e Billy — Dead by Daylight | `megluuh.jpg` | 16:9 |
| Tentamos fazer o Easter Egg do TRANZIT | `tranzit.jpg` | 16:9 |
| Dono da Bublitz | `dono-da-bublitz.jpg` | 9:16 |
| 1 Corte PIB | `corte-pib-1.jpg` | 9:16 |
| Investiu MKT 1 | `investiu-mkt-1.jpg` | 9:16 |
| Vídeo de apresentação | `intro.jpg` | 16:9 |

Também pode usar PNG, JPEG, WebP ou AVIF; troque só a extensão do exemplo.
Mantenha os IDs em minúsculas e deixe uma capa por vídeo. Se houver mais de
uma extensão para o mesmo ID, a prioridade é PNG, JPG, JPEG, WebP e AVIF.
Sem uma capa nesta pasta, o site continua usando a capa anterior ou a do YouTube.
Nada é apagado ou movido automaticamente. Não coloque arquivos de vídeo aqui.

Para **mudar o nome exibido**, abra [data/showcase.json](../../../../data/showcase.json),
encontre o vídeo pelo `id` e edite **somente `title`**. Exemplo:

```json
"id": "corte-pib-1",
"title": "O nome que você quiser"
```

Mantenha o `id`, `video` e os demais campos. O ID continua ligando a capa ao
vídeo mesmo depois de mudar o título. A introdução tem seu título em
[data/media.ts](../../../../data/media.ts).

A **galeria de thumbnails** é separada: coloque suas imagens em
[public/images/thumbs/](../../thumbs/). O nome do arquivo é o nome exibido na
galeria; elas aparecem automaticamente e não viram capas dos vídeos.

No computador, atualize a página em `npm run dev` para conferir. Para aparecer
no site publicado, envie as imagens e alterações de títulos para a `main`;
a Vercel precisa concluir um novo deploy.
