import { useState, useEffect } from 'react';
import { calculateWPM, calculateAccuracy } from '@/utils/calculations';

export const useTypingMetrics = (correctTyped: number, totalTyped: number, timeSeconds: number, isActive: boolean) => {
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (isActive && timeSeconds > 0) {
      const currentWpm = calculateWPM(correctTyped, timeSeconds);
      setWpm(currentWpm);

      const currentAcc = calculateAccuracy(correctTyped, totalTyped);
      setAccuracy(currentAcc);
    }
  }, [correctTyped, totalTyped, timeSeconds, isActive]);

  return { wpm, accuracy };
};
