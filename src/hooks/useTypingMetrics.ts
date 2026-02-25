import { useMemo } from 'react';
import { Keystroke } from '@/types/keyStore';

export const useTypingMetrics = (
  keystrokes: Keystroke[],
  elapsedSeconds: number
) => {
  return useMemo(() => {
    if (!elapsedSeconds) return { wpm: 0, accuracy: 100 };

    const correct = keystrokes.filter((k) => k.isCorrect).length;

    const total = keystrokes.length;

    const accuracy = total ? Math.round((correct / total) * 100) : 100;

    const wpm = Math.round(correct / 5 / (elapsedSeconds / 60));

    return { wpm, accuracy };
  }, [keystrokes, elapsedSeconds]);
};
