import { Keystroke } from '@/types/keyStore';

export const buildChartData = (
  keystrokes: Keystroke[],
  durationSec: number
) => {
  console.log('buildChartData inputs:', {
    keystrokesCount: keystrokes.length,
    durationSec,
  });

  if (!keystrokes.length || durationSec <= 0) {
    console.log('Retornando array vazio - condições não atendidas');
    return [];
  }

  const buckets: Record<number, Keystroke[]> = {};

  for (const k of keystrokes) {
    const second = Math.floor(k.timestampMs / 1000) + 1;
    if (!buckets[second]) buckets[second] = [];
    buckets[second].push(k);
  }

  console.log('Buckets criados:', Object.keys(buckets).map(Number));

  let cumulativeCorrect = 0;
  let cumulativeTotal = 0;
  const data = [];

  const maxSecond = Math.max(durationSec, ...Object.keys(buckets).map(Number));
  console.log('maxSecond:', maxSecond);

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

    // Minutos decorridos até este segundo
    const minutes = s / 60;

    // Log para debug do primeiro segundo
    if (s === 1) {
      console.log('Segundo 1:', {
        cumulativeCorrect,
        cumulativeTotal,
        minutes,
        charsPer5: cumulativeCorrect / 5,
        wpmCalc: cumulativeCorrect / 5 / minutes,
      });
    }

    // Calcular WPM com validação extra
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

    // Log do ponto criado
    if (s <= 3) {
      console.log(`Ponto segundo ${s}:`, point);
    }

    data.push(point);
  }

  console.log('Dados finais:', data);
  return data;
};
