# Security Review — Mimic

Code-grounded review against the standard 20-point pen-test checklist. Mimic is a fully
client-side writing tool (summarize/rewrite/inspect/compose). Core features need no network
access; an optional bring-your-own Gemini API key (stored only in `localStorage`) enables
generative rewrite/compose by calling Google's API directly from the browser.

| # | Check | Result |
|---|-------|--------|
| 1 | HTTP/2 Rapid Reset (CVE-2023-44487) | N/A — no server component |
| 2 | bcrypt 72-byte truncation | N/A — no auth/passwords |
| 3 | SAML signature bypass (CVE-2024-45409) | N/A — no SAML/SSO |
| 4 | nOAuth | N/A — no OAuth |
| 5 | GraphQL alias batching | N/A — no GraphQL |
| 6 | TOTP replay (RFC 6238 §5.2) | N/A — no TOTP/2FA |
| 7 | ReDoS | No — Mimic's text-analysis regexes (sentence/token splitters, filler/cliché matchers) are fixed in the source, not built from user patterns; all linear |
| 8 | JWT algorithm confusion | N/A — no JWTs |
| 9 | HTTP request smuggling | N/A — no server |
| 10 | Web cache poisoning | N/A — static site |
| 11 | Spoofed X-Forwarded-For | N/A — no backend reads request headers |
| 12 | Postgres views bypassing RLS | N/A — no database |
| 13 | `Math.random()` for security tokens | No — not used anywhere in this repo for anything security-relevant |
| 14 | Timing attacks on secret comparison | N/A — no secrets compared; the Gemini key is sent straight to Google's API, never compared locally |
| 15 | Padding oracle | N/A — no encryption |
| 16 | Server-side prototype pollution | N/A — no server |
| 17 | Server-side template injection | N/A — no server-side templating; Compose's templates are plain client-side string fills |
| 18 | XXE | N/A — no XML parsing |
| 19 | Cross-site WebSocket hijacking | N/A — no WebSocket use |
| 20 | Unicode username normalization | N/A — no usernames/accounts |

## Findings outside the 20-point list

None. The AI response path and user-text rendering are both handled safely:

- **Generative output never touches `innerHTML`.** `aiRun()`'s result is always assigned via
  `textContent` — `rewrite.html:30` (`out.textContent=r`) and `compose.html:34`
  (`out.textContent=r`) — so even an adversarial or prompt-injected Gemini response can't inject
  markup, the same pattern used safely elsewhere in this portfolio (Pulse).
- **User-derived text that does reach `innerHTML` is escaped.** `esc()` (`mimic.js:42`, `&<>`
  escaping) wraps every keyword chip extracted from the user's own pasted text
  (`summarize.html:33`, `inspect.html:38`) and every saved-draft/history label
  (`settings.html:43,45`).
- The Gemini key is stored only in `localStorage` and sent only as a query parameter directly to
  `generativelanguage.googleapis.com` (`mimic.js:85`) — never logged, echoed, or sent anywhere
  else; confirmed no server-side code or embedded shared key exists in this repo (it's entirely
  static, no `api/` directory).
- The one other `innerHTML` site with inline HTML (`index.html:106`, the landing-page typewriter)
  renders only a hardcoded array of marketing sentences (`index.html:103`), never user input.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RCiZNqYmetGt5SuieaZQcC
