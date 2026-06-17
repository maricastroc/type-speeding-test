import { engineReducer, createInitialState, type EngineState } from '../../hooks/engineReducer';

export function typeChar(
  state: EngineState,
  wordIndex: number,
  char: string,
  expectedWord: string,
  timestampMs: number
): EngineState {
  const currentTyped = state.userInput[wordIndex] ?? '';
  const charPosInWord = currentTyped.length;
  const expectedChar = expectedWord[charPosInWord] ?? '';
  return engineReducer(state, {
    type: 'TYPE_CHAR',
    wordIndex,
    char,
    isCorrect: char === expectedChar,
    timestampMs,
    charIndex: charPosInWord,
    expectedChar,
  });
}

export function typeWord(
  state: EngineState,
  wordIndex: number,
  typed: string,
  expectedWord: string,
  startMs = 0
): EngineState {
  let s = state;
  for (let i = 0; i < typed.length; i++) {
    s = typeChar(s, wordIndex, typed[i], expectedWord, startMs + i * 100);
  }
  return s;
}

export function simulateSession(
  words: string[],
  typedWords: string[],
  opts: { withStart?: boolean } = {}
): EngineState {
  let state = createInitialState(words);
  state = engineReducer(state, { type: 'PREPARE' });

  if (opts.withStart !== false) {
    state = engineReducer(state, { type: 'START' });
  }

  for (let i = 0; i < typedWords.length; i++) {
    state = typeWord(state, i, typedWords[i], words[i], i * 1000);
    if (i < typedWords.length - 1) {
      state = engineReducer(state, { type: 'ADVANCE_WORD' });
    }
  }

  return state;
}

export function buildKeystrokes(
  words: string[],
  typedWords: string[],
  startMs = 0
) {
  const keystrokes = [];
  let offset = startMs;

  for (let wi = 0; wi < typedWords.length; wi++) {
    const word = words[wi];
    const typed = typedWords[wi];
    for (let ci = 0; ci < typed.length; ci++) {
      const expectedChar = word[ci] ?? '';
      keystrokes.push({
        charIndex: ci,
        expectedChar,
        typedChar: typed[ci],
        isCorrect: typed[ci] === expectedChar,
        timestampMs: offset + ci * 100,
      });
    }
    offset += typed.length * 100 + 200;
  }

  return keystrokes;
}
