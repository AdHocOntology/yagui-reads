/**
 * Grapheme-segmented wordlist.
 *
 * decisions.md D1 — the unit is the GRAPHEME, not the letter. A word is an
 * ordered list of graphemes, never a raw character string. This is the
 * load-bearing data model decision; do not "simplify" it back to letters.
 *
 * Grapheme shape:
 *   letters    the letters shown on the block. May be 1-4 chars ('s', 'sh', 'igh').
 *   phoneme    key into the phoneme audio manifest (see audio.js). Deliberately
 *              NOT the same as `letters` — 'c' in "cat" and 'k' in "kid" are the
 *              same phoneme /k/, and 'sh' is one phoneme spelled with two letters.
 *   splitTail  optional. For split digraphs / magic-e ("cake" = c + a_e + k):
 *              the trailing letter that belongs to this grapheme but sits after
 *              the next one in the spelling. Rendered as 'a_e' on the block.
 *   silent     optional. true for letters with no sound of their own ("lamb").
 *              A silent grapheme is shown but plays nothing when tapped.
 *
 * Sequence metadata (phase/set) follows Letters and Sounds 2007, which is the
 * provisional in-app sequence per phonics-schemes.md. It is recorded per word so
 * the progression logic in decisions.md D10 has somewhere to hang later; nothing
 * in the prototype reads it yet.
 */

export const WORDS = [
  // --- Phase 2, Set 1: s a t p ---
  { id: 'sat', phase: 2, set: 1, graphemes: [
    { letters: 's', phoneme: 's' }, { letters: 'a', phoneme: 'a' }, { letters: 't', phoneme: 't' } ] },
  { id: 'pat', phase: 2, set: 1, graphemes: [
    { letters: 'p', phoneme: 'p' }, { letters: 'a', phoneme: 'a' }, { letters: 't', phoneme: 't' } ] },
  { id: 'tap', phase: 2, set: 1, graphemes: [
    { letters: 't', phoneme: 't' }, { letters: 'a', phoneme: 'a' }, { letters: 'p', phoneme: 'p' } ] },

  // --- Phase 2, Set 2: i n m d ---
  { id: 'pin', phase: 2, set: 2, graphemes: [
    { letters: 'p', phoneme: 'p' }, { letters: 'i', phoneme: 'i' }, { letters: 'n', phoneme: 'n' } ] },
  { id: 'sit', phase: 2, set: 2, graphemes: [
    { letters: 's', phoneme: 's' }, { letters: 'i', phoneme: 'i' }, { letters: 't', phoneme: 't' } ] },
  { id: 'man', phase: 2, set: 2, graphemes: [
    { letters: 'm', phoneme: 'm' }, { letters: 'a', phoneme: 'a' }, { letters: 'n', phoneme: 'n' } ] },
  { id: 'dad', phase: 2, set: 2, graphemes: [
    { letters: 'd', phoneme: 'd' }, { letters: 'a', phoneme: 'a' }, { letters: 'd', phoneme: 'd' } ] },

  // --- Phase 2, Set 3: g o c k ---
  // Note 'c' and 'k' below both carry phoneme 'k'. This is exactly the
  // letter-vs-phoneme distinction D1 exists to capture.
  { id: 'cat', phase: 2, set: 3, graphemes: [
    { letters: 'c', phoneme: 'k' }, { letters: 'a', phoneme: 'a' }, { letters: 't', phoneme: 't' } ] },
  { id: 'dog', phase: 2, set: 3, graphemes: [
    { letters: 'd', phoneme: 'd' }, { letters: 'o', phoneme: 'o' }, { letters: 'g', phoneme: 'g' } ] },
  { id: 'kid', phase: 2, set: 3, graphemes: [
    { letters: 'k', phoneme: 'k' }, { letters: 'i', phoneme: 'i' }, { letters: 'd', phoneme: 'd' } ] },

  // --- Phase 2, Sets 4-5: ck e u r h b f l ---
  // 'ck' is a two-letter grapheme for a single phoneme: one block, not two.
  { id: 'duck', phase: 2, set: 4, graphemes: [
    { letters: 'd', phoneme: 'd' }, { letters: 'u', phoneme: 'u' }, { letters: 'ck', phoneme: 'k' } ] },
  { id: 'red', phase: 2, set: 4, graphemes: [
    { letters: 'r', phoneme: 'r' }, { letters: 'e', phoneme: 'e' }, { letters: 'd', phoneme: 'd' } ] },
  { id: 'hat', phase: 2, set: 5, graphemes: [
    { letters: 'h', phoneme: 'h' }, { letters: 'a', phoneme: 'a' }, { letters: 't', phoneme: 't' } ] },
  { id: 'bus', phase: 2, set: 5, graphemes: [
    { letters: 'b', phoneme: 'b' }, { letters: 'u', phoneme: 'u' }, { letters: 's', phoneme: 's' } ] },

  // --- Phase 3: consonant digraphs ---
  // These exist in the prototype specifically to prove the grapheme model.
  // A letter-based model renders "ship" as s/h/i/p and mis-teaches /s/ /h/.
  { id: 'ship', phase: 3, set: 1, graphemes: [
    { letters: 'sh', phoneme: 'sh' }, { letters: 'i', phoneme: 'i' }, { letters: 'p', phoneme: 'p' } ] },
  { id: 'chip', phase: 3, set: 1, graphemes: [
    { letters: 'ch', phoneme: 'ch' }, { letters: 'i', phoneme: 'i' }, { letters: 'p', phoneme: 'p' } ] },
  { id: 'fish', phase: 3, set: 1, graphemes: [
    { letters: 'f', phoneme: 'f' }, { letters: 'i', phoneme: 'i' }, { letters: 'sh', phoneme: 'sh' } ] },

  // --- Phase 5: split digraph, and a silent letter ---
  // Also here to prove the model rather than to be taught this early.
  { id: 'cake', phase: 5, set: 1, graphemes: [
    { letters: 'c', phoneme: 'k' },
    { letters: 'a', phoneme: 'ai', splitTail: 'e' },
    { letters: 'k', phoneme: 'k' } ] },
  { id: 'lamb', phase: 5, set: 1, graphemes: [
    { letters: 'l', phoneme: 'l' },
    { letters: 'a', phoneme: 'a' },
    { letters: 'm', phoneme: 'm' },
    { letters: 'b', phoneme: null, silent: true } ] },
];

/**
 * The spelling of a word, reassembled from its graphemes.
 * A splitTail belongs to its grapheme but is written after the FOLLOWING one,
 * so "cake" = c + a(_e) + k reassembles as c-a-k-e, not c-ae-k.
 */
export function spelling(word) {
  let out = '';
  let pending = '';
  for (const g of word.graphemes) {
    out += g.letters;
    if (pending) { out += pending; pending = ''; }
    if (g.splitTail) pending = g.splitTail;
  }
  return out + pending;
}

/** What a grapheme block displays: 'sh', or 'a_e' for a split digraph. */
export function blockLabel(grapheme) {
  return grapheme.splitTail ? `${grapheme.letters}_${grapheme.splitTail}` : grapheme.letters;
}
