'use client';

import React from 'react';
import Link from 'next/link';
import { Keyboard,User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export default function Header() {
  return (
    <header className="w-full mt-8 max-w-5xl mx-auto px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="flex items-center gap-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <Keyboard className="w-8 h-8 text-main transition-transform group-hover:scale-110 duration-500" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-main rounded-full animate-pulse blur-[1px]" />
          </div>
          <h1 className="text-2xl font-mono tracking-tighter text-main font-bold">
            Kar<span className="text-sub/40">type</span>
          </h1>
        </Link>

        {/* Primary Navigation Icons */}
        <div className="flex items-center gap-2">
           <NavIcon 
             icon={<Keyboard size={18} />} 
             label="Typer" 
             active={true}
           />
           {/* <NavIcon 
             icon={<Settings size={18} />} 
             label="Options" 
             isSettings={true}
           />
           <NavIcon 
             icon={<BarChart2 size={18} />} 
             label="Leaderboards" 
           />
           <NavIcon 
             icon={<Info size={18} />} 
             label="Information" 
           /> */}
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <NavIcon 
          icon={<User size={18} />} 
          label="Profile" 
        />
      </div>
    </header>
  );
}

function NavIcon({ 
  icon, 
  label, 
  active = false,
  isSettings = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  isSettings?: boolean;
}) {
  const { setIsSettingsOpen } = useSettings();

  return (
    <Tooltip>
      <TooltipTrigger 
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => isSettings && setIsSettingsOpen(true)}
            className={`w-10 h-10 rounded-xl transition-all duration-300 ${active ? 'text-main bg-main/5' : 'text-sub hover:text-main hover:bg-sub/5'}`}
          >
            {icon}
          </Button>
        }
      />
      <TooltipContent side="bottom" className="font-mono text-[10px] uppercase tracking-widest bg-sub text-bg border-none">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
