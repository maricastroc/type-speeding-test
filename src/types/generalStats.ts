export type GeneralStats = {
  wpm: number;
  raw: number;
  accuracy: number;
  characters: {
    correct: number;
    total: number;
  };
  consistency: number;
  time: number;
  peakWPM: number;
  peakRaw: number;
};
