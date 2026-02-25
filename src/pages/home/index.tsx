'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useEffect, useMemo, useRef, useState } from 'react';
import { texts } from '@/data/texts';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import * as Dialog from '@radix-ui/react-dialog';
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
import { HistorySection } from '@/components/HistorySection';
import { useRoundStats } from '@/hooks/useRoundStats';

export default function Home() {
  const { playKeystroke, playErrorSound } = useSound();

  const { category, difficulty } = useConfig();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [showHistorySection, setShowHistorySection] = useState(false);

  const [currentText, setCurrentText] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { saveRound } = useRoundStats();

  const { data, mutate } = useRequest<{ content: string }>({
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
    isReady,
    prepare,
    resume,
    handleKeyDown,
    reset,
    pause,
  } = useTypingEngine(currentText, {
    onError: () => {
      playErrorSound();
    },
    onSuccess: () => playKeystroke(),
    onFinished: (stats) => {
      inputRef.current?.blur();

      if (!stats) return;

      saveRound(stats);
    },
  });

  const handlePrepare = () => {
    if (isReady) return;
    prepare();
    inputRef.current?.focus();
  };

  const onRegenerate = () => {
    const newText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(newText);
    reset(newText);
  };

  const generalStats = useMemo(
    () => calculateGeneralStats(keystrokes, chartData, totalTime),
    [keystrokes, chartData, totalTime]
  );

  useEffect(() => {
    if (!isReady) return;
    const currentWordEl = wordsRef.current[activeWordIndex];
    if (currentWordEl) {
      currentWordEl.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [activeWordIndex, isStarted]);

  useEffect(() => {
    if (data) {
      setCurrentText(data?.content);
    }
  }, [data]);

  useEffect(() => {
    if (data?.content) {
      reset(data.content);
    }
  }, [category, difficulty, reset, data]);

  useEffect(() => {
    if (isSettingsOpen) {
      pause();
    } else {
      if (isStarted && !isCompleted) {
        resume();
      }
    }
  }, [isSettingsOpen, isStarted, isCompleted, pause, resume]);

  useEffect(() => {
    if (isReady && !isStarted) {
      inputRef.current?.focus();
    }
  }, [isReady, isStarted]);

  useEffect(() => {
    mutate();
  }, [category, difficulty, mutate]);

  return (
    <div className="relative min-h-screen p-8 xl:px-28">
      <Header
        onOpenHistorySection={() => setShowHistorySection(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <Dialog.Root
        open={showHistorySection}
        onOpenChange={setShowHistorySection}
      >
        <HistorySection
          open={showHistorySection}
          onOpenChange={(value) => setShowHistorySection(value)}
        />
      </Dialog.Root>

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
            onClick={() => {
              if (isReady) {
                inputRef.current?.focus();
              }
            }}
            className={`max-h-40 overflow-y-auto scroll-smooth hide-scrollbar text-preset-1-regular leading-normal cursor-text ${!isReady || isPaused ? 'blur-xs opacity-70' : ''}`}
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

        {isPaused && (
          <PauseWarning
            onResume={() => {
              resume();
              setTimeout(() => inputRef.current?.focus(), 10);
            }}
          />
        )}

        {!isReady && !isCompleted && !isPaused && (
          <div
            onClick={handlePrepare}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 rounded-lg"
          >
            <button
              onClick={handlePrepare}
              className="cursor-pointer py-4 px-8 rounded-xl bg-blue-500 text-white text-preset-4-semibold hover:brightness-110 transition"
            >
              Start Typing Test
            </button>
            <p className="text-preset-5-semibold mt-4 text-neutral-300">
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
