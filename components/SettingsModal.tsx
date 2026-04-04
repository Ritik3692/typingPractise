'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { TestMode, Difficulty } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  const modes: TestMode[] = ['time', 'words'];
  const difficulties: Difficulty[] = ['normal', 'expert', 'master'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl glass rounded-3xl p-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-mono uppercase tracking-widest text-main">Settings</h2>
          <button 
            onClick={onClose}
            className="text-sub hover:text-main transition-colors font-mono"
          >
            [Close]
          </button>
        </div>

        <div className="space-y-10">
          {/* Test Mode */}
          <section>
            <h3 className="text-xs text-sub uppercase tracking-widest mb-4 font-mono">Mode</h3>
            <div className="flex gap-4">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ mode: m })}
                  className={`flex-1 py-3 rounded-xl border font-mono text-sm uppercase tracking-widest transition-all ${
                    settings.mode === m 
                      ? 'border-main text-main bg-main/5' 
                      : 'border-sub/10 text-sub hover:border-sub/30'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* Difficulty */}
          <section>
            <h3 className="text-xs text-sub uppercase tracking-widest mb-4 font-mono">Difficulty</h3>
            <div className="flex gap-4">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => updateSettings({ difficulty: d })}
                  className={`flex-1 py-3 rounded-xl border font-mono text-sm uppercase tracking-widest transition-all ${
                    settings.difficulty === d 
                      ? 'border-main text-main bg-main/5' 
                      : 'border-sub/10 text-sub hover:border-sub/30'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Visual Settings */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5">
              <span className="text-xs text-sub uppercase tracking-wider font-mono">Live WPM</span>
              <button 
                onClick={() => updateSettings({ showLiveWpm: !settings.showLiveWpm })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.showLiveWpm ? 'bg-main' : 'bg-sub/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-bg transition-all ${settings.showLiveWpm ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5">
              <span className="text-xs text-sub uppercase tracking-wider font-mono">Live Accuracy</span>
              <button 
                onClick={() => updateSettings({ showLiveAccuracy: !settings.showLiveAccuracy })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.showLiveAccuracy ? 'bg-main' : 'bg-sub/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-bg transition-all ${settings.showLiveAccuracy ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5">
              <span className="text-xs text-sub uppercase tracking-wider font-mono">Smooth Caret</span>
              <button 
                onClick={() => updateSettings({ smoothCaret: !settings.smoothCaret })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.smoothCaret ? 'bg-main' : 'bg-sub/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-bg transition-all ${settings.smoothCaret ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-sub/5 flex justify-center">
          <p className="text-[10px] text-sub/50 uppercase tracking-[0.2em] font-mono">Settings are automatically saved</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
