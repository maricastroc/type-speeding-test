import { useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { StatsService } from '@/services/statsService';
import { roundsApi } from '@/services/roundsApi';
import { useConfig } from '@/features/settings/context/ConfigContext';

export const useRoundStats = () => {
  const { mode, category, difficulty } = useConfig();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  const lastSavedRef = useRef<{
    timestamp: number;
    wpm: number;
    time: number;
  } | null>(null);

  const saveRound = useCallback(
    async (statsData: { wpm: number; accuracy: number; time: number }) => {
      const now = Date.now();

      if (lastSavedRef.current) {
        const { wpm, time } = lastSavedRef.current;
        const isSameRound =
          wpm === statsData.wpm &&
          time === statsData.time &&
          now - lastSavedRef.current.timestamp < 1000;
        if (isSameRound) return null;
      }

      lastSavedRef.current = { timestamp: now, wpm: statsData.wpm, time: statsData.time };

      const payload = { ...statsData, mode, difficulty };

      if (isLoggedIn) {
        return roundsApi.saveRound(payload);
      }

      return StatsService.saveRound(payload);
    },
    [mode, category, difficulty, isLoggedIn]
  );

  const getHistory = useCallback(() => {
    return StatsService.getStoredRounds();
  }, []);

  const getRecentRounds = useCallback((limit: number = 10) => {
    return StatsService.getStoredRounds().slice(0, limit);
  }, []);

  const getRoundsByMode = useCallback((targetMode: 'timed' | 'passage') => {
    return StatsService.getStoredRounds().filter((r) => r.mode === targetMode);
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
      localStorage.setItem('@typing-stats', JSON.stringify(uniqueRounds));
    }

    return uniqueRounds;
  }, []);

  const deleteRound = useCallback((id: string) => {
    StatsService.deleteRound(id);
  }, []);

  return {
    isLoggedIn,
    saveRound,
    getHistory,
    getRecentRounds,
    getRoundsByMode,
    cleanupDuplicates,
    deleteRound,
  };
};
