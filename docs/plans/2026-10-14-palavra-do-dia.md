# PRD — Palavra do Dia

**Data:** 2026-10-14
**Status:** MVP implementado e alinhado ao escopo temático
**Plataforma:** Web responsiva, sem dependências externas

## Visão do produto

Um jogo casual em português no qual a pessoa descobre uma palavra diária de cinco letras em até seis tentativas. A interface escolhida é o protótipo de UX **“Jogo sem atrito”**: tabuleiro em primeiro plano, feedback imediato, resumo do desafio e explicação das pistas.

## Público e necessidade

Pessoas que querem uma atividade curta, fácil de entender e que funcione tanto com teclado físico quanto em tela sensível ao toque, sem criar conta ou instalar aplicativo.

## Objetivos

- Permitir começar a jogar sem cadastro, tutorial obrigatório ou configuração.
- Entregar um desafio compartilhado por data local do dispositivo.
- Tornar cada tentativa compreensível com pistas de posição e presença das letras.
- Preservar o progresso diário no mesmo navegador.
- Oferecer uma experiência responsiva, legível e operável por teclado.

## Pesquisa de referência

- O Wordle oficial apresenta o limite de seis tentativas e identifica o desafio por data [S1]. Para este jogo, isso reforça a exibição clara da data, do tema e das tentativas usadas.
- As WCAG 2.2 recomendam operação por teclado e exposição programática de mensagens de estado [S2, S3]. O jogo usa teclado físico e virtual e anuncia validação e resultado em uma região de status.
- Cor não deve ser o único meio de transmitir informação; contraste mínimo e tamanho de alvo também têm critérios próprios [S4–S6]. Por isso, as pistas incluem texto acessível, os controles têm foco visível e a interface é verificada em telas estreitas.
- Um estudo sobre sequências de comportamento e decisões de consumo encontrou efeitos em engajamento posterior, mas não estudou especificamente jogos ou adolescentes [S7]. Isso é tratado apenas como alerta: o streak é informativo, local e sem penalidade ou mensagem de culpa.

Referências consultadas em 21/10/2026:

- [S1] [The New York Times — Wordle](https://www.nytimes.com/games/wordle/index.html)
- [S2] [W3C WAI — WCAG 2.2: Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [S3] [W3C WAI — WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [S4] [W3C WAI — WCAG 2.2: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [S5] [W3C WAI — WCAG 2.2: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [S6] [W3C WAI — WCAG 2.2: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [S7] [Silverman & Barasch — On or Off Track: How (Broken) Streaks Affect Consumer Decisions](https://doi.org/10.1093/jcr/ucac029), *Journal of Consumer Research*, 2023. O estudo não é específico de jogos nem de adolescentes.

## Decisões de produto

- **Modo:** um desafio por dia, ilimitado para tentativas dentro da partida, mas limitado a seis palpites.
- **Palavra:** cinco letras, exibida em caixa alta; o tema inicial do MVP é “Memes absurdos” e a lista de respostas é curada para esse tema, sem acentos.
- **Tentativas:** devem ter cinco letras e constar no vocabulário local.
- **Feedback:** verde = letra na posição certa; amarelo = letra presente em outra posição; cinza = letra ausente. Letras repetidas são avaliadas respeitando a quantidade existente na resposta.
- **Entrada:** teclado físico e teclado virtual.
- **Persistência:** armazenamento local do navegador, sem conta, servidor, analytics ou transmissão dos palpites.
- **Dia do desafio:** data local do dispositivo.
- **Identidade visual:** direção UX escolhida, com fundo quente, cartões de resumo, tabuleiro central e layout de duas colunas em telas largas.
- **Escopo do MVP:** streak local, estatísticas, tema diário e compartilhamento do resultado sem revelar a resposta; sem leaderboard.

## Fluxos principais

1. A pessoa abre o jogo e entende a regra pela introdução e pela legenda.
2. Inicia o desafio pelo botão da tela inicial.
3. Digita cinco letras; pode remover letras antes de enviar.
4. Envia o palpite. Entradas inválidas recebem uma mensagem e não gastam tentativa.
5. Recebe feedback por letra, contagem de tentativas e o estado atualizado do teclado.
   Palpites válidos não podem ser repetidos na mesma partida.
6. Ao acertar ou esgotar seis tentativas, vê o resultado; a partida fica bloqueada até o próximo desafio.
   A pessoa pode copiar ou compartilhar uma grade de pistas sem letras nem solução.
   A ação “Voltar ao início” retorna à tela inicial sem apagar o progresso.
7. Ao recarregar no mesmo dia, a partida é restaurada. Ajuda, estatísticas e modo de contraste ficam disponíveis no cabeçalho.

## Requisitos funcionais

### RF-01 — Desafio diário

Gerar deterministicamente uma palavra a partir da data local e de uma lista finita versionada no código. No mesmo dia e ano, o desafio não muda ao recarregar a página ou mudar de navegador, desde que o dispositivo use a mesma data local e a mesma versão da lista.

### RF-02 — Tabuleiro e palpites

Mostrar seis linhas de cinco letras, permitir entrada por letras A–Z, apagar e enviar. Enter sem cinco letras e palavras fora do vocabulário devem explicar o problema e preservar o estado da partida.

### RF-03 — Avaliação

Marcar letras exatas primeiro e, em seguida, atribuir letras presentes usando apenas ocorrências ainda não consumidas da resposta. O teclado deve preservar o melhor estado conhecido de cada letra: correta > presente > ausente.

### RF-04 — Encerramento

Encerrar imediatamente ao acertar ou depois do sexto palpite, revelar a resposta quando houver derrota e impedir entradas adicionais nesse dia.

### RF-05 — Continuidade e estatísticas

Salvar os palpites e conclusão no navegador. Atualizar o histórico diário ao terminar uma partida; apresentar jogos concluídos, vitórias, taxa de acerto, sequência atual, melhor sequência e a última palavra resolvida.

### RF-06 — Navegação de apoio

O controle de ajuda leva à legenda/instruções; estatísticas abre uma janela sem sair da partida; o controle de contraste alterna um tema de contraste elevado e expõe seu estado.

### RF-07 — Tema diário

Exibir o tema junto ao desafio e selecionar a resposta diária da lista curada de “Memes absurdos” usando uma função determinística baseada na data local.

### RF-08 — Compartilhamento

Após concluir a partida, permitir copiar o resultado ou usar o compartilhamento nativo do dispositivo. O conteúdo compartilhado contém apenas tentativas, quantidade e padrão de pistas, sem a resposta.

### RF-09 — Palpites únicos

Não aceitar um palpite já enviado na partida; informar claramente e preservar o número de tentativas.

## Requisitos não funcionais

- Layout usável a partir de 320 px, com teclado e tabuleiro dentro da viewport sem rolagem horizontal.
- HTML semântico, foco de teclado visível e mensagens de jogo anunciadas com `aria-live`.
- Feedback não depende exclusivamente de cor: os rótulos acessíveis descrevem a condição de cada letra.
- Respeitar `prefers-reduced-motion`.
- Funcionar localmente a partir de `index.html`, sem build, dependências, conexão de rede ou fontes externas.
- Dados ficam somente no navegador. Se o armazenamento não estiver disponível, o jogo continua na sessão e comunica a limitação quando tenta salvar.

## Fora do escopo do MVP

Contas, sincronização entre dispositivos, backend, monetização, anúncios, arquivo de desafios, modo ilimitado, leaderboard, compartilhamento por serviço remoto, áudio e aplicativo nativo.

## Critérios de aceitação

- A tela apresenta seis tentativas e cinco casas por tentativa.
- A tela inicial informa o tema do dia e oferece um botão para iniciar o desafio.
- Durante a partida, a pessoa pode voltar à tela inicial sem perder o progresso.
- Tanto teclado físico como virtual permitem compor, remover e enviar um palpite.
- Comprimento inválido e palpite ausente do vocabulário não consomem tentativa.
- A avaliação de letras repetidas respeita sua quantidade na palavra secreta.
- Vitória e derrota encerram a partida; recarregar restaura o estado.
- Palpites já usados não consomem tentativa quando enviados novamente.
- O resultado compartilhado contém somente os padrões de pistas e não revela letras ou resposta.
- O tema aparece na interface e as respostas diárias pertencem à lista curada desse tema.
- Estatísticas exibem taxa de acerto, melhor sequência e última palavra resolvida.
- Uma data diferente gera outro índice diário, de forma determinística.
- Ajuda, estatísticas e alternância de contraste são operáveis por teclado.
- As três direções de protótipo permanecem consultáveis; a direção selecionada é a implementada no jogo principal.
