import React from 'react';
import { GameLogEntry } from '../game/types';

interface GameLogViewProps {
  logs: GameLogEntry[];
}

export const GameLogView: React.FC<GameLogViewProps> = ({ logs }) => {
  // Show most recent entries at the top
  const recentLogs = [...logs].reverse().slice(0, 4);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-1 text-xs select-none">
      <div className="bg-[#08291F]/70 border border-[#176B45]/40 rounded-xl p-2.5 backdrop-blur-sm shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-[#D7B45A] font-bold uppercase tracking-wider mb-1.5 px-1">
          <span>Live Match Feed</span>
          <span className="text-[#F7F3E8]/40">Last {recentLogs.length} events</span>
        </div>
        <div className="space-y-1">
          {recentLogs.map(entry => (
            <div
              key={entry.id}
              className={`text-[11px] leading-tight px-2 py-1 rounded ${
                entry.type === 'win'
                  ? 'bg-[#7CCB75]/20 text-[#7CCB75] font-bold border border-[#7CCB75]/40'
                  : entry.type === 'penalty'
                  ? 'bg-red-950/40 text-red-200 border-l-2 border-red-500'
                  : entry.type === 'special' || entry.type === 'whot'
                  ? 'bg-[#D7B45A]/10 text-[#D7B45A] font-medium'
                  : 'text-[#F7F3E8]/80'
              }`}
            >
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
