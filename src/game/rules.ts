import { Card, CardShape, PendingPenalty } from './types';

/**
 * Validates whether a card can be legally played in the current game context.
 */
export function isCardPlayable(
  card: Card,
  activeShape: CardShape,
  activeNumber: number,
  pendingPenalty: PendingPenalty | null
): boolean {
  // If there is an active penalty (Pick 2 or Pick 3), player MUST respond with the matching penalty card to stack
  if (pendingPenalty) {
    if (pendingPenalty.type === 'PICK_TWO') {
      return card.number === 2;
    }
    if (pendingPenalty.type === 'PICK_THREE') {
      return card.number === 5;
    }
    return false;
  }

  // WHOT 20 is a wild card and can be played on any normal turn
  if (card.shape === 'WHOT' || card.number === 20) {
    return true;
  }

  // Normal card matches either current active shape OR current active number
  return card.shape === activeShape || card.number === activeNumber;
}

/**
 * Returns all playable cards in a player's hand.
 */
export function getPlayableCards(
  hand: Card[],
  activeShape: CardShape,
  activeNumber: number,
  pendingPenalty: PendingPenalty | null
): Card[] {
  return hand.filter(card => isCardPlayable(card, activeShape, activeNumber, pendingPenalty));
}

/**
 * Calculates the next player index clockwise among four seats (0: Human, 1: Bot 1, 2: Bot 2, 3: Bot 3).
 */
export function getNextPlayerIndex(currentIndex: number, skipCount = 1, totalPlayers = 4): number {
  return (currentIndex + skipCount) % totalPlayers;
}
