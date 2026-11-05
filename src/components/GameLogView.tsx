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
      <div className="bg-[var(--theme-bg-main)]/80 border border-[var(--theme-border)]/50 rounded-xl p-2.5 backdrop-blur-sm shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-[var(--theme-accent)] font-bold uppercase tracking-wider mb-1.5 px-1">
          <span>Live Match Feed</span>
          <span className="text-[var(--theme-text-muted)]">Last {recentLogs.length} events</span>
        </div>
        <div className="space-y-1">
          {recentLogs.map(entry => (
            <div
              key={entry.id}
              className={`text-[11px] leading-tight px-2 py-1 rounded ${
                entry.type === 'win'
                  ? 'bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] font-bold border border-[var(--theme-accent)]/40'
                  : entry.type === 'penalty'
                  ? 'bg-red-950/40 text-red-200 border-l-2 border-red-500'
                  : entry.type === 'special' || entry.type === 'whot'
                  ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] font-medium'
                  : 'text-[var(--theme-text-primary)]/80'
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
