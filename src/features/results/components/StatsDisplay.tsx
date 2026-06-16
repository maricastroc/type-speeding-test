import { GeneralStats } from '@/types/generalStats';
import { StatCard } from './StatCard';

type StatsDisplayProps = {
  stats: GeneralStats;
};

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <div className="flex items-center justify-center w-full gap-8 my-10">
      <StatCard
        label="WPM:"
        value={
          <>
            <span className="text-neutral-0 font-bold text-preset-2">
              {stats.wpm}
            </span>
            <span className="text-preset-5 text-neutral-400">avg</span>
          </>
        }
      />

      <StatCard
        label="Accuracy:"
        value={
          <>
            <span
              className={`text-neutral-0 font-bold text-preset-2 ${stats.accuracy === 100 ? 'text-green-500' : 'text-red-500'}`}
            >
              {stats.accuracy}%
            </span>
            <span className="text-preset-5 text-neutral-400">avg</span>
          </>
        }
      />

      <StatCard
        label="Characters:"
        value={
          <div className="flex gap-2 items-center justify-center">
            <span className="font-bold text-preset-2 text-green-500">
              {stats.characters.correct}
            </span>
            <span className="text-neutral-0 font-bold text-preset-2">
              / {stats.characters.total}
            </span>
          </div>
        }
      />
    </div>
  );
};
