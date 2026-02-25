import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useConfig } from '@/contexts/ConfigContext';
import { useTimer } from './useTimer';
import { buildChartData } from '@/utils/buildChartData';

import type { Keystroke } from '@/types/keyStore';
import type { RoundStats } from '@/types/roundStats';
import type { historyStats } from '@/types/historyStats';

interface TypingOptions {
  onError?: () => void;
  onSuccess?: () => void;
  onFinished?: (data: historyStats) => void;
  initialTime?: number;
}

export const useTypingEngine = (text: string, options?: TypingOptions) => {
  const { mode, difficulty } = useConfig();

  const words = useMemo(() => text.split(' '), [text]);

  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const [userInput, setUserInput] = useState<string[]>(words.map(() => ''));

  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);

  const [isCompleted, setIsCompleted] = useState(false);

  const [isReady, setIsReady] = useState(false);

  const [finishedTime, setFinishedTime] = useState<number | null>(null);

  const [hasStarted, setHasStarted] = useState(false);

  const initialTime = options?.initialTime || 10;

  const hasSavedRef = useRef(false);
  const isFinishingRef = useRef(false);

  const {
    elapsed,
    start: startTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    isRunning,
    resetTimer,
  } = useTimer(options?.initialTime || 10, mode);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (isCompleted) return;

      if (!isReady) return;

      if (!isRunning && !isCompleted && key !== 'Escape') {
        setHasStarted(true);
        startTimer();
      }

      const currentWord = words[activeWordIndex];
      const currentTyped = userInput[activeWordIndex];

      const timestampMs = elapsed * 1000;

      if (key.length === 1 && key !== ' ') {
        const isCorrect = key === currentWord[currentTyped.length];

        setKeystrokes((prev) => [
          ...prev,
          { timestampMs, isCorrect, typedChar: key },
        ]);

        if (isCorrect) options?.onSuccess?.();
        else options?.onError?.();

        if (currentTyped.length >= currentWord.length + 10) return;

        setUserInput((prev) => {
          const updated = [...prev];
          updated[activeWordIndex] = currentTyped + key;
          return updated;
        });
        return;
      }

      if (key === ' ') {
        if (currentTyped.length > 0 && activeWordIndex < words.length - 1) {
          setActiveWordIndex((prev) => prev + 1);
        }
        return;
      }

      if (key === 'Backspace') {
        setUserInput((prev) => {
          const updated = [...prev];
          updated[activeWordIndex] = currentTyped.slice(0, -1);
          return updated;
        });
      }
    },
    [
      isRunning,
      isReady,
      isCompleted,
      startTimer,
      elapsed,
      words,
      activeWordIndex,
      userInput,
      options,
    ]
  );

  const prepare = useCallback(() => {
    setIsReady(true);
    setHasStarted(false);
  }, []);

  const reset = useCallback(
    (newText: string) => {
      const newWords = newText.split(' ');
      resetTimer();

      hasSavedRef.current = false;
      isFinishingRef.current = false;

      setIsReady(false);
      setActiveWordIndex(0);
      setUserInput(newWords.map(() => ''));
      setKeystrokes([]);
      setIsCompleted(false);
      setFinishedTime(null);
    },
    [resetTimer]
  );

  const totalTimeSpent = useMemo(() => {
    return finishedTime !== null ? finishedTime : elapsed;
  }, [finishedTime, elapsed]);

  const chartData = useMemo(() => {
    return buildChartData(keystrokes, totalTimeSpent);
  }, [keystrokes, totalTimeSpent]);

  const metrics = useMemo(() => {
    if (!chartData.length) return { wpm: 0, accuracy: 100 };
    const last = chartData[chartData.length - 1];
    const totalTyped = keystrokes.filter(
      (k) => k.typedChar !== 'Backspace'
    ).length;
    const totalCorrect = keystrokes.filter(
      (k) => k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    return {
      wpm: last.wpm,
      accuracy: totalTyped
        ? Math.round((totalCorrect / totalTyped) * 100)
        : 100,
    };
  }, [chartData, keystrokes]);

  const start = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    startTimer();
  }, [hasStarted, startTimer]);

  const finishTest = useCallback(() => {
    if (isFinishingRef.current) {
      return;
    }

    if (isCompleted) return;
    if (!hasStarted) return;
    if (hasSavedRef.current) return;

    isFinishingRef.current = true;
    hasSavedRef.current = true;

    pauseTimer();

    const finalTime = mode === 'timed' ? initialTime - elapsed : elapsed;

    setFinishedTime(finalTime);
    setIsCompleted(true);

    const totalTyped = keystrokes.filter(
      (k) => k.typedChar !== 'Backspace'
    ).length;

    if (totalTyped === 0) {
      isFinishingRef.current = false;
      return;
    }

    const totalCorrect = keystrokes.filter(
      (k) => k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    const accuracy = Math.round((totalCorrect / totalTyped) * 100);
    const wpm = metrics.wpm;

    options?.onFinished?.({
      wpm,
      accuracy,
      time: finalTime,
    });
  }, [
    isCompleted,
    hasStarted,
    pauseTimer,
    elapsed,
    keystrokes,
    metrics,
    options,
  ]);

  useEffect(() => {
    if (isCompleted || !hasStarted) return;

    let shouldFinish = false;

    const isLastWordCompleted =
      activeWordIndex === words.length - 1 &&
      userInput[activeWordIndex] === words[activeWordIndex];

    const isTimeUp = mode === 'timed' && elapsed <= 0 && isRunning;

    shouldFinish = isLastWordCompleted || isTimeUp;

    if (shouldFinish && !isFinishingRef.current) {
      finishTest();
    }
  }, [
    activeWordIndex,
    userInput,
    words,
    mode,
    elapsed,
    isRunning,
    isCompleted,
    hasStarted,
    finishTest,
  ]);

  const getRoundStats = useCallback((): Omit<
    RoundStats,
    'id' | 'timestamp'
  > | null => {
    if (!finishedTime || !metrics.wpm) return null;
    return {
      mode,
      difficulty,
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      time: finishedTime,
    };
  }, [finishedTime, metrics, mode, difficulty]);

  return {
    isStarted: hasStarted,
    isPaused: hasStarted && !isRunning && !isCompleted,
    activeWordIndex,
    userInput,
    words,
    mode,
    keystrokes,
    totalTime: totalTimeSpent,
    isCompleted,
    finishedTime,
    isReady,
    prepare,
    getRoundStats,
    start,
    handleKeyDown,
    reset,
    resume: resumeTimer,
    pause: pauseTimer,
    metrics,
    timeLeft: elapsed,
    chartData,
  };
};
