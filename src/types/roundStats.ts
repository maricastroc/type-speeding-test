export type RoundStats = {
  id: string;
  timestamp: number;

  mode: 'timed' | 'passage';
  difficulty: 'easy' | 'medium' | 'hard';

  wpm: number;
  accuracy: number;
  time: number;
};
