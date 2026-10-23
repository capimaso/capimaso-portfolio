# Sons do Windows 7

Mapeamento explícito em [`src/lib/sounds-map.ts`](../../../../src/lib/sounds-map.ts).
SoundManager e detecção de disponibilidade no servidor usam a mesma configuração.

| Evento | Arquivo original na raiz desta pasta | Duração | Disparo |
| --- | --- | --- | --- |
| logon | Windows Logon Sound.wav | 0,892 s | Entrada pelo botão/Enter da tela de boas-vindas |
| startup | windows-7-startup.mp3 | 4,713 s | Aparecimento da tela de boas-vindas; nunca na montagem do desktop |
| ding | Windows Ding.wav | 1,087 s | Prévia ao ajustar o volume da bandeja |
| navigation | Windows Navigation Start.wav | 0,064 s | Voltar/avançar no Explorer |
| minimize | Windows Minimize.wav | 0,734 s | Minimizar janela, tarefa ativa ou mostrar desktop |
| error | Windows Error.wav | 0,972 s | Falhas do Explorer, visualizador, downloads ou busca |

Os cinco WAVs ativos são PCM estéreo, 44.100 Hz, 16 bits. Startup usa o MP3
original fornecido posteriormente. Durações conferidas no navegador, sem
converter, normalizar ou cortar os arquivos. O antigo `Windows Startup.wav`
continua preservado no acervo, sem disparo associado ao desktop.

Varredura recursiva em 22/10/2026: 303 WAVs e 3 MIDIs. Há 43 WAVs e 3 MIDIs
na raiz; os outros 260 WAVs estão nos 13 temas Afternoon, Calligraphy,
Characters, Cityscape, Delta, Festival, Garden, Heritage, Landscape, Quirky,
Raga, Savanna e Sonata. Logon, navegação e erro têm 14 versões cada (raiz e
13 temas); startup e minimizar aparecem só na raiz. Foram priorizadas as
versões da raiz, conforme solicitado. Nenhum outro arquivo foi removido ou
renomeado. A rodada posterior acrescentou `windows-7-startup.mp3` (117.515 bytes)
e incorporou o Ding ao mapa; os arquivos de áudio usados estão versionados.

Origem imediata: acervo adicionado pelo proprietário, identificado por ele como
sons reais do Microsoft Windows 7. URL de obtenção e licença específica não
acompanham o material recebido. Hashes em [`ASSETS.md`](../../../../ASSETS.md).

Ausência significa silêncio, sem requisições de arquivos inexistentes. A página
detecta os caminhos mapeados no servidor; reinicie o servidor de desenvolvimento
ou faça novo build/deploy após adicionar/trocar sons. Para selecionar um tema,
aponte a URL correspondente no mapa, preservando os nomes e as subpastas.
Falhas de decodificação/autoplay mantêm a interface funcionando, sem alertas.
O startup tenta tocar ao aparecer o logon. Caso a política de autoplay bloqueie
a tentativa, o SoundManager tenta novamente na interação de entrada. Os demais
eventos só são habilitados após entrar. Ver a
[documentação de autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
Volume inicial 80%, ajustável entre 0 e 100% na bandeja, em tempo real inclusive
nos sons em andamento. Ding toca após 150 ms sem novos ajustes; volume zero e
mute permanecem silenciosos. Mute da bandeja e do Painel de Controle compartilham
o mesmo estado. Sair do Win7 libera os elementos de áudio.
