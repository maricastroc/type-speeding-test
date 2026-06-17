import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { StatsService } from '@/services/statsService';
import { roundsApi } from '@/services/roundsApi';
import useSWR from 'swr';

export const usePersonalBest = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  const { data: rounds } = useSWR(
    isLoggedIn ? '/api/rounds' : null,
    () => roundsApi.fetchRounds()
  );

  const [localBest, setLocalBest] = useState(0);

  useEffect(() => {
    if (isLoggedIn) return;

    const compute = () => {
      const stored = StatsService.getStoredRounds();
      setLocalBest(stored.length > 0 ? Math.max(...stored.map((r) => r.wpm)) : 0);
    };

    compute();

    const onStorage = (e: StorageEvent) => {
      if (e.key === '@typing-stats') compute();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return rounds && rounds.length > 0 ? Math.max(...rounds.map((r) => r.wpm)) : 0;
  }

  return localBest;
};
