// contexts/ConfigContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

type GameMode = 'timed' | 'passage';

interface ConfigContextType {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  initialTime: number;
  setInitialTime: (time: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode>('timed');

  const [initialTime, setInitialTime] = useState(60);

  return (
    <ConfigContext.Provider
      value={{ mode, setMode, initialTime, setInitialTime }}
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
