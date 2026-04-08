'use client';

import React from 'react';
import { Char as CharType } from '@/types';

interface WordListProps {
  words: string[];
  chars: CharType[];
  currentIndex: number;
}

const WordList: React.FC<WordListProps> = ({ words, chars, currentIndex }) => {
  let charProcessedCount = 0;
  
  // Find which word is currently being typed
  let currentWordIdx = 0;
  let tempCount = 0;
  for (let i = 0; i < words.length; i++) {
    const wordLen = words[i].length + 1; // +1 for space
    if (tempCount + wordLen > currentIndex) {
      currentWordIdx = i;
      break;
    }
    tempCount += wordLen;
  }

  // Visible Window: Current word index + future buffer
  // We show all past words (history) and a small amount of future words
  const futureBuffer = 10; 
  const visibleWordsLimit = currentWordIdx + futureBuffer;

  return (
    <div className="flex w-full flex-wrap justify-center items-center content-start select-none relative transition-all duration-300 text-center">
      {words.map((word, wordIdx) => {
        const currentProcessed = charProcessedCount;
        charProcessedCount += word.length + 1; // +1 for space

        // Progressive reveal: Hide words too far in the future
        if (wordIdx > visibleWordsLimit) return null;

        return (
          <div 
            key={`word-${wordIdx}`} 
            className={`word py-1 px-0.5 transition-all duration-500 animate-in fade-in slide-in-from-right-2`}
          >
            {word.split('').map((char, charIdx) => {
              const globalIdx = currentProcessed + charIdx;
              const status = chars[globalIdx]?.status || 'pending';
              const isCurrent = globalIdx === currentIndex;

              return (
                <span
                  key={`char-${wordIdx}-${charIdx}`}
                  id={isCurrent ? 'current-char' : undefined}
                  className={`char font-mono transition-colors duration-100 ${status} ${isCurrent ? 'current' : ''}`}
                >
                  {char}
                </span>
              );
            })}
            {/* Space character */}
            {wordIdx < words.length - 1 && (
              <span
                key={`space-${wordIdx}`}
                id={currentProcessed + word.length === currentIndex ? 'current-char' : undefined}
                className={`char font-mono px-1 ${chars[currentProcessed + word.length]?.status || 'pending'} ${currentProcessed + word.length === currentIndex ? 'current' : ''}`}
              >
                &nbsp;
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordList;
