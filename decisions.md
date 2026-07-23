# Decisions Log — yagui-reads

Running record of decisions that gate architecture and pedagogy. Each entry
notes the decision, the reasoning, and the review finding it resolves
(see `vision-review.md`). Supersedes conflicting statements in `vision.md`,
which is kept as the raw original intent.

---

## D1 — Grapheme, not letter, is the unit of interaction
**Status: Decided (2026-07-23)**

The tappable block represents a **grapheme** (1–4 letters), not a single letter.
A word is modelled as an *ordered list of graphemes*, each carrying its own
phoneme audio — never as a raw character string.

- "ship" → `sh` / `i` / `p` (3 blocks), not `s`/`h`/`i`/`p`.
- Handles digraphs (sh, ch, th, ck, ai, ee, igh…), split digraphs / magic-e
  ("cake" → `c` `a_e` `k` with the split shown across the word), silent letters,
  and context-dependent letters ("c" = /k/ vs /s/).

This is the load-bearing data-model decision; getting it wrong forces a rewrite.
Resolves review §1.1.

## D2 — Adopt a validated synthetic-phonics scope-and-sequence
**Status: Decided (2026-07-23)** — specific scheme TBD

Do not invent the phoneme order or tiering. Adopt an existing evidence-based
synthetic-phonics sequence (e.g. Letters and Sounds, Jolly Phonics, or another
DfE-validated programme) — typically introducing s, a, t, p, i, n first so many
words can be built early. The scheme defines both the phoneme introduction order
and the wordlist tiers.

Open: pick the specific scheme — tracked as the **first task in `todo.md`**.
Nothing about curriculum content is settled until this is chosen. Resolves
review §1.3, §5.3.

## D3 — Android-first for 1.0; PWA delivery; iOS is best-effort dogfooding
**Status: Decided (2026-07-23)**

- **Platform:** Android is the primary target. Initial 1.0 ships on Android.
- **Delivery:** built as a **PWA**. This is the intended design and it solves the
  dogfooding constraint without store fees:
  - Android tablet (child's device): install the PWA directly.
  - iPhone (author's device): "Add to Home Screen" from Safari — no App Store, no
    Apple Developer fee.
- **iOS caveat accepted:** the review flags that audio *recording* in installed
  iOS PWAs is historically fragile and autoplay is restricted (§2.2). iOS is
  therefore best-effort for dogfooding only. If it doesn't work, that's fine for
  now — revisit iOS properly after "contact with reality" (post-1.0).

Resolves review §4.4 and the platform half of §2.2.

## D4 — Audio stays on-device; no cloud STT
**Status: Decided (2026-07-23)**

Voice recordings never leave the device by default: record → play back → judge →
discard. No upload, no cloud speech-to-text. This was the intended design and is
also a hard privacy requirement given the subject is children's voices
(COPPA / GDPR-K / UK Children's Code, review §6). It additionally rules out the
Web Speech API cloud path and constrains storage to local-only.

Consequence: automatic speech recognition that "awards a pass" is descoped to a
future research spike (review §2.1, §4.2), because any viable on-device child-
speech ASR does not exist reliably today. The MVP uses guardian pass/fail.

Resolves review §6.1–6.2; descopes §2.1 ASR.

## D5 — Blending is the terminal step; a successful blend is the pass
**Status: Decided (2026-07-23)**

The core loop of a single word attempt (prototype form):

1. **Present** the word as grapheme blocks (D1).
2. **Explore** — the child taps each grapheme and hears its clean, isolated
   phoneme (D7). Repeatable.
3. **Model the blend** *(later stages, not required in the prototype)* — the app
   demonstrates blending the phonemes into the whole word ("c-a-t → cat").
4. **Attempt** — the child records themselves saying the whole word.
5. **Playback.**
6. **Judge** — the guardian marks pass/fail. **Pass = the child intelligibly
   *blended* the phonemes into the correct word.** Naming letters, or parroting a
   memorised word without blending, is not a pass (guardian's judgement in the
   prototype; the descoped ASR dream would enforce this automatically later).
7. **Celebrate** on pass (minimal in the prototype; rich by 1.0, see D6).

The pass criterion is specifically *blending* — that is the skill being taught,
and it is the terminal gate of every word attempt. This closes the gap the review
flagged (the old flow stopped at tapping isolated sounds). Resolves review §1.4.

## D6 — Delivery staging: Prototype → intermediate stages → 1.0 (= MVP)
**Status: Decided (2026-07-23)**

Terminology correction that re-frames the whole review. "MVP" was the wrong word
earlier; there are several stages between the first testable build and 1.0:

- **Prototype** (first iteration): tests the *mechanic* only — word → tap
  graphemes for phonemes → record → guardian pass/fail (blend gate, D5). It does
  **not** need to hold a child's attention or prove engagement; it validates the
  idea and the plumbing. A minimal celebration is welcome because it is cheap and
  pleasant, not because the prototype must measure engagement.
- **Intermediate stages**: progressively add modelled blending, voice-guidance
  cues, 2D animation, richer rewards, curated tiers, and the prior-learning mode.
- **1.0 = the MVP**: the first genuinely viable *product* — the reward /
  stimulation loop, voice guidance, animation, and curriculum tiers are all
  present. Everything the vision marks "essential for 1.0" is essential for *this*
  milestone, not for the prototype.

So the review's "put the reward loop in the MVP to measure engagement" was aimed
at the wrong stage: the engagement loop belongs at 1.0/MVP, while the prototype
stays focused on the mechanic. Resolves review §4.1 framing; refines §3.2.

## D7 — Schwa problem solved by sourcing licensed phoneme audio
**Status: Decided (2026-07-23)**

Clean, un-schwa'd, isolated consonant phonemes will come from an existing
high-quality recording set under an appropriate licence — a free/suitably-licensed
set, or a paid commercial-use sample pack — rather than being recorded from
scratch. This resolves the "schwa problem" and also cuts the content-production
burden the review flagged. TTS remains rejected for isolated phonemes.
Resolves review §1.2; mitigates §5.1.

## D8 — Tablet-first, but keep the path to phone open
**Status: Decided (2026-07-23)**

Tablet is the primary target (consistent with the child's device, D3). Phone is
not a goal now, but no design decision should make a later phone port impossible
or costly. In practice:

- Fluid/responsive layout with relative units — do not hardcode tablet
  dimensions.
- The word's grapheme-block row must be able to **reflow / wrap** for narrower
  screens rather than assuming it fits on one line.
- Touch targets sized large and well-spaced for imprecise young fingers, with a
  minimum that still works on a phone; handle accidental multi-touch / palm
  contact.

Resolves review §3.1.

## D9 — Per-word guardian judging now; batch review tested later
**Status: Decided (2026-07-23)**

The prototype keeps the simple per-word flow: child records → guardian judges →
pass/fail, on one shared device with a handoff each word (D5). This is accepted as
clunky but fine for validating the mechanic.

**After** the prototype, test a **batch-review feature**: the child records a set
of attempts, and the guardian reviews and judges them together at the end,
reducing per-word handoff friction. Deferred — not built in the prototype.

Resolves review §3.3.

## D10 — Progression: scheme hierarchy introduces; spaced repetition reviews
**Status: Decided (2026-07-23)** — SR system tentative, refined with the scheme

Two mechanisms with distinct jobs:

- **Introduction** is governed by the chosen phonics scheme's **sequential
  hierarchy and set relations** (todo.md Now-task, D2). A sound/word is only
  introduced once its prerequisite graphemes/phonemes have been taught — i.e. a
  word cannot appear before every grapheme in it is known. Advancement to the
  next item is gated on sufficient mastery of prior items.
- **Review** is governed by **spaced repetition**. The evidence for the spacing
  effect is strong for *retention of already-introduced items* — it is not an
  introduction-ordering system, so it sits on top of the scheme hierarchy, not in
  place of it. Already-passed sounds/words are re-surfaced on expanding intervals
  to keep them fresh.

**SR system (tentative):** a **Leitner-style box** scheme — simple, transparent,
easy to implement, and well-suited to the small item counts and young audience.
Items move up a box on a pass and down on a fail; higher boxes are reviewed less
often. Can be upgraded to a modern algorithm (SM-2 / FSRS) later if needed. The
concrete intervals and mastery thresholds are finalised alongside the phonics
scheme, since the scheme defines the item set and tier boundaries.

Resolves review §4.3.

## D11 — Accent: neutral UK English now; American English at 1.0+
**Status: Decided (2026-07-23)**

- **Prototype / early stages:** **UK English**, kept **relatively neutral** — a
  modern, region-light standard Southern British English. Avoid strong or dated
  RP and avoid marked regional accents, so it stays broadly intelligible and
  matches the child's spoken environment. This also aligns with the (UK) phonics
  schemes under consideration (D2).
- **American English (General American):** a **1.0+ requirement** — a second
  accent set added at or after 1.0, not in the prototype.

**Implication:** because a second accent is coming, phoneme audio and word
recordings must be **keyed by accent** in the data model from the start — do not
bake a single accent in. Adding General American later should be additive
(another audio set + labels), not a refactor.

Resolves review §5.4.

---

## Still open

The high- and medium-severity review passes are complete. Remaining follow-ups
are tracked in `todo.md`.
