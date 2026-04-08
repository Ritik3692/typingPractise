import { Char, CharStatus } from '@/types';

/**
 * Standard calculation for WPM: (correct characters / 5) / (time in minutes)
 */
export const calculateWPM = (correctChars: number, timeSeconds: number): number => {
  if (timeSeconds <= 0) return 0;
  return Math.max(0, Math.round((correctChars / 5) / (timeSeconds / 60)));
};

/**
 * Standard calculation for Raw WPM: (total characters typed / 5) / (time in minutes)
 */
export const calculateRawWPM = (totalCharsTyped: number, timeSeconds: number): number => {
  if (timeSeconds <= 0) return 0;
  return Math.max(0, Math.round((totalCharsTyped / 5) / (timeSeconds / 60)));
};

/**
 * Standard calculation for Accuracy: (correct characters / total characters typed) * 100
 */
export const calculateAccuracy = (correctChars: number, totalCharsTyped: number): number => {
  if (totalCharsTyped === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalCharsTyped) * 100)));
};

export interface DetailedStats {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

export const getCharStats = (chars: Char[], currentIndex: number): DetailedStats => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    
    // Status is determined purely by the user's interaction
    if (char.status === 'correct') {
      correct++;
    } else if (char.status === 'incorrect') {
      incorrect++;
    } else if (char.status === 'extra') {
      extra++;
    } else if (i < currentIndex && char.status === 'pending') {
      // If a character was skipped within the already typed range, it's missed
      missed++;
    }
  }

  return { correct, incorrect, extra, missed };
};

/**
 * Calculates consistency as (1 - Coefficient of Variation) * 100
 * CV = standard deviation / mean
 */
export const calculateConsistency = (wpmHistory: { time: number; wpm: number }[]): number => {
  if (wpmHistory.length < 2) return 100;

  const wpms = wpmHistory.map(h => h.wpm);
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  
  if (mean === 0) return 0;

  const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  
  const cv = stdDev / mean;
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  
  return consistency;
};
