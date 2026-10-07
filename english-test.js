/* english-test.js — starts the English level test.
   Add ?mode=practice to the URL for instant-feedback practice mode. */

(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var practice = params.get("mode") === "practice";

  window.SkillNestQuiz.create({
    root: "quiz-app",
    questions: window.SKILLNEST_QUESTIONS.english,
    mode: practice ? "practice" : "test",
    showLevel: !practice      // no level estimate in practice mode
  });

  // Keep the page heading and browser tab in step with the mode.
  if (practice) {
    var heading = document.querySelector(".page-head h1");
    if (heading) heading.textContent = "English Practice";
    document.title = "English Practice — 20 Questions with Instant Feedback | SkillNest";
  }

  var bar = document.querySelector('[data-role="mode-switch"]');
  if (bar) {
    bar.innerHTML = practice
      ? '<span class="badge">Practice mode — instant feedback</span>' +
        '<a class="btn btn--ghost btn--sm" href="english-test.html">Switch to test mode</a>'
      : '<span class="badge badge--blue">Test mode</span>' +
        '<a class="btn btn--ghost btn--sm" href="english-test.html?mode=practice">Switch to practice mode</a>';
  }
})();
