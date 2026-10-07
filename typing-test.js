/* typing-test.js — starts the 60 second typing test on typing-test.html */

window.SkillNestTyping.create({
  root: "typing-app",     // the container <div id="typing-app">
  mode: "test",           // countdown mode
  seconds: 60,            // test length
  pool: "test"            // which paragraph set to use
});
