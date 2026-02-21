import { useConfig } from '@/contexts/ConfigContext';
import { GeneralStats } from '@/types/generalStats';
import { capitalize } from '@/utils/capitalizeText';

type ResumeSectionProps = {
  generalStats: GeneralStats;
  finishedTime: number | null;
};

export const ResumeSection = ({
  generalStats,
  finishedTime,
}: ResumeSectionProps) => {
  const { mode, category } = useConfig();

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="mt-8 w-full max-w-5xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        <div className="flex flex-col items-start justify-center p-4 rounded-lg border border-neutral-700/50">
          <p className="text-preset-5-regular text-neutral-400 tracking-wider mb-1">
            test type
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-preset-6 text-blue-400 tracking-wider bg-blue-400/10 px-3 py-1 rounded-full">
              {capitalize(mode)}
            </span>
            <span className="text-preset-6 text-blue-400 tracking-wider bg-blue-400/10 px-3 py-1 rounded-full">
              {capitalize(category)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center p-4 rounded-lg border border-neutral-700/50">
          <p className="text-preset-5-regular text-neutral-400 tracking-wider mb-1">
            raw
          </p>
          <span className="text-preset-4-bold text-blue-400 tracking-wider">
            {generalStats?.raw}
          </span>
        </div>

        <div className="flex flex-col items-start justify-center p-4 rounded-lg border border-neutral-700/50">
          <p className="text-preset-5-regular text-neutral-400 tracking-wider mb-1">
            consistency
          </p>
          <span className="text-preset-4-bold text-blue-400 tracking-wider">
            {generalStats?.consistency}%
          </span>
        </div>

        <div className="flex flex-col items-start justify-center p-4 rounded-lg border border-neutral-700/50">
          <p className="text-preset-5-regular text-neutral-400 tracking-wider mb-1">
            time
          </p>
          <span className="text-preset-4-bold text-blue-400 tracking-wider">
            {formatTime(finishedTime)}
          </span>
        </div>
      </div>
    </div>
  );
};
