/* ==========================================================================
   brand.js — ONE place for the brand's name, tagline and contact details.
   --------------------------------------------------------------------------
   Want to rename the site? Change the values below. Everywhere in the site
   marked with data-brand="name" / "tagline" / "description" / "email"
   updates automatically, and page <title> tags are rewritten too.

   Colours and fonts live in style.css (see the "BRAND TOKENS" block).

   NOTE: page <title> and <meta name="description"> tags still contain the
   brand name as plain text for SEO (so they work without JavaScript). After
   a rename, run a find & replace for the old name across the .html files,
   or just leave the JS to fix the titles on load.
   ========================================================================== */

window.SKILLNEST_BRAND = {
  name: "SkillNest",
  tagline: "Test. Practice. Improve.",
  description:
    "Free online tests and practice tools for English, vocabulary, grammar and typing.",

  // TODO: replace with the email address you actually own before publishing.
  email: "hello@your-domain.com"
};
