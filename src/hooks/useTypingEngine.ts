import { useConfig } from '@/contexts/ConfigContext';
import { Keystroke } from '@/types/keyStore';
import { RoundStats } from '@/types/roundStats';
import { buildChartData } from '@/utils/buildChartData';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

interface TypingOptions {
  onError?: () => void;
  onSuccess?: () => void;
  onFinished?: () => void;
  initialTime?: number;
}

export const useTypingEngine = (text: string, options?: TypingOptions) => {
  const { mode, difficulty } = useConfig();

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>(
    text.split(' ').map(() => '')
  );

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finishedTime, setFinishedTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);

  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);

  const [initialTime] = useState(options?.initialTime || 60);
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? initialTime : 0);

  const words = useMemo(() => text.split(' '), [text]);

  const animationFrameRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!startTime) {
      setStartTime(Date.now());
      setIsStarted(true);
    }
  }, [startTime]);

  const updateTime = useCallback(() => {
    if (!startTime || isPaused || isCompleted) return;

    const now = Date.now();
    const effectiveStart = startTime + totalPausedDuration;

    if (mode === 'timed') {
      const elapsed = Math.floor((now - effectiveStart) / 1000);
      const newTimeLeft = Math.max(0, initialTime - elapsed);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        finishTest();
        return;
      }
    } else {
      const elapsed = Math.floor((now - effectiveStart) / 1000);
      setTimeLeft(elapsed);
    }

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [
    startTime,
    isPaused,
    isCompleted,
    mode,
    initialTime,
    totalPausedDuration,
  ]);

  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStarted, isPaused, isCompleted, updateTime]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (isPaused || isCompleted) return;
      if (mode === 'timed' && timeLeft === 0) return;

      const currentWord = words[activeWordIndex];
      const currentTyped = userInput[activeWordIndex];

      if (!currentWord || currentTyped === undefined) return;

      let effectiveStart = startTime;

      if (!effectiveStart) {
        effectiveStart = Date.now();
        setStartTime(effectiveStart);
        setIsStarted(true);
      }

      const elapsed = Date.now() - effectiveStart - totalPausedDuration;

      if (key.length === 1 && key !== ' ') {
        const isCorrect = key === currentWord[currentTyped.length];

        setKeystrokes((prev) => [
          ...prev,
          {
            timestampMs: elapsed,
            isCorrect,
            typedChar: key,
          },
        ]);

        if (isCorrect) {
          options?.onSuccess?.();
        } else {
          options?.onError?.();
        }

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
      isPaused,
      mode,
      timeLeft,
      words,
      activeWordIndex,
      userInput,
      startTime,
      options,
      totalPausedDuration,
    ]
  );

  const finishTest = useCallback(() => {
    if (isCompleted || !startTime) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - startTime - totalPausedDuration) / 1000
    );

    setFinishedTime(elapsedSeconds);
    setIsCompleted(true);
    setIsStarted(false);
    options?.onFinished?.();
  }, [isCompleted, startTime, totalPausedDuration, options]);

  const chartData = useMemo(() => {
    if (!startTime) return [];

    const elapsedSeconds =
      finishedTime !== null
        ? finishedTime
        : Math.floor((Date.now() - startTime - totalPausedDuration) / 1000);

    return buildChartData(keystrokes, elapsedSeconds);
  }, [keystrokes, startTime, finishedTime, totalPausedDuration]);

  const metrics = useMemo(() => {
    if (!chartData.length) return { wpm: 0, accuracy: 100 };

    const last = chartData[chartData.length - 1];

    const totalCorrect = keystrokes.filter(
      (k) => k.isCorrect && k.typedChar !== 'Backspace'
    ).length;

    const totalTyped = keystrokes.filter(
      (k) => k.typedChar !== 'Backspace'
    ).length;

    const accuracy = totalTyped
      ? Math.round((totalCorrect / totalTyped) * 100)
      : 100;

    return {
      wpm: last.wpm,
      accuracy,
    };
  }, [chartData, keystrokes]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (startTime && !isPaused && !isCompleted) {
          setPausedTime(Date.now());
          setIsPaused(true);

          // Cancela o loop de animação
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      } else {
        if (isPaused && pausedTime) {
          // Calcula quanto tempo ficou pausado
          const pauseDuration = Date.now() - pausedTime;
          setTotalPausedDuration((prev) => prev + pauseDuration);
          setPausedTime(null);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTime, isPaused, isCompleted, pausedTime]);

  const reset = useCallback(
    (newText: string) => {
      // Cancela o loop de animação
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsStarted(false);
      setIsPaused(false);
      setStartTime(null);
      setActiveWordIndex(0);
      setUserInput(newText.split(' ').map(() => ''));
      setKeystrokes([]);
      setTimeLeft(mode === 'timed' ? initialTime : 0);
      setIsCompleted(false);
      setFinishedTime(null);
      setPausedTime(null);
      setTotalPausedDuration(0);
    },
    [mode, initialTime]
  );

  const resume = useCallback(() => {
    setIsPaused(false);
    setPausedTime(null);
  }, []);

  const totalTime = useMemo(() => {
    if (finishedTime !== null) return finishedTime;

    if (mode === 'timed') {
      return initialTime - timeLeft;
    }

    return timeLeft;
  }, [finishedTime, mode, timeLeft, initialTime]);

  useEffect(() => {
    if (isCompleted) return;

    const isLastWord = activeWordIndex === words.length - 1;
    const currentWord = words[activeWordIndex];
    const currentTyped = userInput[activeWordIndex];

    const finishedAllWords = isLastWord && currentTyped === currentWord;

    if (finishedAllWords) {
      finishTest();
    }
  }, [userInput, activeWordIndex, words, isCompleted, finishTest]);

  const getRoundStats = useCallback((): Omit<
    RoundStats,
    'id' | 'timestamp'
  > | null => {
    if (!finishedTime || !metrics.wpm) return null;

    return {
      mode,
      difficulty: difficulty,
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      time: finishedTime,
    };
  }, [finishedTime, metrics, keystrokes, mode, text, words]);

  return {
    isStarted,
    isPaused,
    activeWordIndex,
    userInput,
    words,
    mode,
    keystrokes,
    totalTime,
    isCompleted,
    finishedTime,
    getRoundStats,
    setIsCompleted,
    start,
    handleKeyDown,
    reset,
    resume,
    setIsPaused,
    metrics,
    timeLeft,
    chartData,
  };
};
