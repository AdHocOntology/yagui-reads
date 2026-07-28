# yagui-reads

A simple reading app intended for tablet / mobile use.

An early/beginner's phonics reading app: a word is shown as grapheme blocks, the
child taps each block to hear its sound, then records themselves saying the whole
word. A guardian judges whether they blended the sounds correctly.

## Documents

| File | What it is |
|---|---|
| `vision.md` | The original vision, kept as raw authorial intent |
| `vision-review.md` | Critical review of the vision (pedagogy, feasibility, privacy, scope) |
| `decisions.md` | D1–D11 — the resolved design and pedagogy decisions |
| `phonics-schemes.md` | Evaluation of candidate phonics schemes; recommendation |
| `todo.md` | Backlog. `@user` marks tasks the author owns |

## Running the prototype

The app is a dependency-free PWA — no build step, no toolchain. Serve `app/`
over HTTP (a `file://` open will not work: it uses ES modules and a service
worker).

```sh
cd app && python3 -m http.server 8000
```

Then open `http://localhost:8000`. To try it on the tablet, serve it over HTTPS
or a tunnel and use the browser's "Add to Home Screen".

### What the prototype does

Implements the word-attempt loop from `decisions.md` D5: present → explore →
record → playback → guardian pass/fail → celebrate. Pass means the child
**blended** the sounds into the word.

### Known prototype limitations

- **The phoneme sounds are placeholders.** No licensed audio has been sourced
  yet (D7), so the app falls back to speech synthesis and shows a banner saying
  so. The fallback is *not* pedagogically acceptable — TTS cannot produce a clean
  un-schwa'd consonant. Real recordings drop into `app/audio/en-GB/` and the
  manifest flag in `js/audio.js` gets flipped.
- No spaced repetition (D10), no batch guardian review (D9), no modelled
  blending, no voice guidance. All deliberately later-stage.
- Word order is as authored; there is no progression logic yet.
- Recordings are held in memory for one attempt and discarded. Nothing is stored
  or uploaded, by design (D4).
