export type CardShape = 'CIRCLE' | 'TRIANGLE' | 'CROSS' | 'SQUARE' | 'STAR' | 'WHOT';

export type SpecialCardType =
  | 'HOLD_ON'
  | 'PICK_TWO'
  | 'PICK_THREE'
  | 'SUSPENSION'
  | 'STAR_SUSPENSION'
  | 'GENERAL_MARKET'
  | 'WHOT';

export interface Card {
  id: string;
  shape: CardShape;
  number: number;
  isSpecial: boolean;
  specialType?: SpecialCardType;
}

export interface PlayerAvatar {
  skinTone: string;
  hairStyle: 'afro' | 'braids' | 'lowcut' | 'gele' | 'fila' | 'dreads';
  clothPattern: 'ankara_gold' | 'ankara_emerald' | 'ankara_ruby' | 'dashiki_indigo' | 'white_agbada';
  bgGradient: string;
  gender: 'male' | 'female';
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  hand: Card[];
  avatar: PlayerAvatar;
  personality: string;
  titles?: string;
  outstandingDraws?: number;
}

export interface PendingPenalty {
  type: 'PICK_TWO' | 'PICK_THREE';
  amount: number;
  initiatorName: string;
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  text: string;
  type: 'play' | 'draw' | 'special' | 'penalty' | 'win' | 'whot';
}

export type GameStatus =
  | 'LOBBY'
  | 'PLAYING'
  | 'WAITING_WHOT_SHAPE'
  | 'GAME_OVER';

export type GameMode = '1v1' | '1v2' | '1v3' | '1v4';
export type BotDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type VisualTheme = 'forest' | 'midnight' | 'purple' | 'cream' | 'sunset' | 'ocean';

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  difficulty: BotDifficulty;
  players: Player[];
  currentPlayerIndex: number;
  drawPile: Card[];
  discardPile: Card[];
  activeShape: CardShape;
  activeNumber: number;
  pendingPenalty: PendingPenalty | null;
  turnCount: number;
  winner: Player | null;
  lastPlayedCard: Card | null;
  pendingWhotPlayerIndex: number | null;
  log: GameLogEntry[];
}

export interface BotDecision {
  type: 'PLAY' | 'DRAW';
  card?: Card;
  chosenWhotShape?: CardShape;
  reason?: string;
}

export interface PeekResult {
  botIndex: number;
  botName: string;
  willDraw: boolean;
  card?: Card;
  chosenWhotShape?: CardShape;
  reason: string;
}

export type PlayerRankTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Naija Champion';

export interface UserProfile {
  id: string;
  friendCode: string;
  username: string;
  title: string;
  bio: string;
  avatar: PlayerAvatar;
  favoriteShape: CardShape;
  region: string;
  joinDate: string;
  level: number;
  xp: number;
  rankTier: PlayerRankTier;
  hasCustomProfile: boolean;
}

