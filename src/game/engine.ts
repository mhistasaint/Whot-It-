import {
  Card,
  CardShape,
  GameState,
  Player,
  PlayerAvatar,
  GameLogEntry,
} from './types';
import { createDeck, shuffleDeck } from './deck';
import { isCardPlayable, getNextPlayerIndex } from './rules';
import { BOT_CONFIGS } from './bots';

export const HUMAN_AVATAR: PlayerAvatar = {
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
    // Only top discard exists, no cards can be reshuffled
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
      // No more cards available anywhere
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
 * Initializes a new match of WHOT It!
 */
export function initGame(playerName = 'You'): GameState {
  const deck = shuffleDeck(createDeck());

  const players: Player[] = [
    {
      id: 'player_human',
      name: playerName,
      isHuman: true,
      hand: [],
      avatar: HUMAN_AVATAR,
      personality: 'Bold tactician & challenger.',
      titles: 'The Contender',
    },
    ...BOT_CONFIGS.map((bot, index) => ({
      id: `player_bot_${index + 1}`,
      name: bot.name,
      isHuman: false,
      hand: [] as Card[],
      avatar: bot.avatar,
      personality: bot.personality,
      titles: bot.titles,
    })),
  ];

  // Deal 6 cards to each of the 4 players
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
    // Edge case safety
    initialDiscardIndex = remainingDeck.length - 1;
  }
  const [initialDiscardCard] = remainingDeck.splice(initialDiscardIndex, 1);

  const initialLog: GameLogEntry = {
    id: `log_${Date.now()}_start`,
    timestamp: Date.now(),
    text: `Match started! First card is ${initialDiscardCard.shape} ${initialDiscardCard.number}. ${players[0].name} starts.`,
    type: 'play',
  };

  return {
    status: 'PLAYING',
    players,
    currentPlayerIndex: 0, // Human starts
    drawPile: remainingDeck,
    discardPile: [initialDiscardCard],
    activeShape: initialDiscardCard.shape,
    activeNumber: initialDiscardCard.number,
    pendingPenalty: null,
    freePeeksRemaining: 1, // 1 free peek per match
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
  // "If a player empties their hand by playing a special card, end the match immediately.
  // Do not execute another effect or extra turn after the player has won."
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

  // Clear any existing penalty that was successfully answered/stacked
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
    // Normal turn plays without prior active penalty
    switch (card.number) {
      case 1: {
        // CARD 1 — HOLD ON: player immediately takes another turn
        logs.push({
          id: `log_${Date.now()}_holdon`,
          timestamp: Date.now(),
          text: `✋ ${player.name} played Hold On (1)! ${player.name} plays again.`,
          type: 'special',
        });
        nextPlayerIndex = state.currentPlayerIndex; // Continues their turn
        break;
      }
      case 2: {
        // CARD 2 — PICK TWO
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
        // CARD 5 — PICK THREE
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
        // CARD 8 — SUSPENSION:
        // STAR 8: next two players miss their turns (skips 2 players)
        // Normal 8: next player misses their turn (skips 1 player)
        if (card.shape === 'STAR') {
          logs.push({
            id: `log_${Date.now()}_star8`,
            timestamp: Date.now(),
            text: `⭐ ${player.name} played Star 8! The next TWO players are suspended!`,
            type: 'special',
          });
          nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 3, state.players.length);
        } else {
          logs.push({
            id: `log_${Date.now()}_suspension`,
            timestamp: Date.now(),
            text: `🚫 ${player.name} played Suspension (8)! Next player misses their turn.`,
            type: 'special',
          });
          nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 2, state.players.length);
        }
        break;
      }
      case 14: {
        // CARD 14 — GENERAL MARKET:
        // Every other active player draws one card. Player who played 14 takes another turn.
        logs.push({
          id: `log_${Date.now()}_market`,
          timestamp: Date.now(),
          text: `🛒 ${player.name} called General Market (14)! Everyone else goes to market (draws 1 card). ${player.name} plays again.`,
          type: 'special',
        });

        // Give 1 card to every other player
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
        nextPlayerIndex = state.currentPlayerIndex; // Takes another turn
        break;
      }
      case 20: {
        // CARD 20 — WHOT wild card
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
        // Normal card (3, 4, 7, 10, 11, 12, 13)
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

  // Find the WHOT card in player hand
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
 * If penalty is active, draws penalty amount and clears penalty.
 * If normal draw, draws 1 card and ends turn without playing drawn card.
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

  // End turn: "Do not allow the player to immediately play the card they just drew."
  const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);

  return {
    ...state,
    players: updatedPlayers,
    drawPile: newDrawPile,
    discardPile: newDiscardPile,
    pendingPenalty: null, // Penalty has been absorbed
    currentPlayerIndex: nextPlayerIndex,
    turnCount: state.turnCount + 1,
    log: logs,
  };
}
