# CAPIMASO Dual Boot — plano aprovado

## Progresso — fotografias Windows 7

Etapas 1–5 concluídas: boot, XP preservado, shell Aero, Drive público, Explorer
e Photo Viewer com navegação, zoom e download. A rodada atual cobre fotografias;
os jogos da etapa 6 continuam pendentes. Sobre e Contato usam dados reais.
Assets recebidos: Harmony, Orb de três estados e cursores em `cursor/`.

## Objetivo e decisões

| Rota | Experiência |
| --- | --- |
| `/` | BIOS breve e pulável, seguida de Boot Manager com escolha manual |
| `/xp` | Windows XP Luna: portfólio atual de vídeos preservado |
| `/win7` | Windows 7 Aero: fotografias do Google Drive e jogos |
| `/studio` | Estúdio atual; persistência apenas em desenvolvimento |

Manter Next.js, React, TypeScript e CSS próprio, sem reativar componentes legados,
Tailwind ou Framer Motion. Zero imagens geradas por IA. Preservar arquivos, dados,
links, preços, recados e preferências existentes.

## Arquitetura

- `app/` permanece o único App Router, com entradas para boot, XP, Win7 e Estúdio.
- `src/boot/`: BootScreen, BiosScreen, BootManager e CSS Modules.
- `src/os/xp/`: XpDesktop, XPApps, XPIcon, XPImage, WallpaperSettings e xp.css.
- `src/os/win7/`: desktop, gerenciador de janelas, moldura, taskbar, StartMenu,
  mapa de assets, tipos, CSS Modules e apps Explorer, PhotoViewer, About, Contact.
- `src/os/win7/apps/games/`: GamesExplorer, Solitaire e motor de regras,
  PurblePlace; PurblePairs e motor de pares quando os assets permitirem.
- `src/shared/LanguageContext.tsx`: contexto e hook useT compartilhados.
- `src/server/drive/`: cliente server-only, navegação do acervo e tipos.
- `app/api/photos/`: listagem; `[id]/image/`: miniaturas e originais.
- `public/assets/win7/icons/`: preservar os 561 ICO recebidos. Novos recursos
  reais em wallpapers, sounds, cursors, theme e games sob o mesmo diretório.
- `public/assets/win7/derived/`: extrações PNG de ICO apenas se necessárias.
- `docs/references/`: preservar as 12 capturas para comparação visual.
- `public/images/`, `public/icons/`, `data/*` e API do Estúdio preservados.

Remover tema XP do layout raiz e limitar todos os seletores a `.xp-shell`,
também usado pelo Estúdio. Raiz contém apenas estrutura mínima; boot e Win7
usam CSS Modules. Validar mudanças de rota sem depender de descarregar CSS.
Migrar somente componentes ativos e atualizar imports e verificações de caminhos.
EN/PT continua via useT e `lib/locale-dictionary.ts`, inglês inicial e preferências
existentes preservadas. Metadados próprios por rota, identidade Tiago / CAPIMASO.

## Comportamentos

### XP e boot

XP continua recebendo getShowcase/getThumbnails no servidor. Manter storage e
IndexedDB, wallpapers locais, fallback do GitHub, vídeos Drive manuais em 9:16
e YouTube com autoplay mudo em 16:9. Estúdio retorna ao XP e continua bloqueando
upload em produção; não mudar contrato da API.

BIOS textual por 1,5 segundo, pulável por teclado ou botão. Sem hardware ou
diagnósticos inventados. Movimento reduzido elimina a espera. Boot Manager preto
com XP inicialmente destacado, sem timeout; setas selecionam e Enter confirma.
Links reais para XP e Win7 funcionam com clique, toque, Tab e sem JavaScript.
Rotas diretas não passam pelo boot. Reiniciar/Escolher sistema retorna a `/`.
Enquanto Win7 não for implementado, sua rota apresenta aviso bilíngue e retorno
ao boot; não simula um desktop pronto.

### Google Drive

Usar API v3 com fetch no servidor; não instalar better-gdrive nesta abordagem.
Variáveis: DRIVE_FOLDER_ID (ID ou link de pasta), GOOGLE_DRIVE_API_KEY e DRIVE_FOLDER_RESOURCE_KEY
opcional. Sem NEXT_PUBLIC, login ou OAuth para o acervo público.

Listar filhos por parents e trashed=false, sob demanda e com nextPageToken.
Pastas antes de imagens, por nome. Ignorar atalhos e arquivos incompatíveis.
Usar nomes reais e dimensões disponíveis, sem inventar legendas ou trabalhos.
Cache de listagem por 60 segundos e atualização explícita. Não criar
data/photos.json como fonte do acervo. Build e XP não dependem da configuração.

GET /api/photos lista a raiz; folderId e pageToken permitem subpastas/páginas.
Retornar pasta atual, itens com id/name/kind/mimeType/dimensões opcionais e
nextPageToken, além dos breadcrumbs. `path` contém IDs ancestrais para chamadas
sem cache/afinidade de servidor; cada vínculo é verificado em listagem do Drive,
pois files.get pode omitir parents de arquivos públicos.
GET /api/photos/[id]/image?variant=thumbnail|original entrega
imagens sem expor a chave. Validar pertencimento de cada pasta/arquivo à árvore
configurada; rejeitar IDs externos e URLs arbitrárias. Não persistir links
temporários de miniaturas como URLs permanentes.

`download=1` entrega attachment com os bytes e nome original. Cache de provas
de pertencimento dura no máximo 60s, assim como o de listagem; não é um catálogo
permanente. Nenhuma mídia é persistida no repositório.

Explorer tem breadcrumbs, voltar/avançar, subpastas e carregamento progressivo.
Visualizador tem anterior/próxima na pasta atual, zoom e ajuste sem distorção.
Não baixar todos os originais antecipadamente. Distinguir configuração ausente,
pasta vazia, acesso negado, quota e falha de rede, com tentar novamente.

### Windows 7 e jogos

Aero fiel às referências, Segoe UI quando disponível, taskbar de 40px no desktop,
Start Orb e molduras ativo/inativo. Abrir, focar, arrastar, redimensionar,
minimizar, maximizar, restaurar e fechar. Mostrar área de trabalho e taskbar
operantes. Menu com Fotos, Sobre, Contato, Games e retorno ao boot; busca filtra
destinos implementados. Não inventar experiência ou preços de fotografia.

Games abre pasta com ícones locais de Solitaire e Purble Place.
Solitaire obrigatório: Klondike, 52 cartas, sete colunas, compra de uma carta,
sequência alternada, fundações por naipe, reis em espaços vazios, reciclagem,
revelar, desfazer, nova partida e vitória. Mouse, toque e teclado; alternativa
selecionar/destino ao arraste. Minimizar preserva estado; fechar encerra;
nova partida confirma perda de progresso. Artes originais quando disponíveis;
até lá, valores/naipes textuais com limitação visual documentada.

Purble Place: menu das três modalidades; indisponíveis identificadas como tal.
Com assets originais suficientes, habilitar Purble Pairs 4x4 com oito pares,
comparação de duas peças, bloqueio durante comparação, tentativas, reinício e
vitória. Sem assets, manter indisponível; não inventar personagens.

Abaixo de 720px, janelas ocupam área útil acima da taskbar, com 100dvh e safe
areas. Sem arraste/redimensionamento mobile; preservar geometria desktop.
Rolagem interna, controles alcançáveis e foco visível. Sons opcionais, desligados
inicialmente e reproduzidos apenas após ativação explícita.

## Etapas

1. Gravar plano e inventário de assets.
2. Registrar referência visual/funcional do XP em 360, 768 e 1440px.
3. Migrar XP para /xp, isolar CSS, atualizar Estúdio e checagens.
4. Implementar BIOS e Boot Manager; preparar .env.example do Drive.
5. Construir desktop Win7 e integração Drive.
6. Implementar Solitaire/menu Purble Place; avaliar assets de Purble Pairs.
7. Incorporar recursos verificados, testar e atualizar documentação.

## Validação

Executar check, typecheck e build. Testar rotas diretas/recarga e navegação
repetida sem vazamento visual. Comparar XP antes/depois e hashes de dados/assets.
Conferir janelas, idioma, wallpaper, galerias, Drive 9:16, YouTube 16:9 e Estúdio.
Testar boot com teclado, mouse, toque, movimento reduzido e sem JavaScript.
Nas próximas etapas: Drive paginado/subpastas/resource keys/erros/IDs externos;
regras e vitória do Solitaire; pares e bloqueio do Purble Pairs se habilitado.
Nenhum asset ausente pode quebrar navegação. Sem publicação automática.

Referências técnicas: https://developers.google.com/workspace/drive/api/guides/search-files
e https://developers.google.com/workspace/drive/api/reference/rest/v3/files.
