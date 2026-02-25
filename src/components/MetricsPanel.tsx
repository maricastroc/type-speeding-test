import { formatTime } from '@/utils/formatTime';

type Metrics = {
  wpm: number;
  accuracy: number;
};

type MetricsPanelProps = {
  metrics: Metrics;
  mode: 'timed' | 'passage';
  isStarted: boolean;
  timeLeft: number;
};

export const MetricsPanel = ({
  metrics: { wpm, accuracy },
  mode,
  isStarted,
  timeLeft,
}: MetricsPanelProps) => {
  const accuracyColor = !isStarted
    ? 'text-neutral-0'
    : accuracy === 100
      ? 'text-green-500'
      : 'text-red-500';

  const timeColor =
    isStarted && mode === 'timed' ? 'text-yellow-500' : 'text-neutral-0';

  const Item = ({
    label,
    value,
    valueClass = '',
  }: {
    label: string;
    value: React.ReactNode;
    valueClass?: string;
  }) => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-8">
      <p className="text-preset-4 font-medium text-neutral-400">{label}</p>
      <span className={`text-preset-2 ${valueClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="mt-16 flex w-full items-center justify-center border-b border-b-neutral-700 pb-4 divide-x divide-neutral-600">
      <Item label="WPM:" value={wpm} />
      <Item
        label="Accuracy:"
        value={`${accuracy}%`}
        valueClass={accuracyColor}
      />
      <Item label="Time:" value={formatTime(timeLeft)} valueClass={timeColor} />
    </div>
  );
};
