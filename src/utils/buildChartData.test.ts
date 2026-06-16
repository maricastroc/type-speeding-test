import { describe, it, expect } from 'vitest';
import { buildChartData } from './buildChartData';

describe('buildChartData', () => {
  it('returns empty array for empty keystrokes', () => {
    expect(buildChartData([], 0)).toEqual([]);
  });

  it('groups keystrokes by second', () => {
    const keystrokes = [
      { timestampMs: 500, isCorrect: true, typedChar: 'a' },
      { timestampMs: 1500, isCorrect: true, typedChar: 'b' },
    ];
    const data = buildChartData(keystrokes, 2);
    expect(data).toHaveLength(2);
    expect(data[0].second).toBe(1);
    expect(data[1].second).toBe(2);
  });

  it('wpm is 0 when no correct keystrokes', () => {
    const keystrokes = [{ timestampMs: 500, isCorrect: false, typedChar: 'x' }];
    const data = buildChartData(keystrokes, 1);
    expect(data[0].wpm).toBe(0);
  });

  it('ignores Backspace in wpm and raw calculation', () => {
    const keystrokes = [
      { timestampMs: 500, isCorrect: true, typedChar: 'a' },
      { timestampMs: 600, isCorrect: false, typedChar: 'Backspace' },
    ];
    const data = buildChartData(keystrokes, 1);
    expect(data[0].raw).toBe(12); // 1 char / 5 / (1/60)
    expect(data[0].wpm).toBe(12);
  });

  it('counts errors correctly', () => {
    const keystrokes = [
      { timestampMs: 500, isCorrect: true, typedChar: 'a' },
      { timestampMs: 600, isCorrect: false, typedChar: 'x' },
    ];
    const data = buildChartData(keystrokes, 1);
    expect(data[0].errorCount).toBe(1);
  });

  it('pads seconds up to durationSec', () => {
    const keystrokes = [{ timestampMs: 500, isCorrect: true, typedChar: 'a' }];
    const data = buildChartData(keystrokes, 3);
    expect(data).toHaveLength(3);
  });
});
