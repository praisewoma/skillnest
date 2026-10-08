/* contact.js — builds a mailto: link from the contact form.
   Nothing is sent from our servers: the button opens the visitor's own email app. */

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var email = (window.SKILLNEST_BRAND && window.SKILLNEST_BRAND.email) || "praiseosalor@gmail.com";
  var statusEl = document.getElementById("c-status");
  var noteEl = document.getElementById("c-note");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var topic = document.getElementById("c-topic").value;
    var message = document.getElementById("c-message").value.trim();

    if (message.length < 5) {
      statusEl.textContent = "Please write a short message first.";
      noteEl.textContent = "Your message needs at least a few words before we can open an email draft.";
      document.getElementById("c-message").focus();
      return;
    }

    var body = message;
    var url = "mailto:" + email +
      "?subject=" + encodeURIComponent("SkillNest — " + topic) +
      "&body=" + encodeURIComponent(body);

    statusEl.textContent = "Opening your email app with the message ready to send.";
    noteEl.textContent = "If nothing opened, copy your message and email " + email + " directly.";
    window.location.href = url;
  });
})();
