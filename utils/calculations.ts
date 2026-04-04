import { Char, CharStatus } from '@/types';

export const calculateWPM = (correctChars: number, timeSeconds: number): number => {
  if (timeSeconds === 0) return 0;
  // WPM = (words typed) / (time in minutes)
  // 1 word is standardized as 5 characters including spaces
  return Math.round((correctChars / 5) / (timeSeconds / 60));
};

export const calculateAccuracy = (correctChars: number, totalCharsTyped: number): number => {
  if (totalCharsTyped === 0) return 0;
  // Accuracy = (correct keys / total keys typed) * 100
  return Math.round((correctChars / totalCharsTyped) * 100);
};

export const getCharStats = (chars: Char[], currentIndex: number) => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  // Attempted range is up to currentIndex
  for (let i = 0; i < currentIndex; i++) {
    if (chars[i].status === 'correct') {
      correct++;
    } else if (chars[i].status === 'incorrect') {
      incorrect++;
    } else if (chars[i].status === 'extra') {
      extra++;
    }
  }

  // Missed characters are those that remained 'pending' 
  // but were part of a word that the user already passed by (went beyond with a space).
  // For simplicity, we can count pending chars up to the last attempted index.
  for (let i = 0; i < currentIndex; i++) {
    if (chars[i].status === 'pending') {
      missed++;
    }
  }
  
  return { correct, incorrect, extra, missed };
};
