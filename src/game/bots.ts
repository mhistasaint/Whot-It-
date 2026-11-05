import { Card, CardShape, PendingPenalty, Player, BotDecision, PlayerAvatar } from './types';
import { getPlayableCards } from './rules';

// Profile specifications for Nigerian computer opponents
export const BOT_CONFIGS: Array<{
  name: string;
  personality: string;
  titles: string;
  avatar: PlayerAvatar;
}> = [
  {
    name: 'Chidi',
    titles: 'Tactical Playmaker',
    personality: 'Keeps track of remaining shapes and loves unleashing Hold On combos.',
    avatar: {
      skinTone: '#6B4226',
      hairStyle: 'lowcut',
      clothPattern: 'ankara_gold',
      bgGradient: 'from-amber-800 to-amber-950',
      gender: 'male',
    },
  },
  {
    name: 'Amina',
    titles: 'The Strategist',
    personality: 'Patient and analytical. Specializes in counter-attacks and Star 8 suspensions.',
    avatar: {
      skinTone: '#4A2A18',
      hairStyle: 'gele',
      clothPattern: 'ankara_ruby',
      bgGradient: 'from-rose-800 to-rose-950',
      gender: 'female',
    },
  },
  {
    name: 'Femi',
    titles: 'The Aggressor',
    personality: 'Bold and confident. Enjoys stacking Pick Two and calling General Market.',
    avatar: {
      skinTone: '#8C5638',
      hairStyle: 'braids',
      clothPattern: 'dashiki_indigo',
      bgGradient: 'from-blue-800 to-blue-950',
      gender: 'male',
    },
  },
];

/**
 * Determine the best shape to call when playing WHOT 20.
 * In Nigerian Whot, choose the shape that appears most frequently in the remaining hand.
 */
export function getBestWhotShape(remainingHand: Card[]): CardShape {
  const shapeCounts: Record<Exclude<CardShape, 'WHOT'>, number> = {
    CIRCLE: 0,
    TRIANGLE: 0,
    CROSS: 0,
    SQUARE: 0,
    STAR: 0,
  };

  for (const card of remainingHand) {
    if (card.shape !== 'WHOT') {
      shapeCounts[card.shape]++;
    }
  }

  let bestShape: Exclude<CardShape, 'WHOT'> = 'CIRCLE';
  let maxCount = -1;

  for (const [shape, count] of Object.entries(shapeCounts) as [Exclude<CardShape, 'WHOT'>, number][]) {
    if (count > maxCount) {
      maxCount = count;
      bestShape = shape;
    }
  }

  // If hand has no other cards or all equal 0, default to Circle
  return bestShape;
}

/**
 * PURE DECISION FUNCTION for bot gameplay.
 * MUST be identical for live bot play and for Peek Next Card predictions.
 */
export function selectBotMove(
  hand: Card[],
  activeShape: CardShape,
  activeNumber: number,
  pendingPenalty: PendingPenalty | null,
  otherPlayersHandSizes: number[] = []
): BotDecision {
  const playableCards = getPlayableCards(hand, activeShape, activeNumber, pendingPenalty);

  // If no playable card, bot must draw
  if (playableCards.length === 0) {
    return {
      type: 'DRAW',
      reason: pendingPenalty
        ? `Cannot respond to ${pendingPenalty.type === 'PICK_TWO' ? 'Pick 2' : 'Pick 3'} penalty, must draw ${pendingPenalty.amount} cards.`
        : 'Has no matching shape or number, going to market (drawing 1 card).',
    };
  }

  // If responding to penalty (Pick 2 or Pick 3)
  if (pendingPenalty) {
    // Play any matching penalty card to pass the penalty onward
    const penaltyCard = playableCards[0];
    return {
      type: 'PLAY',
      card: penaltyCard,
      reason: `Defends against ${pendingPenalty.type} by stacking ${penaltyCard.shape} ${penaltyCard.number}!`,
    };
  }

  // Check if any opponent is close to winning (1 or 2 cards left)
  const isThreatPresent = otherPlayersHandSizes.some(count => count > 0 && count <= 2);

  // Score each playable card to choose the best tactical play
  let bestCard: Card = playableCards[0];
  let highestScore = -Infinity;

  for (const card of playableCards) {
    let score = 0;

    // 1. Finishing move: if this card empties the hand, maximum priority!
    if (hand.length === 1) {
      score += 1000;
    }

    // 2. Special cards under threat: use aggressive cards to stall the opponent
    if (isThreatPresent) {
      if (card.number === 2 || card.number === 5) score += 80;
      if (card.number === 8) score += 75; // Suspension
      if (card.number === 14) score += 70; // General Market
      if (card.number === 1) score += 65; // Hold on to continue
    } else {
      // Normal game flow: prefer saving wild WHOT 20 cards for emergencies
      if (card.number === 20) {
        score -= 20;
      }
      // Hold on is great for keeping momentum
      if (card.number === 1) {
        score += 30;
      }
      // Pick 2 & Pick 3 are strong pressure
      if (card.number === 2 || card.number === 5) {
        score += 25;
      }
      // General Market gives an extra turn + cards to opponents
      if (card.number === 14) {
        score += 35;
      }
      // Suspension is a nice tempo play
      if (card.number === 8) {
        score += 20;
      }
    }

    // Prefer playing shapes that the bot has more of in hand
    const sameShapeCount = hand.filter(c => c.shape === card.shape && c.id !== card.id).length;
    score += sameShapeCount * 5;

    // Higher numbers carry more value in some card scoring variants, slightly prefer shedding large numbers
    score += (card.number / 2);

    if (score > highestScore) {
      highestScore = score;
      bestCard = card;
    }
  }

  // If playing WHOT 20, choose the best shape for the remaining hand
  let chosenWhotShape: CardShape | undefined = undefined;
  if (bestCard.number === 20) {
    const remainingHand = hand.filter(c => c.id !== bestCard.id);
    chosenWhotShape = getBestWhotShape(remainingHand);
  }

  return {
    type: 'PLAY',
    card: bestCard,
    chosenWhotShape,
    reason: bestCard.number === 20
      ? `Plays WHOT 20 and calls ${chosenWhotShape}!`
      : `Plays ${bestCard.shape} ${bestCard.number}.`,
  };
}
