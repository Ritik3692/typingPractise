'use client';

import React, { useState } from 'react';
import TypingTest from '@/components/TypingTest';
import ResultsOverlay from '@/components/ResultsOverlay';
import SettingsModal from '@/components/SettingsModal';
import { TestStats } from '@/types';

export default function Home() {
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleTestComplete = (stats: TestStats) => {
    setTestStats(stats);
  };

  const handleRestart = () => {
    setTestStats(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* Main Content */}
      <div className="w-full flex items-center justify-center">
        {testStats ? (
          <ResultsOverlay stats={testStats} onRestart={handleRestart} />
        ) : (
          <TypingTest onComplete={handleTestComplete} />
        )}
      </div>

      {/* Global Settings Trigger (Floating or hidden for now since Header has one) */}
      {/* Note: In a future refactor, we should connect the Header gear icon to this modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
