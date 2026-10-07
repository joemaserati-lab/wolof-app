# Njàng Wolof

PWA mobile-first e offline per lo studio del wolof.

Deploy automatico tramite GitHub Pages.

Versione 2.1: IPA e quiz contestuali più vari.
# Learning release 2.3

GitHub Pages now publishes editable `site/` sources directly after validation. Archived packages in `.deploy/` remain for reference.

- 10 questions with unscored educational pauses after questions 3 and 7.
- Translation, word/phrase writing, cloze, ordering and contextual recall from existing sourced examples. Last format is saved per word for rotation across sessions.
- Exact spellings/declared variants earn 1 point; missing vowel diacritics and a single minor error in words of at least 5 characters earn 0.5. Another known lexical entry earns zero. This is spelling assistance, not a grammar parser.
- Half credit earns 6 XP but never increments the fully correct count used for consolidation. Existing correct/incorrect XP rewards remain 12/3.

## Compatibility

`njang-wolof-v2`, existing word IDs, XP, streak, counters, module bests and word statistics stay intact. The older `njang-wolof-progress-v1` migration remains. New optional fields: `credit`, `partial` and per-word `lastFormat`. Missing credit starts from the legacy correct count. Cache updates never clear localStorage.

## Lexicon packs

`learning.js` adapts the corpus to schema version 1 with `lemma`, `pos`, `level`, `frequency`, `tags`, `meanings`, `variants`, `examples`, `orthography` and `provenance`. Unknown metadata is null. Legacy attribution is explicitly marked `status: legacy`. Examples are linked from existing corpus phrases; no translations are invented.

Add reviewed packs in `site/lexicon-packs.js` as `window.WOLOF_PACKS = [{schemaVersion: 1, entries: [...]}]`. Each entry needs a unique stable `id`, `wolof`, `italian`, `kind` (`word`/`phrase`), existing module `category`, existing `source` and precise `ref`. Examples use `{wolof, italian, sourceId, ref}`. Add new modules and sources to `data.js` first. Duplicate IDs and unknown references are rejected; counts update automatically. Keep spelling errors out of accepted `variants`.

This release makes the existing corpus extensible; it does not claim dictionary completeness or import thousands of unverified words.

## Tests and deployment

Run `node --test tests/*.test.cjs`. Tests cover every module, question validity, format rotation, pauses, partial scoring, double-submit protection and legacy progress round trips using the real app in a DOM fixture. Visual checks on mobile devices remain separate.

Serve `site/` with any static HTTP server. GitHub Actions validates tests, syntax, storage keys and PWA assets before publishing. Future releases must increment the asset query version and service-worker cache name.
