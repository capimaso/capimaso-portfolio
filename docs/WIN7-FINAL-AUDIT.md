# Auditoria visual e funcional final — 22/10/2026

## Escopo entregue

Cinco commits separados: Logon, Hover, Aero, Explorer e Áudio. Documentação em
commit próprio. Implementação do Drive, conteúdo do usuário e XP preservados.

- Logon público antes do desktop, com avatar real, CAPIMASO, campo visual,
  Enter/seta azul e idiomas. O campo não é lido, validado, armazenado ou enviado;
  o formulário é limpo na entrada. Nada é requerido para acessar o portfólio.
- Harmony no logon e desktop-logo.jpg no desktop. Como o segundo arquivo estava
  ausente, recebeu cópia binária exata do Harmony disponível (já com logo gigante).
  Igualdade confirmada por SHA-256; nenhuma imagem nova ou modificada por IA.
- Hover/pressed/focus instantâneos, inclusive pseudo-elementos dos controles,
  Orb, taskbar e menu. Menu também abre/fecha sem fade. Seleção do desktop mantida.
- Taskbar em gradiente escuro translúcido, blur 15 px e bordas branca/preta;
  títulos com reflexos e blur 10 px, sombra 0 10px 30px rgba(0,0,0,.5).
- Explorer com Refresh verde/azul dentro do endereço, histórico Aero Gel,
  rodapé branco e contagem à esquerda. Scrollbars com thumb azul e setas 7.css.
- SoundManager global, habilitado pela entrada, com eventos logon, startup,
  navigation, minimize e error. Apenas arquivos existentes são anunciados pelo
  servidor. WAV ausentes, autoplay negado e falha de decodificação são silenciosos.

## Referências examinadas

As quatro capturas atuais em docs/references/: image.png (desktop), image2.png
(boot), image (1).png (Explorer) e image (2).png (logon). Usadas para proporções,
avatar central, transparência, organização do endereço e controles do Explorer.
As diferenças de conteúdo do portfólio e o wallpaper disponível foram preservados;
não se alega reprodução pixel a pixel do sistema operacional inteiro.

## Verificação realizada

- `npm run check`, `npm run typecheck` e `npm run build`: aprovados.
- `test:win7`: 12 testes; `test:photos`: 10; `test:sounds`: 4. Todos aprovados.
- Edge/Playwright em dev e produção, larguras 360/768/1440: logon por Enter/toque,
  wallpapers, valores de blur, duração zero de transições (elementos e brilhos),
  Refresh integrado, cor/contagem do rodapé, thumb da scrollbar, histórico,
  falha/retry, minimizar/restaurar e ausência de overflow horizontal.
- Capturas com scrollbars visíveis: flag padrão do navegador headless que as
  oculta foi desativada. Capturas locais em .git/codex-verification/audit-*.
- Campo visual preenchido com texto de teste: nenhuma URL ou corpo de request
  continha esse texto após entrar. Nenhuma requisição a WAV ausente foi emitida.
- Drive real: pastas, histórico, miniaturas, original decodificado, zoom,
  anterior/próximo e download com SHA-256 idêntico; erros e paginação simulados.
- XP: mesmas métricas de geometria/estilos em 360/768/1440 e mesmos hashes de
  dados/assets anteriores. Estúdio mantém estilo e retorno ao XP.
- Zero ocorrências da chave real do Drive nos bundles públicos. Credenciais
  não foram versionadas ou expostas nos testes.

O build mantém o aviso preexistente sobre metadataBase ausente, sem impedir a geração.

## Assets pendentes

Os cinco WAV reais ainda não foram fornecidos. Eventos estão implementados e a
interface permanece silenciosa. Nomes e inclusão documentados em
public/assets/win7/sounds/README.md. Para disponibilizar novos WAV, reiniciar dev
ou gerar novo build. Um desktop-logo.jpg visualmente diferente pode substituir
a cópia fornecida sem alterar o código. Ausências em ASSETS_NEEDED.md.
