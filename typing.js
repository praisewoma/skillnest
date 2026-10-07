/* ==========================================================================
   typing.js — the typing engine used by
               • typing-test.html      (60 second test)
               • typing-practice.html  (free practice, 3 difficulty levels)
   --------------------------------------------------------------------------
   How it works:
   1. A paragraph is split into words, and every word into single-character
      <span> elements, so each character can be coloured correct / wrong.
   2. The user types in a real <textarea> (works with mobile keyboards).
   3. On every input we compare what was typed with the target text.
   4. Results:
        WPM       = (characters typed / 5) / minutes
        Accuracy  = (correct characters / characters typed) x 100
   Nothing is uploaded, saved or sent anywhere.
   ========================================================================== */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------------
     PARAGRAPHS — all written for this project (no copyrighted text).
     ------------------------------------------------------------------ */
  var PARAGRAPHS = {
    test: [
      "Practice does not make perfect; practice makes progress. Every short session at the keyboard teaches your fingers something new, and small improvements add up faster than you might expect.",
      "Good typing is calm typing. Keep your wrists relaxed, sit upright, and let your eyes stay on the screen instead of your hands. Speed grows naturally once accuracy feels easy.",
      "Learning a language is a little like building a path through a forest. The first walk is slow and uncertain, but each trip makes the route clearer until the way feels obvious.",
      "Clear writing starts with clear thinking. Before you write a long sentence, decide what you want the reader to understand, then choose the simplest words that carry that meaning.",
      "A steady routine beats a long session you never repeat. Fifteen focused minutes every day will move you further than two hours once a month, because memory likes regular visits.",
      "Mistakes are useful information. When a sentence feels wrong, look at the rule behind it, write three more examples of your own, and test yourself again tomorrow morning.",
      "Reading widely is quiet training for writing. Stories, articles and instructions all show you how sentences are built, which words travel together, and where commas help a reader breathe.",
      "Typing well is mostly about rhythm. Let your hands move in small, even bursts, return to the home row after each key, and keep your shoulders loose while the clock runs."
    ],
    easy: [
      "The sun is up and the birds are singing. I make a cup of tea, open my book, and read a few quiet pages before the day begins.",
      "My friend and I walk to the park after school. We sit on the green grass, share a small lunch, and talk about our plans for the weekend.",
      "A good habit is easy to start and easy to keep. I write three sentences every morning, and after a month the pages begin to add up.",
      "Please bring a pen, a notebook, and a kind smile. We will work together, help each other, and finish the task before the bell rings.",
      "Water the plants, feed the cat, and lock the door. Small jobs take a few minutes, but they keep the whole house running in good order."
    ],
    medium: [
      "Most people improve faster when they study in short, regular sessions. Twenty minutes a day, five days a week, will usually beat one long evening spent cramming before a test.",
      "Before you hand in an essay, read it aloud once. Your ear catches awkward phrases, missing words and repeated ideas that your eyes skim straight past on the screen.",
      "Vocabulary grows best in context. Instead of memorising long lists, meet new words inside sentences you care about, then use each one in a note of your own.",
      "Typing accuracy matters more than raw speed at first. When your hands stop hesitating, the words per minute climb on their own, and your wrists stay comfortable for longer.",
      "A planner can turn good intentions into real progress. Write the task, the time and the place, then keep the promise you made to yourself on that page."
    ],
    hard: [
      "Although the instructions seemed straightforward, the machine refused to cooperate; consequently, the engineer reviewed every connection, replaced two worn components, and documented the entire procedure.",
      "Successful learners aren't necessarily the quickest; they're simply the ones who notice their mistakes, analyse the underlying pattern, and patiently reconstruct the rule until it feels intuitive.",
      "Between the library's quiet corners and the cafe's persistent hum, she finally found the concentration she had been seeking, and the chapter that defeated her yesterday began to make sense.",
      "Grammar isn't a collection of arbitrary prohibitions; it's a set of agreements between writer and reader that keeps meaning unambiguous across sentences, paragraphs and entire documents.",
      "Measure your progress objectively: record the date, the passage, your accuracy and your speed, then compare this week's results with last month's before adjusting your practice routine."
    ]
  };

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function pickRandom(list, avoid) {
    if (!list || !list.length) return "";
    if (list.length === 1) return list[0];
    var choice = list[0];
    var guard = 0;
    do {
      choice = list[Math.floor(Math.random() * list.length)];
      guard++;
    } while (choice === avoid && guard < 12);
    return choice;
  }

  function formatClock(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    var m = Math.floor(totalSeconds / 60);
    var s = Math.floor(totalSeconds % 60);
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function round1(value) {
    return Math.round(value * 10) / 10;
  }

  function el(root, role) {
    return root.querySelector('[data-role="' + role + '"]');
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  /* ------------------------------------------------------------------
     The tool
     ------------------------------------------------------------------ */
  function create(config) {
    var root = typeof config.root === "string"
      ? document.getElementById(config.root)
      : config.root;
    if (!root) return null;

    var mode = config.mode === "practice" ? "practice" : "test";   // test = countdown
    var duration = config.seconds || 60;                            // seconds

    var passageEl = el(root, "passage");
    var inputEl = el(root, "input");
    var startBtn = el(root, "start");
    var resetBtn = el(root, "reset");
    var newBtn = el(root, "new");
    var statusEl = el(root, "status");
    var resultsEl = el(root, "results");
    // The attempts table may live inside the tool or further down the page.
    var historyEl = el(root, "history") || document.querySelector('[data-role="history"]');
    var difficultyEl = el(root, "difficulty");

    var statEls = {
      wpm: el(root, "stat-wpm"),
      accuracy: el(root, "stat-accuracy"),
      correct: el(root, "stat-correct"),
      incorrect: el(root, "stat-incorrect"),
      time: el(root, "stat-time")
    };

    var charEls = [];
    var history = [];   // attempts in this browser session only

    var state = {
      status: "idle",   // idle | running | finished
      text: "",
      startedAt: 0,
      elapsed: 0,
      ticker: null,
      reason: ""
    };

    /* ---------- rendering ---------- */
    function renderPassage(text) {
      passageEl.innerHTML = "";
      var words = text.split(" ");
      for (var w = 0; w < words.length; w++) {
        var wordEl = document.createElement("span");
        wordEl.className = "word";
        var chars = words[w] + (w < words.length - 1 ? " " : "");
        for (var c = 0; c < chars.length; c++) {
          var chEl = document.createElement("span");
          chEl.className = "ch" + (chars[c] === " " ? " ch--space" : "");
          chEl.textContent = chars[c];
          wordEl.appendChild(chEl);
        }
        passageEl.appendChild(wordEl);
      }
      charEls = passageEl.querySelectorAll(".ch");
    }

    function paintCharacters() {
      var typed = inputEl.value;
      var target = state.text;
      for (var i = 0; i < charEls.length; i++) {
        var node = charEls[i];
        node.classList.remove("ch--correct", "ch--wrong", "ch--current");
        if (i < typed.length) {
          node.classList.add(typed.charAt(i) === target.charAt(i) ? "ch--correct" : "ch--wrong");
        }
      }
      if (charEls[typed.length]) charEls[typed.length].classList.add("ch--current");
    }

    /* ---------- maths ---------- */
    function currentStats() {
      var typed = inputEl.value;
      var target = state.text;
      var correct = 0;
      var incorrect = 0;

      for (var i = 0; i < typed.length; i++) {
        if (typed.charAt(i) === target.charAt(i)) correct++;
        else incorrect++;
      }

      var seconds = state.elapsed / 1000;
      var minutes = seconds / 60;
      var wpm = minutes > 0 ? (typed.length / 5) / minutes : 0;
      var accuracy = typed.length > 0 ? (correct / typed.length) * 100 : 0;

      return {
        typed: typed.length,
        correct: correct,
        incorrect: incorrect,
        wpm: wpm,
        accuracy: accuracy,
        seconds: seconds
      };
    }

    function paintStats() {
      var s = currentStats();
      setText(statEls.wpm, s.typed ? Math.round(s.wpm) : "0");
      setText(statEls.accuracy, s.typed ? round1(s.accuracy) + "%" : "--");
      setText(statEls.correct, String(s.correct));
      setText(statEls.incorrect, String(s.incorrect));

      if (mode === "test") {
        var remaining = Math.max(0, duration - state.elapsed / 1000);
        setText(statEls.time, formatClock(remaining));
      } else {
        setText(statEls.time, formatClock(state.elapsed / 1000));
      }
    }

    /* ---------- history (this session only) ---------- */
    function paintHistory() {
      if (!historyEl) return;
      if (!history.length) {
        historyEl.innerHTML = '<p class="muted small">No attempts yet in this session.</p>';
        return;
      }
      var rows = "";
      for (var i = 0; i < history.length; i++) {
        var h = history[i];
        rows +=
          "<tr><td>" + (i + 1) + "</td>" +
          "<td>" + h.label + "</td>" +
          "<td>" + h.wpm + "</td>" +
          "<td>" + h.accuracy + "%</td>" +
          "<td>" + h.correct + " / " + h.incorrect + "</td>" +
          "<td>" + formatClock(h.seconds) + "</td></tr>";
      }
      historyEl.innerHTML =
        '<div class="table-wrap"><table class="data">' +
        "<caption>Attempts in this session (not saved anywhere — cleared when the page reloads).</caption>" +
        "<thead><tr><th>#</th><th>Text</th><th>WPM</th><th>Accuracy</th><th>Correct / Wrong</th><th>Time</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    /* ---------- results ---------- */
    function showResults() {
      var s = currentStats();
      var minutes = s.seconds / 60;
      var heading = mode === "test"
        ? (state.reason === "time" ? "Time is up" : "Passage complete")
        : "Passage complete";

      var summaryLine = "You typed " + s.typed + " characters in " +
        formatClock(s.seconds) + " (" + round1(minutes ? minutes : 0) + " min used).";

      resultsEl.innerHTML =
        '<div class="results-panel">' +
        '<div class="results-panel__head">' +
          '<div class="score-ring" style="--pct:' + Math.round(s.accuracy) + '%">' +
            '<span class="score-ring__inner">' + Math.round(s.wpm) + "</span>" +
          "</div>" +
          "<div>" +
            '<p class="result-level mt-0">' + heading + " — " + Math.round(s.wpm) + " WPM</p>" +
            '<p class="result-line">' + summaryLine + "</p>" +
            '<p class="result-line">Accuracy <strong>' + round1(s.accuracy) +
              "%</strong> · " + s.correct + " correct characters · " +
              s.incorrect + " incorrect.</p>" +
          "</div>" +
        "</div>" +
        '<div class="btn-row">' +
          '<button type="button" class="btn btn--primary" data-role="try-again">Try again</button>' +
          '<button type="button" class="btn btn--ghost" data-role="another">New paragraph</button>' +
        "</div>" +
        "</div>";

      resultsEl.hidden = false;
      resultsEl.setAttribute("role", "region");
      resultsEl.setAttribute("aria-label", "Typing test results");
      resultsEl.setAttribute("tabindex", "-1");
      resultsEl.focus();

      var tryAgain = resultsEl.querySelector('[data-role="try-again"]');
      var another = resultsEl.querySelector('[data-role="another"]');
      if (tryAgain) tryAgain.addEventListener("click", function () { reset(true); });
      if (another) another.addEventListener("click", function () { newPassage(); });

      history.push({
        label: (difficultyEl ? difficultyEl.value : mode === "test" ? "test" : "practice"),
        wpm: Math.round(s.wpm),
        accuracy: round1(s.accuracy),
        correct: s.correct,
        incorrect: s.incorrect,
        seconds: Math.round(s.seconds)
      });
      paintHistory();
    }

    /* ---------- state changes ---------- */
    function setStatus(text, kind) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.classList.remove("typing-status--live", "typing-status--done");
      if (kind) statusEl.classList.add("typing-status--" + kind);
    }

    function startTimer() {
      state.startedAt = Date.now();
      state.ticker = window.setInterval(function () {
        state.elapsed = Date.now() - state.startedAt;
        if (mode === "test" && state.elapsed >= duration * 1000) {
          state.elapsed = duration * 1000;
          finish("time");
          return;
        }
        paintStats();
      }, 100);
    }

    function start() {
      if (state.status === "running") return;
      state.status = "running";
      state.elapsed = 0;
      state.reason = "";
      inputEl.disabled = false;
      inputEl.value = "";
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
      paintCharacters();
      paintStats();
      setStatus("The clock starts on your first keystroke.", "live");
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = "Running…";
      }
      inputEl.focus();
    }

    function finish(reason) {
      if (state.status !== "running") return;
      state.status = "finished";
      state.reason = reason || "completed";
      if (state.ticker) {
        window.clearInterval(state.ticker);
        state.ticker = null;
      }
      if (mode === "test" && reason === "time") state.elapsed = duration * 1000;
      else state.elapsed = Date.now() - state.startedAt;

      inputEl.disabled = true;
      paintCharacters();
      paintStats();
      setStatus(
        reason === "time" ? "Finished — time is up." : "Finished — passage complete.",
        "done"
      );
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Start";
      }
      showResults();
    }

    function reset(keepText) {
      if (state.ticker) {
        window.clearInterval(state.ticker);
        state.ticker = null;
      }
      state.status = "idle";
      state.elapsed = 0;
      state.reason = "";
      if (!keepText) state.text = pickRandom(currentPool(), state.text);
      renderPassage(state.text);
      inputEl.value = "";
      inputEl.disabled = true;
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
      paintCharacters();
      paintStats();
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Start";
      }
      setStatus(mode === "test" ? "Press Start, then begin typing." : "Press Start, then begin typing.", "");
    }

    function newPassage() {
      // Pick a fresh passage and wait for Start/first keystroke before timing it.
      reset(false);
    }

    function currentPool() {
      var key = difficultyEl ? difficultyEl.value : (config.pool || "test");
      return PARAGRAPHS[key] || PARAGRAPHS.test;
    }

    /* ---------- events ---------- */
    inputEl.addEventListener("input", function () {
      if (state.status === "idle" && mode === "practice") {
        // Safety net: practice allows typing without pressing Start.
        state.status = "running";
        state.startedAt = Date.now();
        state.ticker = window.setInterval(function () {
          state.elapsed = Date.now() - state.startedAt;
          paintStats();
        }, 100);
      }
      if (state.status !== "running") return;
      if (!state.ticker) {
        startTimer();
        setStatus("Clock is running.", "live");
      }
      paintCharacters();
      paintStats();
      if (inputEl.value.length >= state.text.length) finish("completed");
    });

    // Typing tests are single paragraphs: Enter should not add a new line.
    inputEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter") event.preventDefault();
    });

    if (startBtn) startBtn.addEventListener("click", start);
    if (resetBtn) resetBtn.addEventListener("click", function () { reset(true); });
    if (newBtn) newBtn.addEventListener("click", newPassage);
    if (difficultyEl) {
      difficultyEl.addEventListener("change", function () { newPassage(); });
    }

    /* ---------- first paint ---------- */
    state.text = pickRandom(currentPool(), "");
    renderPassage(state.text);
    paintCharacters();
    paintStats();
    paintHistory();
    setStatus(mode === "test"
      ? "Press Start, then begin typing."
      : "Choose a level, press Start, then begin typing.", "");

    // Expose a tiny API in case other scripts want to control the tool.
    return { start: start, reset: reset, newPassage: newPassage };
  }

  global.SkillNestTyping = { create: create, paragraphs: PARAGRAPHS };
})(window);
