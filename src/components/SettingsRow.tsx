/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSound } from '@/contexts/SoundContext';
import { SelectInput } from './SelectInput';

type Option = {
  label: string;
  selected?: boolean;
};

type SettingsRowProps = {
  label: string;
  type: 'radio' | 'dropdown';
  options: Option[];
};

export const SettingsRow = ({ label, type, options }: SettingsRowProps) => {
  const { setSoundName, soundName } = useSound();

  if (type === 'dropdown') {
    return (
      <div className="flex gap-2 items-center justify-start">
        <span className="text-neutral-400 text-preset-5 w-20">{label}</span>

        <SelectInput
          label={label}
          placeholder="Select sound"
          defaultValue={soundName}
          data={options.map((opt) => ({
            id: opt.label.toLowerCase(),
            name: opt.label,
          }))}
          onSelect={(value) => setSoundName(value.toLowerCase() as any)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-start gap-3">
      <label className="text-neutral-400 text-preset-5 w-20">{label}</label>
      <div className={`flex gap-2`}>
        {options.map((option) => (
          <button
            key={option.label}
            className={`
              px-4 py-2 rounded-lg text-preset-5 transition
              ${
                option.selected
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
