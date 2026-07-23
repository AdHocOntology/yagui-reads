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

Open: pick the specific scheme. Resolves review §1.3, §5.3.

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

---

## Still open (to address in the medium-severity pass)

- **Minimal reward/celebration in the MVP** (review §3.2) — needed so the "test
  the idea" phase can measure engagement, not just plumbing. Not yet decided.
- Blending step (§1.4), touch-target/ergonomics (§3.1), guardian-handoff flow
  (§3.3), progression/mastery model (§4.3), accent/dialect for recordings (§5.4),
  and the remaining medium items.
