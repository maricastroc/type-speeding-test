import { RoundStats } from '@/types/roundStats';

type CreateRoundPayload = Omit<RoundStats, 'id' | 'timestamp'>;

export const roundsApi = {
  async fetchRounds(): Promise<RoundStats[]> {
    const res = await fetch('/api/rounds');
    if (!res.ok) throw new Error('Failed to fetch rounds');
    const data = await res.json();
    return data.map((r: { id: string; createdAt: string; wpm: number; accuracy: number; time: number; mode: string; difficulty: string }) => ({
      id: r.id,
      timestamp: new Date(r.createdAt).getTime(),
      wpm: r.wpm,
      accuracy: r.accuracy,
      time: r.time,
      mode: r.mode as RoundStats['mode'],
      difficulty: r.difficulty as RoundStats['difficulty'],
    }));
  },

  async saveRound(payload: CreateRoundPayload): Promise<RoundStats> {
    const res = await fetch('/api/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save round');
    const r = await res.json();
    return {
      id: r.id,
      timestamp: new Date(r.createdAt).getTime(),
      wpm: r.wpm,
      accuracy: r.accuracy,
      time: r.time,
      mode: r.mode,
      difficulty: r.difficulty,
    };
  },

  async migrateLocalRounds(rounds: RoundStats[]): Promise<void> {
    if (rounds.length === 0) return;
    await fetch('/api/rounds/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rounds }),
    });
  },
};
