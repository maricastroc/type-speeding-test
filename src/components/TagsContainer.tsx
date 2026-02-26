import { useConfig } from '@/contexts/ConfigContext';
import { capitalize } from '@/utils/capitalizeText';

type TagsContainerProps = {
  textCategory: string | null;
};

export const TagsContainer = ({ textCategory }: TagsContainerProps) => {
  const { difficulty, category, mode } = useConfig();

  return (
    <div className="flex items-center mt-18 justify-center gap-3">
      <span className="px-4 bg-neutral-800 text-preset-7 text-neutral-400 p-1 rounded-md">
        {capitalize(textCategory) || capitalize(category)}
      </span>
      <span className="text-neutral-500">•</span>
      <span className="px-4 bg-neutral-800 text-preset-7 text-neutral-400 p-1 rounded-md">
        {capitalize(difficulty)}
      </span>
      <span className="text-neutral-500">•</span>
      <span className="px-4 bg-neutral-800 text-preset-7 text-neutral-400 p-1 rounded-md">
        {mode === 'timed' ? 'Timed (60s)' : 'Passage'}
      </span>
    </div>
  );
};
