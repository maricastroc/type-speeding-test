import { Keystroke } from '@/types/keyStore';

export const buildChartData = (
  keystrokes: Keystroke[],
  durationSec: number
) => {
  const buckets: Record<number, Keystroke[]> = {};

  for (const k of keystrokes) {
    const second = Math.floor(k.timestampMs / 1000) + 1;
    if (!buckets[second]) buckets[second] = [];
    buckets[second].push(k);
  }

  let cumulativeCorrect = 0;
  let cumulativeTotal = 0;
  const data = [];

  const maxSecond = Math.max(durationSec, ...Object.keys(buckets).map(Number));

  for (let s = 1; s <= maxSecond; s++) {
    const ksInSecond = buckets[s] || [];

    const correct = ksInSecond.filter(
      (k) => k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    const total = ksInSecond.filter((k) => k.typedChar !== 'Backspace').length;

    const errors = ksInSecond.filter(
      (k) => !k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    cumulativeCorrect += correct;
    cumulativeTotal += total;

    const minutes = s / 60;

    let wpm = 0;
    let raw = 0;

    if (cumulativeCorrect > 0 && minutes > 0) {
      const wpmValue = cumulativeCorrect / 5 / minutes;
      wpm =
        Number.isFinite(wpmValue) && !isNaN(wpmValue)
          ? Math.max(0, Math.round(wpmValue))
          : 0;
    }

    if (cumulativeTotal > 0 && minutes > 0) {
      const rawValue = cumulativeTotal / 5 / minutes;
      raw =
        Number.isFinite(rawValue) && !isNaN(rawValue)
          ? Math.max(0, Math.round(rawValue))
          : 0;
    }

    const instantMinutes = 1 / 60;
    const burst = total > 0 ? Math.round(total / 5 / instantMinutes) : 0;

    const accuracy =
      cumulativeTotal > 0
        ? Math.round((cumulativeCorrect / cumulativeTotal) * 100)
        : 100;

    const point = {
      second: s,
      wpm,
      accuracy,
      raw,
      burst,
      errors: errors > 0 ? wpm : null,
      errorCount: errors,
    };

    data.push(point);
  }

  return data;
};
