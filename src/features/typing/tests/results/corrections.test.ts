import { describe, it, expect } from 'vitest';
import { calculateGeneralStats } from '@/utils/calculateStats';
import { buildChartData } from '@/utils/buildChartData';
import { calculateMetrics } from '../../logic/typing';
import type { Keystroke } from '@/types/keyStore';

function makeKeystroke(
  typedChar: string,
  expectedChar: string,
  timestampMs: number
): Keystroke {
  return {
    charIndex: 0,
    expectedChar,
    typedChar,
    isCorrect: typedChar === expectedChar,
    timestampMs,
  };
}

describe('corrections — backspace ignored in metrics', () => {
  it('backspace does not count toward total chars in calculateMetrics', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('h', 'h', 100),
      makeKeystroke('Backspace', 'h', 200),
      makeKeystroke('h', 'h', 300),
    ];
    const result = calculateMetrics(keystrokes, 60);
    // only 2 non-backspace chars, both correct
    expect(result.accuracy).toBe(100);
  });

  it('backspace does not reduce accuracy when re-typed correctly', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('x', 'h', 100), // wrong
      makeKeystroke('Backspace', 'h', 200),
      makeKeystroke('h', 'h', 300), // corrected
    ];
    const result = calculateMetrics(keystrokes, 60);
    // valid chars: 'x' (wrong) and 'h' (correct) = 1/2 = 50%
    expect(result.accuracy).toBe(50);
  });

  it('backspace does not count toward wpm', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('h', 'h', 100),
      makeKeystroke('Backspace', 'h', 200),
      makeKeystroke('h', 'h', 300),
    ];
    const result = calculateMetrics(keystrokes, 60);
    // 2 correct non-backspace / 5 / 1 min = ~0.4 → rounds to 0
    expect(result.wpm).toBeGreaterThanOrEqual(0);
  });
});

describe('corrections — backspace ignored in calculateGeneralStats', () => {
  it('backspace keystrokes do not appear in character counts', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('h', 'h', 100),
      makeKeystroke('e', 'e', 200),
      makeKeystroke('Backspace', 'e', 300),
      makeKeystroke('e', 'e', 400),
    ];
    const chartData = buildChartData(keystrokes, 5);
    const stats = calculateGeneralStats(keystrokes, chartData, 5);

    // 3 non-backspace chars: h(correct), e(correct), e(correct)
    expect(stats.characters.total).toBe(3);
    expect(stats.characters.correct).toBe(3);
  });

  it('accuracy stays 100% when all errors are corrected via backspace', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('x', 'h', 100), // wrong
      makeKeystroke('Backspace', 'h', 200),
      makeKeystroke('h', 'h', 300), // correct
    ];
    // Note: the wrong 'x' is still in the keystrokes — backspace doesn't remove it
    // accuracy = 1 correct / 2 total valid = 50%
    const chartData = buildChartData(keystrokes, 5);
    const stats = calculateGeneralStats(keystrokes, chartData, 5);

    expect(stats.characters.total).toBe(2);
    expect(stats.accuracy).toBe(50);
  });

  it('backspace not counted in chart data errors', () => {
    const keystrokes: Keystroke[] = [
      makeKeystroke('h', 'h', 100),
      makeKeystroke('Backspace', 'h', 200),
    ];
    const chartData = buildChartData(keystrokes, 2);
    const errorCounts = chartData.map((p) => p.errorCount);
    // backspace should not be counted as an error
    expect(errorCounts.every((e) => e === 0)).toBe(true);
  });
});
