import Image from 'next/image';
import { ResultChart } from './ResultChart';
import { StatsDisplay } from './StatsDisplay';
import { GeneralStats } from '@/types/generalStats';
import { ChartPoint } from '@/types/chartPoint';
import { ResumeSection } from './ResumeSection';
import { useRoundStats } from '@/hooks/useRoundStats';
import { useEffect, useRef } from 'react';

type ResultSectionProps = {
  generalStats: GeneralStats;
  chartData: ChartPoint[];
  finishedTime: number | null;
  metrics: {
    wpm: number;
    accuracy: number;
  };
};

export const ResultSection = ({
  metrics,
  finishedTime,
  chartData,
  generalStats,
}: ResultSectionProps) => {
  const { saveRound } = useRoundStats();
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (!finishedTime || metrics.wpm <= 0) return;

    if (hasSavedRef.current) return;

    saveRound({
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      time: finishedTime,
    });

    hasSavedRef.current = true;
  }, [finishedTime, metrics.wpm, metrics.accuracy, saveRound]);

  return (
    <div className="mt-18 flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute w-full h-full rounded-full bg-green-500/10" />

        <div className="absolute w-24 h-24 rounded-full bg-green-500/20" />

        <div className="relative rounded-full bg-green-500 flex items-center justify-center">
          <Image
            alt=""
            width={64}
            height={64}
            src={'/assets/images/icon-completed.svg'}
          />
        </div>
      </div>
      <h1 className="text-preset-1-bold mt-6">Test Complete!</h1>
      <p className="text-neutral-400 text-preset-3-regular">
        Solid run. Keep pushing to beat your high score.
      </p>
      <div className="w-full max-w-5xl flex flex-col gap-4 items-center justify-center">
        <StatsDisplay stats={generalStats} />
        <ResultChart data={chartData} />
      </div>

      <ResumeSection generalStats={generalStats} finishedTime={finishedTime} />
    </div>
  );
};
