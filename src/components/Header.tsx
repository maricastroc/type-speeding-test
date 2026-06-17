'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { usePersonalBest } from '@/features/typing/hooks/usePersonalBest';
import { signIn, signOut, useSession } from 'next-auth/react';
import { StatsService } from '@/services/statsService';
import { roundsApi } from '@/services/roundsApi';
import { useEffect, useRef, useState } from 'react';

type HeaderProps = {
  onOpenSettings: (value: boolean) => void;
  onOpenHistorySection: (value: boolean) => void;
};

export const Header = ({ onOpenSettings, onOpenHistorySection }: HeaderProps) => {
  const personalBest = usePersonalBest();
  const { data: session, status } = useSession();
  const hasMigratedRef = useRef(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // migrate localStorage rounds to DB once after login
  useEffect(() => {
    if (status !== 'authenticated' || hasMigratedRef.current) return;
    hasMigratedRef.current = true;

    const localRounds = StatsService.getStoredRounds();
    if (localRounds.length === 0) return;

    roundsApi.migrateLocalRounds(localRounds).then(() => {
      localStorage.removeItem('@typing-stats');
      window.dispatchEvent(new CustomEvent('statsUpdated'));
    });
  }, [status]);

  return (
    <div className="flex justify-between w-full">
      <div className="flex w-auto gap-3">
        <Image src="/assets/images/logo-small.svg" alt="Logo" width={32} height={32} />

        <div className="hidden md:flex flex-col items-start gap-[0.1rem]">
          <h1 className="text-2xl font-bold title-gradient bg-clip-text text-transparent">
            Typing Speed Test
          </h1>
          <p className="text-neutral-400 text-preset-7">
            Type as fast as you can in 60 seconds
          </p>
        </div>
      </div>

      <div className="flex items-center divide-x divide-neutral-700">
        <div className="flex items-center gap-2 pr-4">
          <Image
            src="/assets/images/icon-personal-best.svg"
            alt="Personal Best Icon"
            width={25}
            height={25}
            className="trophy-icon"
          />
          <p className="hidden md:block text-preset-4 text-neutral-400">Personal Best:</p>
          <span className="font-mono text-preset-4 text-neutral-0 font-extrabold">
            {personalBest} WPM
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 pl-4">
          <button
            onClick={() => onOpenSettings(true)}
            className="cursor-pointer hover:text-blue-400 transition-colors px-1"
          >
            <FontAwesomeIcon icon={faGear} size="lg" />
          </button>

          <button
            onClick={() => onOpenHistorySection(true)}
            className="cursor-pointer hover:text-blue-400 transition-colors px-1"
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
          </button>

          {status === 'authenticated' ? (
            <div className="relative ml-1">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-600 flex items-center justify-center text-xs">
                    {session.user.name?.[0] ?? '?'}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-10 z-20 min-w-40 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700">
                      <p className="text-sm font-medium text-neutral-100 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="cursor-pointer w-full flex items-center gap-2 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="cursor-pointer ml-2 flex items-center gap-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors px-3 py-1.5 rounded-lg border border-neutral-600 hover:border-neutral-500"
            >
              <FontAwesomeIcon icon={faGithub} size="sm" />
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
