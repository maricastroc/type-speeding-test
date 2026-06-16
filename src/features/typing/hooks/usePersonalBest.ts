import { useCallback, useEffect, useState } from 'react';
import { StatsService } from '@/services/statsService';

export const usePersonalBest = () => {
  const [personalBest, setPersonalBest] = useState(0);

  const fetchPersonalBest = useCallback(() => {
    const rounds = StatsService.getStoredRounds();

    if (rounds.length === 0) {
      setPersonalBest(0);
      return;
    }

    const best = Math.max(...rounds.map((round) => round.wpm));
    setPersonalBest(best);
  }, []);

  useEffect(() => {
    fetchPersonalBest();

    const handleStatsUpdate = () => {
      fetchPersonalBest();
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@typing-stats') {
        fetchPersonalBest();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchPersonalBest]);

  return personalBest;
};
