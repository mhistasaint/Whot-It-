import React from 'react';
import { CardShape } from '../game/types';
import { ShapeIcon } from './CardView';

interface WhotShapeModalProps {
  isOpen: boolean;
  onSelectShape: (shape: CardShape) => void;
}

const AVAILABLE_SHAPES: Array<{ shape: CardShape; label: string; description: string }> = [
  { shape: 'CIRCLE', label: 'Circle (Ball)', description: 'Classic circle shape' },
  { shape: 'TRIANGLE', label: 'Triangle (Angle)', description: 'Sharp 3-sided shape' },
  { shape: 'CROSS', label: 'Cross', description: 'Bold plus cross' },
  { shape: 'SQUARE', label: 'Square (Carpet)', description: 'Carpet rectangle shape' },
  { shape: 'STAR', label: 'Star', description: '5-pointed star' },
];

export const WhotShapeModal: React.FC<WhotShapeModalProps> = ({ isOpen, onSelectShape }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-6 text-center text-[var(--theme-text-primary)]">
        {/* Crown & Title */}
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)] flex items-center justify-center mb-3 text-[var(--theme-accent)] font-serif font-black text-2xl">
          W
        </div>
        <h2 className="font-display font-extrabold text-2xl text-[var(--theme-text-primary)] tracking-tight">
          WHOT 20 Wild Card!
        </h2>
        <p className="text-xs text-[var(--theme-text-muted)] mt-1 mb-6">
          You hold the crown! Choose the shape that the next player must follow:
        </p>

        {/* 5 Shapes grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVAILABLE_SHAPES.map(({ shape, label }) => (
            <button
              key={shape}
              onClick={() => onSelectShape(shape)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] hover:bg-[var(--theme-bg-elevated)] transition-all active:scale-95 group text-center cursor-pointer shadow-md"
            >
              <div className="w-10 h-10 mb-2 text-[#B91C1C] bg-[#FDFBF7] p-1.5 rounded-lg border border-[#B91C1C]/20 shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
                <ShapeIcon shape={shape} className="w-full h-full" />
              </div>
              <span className="font-display font-bold text-xs text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
