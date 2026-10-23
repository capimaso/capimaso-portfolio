# Assets — CAPIMASO Dual Boot

## Disponíveis

- `wallpapers/desktop-logo.jpg`: cópia binária exata do `harmony.jpg` recebido
  (que já contém o logo gigante). O arquivo solicitado não estava no checkout;
  nenhum wallpaper diferente foi fabricado. Logon usa Harmony, desktop usa a cópia.

- `public/assets/win7/icons/`: 561 ICO recebidos; preservar nomes e estrutura.
- `Games/Solitaire_108.ico` e `Games/PurblePlace_102.ico`: presentes.
- Categorias de pastas, bibliotecas e sistema: presentes; mapear após inspeção.
- `docs/references/`: quatro capturas atuais do Win7 Simu (boot, logon, desktop e Explorer).
- XP Bliss, capas, avatares, thumbnails e cursores: preservar caminhos atuais.
- `public/assets/win7/wallpapers/harmony.jpg`: wallpaper original recebido e usado.
- `public/assets/win7/theme/start-orb.png`: sprite 106x318 com três estados;
  frames nativos 106x106, posições Y 0/-106/-212 em elemento dedicado reduzido
  uniformemente a 50%; sem esticar, recortar ou modificar o arquivo.
- `public/assets/win7/cursor/`: cursores originais recebidos; usados Normal
  Select, Link Select, Move e os quatro de redimensionamento. Diretório singular.
- Os ICO são servidos diretamente. Os assets incorporados aos commits são os
  arquivos originais recebidos, sem conversão; os demais permanecem preservados.

Presença não comprova procedência. Capturas orientam comparação visual; não
substituem wallpaper limpo ou recursos individuais.

## Pendentes

- `sounds/logon.wav`, `startup.wav`, `navigation.wav`, `minimize.wav`, `error.wav`:
  ainda ausentes. Eventos e fallback silencioso implementados; ver sounds/README.md.

- Ícone original da Calculadora do Windows 7: não encontrado no catálogo recebido;
  o atalho usa temporariamente o ícone real de pasta já disponível.

| Recurso | Destino previsto | Situação |
| --- | --- | --- |
| Recursos originais de moldura Aero | public/assets/win7/theme/ | Sprites originais ausentes; chrome atual usa os estilos oficiais de 7.css 0.21.1, sem gerar imagens |
| Recursos de logon (fundo e moldura do avatar) | public/assets/win7/logon/ | Ainda não incorporados; AuthUX é referência para etapa futura |
| Cursor de seleção de texto | public/assets/win7/cursor/ | Não encontrado; fallback default |
| Sons XP/Win7 | public/assets/win7/sounds/ e equivalente XP | Não encontrados |
| Cartas, versos e tabuleiro Solitaire | public/assets/win7/games/solitaire/ | Ícone presente; artes internas ausentes |
| Menu, cenários e peças Purble Place | public/assets/win7/games/purble-place/ | Ícone presente; artes internas ausentes |
| Procedência dos recursos recebidos | Este inventário | Ainda não documentada por arquivo |

Busca: arquivos locais, recursos originais fornecidos pelo proprietário e
https://win7icons.visnalize.com/ para lacunas de ícones. Referência visual:
https://www.nandomp4.com/. Nenhum download individual foi confirmado nessa fonte.

Ao incorporar arquivos, registrar fonte, nome original, hash e dimensões/estados.
Não gerar imagens por IA nem redesenhar substitutos. Extração de frames ICO para
PNG é permitida se preservar a arte original. Ausências usam rótulos, cursor
nativo, fundo sólido ou silêncio e ficam registradas aqui.

Ícones de rede e Central de Ações no tray são decorativos e não indicam o estado
do computador do visitante. Nenhum som ou controle do sistema operacional real
é simulado. As molduras, gradientes e controles geométricos são CSS de interface,
sem criar imagens para substituir recursos ausentes.

Fotografias são lidas do Google Drive público, configurado via ambiente;
não preencher o acervo com imagens de demonstração. Chave e pasta são configuração,
não assets gráficos. Fontes usam Tahoma/Segoe UI instaladas, sem redistribuição.
