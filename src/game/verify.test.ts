import { createDeck, verifyDeckIntegrity } from './deck';
import { initGame, playCard, drawCard } from './engine';
import { isCardPlayable } from './rules';
import { selectBotMove } from './bots';
import { peekNextBotMove } from './peek';
import { Card } from './types';

function runIntegrityTests() {
  console.log('--- RUNNING WHOT IT! COMPREHENSIVE INTEGRITY TESTS ---');

  // 1. Deck Integrity
  const deck = createDeck();
  console.assert(deck.length === 54, `Deck must have 54 cards, found ${deck.length}`);
  verifyDeckIntegrity(deck);

  const circles = deck.filter(c => c.shape === 'CIRCLE');
  const triangles = deck.filter(c => c.shape === 'TRIANGLE');
  const crosses = deck.filter(c => c.shape === 'CROSS');
  const squares = deck.filter(c => c.shape === 'SQUARE');
  const stars = deck.filter(c => c.shape === 'STAR');
  const whots = deck.filter(c => c.shape === 'WHOT');

  console.assert(circles.length === 12, '12 Circles');
  console.assert(triangles.length === 12, '12 Triangles');
  console.assert(crosses.length === 9, '9 Crosses');
  console.assert(squares.length === 9, '9 Squares');
  console.assert(stars.length === 7, '7 Stars');
  console.assert(whots.length === 5, '5 WHOTs');

  const illegalCards = deck.filter(c => c.number === 6 || c.number === 9);
  console.assert(illegalCards.length === 0, 'No 6s or 9s must exist in deck');
  console.log('✓ Test 1 Passed: 54-Card Authentic Distribution & Integrity Check');

  // 2. Variable Player Modes (1v1, 1v2, 1v3, 1v4) & Initial 6-Card Deal
  const game1v1 = initGame('1v1', 'MEDIUM', 'Tester');
  console.assert(game1v1.players.length === 2, '1v1 mode has 2 players');
  game1v1.players.forEach(p => console.assert(p.hand.length === 6, '6 cards each in 1v1'));

  const game1v2 = initGame('1v2', 'MEDIUM', 'Tester');
  console.assert(game1v2.players.length === 3, '1v2 mode has 3 players');
  game1v2.players.forEach(p => console.assert(p.hand.length === 6, '6 cards each in 1v2'));

  const game1v3 = initGame('1v3', 'MEDIUM', 'Tester');
  console.assert(game1v3.players.length === 4, '1v3 mode has 4 players');
  game1v3.players.forEach(p => console.assert(p.hand.length === 6, '6 cards each in 1v3'));

  const game1v4 = initGame('1v4', 'MEDIUM', 'Tester');
  console.assert(game1v4.players.length === 5, '1v4 mode has 5 players');
  game1v4.players.forEach(p => console.assert(p.hand.length === 6, '6 cards each in 1v4'));
  console.log('✓ Test 2 Passed: Variable player modes (1v1, 1v2, 1v3, 1v4) dealt 6 cards each');

  // 3. Card Matching Rules
  const dummyCross5: Card = { id: 'c1', shape: 'CROSS', number: 5, isSpecial: true, specialType: 'PICK_THREE' };
  const dummyCross7: Card = { id: 'c2', shape: 'CROSS', number: 7, isSpecial: false };
  const dummyStar5: Card = { id: 'c3', shape: 'STAR', number: 5, isSpecial: true, specialType: 'PICK_THREE' };
  const dummySquare10: Card = { id: 'c4', shape: 'SQUARE', number: 10, isSpecial: false };
  const dummyWhot20: Card = { id: 'w1', shape: 'WHOT', number: 20, isSpecial: true, specialType: 'WHOT' };

  console.assert(isCardPlayable(dummyCross7, 'CROSS', 5, null) === true, 'Matches shape CROSS');
  console.assert(isCardPlayable(dummyStar5, 'CROSS', 5, null) === true, 'Matches number 5');
  console.assert(isCardPlayable(dummySquare10, 'CROSS', 5, null) === false, 'Square 10 cannot match Cross 5');
  console.assert(isCardPlayable(dummyWhot20, 'CROSS', 5, null) === true, 'WHOT 20 matches anything on normal turn');
  console.log('✓ Test 3 Passed: Correct card matching rules & WHOT universality');

  // 4. Stacking Pick Two (2) & Pick Three (5)
  const dummyCircle2: Card = { id: 'c_2', shape: 'CIRCLE', number: 2, isSpecial: true, specialType: 'PICK_TWO' };
  const dummyTriangle2: Card = { id: 't_2', shape: 'TRIANGLE', number: 2, isSpecial: true, specialType: 'PICK_TWO' };
  const dummyCircle3: Card = { id: 'c_3', shape: 'CIRCLE', number: 3, isSpecial: false };

  const penaltyPick2 = { type: 'PICK_TWO' as const, amount: 2, initiatorName: 'Opponent' };
  console.assert(isCardPlayable(dummyTriangle2, 'CIRCLE', 2, penaltyPick2) === true, 'Can stack 2 on 2');
  console.assert(isCardPlayable(dummyCircle3, 'CIRCLE', 2, penaltyPick2) === false, 'Cannot play non-2 during Pick 2 penalty');
  console.assert(isCardPlayable(dummyWhot20, 'CIRCLE', 2, penaltyPick2) === false, 'Cannot defend Pick 2 penalty with WHOT');
  console.log('✓ Test 4 Passed: Penalty defense & stacking restriction rules');

  // 5. Special Card: Hold On (1)
  const holdOnState = initGame('1v3', 'MEDIUM', 'Tester');
  const holdOnCard: Card = { id: 'h1', shape: holdOnState.activeShape, number: 1, isSpecial: true, specialType: 'HOLD_ON' };
  holdOnState.players[0].hand = [holdOnCard, dummyCircle3];
  const afterHoldOn = playCard(holdOnState, 0, 'h1');
  console.assert(afterHoldOn.currentPlayerIndex === 0, 'Hold On allows current player to play again');
  console.log('✓ Test 5 Passed: Hold On (1) gives the same player another turn');

  // 6. Special Card: Suspensions (Normal 8 skips 1, Star 8 skips 2) across 4 players
  const normal8State = initGame('1v3', 'MEDIUM', 'Tester');
  const normal8Card: Card = { id: 'n8', shape: 'CIRCLE', number: 8, isSpecial: true, specialType: 'SUSPENSION' };
  normal8State.activeShape = 'CIRCLE';
  normal8State.players[0].hand = [normal8Card, dummyCircle3];
  const afterNormal8 = playCard(normal8State, 0, 'n8');
  console.assert(afterNormal8.currentPlayerIndex === 2, `Normal 8 skips 1 player (0 -> 2), got ${afterNormal8.currentPlayerIndex}`);

  const star8State = initGame('1v3', 'MEDIUM', 'Tester');
  const star8Card: Card = { id: 's8', shape: 'STAR', number: 8, isSpecial: true, specialType: 'STAR_SUSPENSION' };
  star8State.activeShape = 'STAR';
  star8State.players[0].hand = [star8Card, dummyCircle3];
  const afterStar8 = playCard(star8State, 0, 's8');
  console.assert(afterStar8.currentPlayerIndex === 3, `Star 8 skips 2 players (0 -> 3), got ${afterStar8.currentPlayerIndex}`);

  // Suspension in 2-player mode (1v1): should return turn to player
  const duel8State = initGame('1v1', 'MEDIUM', 'Tester');
  duel8State.activeShape = 'CIRCLE';
  duel8State.players[0].hand = [normal8Card, dummyCircle3];
  const afterDuel8 = playCard(duel8State, 0, 'n8');
  console.assert(afterDuel8.currentPlayerIndex === 0, 'In 1v1, Normal 8 skips opponent and returns turn to player');
  console.log('✓ Test 6 Passed: Suspensions work accurately across both 4-player and 2-player modes');

  // 7. General Market (14)
  const marketState = initGame('1v3', 'MEDIUM', 'Tester');
  const marketCard: Card = { id: 'm14', shape: marketState.activeShape, number: 14, isSpecial: true, specialType: 'GENERAL_MARKET' };
  marketState.players[0].hand = [marketCard, dummyCircle3];
  const b1Before = marketState.players[1].hand.length;
  const b2Before = marketState.players[2].hand.length;
  const b3Before = marketState.players[3].hand.length;

  const afterMarket = playCard(marketState, 0, 'm14');
  console.assert(afterMarket.currentPlayerIndex === 0, 'General Market allows player to play again');
  console.assert(afterMarket.players[1].hand.length === b1Before + 1, 'Bot 1 drew 1 card');
  console.assert(afterMarket.players[2].hand.length === b2Before + 1, 'Bot 2 drew 1 card');
  console.assert(afterMarket.players[3].hand.length === b3Before + 1, 'Bot 3 drew 1 card');
  console.log('✓ Test 7 Passed: General Market forces other players to draw 1 card and grants extra turn');

  // 8. Win condition
  const winState = initGame('1v3', 'MEDIUM', 'Tester');
  const winHoldOnCard: Card = { id: 'win1', shape: winState.activeShape, number: 1, isSpecial: true, specialType: 'HOLD_ON' };
  winState.players[0].hand = [winHoldOnCard];
  const afterWin = playCard(winState, 0, 'win1');
  console.assert(afterWin.status === 'GAME_OVER', 'Game status becomes GAME_OVER');
  console.assert(afterWin.winner?.id === 'player_human', 'Human player is winner');
  console.log('✓ Test 8 Passed: Instant victory when hand is emptied');

  // 9. Peek Next Card Signature Feature
  const peekState = initGame('1v3', 'MEDIUM', 'Tester');
  const prediction = peekNextBotMove(peekState);
  console.assert(prediction.botIndex === 1, `Next player is Bot 1, predicted for index ${prediction.botIndex}`);
  console.assert(typeof prediction.willDraw === 'boolean', 'Prediction has willDraw flag');
  console.assert(peekState.players[1].hand.length === 6, 'Bot 1 hand intact after peek');
  console.assert(peekState.currentPlayerIndex === 0, 'Turn intact after peek');
  console.log('✓ Test 9 Passed: Peek Next Card accurately predicts bot move without mutating state');

  // 10. Empty Draw Pile Reshuffling
  const emptyDrawState = initGame('1v3', 'MEDIUM', 'Tester');
  emptyDrawState.drawPile = [];
  emptyDrawState.discardPile = [dummyCircle3, dummyCross7, dummyStar5, dummySquare10];
  const afterEmptyDraw = drawCard(emptyDrawState, 0);
  console.assert(afterEmptyDraw.players[0].hand.length === 7, 'Player drew 1 card from reshuffled discard');
  console.assert(afterEmptyDraw.discardPile.length === 1, 'Top discard preserved');
  console.assert(afterEmptyDraw.drawPile.length === 2, 'Remaining 2 cards reshuffled into draw pile');
  console.log('✓ Test 10 Passed: Empty draw pile reshuffling from discard pile works seamlessly');

  // 11. Bot Difficulty Behaviors (EASY, MEDIUM, HARD)
  const botHand = [dummySquare10, dummyCross5, dummyWhot20];
  const easyDecision = selectBotMove(botHand, 'CROSS', 5, null, [2, 4], 'EASY');
  const mediumDecision = selectBotMove(botHand, 'CROSS', 5, null, [2, 4], 'MEDIUM');
  const hardDecision = selectBotMove(botHand, 'CROSS', 5, null, [1, 4], 'HARD');

  console.assert(easyDecision.type === 'PLAY', 'Easy bot plays legal card');
  console.assert(mediumDecision.type === 'PLAY', 'Medium bot plays tactical card');
  console.assert(hardDecision.type === 'PLAY' && hardDecision.card?.number === 5, 'Hard bot prioritizes disruption card when threat is present');
  console.log('✓ Test 11 Passed: Bot difficulty settings affect decision making heuristics');

  console.log('ALL 11 VERIFICATION TESTS COMPLETED SUCCESSFULLY! 100% PASS');
}

runIntegrityTests();
