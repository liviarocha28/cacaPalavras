const VALID_WORDS = [
  "AMIGO", "BANHO", "BARCO", "BOLSA", "BOMBA", "BRISA", "CAMPO", "CANTO",
  "CARRO", "CARTA", "CHAVE", "CHUVA", "CINTO", "CLIMA", "COBRA", "COPO",
  "CORAL", "CORPO",   "DENTE", "DOCES", "FAROL", "FATOS", "FESTA", "FILHO", "FLORA",
  "FOGOS", "FOLHA", "FORMA", "FRUTA", "GATOS", "GELAR", "GENTE",
  "GIRAS", "GRAMA", "GRUPO", "JANTA", "JOGAR", "JOVEM", "LADOS", "LEITE",
  "LIVRO", "LOUCO", "LUGAR", "MAGIA", "MANGA", "MENOS", "MISTO",
  "METRO", "MILHO", "MUNDO", "NINHO", "NOITE", "NUVEM", "OLHAR", "ONTEM",
  "ORDEM", "PADRE", "PAPEL", "PARTE", "PASTA", "PEDRA", "PEIXE", "PERNA",
  "PIANO", "PILHA", "PINTA", "PODER", "PONTO", "PORTA", "PRATO", "PRAZO",
  "QUASE", "QUILO", "RAIVA", "RAMOS", "RAPAZ", "RISCO", "RITMO", "ROUPA",
  "SABOR", "SALAS", "SALTO", "SANTO", "SELVA", "SENHA", "SINAL", "SORTE",
  "SONHO", "SUAVE", "TARDE", "TEMPO", "TERRA", "TIGRE", "TINHA", "TOQUE",
  "TORRE", "TRATO", "TREVO", "TROCA", "VALOR", "VAPOR", "VASTO", "VELHO",
  "VENTO", "VERDE", "VIDRO", "VIRAR", "VISTA", "VITAL", "VULTO", "ZEBRA"
];
const ANSWERS = [
  "BOATO", "FALSO", "FRASE", "FORUM", "GRUPO", "HATER",
  "HUMOR", "LIVES", "MEMES", "MODAS", "PIADA", "PRINT",
  "POSTS", "REELS", "RISOS", "SURTO", "TREND", "TRETA",
  "TROLL", "TROTE", "TWEET", "VIRAL", "VLOGS"
];

const EXTRA_GUESSES = new Set(`ACENO ANEXO AROMA ASTRO AVISO BAIXA BAIXO BATOM BEIJO BICHO BORDA
  BRAVO BREJO CAIXA CALMA CALMO CANAL CAPAZ CAPUZ CASAL CASAS CENAS CERCA CERTO CESTA
  CICLO CINZA COALA COISA COLAR CONTA CORAR CORTE COURO CRAVO CREME CRISE CUECA CURSO
  DADOS DEUSA DIETA DISCO DITAR DOBRA DONOS DRAMA DUNAS DUPLA DURAR ELITE ENFIM ERROS
  EXAME FALAR FALHA FALSO FALTA FALTO FAVOR FEIRA FELIZ FERRO FIGOS FITAS FOICE FONES
  FORTE FOSSA FOTOS FRACO FREIO FUGIR FUNDO GADOS GANHO GARFO GARRA GASTO GERAL GOLPE
  GRAVE HASTE HOTEL IDEAL IMITA INOVA JOGOS JUNTO JUSTO LACRE LARGO LATIM LATAS LAZER
  LEGAL LERDO LEVAR LIGAR LIMPO LINDA LINHA LENTO LONAS LOTES LUCRO LUZES MACIO MADRE
  MAIOR MALHA MANTO MARCA MARTE MASSA MEIAS MEXER MEXEU MESES METAL MITOS MODAS MODOS
  MORAL MORRO MUDAR MUITO MURAL NARIZ NASCE NATAL NOBRE NORMA NOTAS OCUPA OLHOS ONDAS
  ORCAS OSSOS OUVIR PAGAR PALCO PANDA PARAR PARES PASSA PASSE PASTO PATAS PAVOR PEITO
  PERTO PESCO PISTA PLANO PLACA PLENO PLUMA POEMA POETA POLVO POMAR PORCA POSSE POSTE
  PRETO PROSA PULSO QUEDA QUERO QUOTA REAIS REGRA REINO RETAS ROLHA RONDA ROSAS ROSTO
  ROTAS SABER SABIA SACOS SALSA SALVE SAMBA SERRA SERVO SETOR SOGRO SOMAR SONAR SORRI
  SUBIR SUCOS SUJAR TACOS TALCO TALHA TANTO TAPAR TAPAS TAXAS TECLA TEMAS TERMO TINTA
  TIRAR TOCAR TOLDO TOMAR TONEL TORCE TORNA TORNO TOTEM TRAMA TRENA TROCO TUMOR UNIDO
  USADO VACAS VARAL VEIAS VELAS VERBA VERSO VETOR VIGOR VOTOS ZANGA ZONAS`.trim().split(/\s+/));
const VALID_GUESSES = new Set([...ANSWERS, ...VALID_WORDS, ...EXTRA_GUESSES]);
const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const board = document.querySelector("#board");
const keyboard = document.querySelector("#keyboard");
const message = document.querySelector("#message");
const todayLabel = document.querySelector("#today-label");
const dailyDate = document.querySelector("#daily-date");
const attemptCount = document.querySelector("#attempt-count");
const attemptProgress = document.querySelector("#attempt-progress");
const progressFill = document.querySelector("#progress-fill");
const streakCount = document.querySelector("#streak-count");
const streakLabel = document.querySelector("#streak-label");
const statsDialog = document.querySelector("#stats-dialog");
const helpButton = document.querySelector("#help-button");
const statsButton = document.querySelector("#stats-button");
const contrastButton = document.querySelector("#contrast-button");
const resultActions = document.querySelector("#result-actions");
const copyResultButton = document.querySelector("#copy-result-button");
const shareResultButton = document.querySelector("#share-result-button");
const startGameButton = document.querySelector("#start-game-button");
const gamePlay = document.querySelector("#game-play");
const backToHomeButton = document.querySelector("#back-to-home-button");
const today = new Date();
const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const storageKey = `palavra-do-dia:v1:game:${dayKey}`;
const historyStorageKey = "palavra-do-dia:v1:history";
const preferencesStorageKey = "palavra-do-dia:v1:preferences";
const answer = ANSWERS[dayIndex(today)];

let guesses = [];
let currentGuess = "";
let finished = false;
let outcome = null;
let history = {};
let hasStarted = false;

function dayIndex(date) {
  const currentDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const firstDay = Date.UTC(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((currentDay - firstDay) / 86400000);
  return (dayOfYear + date.getFullYear() * 17) % ANSWERS.length;
}

function renderDate() {
  const dateText = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(today);
  todayLabel.append(document.createTextNode(` · ${dateText}`));
  dailyDate.textContent = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(today).replace(".", "").toUpperCase();
}

function renderBoard() {
  board.replaceChildren();

  for (let rowIndex = 0; rowIndex < MAX_GUESSES; rowIndex += 1) {
    const row = document.createElement("div");
    row.className = "board-row";
    row.setAttribute("role", "group");
    row.setAttribute("aria-label", `Tentativa ${rowIndex + 1}`);
    const guess = guesses[rowIndex] || (rowIndex === guesses.length && !finished ? currentGuess : "");
    const statuses = guesses[rowIndex] ? getStatuses(guess) : [];

    for (let columnIndex = 0; columnIndex < WORD_LENGTH; columnIndex += 1) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = guess[columnIndex] || "";
      const statusLabel = {
        correct: "letra certa no lugar certo",
        present: "letra presente em outro lugar",
        absent: "letra ausente"
      }[statuses[columnIndex]];
      tile.setAttribute("aria-label", tile.textContent
        ? `${tile.textContent}${statusLabel ? `, ${statusLabel}` : ""}`
        : "vazio");
      if (tile.textContent) tile.classList.add("filled");
      if (statuses[columnIndex]) {
        tile.classList.add(statuses[columnIndex]);
        tile.classList.add("reveal");
      }
      row.append(tile);
    }
    board.append(row);
  }
}

function renderKeyboard() {
  keyboard.replaceChildren();
  const letterStatuses = {};

  guesses.forEach((guess) => {
    [...guess].forEach((letter, index) => {
      const status = getStatuses(guess)[index];
      const priority = { absent: 1, present: 2, correct: 3 };
      if (!letterStatuses[letter] || priority[status] > priority[letterStatuses[letter]]) {
        letterStatuses[letter] = status;
      }
    });
  });

  KEY_ROWS.forEach((letters, rowIndex) => {
    const row = document.createElement("div");
    row.className = "key-row";
    if (rowIndex === 2) {
      row.append(createKey("ENVIAR", "wide", () => submitKey("ENTER")));
    }
    [...letters].forEach((letter) => {
      row.append(createKey(letter, letterStatuses[letter] || "", () => submitKey(letter)));
    });
    if (rowIndex === 2) {
      row.append(createKey("⌫", "wide", () => submitKey("BACKSPACE")));
    }
    keyboard.append(row);
  });
}

function createKey(label, extraClass, onClick) {
  const key = document.createElement("button");
  key.type = "button";
  const statusClass = { correct: "used-green", present: "used-yellow", absent: "used-gray" }[extraClass];
  key.className = `key ${statusClass || extraClass}`;
  key.textContent = label;
  key.setAttribute("aria-label", label === "⌫" ? "Apagar última letra" : label === "ENVIAR" ? "Enviar tentativa" : label);
  key.disabled = finished;
  key.addEventListener("click", onClick);
  return key;
}

function getStatuses(guess) {
  const result = Array(WORD_LENGTH).fill("absent");
  const remaining = {};

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "correct";
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (result[index] === "correct") continue;
    if (remaining[guess[index]] > 0) {
      result[index] = "present";
      remaining[guess[index]] -= 1;
    }
  }
  return result;
}

function describeFeedback(guess) {
  const descriptions = {
    correct: "no lugar certo",
    present: "na palavra, em outro lugar",
    absent: "não está na palavra"
  };
  const statuses = getStatuses(guess);
  return [...guess]
    .map((letter, index) => `${letter}: ${descriptions[statuses[index]]}`)
    .join("; ");
}

function showMessage(text) {
  message.textContent = text;
}

function formatDayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getCurrentStreak() {
  let cursor = new Date(today);
  const todayResult = history[dayKey];
  if (todayResult && todayResult.outcome !== "won") return 0;
  if (!todayResult) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const key = formatDayKey(cursor);
    if (!history[key] || history[key].outcome !== "won") return streak;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
}

function getBestStreak() {
  const winningDays = Object.entries(history)
    .filter(([, result]) => result.outcome === "won")
    .map(([key]) => key)
    .sort();
  let best = 0;
  let current = 0;
  let previousDate = null;

  winningDays.forEach((key) => {
    const date = new Date(`${key}T00:00:00`);
    if (previousDate) {
      const expected = new Date(previousDate);
      expected.setDate(expected.getDate() + 1);
      current = date.getTime() === expected.getTime() ? current + 1 : 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    previousDate = date;
  });
  return best;
}

function updateSummary() {
  const results = Object.values(history);
  const played = results.length;
  const wins = results.filter((result) => result.outcome === "won").length;
  const streak = getCurrentStreak();
  const attempts = guesses.length;
  const bestStreak = getBestStreak();
  const lastSolved = Object.entries(history)
    .filter(([, result]) => result.outcome === "won")
    .sort(([firstDay], [secondDay]) => secondDay.localeCompare(firstDay))[0];

  attemptCount.textContent = `${attempts} de ${MAX_GUESSES}`;
  attemptProgress.setAttribute("aria-valuenow", String(attempts));
  attemptProgress.setAttribute("aria-valuetext", `${attempts} de ${MAX_GUESSES} tentativas usadas`);
  progressFill.style.width = `${(attempts / MAX_GUESSES) * 100}%`;
  streakCount.textContent = `${streak} ${streak === 1 ? "dia" : "dias"}`;
  streakLabel.textContent = streak ? "de sequência — continue!" : "de sequência";
  document.querySelector("#games-played").textContent = String(played);
  document.querySelector("#games-won").textContent = String(wins);
  document.querySelector("#stats-streak").textContent = `${streak} ${streak === 1 ? "dia" : "dias"}`;
  document.querySelector("#win-rate").textContent = `${played ? Math.round((wins / played) * 100) : 0}%`;
  document.querySelector("#best-streak").textContent = `${bestStreak} ${bestStreak === 1 ? "dia" : "dias"}`;
  document.querySelector("#last-solved").textContent = lastSolved
    ? `${lastSolved[1].answer || "Palavra concluída"} · ${new Intl.DateTimeFormat("pt-BR").format(new Date(`${lastSolved[0]}T00:00:00`))}`
    : "Ainda não há palavras resolvidas.";
}

function updateResultActions() {
  resultActions.hidden = !finished;
}

function createShareText() {
  const result = outcome === "won" ? `${guesses.length}/6` : "X/6";
  const grid = guesses.map((guess) => getStatuses(guess)
    .map((status) => ({ correct: "🟩", present: "🟨", absent: "⬜" })[status])
    .join(""));
  return [`Palavra do Dia · Memes absurdos`, result, "", ...grid].join("\n");
}

async function copyResult() {
  const text = createShareText();
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      showMessage("Resultado copiado sem revelar a palavra.");
      return;
    } catch (error) {
      console.error("A API de área de transferência falhou; tentando a cópia compatível.", error);
    }
  }

  if (typeof document.execCommand !== "function") {
    showMessage("Não foi possível copiar neste navegador. Tente compartilhar o resultado.");
    return;
  }
  const activeElement = document.activeElement;
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  try {
    if (!document.execCommand("copy")) {
      showMessage("Não foi possível copiar neste navegador. Tente compartilhar o resultado.");
      return;
    }
    showMessage("Resultado copiado sem revelar a palavra.");
  } catch (error) {
    console.error("Não foi possível copiar o resultado.", error);
    showMessage("Não foi possível copiar o resultado. Verifique a permissão de área de transferência.");
  } finally {
    textArea.remove();
    if (activeElement instanceof HTMLElement) activeElement.focus();
  }
}

async function shareResult() {
  if (typeof navigator.share !== "function") {
    await copyResult();
    return;
  }
  try {
    await navigator.share({ title: "Palavra do Dia", text: createShareText() });
    showMessage("Resultado compartilhado sem revelar a palavra.");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Não foi possível compartilhar o resultado.", error);
      showMessage("Não foi possível compartilhar o resultado neste momento.");
    }
  }
}

function shakeBoard() {
  board.classList.remove("shake");
  void board.offsetWidth;
  board.classList.add("shake");
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ guesses, finished, outcome }));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar o progresso do jogo.", error);
    return false;
  }
}

function saveHistory() {
  try {
    history[dayKey] = { outcome, guessCount: guesses.length, answer };
    localStorage.setItem(historyStorageKey, JSON.stringify(history));
  } catch (error) {
    console.error("Não foi possível salvar as estatísticas do jogo.", error);
    updateSummary();
    return false;
  }
  updateSummary();
  return true;
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(historyStorageKey) || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;
    history = Object.fromEntries(Object.entries(saved).filter(([key, result]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(key) &&
      result &&
      (result.outcome === "won" || result.outcome === "lost") &&
      Number.isInteger(result.guessCount) &&
      result.guessCount >= 1 &&
      result.guessCount <= MAX_GUESSES &&
      (result.answer === undefined || (typeof result.answer === "string" && /^[A-Z]{5}$/.test(result.answer)))
    ));
  } catch (error) {
    console.error("Não foi possível recuperar as estatísticas do jogo.", error);
    showMessage("Não foi possível recuperar as estatísticas salvas.");
  }
}

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferencesStorageKey) || "{}");
    const highContrast = saved && saved.highContrast === true;
    document.body.classList.toggle("high-contrast", highContrast);
    contrastButton.setAttribute("aria-pressed", String(highContrast));
    contrastButton.setAttribute("aria-label", highContrast ? "Desativar alto contraste" : "Ativar alto contraste");
  } catch (error) {
    console.error("Não foi possível recuperar as preferências de acessibilidade.", error);
    showMessage("Não foi possível recuperar suas preferências salvas.");
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved || !Array.isArray(saved.guesses)) return;
    const validGuesses = saved.guesses.every((guess) =>
      typeof guess === "string" && /^[A-Z]{5}$/.test(guess) && VALID_GUESSES.has(guess)
    );
    if (!validGuesses || saved.guesses.length > MAX_GUESSES || new Set(saved.guesses).size !== saved.guesses.length) return;
    const answerIndex = saved.guesses.indexOf(answer);
    if (answerIndex !== -1 && answerIndex !== saved.guesses.length - 1) return;
    if (saved.finished === true && answerIndex === -1 && saved.guesses.length !== MAX_GUESSES) return;
    guesses = saved.guesses;
    outcome = answerIndex !== -1 ? "won" : guesses.length === MAX_GUESSES ? "lost" : null;
    finished = outcome !== null;
    if (finished && !history[dayKey]) {
      history[dayKey] = { outcome, guessCount: guesses.length, answer };
    }
    if (finished) {
      showMessage(outcome === "won" ? "Você já acertou a palavra de hoje! Até amanhã ☀" : `O desafio acabou. A palavra era ${answer}.`);
    }
  } catch (error) {
    console.error("Não foi possível recuperar o progresso do jogo.", error);
    showMessage("Não foi possível recuperar seu progresso salvo.");
  }
  updateSummary();
}

function submitKey(key) {
  if (!hasStarted || finished) return;

  if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    renderBoard();
    return;
  }

  if (key === "ENTER") {
    if (currentGuess.length !== WORD_LENGTH) {
      showMessage("Sua palavra precisa ter cinco letras.");
      shakeBoard();
      return;
    }
    if (!VALID_GUESSES.has(currentGuess)) {
      showMessage("Essa palavra não está no vocabulário do jogo.");
      shakeBoard();
      return;
    }
    if (guesses.includes(currentGuess)) {
      showMessage("Você já tentou essa palavra. Escolha outra.");
      shakeBoard();
      return;
    }
    guesses.push(currentGuess);
    const correct = currentGuess === answer;
    currentGuess = "";
    outcome = correct ? "won" : guesses.length === MAX_GUESSES ? "lost" : null;
    finished = outcome !== null;
    renderBoard();
    renderKeyboard();
    updateResultActions();
    const progressSaved = saveProgress();
    const historySaved = finished ? saveHistory() : true;
    updateSummary();
    if (correct) {
      showMessage("Você acertou! Volte amanhã para um novo desafio 🎉");
    } else if (finished) {
      showMessage(`O desafio acabou. A palavra era ${answer}.`);
    } else {
      showMessage(`${MAX_GUESSES - guesses.length} tentativas restantes. ${describeFeedback(guesses[guesses.length - 1])}`);
    }
    if (!progressSaved || !historySaved) {
      showMessage(`${message.textContent} Seu progresso ou suas estatísticas não puderam ser salvos neste navegador.`);
    }
    return;
  }

  if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
    currentGuess += key;
    showMessage("");
    renderBoard();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target;
  const targetElement = target instanceof Element ? target : null;
  const virtualKeyboardFocused = Boolean(targetElement?.closest("#keyboard"));
  const statsButtonFocused = target === statsButton;

  if (/^[a-zA-Z]$/.test(event.key) && !event.repeat && hasStarted && !finished) {
    const inDialog = Boolean(targetElement?.closest("dialog"));
    const editableTarget = targetElement?.closest("input, textarea, [contenteditable='true']");
    const otherControl = targetElement?.closest("button, a");
    if (!inDialog && !editableTarget && (!otherControl || virtualKeyboardFocused || statsButtonFocused)) {
      event.preventDefault();
      submitKey(event.key.toUpperCase());
    }
    return;
  }

  if (event.key === "Backspace" && hasStarted && (virtualKeyboardFocused || statsButtonFocused || !targetElement?.closest("button, a, dialog"))) {
    event.preventDefault();
    submitKey("BACKSPACE");
    return;
  }

  if (targetElement?.closest("button, a, dialog")) return;
  if (event.key === "Enter") {
    event.preventDefault();
    submitKey("ENTER");
  } else if (event.key === "Backspace") {
    event.preventDefault();
    submitKey("BACKSPACE");
  }
});

helpButton.addEventListener("click", () => {
  document.querySelector("#how-title").focus();
});

statsButton.addEventListener("click", () => {
  updateSummary();
  statsDialog.showModal();
});

statsDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  statsDialog.close();
  statsButton.focus();
});

statsDialog.addEventListener("close", () => {
  statsButton.focus();
});

contrastButton.addEventListener("click", () => {
  const highContrast = !document.body.classList.contains("high-contrast");
  document.body.classList.toggle("high-contrast", highContrast);
  contrastButton.setAttribute("aria-pressed", String(highContrast));
  contrastButton.setAttribute("aria-label", highContrast ? "Desativar alto contraste" : "Ativar alto contraste");
  try {
    localStorage.setItem(preferencesStorageKey, JSON.stringify({ highContrast }));
  } catch (error) {
    console.error("Não foi possível salvar a preferência de contraste.", error);
    showMessage("O contraste foi alterado, mas a preferência não pôde ser salva.");
  }
});

startGameButton.addEventListener("click", () => {
  hasStarted = true;
  startGameButton.hidden = true;
  gamePlay.hidden = false;
  board.focus();
});

backToHomeButton.addEventListener("click", () => {
  hasStarted = false;
  gamePlay.hidden = true;
  startGameButton.hidden = false;
  startGameButton.focus();
});

copyResultButton.addEventListener("click", copyResult);
shareResultButton.addEventListener("click", shareResult);

renderDate();
loadHistory();
loadPreferences();
loadProgress();
hasStarted = guesses.length > 0 || finished;
startGameButton.hidden = hasStarted;
gamePlay.hidden = !hasStarted;
renderBoard();
renderKeyboard();
updateResultActions();
updateSummary();
