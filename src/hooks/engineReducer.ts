import type { Keystroke } from '@/types/keyStore';

export type EngineState = {
  activeWordIndex: number;
  userInput: string[];
  keystrokes: Keystroke[];
  isCompleted: boolean;
  isReady: boolean;
  hasStarted: boolean;
  finishedTime: number | null;
};

export type EngineAction =
  | { type: 'PREPARE' }
  | { type: 'RESET'; words: string[] }
  | { type: 'START' }
  | { type: 'TYPE_CHAR'; wordIndex: number; char: string; isCorrect: boolean; timestampMs: number }
  | { type: 'BACKSPACE'; wordIndex: number }
  | { type: 'ADVANCE_WORD' }
  | { type: 'FINISH'; finalTime: number };

export function createInitialState(words: string[]): EngineState {
  return {
    activeWordIndex: 0,
    userInput: words.map(() => ''),
    keystrokes: [],
    isCompleted: false,
    isReady: false,
    hasStarted: false,
    finishedTime: null,
  };
}

export function engineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case 'PREPARE':
      return { ...state, isReady: true, hasStarted: false };

    case 'RESET':
      return createInitialState(action.words);

    case 'START':
      return { ...state, hasStarted: true };

    case 'TYPE_CHAR': {
      const userInput = [...state.userInput];
      userInput[action.wordIndex] = userInput[action.wordIndex] + action.char;
      return {
        ...state,
        userInput,
        keystrokes: [
          ...state.keystrokes,
          { timestampMs: action.timestampMs, isCorrect: action.isCorrect, typedChar: action.char },
        ],
      };
    }

    case 'BACKSPACE': {
      const userInput = [...state.userInput];
      userInput[action.wordIndex] = userInput[action.wordIndex].slice(0, -1);
      return { ...state, userInput };
    }

    case 'ADVANCE_WORD':
      return { ...state, activeWordIndex: state.activeWordIndex + 1 };

    case 'FINISH':
      return { ...state, isCompleted: true, finishedTime: action.finalTime };

    default:
      return state;
  }
}
