type BucketableStats = {
  wpm: number;
  bucket?: number;
};

export function getBuckets<TStats extends BucketableStats>(
  wordWPMsList: number[],
  wordStatsMap: Map<number, TStats>,
) {
  if (wordWPMsList.length === 0) return null;

  const sortedWpms = [...wordWPMsList].sort((a, b) => a - b);
  const medianWpm = sortedWpms[Math.floor(sortedWpms.length / 2)];

  const b1 = Math.round(medianWpm * 0.75);
  const b2 = Math.round(medianWpm * 0.9);
  const b3 = Math.round(medianWpm * 1.1);
  const b4 = Math.round(medianWpm * 1.25);

  const getBucket = (wpm: number) => {
    if (wpm < b1) return 0;
    if (wpm < b2) return 1;
    if (wpm < b3) return 2;
    if (wpm < b4) return 3;
    return 4;
  };

  wordStatsMap.forEach((stats) => {
    if (stats.wpm > 0) stats.bucket = getBucket(stats.wpm);
  });

  return [
    Math.round(Math.min(...wordWPMsList)),
    b1,
    b2,
    b3,
    b4,
    Math.round(Math.max(...wordWPMsList)),
  ];
}
