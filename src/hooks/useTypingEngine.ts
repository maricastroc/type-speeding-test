import { useState, useCallback, useMemo } from 'react';

interface TypingOptions {
  onError?: () => void;
  onSuccess?: () => void;
}

export const useTypingEngine = (text: string, options?: TypingOptions) => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const [userInput, setUserInput] = useState<string[]>(() =>
    text.split(' ').map(() => '')
  );
  const [isStarted, setIsStarted] = useState(false);

  const words = useMemo(() => text.split(' '), [text]);

  const start = useCallback(() => setIsStarted(true), []);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (!isStarted) return;

      const currentTyped = userInput[activeWordIndex];

      const currentWord = words[activeWordIndex];

      if (key.length === 1 && key !== ' ') {
        const isCorrect = key === currentWord[currentTyped.length];

        if (isCorrect) {
          options?.onSuccess?.();
        } else {
          options?.onError?.();
        }

        const newUserInput = [...userInput];
        newUserInput[activeWordIndex] = currentTyped + key;
        setUserInput(newUserInput);
        return;
      }

      if (key === ' ') {
        if (currentTyped.length > 0 && activeWordIndex < words.length - 1) {
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

      if (key.length === 1) {
        const newUserInput = [...userInput];
        newUserInput[activeWordIndex] = currentTyped + key;
        setUserInput(newUserInput);
      }
    },
    [isStarted, activeWordIndex, words, userInput]
  );

  const reset = useCallback((newText: string) => {
    setIsStarted(false);
    setActiveWordIndex(0);
    setUserInput(newText.split(' ').map(() => ''));
  }, []);

  return {
    isStarted,
    activeWordIndex,
    userInput,
    words,
    start,
    handleKeyDown,
    reset,
  };
};
