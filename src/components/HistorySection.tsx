'use client';

import { useRoundStats } from '@/hooks/useRoundStats';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistorySection({ open, onOpenChange }: Props) {
  const { getRecentRounds } = useRoundStats();
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
            p-8 overflow-y-auto shadow-2xl
            transition-transform duration-250 ease-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <div className="flex justify-end">
            <Dialog.Close className="cursor-pointer hover:text-blue-400 transition-colors text-neutral-400">
              <FontAwesomeIcon className="text-preset-4" icon={faX} />
            </Dialog.Close>
          </div>

          <h1 className="text-preset-3-semibold text-center">History</h1>
          <p className="text-preset-4-regular text-neutral-400 mt-1 text-center">
            Review your type history
          </p>

          <div className="mt-8 rounded-xl">
            <div className="space-y-4">
              {recentRounds.map((round) => (
                <div
                  key={round.id}
                  className="flex border border-neutral-800 items-center justify-between p-4 rounded-lg hover:bg-neutral-800/30 transition-colors"
                >
                  <div>
                    <p className="text-white text-preset-3-semibold">
                      {round.wpm}{' '}
                      <span className="text-preset-7 text-neutral-400 font-mono">
                        WPM
                      </span>
                    </p>
                    <p className="text-preset-7 text-blue-400 font-mono">
                      {round.accuracy}% acc{' '}
                      <span className="text-neutral-400">•</span> {round.time}s{' '}
                      <span className="text-neutral-400">•</span> {round.mode}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {formatDistanceToNow(round.timestamp, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
