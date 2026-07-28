# Phonics Scheme Evaluation

Research for `todo.md` Now-task "Choose phonics scheme" (`decisions.md` D2).
Status: **research complete, decision not yet made.**
Date: 2026-07-28

## Framing: the choice is three separable things

A scheme bundles three layers that have *different* constraints. Conflating them
is what makes this decision feel harder than it is:

1. **The scope-and-sequence** — the grapheme/phoneme introduction order and set
   relations. This is what the *app* needs (D1, D10). Often freely documented.
2. **The branded materials** — books, decodable readers, flashcards, songs,
   action mnemonics. This is what *the author and other parents* would buy to
   supplement, and where affordability / Korea availability matter.
3. **The IP position** — whether the sequence and its mnemonics can legally be
   embedded in a shipped app. **Not previously considered, and it is the hardest
   constraint**: most schemes are commercial and their orders, mnemonics, and
   names are proprietary or trademarked.

The layers can be sourced from *different* schemes. That is the recommendation
below.

## Candidates

### A. Letters and Sounds (2007) — DfES
- **Cost:** free. Full PDF hosted on gov.uk.
- **IP:** Crown copyright, gov.uk content is normally **Open Government Licence
  v3.0** → reproducible with attribution. *This is the only candidate that can be
  embedded in a shipped app without seeking permission.* (Confirm the licence
  footer before relying on it — see open items.)
- **Accent:** UK English natively. Matches D11.
- **Status caveat:** **withdrawn** from the DfE validated list (2021). Important
  nuance — it was de-listed for lacking a complete resource/fidelity package, not
  because the progression was judged wrong. The progression remains the de-facto
  backbone of UK phonics; several modern validated schemes are "Letters and Sounds
  Revised" derivatives.
- **Materials:** no official branded books, but it is the **most widely mapped
  progression in third-party and free resources** — large numbers of decodable
  readers are labelled by L&S phase.
- **Korea availability:** irrelevant — it is a free PDF.
- **Phase 2 order:** s,a,t,p / i,n,m,d / g,o,c,k / ck,e,u,r / h,b,f,ff,l,ll,ss.

### B. Jolly Phonics — Jolly Learning
- **Cost:** commercial but **consumer-priced** (unlike school-only schemes).
- **Materials quality:** excellent and explicitly parent-facing — actions, songs,
  mnemonics, cheap readers. Best of the candidates for a guardian supplementing
  at home.
- **Korea availability:** strong. Jolly Learning publishes a **South Korea
  catalogue**, indicating official regional distribution, and Jolly Phonics is
  well established in the Korean/Asian ELT market.
- **Accent:** UK English.
- **IP:** ❌ actions, mnemonics and branding are proprietary; "Jolly Phonics" is a
  trademark. The bare letter order (s,a,t,i,p,n…) is not itself protectable, but
  the app must not embed Jolly's mnemonics or claim affiliation.
- **Compatibility note:** its order (**satipn**) is very close to Letters and
  Sounds Phase 2 (**satpin**), so L&S-in-app and Jolly-books-at-home interoperate
  well. This is what makes the split recommendation viable.

### C. Read Write Inc. — Ruth Miskin / OUP
- School-oriented, sold in institutional packs, expensive; materials gated behind
  school purchasing. Proprietary "Speed Sounds" order.
- ❌ Fails affordability and parent-acquisition criteria. Not recommended.

### D. Floppy's Phonics / Oxford Reading Tree — OUP
- DfE-validated. **Notable Korea advantage:** Oxford Reading Tree is a staple of
  the Korean English-reading retail market and is widely sold there, so
  supplementary readers are easy to acquire locally.
- But programme materials are school-priced and the sequence is proprietary.
- Best treated as a **supplementary reader source**, not the app's sequence.

### E. UFLI Foundations — University of Florida Literacy Institute
- **Cost:** free scope-and-sequence PDF, free Toolbox (slide decks, decodable
  passages, home-support activities).
- **Accent:** US / General American → **wrong for now, ideal for the 1.0+
  American English requirement (D11).**
- Well-regarded and research-based.
- → Recommended as the *future* GenAm sequence. D11 already requires the data
  model be keyed by accent, so this can be added additively.

## Recommendation

Split by layer rather than adopting one scheme wholesale:

| Layer | Choice | Why |
|---|---|---|
| App's embedded sequence | **Letters and Sounds (2007)** | Free, OGL-reusable (the only legally embeddable option), UK English per D11, most widely mapped by third-party materials |
| Parent-facing supplementary books | **Jolly Phonics**, plus Oxford Reading Tree and free decodables | Consumer-priced, high quality, genuinely available in Korea; satipn≈satpin keeps it aligned with the in-app sequence |
| 1.0+ General American sequence | **UFLI Foundations** | Free, research-based, natively GenAm |

Supplementary readers are also available **free** in quantity — large curated
libraries of printable/online decodable readers exist (Reading Doctor, Literacy
Learn, Reading Universe, Reading Elephant, UFLI passages, Starfall), many mapped
to L&S phases. So the "can parents supplement?" criterion is satisfiable at zero
cost regardless of scheme choice, with paid Jolly/ORT books as the nicer option.

## Honest gaps in this research

Verification was limited — the search tooling used is US-biased, and both
`gov.uk` and `jollylearning.co.uk` returned HTTP 403 to automated fetches. So:

- **Not verified:** current Korean retail pricing/availability on Yes24, Kyobo or
  Aladin; the specific Korean Jolly Phonics distributor and its prices.
- **Not verified directly:** the exact licence footer on the Letters and Sounds
  2007 PDF. Crown copyright + OGL v3.0 is the normal default for gov.uk
  publications and a search result corroborated OGL v3.0 for L&S-related content,
  but this should be read off the document itself before the app relies on it.
- Korean-language searches (e.g. 옥스포드 리딩 트리, 졸리 파닉스) would likely give
  much better local availability and price data than English ones.

## Sources

- Letters and Sounds 2007 PDF — https://assets.publishing.service.gov.uk/media/5a7aa7b6e5274a34770e630c/Letters_and_Sounds_-_DFES-00281-2007.pdf
- DfE list of validated phonics programmes — https://www.gov.uk/government/publications/choosing-a-phonics-teaching-programme/list-of-phonics-teaching-programmes
- Jolly Learning South Korea catalogue — https://issuu.com/jollylearning/docs/foreign_language_korea
- Jolly Learning stockists — https://www.jollylearning.co.uk/stockists/
- Floppy's Phonics programme — https://global.oup.com/education/content/primary/series/oxford-reading-tree/floppys-phonics/
- UFLI Foundations scope and sequence — https://ufli.education.ufl.edu/wp-content/uploads/2022/06/UFLI-Scope2.pdf
- UFLI Foundations Toolbox — https://ufli.education.ufl.edu/foundations/toolbox/
- Free decodable readers (Literacy Learn) — https://literacylearn.com/free-decodable-readers/
- Free decodable readers (Reading Doctor) — https://www.readingdoctor.com.au/decodable-readers
- Free decodable texts by skill (Reading Universe) — https://readinguniverse.org/article/explore-teaching-topics/word-recognition/phonics/decodable-texts-for-each-phonics-skill
