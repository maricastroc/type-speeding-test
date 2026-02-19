'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useEffect, useRef, useState } from 'react';
import { texts } from '@/data/texts';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import {
  faAngleRight,
  faArrowRotateRight,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useSound } from '@/contexts/SoundContext';

export default function Home() {
  const { playKeystroke, playErrorSound } = useSound();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentText, setCurrentText] = useState(texts[0]);

  const inputRef = useRef<HTMLInputElement>(null);

  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

  const {
    isStarted,
    activeWordIndex,
    userInput,
    words,
    start,
    handleKeyDown,
    reset,
  } = useTypingEngine(currentText, {
    onError: () => {
      playErrorSound();
    },
    onSuccess: () => playKeystroke(),
  });

  const handleStart = () => {
    start();
    inputRef.current?.focus();
  };

  const onRegenerate = () => {
    const newText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(newText);
    reset(newText);
  };

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

  const renderText = () => {
    return words.map((word, wordIdx) => {
      const typed = userInput[wordIdx] || '';
      const isCurrent = wordIdx === activeWordIndex;
      const maxLength = Math.max(word.length, typed.length);
      const chars = [];

      for (let i = 0; i < maxLength; i++) {
        const charOriginal = word[i];
        const charTyped = typed[i];
        let className = 'text-neutral-600';
        let displayChar = charOriginal;

        if (charTyped !== undefined) {
          if (charOriginal !== undefined) {
            displayChar = charOriginal;
            className =
              charTyped === charOriginal ? 'text-green-400' : 'text-red-500';
          } else {
            displayChar = charTyped;
            className = 'text-red-500 opacity-70';
          }
        }

        const isCursor = isCurrent && i === typed.length && isStarted;
        chars.push(
          <span
            key={i}
            className={`${className} ${isCursor ? 'border-l-2 border-blue-400 animate-pulse' : ''}`}
          >
            {displayChar}
          </span>
        );
      }

      return (
        <div
          key={wordIdx}
          ref={(el) => {
            wordsRef.current[wordIdx] = el;
          }}
          className="inline-block mr-4"
        >
          {chars}
        </div>
      );
    });
  };

  return (
    <div className="relative min-h-screen p-8 xl:px-28">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <div className="mt-16 flex w-full items-center justify-center border-b pb-4 border-b-neutral-700 divide-x divide-neutral-600">
        <div className="flex gap-3 px-8 items-center justify-center">
          <p className="text-preset-4 font-medium text-neutral-400">WPM:</p>
          <span className="text-preset-2">0</span>
        </div>
        <div className="flex gap-3 px-8 items-center justify-center">
          <p className="text-preset-4 font-medium text-neutral-400">
            Accuracy:
          </p>
          <span className="text-preset-2">100%</span>
        </div>
        <div className="flex gap-3 px-8 items-center justify-center">
          <p className="text-preset-4 font-medium text-neutral-400">Time:</p>
          <span className="text-preset-2">01:00</span>
        </div>
      </div>

      <div className="mt-16 relative mx-auto text-left">
        <div
          className={`max-h-40 overflow-y-auto scroll-smooth hide-scrollbar text-preset-1-regular leading-normal cursor-text ${!isStarted ? 'blur-sm opacity-70' : ''}`}
          onClick={handleStart}
        >
          {renderText()}
        </div>

        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          onKeyDown={(e) => handleKeyDown(e.key)}
        />

        {!isStarted && (
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
