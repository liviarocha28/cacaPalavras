# Projeto técnico — Palavra do Dia

**Data:** 2026-10-14
**Documento relacionado:** [PRD — Palavra do Dia](./2026-10-14-palavra-do-dia.md)
**Design de referência:** [Protótipo UX — Jogo sem atrito](../../prototype-ux.html)

## 1. Objetivo e limites

Este documento descreve a implementação do MVP de jogo diário de palavras em português. O projeto permanece uma aplicação estática: HTML estrutura a interface, CSS entrega o layout e JavaScript implementa estado, avaliação e persistência. Não há framework, serviço remoto, conta ou etapa de compilação.

## 2. Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Tela funcional, landmarks, tabuleiro/teclado como pontos de montagem, tema, resumo, compartilhamento, instruções e diálogo de estatísticas. |
| `styles.css` | Tokens visuais, layout desktop/mobile, estados de jogo, foco, tema de contraste e movimento reduzido. |
| `game.js` | Vocabulário, seleção diária, máquina de estados, teclado, regras de feedback, armazenamento e estatísticas. |
| `prototype-ux.html` | Referência estática da direção UX escolhida. |
| `prototype-accessibility.html`, `prototype-visual.html` | Alternativas de design preservadas para comparação. |
| `prototipos.html` | Galeria de apresentação das três alternativas. |
| `docs/plans/2026-10-14-palavra-do-dia.md` | Requisitos e critérios de aceitação do MVP. |
| `docs/plans/2026-10-14-projeto-tecnico-palavra-do-dia.md` | Este documento. |

## 3. Arquitetura e fluxo de inicialização

1. `index.html` carrega `styles.css` e `game.js` com `defer`.
2. `game.js` cria uma data local (`YYYY-MM-DD`), calcula a resposta diária por uma função determinística e deriva a chave de persistência daquele dia.
3. O histórico local, preferências e estado da partida são lidos e validados.
4. A tela inicial apresenta data e tema; o botão de início libera tabuleiro e teclado, exceto quando uma partida salva precisa ser restaurada.
5. Renderizadores puros quanto possível atualizam data, resumo, grelha e teclado a partir do estado em memória.
6. Eventos do teclado físico, botões do teclado virtual e controles do cabeçalho despacham ações para as mesmas funções de estado.
7. Cada palpite válido é avaliado; estado e progresso são renderizados; partidas concluídas atualizam o histórico.

Não existe API, camada de servidor nem importação de dados em runtime. A palavra secreta é conteúdo de cliente e, portanto, não é protegida contra inspeção do código-fonte.

## 4. Modelo de estado

Estado de jogo em memória:

```text
GameState {
  dayKey: string
  answer: string
  guesses: string[]
  currentGuess: string
  finished: boolean
  outcome: "won" | "lost" | null
  hasStarted: boolean
  statusMessage: string
}
```

Constantes do MVP: `WORD_LENGTH = 5`, `MAX_GUESSES = 6`. `ANSWERS` contém respostas temáticas de “Memes absurdos”; `VALID_WORDS` e `EXTRA_GUESSES` compõem o vocabulário permitido; `VALID_GUESSES` é a união dessas listas.

### Seleção da resposta

Derivar dia-do-ano com componentes da data e `Date.UTC` para evitar duração de dias afetada por horário de verão. Calcular um índice estável com ano + dia-do-ano módulo o tamanho de `ANSWERS`. Alterar a ordem/tamanho da lista muda desafios futuros e pode alterar o histórico, por isso a lista é parte do contrato de conteúdo.

O produto considera data local, não UTC global; pessoas em fusos diferentes podem receber dias diferentes perto da meia-noite. Para consistência editorial global, seria necessário definir UTC e servir uma lista de calendário.

## 5. Regras de avaliação

1. Inicializar todas as posições como ausentes.
2. Em uma primeira passagem, marcar coincidências exatas e contar somente letras restantes da resposta.
3. Em uma segunda passagem, para cada letra ainda não correta, marcar presente somente se houver ocorrência restante; consumir uma ocorrência ao marcar.
4. Atualizar estado da tecla sem rebaixar uma pista já mais forte (`correct > present > absent`).

Essa ordem é importante para palavras com duplicatas e evita marcar letras excedentes como existentes.

## 6. Máquina de estados e ações

- **Em andamento:** aceitar A–Z até completar cinco letras.
- **Apagar:** remover a última letra do palpite atual.
- **Enviar incompleto:** anunciar “Sua palavra precisa ter cinco letras”; não altera palpites.
- **Enviar desconhecido:** anunciar que a palavra não está no vocabulário; não altera palpites.
- **Enviar repetido:** informar que o palpite já foi usado e não consumir tentativa.
- **Voltar ao início:** alternar para a tela inicial sem descartar o progresso em memória ou no armazenamento local.
- **Palpite aceito:** anexar, avaliar e atualizar a UI.
- **Vitória:** definir resultado, registrar a partida e bloquear novas entradas.
- **Sexto palpite incorreto:** definir derrota, revelar resposta, registrar a partida e bloquear entradas.
- **Partida restaurada:** reconstruir estado a partir do registro local validado para a mesma data.
- **Copiar resultado:** preferir a Clipboard API e usar uma alternativa para navegadores que abrem o HTML diretamente como arquivo local.

## 7. Persistência local

Chaves versionadas para evitar colisões:

```text
palavra-do-dia:v1:game:YYYY-MM-DD -> { guesses: string[], finished: boolean, outcome: "won" | "lost" | null }
palavra-do-dia:v1:history -> { "YYYY-MM-DD": { outcome: "won" | "lost", guessCount: number, answer?: string } }
palavra-do-dia:v1:preferences -> { highContrast: boolean }
```

O carregamento valida objeto, tipos, tamanho máximo, formato dos palpites e pertença ao vocabulário antes de aceitar os dados. Histórico é limitado/limpo em memória para evitar objeto malformado, mas sem serviço de sincronização. `localStorage` é acessível somente pela origem do navegador; limpeza do navegador remove os dados.

Erros de leitura/escrita são registrados no console com contexto e apresentados como mensagem; não devem ser transformados silenciosamente em uma gravação bem-sucedida. A jogabilidade em memória ainda funciona sem armazenamento.

### Estatísticas

Contabilizar apenas partidas concluídas. A sequência considera dias locais consecutivos com vitória; uma derrota no dia atual ou um dia ausente interrompe a sequência atual. A UI informa jogos concluídos, vitórias, taxa de acerto, sequência atual, melhor sequência e última palavra resolvida. O comportamento é local ao dispositivo e não representa conta/sincronização.

## 8. Interface e design system

Implementar a direção “Jogo sem atrito” do protótipo:

- faixa superior com marca e controles de ajuda/estatísticas/contraste;
- conteúdo principal de duas colunas em desktop: jogo à esquerda, resumo e ajuda à direita;
- em mobile, empilhar o jogo e os cartões de apoio;
- papel quente claro com acentos verde, amarelo e coral; tipografia de sistema;
- tabuleiro com seis linhas e cinco colunas, alinhado ao centro do painel;
- tema do desafio e ações de copiar/compartilhar visíveis após concluir a partida;
- cartão diário com data, tentativas usadas e streak derivado do estado real;
- cartão de instruções/legenda com texto visível junto aos exemplos de cor.

Nenhum valor ilustrativo estático do mockup (por exemplo, placar ou streak) pode aparecer como dado real. Controles visuais precisam funcionar: ajuda leva ao guia, estatísticas abre `<dialog>` acessível, contraste alterna classe/atributo no documento e persiste a escolha.

O compartilhamento contém somente quantidade de tentativas e padrões de pistas, sem letras nem resposta.
O teclado físico aceita letras durante a partida mesmo com foco em uma tecla virtual; Enter e Backspace mantêm o comportamento esperado sem acionar controles de cabeçalho por engano.

## 9. Acessibilidade

- `lang="pt-BR"`, landmarks, títulos hierárquicos e botões nativos com nome acessível.
- Tabuleiro em grupos/linhas identificáveis; cada letra submetida expõe letra e resultado por texto no nome acessível.
- Feedback de validação/resultado em região `role="status"`/`aria-live="polite"`.
- Não usar apenas cor; legenda textual e rótulos de estado distinguem posição correta, letra presente e letra ausente.
- Estados de foco visíveis em todos os controles; ordem de tabulação natural.
- Dialog nativo com título, botão fechar, Escape e foco devolvido ao acionador.
- Tema de alto contraste deve reforçar bordas/contraste sem remover diferenças de estados.
- Respeitar `prefers-reduced-motion`; nenhuma pista necessária depende de animação.
- Validar manualmente teclado-only, zoom e leitor de tela além de verificações automatizadas.

## 10. Segurança, privacidade e confiabilidade

- Não coletar nem transmitir dados.
- Renderizar conteúdo controlado via `textContent`, evitando interpolar palpites em HTML.
- Persistência é dado não confiável: parse, validar e ignorar estrutura inválida com mensagem/log conforme o ponto de falha.
- Sem dependências ou scripts de terceiros.
- O algoritmo de resposta é client-side e não se destina a competição com resposta secreta.
- A lista de palavras é curada manualmente; revisão linguística é requisito editorial para lançamento, especialmente variantes, acentos, nomes próprios e palavras ofensivas.

## 11. Testes e validação

### Testes manuais mínimos

1. Carregar a página, usar teclado físico e virtual, apagar e submeter.
2. Enviar palpite com menos de cinco letras e palavra inexistente; confirmar que nenhuma tentativa foi consumida.
3. Conferir correspondência exata, deslocada e ausente, inclusive duplicatas.
4. Vencer, perder em seis tentativas, verificar bloqueio e revelação da resposta.
5. Recarregar durante e depois da partida; verificar restauração e estatísticas.
6. Alterar a data local ou injetar uma data em teste para confirmar determinismo e troca diária.
7. Usar controles por teclado, diálogo via Escape, tema de contraste, viewport de 320 px e configuração de movimento reduzido.
8. Bloquear `localStorage`/forçar exceção e verificar a mensagem sem crash.

### Verificações automatizadas

- `node --check game.js`
- `git diff --check`
- Teste de navegador/Playwright cobrindo vitória, derrota, entradas inválidas, letras repetidas, persistência e operações de cabeçalho.

Não há suíte de testes instalada atualmente. Se lógica pura for extraída em futuro módulo, priorizar testes unitários para seleção diária, feedback com duplicatas, sequência e validação de persistência.

## 12. Plano de implementação

1. Registrar o PRD e este desenho; criar instrução de localização dos PRDs em `AGENTS.md`.
2. Refatorar HTML/CSS da tela funcional para refletir o protótipo UX, mantendo IDs de integração necessários à lógica.
3. Adaptar a lógica de jogo para validação de dados, resumo real, estatísticas, ajuda, contraste e persistência versionada.
4. Validar os critérios do PRD em navegador real com diferentes larguras e estados de jogo.
5. Executar revisão de conformidade e revisão de código; incorporar achados relevantes e repetir validações direcionadas.
