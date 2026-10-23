# Origem dos assets — CAPIMASO

## Sons do Windows 7 — 22/10/2026

Fonte imediata: arquivos reais adicionados pelo proprietário em
`public/assets/win7/sounds/`, identificados por ele como sons do Microsoft
Windows 7. URL original de obtenção/extração e licença específica não foram
fornecidas no acervo. Nenhum áudio foi sintetizado, convertido, renomeado ou
substituído nesta integração. Os arquivos selecionados são versionados com seus
nomes originais; seus bytes foram preservados.

Configuração: [`src/lib/sounds-map.ts`](src/lib/sounds-map.ts).
Inventário e comportamento: [README dos sons](public/assets/win7/sounds/README.md).

| Evento | Arquivo relativo a public/assets/win7/sounds/ | Bytes | Duração |
| --- | --- | --- | --- |
| logon | Windows Logon Sound.wav | 157412 | 0,892 s |
| startup | windows-7-startup.mp3 | 117515 | 4,713 s |
| ding | Windows Ding.wav | 191788 | 1,087 s |
| navigation | Windows Navigation Start.wav | 11340 | 0,064 s |
| minimize | Windows Minimize.wav | 129580 | 0,734 s |
| error | Windows Error.wav | 171564 | 0,972 s |

Os cinco WAVs ativos são PCM estéreo, 44.100 Hz, 16 bits; o startup agora usa
o MP3 recebido posteriormente. A raiz tem prioridade sobre
variantes de temas; a varredura encontrou 303 WAVs e 3 MIDIs em toda a árvore,
incluindo 13 temas. Os demais arquivos continuam preservados no acervo local;
os seis acima são os usados e versionados. O antigo Windows Startup.wav
permanece versionado, sem disparo atual. O MP3 toca no logon, respeitando as
restrições de autoplay do navegador; Ding acompanha o ajuste de volume da bandeja.

SHA-256 dos arquivos originais selecionados:

```text
Windows Logon Sound.wav
3d9908bad270909fc063e4cf26e9da35cf5c36bc3074fe6fc9a50ebc7777227e
Windows Startup.wav
deecc7613e7f26550a866b386875366f190fb00ac9484029bb1d0bd1274b344e
windows-7-startup.mp3
3abc579e8da99229c368dbdcdc5f3a43a49aed2d60a143944463059e8db3e0be
Windows Ding.wav
7020a1c64207ad8e60062d5400e1332bd07d95bb59cc82af2dd4b39347c64a76
Windows Navigation Start.wav
682c8a7cf410de17c249775aee568ec1f9e3341bd4409e96ccbba4882f1d8670
Windows Minimize.wav
3b71ca5a67432991ffa159d082cbf96c7948ad2db7486e6d491063d68863e3c2
Windows Error.wav
217e7bbcba8b6f5af6b4ceb03f11b5d8393862b7aae56db6278911968a48c8b2
```

O alto-falante da bandeja é um SVG de interface em `VolumeControl.tsx`,
construído conforme a referência `docs/references/volume.png` fornecida pelo
proprietário; nenhum bitmap gerado por IA foi usado.

Demais recursos disponíveis e pendências permanecem em
[`ASSETS_NEEDED.md`](ASSETS_NEEDED.md).
