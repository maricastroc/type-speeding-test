'use client';

import { useRoundStats } from '@/hooks/useRoundStats';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { usePersonalBest } from '@/hooks/usePersonalBest';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistorySection({ open, onOpenChange }: Props) {
  const { getRecentRounds } = useRoundStats();

  const personalBest = usePersonalBest();

  const [isOpen, setIsOpen] = useState(open);

  const [shouldRender, setShouldRender] = useState(open);

  const recentRounds = getRecentRounds(5);

  useEffect(() => {
    if (open) {
      setIsOpen(true);
      setShouldRender(true);
    } else {
      setIsOpen(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [open]);

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
            bg-neutral-900 border-l border-neutral-800
            p-8 shadow-2xl
            transition-transform duration-250 ease-out
            flex flex-col
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <h1 className="text-preset-3-semibold text-center">History</h1>
          <p className="text-preset-4-regular text-neutral-400 mt-1 text-center">
            Review your type history
          </p>

          <div className="mt-8 flex flex-col flex-1">
            <div className="space-y-4 overflow-y-visible overflow-x-visible flex-1">
              {recentRounds.map((round) => {
                const isBest = round.wpm === personalBest;

                return (
                  <div
                    key={round.id}
                    className={`
        relative flex items-center justify-between p-4 rounded-xl
        border transition-all duration-300
        ${
          isBest
            ? 'border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.35)]'
            : 'border-neutral-800 hover:bg-neutral-800/30'
        }
      `}
                  >
                    {isBest && (
                      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rotate-12 pointer-events-none">
                        <FontAwesomeIcon
                          size="xl"
                          icon={faCrown}
                          className="text-yellow-500"
                        />
                      </div>
                    )}

                    <div>
                      <p className="text-white text-preset-3-semibold">
                        {round.wpm}{' '}
                        <span className="text-preset-7 text-neutral-400 font-mono">
                          WPM
                        </span>
                      </p>

                      <p className="text-preset-7 text-blue-400 font-mono">
                        {round.accuracy}% acc{' '}
                        <span className="text-neutral-400">•</span> {round.time}
                        s <span className="text-neutral-400">•</span>{' '}
                        {round.mode}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-500">
                      {formatDistanceToNow(round.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                );
              })}
            </div>

            <Dialog.Close className="cursor-pointer hover:brightness-75 transition-all duration-100 mt-6 flex items-center justify-center p-4 py-2 bg-red-500 rounded-xl text-neutral-0">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
