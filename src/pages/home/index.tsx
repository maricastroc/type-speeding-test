'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { useSound } from '@/contexts/SoundContext';
import { useConfig } from '@/contexts/ConfigContext';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import useRequest from '@/hooks/useRequest';
import { useRoundStats } from '@/hooks/useRoundStats';
import { calculateGeneralStats } from '@/utils/calculateStats';
import { TextResponse } from '@/types/textResponse';
import { api } from '@/lib/axios';

import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ActionButtons } from '@/components/ActionButtons';
import { WordDisplay } from '@/components/WordDisplay';
import { TagsContainer } from '@/components/TagsContainer';
import { PauseWarning } from '@/components/PauseWarning';
import { MetricsPanel } from '@/components/MetricsPanel';
import { ResultSection } from '@/components/ResultSection';
import { HistorySection } from '@/components/HistorySection';

export default function Home() {
  const { playKeystroke, playErrorSound } = useSound();

  const { category, difficulty } = useConfig();

  const { saveRound } = useRoundStats();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [showHistorySection, setShowHistorySection] = useState(false);

  const [textCategory, setTextCategory] = useState<string | null>(null);

  const [currentText, setCurrentText] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

  const requestConfig = useMemo(
    () => ({
      url: '/texts/random',
      method: 'GET',
      params: { category, difficulty },
    }),
    [category, difficulty]
  );

  const { data, mutate, isValidating } = useRequest<TextResponse>(
    requestConfig,
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (!data?.content) return;

    if (data.category === category) {
      setCurrentText(data.content);
      setTextCategory(data.category);
    }
  }, [data, category]);

  const onRandomize = async () => {
    const result = await mutate(
      api.get<TextResponse>('/texts/random', {
        params: { category: 'any', difficulty },
      }),
      { revalidate: false }
    );

    if (result?.data) {
      setCurrentText(result.data.content);
      setTextCategory(result.data.category);
      reset(result.data.content);
      prepare();
    }
  };

  const onNextText = async () => {
    const result = await mutate(undefined, { revalidate: true });

    if (result?.data?.content) {
      setCurrentText(result.data.content);
      reset(result.data.content);
      prepare();
    }
  };

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
    onError: playErrorSound,
    onSuccess: playKeystroke,
    onFinished: (stats) => {
      inputRef.current?.blur();
      if (stats) saveRound(stats);
    },
  });

  const handlePrepare = () => {
    if (isReady) return;
    prepare();
    inputRef.current?.focus();
  };

  const onRestart = () => {
    reset(currentText);
    if (isReady) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const generalStats = useMemo(
    () => calculateGeneralStats(keystrokes, chartData, totalTime),
    [keystrokes, chartData, totalTime]
  );

  useEffect(() => {
    if (!isReady) return;

    const currentWordEl = wordsRef.current[activeWordIndex];

    currentWordEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeWordIndex, isStarted, isReady]);
  console.log(category, textCategory, data);
  useEffect(() => {
    if (isSettingsOpen) {
      pause();
    } else if (isStarted && !isCompleted) {
      resume();
    }
  }, [isSettingsOpen, isStarted, isCompleted, pause, resume]);

  useEffect(() => {
    if (isReady && !isStarted) {
      inputRef.current?.focus();
    }
  }, [isReady, isStarted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isStarted && !isCompleted && !isPaused) {
        pause();
      }
    };

    const handleBlur = () => {
      if (isStarted && !isCompleted && !isPaused) {
        pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isStarted, isCompleted, isPaused, pause]);

  const isLoading = isValidating;
  const loadingButton = isLoading ? 'randomize' : null;

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
          onOpenChange={setShowHistorySection}
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
            onClick={() => isReady && inputRef.current?.focus()}
            className={`max-h-40 overflow-y-auto scroll-smooth hide-scrollbar text-preset-1-regular leading-normal cursor-text ${
              !isReady || isPaused || isLoading ? 'blur-xs opacity-70' : ''
            }`}
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
                  isReady={isReady}
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

      <TagsContainer textCategory={textCategory} />

      <ActionButtons
        onRandomize={onRandomize}
        onRestart={onRestart}
        onNext={onNextText}
        isLoading={isLoading}
        loadingButton={loadingButton}
      />

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
