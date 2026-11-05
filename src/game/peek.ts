import { GameState, PeekResult } from './types';
import { selectBotMove } from './bots';
import { getNextPlayerIndex } from './rules';

/**
 * Predicts the exact move the upcoming bot intends to play on their upcoming turn.
 * Pure read-only function:
 * - Does NOT mutate state.
 * - Does NOT alter hands, deck, or turn order.
 * - Uses the EXACT SAME decision engine as live gameplay.
 */
export function peekNextBotMove(state: GameState): PeekResult {
  const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, 1, state.players.length);
  const nextPlayer = state.players[nextPlayerIndex];

  if (nextPlayer.isHuman) {
    return {
      botIndex: nextPlayerIndex,
      botName: nextPlayer.name,
      willDraw: false,
      reason: 'Next turn is human player.',
    };
  }

  // Gather other players' hand sizes for context
  const handSizes = state.players.map((p, idx) => (idx === nextPlayerIndex ? 0 : p.hand.length));

  // Execute the exact bot decision-making function
  const decision = selectBotMove(
    nextPlayer.hand,
    state.activeShape,
    state.activeNumber,
    state.pendingPenalty,
    handSizes,
    state.difficulty
  );

  if (decision.type === 'DRAW') {
    return {
      botIndex: nextPlayerIndex,
      botName: nextPlayer.name,
      willDraw: true,
      reason: 'Opponent will draw a card.',
    };
  }

  return {
    botIndex: nextPlayerIndex,
    botName: nextPlayer.name,
    willDraw: false,
    card: decision.card,
    chosenWhotShape: decision.chosenWhotShape,
    reason: decision.chosenWhotShape
      ? `${nextPlayer.name} plans to play WHOT 20 and call ${decision.chosenWhotShape}.`
      : `${nextPlayer.name} plans to play ${decision.card?.shape} ${decision.card?.number}.`,
  };
}
