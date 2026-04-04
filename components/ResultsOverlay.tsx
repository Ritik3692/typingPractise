'use client';

import React from 'react';
import { TestStats } from '@/types';

interface ResultsOverlayProps {
  stats: TestStats;
  onRestart: () => void;
}

const ResultsOverlay: React.FC<ResultsOverlayProps> = ({ stats, onRestart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-12 glass rounded-3xl animate-in fade-in zoom-in duration-500 border border-sub/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="flex flex-col">
          <span className="text-2xl text-sub uppercase tracking-widest font-mono mb-2">wpm</span>
          <span className="text-[10rem] font-mono text-main leading-none -ml-2 -mt-4">{stats.wpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl text-sub uppercase tracking-widest font-mono mb-2">accuracy</span>
          <span className="text-[10rem] font-mono text-main leading-none -ml-2 -mt-4">{stats.accuracy}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-20">
        <div className="flex flex-col">
          <span className="text-xs text-sub uppercase tracking-widest mb-2 font-mono">raw wpm</span>
          <span className="text-5xl font-mono text-sub/80">{stats.rawWpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-sub uppercase tracking-widest mb-2 font-mono">correct</span>
          <span className="text-5xl font-mono text-text">{stats.correctChars}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-sub uppercase tracking-widest mb-2 font-mono">incorrect</span>
          <span className="text-5xl font-mono text-error">{stats.incorrectChars}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-sub uppercase tracking-widest mb-2 font-mono">extra</span>
          <span className="text-5xl font-mono text-error-extra">{stats.extraChars}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-sub uppercase tracking-widest mb-2 font-mono">missed</span>
          <span className="text-5xl font-mono text-sub">{stats.missedChars}</span>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center gap-4">
        <button
          onClick={onRestart}
          className="btn-primary flex items-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H9" />
          </svg>
          Restart Test
        </button>
        <div className="text-[10px] text-sub uppercase tracking-widest font-mono">
          Press Tab + Enter to skip
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;
