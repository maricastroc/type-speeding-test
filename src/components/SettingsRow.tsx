import { Button } from './Button';

type SettingsRowProps = {
  label: string;
  options: {
    label: string;
    selected?: boolean;
  }[];
  wrap?: boolean;
};

export const SettingsRow = ({ label, options, wrap }: SettingsRowProps) => {
  return (
    <div className="flex items-center gap-6">
      <p className="text-neutral-400 w-24">{label}</p>
      <div className={`flex gap-2 ${wrap ? 'flex-wrap' : ''}`}>
        {options.map((option) => (
          <Button key={option.label} isSelected={option.selected}>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
