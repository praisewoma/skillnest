/* ==========================================================================
   quiz.js — the quiz engine used by
             • english-test.html      (level estimate)
             • vocabulary-test.html
             • grammar-test.html
   ...and by the same pages opened with ?mode=practice (practice mode: instant
   feedback after every answer, no level estimate).

   How scoring works:
     score    = number of questions where the chosen option is the correct one
     percent  = round(score / total questions x 100)
     level    = band the percentage falls into (English level test only)

   Every question is worth exactly one mark. There is no negative marking.
   ========================================================================== */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function formatClock(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = Math.floor(totalSeconds % 60);
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  var LETTERS = ["A", "B", "C", "D"];

  /* ------------------------------------------------------------------
     Level bands (used only when showLevel is true)
     ------------------------------------------------------------------ */
  function levelFor(percent) {
    if (percent <= 39) {
      return {
        name: "Beginner",
        note: "You are building the foundations. Revise basic tenses, articles and common verbs, then retake the test in a few weeks."
      };
    }
    if (percent <= 59) {
      return {
        name: "Elementary",
        note: "You can handle simple sentences and everyday topics. Focus on irregular verbs, prepositions and question forms."
      };
    }
    if (percent <= 74) {
      return {
        name: "Intermediate",
        note: "You communicate clearly in familiar situations. Work on verb tenses, word order and phrasal verbs."
      };
    }
    if (percent <= 89) {
      return {
        name: "Upper Intermediate",
        note: "You use English flexibly and accurately most of the time. Polish the details: articles, conditionals and linking words."
      };
    }
    return {
      name: "Advanced",
      note: "You handle complex grammar and varied vocabulary well. Keep reading widely to maintain and extend it."
    };
  }

  var LEVEL_SCALE = [
    { range: "0–39%", name: "Beginner" },
    { range: "40–59%", name: "Elementary" },
    { range: "60–74%", name: "Intermediate" },
    { range: "75–89%", name: "Upper Intermediate" },
    { range: "90–100%", name: "Advanced" }
  ];

  function scrollTo(node) {
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* ------------------------------------------------------------------
     The quiz
     ------------------------------------------------------------------ */
  function create(config) {
    var root = typeof config.root === "string"
      ? document.getElementById(config.root)
      : config.root;
    if (!root) return null;

    var source = config.questions || [];
    var mode = config.mode === "practice" ? "practice" : "test";
    var showLevel = !!config.showLevel;
    var shuffleQuestions = config.shuffle !== false;
    var shuffleOptions = config.shuffle !== false;

    var items = [];        // this attempt's questions (shuffled, options shuffled)
    var answers = [];      // chosen option index or null
    var revealed = [];     // practice mode: has feedback been shown?
    var current = 0;
    var startedAt = Date.now();
    var finished = false;
    var warning = "";      // e.g. "Questions 3 and 7 are unanswered."

    /* ---------- build the shell once ---------- */
    root.innerHTML =
      '<div class="quiz-card" data-role="card" tabindex="-1">' +
        '<div class="quiz-top">' +
          '<div class="quiz-progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="' + source.length + '" aria-valuenow="1" aria-valuetext="Question 1 of ' + source.length + '">' +
            '<div class="quiz-progress__bar" data-role="bar"></div>' +
          '</div>' +
          '<span class="quiz-counter" data-role="counter"></span>' +
          (mode === "practice"
            ? '<span class="badge">Practice mode</span>'
            : '<span class="badge badge--blue">Test mode</span>') +
        "</div>" +
        '<form data-role="form" novalidate>' +
          '<div data-role="warn"></div>' +
          '<fieldset class="quiz-question">' +
            '<legend class="quiz-q" data-role="question"></legend>' +
            '<div class="quiz-options" data-role="options"></div>' +
          "</fieldset>" +
          '<div data-role="feedback" aria-live="polite"></div>' +
          '<div class="quiz-actions">' +
            '<button type="button" class="btn btn--ghost" data-role="back">Back</button>' +
            '<span class="spacer"></span>' +
            '<button type="submit" class="btn btn--primary" data-role="next">Next</button>' +
          "</div>" +
          '<div class="quiz-dots" data-role="dots" role="group" aria-label="Jump to a question"></div>' +
        "</form>" +
      "</div>" +
      '<div class="mt-3" data-role="results" role="region" aria-label="Quiz results" tabindex="-1" hidden></div>';

    var cardEl = root.querySelector('[data-role="card"]');
    var formEl = root.querySelector('[data-role="form"]');
    var barEl = root.querySelector('[data-role="bar"]');
    var progressEl = root.querySelector('[role="progressbar"]');
    var counterEl = root.querySelector('[data-role="counter"]');
    var questionEl = root.querySelector('[data-role="question"]');
    var optionsEl = root.querySelector('[data-role="options"]');
    var feedbackEl = root.querySelector('[data-role="feedback"]');
    var backBtn = root.querySelector('[data-role="back"]');
    var nextBtn = root.querySelector('[data-role="next"]');
    var dotsEl = root.querySelector('[data-role="dots"]');
    var warnEl = root.querySelector('[data-role="warn"]');
    var resultsEl = root.querySelector('[data-role="results"]');

    /* ---------- prepare one attempt ---------- */
    function buildItems() {
      var order = shuffleQuestions ? shuffle(source) : source.slice();
      items = order.map(function (item) {
        var indexed = item.options.map(function (text, i) {
          return { text: text, correct: i === item.answer };
        });
        var options = shuffleOptions ? shuffle(indexed) : indexed;
        var correctIndex = -1;
        for (var i = 0; i < options.length; i++) {
          if (options[i].correct) correctIndex = i;
        }
        return {
          q: item.q,
          options: options,
          correctIndex: correctIndex,
          explain: item.explain || ""
        };
      });
      answers = items.map(function () { return null; });
      revealed = items.map(function () { return false; });
      current = 0;
      finished = false;
      warning = "";
      startedAt = Date.now();
    }

    /* ---------- rendering ---------- */
    function renderDots() {
      var html = "";
      for (var i = 0; i < items.length; i++) {
        html +=
          '<button type="button" data-index="' + i + '"' +
          (i === current ? ' aria-current="true"' : "") +
          (answers[i] !== null ? ' class="is-answered"' : "") +
          ' aria-label="Question ' + (i + 1) + '">' + (i + 1) + "</button>";
      }
      dotsEl.innerHTML = html;
    }

    function renderQuestion() {
      var item = items[current];
      var answered = answers[current] !== null;
      var isLast = current === items.length - 1;

      barEl.style.width = Math.round(((current + 1) / items.length) * 100) + "%";
      progressEl.setAttribute("aria-valuenow", String(current + 1));
      progressEl.setAttribute("aria-valuetext", "Question " + (current + 1) + " of " + items.length);
      counterEl.textContent = "Question " + (current + 1) + " of " + items.length;
      questionEl.textContent = item.q;

      var html = "";
      for (var i = 0; i < item.options.length; i++) {
        var showFeedback = mode === "practice" && revealed[current];
        var classes = "option";
        if (answers[current] === i) classes += " option--selected";
        if (showFeedback) {
          if (i === item.correctIndex) classes += " option--correct";
          else if (i === answers[current]) classes += " option--wrong";
        }
        html +=
          '<label class="' + classes + '">' +
            '<input type="radio" name="answer" value="' + i + '"' +
              (answers[current] === i ? " checked" : "") + ">" +
            '<span class="option__key">' + LETTERS[i] + "</span>" +
            '<span class="option__text">' + esc(item.options[i].text) + "</span>" +
          "</label>";
      }
      optionsEl.innerHTML = html;

      // Practice mode feedback
      if (mode === "practice" && revealed[current]) {
        var ok = answers[current] === item.correctIndex;
        feedbackEl.innerHTML =
          '<div class="quiz-feedback' + (ok ? "" : " quiz-feedback--wrong") + '">' +
            (ok ? "Correct — well done." : "Not quite. The correct answer is " +
              LETTERS[item.correctIndex] + ": " + esc(item.options[item.correctIndex].text) + ".") +
            (item.explain ? "<p>" + esc(item.explain) + "</p>" : "") +
          "</div>";
      } else {
        feedbackEl.innerHTML = "";
      }

      warnEl.innerHTML = warning
        ? '<div class="callout mt-0" style="margin-bottom:1rem">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>' +
          "<p>" + esc(warning) + "</p></div>"
        : "";

      backBtn.disabled = current === 0;
      nextBtn.textContent = isLast ? "Submit test" : "Next";

      renderDots();
    }

    /* ---------- results ---------- */
    function renderResults() {
      var score = 0;
      var blanks = 0;
      for (var i = 0; i < items.length; i++) {
        if (answers[i] === null) blanks++;
        else if (answers[i] === items[i].correctIndex) score++;
      }
      var percent = Math.round((score / items.length) * 100);
      var seconds = Math.round((Date.now() - startedAt) / 1000);
      var level = levelFor(percent);

      var review = "";
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var chosen = answers[j];
        var isRight = chosen === item.correctIndex;
        review +=
          '<li class="review-item ' + (isRight ? "review-item--right" : "review-item--wrong") + '">' +
            '<p class="review-item__q">' + (j + 1) + ". " + esc(item.q) + "</p>" +
            '<p class="review-item__meta">Your answer: <strong class="' +
              (isRight ? "tag-ok" : "tag-no") + '">' +
              (chosen === null ? "not answered" : LETTERS[chosen] + ". " + esc(item.options[chosen].text)) +
              "</strong></p>" +
            '<p class="review-item__meta">Correct answer: <strong>' +
              LETTERS[item.correctIndex] + ". " + esc(item.options[item.correctIndex].text) +
              "</strong></p>" +
            (item.explain
              ? '<p class="review-item__meta"><em>' + esc(item.explain) + "</em></p>"
              : "") +
          "</li>";
      }

      var scaleRows = "";
      if (showLevel) {
        for (var k = 0; k < LEVEL_SCALE.length; k++) {
          var row = LEVEL_SCALE[k];
          scaleRows +=
            '<tr' + (row.name === level.name ? ' class="is-current"' : "") + ">" +
            "<td>" + row.range + "</td><td>" + row.name + "</td></tr>";
        }
      }

      resultsEl.innerHTML =
        '<div class="results-panel">' +
        '<div class="results-panel__head">' +
          '<div class="score-ring" style="--pct:' + percent + '%">' +
            '<span class="score-ring__inner">' + percent + "%</span>" +
          "</div>" +
          "<div>" +
            '<p class="result-level mt-0">' + score + " of " + items.length + " correct</p>" +
            '<p class="result-line">' +
              (items.length - score - blanks) + " wrong · " + blanks + " not answered · " +
              "time " + formatClock(seconds) +
            "</p>" +
            (showLevel
              ? '<p class="result-line">Estimated level: <strong>' + level.name + "</strong></p>"
              : "") +
          "</div>" +
        "</div>" +
        (showLevel
          ? '<p class="mt-2">' + esc(level.note) + "</p>" +
            '<div class="table-wrap"><table class="level-scale">' +
            "<caption>How the bands are calculated (percentage of correct answers)</caption>" +
            "<thead><tr><th>Score</th><th>Estimated level</th></tr></thead>" +
            "<tbody>" + scaleRows + "</tbody></table></div>"
          : "") +
        '<div class="btn-row">' +
          '<button type="button" class="btn btn--primary" data-role="retake">Retake test</button>' +
          '<a class="btn btn--ghost" href="#top">Back to the top</a>' +
        "</div>" +
        "</div>" +
        '<h3 class="mt-3">Review every answer</h3>' +
        '<ul class="review-list">' + review + "</ul>";

      resultsEl.hidden = false;
      resultsEl.focus();
      resultsEl.querySelector('[data-role="retake"]')
        .addEventListener("click", function () { restart(); });
    }

    /* ---------- actions ---------- */
    function goTo(index) {
      if (finished) return;
      current = Math.max(0, Math.min(items.length - 1, index));
      warning = "";
      renderQuestion();
    }

    function finish() {
      finished = true;
      cardEl.hidden = true;
      renderResults();
      scrollTo(resultsEl);
    }

    function restart() {
      buildItems();
      cardEl.hidden = false;
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
      renderQuestion();
      cardEl.focus();
      scrollTo(cardEl);
    }

    /* ---------- events ---------- */
    optionsEl.addEventListener("change", function (event) {
      var input = event.target;
      if (input.name !== "answer") return;
      answers[current] = Number(input.value);
      warning = "";
      if (mode === "practice") revealed[current] = true;
      renderQuestion();
      // Re-rendering updates feedback and option colours; restore keyboard focus
      // to the chosen radio so keyboard users can continue without losing place.
      var selected = optionsEl.querySelector('input[name="answer"][value="' + answers[current] + '"]');
      if (selected) selected.focus();
    });

    // Let the user press Enter to move on.
    formEl.addEventListener("submit", function (event) {
      event.preventDefault();
      if (answers[current] === null) {
        warning = "Choose an answer before continuing.";
        renderQuestion();
        var first = optionsEl.querySelector("input");
        if (first) first.focus();
        return;
      }
      if (current === items.length - 1) {
        var missing = [];
        for (var i = 0; i < answers.length; i++) {
          if (answers[i] === null) missing.push(i + 1);
        }
        if (missing.length) {
          warning = "Question" + (missing.length > 1 ? "s " : " ") +
            missing.join(", ") + (missing.length > 1 ? " are" : " is") +
            " not answered yet. Use the numbered buttons below to jump to them.";
          renderQuestion();
          scrollTo(warnEl);
          return;
        }
        finish();
        return;
      }
      goTo(current + 1);
      cardEl.focus();
    });

    backBtn.addEventListener("click", function () {
      goTo(current - 1);
      cardEl.focus();
    });

    dotsEl.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-index]");
      if (!button) return;
      goTo(Number(button.getAttribute("data-index")));
      cardEl.focus();
    });

    /* ---------- start ---------- */
    buildItems();
    renderQuestion();

    return { restart: restart };
  }

  global.SkillNestQuiz = { create: create, levelFor: levelFor };
})(window);
