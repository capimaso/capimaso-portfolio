# Referência da migração XP — 22/10/2026

Antes de migrar, npm install, npm run check e npm run typecheck concluíram.
O desktop foi aberto no Edge headless com Playwright em 360x900, 768x900 e
1440x900. Capturas, medidas e hashes SHA-256 estão em
`.git/codex-verification/` (artefatos locais, fora dos commits).

A referência inclui geometria, fontes, cores, bordas e fundos do desktop,
janela inicial, taskbar, cabeçalho, título e botão Iniciar. Hashes cobrem todos
os arquivos de data/ e public/, incluindo os assets recebidos e ainda não
versionados. Nenhum deles deve mudar nesta entrega.

Revalidar depois: inicialização, EN/PT, menus, abrir/focar/arrastar/minimizar/
restaurar/maximizar/fechar, propriedades de wallpaper, trabalhos e thumbnails,
proporções dos players e links do Estúdio. A execução de vídeos depende também
dos provedores externos; conferência de iframe não atesta reprodução remota.
