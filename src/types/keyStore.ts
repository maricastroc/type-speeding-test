export type Keystroke = {
  charIndex: number;
  expectedChar: string;
  typedChar: string;
  isCorrect: boolean;
  timestampMs: number;
};
