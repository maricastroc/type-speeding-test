import { useConfig } from '@/contexts/ConfigContext';
import { Keystroke } from '@/types/keyStore';
import { buildChartData } from '@/utils/buildChartData';
import { useState, useCallback, useMemo, useEffect } from 'react';

interface TypingOptions {
  onError?: () => void;
  onSuccess?: () => void;
  onFinished?: () => void;
  initialTime?: number;
}

export const useTypingEngine = (text: string, options?: TypingOptions) => {
  const { mode } = useConfig();

  const [showChart, setShowChart] = useState(false);

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>(
    text.split(' ').map(() => '')
  );

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);

  const [timeLeft, setTimeLeft] = useState(
    mode === 'timed' ? options?.initialTime || 60 : 0
  );

  const words = useMemo(() => text.split(' '), [text]);

  const start = useCallback(() => {
    if (!startTime) {
      setStartTime(Date.now());
      setIsStarted(true);
    }
  }, [startTime]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (isPaused) return;
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

      const elapsed = Date.now() - effectiveStart;

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
    ]
  );

  const chartData = useMemo(() => {
    if (!startTime) return [];

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

    return buildChartData(keystrokes, elapsedSeconds);
  }, [keystrokes, startTime, timeLeft]);

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
    let interval: NodeJS.Timeout;

    if (startTime && !isPaused) {
      if (mode === 'timed' && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsStarted(false);
              options?.onFinished?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      if (mode === 'passage') {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev + 1);
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [startTime, isPaused, mode]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (startTime && !isPaused) {
          setIsPaused(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTime, isPaused]);

  const reset = useCallback(
    (newText: string) => {
      setIsStarted(false);
      setIsPaused(false);
      setStartTime(null);
      setActiveWordIndex(0);
      setUserInput(newText.split(' ').map(() => ''));
      setKeystrokes([]);
      setTimeLeft(mode === 'timed' ? options?.initialTime || 60 : 0);
      setShowChart(false);
    },
    [mode, options?.initialTime]
  );

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const totalTime = useMemo(() => {
    if (mode === 'timed') {
      return (options?.initialTime || 60) - timeLeft;
    }
    return timeLeft;
  }, [mode, timeLeft, options?.initialTime]);

  return {
    isStarted,
    isPaused,
    activeWordIndex,
    userInput,
    words,
    mode,
    showChart,
    keystrokes,
    totalTime,
    setShowChart,
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
