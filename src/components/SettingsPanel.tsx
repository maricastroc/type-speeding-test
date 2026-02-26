/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseButton } from './CloseButton';
import { SettingsRow } from './SettingsRow';
import { useSound } from '@/contexts/SoundContext';
import { useConfig } from '@/contexts/ConfigContext';

type SettingsPanelProps = {
  setIsOpen: (value: boolean) => void;
};

export const SettingsPanel = ({ setIsOpen }: SettingsPanelProps) => {
  const { mode, setMode, category, setCategory, difficulty, setDifficulty } =
    useConfig();

  const { soundName, setSoundName } = useSound();

  return (
    <div
      className="
        w-full
        shadow-2xl
        p-8 xl:px-28
        animate-slideUp
        bg-background
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mt-4 p-6 shadow-lg border-t border-neutral-700">
        <div className="flex flex-col w-full items-center justify-center">
          <span className="w-32 h-2 bg-neutral-400 rounded-xl mb-4" />
          <h2 className="text-preset-3-semibold text-neutral-0 mb-2">
            Settings
          </h2>
          <p className="text-neutral-400 text-preset-3 mb-8">
            Configure your typing settings
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:divide-x lg:divide-neutral-700">
          <div className="flex flex-col gap-6 pr-0 lg:pr-8">
            <SettingsRow
              label="Mode"
              type="radio"
              currentValue={mode}
              onChange={setMode}
              options={[
                { label: 'Timed (60s)', value: 'timed' },
                { label: 'Passage', value: 'passage' },
              ]}
            />

            <SettingsRow
              label="Difficulty"
              type="radio"
              currentValue={difficulty}
              onChange={setDifficulty}
              options={[
                { label: 'Easy', value: 'easy' },
                { label: 'Medium', value: 'medium' },
                { label: 'Hard', value: 'hard' },
              ]}
            />

            <SettingsRow
              label="Category"
              type="radio"
              currentValue={category}
              onChange={setCategory}
              options={[
                { label: 'General', value: 'general' },
                { label: 'Lyrics', value: 'lyrics' },
                { label: 'Quotes', value: 'quotes' },
                { label: 'Code', value: 'code' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-6 pl-0 lg:pl-8">
            {/* SOUND */}
            <SettingsRow
              label="Sound"
              type="dropdown"
              currentValue={soundName}
              onChange={setSoundName}
              options={[
                { label: 'Creamy', value: 'creamy' },
                { label: 'Beep', value: 'beep' },
                { label: 'Osu', value: 'osu' },
                { label: 'Pop', value: 'pop' },
                { label: 'Punch', value: 'punch' },
                { label: 'Rubber Keys', value: 'rubber' },
                { label: 'Typewriter', value: 'typewriter' },
                { label: 'Click', value: 'click' },
                { label: 'Hitmarker', value: 'hitmarker' },
              ]}
            />

            {/* CARET */}
            <SettingsRow
              label="Caret"
              type="radio"
              currentValue="pip"
              onChange={() => {}}
              options={[
                { label: 'Pip', value: 'pip' },
                { label: 'Box', value: 'box' },
                { label: 'Underline', value: 'underline' },
              ]}
            />

            {/* THEME */}
            <SettingsRow
              label="Theme"
              type="radio"
              currentValue="dark"
              onChange={() => {}}
              options={[
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
              ]}
            />
          </div>
        </div>

        <CloseButton className="mt-12" onClick={() => setIsOpen(false)}>
          Close
        </CloseButton>
      </div>
    </div>
  );
};
