import React from 'react';
import { Card, CardShape } from '../game/types';

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'table' | 'hand';
  className?: string;
  style?: React.CSSProperties;
}

export const ShapeIcon: React.FC<{ shape: CardShape; className?: string }> = ({ shape, className = 'w-6 h-6' }) => {
  switch (shape) {
    case 'CIRCLE':
      return (
        <svg viewBox="0 0 100 100" className={`${className} fill-current`} aria-label="Circle">
          <circle cx="50" cy="50" r="42" />
        </svg>
      );
    case 'TRIANGLE':
      return (
        <svg viewBox="0 0 100 100" className={`${className} fill-current`} aria-label="Triangle">
          <polygon points="50,10 90,85 10,85" />
        </svg>
      );
    case 'CROSS':
      return (
        <svg viewBox="0 0 100 100" className={`${className} fill-current`} aria-label="Cross">
          <path d="M35,10 H65 V35 H90 V65 H65 V90 H35 V65 H10 V35 H35 Z" />
        </svg>
      );
    case 'SQUARE':
      return (
        <svg viewBox="0 0 100 100" className={`${className} fill-current`} aria-label="Square">
          <rect x="15" y="22" width="70" height="56" rx="4" />
        </svg>
      );
    case 'STAR':
      return (
        <svg viewBox="0 0 100 100" className={`${className} fill-current`} aria-label="Star">
          <polygon points="50,5 64,36 98,38 72,60 80,95 50,75 20,95 28,60 2,38 36,36" />
        </svg>
      );
    case 'WHOT':
      return (
        <div className="flex flex-col items-center justify-center font-display font-black text-center select-none leading-none">
          <span className="text-xl md:text-2xl tracking-tighter">Whot</span>
        </div>
      );
  }
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  isPlayable = false,
  isSelected = false,
  onClick,
  size = 'md',
  className = '',
  style,
}) => {
  // Dimension tokens based on standard card ratio 5:7
  const sizeClasses = {
    sm: 'w-14 h-20 text-xs rounded-md shadow-sm',
    md: 'w-20 h-28 md:w-24 md:h-34 text-sm rounded-lg shadow-md',
    lg: 'w-24 h-34 md:w-28 md:h-40 text-base rounded-lg shadow-lg',
    xl: 'w-32 h-44 md:w-36 md:h-52 text-lg rounded-xl shadow-xl',
    table: 'w-[72px] h-[102px] sm:w-24 sm:h-34 md:w-28 md:h-40 text-xs sm:text-sm md:text-base rounded-lg shadow-md shrink-0',
    hand: 'w-[72px] h-[102px] sm:w-22 sm:h-32 md:w-24 md:h-34 text-xs sm:text-sm rounded-lg shadow-md shrink-0',
  }[size];

  // If face down, render authentic textured Nigerian Whot card back themed to active palette
  if (faceDown || !card) {
    return (
      <div
        onClick={onClick}
        style={style}
        className={`relative ${sizeClasses} ${className} bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/40 overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-200 select-none touch-manipulation`}
      >
        {/* Geometric Ankara patterned back */}
        <div className="absolute inset-1 border border-[var(--theme-gold)]/20 rounded flex items-center justify-center p-1 bg-[var(--theme-bg-main)]">
          <div className="w-full h-full border border-dashed border-[var(--theme-gold)]/30 rounded flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-full border border-[var(--theme-gold)]/60 flex items-center justify-center bg-[var(--theme-bg-elevated)]/40 mb-0.5">
              <span className="font-display font-extrabold text-[var(--theme-gold)] text-[10px] tracking-widest">W</span>
            </div>
            <span className="font-display font-bold text-[9px] uppercase tracking-widest text-[var(--theme-gold)]">WHOT</span>
          </div>
        </div>
      </div>
    );
  }

  const isWhot = card.shape === 'WHOT' || card.number === 20;

  return (
    <div
      onClick={isPlayable && onClick ? onClick : undefined}
      style={style}
      className={`relative ${sizeClasses} ${className} bg-[#FDFBF7] text-[#B91C1C] border border-[#B91C1C]/30 select-none flex flex-col justify-between p-1.5 md:p-2 transition-all duration-200 touch-manipulation ${
        isPlayable
          ? 'cursor-pointer hover:-translate-y-2.5 hover:shadow-xl hover:ring-2 hover:ring-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/50'
          : 'cursor-default opacity-90'
      } ${isSelected ? '-translate-y-3.5 ring-2 ring-[var(--theme-gold)] shadow-2xl scale-105' : ''}`}
    >
      {/* Top Left Corner */}
      <div className="flex flex-col items-center leading-none self-start">
        <span className="font-display font-black text-sm md:text-base tracking-tighter">
          {card.number}
        </span>
        {isWhot ? (
          <span className="text-[9px] font-bold tracking-tight">W</span>
        ) : (
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 mt-0.5">
            <ShapeIcon shape={card.shape} className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Center Large Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-3">
        {isWhot ? (
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif font-black text-xl md:text-2xl lg:text-3xl tracking-tight text-[#B91C1C]">
              Whot
            </span>
            <span className="font-serif font-black text-xl md:text-2xl lg:text-3xl tracking-tight text-[#B91C1C] rotate-180 -mt-1 md:-mt-2">
              Whot
            </span>
          </div>
        ) : (
          <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
            <ShapeIcon shape={card.shape} className="w-full h-full drop-shadow-sm" />
          </div>
        )}
      </div>

      {/* Bottom Right Corner (Inverted) */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-display font-black text-sm md:text-base tracking-tighter">
          {card.number}
        </span>
        {isWhot ? (
          <span className="text-[9px] font-bold tracking-tight">W</span>
        ) : (
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 mt-0.5">
            <ShapeIcon shape={card.shape} className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Special Card Sub-Badge */}
      {card.isSpecial && (
        <div className="absolute bottom-1 left-1.5 md:left-2">
          {card.number === 1 && <span className="text-[8px] font-bold bg-[#B91C1C]/10 px-1 rounded text-[#B91C1C]">Hold On</span>}
          {card.number === 2 && <span className="text-[8px] font-bold bg-[#B91C1C]/10 px-1 rounded text-[#B91C1C]">Pick 2</span>}
          {card.number === 5 && <span className="text-[8px] font-bold bg-[#B91C1C]/10 px-1 rounded text-[#B91C1C]">Pick 3</span>}
          {card.number === 8 && <span className="text-[8px] font-bold bg-[#B91C1C]/10 px-1 rounded text-[#B91C1C]">{card.shape === 'STAR' ? 'Star 8' : 'Susp.'}</span>}
          {card.number === 14 && <span className="text-[8px] font-bold bg-[#B91C1C]/10 px-1 rounded text-[#B91C1C]">Market</span>}
        </div>
      )}
    </div>
  );
};
