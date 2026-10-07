/* typing-practice.js — starts free typing practice on typing-practice.html
   The difficulty <select> in the page decides which paragraph set is used. */

window.SkillNestTyping.create({
  root: "typing-app",
  mode: "practice",       // counts up instead of down
  pool: "easy"            // starting level; the dropdown overrides this
});
