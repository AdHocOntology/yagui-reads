/**
 * Voice capture for the child's word attempt.
 *
 * decisions.md D4 — HARD PRIVACY REQUIREMENT. The subject is a child's voice.
 * Recordings:
 *   - stay in memory as a Blob for the length of one word attempt,
 *   - are played back locally and judged by the guardian,
 *   - are revoked and dropped before the next word,
 *   - are NEVER uploaded, NEVER written to storage, NEVER sent to a speech API.
 * There is deliberately no persistence layer here and no network call anywhere in
 * this file. Adding either is a compliance decision (COPPA / GDPR-K / UK
 * Children's Code), not a refactor — see vision-review.md §6.
 */

let mediaRecorder = null;
let stream = null;
let chunks = [];
let currentUrl = null;

/**
 * iOS Safari does not support audio/webm; it produces audio/mp4. Feature-detect
 * rather than assuming Chrome (decisions.md D3 — iOS is best-effort dogfooding).
 */
function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'];
  return candidates.find((t) => MediaRecorder.isTypeSupported?.(t)) || '';
}

export function isSupported() {
  return !!(navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
}

export async function start() {
  releaseClip();
  chunks = [];
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = pickMimeType();
  mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  mediaRecorder.start();
}

/** Stops recording and returns a local object URL for playback. */
export function stop() {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return resolve(null);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      chunks = [];
      stopStream();
      currentUrl = URL.createObjectURL(blob);
      resolve(currentUrl);
    };
    mediaRecorder.stop();
  });
}

function stopStream() {
  // Release the mic promptly so the OS recording indicator clears.
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  mediaRecorder = null;
}

/** Drop the clip. Called before every new word so nothing lingers in memory. */
export function releaseClip() {
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
}

export function abort() {
  try {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  } catch {
    /* already stopped */
  }
  chunks = [];
  stopStream();
  releaseClip();
}
