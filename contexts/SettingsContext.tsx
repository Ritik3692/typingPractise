'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Settings, Theme, TestMode, Difficulty } from '@/types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setMode: (mode: TestMode) => void;
  setModeValue: (value: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setStopOnError: (value: 'off' | 'word' | 'letter') => void;
  toggleLiveWpm: () => void;
  toggleLiveAccuracy: () => void;
  toggleSmoothCaret: () => void;
}

const defaultSettings: Settings = {
  theme: 'default',
  mode: 'time',
  modeValue: 30,
  difficulty: 'normal',
  stopOnError: 'off',
  showLiveWpm: true,
  showLiveAccuracy: true,
  smoothCaret: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('monkeytype-clone-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('monkeytype-clone-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<Settings>) => setSettings((s: Settings) => ({ ...s, ...newSettings }));
  const setMode = (mode: TestMode) => setSettings((s: Settings) => ({ ...s, mode }));
  const setModeValue = (modeValue: number) => setSettings((s: Settings) => ({ ...s, modeValue }));
  const setDifficulty = (difficulty: Difficulty) => setSettings((s: Settings) => ({ ...s, difficulty }));
  const setStopOnError = (stopOnError: 'off' | 'word' | 'letter') => setSettings((s: Settings) => ({ ...s, stopOnError }));
  const toggleLiveWpm = () => setSettings((s: Settings) => ({ ...s, showLiveWpm: !s.showLiveWpm }));
  const toggleLiveAccuracy = () => setSettings((s: Settings) => ({ ...s, showLiveAccuracy: !s.showLiveAccuracy }));
  const toggleSmoothCaret = () => setSettings((s: Settings) => ({ ...s, smoothCaret: !s.smoothCaret }));

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setMode,
        setModeValue,
        setDifficulty,
        setStopOnError,
        toggleLiveWpm,
        toggleLiveAccuracy,
        toggleSmoothCaret,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
