# Sourcing Phoneme Audio

Research for `todo.md` "Source licensed isolated-phoneme audio" (`decisions.md` D7).
Status: **research complete, decision not yet made.**
Date: 2026-07-29

## What we actually need

Per D7 and D11, and constrained by D4:

1. **Isolated phonemes** (~44 English), each a clean single sound.
2. **Un-schwa'd** — /k/ not "cuh", /b/ not "buh". This is the whole point of D7 and
   the reason TTS was rejected. Untrained speakers add the schwa automatically.
3. **One consistent voice** across the whole set. A set stitched from many
   speakers sounds wrong to a child and undermines comparison between sounds.
4. **Neutral UK English** now; General American additively at 1.0+ (D11).
5. **A licence that permits redistribution inside a shipped app** — not merely
   "free to listen to" or "free to share with parents".
6. Separately, **whole-word** audio for the modelled blend (D5 step 3).

## Headline finding

**No ready-made set satisfies all six.** Every candidate fails at least one axis,
and the axes it fails are not the cosmetic ones. The options group as follows.

### A. Open licence, wrong articulation style

| Source | Licence | Problem |
|---|---|---|
| Official IPA Chart | Chart is CC BY-SA 3.0 | The **chart** is CC-licensed; whether the **recordings** are was not verifiable (see Limits). |
| Wikimedia Commons IPA audio (IPA consonant/vowel chart with audio) | Per-file, mostly CC BY-SA / CC0 | Linguistic citation forms recorded by phoneticians to demonstrate *symbols* — often aspirated or with a carrier vowel, and **different speakers and accents per file**. |

These are recordings of *phones for linguists*, not *pure sounds as taught in
phonics*. Using them would trade one kind of wrongness for another, and the
voice inconsistency across files is a real problem for a child comparing sounds.

### B. Correct articulation, restrictive licence

| Source | Notes |
|---|---|
| **Yellow Door — "Free! Phonic Sounds Alphabet"** | UK publisher, free MP3, explicitly demonstrating *correct enunciation*, drawn from their Come Alive Phonics range, and intended to be shared with parents. **Best articulation reference found.** But it is a single combined MP3 of alphabet letter-sounds (not 44 separate phonemes), and no redistribution licence is stated — "share with parents" is not "embed in a distributed app". Would need segmenting *and* a permission email. |
| Oxford Owl, Logic of English, All About Learning phonogram app | Free to listen, proprietary. Not licensable for reuse. |
| University of Iowa **Sounds of Speech** | Copyrighted by the UI Research Foundation and sold as a paid app. American English. Licensable in principle by contacting UIRF — wrong accent for now, possibly relevant at 1.0+. |
| Christian Liberty Press "Phonics Sounds and Teaching Tips" MP3 | Paid, American, redistribution rights unlikely. |

### C. Permissive licence, but words rather than phonemes

| Source | Licence | Use |
|---|---|---|
| **Lingua Libre** (Wikimedia) | CC BY-SA / CC0 | 100k+ English pronunciation files already on Commons. Also a *recording tool*: ~1000 words/hour, auto-cuts on silence, uploads cleanly named files. Strong candidate for the **whole-word** audio, and for recording our own word list fast. |
| Art4Apps (the source of GCompris's voices) | CC BY-SA | ~1000 images + English voices. Words, not phonemes. |
| CSTR **VCTK** corpus | CC BY 4.0, commercial use permitted | 110 English speakers including British accents — but **sentences**. Phonemes cut from running speech are coarticulated, which is precisely wrong for isolated pure sounds. |
| Pixabay sound effects | Free commercial, no attribution | Licence forbids redistributing sounds *as-is*, and phoneme coverage is incidental and unverified. |

### D. Commission it

- UK voice actor rates: roughly **£100–£1000+** depending on usage and
  experience; British VO on Fiverr commonly **~$80–90**; Upwork median **~$55/hr**;
  UK studio fees **~£200–400**.
- 44 phonemes plus 50–100 words is a **very short script** — likely 1–2 hours.
- The catch is **direction, not money**: an untrained reader will say "cuh" for
  /k/. This needs either a voice actor with phonics/teaching experience or clear
  coaching against a reference (the Yellow Door file works for that).
- Result: outright ownership, no licence risk, one consistent voice, exactly the
  neutral UK English D11 asks for, and the ability to re-record.

## Recommendation

**Two stages, matching the project's own staging (D6).**

**Now — record a scratch set yourself.** For the prototype, record the 44 sounds
on a phone in a quiet room. Rationale:

- It is **free and available today**, and it is the one thing standing between
  the prototype and a real trial.
- There is **no licence question at all** for a parent testing with their own
  child.
- You control the articulation directly, and pure sounds can be learned in
  minutes from a reference such as the Yellow Door file.
- It matches the stated intent not to over-invest before the prototype has met
  reality. A scratch track is enough to test the *mechanic*; it is not enough to
  ship.

**At 1.0 — commission a professional set.** It is the only route satisfying D7,
D11 and the licence constraint simultaneously, the cost is modest and one-off,
and by then the concept will have been validated. Stitching a set together from
Commons would likely cost more of your time than the fee and still sound
inconsistent.

Either way `js/audio.js` needs no change: the accent-keyed manifest already
takes files at `app/audio/en-GB/phonemes/<phoneme>.mp3` and the placeholder
banner disappears when the flag is flipped.

## Limits of this research

Outbound requests to most domains are blocked from this environment, so
`internationalphoneticassociation.org`, `wikipedia.org`, `jollylearning.co.uk`
and others returned HTTP 403 to direct fetches. **Findings below the search-result
level are therefore unverified**, specifically:

- the licence covering the **IPA sound recordings** (as distinct from the chart);
- the exact terms attached to the **Yellow Door** free MP3;
- per-file licences on individual Wikimedia Commons IPA recordings;
- current voice-over pricing, which was taken from published rate guides rather
  than quotes.

Each should be confirmed on the source page before anything is relied on.

## Sources

- IPA chart under Creative Commons — https://www.internationalphoneticassociation.org/news/201207/ipa-chart-now-under-creative-commons-licence
- IPA sound recordings — https://www.internationalphoneticassociation.org/content/sound-recordings
- IPA consonant chart with audio — https://en.wikipedia.org/wiki/IPA_consonant_chart_with_audio
- IPA vowel chart with audio — https://en.wikipedia.org/wiki/IPA_vowel_chart_with_audio
- Yellow Door free Phonic Sounds Alphabet — https://www.yellow-door.net/products/free-phonic-sounds-alphabet/
- Lingua Libre — https://meta.wikimedia.org/wiki/Lingua_Libre
- Commons English pronunciation category — https://commons.wikimedia.org/wiki/Category:Lingua_Libre_pronunciation-eng
- CSTR VCTK corpus — https://datashare.ed.ac.uk/handle/10283/3443
- University of Iowa Sounds of Speech — https://csi.its.uiowa.edu/our-work/sounds-speech
- Pixabay content licence — https://pixabay.com/service/license-summary/
- UK voice-over pricing guide — https://hannahmelbourn.com/blog/how-much-does-a-voiceover-cost
- Voice actor hourly rates — https://www.upwork.com/hire/voice-actors/cost/
