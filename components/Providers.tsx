'use client';

import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SettingsProvider } from '@/contexts/SettingsContext';
import SettingsModal from '@/components/SettingsModal';

// Create a dark theme that matches the Monkeytype aesthetic
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#0c1014',
      paper: '#1c1c1c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#646669',
    },
  },
  typography: {
    fontFamily: "'Space Mono', monospace",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SettingsProvider>
          {children}
          <SettingsModal />
        </SettingsProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
