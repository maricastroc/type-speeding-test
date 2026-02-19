/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectInput } from './SelectInput';

type Option = {
  label: string;
  value: string;
};

type SettingsRowProps = {
  label: string;
  type: 'radio' | 'dropdown';
  options: Option[];
  currentValue: string;
  onChange: (value: any) => void;
};

export const SettingsRow = ({
  label,
  type,
  options,
  currentValue,
  onChange,
}: SettingsRowProps) => {
  if (type === 'dropdown') {
    return (
      <div className="flex gap-2 items-center justify-start">
        <span className="text-neutral-400 text-preset-5 w-20">{label}</span>
        <SelectInput
          label={label}
          placeholder={`Select ${label.toLowerCase()}`}
          defaultValue={currentValue}
          data={options.map((opt) => ({
            id: opt.value,
            name: opt.label,
          }))}
          onSelect={(item) => onChange(item)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-start gap-3">
      <label className="text-neutral-400 text-preset-5 w-20">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)} // Repassa para o pai
            className={`
              px-4 py-2 rounded-lg text-preset-5 transition
              ${
                currentValue === option.value
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
