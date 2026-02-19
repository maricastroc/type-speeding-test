import { useState, useCallback, useMemo, useEffect } from 'react';

interface TypingOptions {
  onError?: () => void;
  onSuccess?: () => void;
  onFinished?: () => void;
  initialTime?: number;
}

export const useTypingEngine = (text: string, options?: TypingOptions) => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const [userInput, setUserInput] = useState<string[]>(() =>
    text.split(' ').map(() => '')
  );

  const [isStarted, setIsStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);

  const [totalChars, setTotalChars] = useState(0);

  const [errors, setErrors] = useState(0);

  const [timeLeft, setTimeLeft] = useState(options?.initialTime || 60);

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isPaused && timeLeft > 0) {
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

    return () => clearInterval(interval);
  }, [isStarted, isPaused, timeLeft, options]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isStarted && !isPaused) {
        setIsPaused(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isStarted, isPaused]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (!isStarted || timeLeft === 0) return;

      if (!startTime) setStartTime(Date.now());

      const currentTyped = userInput[activeWordIndex];
      const currentWord = words[activeWordIndex];

      if (key.length === 1 && key !== ' ') {
        const isCorrect = key === currentWord[currentTyped.length];

        setTotalChars((prev) => prev + 1);
        if (isCorrect) {
          options?.onSuccess?.();
        } else {
          setErrors((prev) => prev + 1);
          options?.onError?.();
        }

        const newUserInput = [...userInput];
        newUserInput[activeWordIndex] = currentTyped + key;
        setUserInput(newUserInput);
        return;
      }

      if (key === ' ') {
        if (currentTyped.length > 0 && activeWordIndex < words.length - 1) {
          setTotalChars((prev) => prev + 1);
          setActiveWordIndex((prev) => prev + 1);
        }
        return;
      }

      if (key === 'Backspace') {
        if (currentTyped.length === 0 && activeWordIndex > 0) {
          setActiveWordIndex((prev) => prev - 1);
        } else {
          const newUserInput = [...userInput];
          newUserInput[activeWordIndex] = currentTyped.slice(0, -1);
          setUserInput(newUserInput);
        }
        return;
      }
    },
    [isStarted, activeWordIndex, words, userInput, startTime, timeLeft, options]
  );

  const metrics = useMemo(() => {
    if (!startTime || totalChars === 0) return { wpm: 0, accuracy: 100 };

    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wpm = Math.round(totalChars / 5 / (elapsedMinutes || 0.01));

    const accuracy = Math.round(((totalChars - errors) / totalChars) * 100);

    return { wpm, accuracy: Math.max(0, accuracy) };
  }, [totalChars, errors, startTime]);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(
    (newText: string) => {
      setIsStarted(false);
      setActiveWordIndex(0);
      setUserInput(newText.split(' ').map(() => ''));
      setStartTime(null);
      setTotalChars(0);
      setErrors(0);
      setTimeLeft(options?.initialTime || 60);
    },
    [options?.initialTime]
  );

  return {
    isStarted,
    isPaused,
    activeWordIndex,
    userInput,
    words,
    start: () => setIsStarted(true),
    handleKeyDown,
    reset,
    resume,
    metrics,
    timeLeft,
  };
};
