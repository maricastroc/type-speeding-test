/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfig } from '@/contexts/ConfigContext';
import { CloseButton } from './CloseButton';
import { SettingsRow } from './SettingsRow';
import { useSound } from '@/contexts/SoundContext';

type SettingsPanelProps = {
  setIsOpen: (value: boolean) => void;
};

type RadioOption = {
  label: string;
  selected?: boolean;
};

type DropdownOption = {
  label: string;
  value: string;
  selected?: boolean;
};

type SettingConfig =
  | {
      label: string;
      type: 'radio';
      options: RadioOption[];
      wrap?: boolean;
    }
  | {
      label: string;
      type: 'dropdown';
      options: DropdownOption[];
    };

const SETTINGS_CONFIG: {
  left: SettingConfig[];
  right: SettingConfig[];
} = {
  left: [
    {
      label: 'Mode',
      type: 'radio',
      options: [{ label: 'Timed (60s)', selected: true }, { label: 'Passage' }],
    },
    {
      label: 'Difficulty',
      type: 'radio',
      options: [
        { label: 'Easy' },
        { label: 'Medium' },
        { label: 'Hard', selected: true },
      ],
    },
    {
      label: 'Category',
      type: 'radio',
      wrap: true,
      options: [
        { label: 'General', selected: true },
        { label: 'Lyrics' },
        { label: 'Quotes' },
        { label: 'Code' },
      ],
    },
  ],
  right: [
    {
      label: 'Sound',
      type: 'dropdown',
      options: [
        { label: 'Creamy', value: 'creamy', selected: true },
        { label: 'Beep', value: 'beep' },
        { label: 'Osu', value: 'osu' },
        { label: 'Pop', value: 'pop' },
        { label: 'Punch', value: 'punch' },
        { label: 'Rubber Keys', value: 'rubber' },
        { label: 'Typewriter', value: 'typewriter' },
        { label: 'Click', value: 'click' },
        { label: 'Hitmarker', value: 'hitmarker' },
      ],
    },
    {
      label: 'Caret',
      type: 'radio',
      options: [
        { label: 'Pip', selected: true },
        { label: 'Box' },
        { label: 'Underline' },
      ],
    },
    {
      label: 'Theme',
      type: 'radio',
      options: [{ label: 'Dark', selected: true }, { label: 'Light' }],
    },
  ],
};

export const SettingsPanel = ({ setIsOpen }: SettingsPanelProps) => {
  const { mode, setMode } = useConfig();

  const { soundName, setSoundName } = useSound();

  const getPropsForLabel = (label: string) => {
    switch (label) {
      case 'Mode':
        return {
          currentValue: mode,
          onChange: (val: any) => setMode(val),
          options: [
            { label: 'Timed (60s)', value: 'timed' },
            { label: 'Passage', value: 'passage' },
          ],
        };
      case 'Sound':
        return {
          currentValue: soundName,
          onChange: (val: any) => setSoundName(val),
          options: SETTINGS_CONFIG.right.find((s) => s.label === 'Sound')
            ?.options as any,
        };
      default:
        return { currentValue: '', onChange: () => {}, options: [] };
    }
  };

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
            {SETTINGS_CONFIG.left.map((setting) => {
              const dynamicProps = getPropsForLabel(setting.label);
              return (
                <SettingsRow
                  key={setting.label}
                  label={setting.label}
                  type={setting.type as any}
                  options={
                    dynamicProps.options.length > 0
                      ? dynamicProps.options
                      : (setting.options as any)
                  }
                  currentValue={dynamicProps.currentValue}
                  onChange={dynamicProps.onChange}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-6 pl-0 lg:pl-8">
            {SETTINGS_CONFIG.right.map((setting) => {
              const dynamicProps = getPropsForLabel(setting.label);
              return (
                <SettingsRow
                  key={setting.label}
                  label={setting.label}
                  type={setting.type as any}
                  options={
                    dynamicProps.options.length > 0
                      ? dynamicProps.options
                      : (setting.options as any)
                  }
                  currentValue={dynamicProps.currentValue}
                  onChange={dynamicProps.onChange}
                />
              );
            })}
          </div>
        </div>

        <CloseButton className="mt-12" onClick={() => setIsOpen(false)}>
          Close
        </CloseButton>
      </div>
    </div>
  );
};
