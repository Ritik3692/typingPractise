export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'extra';

export interface Char {
  char: string;
  status: CharStatus;
}

export type TestMode = 'time' | 'words';

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalChars: number;
  timeElapsed: number;
}

export type Theme = 'default';
export type Difficulty = 'normal' | 'expert' | 'master';

export interface Settings {
  theme: Theme;
  mode: TestMode;
  modeValue: number;
  difficulty: Difficulty;
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  smoothCaret: boolean;
  stopOnError?: 'off' | 'word' | 'letter';
}
