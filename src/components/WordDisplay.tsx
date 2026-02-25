import { memo } from 'react';

interface WordDisplayProps {
  word: string;
  typed: string;
  isCurrent: boolean;
  isStarted: boolean;
  isReady: boolean;
}

export const WordDisplay = memo(
  ({ word, typed, isCurrent, isStarted, isReady }: WordDisplayProps) => {
    const maxLength = Math.max(word.length, typed.length);
    const chars = [];

    for (let i = 0; i < maxLength; i++) {
      const charOriginal = word[i];
      const charTyped = typed[i];

      let className = 'text-neutral-500';
      let displayChar = charOriginal;

      if (charTyped !== undefined) {
        if (charOriginal !== undefined) {
          displayChar = charOriginal;
          className =
            charTyped === charOriginal ? 'text-green-400' : 'text-red-500';
        } else {
          displayChar = charTyped;
          className = 'text-red-500';
        }
      }

      const isCursor =
        isCurrent && i === typed.length && (isStarted || isReady);

      chars.push(
        <span
          key={i}
          className={`${className} ${isCursor ? 'border-l-2 border-blue-400 animate-pulse' : ''}`}
        >
          {displayChar}
        </span>
      );
    }

    return <div className="inline-block mr-4">{chars}</div>;
  }
);

WordDisplay.displayName = 'WordDisplay';
