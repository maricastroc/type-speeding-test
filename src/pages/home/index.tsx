'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useEffect, useMemo, useRef, useState } from 'react';
import { texts } from '@/data/texts';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import {
  faAngleRight,
  faArrowRotateRight,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useSound } from '@/contexts/SoundContext';
import { WordDisplay } from '@/components/WordDisplay';
import { TagsContainer } from '@/components/TagsContainer';
import { PauseWarning } from '@/components/PauseWarning';
import { MetricsPanel } from '@/components/MetricsPanel';
import useRequest from '@/hooks/useRequest';
import { useConfig } from '@/contexts/ConfigContext';
import { calculateGeneralStats } from '@/utils/calculateStats';
import { ResultSection } from '@/components/ResultSection';

export default function Home() {
  const { playKeystroke, playErrorSound } = useSound();

  const { category, difficulty } = useConfig();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentText, setCurrentText] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useRequest<{ content: string }>({
    url: '/texts/random',
    method: 'GET',
    params: {
      category,
      difficulty,
    },
  });

  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

  const {
    isStarted,
    isPaused,
    activeWordIndex,
    userInput,
    words,
    timeLeft,
    mode,
    metrics,
    chartData,
    isCompleted,
    keystrokes,
    totalTime,
    finishedTime,
    setIsCompleted,
    start,
    setIsPaused,
    resume,
    handleKeyDown,
    reset,
  } = useTypingEngine(currentText, {
    onError: () => {
      playErrorSound();
    },
    onSuccess: () => playKeystroke(),
    onFinished: () => {
      setIsCompleted(true);

      inputRef.current?.blur();
    },
  });

  const handleStart = () => {
    start();
    inputRef.current?.focus();
  };

  const onRegenerate = () => {
    const newText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(newText);
    reset(newText);
    setIsCompleted(false);
  };

  const generalStats = useMemo(
    () => calculateGeneralStats(keystrokes, chartData, totalTime),
    [keystrokes, chartData, totalTime]
  );

  useEffect(() => {
    if (!isStarted) return;
    const currentWordEl = wordsRef.current[activeWordIndex];
    if (currentWordEl) {
      currentWordEl.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [activeWordIndex, isStarted]);

  useEffect(() => {
    if (isSettingsOpen) {
      setIsPaused(true);
    } else if (isStarted) {
      setIsPaused(false);
    }
  }, [isSettingsOpen, isStarted]);

  useEffect(() => {
    if (data) {
      setCurrentText(data?.content);
    }
  }, [data]);

  useEffect(() => {
    if (data?.content) {
      reset(data.content);
    }
  }, [data, reset]);

  return (
    <div className="relative min-h-screen p-8 xl:px-28">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {isCompleted && (
        <ResultSection
          metrics={metrics}
          finishedTime={finishedTime}
          chartData={chartData}
          generalStats={generalStats}
        />
      )}

      {!isCompleted && (
        <MetricsPanel
          isStarted={isStarted}
          metrics={metrics}
          mode={mode}
          timeLeft={timeLeft}
        />
      )}

      <div className="mt-16 relative mx-auto text-left">
        {!isCompleted && (
          <div
            className={`max-h-40 overflow-y-auto scroll-smooth hide-scrollbar text-preset-1-regular leading-normal cursor-text ${!isStarted || isPaused ? 'blur-xs opacity-70' : ''}`}
            onClick={handleStart}
          >
            {words.map((word, wordIdx) => (
              <div
                key={wordIdx}
                ref={(el) => {
                  wordsRef.current[wordIdx] = el;
                }}
                className="inline-block"
              >
                <WordDisplay
                  word={word}
                  typed={userInput[wordIdx] || ''}
                  isCurrent={wordIdx === activeWordIndex}
                  isStarted={isStarted}
                />
              </div>
            ))}
          </div>
        )}

        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          onKeyDown={(e) => handleKeyDown(e.key)}
        />

        {isStarted && isPaused && (
          <PauseWarning
            onResume={() => {
              resume();
              inputRef.current?.focus();
            }}
          />
        )}

        {!isStarted && !isCompleted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 rounded-lg">
            <button
              onClick={handleStart}
              className="cursor-pointer py-4 px-8 rounded-xl bg-blue-500 text-white text-preset-4-semibold hover:brightness-110 transition"
            >
              Start Typing Test
            </button>
            <p className="mt-4 text-neutral-300">
              Or click the text and start typing
            </p>
          </div>
        )}
      </div>

      <TagsContainer />

      <div className="flex items-center justify-center gap-12 mt-20">
        <FontAwesomeIcon
          onClick={onRegenerate}
          className="text-neutral-400 text-lg cursor-pointer hover:text-white transition"
          icon={faArrowsRotate}
        />
        <FontAwesomeIcon
          className="text-neutral-400 text-lg cursor-pointer hover:text-white transition"
          icon={faArrowRotateRight}
        />
        <FontAwesomeIcon
          className="text-neutral-400 text-lg cursor-pointer hover:text-white transition"
          icon={faAngleRight}
        />
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 w-full">
            <SettingsPanel setIsOpen={setIsSettingsOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
