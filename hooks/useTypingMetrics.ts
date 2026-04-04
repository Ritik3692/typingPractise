import { useState, useEffect } from 'react';

export const useTypingMetrics = (correctTyped: number, totalTyped: number, timeSeconds: number, isActive: boolean) => {
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (isActive && timeSeconds > 0) {
      // Calculate WPM = (typed characters / 5) / (seconds / 60)
      const currentWpm = Math.round((correctTyped / 5) / (timeSeconds / 60));
      setWpm(currentWpm);

      // Accuracy = (correct keys / total keys typed) * 100
      const currentAcc = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;
      setAccuracy(currentAcc);
    }
  }, [correctTyped, totalTyped, timeSeconds, isActive]);

  return { wpm, accuracy };
};
