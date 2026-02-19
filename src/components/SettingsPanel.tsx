import { CloseButton } from './CloseButton';
import { SettingsRow } from './SettingsRow';

type SettingsPanelProps = {
  setIsOpen: (value: boolean) => void;
};

export const SettingsPanel = ({ setIsOpen }: SettingsPanelProps) => {
  return (
    <div
      className="
        w-full
        shadow-2xl
        p-8 xl:px-28
        animate-slideUp
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
              options={[
                { label: 'Timed (60s)', selected: true },
                { label: 'Passage' },
              ]}
            />

            <SettingsRow
              label="Difficulty"
              options={[
                { label: 'Easy' },
                { label: 'Medium' },
                { label: 'Hard', selected: true },
              ]}
            />

            <SettingsRow
              label="Category"
              wrap
              options={[
                { label: 'General', selected: true },
                { label: 'Lyrics' },
                { label: 'Quotes' },
                { label: 'Code' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-6 pl-0 lg:pl-8">
            <SettingsRow
              label="Sound"
              options={[{ label: 'Punch', selected: true }, { label: 'Play' }]}
            />

            <SettingsRow
              label="Caret"
              options={[
                { label: 'Pip', selected: true },
                { label: 'Box' },
                { label: 'Underline' },
              ]}
            />

            <SettingsRow
              label="Theme"
              options={[{ label: 'Dark', selected: true }, { label: 'Light' }]}
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
