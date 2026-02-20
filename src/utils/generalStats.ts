export type GeneralStats = {
  wpm: number; // Média de WPM (só acertos)
  raw: number; // Média bruta (inclui erros)
  accuracy: number; // Precisão geral
  characters: {
    // Caracteres (corretos / total)
    correct: number;
    total: number;
  };
  consistency: number; // Consistência (baseada na variação do WPM)
  time: number; // Tempo total em segundos
  peakWPM: number; // Pico de WPM
  peakRaw: number; // Pico de Raw
};
