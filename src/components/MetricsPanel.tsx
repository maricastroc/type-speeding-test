import { formatTime } from '@/utils/formatTime';

type MetricsPanelProps = {
  metrics: {
    wpm: number;
    accuracy: number;
  };
  mode: string;
  isStarted: boolean;
  timeLeft: number;
};

export const MetricsPanel = ({
  metrics,
  mode,
  isStarted,
  timeLeft,
}: MetricsPanelProps) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy === 100 && isStarted) return 'text-green-500';
    if (!isStarted) return 'text-neutral-0';
    return 'text-red-500';
  };

  return (
    <div className="mt-16 flex w-full items-center justify-center border-b pb-4 border-b-neutral-700 divide-x divide-neutral-600">
      <div className="flex gap-3 px-8 items-center justify-center">
        <p className="text-preset-4 font-medium text-neutral-400">WPM:</p>
        <span className="text-preset-2">{metrics.wpm}</span>
      </div>
      <div className="flex gap-3 px-8 items-center justify-center">
        <p className="text-preset-4 font-medium text-neutral-400">Accuracy:</p>
        <span className={`text-preset-2 ${getAccuracyColor(metrics.accuracy)}`}>
          {metrics.accuracy}%
        </span>
      </div>
      <div className="flex gap-3 px-8 items-center justify-center">
        <p className="text-preset-4 font-medium text-neutral-400">Time:</p>
        <span
          className={`text-preset-2 ${isStarted && mode === 'timed' ? 'text-yellow-500' : 'text-neutral-0'}`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};
