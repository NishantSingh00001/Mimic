# Mimic — Plan

**What it is:** An on-device writing studio. Summarize, rewrite, inspect and compose text — core tools run fully offline (extractive summarization, readability, sentiment, keyword extraction, cleanup, templates); an optional free Gemini key adds generative rewrite and chat. No account, no server, nothing uploaded.

**Visual identity:** Luxury / cinematic (the fourth distinct lane — vs Pulse warm-immersive, Loom cool-editorial, Forge techno). Deep charcoal canvas, ivory text, warm amber/gold accent, refined Fraunces serif display with Inter body and a mono detail. Signature motion: a slow drifting amber light orb + soft grain (calm, premium). Custom difference-blend cursor. Bespoke monogram logo. No emojis — inline SVG icons.

**Tech:** Static multi-page site. Shared `mimic.css` + `mimic.js`. State in localStorage (`mimic_mp`), working text shared across pages. Gemini REST via user key for generative features.

## Pages (each its own unique functionality)
1. **index.html — Studio (home)**: hero, quick paste box, feature tiles, live word/read-time readout.
2. **summarize.html — Summarize**: extractive summary with adjustable length (TF-IDF sentence scoring), key sentences highlighted, keyword chips, compression ratio.
3. **rewrite.html — Rewrite**: tone presets (formal, friendly, confident, concise, playful) + length (shorten/expand) — offline rule-based cleanup/templating, upgraded to true Gemini rewrite with a key; paraphrase; before/after.
4. **inspect.html — Inspect**: readability (Flesch + grade), sentiment (lexicon), filler/cliché/adverb/passive flags, counts, reading time, keyword extraction.
5. **compose.html — Compose**: starter templates (email, bio, tagline, summary, cover note) you fill in; optional Gemini continue/chat.
6. **settings.html — Settings**: theme, accent, Gemini key, saved drafts, history, shortcuts, full feature list.

## 50+ features (target)
Summarize (8): extractive summary, adjustable length slider, key-sentence highlight, keyword chips, compression ratio, copy, download, sentence ranking.
Rewrite (12): tone formal/friendly/confident/concise/playful, shorten, expand, paraphrase, remove filler, fix spacing, title-case headline, offline + Gemini modes, before/after copy.
Inspect (14): chars, words, sentences, paragraphs, reading time, Flesch score, grade level, sentiment score, positive/negative word flags, filler words, clichés, adverb count, passive-voice hints, keyword extraction.
Compose (8): 5+ templates, variable fills, insert into studio, optional Gemini continue, chat, copy, download, clear.
Platform (10+): multi-page nav, light & dark, accents, custom cursor, amber-orb motion, saved drafts, history, copy/download/import, keyboard shortcuts, autosave, offline, responsive.
