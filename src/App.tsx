import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardShape, GameState } from './game/types';
import { initGame, playCard, drawCard, resolveWhotShape } from './game/engine';
import { selectBotMove } from './game/bots';
import { peekNextBotMove } from './game/peek';
import {
  getStoredGems,
  deductGems,
  getDailyRewardState,
  getMatchStats,
  updateMatchStats,
  getPlayerSettings,
  savePlayerSettings,
  DailyRewardState,
  MatchStats,
} from './services/storage';
import { soundService } from './services/sound';

// Components
import { Navbar } from './components/Navbar';
import { CenterTable } from './components/CenterTable';
import { OpponentSeat } from './components/OpponentSeat';
import { PlayerHand } from './components/PlayerHand';
import { WhotShapeModal } from './components/WhotShapeModal';
import { PeekModal } from './components/PeekModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { GemShopModal } from './components/GemShopModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { MatchResultModal } from './components/MatchResultModal';
import { GameLogView } from './components/GameLogView';

export default function App() {
  // Game & Persistence States
  const [gameState, setGameState] = useState<GameState>(() => initGame('You'));
  const [gems, setGems] = useState<number>(() => getStoredGems());
  const [rewardState, setRewardState] = useState<DailyRewardState>(() => getDailyRewardState());
  const [stats, setStats] = useState<MatchStats>(() => getMatchStats());
  const [settings, setSettings] = useState(() => getPlayerSettings());

  // Modal Dialog States
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isGemShopOpen, setIsGemShopOpen] = useState(false);
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  // Active status cues
  const [opponentActionText, setOpponentActionText] = useState<{ [playerId: string]: string | null }>({});
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sound sync
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const toggleSound = () => {
    const updated = !settings.soundEnabled;
    const newSettings = savePlayerSettings({ soundEnabled: updated });
    setSettings(newSettings);
    soundService.setEnabled(updated);
  };

  // Helper to start a fresh match
  const handleNewMatch = useCallback(() => {
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    const fresh = initGame('You');
    setGameState(fresh);
    setOpponentActionText({});
    soundService.playCardPlay();
  }, []);

  // Handle match conclusion statistics
  useEffect(() => {
    if (gameState.status === 'GAME_OVER' && gameState.winner) {
      const isHumanWinner = gameState.winner.isHuman;
      if (isHumanWinner) {
        soundService.playVictory();
      }
      updateMatchStats(prev => ({
        ...prev,
        matchesPlayed: prev.matchesPlayed + 1,
        wins: isHumanWinner ? prev.wins + 1 : prev.wins,
        losses: isHumanWinner ? prev.losses : prev.losses + 1,
      }));
      setStats(getMatchStats());
    }
  }, [gameState.status, gameState.winner]);

  // Automated Bot Turn Executor
  useEffect(() => {
    if (gameState.status !== 'PLAYING') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isHuman) return;

    // It is a bot's turn!
    const botIndex = gameState.currentPlayerIndex;
    const delay = settings.fastSpeed ? 400 : 800;

    botTimeoutRef.current = setTimeout(() => {
      // Gather other players' remaining hand count for strategy
      const handCounts = gameState.players.map((p, idx) => (idx === botIndex ? 0 : p.hand.length));

      // Use the canonical bot decision engine
      const decision = selectBotMove(
        currentPlayer.hand,
        gameState.activeShape,
        gameState.activeNumber,
        gameState.pendingPenalty,
        handCounts
      );

      if (decision.type === 'PLAY' && decision.card) {
        const playedCard = decision.card;

        // Set speech bubble reaction
        let bubble = `Played ${playedCard.shape} ${playedCard.number}`;
        if (playedCard.number === 1) bubble = 'Hold On! ✋';
        else if (playedCard.number === 2) bubble = 'Pick Two! 💥';
        else if (playedCard.number === 5) bubble = 'Pick Three! ⚡';
        else if (playedCard.number === 8) bubble = playedCard.shape === 'STAR' ? 'Star 8! ⭐' : 'Suspended! 🚫';
        else if (playedCard.number === 14) bubble = 'General Market! 🛒';
        else if (playedCard.number === 20) bubble = `WHOT! Call ${decision.chosenWhotShape} 👑`;

        setOpponentActionText(prev => ({ ...prev, [currentPlayer.id]: bubble }));
        setTimeout(() => {
          setOpponentActionText(prev => ({ ...prev, [currentPlayer.id]: null }));
        }, 2200);

        // Sound effect
        if (playedCard.isSpecial && playedCard.specialType) {
          soundService.playSpecialCard(playedCard.specialType);
        } else {
          soundService.playCardPlay();
        }

        setGameState(prev => playCard(prev, botIndex, playedCard.id, decision.chosenWhotShape));
      } else {
        // Bot draws from market
        setOpponentActionText(prev => ({
          ...prev,
          [currentPlayer.id]: gameState.pendingPenalty ? `Drew ${gameState.pendingPenalty.amount} cards ⚠️` : 'Went to Market 🛒',
        }));
        setTimeout(() => {
          setOpponentActionText(prev => ({ ...prev, [currentPlayer.id]: null }));
        }, 2200);

        soundService.playCardDraw();
        setGameState(prev => drawCard(prev, botIndex));
      }
    }, delay);

    return () => {
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
    };
  }, [
    gameState.status,
    gameState.currentPlayerIndex,
    gameState.activeShape,
    gameState.activeNumber,
    gameState.pendingPenalty,
    gameState.players,
    settings.fastSpeed,
  ]);

  // Human card play action
  const handleHumanPlayCard = (cardId: string) => {
    if (gameState.currentPlayerIndex !== 0) return;

    const humanPlayer = gameState.players[0];
    const card = humanPlayer.hand.find(c => c.id === cardId);
    if (!card) return;

    // Track statistics
    updateMatchStats(prev => ({
      ...prev,
      cardsPlayed: prev.cardsPlayed + 1,
      whotsPlayed: card.number === 20 ? prev.whotsPlayed + 1 : prev.whotsPlayed,
      holdOnsPlayed: card.number === 1 ? prev.holdOnsPlayed + 1 : prev.holdOnsPlayed,
      generalMarketsPlayed: card.number === 14 ? prev.generalMarketsPlayed + 1 : prev.generalMarketsPlayed,
      penaltiesStacked: gameState.pendingPenalty && (card.number === 2 || card.number === 5)
        ? prev.penaltiesStacked + 1
        : prev.penaltiesStacked,
    }));
    setStats(getMatchStats());

    if (card.number === 20) {
      // Pause for WHOT shape selection modal
      soundService.playSpecialCard('WHOT');
      setGameState(prev => playCard(prev, 0, cardId));
    } else {
      if (card.isSpecial && card.specialType) {
        soundService.playSpecialCard(card.specialType);
      } else {
        soundService.playCardPlay();
      }
      setGameState(prev => playCard(prev, 0, cardId));
    }
  };

  // Human resolves WHOT shape selection
  const handleSelectWhotShape = (shape: CardShape) => {
    soundService.playCardPlay();
    setGameState(prev => resolveWhotShape(prev, shape));
  };

  // Human draws from market
  const handleHumanDraw = () => {
    if (gameState.currentPlayerIndex !== 0) return;
    soundService.playCardDraw();
    setGameState(prev => drawCard(prev, 0));
  };

  // Signature Peek Next Card feature
  const isHumanTurn = gameState.currentPlayerIndex === 0;
  const isFreePeek = gameState.freePeeksRemaining > 0;

  const handleOpenPeek = () => {
    setIsPeekOpen(true);
  };

  const handleConfirmPaidPeek = (): boolean => {
    const cost = 100;
    const success = deductGems(cost);
    if (success) {
      setGems(getStoredGems());
      soundService.playPeek();
      updateMatchStats(prev => ({ ...prev, peeksUsed: prev.peeksUsed + 1 }));
      setStats(getMatchStats());
      return true;
    }
    return false;
  };

  // When free peek is used, decrement freePeeksRemaining on the game state
  const handleFreePeekUsed = () => {
    if (gameState.freePeeksRemaining > 0) {
      setGameState(prev => ({ ...prev, freePeeksRemaining: 0 }));
      soundService.playPeek();
      updateMatchStats(prev => ({ ...prev, peeksUsed: prev.peeksUsed + 1 }));
      setStats(getMatchStats());
    }
  };

  // Get peek prediction using the pure read-only engine function
  const peekPrediction = isPeekOpen ? peekNextBotMove(gameState) : null;

  // Active turn indicators
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players[0];
  const botLeft = gameState.players[1];
  const botTop = gameState.players[2];
  const botRight = gameState.players[3];

  let turnBanner = '';
  if (gameState.status === 'GAME_OVER') {
    turnBanner = `Match Complete! ${gameState.winner?.name} won.`;
  } else if (isHumanTurn) {
    turnBanner = gameState.pendingPenalty
      ? `Your turn! ⚠️ Respond with ${gameState.pendingPenalty.type === 'PICK_TWO' ? '2' : '5'} or Draw ${gameState.pendingPenalty.amount} penalty cards.`
      : 'Your Turn! Tap a matching card to play, or Go to Market.';
  } else {
    turnBanner = `${currentPlayer.name} is making their move...`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#08291F] text-[#F7F3E8] overflow-x-hidden">
      {/* Universal Top Bar */}
      <Navbar
        gems={gems}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenDailyReward={() => setIsDailyRewardOpen(true)}
        onOpenGemShop={() => setIsGemShopOpen(true)}
        onNewMatch={handleNewMatch}
        freePeeksRemaining={gameState.freePeeksRemaining}
        onTriggerPeek={handleOpenPeek}
        canPeek={gameState.status === 'PLAYING'}
      />

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto p-2 sm:p-4">
        {/* Felt Card Table Canvas */}
        <div className="felt-table relative w-full rounded-3xl border-4 border-[#123D2B] shadow-2xl p-3 sm:p-6 flex flex-col justify-between min-h-[580px] md:min-h-[640px]">
          
          {/* Top Opponent (Amina) */}
          <div className="w-full flex justify-center pt-1">
            <OpponentSeat
              player={botTop}
              isCurrentTurn={gameState.currentPlayerIndex === 2}
              position="top"
              lastActionText={opponentActionText[botTop.id]}
            />
          </div>

          {/* Middle Row: Left Opponent (Chidi) + Center Battle Arena + Right Opponent (Femi) */}
          <div className="flex items-center justify-between w-full my-auto px-1 sm:px-4 gap-2">
            {/* Left Opponent (Chidi) */}
            <div className="shrink-0">
              <OpponentSeat
                player={botLeft}
                isCurrentTurn={gameState.currentPlayerIndex === 1}
                position="left"
                lastActionText={opponentActionText[botLeft.id]}
              />
            </div>

            {/* Central Play Arena: Market Draw Pile & Discard Pile */}
            <div className="flex-1 flex justify-center">
              <CenterTable
                drawPileCount={gameState.drawPile.length}
                discardPile={gameState.discardPile}
                activeShape={gameState.activeShape}
                activeNumber={gameState.activeNumber}
                pendingPenalty={gameState.pendingPenalty}
                isHumanTurn={isHumanTurn}
                canHumanDraw={isHumanTurn}
                onDrawClick={handleHumanDraw}
                statusMessage={turnBanner}
              />
            </div>

            {/* Right Opponent (Femi) */}
            <div className="shrink-0">
              <OpponentSeat
                player={botRight}
                isCurrentTurn={gameState.currentPlayerIndex === 3}
                position="right"
                lastActionText={opponentActionText[botRight.id]}
              />
            </div>
          </div>

          {/* Bottom Area: Human Player's Hand */}
          <div className="w-full pt-2">
            <PlayerHand
              hand={humanPlayer.hand}
              activeShape={gameState.activeShape}
              activeNumber={gameState.activeNumber}
              pendingPenalty={gameState.pendingPenalty}
              isHumanTurn={isHumanTurn}
              onPlayCard={handleHumanPlayCard}
              onDrawCard={handleHumanDraw}
            />
          </div>
        </div>

        {/* Live Match Feed below the table */}
        <div className="mt-3">
          <GameLogView logs={gameState.log} />
        </div>
      </main>

      {/* WHOT Shape Selection Modal */}
      <WhotShapeModal
        isOpen={gameState.status === 'WAITING_WHOT_SHAPE'}
        onSelectShape={handleSelectWhotShape}
      />

      {/* Signature Peek Next Card Modal */}
      <PeekModal
        isOpen={isPeekOpen}
        onClose={() => setIsPeekOpen(false)}
        isFreePeek={isFreePeek}
        gemBalance={gems}
        onConfirmPaidPeek={handleConfirmPaidPeek}
        onUseFreePeek={handleFreePeekUsed}
        onOpenGemShop={() => setIsGemShopOpen(true)}
        peekResult={peekPrediction}
      />

      {/* Daily Login Reward Modal */}
      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        onClose={() => setIsDailyRewardOpen(false)}
        rewardState={rewardState}
        onClaimSuccess={() => {
          setRewardState(getDailyRewardState());
          setGems(getStoredGems());
          soundService.playVictory();
        }}
      />

      {/* Demo Gem Shop Modal */}
      <GemShopModal
        isOpen={isGemShopOpen}
        onClose={() => setIsGemShopOpen(false)}
        onGemsUpdated={() => setGems(getStoredGems())}
      />

      {/* How to Play Rules Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Statistics Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={gameState.status === 'GAME_OVER'}
        winner={gameState.winner}
        players={gameState.players}
        turnCount={gameState.turnCount}
        onNewMatch={handleNewMatch}
      />
    </div>
  );
}
