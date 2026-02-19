/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from 'react';

export type SoundOption =
  | 'none'
  | 'punch'
  | 'click'
  | 'beep'
  | 'creamy'
  | 'hitmarker'
  | 'osu'
  | 'pop'
  | 'rubber'
  | 'typewriter'
  | 'error';

interface SoundContextType {
  soundName: SoundOption;
  setSoundName: (name: SoundOption) => void;
  playKeystroke: () => void;
  playErrorSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const SOUND_FILES_COUNT: Record<string, number> = {
  punch: 8,
  click: 3,
  beep: 3,
  error: 5,
  creamy: 12,
  hitmarker: 6,
  osu: 6,
  pop: 3,
  rubber: 5,
  typewriter: 12,
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundName, setSoundName] = useState<SoundOption>('creamy');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const bufferCache = useRef<Map<string, AudioBuffer[]>>(new Map());

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioCtxRef.current;
  };

  const playKeystroke = useCallback(async () => {
    if (soundName === 'none') return;

    const ctx = getAudioCtx();

    if (ctx.state === 'suspended') await ctx.resume();

    if (!bufferCache.current.has(soundName)) {
      const count = SOUND_FILES_COUNT[soundName] || 1;
      const promises = Array.from({ length: count }).map((_, i) =>
        fetch(`/assets/sounds/${soundName}/${soundName}${i + 1}.wav`)
          .then((res) => res.arrayBuffer())
          .then((data) => ctx.decodeAudioData(data))
      );

      bufferCache.current.set(soundName, await Promise.all(promises));
    }

    const buffers = bufferCache.current.get(soundName);
    if (!buffers) return;

    const source = ctx.createBufferSource();

    source.buffer = buffers[Math.floor(Math.random() * buffers.length)];

    source.playbackRate.value = 0.95 + Math.random() * 0.1;

    const gainNode = ctx.createGain();

    gainNode.gain.value = 0.4;

    source.connect(gainNode);

    gainNode.connect(ctx.destination);

    source.start(0);
  }, [soundName]);

  const playErrorSound = useCallback(async () => {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    if (!bufferCache.current.has('error')) {
      try {
        const count = SOUND_FILES_COUNT['error'] || 1;

        const promises = Array.from({ length: count }).map((_, i) =>
          fetch(`/assets/sounds/error/error${i + 1}.wav`)
            .then((res) => {
              if (!res.ok) throw new Error('File not found');
              return res.arrayBuffer();
            })
            .then((data) => ctx.decodeAudioData(data))
        );

        const buffers = await Promise.all(promises);
        bufferCache.current.set('error', buffers);
        console.log('erro!');
      } catch (err) {
        console.error('Erro ao carregar som de erro:', err);
        return;
      }
    }

    const buffers = bufferCache.current.get('error');
    if (!buffers) return;

    const source = ctx.createBufferSource();
    source.buffer = buffers[0];

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.3;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);
  }, []);

  return (
    <SoundContext.Provider
      value={{ playKeystroke, playErrorSound, setSoundName, soundName }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};
