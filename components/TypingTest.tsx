'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTimer } from '@/hooks/useTimer';
import { useTypingMetrics } from '@/hooks/useTypingMetrics';
import { generateWords, generateTimeModeWords } from '@/utils/wordList';
import { getCharStats } from '@/utils/calculations';
import { Char, CharStatus, TestStats } from '@/types';
import WordList from './WordList';
import Caret from './Caret';

interface TypingTestProps {
  onComplete: (stats: TestStats) => void;
}

const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {
  const { settings } = useSettings();
  const [words, setWords] = useState<string[]>([]);
  const [chars, setChars] = useState<Char[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [isTestOver, setIsTestOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

  // Timer logic
  const handleTimeUp = useCallback(() => {
    setIsTestOver(true);
  }, []);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(
    settings.mode === 'time' ? settings.modeValue : 0,
    handleTimeUp
  );

  const { wpm, accuracy } = useTypingMetrics(
    correctTyped,
    totalTyped,
    settings.mode === 'time' ? settings.modeValue - timeLeft : timeLeft, // time passed
    hasStarted && !isTestOver
  );

  // Initialize test
  const initTest = useCallback(() => {
    let newWords: string[] = [];
    if (settings.mode === 'time') {
      newWords = generateTimeModeWords(100, settings.modeValue);
    } else {
      newWords = generateWords(settings.modeValue);
    }
    
    setWords(newWords);
    const flatChars = newWords.join(' ').split('').map(c => ({ char: c, status: 'pending' as CharStatus }));
    setChars(flatChars);
    
    setCurrentIndex(0);
    setTotalTyped(0);
    setCorrectTyped(0);
    setIsTestOver(false);
    setHasStarted(false);
    resetTimer(settings.mode === 'time' ? settings.modeValue : 0);
    
    // Focus after brief delay to ensure DOM is ready
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [settings.mode, settings.modeValue, resetTimer]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestOver) return;
    
    const { key } = e;
    
    // Start test on first key (excluding some function keys)
    if (!hasStarted && key.length === 1) {
      setHasStarted(true);
      if (settings.mode === 'time') startTimer();
    }

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setChars(prev => {
          const next = [...prev];
          if (next[currentIndex - 1].status === 'correct') {
            setCorrectTyped(c => Math.max(0, c - 1));
          }
          next[currentIndex - 1].status = 'pending';
          return next;
        });
      }
      return;
    }

    if (key === 'Enter' || key === 'Tab') {
      e.preventDefault();
      initTest();
      return;
    }

    // Ignore other special keys
    if (key.length !== 1) return;

    // Handle normal character
    if (currentIndex < chars.length) {
      const expectedChar = chars[currentIndex].char;
      setTotalTyped(prev => prev + 1);
      
      setChars(prev => {
        const next = [...prev];
        const isMatch = key === expectedChar;
        if (isMatch) {
          next[currentIndex].status = 'correct';
          setCorrectTyped(c => c + 1);
        } else {
          next[currentIndex].status = 'incorrect';
        }
        return next;
      });

      // Handle words mode ending
      if (settings.mode === 'words' && currentIndex === chars.length - 1) {
        setIsTestOver(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // End test logic
  useEffect(() => {
    if (isTestOver) {
      const { correct, incorrect, extra, missed } = getCharStats(chars, currentIndex);
      const timePassed = settings.mode === 'time' ? settings.modeValue : timeLeft; // timePassed is what we want
      
      const stats: TestStats = {
        wpm,
        rawWpm: Math.round((totalTyped / 5) / (settings.modeValue / 60)),
        accuracy,
        correctChars: correct,
        incorrectChars: incorrect,
        extraChars: extra,
        missedChars: missed,
        totalChars: chars.length,
        timeElapsed: settings.modeValue
      };
      onComplete(stats);
    }
  }, [isTestOver, onComplete, wpm, accuracy, totalTyped, chars, currentIndex, settings.mode, settings.modeValue]);

  // Update caret position
  useEffect(() => {
    const charElem = document.getElementById('current-char');
    if (charElem && containerRef.current) {
      const rect = charElem.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();
      setCaretPos({
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left,
      });
    } else if (currentIndex === 0 && containerRef.current) {
      // Handle initial position
      const firstWord = containerRef.current.querySelector('.word');
      if (firstWord) {
        const rect = firstWord.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();
        setCaretPos({
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left,
        });
      }
    }
  }, [currentIndex, words]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 relative flex flex-col items-center">
      {/* Stats Header */}
      {!isTestOver && hasStarted && (
        <div className="flex gap-16 mb-12 text-3xl font-mono transition-opacity duration-300">
          {settings.mode === 'time' && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sub uppercase tracking-widest mb-1">time</span>
              <span className="text-main">{timeLeft}</span>
            </div>
          )}
          {settings.showLiveWpm && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sub uppercase tracking-widest mb-1">wpm</span>
              <span className="text-main">{wpm}</span>
            </div>
          )}
          {settings.showLiveAccuracy && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sub uppercase tracking-widest mb-1">acc</span>
              <span className="text-main">{accuracy}%</span>
            </div>
          )}
        </div>
      )}

      {/* Main typing area */}
      <div 
        ref={containerRef}
        onClick={handleContainerClick}
        className={`relative w-full min-h-[160px] transition-all duration-300 ${!hasStarted && !isTestOver ? 'cursor-text' : ''}`}
      >
        <input
          ref={inputRef}
          type="text"
          className="hidden-input"
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
        />
        
        {/* Caret */}
        {!isTestOver && (
          <Caret
            top={caretPos.top}
            left={caretPos.left}
            isBlinking={!hasStarted}
            smooth={settings.smoothCaret}
          />
        )}
        
        <WordList words={words} chars={chars} currentIndex={currentIndex} />
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center gap-6 mt-12">
        {!hasStarted && !isTestOver && (
          <div className="text-sm text-sub font-mono animate-pulse flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            Type to start test
          </div>
        )}
        
        {/* Restart hint */}
        <div className="text-[11px] text-sub/60 font-mono tracking-wider uppercase flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-sub/10">Tab</span>
          <span>+</span>
          <span className="px-1.5 py-0.5 rounded bg-sub/10">Enter</span>
          <span className="ml-1">to restart</span>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
