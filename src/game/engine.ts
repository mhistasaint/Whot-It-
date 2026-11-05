import {
  Card,
  CardShape,
  GameState,
  Player,
  PlayerAvatar,
  GameLogEntry,
  GameMode,
  BotDifficulty,
  GameStatus,
} from './types';
import { createDeck, shuffleDeck } from './deck';
import { isCardPlayable, getNextPlayerIndex } from './rules';
import { BOT_CONFIGS } from './bots';

export const HUMAN_DEFAULT_AVATAR: PlayerAvatar = {
  skinTone: '#7D4B2A',
  hairStyle: 'afro',
  clothPattern: 'ankara_emerald',
  bgGradient: 'from-emerald-800 to-emerald-950',
  gender: 'female',
};

/**
 * Helper to ensure draw pile has cards by reshuffling discard pile if needed.
 */
function ensureDrawPileCards(drawPile: Card[], discardPile: Card[]): { drawPile: Card[]; discardPile: Card[] } {
  if (drawPile.length > 0) {
    return { drawPile: [...drawPile], discardPile: [...discardPile] };
  }

  // Draw pile is empty: keep top discard, shuffle the rest to form new draw pile
  if (discardPile.length <= 1) {
    return { drawPile: [], discardPile: [...discardPile] };
  }

  const topDiscard = discardPile[discardPile.length - 1];
  const cardsToShuffle = discardPile.slice(0, discardPile.length - 1);
  const newDrawPile = shuffleDeck(cardsToShuffle);

  return {
    drawPile: newDrawPile,
    discardPile: [topDiscard],
  };
}

/**
 * Draws N cards safely from the draw pile, reshuffling discard pile if necessary.
 */
function drawNCards(
  count: number,
  drawPile: Card[],
  discardPile: Card[]
): { drawnCards: Card[]; newDrawPile: Card[]; newDiscardPile: Card[] } {
  const drawnCards: Card[] = [];
  let currentDraw = [...drawPile];
  let currentDiscard = [...discardPile];

  for (let i = 0; i < count; i++) {
    if (currentDraw.length === 0) {
      const reshuffled = ensureDrawPileCards(currentDraw, currentDiscard);
      currentDraw = reshuffled.drawPile;
      currentDiscard = reshuffled.discardPile;
    }

    if (currentDraw.length === 0) {
      break;
    }

    const card = currentDraw.pop()!;
    drawnCards.push(card);
  }

  return {
    drawnCards,
    newDrawPile: currentDraw,
    newDiscardPile: currentDiscard,
  };
}

/**
 * Calculates suspension skip index across any player count (2 to 5 players).
 */
export function getSuspensionNextIndex(currentIndex: number, isStar: boolean, totalPlayers: number): number {
  if (totalPlayers === 2) {
    return currentIndex; // Skips the only opponent, turn returns to current player
  }
  if (totalPlayers === 3) {
    if (isStar) return currentIndex; // Star 8 skips both opponents, turn returns to current player
    return (currentIndex + 2) % totalPlayers;
  }
  const skipCount = isStar ? 3 : 2;
  return (currentIndex + skipCount) % totalPlayers;
}

/**
 * Initializes a match of WHOT It! supporting selectable GameModes (1v1, 1v2, 1v3, 1v4).
 */
export function initGame(
  mode: GameMode = '1v3',
  difficulty: BotDifficulty = 'MEDIUM',
  playerName = 'You',
  playerAvatar: PlayerAvatar = HUMAN_DEFAULT_AVATAR,
  initialStatus: GameStatus = 'PLAYING'
): GameState {
  const deck = shuffleDeck(createDeck());

  const botCountMap: Record<GameMode, number> = {
    '1v1': 1,
    '1v2': 2,
    '1v3': 3,
    '1v4': 4,
  };

  const botCount = botCountMap[mode] || 3;
  const activeBots = BOT_CONFIGS.slice(0, botCount);

  const players: Player[] = [
    {
      id: 'player_human',
      name: playerName || 'You',
      isHuman: true,
      hand: [],
      avatar: playerAvatar,
      personality: 'Bold tactician & challenger.',
      titles: 'The Contender',
    },
    ...activeBots.map((bot, index) => ({
      id: `player_bot_${index + 1}`,
      name: bot.name,
      isHuman: false,
      hand: [] as Card[],
      avatar: bot.avatar,
      personality: bot.personality,
      titles: bot.titles,
    })),
  ];

  // Deal 6 cards to each player
  let remainingDeck = [...deck];
  for (let round = 0; round < 6; round++) {
    for (const player of players) {
      const card = remainingDeck.pop()!;
      player.hand.push(card);
    }
  }

  // Find the first non-WHOT card to start the discard pile
  let initialDiscardIndex = remainingDeck.findIndex(c => c.shape !== 'WHOT');
  if (initialDiscardIndex === -1) {
    initialDiscardIndex = remainingDeck.length - 1;
  }
  const [initialDiscardCard] = remainingDeck.splice(initialDiscardIndex, 1);

  const initialLog: GameLogEntry = {
    id: `log_${Date.now()}_start`,
    timestamp: Date.now(),
    text: `Match started (${mode} mode · ${difficulty} difficulty). First card is ${initialDiscardCard.shape} ${initialDiscardCard.number}.`,
    type: 'play',
  };

  return {
    status: initialStatus,
    mode,
    difficulty,
    players,
    currentPlayerIndex: 0, // Human starts
    drawPile: remainingDeck,
    discardPile: [initialDiscardCard],
    activeShape: initialDiscardCard.shape,
    activeNumber: initialDiscardCard.number,
    pendingPenalty: null,
    turnCount: 1,
    winner: null,
    lastPlayedCard: initialDiscardCard,
    pendingWhotPlayerIndex: null,
    log: [initialLog],
  };
}

/**
 * Handles playing a card from a player's hand.
 */
export function playCard(
  state: GameState,
  playerIndex: number,
  cardId: string,
  chosenWhotShape?: CardShape
): GameState {
  if (state.status === 'GAME_OVER') return state;
  if (state.currentPlayerIndex !== playerIndex) return state;

  const player = state.players[playerIndex];
  const cardIndex = player.hand.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return state;

  const card = player.hand[cardIndex];

  // Validate legality
  if (!isCardPlayable(card, state.activeShape, state.activeNumber, state.pendingPenalty)) {
    return state;
  }

  // If human plays WHOT 20 without specifying the shape, pause for shape picker
  if (card.number === 20 && !chosenWhotShape && player.isHuman) {
    return {
      ...state,
      status: 'WAITING_WHOT_SHAPE',
      pendingWhotPlayerIndex: playerIndex,
    };
  }

  // Remove card from hand
  const newHand = [...player.hand];
  newHand.splice(cardIndex, 1);

  const updatedPlayers = state.players.map((p, idx) =>
    idx === playerIndex ? { ...p, hand: newHand } : p
  );

  const newDiscardPile = [...state.discardPile, card];
  const logs = [...state.log];

  // WIN CHECK: If hand is empty, player wins immediately!
  if (newHand.length === 0) {
    logs.push({
      id: `log_${Date.now()}_win`,
      timestamp: Date.now(),
      text: `🏆 ${player.name} emptied their hand and won the match!`,
      type: 'win',
    });

    return {
      ...state,
      status: 'GAME_OVER',
      players: updatedPlayers,
      discardPile: newDiscardPile,
      winner: player,
      lastPlayedCard: card,
      log: logs,
    };
  }

  // Process Card Effects
  let nextPlayerIndex = state.currentPlayerIndex;
  let nextActiveShape: CardShape = card.shape;
  let nextActiveNumber = card.number;
  let newPendingPenalty = state.pendingPenalty;
  let drawPile = [...state.drawPile];
  let discardPile = newDiscardPile;

  // Clear or stack existing penalty
  if (state.pendingPenalty) {
    if (state.pendingPenalty.type === 'PICK_TWO' && card.number === 2) {
      newPendingPenalty = {
        type: 'PICK_TWO',
        amount: state.pendingPenalty.amount + 2,
        initiatorName: player.name,
      };
      logs.push({
        id: `log_${Date.now()}_stack2`,
        timestamp: Date.now(),
        text: `⚡ ${player.name} stacked Pick Two! Penalty is now +${newPendingPenalty.amount} cards!`,
        type: 'penalty',
      });
      nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
    } else if (state.pendingPenalty.type === 'PICK_THREE' && card.number === 5) {
      newPendingPenalty = {
        type: 'PICK_THREE',
        amount: state.pendingPenalty.amount + 3,
        initiatorName: player.name,
      };
      logs.push({
        id: `log_${Date.now()}_stack5`,
        timestamp: Date.now(),
        text: `⚡ ${player.name} stacked Pick Three! Penalty is now +${newPendingPenalty.amount} cards!`,
        type: 'penalty',
      });
      nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
    }
  } else {
    // Normal turn plays
    switch (card.number) {
      case 1: {
        // HOLD ON: player immediately takes another turn
        logs.push({
          id: `log_${Date.now()}_holdon`,
          timestamp: Date.now(),
          text: `✋ ${player.name} played Hold On (1)! ${player.name} plays again.`,
          type: 'special',
        });
        nextPlayerIndex = state.currentPlayerIndex;
        break;
      }
      case 2: {
        // PICK TWO
        newPendingPenalty = {
          type: 'PICK_TWO',
          amount: 2,
          initiatorName: player.name,
        };
        logs.push({
          id: `log_${Date.now()}_pick2`,
          timestamp: Date.now(),
          text: `💥 ${player.name} played Pick Two! Next player must play 2 or draw 2 cards.`,
          type: 'penalty',
        });
        nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
        break;
      }
      case 5: {
        // PICK THREE
        newPendingPenalty = {
          type: 'PICK_THREE',
          amount: 3,
          initiatorName: player.name,
        };
        logs.push({
          id: `log_${Date.now()}_pick3`,
          timestamp: Date.now(),
          text: `💥 ${player.name} played Pick Three! Next player must play 5 or draw 3 cards.`,
          type: 'penalty',
        });
        nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
        break;
      }
      case 8: {
        // SUSPENSION
        const isStar = card.shape === 'STAR';
        if (isStar) {
          logs.push({
            id: `log_${Date.now()}_star8`,
            timestamp: Date.now(),
            text: `⭐ ${player.name} played Star 8! Suspends 2 opponents!`,
            type: 'special',
          });
        } else {
          logs.push({
            id: `log_${Date.now()}_suspension`,
            timestamp: Date.now(),
            text: `🚫 ${player.name} played Suspension (8)! Next player misses turn.`,
            type: 'special',
          });
        }
        nextPlayerIndex = getSuspensionNextIndex(state.currentPlayerIndex, isStar, state.players.length);
        break;
      }
      case 14: {
        // GENERAL MARKET: every other active player draws 1 card, current player continues turn
        logs.push({
          id: `log_${Date.now()}_market`,
          timestamp: Date.now(),
          text: `🛒 ${player.name} called General Market (14)! Everyone else goes to market. ${player.name} plays again.`,
          type: 'special',
        });

        for (let i = 0; i < updatedPlayers.length; i++) {
          if (i !== playerIndex) {
            const drawRes = drawNCards(1, drawPile, discardPile);
            drawPile = drawRes.newDrawPile;
            discardPile = drawRes.newDiscardPile;
            if (drawRes.drawnCards.length > 0) {
              updatedPlayers[i] = {
                ...updatedPlayers[i],
                hand: [...updatedPlayers[i].hand, ...drawRes.drawnCards],
              };
            }
          }
        }
        nextPlayerIndex = state.currentPlayerIndex;
        break;
      }
      case 20: {
        // WHOT Wild card
        const selectedShape = chosenWhotShape || 'CIRCLE';
        nextActiveShape = selectedShape;
        logs.push({
          id: `log_${Date.now()}_whot`,
          timestamp: Date.now(),
          text: `👑 ${player.name} played WHOT 20 and called for ${selectedShape}!`,
          type: 'whot',
        });
        nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
        break;
      }
      default: {
        // Normal card
        logs.push({
          id: `log_${Date.now()}_normal`,
          timestamp: Date.now(),
          text: `${player.name} played ${card.shape} ${card.number}.`,
          type: 'play',
        });
        nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
        break;
      }
    }
  }

  return {
    ...state,
    status: 'PLAYING',
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
    drawPile,
    discardPile,
    activeShape: nextActiveShape,
    activeNumber: nextActiveNumber,
    pendingPenalty: newPendingPenalty,
    turnCount: state.turnCount + 1,
    lastPlayedCard: card,
    pendingWhotPlayerIndex: null,
    log: logs,
  };
}

/**
 * Called when human player confirms shape after playing WHOT 20.
 */
export function resolveWhotShape(state: GameState, chosenShape: CardShape): GameState {
  if (state.pendingWhotPlayerIndex === null) return state;

  const playerIndex = state.pendingWhotPlayerIndex;
  const player = state.players[playerIndex];

  const whotCard = player.hand.find(c => c.number === 20);
  if (!whotCard) return { ...state, status: 'PLAYING', pendingWhotPlayerIndex: null };

  return playCard(
    { ...state, status: 'PLAYING', pendingWhotPlayerIndex: null },
    playerIndex,
    whotCard.id,
    chosenShape
  );
}

/**
 * Handles drawing card(s) on a player's turn.
 */
export function drawCard(state: GameState, playerIndex: number): GameState {
  if (state.status === 'GAME_OVER') return state;
  if (state.currentPlayerIndex !== playerIndex) return state;

  const player = state.players[playerIndex];
  const logs = [...state.log];

  let drawAmount = 1;
  let logText = `${player.name} went to market (drew 1 card).`;

  if (state.pendingPenalty) {
    drawAmount = state.pendingPenalty.amount;
    logText = `⚠️ ${player.name} could not defend and drew ${drawAmount} penalty cards!`;
  }

  const { drawnCards, newDrawPile, newDiscardPile } = drawNCards(
    drawAmount,
    state.drawPile,
    state.discardPile
  );

  const updatedPlayers = state.players.map((p, idx) =>
    idx === playerIndex ? { ...p, hand: [...p.hand, ...drawnCards] } : p
  );

  logs.push({
    id: `log_${Date.now()}_draw`,
    timestamp: Date.now(),
    text: logText,
    type: state.pendingPenalty ? 'penalty' : 'draw',
  });

  const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);

  return {
    ...state,
    players: updatedPlayers,
    drawPile: newDrawPile,
    discardPile: newDiscardPile,
    pendingPenalty: null,
    currentPlayerIndex: nextPlayerIndex,
    turnCount: state.turnCount + 1,
    log: logs,
  };
}
