import { describe, it, expect } from 'vitest';
import {
  canAdvanceWord,
  isLastWordComplete,
  canTypeMoreChars,
  calculateMetrics,
} from './typing';

describe('canAdvanceWord', () => {
  it('returns true when typed has chars and not on last word', () => {
    expect(canAdvanceWord('hello', 0, 3)).toBe(true);
  });

  it('returns false when typed is empty', () => {
    expect(canAdvanceWord('', 0, 3)).toBe(false);
  });

  it('returns false when on last word', () => {
    expect(canAdvanceWord('hello', 2, 3)).toBe(false);
  });
});

describe('isLastWordComplete', () => {
  const words = ['hello', 'world'];

  it('returns true when last word is fully typed', () => {
    expect(isLastWordComplete(1, words, ['hello', 'world'])).toBe(true);
  });

  it('returns false when last word is partially typed', () => {
    expect(isLastWordComplete(1, words, ['hello', 'wor'])).toBe(false);
  });

  it('returns false when not on last word', () => {
    expect(isLastWordComplete(0, words, ['hello', ''])).toBe(false);
  });
});

describe('canTypeMoreChars', () => {
  it('returns true when typed is shorter than word + 10', () => {
    expect(canTypeMoreChars('hello', 'hello')).toBe(true);
  });

  it('returns false when typed reaches word length + 10', () => {
    const typed = 'hello     extra'; // 15 chars, word is 5
    expect(canTypeMoreChars(typed, 'hello')).toBe(false);
  });

  it('returns true when typed is empty', () => {
    expect(canTypeMoreChars('', 'word')).toBe(true);
  });
});

describe('calculateMetrics', () => {
  it('returns zeros when keystrokes is empty', () => {
    expect(calculateMetrics([], 10)).toEqual({ wpm: 0, accuracy: 100 });
  });

  it('calculates wpm and accuracy correctly', () => {
    const keystrokes = [
      { timestampMs: 1000, isCorrect: true, typedChar: 'h' },
      { timestampMs: 2000, isCorrect: true, typedChar: 'e' },
      { timestampMs: 3000, isCorrect: true, typedChar: 'l' },
      { timestampMs: 4000, isCorrect: true, typedChar: 'l' },
      { timestampMs: 5000, isCorrect: true, typedChar: 'o' },
      { timestampMs: 6000, isCorrect: false, typedChar: 'x' },
    ];
    const result = calculateMetrics(keystrokes, 60);
    expect(result.wpm).toBe(1); // 5 correct / 5 chars per word / 1 min
    expect(result.accuracy).toBe(83); // 5/6
  });

  it('ignores Backspace keystrokes in accuracy', () => {
    const keystrokes = [
      { timestampMs: 1000, isCorrect: true, typedChar: 'a' },
      { timestampMs: 2000, isCorrect: false, typedChar: 'Backspace' },
    ];
    const result = calculateMetrics(keystrokes, 60);
    expect(result.accuracy).toBe(100); // backspace ignored, 1 correct / 1 total
  });
});
