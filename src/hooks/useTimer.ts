import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = (initialTime: number, mode: 'timed' | 'passage') => {
  const [elapsed, setElapsed] = useState(mode === 'timed' ? initialTime : 0);

  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);

  const pausedTimeRef = useRef<number | null>(null);

  const totalPausedRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  console.log(mode, elapsed);
  const lastSecondRef = useRef<number>(mode === 'timed' ? initialTime : 0);

  const tick = useCallback(() => {
    if (!startTimeRef.current || !isRunning) return;

    const now = Date.now();
    const currentElapsed = Math.floor(
      (now - startTimeRef.current - totalPausedRef.current) / 1000
    );

    const nextValue =
      mode === 'timed'
        ? Math.max(0, initialTime - currentElapsed)
        : currentElapsed;

    if (nextValue !== lastSecondRef.current) {
      lastSecondRef.current = nextValue;
      setElapsed(nextValue);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, mode, initialTime]);

  const start = useCallback(() => {
    if (isRunning) return;

    if (!startTimeRef.current) startTimeRef.current = Date.now();

    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);

    pausedTimeRef.current = Date.now();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (isRunning) return;

    if (pausedTimeRef.current) {
      totalPausedRef.current += Date.now() - pausedTimeRef.current;
    }

    pausedTimeRef.current = null;
    setIsRunning(true);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;

    pausedTimeRef.current = null;

    totalPausedRef.current = 0;

    const initial = mode === 'timed' ? initialTime : 0;

    lastSecondRef.current = initial;

    setElapsed(initial);

    setIsRunning(false);
  }, [mode, initialTime]);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick]);

  return { elapsed, start, pause, resume, isRunning, resetTimer };
};
