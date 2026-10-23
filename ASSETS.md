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
| startup | Windows Startup.wav | 38380 | 0,217 s |
| navigation | Windows Navigation Start.wav | 11340 | 0,064 s |
| minimize | Windows Minimize.wav | 129580 | 0,734 s |
| error | Windows Error.wav | 171564 | 0,972 s |

Todos os cinco são PCM estéreo, 44.100 Hz, 16 bits. A raiz tem prioridade sobre
variantes de temas; a varredura encontrou 303 WAVs e 3 MIDIs em toda a árvore,
incluindo 13 temas. Os demais arquivos continuam preservados no acervo local;
os cinco acima são os usados e versionados nesta rodada.

SHA-256 dos arquivos originais selecionados:

```text
Windows Logon Sound.wav
3d9908bad270909fc063e4cf26e9da35cf5c36bc3074fe6fc9a50ebc7777227e
Windows Startup.wav
deecc7613e7f26550a866b386875366f190fb00ac9484029bb1d0bd1274b344e
Windows Navigation Start.wav
682c8a7cf410de17c249775aee568ec1f9e3341bd4409e96ccbba4882f1d8670
Windows Minimize.wav
3b71ca5a67432991ffa159d082cbf96c7948ad2db7486e6d491063d68863e3c2
Windows Error.wav
217e7bbcba8b6f5af6b4ceb03f11b5d8393862b7aae56db6278911968a48c8b2
```

Demais recursos disponíveis e pendências permanecem em
[`ASSETS_NEEDED.md`](ASSETS_NEEDED.md).
