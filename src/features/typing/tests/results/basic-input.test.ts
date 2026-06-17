import { describe, it, expect } from 'vitest';
import { calculateGeneralStats } from '@/utils/calculateStats';
import { buildChartData } from '@/utils/buildChartData';
import { buildKeystrokes } from '../integration/helpers';

describe('calculateGeneralStats — basic input', () => {
  it('returns zeroed stats for empty keystrokes', () => {
    const stats = calculateGeneralStats([], [], 0);
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(stats.characters.correct).toBe(0);
    expect(stats.characters.total).toBe(0);
    expect(stats.consistency).toBe(0);
  });

  it('returns 100% accuracy for fully correct session', () => {
    const words = ['hello', 'world'];
    const keystrokes = buildKeystrokes(words, ['hello', 'world']);
    const chartData = buildChartData(keystrokes, 10);
    const stats = calculateGeneralStats(keystrokes, chartData, 10);

    expect(stats.accuracy).toBe(100);
    expect(stats.characters.correct).toBe(10);
    expect(stats.characters.total).toBe(10);
  });

  it('computes correct character counts', () => {
    const words = ['abc'];
    const keystrokes = buildKeystrokes(words, ['abc']);
    const chartData = buildChartData(keystrokes, 5);
    const stats = calculateGeneralStats(keystrokes, chartData, 5);

    expect(stats.characters.correct).toBe(3);
    expect(stats.characters.total).toBe(3);
  });

  it('peakWPM is at least as high as final wpm', () => {
    const words = ['hello', 'world', 'test'];
    const keystrokes = buildKeystrokes(words, ['hello', 'world', 'test']);
    const chartData = buildChartData(keystrokes, 10);
    const stats = calculateGeneralStats(keystrokes, chartData, 10);

    expect(stats.peakWPM).toBeGreaterThanOrEqual(stats.wpm);
  });

  it('consistency is between 0 and 100', () => {
    const words = ['hello', 'world', 'foo', 'bar'];
    const keystrokes = buildKeystrokes(words, ['hello', 'world', 'foo', 'bar']);
    const chartData = buildChartData(keystrokes, 15);
    const stats = calculateGeneralStats(keystrokes, chartData, 15);

    expect(stats.consistency).toBeGreaterThanOrEqual(0);
    expect(stats.consistency).toBeLessThanOrEqual(100);
  });

  it('time matches the provided totalTimeSeconds', () => {
    const words = ['hi'];
    const keystrokes = buildKeystrokes(words, ['hi']);
    const chartData = buildChartData(keystrokes, 5);
    const stats = calculateGeneralStats(keystrokes, chartData, 5);

    expect(stats.time).toBe(5);
  });
});
