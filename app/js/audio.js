/**
 * Phoneme + word audio playback.
 *
 * decisions.md D11 — audio is keyed by ACCENT from the start. Adding General
 * American at 1.0+ must be additive (drop in another folder + flip a key), never
 * a refactor. Do not collapse this to a flat path.
 *
 * decisions.md D7 — real audio is licensed, cleanly recorded, un-schwa'd phoneme
 * samples. We do not have those files yet, so this module falls back to speech
 * synthesis and reports `usingPlaceholder === true` so the UI can say so out
 * loud. The fallback is NOT pedagogically acceptable: TTS says the letter NAME
 * ("ess") or an approximation, and cannot produce a clean stop consonant without
 * a schwa. It exists only so the loop is testable before the audio is bought.
 *
 * To go live: drop files at app/audio/en-GB/phonemes/<phoneme>.mp3 and
 * app/audio/en-GB/words/<id>.mp3, then set MANIFEST['en-GB'].available = true.
 */

const ACCENT = 'en-GB';

const MANIFEST = {
  'en-GB': {
    // Flip to true once real recordings are present (D7).
    available: false,
    lang: 'en-GB',
    phonemeDir: `audio/en-GB/phonemes`,
    wordDir: `audio/en-GB/words`,
  },
  // 'en-US': { ... } — 1.0+, see decisions.md D11.
};

/**
 * Placeholder utterances for the TTS fallback only.
 * Speaking the letter 's' aloud gives "ess" (the letter NAME), which is exactly
 * the thing phonics teaching must avoid, so we spell out a rough sound instead.
 * These are throwaway strings, not a pronunciation model — they die with D7.
 */
const PLACEHOLDER_SOUND = {
  s: 'sss', a: 'ah', t: 'tuh', p: 'puh', i: 'ih', n: 'nnn', m: 'mmm', d: 'duh',
  g: 'guh', o: 'oh', k: 'kuh', e: 'eh', u: 'uh', r: 'rrr', h: 'huh', b: 'buh',
  f: 'fff', l: 'lll', sh: 'shhh', ch: 'ch', ai: 'ay',
};

let audioCtx = null;
let unlocked = false;

/**
 * iOS starts AudioContext suspended and blocks anything not tied to a user
 * gesture (vision-review.md §2.2). Call this from the first real tap.
 */
export function unlock() {
  if (unlocked) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }
    unlocked = true;
  } catch {
    /* Non-fatal: playback falls back to <audio>/speechSynthesis. */
  }
}

export const usingPlaceholder = !MANIFEST[ACCENT].available;

function speak(text) {
  if (!('speechSynthesis' in window)) return Promise.resolve();
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = MANIFEST[ACCENT].lang;
    u.rate = 0.8;
    u.onend = u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

function playFile(url) {
  return new Promise((resolve, reject) => {
    const el = new Audio(url);
    el.onended = () => resolve();
    el.onerror = () => reject(new Error(`missing audio: ${url}`));
    el.play().catch(reject);
  });
}

/** Play a single phoneme. Silent graphemes play nothing (by design). */
export async function playPhoneme(phoneme) {
  if (!phoneme) return;
  const cfg = MANIFEST[ACCENT];
  if (cfg.available) {
    try {
      await playFile(`${cfg.phonemeDir}/${phoneme}.mp3`);
      return;
    } catch {
      /* fall through to placeholder */
    }
  }
  await speak(PLACEHOLDER_SOUND[phoneme] || phoneme);
}

/** Play a whole word. Used for the modelled blend in later stages (D5 step 3). */
export async function playWord(word) {
  const cfg = MANIFEST[ACCENT];
  if (cfg.available) {
    try {
      await playFile(`${cfg.wordDir}/${word.id}.mp3`);
      return;
    } catch {
      /* fall through */
    }
  }
  await speak(word.id);
}

/**
 * A short rising chime for the pass celebration (D6 — minimal in the prototype).
 * Synthesised rather than shipped as an asset so it costs nothing to carry.
 */
export function playChime() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}
