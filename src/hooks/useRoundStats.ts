import { useCallback } from 'react';
import { StatsService } from '@/services/statsService';
import { useConfig } from '@/contexts/ConfigContext';

export const useRoundStats = () => {
  const { mode, category, difficulty } = useConfig();

  const saveRound = useCallback(
    async (statsData: { wpm: number; accuracy: number; time: number }) => {
      const round = await StatsService.saveRound({
        ...statsData,
        mode,
        difficulty,
      });

      return round;
    },
    [mode, category, difficulty]
  );

  const getHistory = useCallback(() => {
    return StatsService.getStoredRounds();
  }, []);

  const getAggregated = useCallback(() => {
    return StatsService.getAggregatedStats();
  }, []);

  const getRecentRounds = useCallback((limit: number = 10) => {
    const rounds = StatsService.getStoredRounds();
    return rounds.slice(0, limit);
  }, []);

  const getRoundsByMode = useCallback((targetMode: 'timed' | 'passage') => {
    const rounds = StatsService.getStoredRounds();
    return rounds.filter((r) => r.mode === targetMode);
  }, []);

  return {
    saveRound,
    getHistory,
    getAggregated,
    getRecentRounds,
    getRoundsByMode,
  };
};
