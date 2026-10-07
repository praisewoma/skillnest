# SkillNest — static educational tools

A lightweight, mobile-first website for free English, vocabulary, grammar and typing tests. It uses only HTML, CSS and vanilla JavaScript in the browser. There is no framework, package manager, database, login, API, analytics or external asset dependency.

## Run locally

1. Download or clone this folder.
2. Open `index.html` in a current browser.
3. To test the contact form, change the email in `brand.js` first. The form opens the visitor's own email application; it does not submit through a server.

No build step is needed. The `.html`, `.css` and `.js` files are the complete website.

## Deploy on Cloudflare Pages

For a Git-connected Pages project, use the folder containing `index.html` as the project root, leave the build command empty, and set the build output directory to `.`. If the files are nested in a repository folder, point the project root at that folder. `404.html` is included for the not-found page.

## Rebrand it

Branding is deliberately centralised:

- **Name, tagline, description and contact email:** edit `brand.js`.
- **Palette, type, radii, shadows and layout width:** edit the `BRAND TOKENS` section at the top of `style.css`.
- **Search and replace the old name in the static `<title>` and author meta tags** across the HTML pages after a rename. The visible logo, footer and page titles also update from `brand.js` when JavaScript runs.
- Replace `hello@your-domain.com` in `brand.js` with an address you actually control before publishing. Contact messages are created in the visitor's email app, not sent by the site.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Homepage and links to all tools |
| `typing-test.html` | Timed 60-second typing speed test |
| `typing-practice.html` | Easy, medium and hard typing practice |
| `english-test.html` | 20-question informal English level test; `?mode=practice` enables instant feedback |
| `vocabulary-test.html` | 20-question vocabulary test and practice mode |
| `grammar-test.html` | 20-question grammar test and practice mode |
| `resources.html` | Free study and reference material |
| `about.html` | About the project and how scores work |
| `contact.html` | Client-side email-draft form |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `disclaimer.html` | Limits of the informal practice tests |
| `404.html` | Cloudflare Pages not-found page |
| `style.css` | Shared responsive styles, colour tokens and accessibility states |
| `brand.js` | The single source for the brand name, tagline and email |
| `script.js` | Shared navigation, active links, branding and small visual behaviours |
| `questions.js` | The three original, 20-question question banks |
| `quiz.js` | Shared quiz rendering, navigation, feedback and scoring |
| `english-test.js`, `vocabulary-test.js`, `grammar-test.js` | Connect each question bank to the shared quiz engine |
| `typing.js` | Shared typing timer, live comparison, calculations and session-only attempt list |
| `typing-test.js`, `typing-practice.js` | Configure the two typing tools |
| `contact.js` | Validates the contact form and builds a `mailto:` draft |

The repeated page header and footer are plain HTML, so every page works as a static file. The JavaScript is split by responsibility to keep the tools readable and beginner-friendly.

## How scores work

### Typing

- **WPM** = `(characters typed ÷ 5) ÷ minutes elapsed`
- **Accuracy** = `(correct characters ÷ total characters typed) × 100`
- Correct and incorrect characters are counted by comparing typed characters with the target paragraph at the same position. Extra typed characters count as incorrect.
- The timed test begins its 60-second clock on the first keystroke and stops when time runs out or the whole paragraph is completed. Practice counts elapsed time upward.
- Attempt history exists in page memory only and disappears when the tab is reloaded or closed.

### Multiple-choice tests

- Each question is worth one point; unanswered questions must be completed before submission.
- **Percentage** = `(correct answers ÷ 20) × 100`, rounded to the nearest whole number.
- The English test displays an informal estimate: 0–39% Beginner, 40–59% Elementary, 60–74% Intermediate, 75–89% Upper Intermediate, 90–100% Advanced. It is not an official CEFR result or certification.
- Test mode shows the full answer review at the end. Practice mode gives feedback and an explanation after each answer.

All scores are calculated locally in the visitor's browser and are never uploaded or saved by the site.
