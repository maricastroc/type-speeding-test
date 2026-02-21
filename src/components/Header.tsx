'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
  onOpenSettings: (value: boolean) => void;
};

export const Header = ({ onOpenSettings }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex w-auto gap-3">
          <Image
            src="/assets/images/logo-small.svg"
            alt="Logo"
            width={32}
            height={32}
          />

          <div className="hidden md:flex flex-col items-start gap-[0.1rem]">
            <h1 className="text-2xl font-bold bg-linear-to-t from-blue-400 via-blue-200 to-blue-100 bg-clip-text text-transparent">
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
            />
            <p className="hidden md:block text-preset-4 text-neutral-400">
              Personal Best:
            </p>
            <span className="font-mono text-preset-4 text-neutral-0 font-extrabold">
              0 WPM
            </span>
          </div>

          <button
            onClick={() => onOpenSettings(true)}
            className="pl-4 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faGear} size="lg" />
          </button>
        </div>
      </div>
    </>
  );
};
