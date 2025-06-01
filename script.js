let words = JSON.parse(localStorage.getItem("words") || "[]");
let interval = 5000;
let timer;

const wordDisplay = document.getElementById("wordDisplay");
const wordList = document.getElementById("wordList");
const intervalSlider = document.getElementById("intervalSlider");
const intervalLabel = document.getElementById("intervalLabel");

function saveWords() {
  localStorage.setItem("words", JSON.stringify(words));
}

function getActiveWords() {
  return words.filter(w => w.active);
}

function resizeWordText() {
  const el = document.getElementById("wordDisplay");
  const wrapper = el.parentElement;

  // Setze initiale Größe zurück
  el.style.transform = "scale(1)";

  // Timeout stellt sicher, dass die Größe korrekt ist
  setTimeout(() => {
    const scale = Math.min(1, wrapper.clientWidth / el.scrollWidth);
    el.style.transform = `scale(${scale})`;
  }, 0);
}

function showRandomWord() {
  const active = getActiveWords();
  if (active.length === 0) {
    wordDisplay.innerText = "Keine aktiven Wörter";
    return;
  }
  const rand = active[Math.floor(Math.random() * active.length)];
  wordDisplay.innerText = rand.text;
  resizeWordText(); // << hier hinzufügen
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(showRandomWord, interval);
}

wordDisplay.addEventListener("click", () => {
  showRandomWord();
  resetTimer();
});

intervalSlider.addEventListener("input", () => {
  interval = intervalSlider.value * 1000;
  intervalLabel.innerText = `Intervall: ${intervalSlider.value} s`;
  resetTimer();
});

document.getElementById("settingsBtn").onclick = () => {
  document.getElementById("settings").classList.remove("hidden");
  document.body.classList.add("scroll-enabled");
  renderWordList();
};

document.getElementById("closeSettings").onclick = () => {
  document.getElementById("settings").classList.add("hidden");
  document.body.classList.remove("scroll-enabled");
};

document.getElementById("addWord").onclick = () => {
  const newWord = document.getElementById("newWord").value.trim();
  if (newWord) {
    words.push({ text: newWord, active: true });
    saveWords();
    renderWordList();
    document.getElementById("newWord").value = "";
  }
};

document.getElementById("activateAll").onclick = () => {
  words.forEach(w => w.active = true);
  saveWords();
  renderWordList();
};
document.getElementById("deactivateAll").onclick = () => {
  words.forEach(w => w.active = false);
  saveWords();
  renderWordList();
};

function renderWordList() {
  wordList.innerHTML = "";
  words.forEach((word, i) => {
    const li = document.createElement("li");
    li.textContent = word.text;
    li.className = word.active ? "" : "inactive";
    li.onclick = () => {
      word.active = !word.active;
      saveWords();
      renderWordList();
    };
    const del = document.createElement("button");
    del.innerText = "🗑️";
    del.onclick = (e) => {
      e.stopPropagation();
      words.splice(i, 1);
      saveWords();
      renderWordList();
    };
    li.appendChild(del);
    wordList.appendChild(li);
  });
}

showRandomWord();
resetTimer();
