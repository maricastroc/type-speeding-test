import { RoundStats } from '@/types/roundStats';

const STORAGE_KEY = '@typing-stats';
const MAX_STORED_ROUNDS = 100;

export class StatsService {
  static async saveRound(
    stats: Omit<RoundStats, 'id' | 'timestamp'>
  ): Promise<RoundStats> {
    const newRound: RoundStats = {
      ...stats,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    try {
      const existing = this.getStoredRounds();

      const isDuplicate = existing.some((round) => {
        const timeDiff = Math.abs(round.timestamp - newRound.timestamp);
        return (
          timeDiff < 3000 &&
          round.wpm === newRound.wpm &&
          round.accuracy === newRound.accuracy &&
          round.time === newRound.time &&
          round.mode === newRound.mode &&
          round.difficulty === newRound.difficulty
        );
      });

      if (isDuplicate) {
        return existing[0];
      }

      const updated = [newRound, ...existing].slice(0, MAX_STORED_ROUNDS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      window.dispatchEvent(
        new CustomEvent('statsUpdated', {
          detail: { newRound, allRounds: updated },
        })
      );
    } catch (error) {
      console.error('Error saving statistics:', error);
      this.cleanupOldRounds();
    }

    return newRound;
  }

  static getStoredRounds(): RoundStats[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getAggregatedStats() {
    const rounds = this.getStoredRounds();

    if (rounds.length === 0) {
      return {
        totalRounds: 0,
        averageWpm: 0,
        bestWpm: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        totalTimeTyped: 0,
      };
    }

    const totalRounds = rounds.length;
    const totalWpm = rounds.reduce((sum, r) => sum + r.wpm, 0);
    const totalAccuracy = rounds.reduce((sum, r) => sum + r.accuracy, 0);
    const totalTime = rounds.reduce((sum, r) => sum + r.time, 0);

    return {
      totalRounds,
      averageWpm: Math.round(totalWpm / totalRounds),
      bestWpm: Math.max(...rounds.map((r) => r.wpm)),
      averageAccuracy: Math.round(totalAccuracy / totalRounds),
      bestAccuracy: Math.max(...rounds.map((r) => r.accuracy)),
      totalTimeTyped: Math.round(totalTime / 60),

      byMode: {
        timed: rounds.filter((r) => r.mode === 'timed'),
        passage: rounds.filter((r) => r.mode === 'passage'),
      },

      byDifficulty: {
        easy: rounds.filter((r) => r.difficulty === 'easy'),
        medium: rounds.filter((r) => r.difficulty === 'medium'),
        hard: rounds.filter((r) => r.difficulty === 'hard'),
      },
    };
  }

  private static cleanupOldRounds() {
    const rounds = this.getStoredRounds();
    if (rounds.length > MAX_STORED_ROUNDS) {
      const trimmed = rounds.slice(0, MAX_STORED_ROUNDS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
