# Todo — yagui-reads

Task backlog. The **Now** task is the current gating decision; everything below is
a rough forward list, not a committed order. See `decisions.md` for the reasoning
behind each item and `vision-review.md` for the open review findings.

Tags: `@user` marks a task the author owns (a decision or review to make),
distinct from build tasks.

## Now
- [ ] **Choose phonics scheme** (scope-and-sequence) — pick a validated
      synthetic-phonics programme (e.g. Letters and Sounds, Jolly Phonics, or
      another DfE-validated scheme). This gates the phoneme introduction order and
      the wordlist tiers. Nothing about curriculum content is settled until this
      is chosen. (decisions.md D2)
      - Research complete — see `phonics-schemes.md` for candidates and a
        recommendation (L&S 2007 in-app / Jolly + ORT for parent books / UFLI for
        1.0+ GenAm). Awaiting author decision.
- [ ] `@user` **Confirm the Letters and Sounds 2007 licence footer** (Crown
      copyright / Open Government Licence v3.0) before the app embeds its
      progression — see `phonics-schemes.md` "Honest gaps"
- [ ] `@user` **Check Korean retail availability/pricing** for supplementary books
      (Yes24 / Kyobo / Aladin; Korean Jolly Phonics distributor). Korean-language
      searches will beat English ones here.
- [ ] `@user` **Review spaced-repetition decision** — the Leitner-style choice in
      decisions.md D10 is tentative; confirm or replace (e.g. SM-2 / FSRS), and
      settle intervals + mastery thresholds alongside the phonics scheme.

## Next — prototype
- [x] Define the grapheme data model: word → ordered list of graphemes, each with
      phoneme audio (decisions.md D1) — `app/js/data/words.js`
- [x] Build a small built-in test wordlist from the chosen scheme's first tier —
      L&S Phase 2 satpin-first, plus digraph/split-digraph/silent-letter words
      included specifically to prove the grapheme model
- [x] Prototype the core loop: present word → tap graphemes → record → playback →
      guardian pass/fail, with the blend as the pass gate (decisions.md D5)
- [x] Minimal pass celebration
- [x] PWA shell — manifest, service worker, icons (decisions.md D3)
- [ ] **Source licensed isolated-phoneme audio** (decisions.md D7) — the prototype
      currently falls back to speech synthesis and shows a banner saying the
      sounds are placeholders. This is the main thing standing between the
      prototype and a real trial with a child.
- [ ] Try it on the Android tablet and confirm install + mic permission work

## Observations from building the prototype
- [ ] `@user` Pick a letterform-safe font. In a default sans, lowercase `l`
      renders as a bare vertical stroke and is easily confused with `I`/`1` — the
      typography concern from vision-review.md §3.4, now visible in practice.
- [ ] Decide what a split digraph block should look like. It currently reads
      `a_e` (scheme convention), which is correct but abstract for a young child.

## Later
- [ ] Finish the medium-severity review pass (touch ergonomics §3.1,
      guardian-handoff §3.3, progression/mastery §4.3, accent/dialect §5.4)
- [ ] Modelled blending demonstration ("c-a-t → cat")
- [ ] Voice-guidance cues ("what is this word?", "press the letters to hear the sound")
- [ ] Verify iOS-PWA audio recording + autoplay on a real iPhone (decisions.md D3)
- [ ] Add American English (General American) accent set — 1.0+ (decisions.md D11)
