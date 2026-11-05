import React from 'react';
import { GameLogEntry } from '../game/types';

interface GameLogViewProps {
  logs: GameLogEntry[];
}

export const GameLogView: React.FC<GameLogViewProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // Show most recent entries at the top
  const recentLogs = [...logs].reverse().slice(0, 4);
  const latestEntry = recentLogs[0];

  return (
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 py-1 text-xs select-none">
      <div className="bg-[var(--theme-bg-main)]/90 border border-[var(--theme-border)]/50 rounded-xl p-2 sm:p-2.5 backdrop-blur-sm shadow-inner">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex items-center justify-between w-full text-[10px] text-[var(--theme-accent)] font-bold uppercase tracking-wider px-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
            Live Match Feed
          </span>
          <span className="text-[var(--theme-text-muted)] flex items-center gap-1">
            <span>Last {recentLogs.length} events</span>
            <span className="sm:hidden text-xs">{isExpanded ? '▲' : '▼'}</span>
          </span>
        </button>

        {/* Desktop always shows full list; Mobile toggles or shows latest */}
        <div className={`space-y-1 mt-1.5 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
          {recentLogs.map(entry => (
            <div
              key={entry.id}
              className={`text-[10px] sm:text-[11px] leading-tight px-2 py-0.5 sm:py-1 rounded ${
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

        {/* On mobile when collapsed: show single-line latest event */}
        {!isExpanded && latestEntry && (
          <div className="sm:hidden text-[10px] leading-tight px-2 py-1 mt-1 rounded bg-[var(--theme-bg-surface)]/60 text-[var(--theme-text-muted)] truncate">
            {latestEntry.text}
          </div>
        )}
      </div>
    </div>
  );
};
