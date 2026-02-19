// contexts/ConfigContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

type GameMode = 'timed' | 'passage';

type Category = 'general' | 'lyrics' | 'quotes' | 'code';
type Difficulty = 'easy' | 'medium' | 'hard';

interface ConfigContextType {
  mode: GameMode;
  setMode: (mode: GameMode) => void;

  category: Category;
  setCategory: (category: Category) => void;

  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;

  initialTime: number;
  setInitialTime: (time: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode>('timed');

  const [category, setCategory] = useState<
    'general' | 'lyrics' | 'quotes' | 'code'
  >('general');

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy'
  );

  const [initialTime, setInitialTime] = useState(60);

  return (
    <ConfigContext.Provider
      value={{
        mode,
        setMode,
        category,
        setCategory,
        difficulty,
        setDifficulty,
        initialTime,
        setInitialTime,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context)
    throw new Error('useConfig deve ser usado dentro de ConfigProvider');
  return context;
};
