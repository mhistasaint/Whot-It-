import { Card, CardShape, SpecialCardType } from './types';

// The canonical Nigerian Whot card numbers distribution
export const DECK_SPECIFICATION: Record<Exclude<CardShape, 'WHOT'>, number[]> = {
  CIRCLE: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14], // 12 cards
  TRIANGLE: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14], // 12 cards
  CROSS: [1, 2, 3, 5, 7, 10, 11, 13, 14], // 9 cards
  SQUARE: [1, 2, 3, 5, 7, 10, 11, 13, 14], // 9 cards
  STAR: [1, 2, 3, 4, 5, 7, 8], // 7 cards
};

export const WHOT_CARD_COUNT = 5; // 5 wild cards
export const TOTAL_CARDS_IN_DECK = 54;

/**
 * Determine the special property of a card based on Nigerian Whot rules
 */
export function getCardSpecialType(shape: CardShape, number: number): SpecialCardType | undefined {
  if (shape === 'WHOT' || number === 20) return 'WHOT';
  if (number === 1) return 'HOLD_ON';
  if (number === 2) return 'PICK_TWO';
  if (number === 5) return 'PICK_THREE';
  if (number === 8) {
    return shape === 'STAR' ? 'STAR_SUSPENSION' : 'SUSPENSION';
  }
  if (number === 14) return 'GENERAL_MARKET';
  return undefined;
}

/**
 * Generates the authentic 54-card Nigerian Whot deck.
 */
export function createDeck(): Card[] {
  const cards: Card[] = [];
  let cardIdCounter = 1;

  // Shapes with regular numbers
  for (const [shape, numbers] of Object.entries(DECK_SPECIFICATION) as [Exclude<CardShape, 'WHOT'>, number[]][]) {
    for (const num of numbers) {
      const specialType = getCardSpecialType(shape, num);
      cards.push({
        id: `card_${cardIdCounter++}_${shape}_${num}`,
        shape,
        number: num,
        isSpecial: Boolean(specialType),
        specialType,
      });
    }
  }

  // Exactly five WHOT 20 wild cards
  for (let i = 1; i <= WHOT_CARD_COUNT; i++) {
    cards.push({
      id: `card_${cardIdCounter++}_WHOT_20_${i}`,
      shape: 'WHOT',
      number: 20,
      isSpecial: true,
      specialType: 'WHOT',
    });
  }

  // Deck integrity verification
  verifyDeckIntegrity(cards);

  return cards;
}

/**
 * Verify that the deck adheres strictly to the exact 54-card Nigerian Whot specifications.
 */
export function verifyDeckIntegrity(deck: Card[]): boolean {
  if (deck.length !== TOTAL_CARDS_IN_DECK) {
    throw new Error(`Deck integrity failure: Expected 54 cards, but found ${deck.length}`);
  }

  const counts: Record<string, number> = {
    CIRCLE: 0,
    TRIANGLE: 0,
    CROSS: 0,
    SQUARE: 0,
    STAR: 0,
    WHOT: 0,
  };

  for (const card of deck) {
    // Prohibited numbers in Nigerian Whot
    if (card.number === 6 || card.number === 9) {
      throw new Error(`Deck integrity failure: Card with illegal number ${card.number} found!`);
    }

    counts[card.shape] = (counts[card.shape] || 0) + 1;
  }

  if (counts.CIRCLE !== 12) throw new Error(`Expected 12 Circles, got ${counts.CIRCLE}`);
  if (counts.TRIANGLE !== 12) throw new Error(`Expected 12 Triangles, got ${counts.TRIANGLE}`);
  if (counts.CROSS !== 9) throw new Error(`Expected 9 Crosses, got ${counts.CROSS}`);
  if (counts.SQUARE !== 9) throw new Error(`Expected 9 Squares, got ${counts.SQUARE}`);
  if (counts.STAR !== 7) throw new Error(`Expected 7 Stars, got ${counts.STAR}`);
  if (counts.WHOT !== 5) throw new Error(`Expected 5 WHOT 20s, got ${counts.WHOT}`);

  return true;
}

/**
 * Fisher-Yates array shuffle.
 */
export function shuffleDeck<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
