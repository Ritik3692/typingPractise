'use client';

import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { 
  Button as MuiButton, 
  Slider, 
  Typography, 
  Box, 
  Container,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { Send, Settings, Palette } from 'lucide-react';
import { Settings as MuiSettingsIcon } from '@mui/icons-material';

export default function UITestPage() {
  const [sliderValue, setSliderValue] = React.useState<number>(30);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
            UI Library Integration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Testing <strong>Shadcn UI</strong> and <strong>Material UI</strong> side-by-side in Next.js.
          </Typography>
        </Box>

        {/* Shadcn UI Section */}
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Palette size={20} />
              <Typography variant="h6">Shadcn UI (Tailwind based)</Typography>
            </Box>
            <Divider />
            <div className="flex flex-wrap gap-4">
              <ShadcnButton>Default Button</ShadcnButton>
              <ShadcnButton variant="outline">Outline Button</ShadcnButton>
              <ShadcnButton variant="destructive">Destructive</ShadcnButton>
              <ShadcnButton variant="secondary">Secondary</ShadcnButton>
              <ShadcnButton variant="ghost">Ghost</ShadcnButton>
            </div>
            <Typography variant="caption" color="text.secondary">
              These buttons use Tailwind CSS classes and are highly customizable via code.
            </Typography>
          </Stack>
        </Paper>

        {/* Material UI Section */}
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MuiSettingsIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6">Material UI (Emotion based)</Typography>
            </Box>
            <Divider />
            <Stack direction="row" spacing={2}>
              <MuiButton variant="contained">Contained</MuiButton>
              <MuiButton variant="outlined" startIcon={<Send size={16} />}>
                Outlined w/ Icon
              </MuiButton>
              <MuiButton color="success">Success Color</MuiButton>
            </Stack>
            
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Slider Component</Typography>
              <Slider 
                value={sliderValue} 
                onChange={(_, val) => setSliderValue(val as number)}
                valueLabelDisplay="auto"
                sx={{ maxWidth: 300 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Value: {sliderValue}
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              These components use MUI's specialized styling engine and offer complex out-of-the-box functionality.
            </Typography>
          </Stack>
        </Paper>

        {/* Connection Info */}
        <Box sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Settings Context remains active across both library components.
          </Typography>
          <div className="mt-4">
            <a href="/" className="text-sub hover:text-main transition-colors font-mono underline underline-offset-4">
              ← Back to Typing Test
            </a>
          </div>
        </Box>
      </Stack>
    </Container>
  );
}
