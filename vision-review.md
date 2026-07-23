# Vision Review — yagui-reads

Reviewer: Opus subagent (cold read, zero prior context)
Date: 2026-07-22
Subject: `vision.md`

A rigorous critical review of the initial vision. Findings are organized by
theme and tagged by severity. Nothing here is a mandate — it is a catalogue of
risks and open decisions to weigh before writing code.

---

## Summary judgment

The vision is a reasonable seed of a good idea, but as written it conflates
*letters* with *sounds* in a way that is pedagogically incorrect and would
actively teach a wrong mental model if implemented literally. The single hardest
dream — voice recognition that "awards a pass" — is under-appreciated in
difficulty and sits on top of a browser/PWA audio stack with serious iOS
constraints. Almost everything hard is deferred to "1.0" while the doc
under-specifies the curriculum, which is the actual core value.

---

## 1. Pedagogical soundness (SEVERITY: HIGH — the core risk)

**1.1 "Press each letter to play an accurate phonic sound" is the central flaw.**
Letters are not phonemes. English is not one-letter-one-sound, so a per-letter
tap model breaks immediately and teaches the wrong thing:
- **Digraphs**: "ship" = /ʃ/ /ɪ/ /p/ — three phonemes, four letters. Tapping
  "s" then "h" and hearing /s/ /h/ actively mis-teaches the "sh" grapheme. Same
  for ch, th, ck, ng, ai, ee, oa, igh, etc.
- **Silent letters**: "cat" is clean, but "lamb", "know", "wrap", "gnat" have
  letters with no sound. What does tapping "b" in "lamb" play?
- **Split digraphs / magic-e**: "cake" — the "e" is silent and changes the "a".
  Per-letter tapping cannot represent this.
- **Context-dependent letters**: "c" = /k/ in cat but /s/ in city; "g" hard vs
  soft; "y" as consonant vs vowel; every vowel has multiple sounds. The doc's
  "Accurate to the respective word, obviously" hand-waves exactly the hard part
  — it is *not* obvious, it is the entire problem of English orthography.

**Fix direction:** the unit of interaction should be the **grapheme** (which may
be 1–4 letters), not the letter. The data model must map a word to an ordered
list of *graphemes*, each with its phoneme audio, not a string of characters.
This is a fundamental data-model decision — getting it wrong forces a rewrite.

**1.2 Phoneme audio in isolation is itself a known pitfall (the "schwa problem").**
Consonant phonemes are hard to say without an intrusive vowel: people say "cuh"
for /k/, "buh" for /b/. Sounding "c-a-t" as "cuh-a-tuh" makes blending harder.
Recording pure, un-schwa'd stop consonants is genuinely difficult, and the
*quality* of these recordings is make-or-break.

**1.3 Broadly aligned with synthetic phonics, but doesn't say so or commit.**
Tap-sounds-then-blend-to-word is the shape of **synthetic phonics** (strongest
evidence base; the mandated method in e.g. England's national curriculum). But
the doc never names a methodology, sequence, or scheme. Mature schemes (Letters
and Sounds, Read Write Inc, Jolly Phonics, UK DfE validated programmes)
prescribe a *specific phoneme introduction order* (e.g. s, a, t, p, i, n first —
chosen so children can build many words early). "Highly curated tiered
wordlists" is hand-waving at precisely this, but the ordering *is the product*.

**1.4 Blending is missing.** Reading isn't tapping individual sounds; it's
*blending* them into a word. The flow (tap letters → say word) skips the modeled
blend ("c-a-t → cat"). There's no "hear the whole word blended" step and no
segmenting practice. Blending is not optional garnish — it's the skill taught.

**1.5 Prerequisite skills unaddressed.** Before grapheme-phoneme correspondence,
children typically need *phonemic awareness* (hearing sounds in spoken words,
orally, no print). The doc gestures at a "prior learning stage" but tacks it on
at the end as a 1.0 "would be good," when oral phonemic awareness is arguably
stage zero.

---

## 2. Technical feasibility — audio, PWA, iOS (SEVERITY: HIGH)

**2.1 The "voice recognition that awards a pass" dream is the hardest, riskiest thing.**
- On-device ASR for *single words spoken by very young children* is a worst-case
  scenario: high pitch, immature articulation, developmental substitutions
  (w/r, th/f), huge variance. Adult-trained models perform poorly on child speech.
- The Web Speech API (`SpeechRecognition`) is **not reliably supported on iOS
  Safari/PWAs**, is Chrome-centric, and often **requires a network round-trip** —
  conflicting with any offline goal and with sending children's voices to a
  third party (see §6).
- "Near approximation" scoring is fuzzy and hard to test. False fails will badly
  demotivate a 4-year-old; false passes make the mechanic pointless.
- **Recommendation:** treat ASR as a research spike, not a roadmap item. The
  guardian pass/fail fallback is the right call and should be treated as the
  *actual* product for a long time, not a stopgap.

**2.2 iOS PWA is the elephant.** The "test on my iPhone via installable PWA?"
hope collides with real limits:
- **Audio recording in iOS PWAs is historically fragile.**
  `getUserMedia`/`MediaRecorder` arrived late and has had bugs specifically in
  *installed/standalone* mode vs a Safari tab; behavior varies by iOS version.
  Verify on the actual target iOS version early — do not assume it works.
- **Autoplay restrictions**: iOS blocks audio not triggered by a user gesture.
  Auto voice-cues ("what is this word?") may be blocked; you may need a tap to
  unlock the audio context (`AudioContext` starts suspended). Tap-a-letter-plays
  is fine; automatic prompts are not.
- **Installability/engagement**: iOS "add to home screen" is manual and
  unobvious; Web Push / PWA support arrived recently and inconsistently.

**2.3 Offline is implied but never stated.** Kids' tablets + curated audio for
every phoneme/word implies offline, i.e. service-worker precaching of a
potentially large audio bundle. If offline is a requirement, it shapes
architecture (bundling, cache size, updates). If audio is fetched on demand, you
have latency and a network dependency in front of an impatient toddler.

**2.4 Recording quality on device.** Playback is easy; *scoring* is hard (§2.1).
Even playback has pitfalls: scary/confusing mic-permission prompts, background
noise, volume normalization.

---

## 3. UX for the target audience (SEVERITY: MEDIUM–HIGH)

**3.1 Motor skills / touch targets.** Young children have imprecise touch. Letter
blocks must be large, well-spaced, forgiving; accidental multi-touch and palm
rejection matter. A 5-block row on a phone may be too small. Tablet-first is more
realistic than phone-first for this age; the doc says "mobile/tablets (initially
android)" without resolving which.

**3.2 The reward loop is deferred to 1.0 but is what makes a child return.** A
pass/fail button with no celebration will not hold a preschooler's attention for
even one test session — which undermines the ability to *test the idea* at all.
Chicken-and-egg: you can't validate engagement with an unengaging MVP. Some
minimal positive reinforcement is needed in v0, not v1.

**3.3 The guardian-in-the-loop flow is under-designed.** "Check with guardian →
guardian presses pass/fail" assumes the guardian is present, attentive, and
adjudicating *every* word. Fine for testing; not a product. Also: handoff
between child (recording) and adult (judging) on one small screen every word is
clunky.

**3.4 Accessibility unaddressed.** No mention of: hearing impairment (visual
phoneme support), speech/language delay (the very kids who'd fail ASR),
color/contrast, dyslexia-friendly typography (letterform choice matters — e.g.
single-story "a", "I/l" confusion). Font choice for early readers is itself a
pedagogical decision.

**3.5 Casing.** Early readers are usually taught lowercase first; the example
"cat" is good, but make it an explicit rule, and address capitals (sentence
start, "I").

---

## 4. Product / scope risks (SEVERITY: MEDIUM–HIGH)

**4.1 Severe MVP-vs-1.0 gap.** Nearly everything that makes this a *learning
product* — animations, reward loops, voice guidance, tiered curriculum,
prior-learning stage — is stamped "essential for 1.0" and deferred. The MVP tests
the *mechanic* but not the *value proposition* (does a child learn / stay
engaged). Risk: you build the easy shell and discover the hard, deferred parts
are the whole game.

**4.2 ASR is called both "the dream" and a build target — decide.** Recommend
explicitly descoping ASR to a research spike until child-speech ASR is proven
feasible offline on iOS (it likely isn't today).

**4.3 Underspecified requirements throughout:**
- No definition of "pass" / "near approximation" thresholds.
- No progression/mastery model: how does a child move between words/tiers?
  Spaced repetition? Mastery gating? "Progression is key" then no mechanism.
- No session model: words per session, session length for attention span
  (~a few minutes for preschoolers).
- No user/account model: multiple children per guardian? Progress persistence?
  Where stored?
- "Wordlist CRUD may be required" — for whom? Guardian-authored lists are a very
  different product (and content-quality risk) than curated built-in tiers.

**4.4 Platform ambiguity.** "Android initially" but "test on iPhone" but "PWA" —
pick a primary target. A PWA is cross-platform but constrained (audio/iOS, §2). A
native/Android-first approach removes the iOS-PWA audio risk but drops iOS. Large
architectural consequences; currently unresolved.

**4.5 No success metrics.** "Sufficient for testing the idea" — what does success
look like? What question is the MVP answering (Can we score words? Do kids
engage? Do kids learn?)? Without this, "testing the idea" is undefined.

---

## 5. Content / curation burden (SEVERITY: MEDIUM)

**5.1 The audio recording burden is large and quality-critical.** You need clean,
consistent, schwa-free recordings for: every phoneme (~44 in English), every
whole word, plus (for 1.0) voice-guidance phrases — multiplied across tiers. One
consistent voice, controlled conditions, re-records when a sound isn't right.
This is a real production project. TTS is a tempting shortcut but is generally
poor at isolated phonemes and un-schwa'd consonants.

**5.2 Guardian-authored word lists create a phoneme-audio gap.** If a guardian
adds an arbitrary word, where does its per-grapheme audio come from? Either
restrict CRUD to a pre-recorded corpus, use on-the-fly TTS (quality/pedagogy
problems), or you can't support arbitrary words. Unacknowledged tension.

**5.3 Tiering is asserted, not designed.** "Tiered and highly curated to balance
difficulty and ensure breadth of sounds" is the actual curriculum and the hardest
content work. Reference an existing validated scope-and-sequence rather than
inventing from scratch (§1.3). Most of the real effort lives in this single
bullet.

**5.4 Dialect/accent.** Phoneme sounds differ by accent (UK vs US "a" in "bath",
rhotic vs non-rhotic "r", "t"-flapping). Whose accent? Affects both recordings
and any ASR scoring, and must match the child's environment.

---

## 6. Privacy / safety / legal (SEVERITY: HIGH — do not defer)

**6.1 You are recording children's voices** — sensitive personal data of minors,
triggering the strictest regimes:
- **COPPA** (US, under-13): verifiable parental consent, data minimization,
  retention limits, disclosure. Voice recordings of children are covered.
- **GDPR / GDPR-K / UK Age Appropriate Design Code ("Children's Code")**: lawful
  basis, parental consent, data-protection-by-design, DPIA likely required.
- If audio is ever sent off-device for ASR (Web Speech API → Google, or any
  cloud STT), you are **transmitting children's voice data to a third party** — a
  serious compliance and trust problem. Strong argument for on-device-only, which
  further undermines the ASR dream (§2.1).

**6.2 Data storage/retention unspecified.** The doc never says recordings stay
on-device. They *should* — record, play back, judge, discard; never persist or
upload by default. State this as a hard requirement now; it constrains
architecture (no cloud STT, local-only storage) and is far cheaper to design in
than retrofit.

**6.3 Store distribution / age rating.** Kids' apps face extra review (Google
Play Families policy, Apple Kids Category rules): no third-party ad/analytics
tracking of kids, restricted SDKs, privacy disclosures. Even a PWA later wrapped
native will hit these.

---

## 7. Internal inconsistencies & vagueness (SEVERITY: LOW–MEDIUM)

- **"Accurate to the respective word, obviously"** — the most hand-waved and
  least obvious claim in the doc (see §1.1). It papers over the hardest pedagogy.
- **Letter vs grapheme conflation** contradicts the later goal of "exposure to
  breadth of sounds/phonics", which implies digraphs the per-letter model can't
  represent.
- **ASR called both "the dream" and an implementation target** without resolving
  which (§4.2).
- **Platform stated three ways** (Android / iPhone / PWA) without a decision.
- **"1.0" is a catch-all** for everything hard; no MVP/v0.5/1.0 boundary defined.

---

## 8. Typos & wording errors in `vision.md`

- "the app will play **there** voice back to them" → **their**.
- "**an** prior learning stage" → **a** prior learning stage.
- Final sentence is **cut off / incomplete**: "...short simple words that cover
  the **basic**" — trails off (presumably "the basics"); the document ends
  mid-thought.
- The sentence "...so initially a simple" runs straight into the flow diagram and
  never grammatically completes.
- "mobile / tablets  (initially android)" — double space; "android" → **Android**.

---

## Top 5 things to fix before writing any code

1. **Change the data model from letters to graphemes** (§1.1). Word → ordered
   list of graphemes, each with phoneme audio. The load-bearing decision.
2. **Adopt a named, validated phonics scope-and-sequence** for phoneme order and
   tier design (§1.3, §5.3) instead of inventing curation from scratch.
3. **Make recordings stay on-device, no cloud STT** — a hard privacy requirement
   (§6.1–6.2), which also kills the risky ASR-via-Web-Speech path.
4. **Verify iOS-PWA audio recording + autoplay on the real target device/OS
   early** (§2.2) before committing to PWA; otherwise choose Android-native.
5. **Put a minimal reward/celebration in the MVP** (§3.2) so the "test the idea"
   phase can measure engagement, not just plumbing.
