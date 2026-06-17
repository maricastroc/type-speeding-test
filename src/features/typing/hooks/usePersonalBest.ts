import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { StatsService } from '@/services/statsService';
import { roundsApi } from '@/services/roundsApi';

export const usePersonalBest = () => {
  const [personalBest, setPersonalBest] = useState(0);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  const fetchPersonalBest = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const rounds = await roundsApi.fetchRounds();
        const best = rounds.length > 0 ? Math.max(...rounds.map((r) => r.wpm)) : 0;
        setPersonalBest(best);
      } catch {
        setPersonalBest(0);
      }
      return;
    }

    const rounds = StatsService.getStoredRounds();
    const best = rounds.length > 0 ? Math.max(...rounds.map((r) => r.wpm)) : 0;
    setPersonalBest(best);
  }, [isLoggedIn]);

  useEffect(() => {
    fetchPersonalBest();

    const handleStatsUpdate = () => fetchPersonalBest();
    window.addEventListener('statsUpdated', handleStatsUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@typing-stats') fetchPersonalBest();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchPersonalBest]);

  return personalBest;
};
