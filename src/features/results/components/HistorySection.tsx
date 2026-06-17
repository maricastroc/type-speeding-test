'use client';

import { useRoundStats } from '@/features/typing/hooks/useRoundStats';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { usePersonalBest } from '@/features/typing/hooks/usePersonalBest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { roundsApi } from '@/services/roundsApi';
import type { RoundStats } from '@/types/roundStats';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistorySection({ open, onOpenChange }: Props) {
  const { getRecentRounds, deleteRound, isLoggedIn } = useRoundStats();
  const personalBestFromHook = usePersonalBest();

  const [isOpen, setIsOpen] = useState(open);
  const [shouldRender, setShouldRender] = useState(open);
  const [rounds, setRounds] = useState<RoundStats[]>([]);

  const personalBest = rounds.length > 0
    ? Math.max(...rounds.map((r) => r.wpm))
    : personalBestFromHook;

  const loadRounds = async () => {
    if (isLoggedIn) {
      try {
        const data = await roundsApi.fetchRounds();
        setRounds(data.slice(0, 5));
      } catch {
        setRounds([]);
      }
    } else {
      setRounds(getRecentRounds(5));
    }
  };

  const handleDelete = async (id: string) => {
    if (isLoggedIn) {
      await roundsApi.deleteRound(id);
    } else {
      deleteRound(id);
    }
    setRounds((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    if (open) {
      setIsOpen(true);
      setShouldRender(true);
      loadRounds();
    } else {
      setIsOpen(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open, isLoggedIn]);

  if (!shouldRender) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`
            fixed inset-0 bg-black/50
            transition-opacity duration-200
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
        />

        <Dialog.Content
          className={`
            fixed top-0 right-0 h-full w-105
            bg-neutral-900 border-l border-neutral-700
            p-8 shadow-2xl
            transition-transform duration-250 ease-out
            flex flex-col
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <h1 className="text-preset-3-semibold text-center">History</h1>
          <p className="text-preset-4-regular text-neutral-400 mt-1 text-center">
            {isLoggedIn ? 'Your saved rounds' : 'Review your type history'}
          </p>

          <div className="mt-8 flex flex-col flex-1">
            <div className="space-y-4 overflow-y-visible overflow-x-visible flex-1">
              {rounds.length === 0 && (
                <p className="text-neutral-500 text-center text-sm mt-8">No rounds yet.</p>
              )}
              {rounds.map((round) => {
                const isBest = round.wpm === personalBest;

                return (
                  <div
                    key={round.id}
                    className={`
                      group relative flex items-center justify-between p-4 rounded-xl
                      border transition-all duration-300
                      ${
                        isBest
                          ? 'border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.35)]'
                          : 'border-neutral-500/40 hover:bg-neutral-800/30'
                      }
                    `}
                  >
                    {isBest && (
                      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rotate-12 pointer-events-none">
                        <FontAwesomeIcon size="xl" icon={faCrown} className="text-yellow-500" />
                      </div>
                    )}

                    <div>
                      <p className="text-neutral-0 text-preset-3-semibold">
                        {round.wpm}{' '}
                        <span className="text-preset-7 text-neutral-400 font-mono">WPM</span>
                      </p>
                      <p className="text-preset-7 text-blue-400 font-mono">
                        {round.accuracy}% acc{' '}
                        <span className="text-neutral-400">•</span> {round.time}s{' '}
                        <span className="text-neutral-400">•</span> {round.mode}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm text-neutral-500">
                        {formatDistanceToNow(round.timestamp, { addSuffix: true })}
                      </p>
                      <button
                        onClick={() => handleDelete(round.id)}
                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-500"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Dialog.Close className="text-white cursor-pointer hover:brightness-110 transition-all duration-100 mt-6 flex items-center justify-center p-4 py-2 bg-red-500 rounded-xl">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
