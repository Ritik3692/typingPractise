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
import { Card } from '@/components/ui/card';
import { Timer, RotateCcw, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateWPM, calculateAccuracy, calculateRawWPM, calculateConsistency } from '@/utils/calculations';

interface TypingTestProps {
  onComplete: (stats: TestStats) => void;
}

const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {
  const { settings, updateSettings } = useSettings();
  const [words, setWords] = useState<string[]>([]);
  const [chars, setChars] = useState<Char[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [isTestOver, setIsTestOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [history, setHistory] = useState<{ time: number; wpm: number }[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [caretHeight, setCaretHeight] = useState<number | undefined>(undefined);
  
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Timer logic
  const handleTimeUp = useCallback(() => {
    setIsTestOver(true);
  }, []);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(
    settings.mode === 'time' ? settings.modeValue : 0,
    handleTimeUp
  );

  const getElapsedSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    const end = endTimeRef.current || performance.now();
    return (end - startTimeRef.current) / 1000;
  }, []);

  const { wpm } = useTypingMetrics(
    correctTyped,
    totalTyped,
    getElapsedSeconds(),
    hasStarted && !isTestOver
  );

  // Track history every second
  useEffect(() => {
    if (hasStarted && !isTestOver) {
      const currentTime = settings.mode === 'time' ? settings.modeValue - timeLeft : timeLeft;
      if (currentTime > 0) {
        setHistory(prev => {
          // Only add if not already there for this second
          if (prev.length === 0 || prev[prev.length - 1].time !== currentTime) {
            return [...prev, { time: currentTime, wpm }];
          }
          return prev;
        });
      }
    }
  }, [hasStarted, isTestOver, timeLeft, wpm, settings.mode, settings.modeValue]);

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
    setHistory([]);
    startTimeRef.current = null;
    endTimeRef.current = null;
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
      startTimeRef.current = performance.now();
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
        endTimeRef.current = performance.now();
        setIsTestOver(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Ensure timer end also sets endTime
  useEffect(() => {
    if (isTestOver && !endTimeRef.current) {
      endTimeRef.current = performance.now();
    }
  }, [isTestOver]);

  // End test logic
  useEffect(() => {
    if (isTestOver) {
      const { correct, incorrect, extra, missed } = getCharStats(chars, currentIndex);
      const timePassed = getElapsedSeconds();
      
      const finalWpm = calculateWPM(correct, timePassed);
      const finalRawWpm = calculateRawWPM(totalTyped, timePassed);
      const finalAccuracy = calculateAccuracy(correct, totalTyped);
      const finalConsistency = calculateConsistency(history);

      const stats: TestStats = {
        wpm: finalWpm,
        rawWpm: finalRawWpm,
        accuracy: finalAccuracy,
        correctChars: correct,
        incorrectChars: incorrect,
        extraChars: extra,
        missedChars: missed,
        totalChars: chars.length,
        timeElapsed: Math.round(timePassed),
        wpmHistory: history,
        consistency: finalConsistency,
      };
      onComplete(stats);
    }
  }, [isTestOver, onComplete, totalTyped, chars, currentIndex, getElapsedSeconds, history]);

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
      setCaretHeight(rect.height * 1.02);
    } else if (currentIndex === 0 && containerRef.current) {
      // Handle initial position
      const firstChar = containerRef.current.querySelector('.char');
      if (firstChar) {
        const rect = firstChar.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();
        setCaretPos({
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left,
        });
        setCaretHeight(rect.height * 1.02);
      }
    }
  }, [currentIndex, words]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative flex flex-col items-center gap-8">
      {/* Mode Selector and Tools */}
      {!hasStarted && !isTestOver && (
        <Card className="px-6 py-2 bg-sub/5 border-sub/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500 rounded-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sub/50 font-mono text-[10px] uppercase tracking-[0.2em]">
              <Timer size={14} />
              time
            </div>
            
            <div className="w-px h-4 bg-sub/10" />
            
            <div className="flex gap-2">
              {[15, 30, 60, 100].map((val) => (
                <Button
                  key={val}
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSettings({ mode: 'time', modeValue: val })}
                  className={`font-mono text-xs px-3 h-8 rounded-lg transition-all ${
                    settings.modeValue === val ? 'text-main bg-main/5 font-bold scale-110' : 'text-sub/40 hover:text-sub'
                  }`}
                >
                  {val}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Stats Header (During Test) */}
      {!isTestOver && hasStarted && (
        <div className="flex text-3xl font-mono transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-sub uppercase tracking-widest mb-1">time</span>
            <span className="text-main tabular-nums">{timeLeft}</span>
          </div>
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
            height={caretHeight}
            isBlinking={!hasStarted}
            smooth={settings.smoothCaret}
          />
        )}
        
        <WordList words={words} chars={chars} currentIndex={currentIndex} />
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center gap-8 mt-12">
        {!hasStarted && !isTestOver && (
          <div className="text-sm text-sub/80 font-mono animate-pulse flex items-center gap-3 bg-sub/5 px-6 py-3 rounded-2xl border border-sub/5">
            <Keyboard size={16} strokeWidth={1.5} />
            Type to start test
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-8 transition-opacity duration-300">
           <button 
             onClick={() => initTest()}
             className="group flex flex-col items-center gap-2 text-sub hover:text-main transition-all"
           >
             <div className="p-3 rounded-full group-hover:bg-sub/10 transition-colors">
               <RotateCcw size={20} className="group-active:rotate-180 transition-transform duration-500" />
             </div>
             <div className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
               Restart (Tab + Enter)
             </div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
