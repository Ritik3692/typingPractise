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

  return (
    <div className="relative flex w-full flex-wrap items-start justify-center content-start self-start select-none text-center transition-all duration-300">
      {words.map((word, wordIdx) => {
        const currentProcessed = charProcessedCount;
        charProcessedCount += word.length + 1; // +1 for space

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
