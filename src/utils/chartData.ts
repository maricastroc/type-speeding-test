export const chartData = useMemo(() => {
  if (!keystrokes.length || !startTime) return [];

  const durationSec = Math.ceil(
    keystrokes[keystrokes.length - 1].timestampMs / 1000
  );

  const data = [];

  let cumulativeCorrect = 0;
  let cumulativeTotal = 0;

  for (let s = 1; s <= durationSec; s++) {
    const start = (s - 1) * 1000;
    const end = s * 1000;

    const ksInSecond = keystrokes.filter(
      (k) => k.timestampMs >= start && k.timestampMs < end
    );

    const correctInSecond = ksInSecond.filter(
      (k) => k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    const totalInSecond = ksInSecond.filter(
      (k) => k.typedChar !== 'Backspace'
    ).length;

    const errorsInSecond = ksInSecond.filter(
      (k) => !k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    cumulativeCorrect += correctInSecond;
    cumulativeTotal += totalInSecond;

    const wpm = Math.round(cumulativeCorrect / 5 / (s / 60));
    const raw = Math.round(cumulativeTotal / 5 / (s / 60));
    const burst = totalInSecond * 12;

    data.push({
      second: s,
      wpm,
      raw,
      burst,
      errors: errorsInSecond > 0 ? wpm : null,
      errorCount: errorsInSecond,
    });
  }

  return data;
}, [keystrokes, startTime]);
