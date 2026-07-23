Author: AdHocOntology
Date: 2026-07-22

The concept for now is simple, but will be built on iteratively once implemented.

The user(s) (a child with their guardian) will open the app and a word will be displayed, e.g. “cat”.

Each letter will be in a block. The child will be able to press on each letter to play an accurate phonic sound. Accurate to the respective word, obviously.

Then, when the child is ready they can try to say the word: “cat” and the app will play there voice back to them.

They will then be awarded a pass if they accurately said the right word intelligibly.

The dream here is accurate voice recognition that only awards a “pass” to the actual word (or a near approximation). I suspect that might be very hard to implement and test thoroughly, so initially a simple

Press record button -> playback -> check with guardian -> guardian presses fail or pass

type of sequence will be sufficient for testing the idea.

Additional notes:

- aimed at mobile / tablets  (initially android)
- ideally would like to be able test it on my iPhone somehow (installable PWA?)
- built in wordlist for testing. After testing wordlist CRUD may be required
- wordlists should be eventually tiered and highly curated to balance difficulty and ensure exposure to appropriate breadth of sounds/words/phonics/letters; progression and difficulty management here is key
- 2d animations and graphics will be very important for 1.0
- young child motivating reward & stimulation loops will be essential for 1.0
- voice guidance: “what is this word?” “Press the letters to hear the sound” cues will be essential for 1.0
- pedagogically speaking, an prior learning stage targeted mode would be good, e.g. just first phonics with individual sounds / phonics / letters and a curated selection of short simple words that cover the basic
