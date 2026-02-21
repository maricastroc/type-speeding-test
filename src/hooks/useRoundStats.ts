import { useCallback, useRef } from 'react';
import { StatsService } from '@/services/statsService';
import { useConfig } from '@/contexts/ConfigContext';

export const useRoundStats = () => {
  const { mode, category, difficulty } = useConfig();

  const lastSavedRef = useRef<{
    timestamp: number;
    wpm: number;
    time: number;
  } | null>(null);

  const saveRound = useCallback(
    async (statsData: { wpm: number; accuracy: number; time: number }) => {
      const now = Date.now();

      const round = await StatsService.saveRound({
        ...statsData,
        mode,
        difficulty,
      });

      lastSavedRef.current = {
        timestamp: now,
        wpm: statsData.wpm,
        time: statsData.time,
      };

      return round;
    },
    [mode, category, difficulty]
  );

  const getHistory = useCallback(() => {
    return StatsService.getStoredRounds();
  }, []);

  const getRecentRounds = useCallback((limit: number = 10) => {
    const rounds = StatsService.getStoredRounds();
    return rounds.slice(0, limit);
  }, []);

  const getRoundsByMode = useCallback((targetMode: 'timed' | 'passage') => {
    const rounds = StatsService.getStoredRounds();
    return rounds.filter((r) => r.mode === targetMode);
  }, []);

  const cleanupDuplicates = useCallback(() => {
    const rounds = StatsService.getStoredRounds();
    const uniqueRounds: typeof rounds = [];
    const seen = new Set<string>();

    rounds.forEach((round) => {
      const key = `${round.wpm}-${round.accuracy}-${round.time}-${round.mode}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRounds.push(round);
      }
    });

    if (uniqueRounds.length !== rounds.length) {
      console.log(
        `Removidas ${rounds.length - uniqueRounds.length} duplicatas`
      );
      localStorage.setItem('@typing-stats', JSON.stringify(uniqueRounds));
    }

    return uniqueRounds;
  }, []);

  return {
    saveRound,
    getHistory,
    getRecentRounds,
    getRoundsByMode,
    cleanupDuplicates,
  };
};
