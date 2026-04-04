'use client';

import React, { useState } from 'react';
import TypingTest from '@/components/TypingTest';
import ResultsOverlay from '@/components/ResultsOverlay';
import SettingsModal from '@/components/SettingsModal';
import { TestStats } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

export default function Home() {
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const handleTestComplete = (stats: TestStats) => {
    setTestStats(stats);
  };

  const handleRestart = () => {
    setTestStats(null);
  };

  return (
    <main className="min-h-screen flex flex-col p-12 md:p-32 bg-bg transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center mb-24 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4">
          <div className="text-main">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V11H19V5H5V19H11V21M20,18V15H18V18H15V20H18V23H20V20H23V18H20Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tighter flex flex-col">
            <span className="text-text leading-none">monkeytype</span>
            <span className="text-sub text-[10px] uppercase tracking-[0.2em] font-light">clone</span>
          </h1>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-sub hover:text-main transition-all duration-200 focus:outline-none hover:rotate-90"
          title="Settings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Mode Selector Panel */}
      {!testStats && (
        <div className="flex justify-center mb-16 animate-in fade-in slide-in-from-top-6 duration-1000 delay-300">
          <div className="flex items-center bg-sub/5 p-1.5 rounded-[20px] border border-sub/10 backdrop-blur-xl shadow-2xl shadow-black/20">
            <div className="flex items-center px-4 py-1 gap-2">
              {['time', 'words'].map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ mode: m as any })}
                  className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-[0.25em] transition-all duration-300 ease-out active:scale-95 ${
                    settings.mode === m 
                      ? 'text-main bg-main/15 shadow-sm ring-1 ring-main/20' 
                      : 'text-sub/60 hover:text-text hover:bg-sub/10'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <div className="w-[1.5px] h-6 bg-sub/15 rounded-full mx-2" />

            <div className="flex items-center px-4 py-1 gap-2">
              {(settings.mode === 'time' ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((v) => (
                <button
                  key={v}
                  onClick={() => updateSettings({ modeValue: v })}
                  className={`px-5 py-2 rounded-xl text-xs font-mono transition-all duration-300 ease-out active:scale-95 ${
                    settings.modeValue === v 
                      ? 'text-main bg-main/15 shadow-sm ring-1 ring-main/20' 
                      : 'text-sub/60 hover:text-text hover:bg-sub/10'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grow flex items-center justify-center">
        {testStats ? (
          <ResultsOverlay stats={testStats} onRestart={handleRestart} />
        ) : (
          <TypingTest onComplete={handleTestComplete} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center text-sub/50 font-mono text-[10px] flex flex-col gap-2">
        <div className="flex justify-center gap-12 mb-6">
          <div className="flex flex-col items-start">
            <span className="uppercase tracking-[0.2em] text-sub/30 mb-1">current mode</span>
            <span className="text-sub/80">{settings.mode} {settings.modeValue}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="uppercase tracking-[0.2em] text-sub/30 mb-1">difficulty</span>
            <span className="text-sub/80">{settings.difficulty}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="uppercase tracking-[0.2em] text-sub/30 mb-1">theme</span>
            <span className="text-sub/80">{settings.theme}</span>
          </div>
        </div>
        <div className="opacity-30 hover:opacity-100 transition-opacity duration-300">
          Monkeytype Clone &copy; 2026 • Built with Next.js & Tailwind
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </main>
  );
}
