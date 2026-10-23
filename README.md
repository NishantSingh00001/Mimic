# Mimic

**An on-device writing studio that runs entirely in your browser.**

Summarize, rewrite, inspect and compose text. Core tools — extractive summarization, readability, sentiment, keyword extraction, offline rewrites and templates — need no key. Add a free Gemini key for generative rewrite and compose. No account, no server, nothing uploaded.

A true multi-page site with a shared design system and state that persists across pages.

---

## Pages

| Page | File | What it does |
|------|------|--------------|
| **Studio** | `index.html` | Landing — hero with a live "editor's desk" typewriter, live word/read-time/ease readout, navigation to every room. |
| **Summarize** | `summarize.html` | Extractive summary with an adjustable length slider, keyword chips and compression ratio. |
| **Rewrite** | `rewrite.html` | Shift tone (concise/formal/confident/friendly/playful) and length — offline presets, or generative with a key; before/after. |
| **Inspect** | `inspect.html` | Readability (Flesch + grade), sentiment, filler/cliché/adverb/passive flags, counts, keyword extraction. |
| **Compose** | `compose.html` | Start from elegant templates (email, bio, tagline, cover, summary); optionally continue with AI. |
| **Settings** | `settings.html` | Theme, accent, Gemini key, saved drafts, history, full feature list. |

## Highlights (50+ tools)

Summarize — extractive summary, length slider, key-sentence ranking, keyword chips, compression ratio.
Rewrite — five tones, shorten/expand, paraphrase, remove filler, expand contractions, offline + Gemini modes, before/after.
Inspect — chars, words, sentences, paragraphs, reading time, Flesch score, grade level, sentiment, positive/negative flags, filler finder, cliché finder, adverb count, passive-voice hints, keyword extraction.
Compose — five templates with variables, AI continue.
Platform — multi-page nav, light & dark, 5 accents, custom cursor, amber-light motion, scroll reveals, saved drafts, history, copy/download/import, keyboard shortcuts, autosave, offline-first, responsive.

## Deploy (free)

Static site, no build step. Upload the folder to a GitHub repo → connect Netlify/Vercel (no build command; publish directory is the repo root). `index.html` is the entry.

```bash
cd mimic
python3 -m http.server 8000
# open http://localhost:8000
```

## Privacy

All text, drafts and history live only in your browser's `localStorage`. Nothing is uploaded. Only with a Gemini key is text sent (directly from your device to Google) for generative rewrite/compose.

## Tech

Vanilla HTML/CSS/JS. Fonts: Fraunces, Inter, IBM Plex Mono. No framework, no tracker, no backend.
