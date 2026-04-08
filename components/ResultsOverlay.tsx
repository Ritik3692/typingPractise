'use client';

import React from 'react';
import { TestStats } from '@/types';
import { Button } from '@/components/ui/button';
import { LineChart } from '@mui/x-charts/LineChart';
import { RotateCcw, Share2, Info } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface ResultsOverlayProps {
  stats: TestStats;
  onRestart: () => void;
}

const ResultsOverlay: React.FC<ResultsOverlayProps> = ({ stats, onRestart }) => {
  const { settings } = useSettings();
  
  // Prepare data for the chart
  const chartData = stats.wpmHistory.length > 0 ? stats.wpmHistory.map(h => h.wpm) : [0, stats.wpm];
  const labels = stats.wpmHistory.length > 0 ? stats.wpmHistory.map(h => h.time) : [0, stats.timeElapsed];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-12 animate-in fade-in duration-1000 font-mono text-sub">
      {/* Top Section: Metrics + Chart */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        
        {/* Left: Primary Metrics (WPM + ACC) */}
        <div className="flex flex-col gap-8 min-w-[120px]">
          <div className="flex flex-col">
            <span className="text-xl lowercase tracking-tighter opacity-50">wpm</span>
            <span className="text-7xl md:text-8xl font-bold text-main leading-none mt-[-4px]">
              {stats.wpm}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl lowercase tracking-tighter opacity-50">acc</span>
            <span className="text-7xl md:text-8xl font-bold text-main leading-none mt-[-4px]">
              {stats.accuracy}%
            </span>
          </div>
        </div>

        {/* Center: Expansive Chart */}
        <div className="flex-1 w-full h-[300px] relative">
           <div className="absolute top-0 left-0 text-[10px] uppercase tracking-widest opacity-30 flex flex-col gap-8 h-full justify-between py-4 pl-2 pointer-events-none">
             <span>80</span>
             <span>60</span>
             <span>40</span>
             <span>20</span>
             <span>0</span>
           </div>
           <LineChart
            xAxis={[{ 
              data: labels, 
              scaleType: 'point', 
              hideTooltip: true,
              disableLine: true,
              disableTicks: true
            }]}
            series={[
              {
                data: chartData,
                area: true,
                color: '#e2b714',
                showMark: false,
                curve: 'linear',
              },
            ]}
            height={300}
            margin={{ top: 20, bottom: 20, left: 40, right: 10 }}
            slotProps={{
              legend: { hidden: true } as any,
            }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2,
              },
              '.MuiAreaElement-root': {
                fill: '#e2b714',
                opacity: 0.1,
              },
              '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                display: 'none'
              }
            }}
          />
          {/* Bottom X-axis markers */}
          <div className="flex justify-between w-full px-10 text-[10px] opacity-20 mt-[-10px]">
             {labels.filter((_, i) => i % Math.max(1, Math.floor(labels.length / 10)) === 0).map(l => (
               <span key={l}>{l}</span>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-sub/10 pt-8">
        <SummaryItem 
          label="test type" 
          value={`${settings.mode} ${settings.modeValue}`} 
          subValue="english"
        />
        <SummaryItem 
          label="raw" 
          value={stats.rawWpm.toString()} 
        />
        <SummaryItem 
          label="characters" 
          value={`${stats.correctChars}/${stats.incorrectChars}/${stats.missedChars}/${stats.extraChars}`} 
        />
        <SummaryItem 
          label="consistency" 
          value={`${stats.consistency}%`} 
        />
        <SummaryItem 
          label="time" 
          value={`${stats.timeElapsed}s`} 
          subValue="00:00:15 session"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-4">
        <button 
          onClick={onRestart}
          className="p-4 rounded-xl hover:bg-sub/10 text-sub hover:text-main transition-all group"
          title="Restart (Tab + Enter)"
        >
          <RotateCcw size={24} className="group-active:rotate-180 transition-transform duration-500" />
        </button>
        <button className="p-4 rounded-xl hover:bg-sub/10 text-sub hover:text-main transition-all group">
          <Share2 size={24} />
        </button>
        <button className="p-4 rounded-xl hover:bg-sub/10 text-sub hover:text-main transition-all group">
          <Info size={24} />
        </button>
      </div>
    </div>
  );
};

function SummaryItem({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
      <span className="text-xs uppercase tracking-widest opacity-40">{label}</span>
      <span className="text-3xl font-bold text-main">{value}</span>
      {subValue && <span className="text-[10px] opacity-30 mt-[-2px]">{subValue}</span>}
    </div>
  );
}

export default ResultsOverlay;
