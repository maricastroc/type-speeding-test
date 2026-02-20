/* eslint-disable @typescript-eslint/no-explicit-any */
export const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;
  console.log(payload);
  const safeWPM =
    typeof point.wpm === 'number' && !isNaN(point.wpm) ? point.wpm : 0;
  const safeAccuracy =
    typeof point.accuracy === 'number' && !isNaN(point.accuracy)
      ? point.accuracy
      : 0;
  const safeErrorCount =
    typeof point.errorCount === 'number' && !isNaN(point.errorCount)
      ? point.errorCount
      : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 shadow-xl space-y-1 min-w-35">
      <p className="text-xs text-zinc-500">second {point.second}</p>

      <div className="flex justify-between text-sm">
        <span className="text-green-500">WPM</span>
        <span className="text-green-500 font-semibold">{safeWPM}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-blue-400">Accuracy</span>
        <span className="text-blue-400 font-semibold">{safeAccuracy}%</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-red-500">Errors</span>
        <span className="text-red-500 font-semibold">{safeErrorCount}</span>
      </div>
    </div>
  );
};
