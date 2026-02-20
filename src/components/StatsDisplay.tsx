import { GeneralStats } from '@/utils/generalStats';

type StatsDisplayProps = {
  stats: GeneralStats;
};

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
      <div className="space-y-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">WPM</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-400">{stats.wpm}</span>
          <span className="text-xs text-zinc-600">avg</span>
        </div>
        <p className="text-xs text-zinc-600">peak {stats.peakWPM}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Raw</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-400">{stats.raw}</span>
          <span className="text-xs text-zinc-600">avg</span>
        </div>
        <p className="text-xs text-zinc-600">peak {stats.peakRaw}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Accuracy
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-indigo-400">
            {stats.accuracy}%
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          {stats.characters.correct} / {stats.characters.total} chars
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Consistency
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-purple-400">
            {stats.consistency}%
          </span>
        </div>
        <p className="text-xs text-zinc-600">{stats.time}s total</p>
      </div>
    </div>
  );
};
