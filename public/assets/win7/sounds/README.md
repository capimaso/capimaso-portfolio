# Sons do Windows 7

Mapeamento explícito em [`src/lib/sounds-map.ts`](../../../../src/lib/sounds-map.ts).
SoundManager e detecção de disponibilidade no servidor usam a mesma configuração.

| Evento | Arquivo original na raiz desta pasta | Duração | Disparo |
| --- | --- | --- | --- |
| logon | Windows Logon Sound.wav | 0,892 s | Entrada pelo botão/Enter da tela de boas-vindas |
| startup | Windows Startup.wav | 0,217 s | Primeiro carregamento do desktop após entrar |
| navigation | Windows Navigation Start.wav | 0,064 s | Voltar/avançar no Explorer |
| minimize | Windows Minimize.wav | 0,734 s | Minimizar janela, tarefa ativa ou mostrar desktop |
| error | Windows Error.wav | 0,972 s | Falhas do Explorer, visualizador, downloads ou busca |

Os cinco selecionados são WAV PCM estéreo, 44.100 Hz, 16 bits. Durações calculadas
pelos chunks RIFF, sem converter, normalizar ou cortar os arquivos.

Varredura recursiva em 22/10/2026: 303 WAVs e 3 MIDIs. Há 43 WAVs e 3 MIDIs
na raiz; os outros 260 WAVs estão nos 13 temas Afternoon, Calligraphy,
Characters, Cityscape, Delta, Festival, Garden, Heritage, Landscape, Quirky,
Raga, Savanna e Sonata. Logon, navegação e erro têm 14 versões cada (raiz e
13 temas); startup e minimizar aparecem só na raiz. Foram priorizadas as
versões da raiz, conforme solicitado. Nenhum outro arquivo foi removido ou
renomeado. Apenas os cinco WAVs usados foram incluídos nos commits desta rodada.

Origem imediata: acervo adicionado pelo proprietário, identificado por ele como
sons reais do Microsoft Windows 7. URL de obtenção e licença específica não
acompanham o material recebido. Hashes em [`ASSETS.md`](../../../../ASSETS.md).

Ausência significa silêncio, sem requisições de arquivos inexistentes. A página
detecta os caminhos mapeados no servidor; reinicie o servidor de desenvolvimento
ou faça novo build/deploy após adicionar/trocar sons. Para selecionar um tema,
aponte a URL correspondente no mapa, preservando os nomes e as subpastas.
Falhas de decodificação/autoplay mantêm a interface funcionando, sem alertas.
Reprodução só é habilitada após a interação de entrada; volume 40%. O mute
global do Painel de Controle interrompe os sons ativos e bloqueia novos eventos
até reativar. Sair do Win7 libera os elementos de áudio.
