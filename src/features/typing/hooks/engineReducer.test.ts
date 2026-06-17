import { describe, it, expect } from 'vitest';
import { engineReducer, createInitialState } from './engineReducer';

const words = ['hello', 'world'];

describe('createInitialState', () => {
  it('creates state with empty input for each word', () => {
    const state = createInitialState(words);
    expect(state.userInput).toEqual(['', '']);
    expect(state.activeWordIndex).toBe(0);
    expect(state.isCompleted).toBe(false);
    expect(state.hasStarted).toBe(false);
    expect(state.isReady).toBe(false);
    expect(state.keystrokes).toEqual([]);
    expect(state.finishedTime).toBeNull();
  });
});

describe('engineReducer', () => {
  const initial = createInitialState(words);

  it('PREPARE sets isReady to true', () => {
    const state = engineReducer(initial, { type: 'PREPARE' });
    expect(state.isReady).toBe(true);
    expect(state.hasStarted).toBe(false);
  });

  it('START sets hasStarted to true', () => {
    const state = engineReducer(initial, { type: 'START' });
    expect(state.hasStarted).toBe(true);
  });

  it('TYPE_CHAR appends char and records keystroke', () => {
    const state = engineReducer(initial, {
      type: 'TYPE_CHAR',
      wordIndex: 0,
      char: 'h',
      isCorrect: true,
      timestampMs: 1000,
      charIndex: 0,
      expectedChar: 'h',
    });
    expect(state.userInput[0]).toBe('h');
    expect(state.keystrokes).toHaveLength(1);
    expect(state.keystrokes[0]).toEqual({
      charIndex: 0,
      expectedChar: 'h',
      typedChar: 'h',
      isCorrect: true,
      timestampMs: 1000,
    });
  });

  it('BACKSPACE removes last char', () => {
    const withChar = engineReducer(initial, {
      type: 'TYPE_CHAR',
      wordIndex: 0,
      char: 'h',
      isCorrect: true,
      timestampMs: 1000,
      charIndex: 0,
      expectedChar: 'h',
    });
    const state = engineReducer(withChar, { type: 'BACKSPACE', wordIndex: 0 });
    expect(state.userInput[0]).toBe('');
  });

  it('ADVANCE_WORD increments activeWordIndex', () => {
    const state = engineReducer(initial, { type: 'ADVANCE_WORD' });
    expect(state.activeWordIndex).toBe(1);
  });

  it('FINISH sets isCompleted and finishedTime', () => {
    const state = engineReducer(initial, { type: 'FINISH', finalTime: 42 });
    expect(state.isCompleted).toBe(true);
    expect(state.finishedTime).toBe(42);
  });

  it('RESET returns to initial state with new words', () => {
    const started = engineReducer(initial, { type: 'START' });
    const state = engineReducer(started, { type: 'RESET', words: ['foo', 'bar'] });
    expect(state.hasStarted).toBe(false);
    expect(state.userInput).toEqual(['', '']);
    expect(state.activeWordIndex).toBe(0);
  });
});
