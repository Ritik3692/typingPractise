'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { TestMode, Difficulty } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Settings as SettingsIcon, 
  Eye, 
  Activity, 
  Pointer, 
  Timer, 
  Type,
  Layout,
  Gauge
} from 'lucide-react';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactElement;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen: propIsOpen, onClose: propOnClose, trigger }) => {
  const { settings, updateSettings, isSettingsOpen: contextIsOpen, setIsSettingsOpen } = useSettings();
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onClose = propOnClose || (() => setIsSettingsOpen(false));

  const modes: TestMode[] = ['time', 'words'];
  const difficulties: Difficulty[] = ['normal', 'expert', 'master'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {trigger && <DialogTrigger render={trigger} />}
      
      <DialogContent className="max-w-2xl bg-bg border-sub/10 p-0 overflow-hidden rounded-3xl backdrop-blur-xl animate-in zoom-in-95 duration-500">
        <div className="p-8 space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3 mb-1">
               <div className="p-2 bg-main/10 rounded-xl">
                 <SettingsIcon size={20} className="text-main" />
               </div>
               <DialogTitle className="text-2xl font-mono uppercase tracking-widest text-main">Settings</DialogTitle>
            </div>
            <DialogDescription className="text-sub/80 font-mono text-xs uppercase tracking-widest">
              configure your professional typing environment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-12">
            {/* Test Configuration */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-sub/60 uppercase tracking-[0.2em] text-[10px] font-mono font-bold">
                <Layout size={12} />
                <span>Test Configuration</span>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                  <Label className="text-sub font-mono uppercase text-xs tracking-wider">Difficulty Level</Label>
                  <ToggleGroup 
                    value={[settings.difficulty]} 
                    onValueChange={(val) => val[0] && updateSettings({ difficulty: val[0] as any })}
                    className="justify-start gap-1"
                  >
                    {difficulties.map(d => (
                       <ToggleGroupItem key={d} value={d} className="px-5 py-2 rounded-xl border border-sub/10 font-mono text-xs capitalize">
                         {d}
                       </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </section>

            {/* Visual Feedback */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-sub/60 uppercase tracking-[0.2em] text-[10px] font-mono font-bold">
                <Eye size={12} />
                <span>Visual Feedback</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5 group hover:border-sub/10 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-sub uppercase">Live WPM</span>
                    <span className="text-[10px] text-sub/40 font-mono">Show real-time speed data</span>
                  </div>
                  <Switch 
                    checked={settings.showLiveWpm} 
                    onCheckedChange={(val) => updateSettings({ showLiveWpm: val })}
                    className="data-[state=checked]:bg-main"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5 group hover:border-sub/10 transition-colors">
                   <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-sub uppercase">Live Accuracy</span>
                    <span className="text-[10px] text-sub/40 font-mono">Monitor precision as you type</span>
                  </div>
                  <Switch 
                    checked={settings.showLiveAccuracy} 
                    onCheckedChange={(val) => updateSettings({ showLiveAccuracy: val })}
                    className="data-[state=checked]:bg-main"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-sub/5 border border-sub/5 group hover:border-sub/10 transition-colors">
                   <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-sub uppercase">Smooth Caret</span>
                    <span className="text-[10px] text-sub/40 font-mono">Smooth cursor movement animation</span>
                  </div>
                  <Switch 
                    checked={settings.smoothCaret} 
                    onCheckedChange={(val) => updateSettings({ smoothCaret: val })}
                    className="data-[state=checked]:bg-main"
                  />
                </div>
              </div>
            </section>

            {/* Performance */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-sub/80 uppercase tracking-[0.2em] text-[10px] font-mono font-bold">
                <Gauge size={12} />
                <span>Performance Calibration</span>
              </div>
              <div className="p-6 rounded-2xl bg-sub/5 border border-sub/10 space-y-6">
                 <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs font-mono text-sub uppercase">Input Mode Value</Label>
                    <span className="text-main font-mono">{settings.modeValue}</span>
                 </div>
                 <Slider 
                   value={[settings.modeValue]} 
                   onValueChange={(val) => {
                     const newValue = Array.isArray(val) ? val[0] : val;
                     if (typeof newValue === 'number') updateSettings({ modeValue: newValue });
                   }}
                   max={200}
                   min={10}
                   step={5}
                   className="py-4"
                 />
                 <div className="flex justify-between text-[10px] font-mono text-sub/40 uppercase tracking-widest">
                    <span>min: 10</span>
                    <span>max: 200</span>
                 </div>
              </div>
            </section>
          </div>

          <div className="pt-8 border-t border-sub/5 flex flex-col items-center gap-2 text-sub/60 font-mono text-[9px] uppercase tracking-[0.3em]">
             <span>Settings are synced automatically</span>
             <span>type-mono build v0.1.0</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
