/**
 * The "learn to read a word" screen — prototype.
 *
 * Implements the word-attempt loop from decisions.md D5, minus step 3 (the
 * modelled blend), which D5 puts in a later stage:
 *
 *   1 present  — the word as grapheme blocks (D1)
 *   2 explore  — tap a grapheme, hear its phoneme; repeatable
 *   4 attempt  — child records themselves saying the whole word
 *   5 playback — play it back locally (D4: never leaves the device)
 *   6 judge    — guardian marks pass/fail; PASS = they BLENDED the sounds (D9)
 *   7 celebrate— minimal, per D6
 *
 * Scope discipline (D6): this is the PROTOTYPE. It tests the mechanic. It is not
 * trying to hold a child's attention or prove engagement — that is the 1.0/MVP
 * job. No spaced repetition (D10), no batch review (D9), no voice guidance.
 */

import { WORDS, blockLabel, spelling } from './data/words.js';
import * as audio from './audio.js';
import * as recorder from './recorder.js';

const el = (id) => document.getElementById(id);

const ui = {
  notice: el('placeholder-notice'),
  prompt: el('prompt'),
  word: el('word'),
  hint: el('hint'),
  ready: el('ready-btn'),
  record: el('record-btn'),
  stop: el('stop-btn'),
  play: el('play-btn'),
  guardian: el('guardian'),
  pass: el('pass-btn'),
  fail: el('fail-btn'),
  celebrate: el('celebrate'),
  progress: el('progress'),
  skip: el('skip-btn'),
};

/** Prototype word order: as authored. Sequencing logic belongs to D10, later. */
let index = 0;
let clipUrl = null;
let passes = 0;

function currentWord() {
  return WORDS[index];
}

// --- Rendering -------------------------------------------------------------

function renderWord() {
  const word = currentWord();
  ui.word.textContent = '';
  ui.word.setAttribute('aria-label', `Word: ${spelling(word)}`);

  word.graphemes.forEach((g) => {
    const label = blockLabel(g);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'grapheme' + (g.silent ? ' is-silent' : '');
    btn.dataset.len = String(label.length);
    btn.textContent = label;
    btn.setAttribute('aria-label', g.silent ? `${label}, silent` : label);
    if (!g.silent) btn.addEventListener('click', () => tapGrapheme(btn, g));
    ui.word.appendChild(btn);
  });
}

async function tapGrapheme(btn, grapheme) {
  audio.unlock();
  btn.classList.add('is-playing');
  await audio.playPhoneme(grapheme.phoneme);
  btn.classList.remove('is-playing');
  btn.classList.add('is-heard');
}

function setStage(stage) {
  const show = (node, on) => { node.hidden = !on; };
  show(ui.ready, stage === 'explore');
  show(ui.record, stage === 'ready');
  show(ui.stop, stage === 'recording');
  show(ui.play, stage === 'judge');
  show(ui.guardian, stage === 'judge');

  const hints = {
    explore: 'Press the letters to hear the sounds',
    ready: 'Now say the whole word',
    recording: 'Listening…',
    judge: 'Press to hear yourself',
  };
  ui.hint.textContent = hints[stage] || '';
  ui.prompt.textContent = stage === 'judge' ? 'How did that sound?' : 'What is this word?';
}

function renderProgress() {
  ui.progress.textContent = `Word ${index + 1} of ${WORDS.length} · ${passes} passed`;
}

// --- Loop ------------------------------------------------------------------

function loadWord(i) {
  index = ((i % WORDS.length) + WORDS.length) % WORDS.length;
  recorder.releaseClip();
  clipUrl = null;
  renderWord();
  setStage('explore');
  renderProgress();
}

ui.ready.addEventListener('click', () => {
  audio.unlock();
  setStage('ready');
});

ui.record.addEventListener('click', async () => {
  audio.unlock();
  if (!recorder.isSupported()) {
    // Recording is the one capability the prototype cannot fake. Say so plainly
    // rather than failing silently — this is also the exact surface expected to
    // misbehave in an installed iOS PWA (D3, vision-review.md §2.2).
    ui.hint.textContent = 'Recording is not available on this browser';
    setStage('judge');
    return;
  }
  try {
    await recorder.start();
    setStage('recording');
  } catch {
    ui.hint.textContent = 'No microphone permission — ask a grown-up';
    setStage('judge');
  }
});

ui.stop.addEventListener('click', async () => {
  clipUrl = await recorder.stop();
  setStage('judge');
});

ui.play.addEventListener('click', () => {
  if (!clipUrl) return;
  new Audio(clipUrl).play().catch(() => {});
});

ui.pass.addEventListener('click', () => {
  passes += 1;
  celebrate();
  renderProgress();
  setTimeout(() => loadWord(index + 1), 950);
});

ui.fail.addEventListener('click', () => {
  // No penalty, no negative feedback — just another go at the same word.
  recorder.releaseClip();
  clipUrl = null;
  setStage('explore');
});

ui.skip.addEventListener('click', () => loadWord(index + 1));

function celebrate() {
  audio.playChime();
  ui.celebrate.hidden = false;
  setTimeout(() => { ui.celebrate.hidden = true; }, 900);
}

// --- Boot ------------------------------------------------------------------

// Be honest on screen while the phoneme audio is still a stand-in (D7).
if (audio.usingPlaceholder) ui.notice.hidden = false;

// Drop the mic and any clip if the app is backgrounded mid-attempt (D4).
window.addEventListener('pagehide', () => recorder.abort());

loadWord(0);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* Offline support is a bonus in the prototype, not a requirement. */
    });
  });
}
