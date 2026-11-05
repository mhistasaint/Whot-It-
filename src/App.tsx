import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardShape, GameState, GameMode, BotDifficulty, PlayerAvatar } from './game/types';
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
  canUseDailyFreePeek,
  recordDailyFreePeekUsed,
  DailyRewardState,
  MatchStats,
  PlayerSettings,
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
import { WelcomeLobby } from './components/WelcomeLobby';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { SettingsModal } from './components/SettingsModal';
import { MultiplayerModal } from './components/MultiplayerModal';

export default function App() {
  // Settings & Persistent State
  const [settings, setSettings] = useState<PlayerSettings>(() => getPlayerSettings());
  const [gems, setGems] = useState<number>(() => getStoredGems());
  const [rewardState, setRewardState] = useState<DailyRewardState>(() => getDailyRewardState());
  const [stats, setStats] = useState<MatchStats>(() => getMatchStats());
  const [isDailyFreePeekReady, setIsDailyFreePeekReady] = useState<boolean>(() => canUseDailyFreePeek());

  // Game Engine State (starts at LOBBY by default)
  const [gameState, setGameState] = useState<GameState>(() =>
    initGame(
      settings.selectedMode,
      settings.difficulty,
      settings.playerName,
      settings.avatar,
      'LOBBY'
    )
  );

  // Modals
  const [isLobbyOpen, setIsLobbyOpen] = useState(true);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isGemShopOpen, setIsGemShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  // Bot activity indicators
  const [opponentActionText, setOpponentActionText] = useState<{ [playerId: string]: string | null }>({});
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio synchronization
  useEffect(() => {
    soundService.setSoundEnabled(settings.soundEnabled);
    soundService.setMusicEnabled(settings.musicEnabled);
  }, [settings.soundEnabled, settings.musicEnabled]);

  // Global Theme synchronization to body
  useEffect(() => {
    document.body.className = `theme-${settings.theme} antialiased`;
  }, [settings.theme]);

  const handleUpdateSettings = (newSettings: Partial<PlayerSettings>) => {
    const updated = savePlayerSettings(newSettings);
    setSettings(updated);
  };

  const handleToggleSound = () => {
    handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleMusic = () => {
    handleUpdateSettings({ musicEnabled: !settings.musicEnabled });
  };

  const handleSaveAvatar = (newAvatar: PlayerAvatar, newName: string) => {
    handleUpdateSettings({ avatar: newAvatar, playerName: newName });
    // Update active human player in current game state as well
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isHuman ? { ...p, name: newName, avatar: newAvatar } : p
      ),
    }));
  };

  // Start new match
  const handleStartMatch = useCallback(() => {
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    const fresh = initGame(
      settings.selectedMode,
      settings.difficulty,
      settings.playerName,
      settings.avatar,
      'PLAYING'
    );
    setGameState(fresh);
    setIsLobbyOpen(false);
    setOpponentActionText({});
    soundService.playCardPlay();
  }, [settings.selectedMode, settings.difficulty, settings.playerName, settings.avatar]);

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
    if (gameState.status !== 'PLAYING' || isLobbyOpen) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isHuman) return;

    const botIndex = gameState.currentPlayerIndex;
    const delay = settings.fastSpeed ? 400 : 800;

    botTimeoutRef.current = setTimeout(() => {
      const handCounts = gameState.players.map((p, idx) => (idx === botIndex ? 0 : p.hand.length));

      // Uses canonical bot decision engine with active difficulty
      const decision = selectBotMove(
        currentPlayer.hand,
        gameState.activeShape,
        gameState.activeNumber,
        gameState.pendingPenalty,
        handCounts,
        gameState.difficulty
      );

      if (decision.type === 'PLAY' && decision.card) {
        const playedCard = decision.card;

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

        if (playedCard.isSpecial && playedCard.specialType) {
          soundService.playSpecialCard(playedCard.specialType);
        } else {
          soundService.playCardPlay();
        }

        setGameState(prev => playCard(prev, botIndex, playedCard.id, decision.chosenWhotShape));
      } else {
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
    gameState.difficulty,
    isLobbyOpen,
    settings.fastSpeed,
  ]);

  // Human player actions
  const handleHumanPlayCard = (cardId: string) => {
    if (gameState.currentPlayerIndex !== 0) return;

    const humanPlayer = gameState.players[0];
    const card = humanPlayer.hand.find(c => c.id === cardId);
    if (!card) return;

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

  const handleSelectWhotShape = (shape: CardShape) => {
    soundService.playCardPlay();
    setGameState(prev => resolveWhotShape(prev, shape));
  };

  const handleHumanDraw = () => {
    if (gameState.currentPlayerIndex !== 0) return;
    soundService.playCardDraw();
    setGameState(prev => drawCard(prev, 0));
  };

  // Peek feature
  const isHumanTurn = gameState.currentPlayerIndex === 0;

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

  const handleUseDailyFreePeek = () => {
    recordDailyFreePeekUsed();
    setIsDailyFreePeekReady(false);
    soundService.playPeek();
    updateMatchStats(prev => ({ ...prev, peeksUsed: prev.peeksUsed + 1 }));
    setStats(getMatchStats());
  };

  const peekPrediction = isPeekOpen ? peekNextBotMove(gameState) : null;

  // Active status cues
  const currentPlayer = gameState.players[gameState.currentPlayerIndex] || gameState.players[0];
  const humanPlayer = gameState.players[0];

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

  // Opponents list (all non-human players)
  const opponents = gameState.players.filter(p => !p.isHuman);

  return (
    <div className={`flex flex-col min-h-screen theme-${settings.theme} bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] overflow-x-hidden`}>
      {/* Top Bar Navigation */}
      <Navbar
        gems={gems}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenDailyReward={() => setIsDailyRewardOpen(true)}
        onOpenGemShop={() => setIsGemShopOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLobby={() => setIsLobbyOpen(true)}
        onNewMatch={handleStartMatch}
        isDailyFreePeek={isDailyFreePeekReady}
        onTriggerPeek={handleOpenPeek}
        canPeek={gameState.status === 'PLAYING'}
        isInGame={!isLobbyOpen}
      />

      {/* Main Content: Either Welcome Lobby OR Live Game Table */}
      {isLobbyOpen ? (
        <WelcomeLobby
          playerName={settings.playerName}
          avatar={settings.avatar}
          gems={gems}
          canClaimDailyReward={rewardState.canClaimToday}
          canUseFreePeek={isDailyFreePeekReady}
          selectedMode={settings.selectedMode}
          selectedDifficulty={settings.difficulty}
          onSelectMode={mode => handleUpdateSettings({ selectedMode: mode })}
          onSelectDifficulty={diff => handleUpdateSettings({ difficulty: diff })}
          onPlayGame={handleStartMatch}
          onOpenAvatarStudio={() => setIsAvatarStudioOpen(true)}
          onOpenDailyBonus={() => setIsDailyRewardOpen(true)}
          onOpenGemShop={() => setIsGemShopOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
        />
      ) : (
        <main className="flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto p-2 sm:p-4 animate-fade-in">
          {/* Felt Card Table Canvas with Dynamic Theme */}
          <div className="felt-table relative w-full rounded-3xl border-4 border-[var(--theme-table-border)] shadow-2xl p-2 sm:p-5 flex flex-col justify-between min-h-[580px] md:min-h-[640px]">
            
            {/* Top Row Opponents: Layout dynamically adjusts based on active player count */}
            <div className="w-full">
              {opponents.length === 1 && (
                /* 1v1: Single bot centered at top */
                <div className="flex justify-center pt-1">
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    position="top"
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                </div>
              )}

              {opponents.length === 2 && (
                /* 1v2: Two bots spaced nicely at top */
                <div className="flex justify-around items-center pt-1 px-4">
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    position="topLeft"
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                  <OpponentSeat
                    player={opponents[1]}
                    isCurrentTurn={gameState.currentPlayerIndex === 2}
                    position="topRight"
                    lastActionText={opponentActionText[opponents[1].id]}
                  />
                </div>
              )}

              {opponents.length === 3 && (
                /* 1v3: Middle bot at top */
                <div className="flex justify-center pt-1">
                  <OpponentSeat
                    player={opponents[1]}
                    isCurrentTurn={gameState.currentPlayerIndex === 2}
                    position="top"
                    lastActionText={opponentActionText[opponents[1].id]}
                  />
                </div>
              )}

              {opponents.length === 4 && (
                /* 1v4: Two bots at top center */
                <div className="flex justify-center gap-8 sm:gap-16 pt-1">
                  <OpponentSeat
                    player={opponents[1]}
                    isCurrentTurn={gameState.currentPlayerIndex === 2}
                    position="topLeft"
                    lastActionText={opponentActionText[opponents[1].id]}
                  />
                  <OpponentSeat
                    player={opponents[2]}
                    isCurrentTurn={gameState.currentPlayerIndex === 3}
                    position="topRight"
                    lastActionText={opponentActionText[opponents[2].id]}
                  />
                </div>
              )}
            </div>

            {/* Middle Row: Left Opponent(s) + Center Table Play Arena + Right Opponent(s) */}
            <div className="flex items-center justify-between w-full my-auto px-1 sm:px-4 gap-2">
              {/* Left Opponent */}
              <div className="shrink-0 min-w-[70px]">
                {opponents.length >= 3 ? (
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    position="left"
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                ) : (
                  <div className="w-16" />
                )}
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

              {/* Right Opponent */}
              <div className="shrink-0 min-w-[70px]">
                {opponents.length === 3 ? (
                  <OpponentSeat
                    player={opponents[2]}
                    isCurrentTurn={gameState.currentPlayerIndex === 3}
                    position="right"
                    lastActionText={opponentActionText[opponents[2].id]}
                  />
                ) : opponents.length === 4 ? (
                  <OpponentSeat
                    player={opponents[3]}
                    isCurrentTurn={gameState.currentPlayerIndex === 4}
                    position="right"
                    lastActionText={opponentActionText[opponents[3].id]}
                  />
                ) : (
                  <div className="w-16" />
                )}
              </div>
            </div>

            {/* Bottom Row: Human Player's Hand */}
            <div className="w-full pt-1">
              <PlayerHand
                hand={humanPlayer.hand}
                activeShape={gameState.activeShape}
                activeNumber={gameState.activeNumber}
                pendingPenalty={gameState.pendingPenalty}
                isHumanTurn={isHumanTurn}
                hintsEnabled={settings.hintsEnabled}
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
      )}

      {/* WHOT Shape Selection Modal */}
      <WhotShapeModal
        isOpen={gameState.status === 'WAITING_WHOT_SHAPE'}
        onSelectShape={handleSelectWhotShape}
      />

      {/* Signature Daily Free / Paid Peek Modal */}
      <PeekModal
        isOpen={isPeekOpen}
        onClose={() => setIsPeekOpen(false)}
        isDailyFreePeek={isDailyFreePeekReady}
        gemBalance={gems}
        onConfirmPaidPeek={handleConfirmPaidPeek}
        onUseDailyFreePeek={handleUseDailyFreePeek}
        onOpenGemShop={() => setIsGemShopOpen(true)}
        peekResult={peekPrediction}
      />

      {/* 7-Day Streak Daily Bonus Modal */}
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

      {/* Avatar Studio Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={isAvatarStudioOpen}
        onClose={() => setIsAvatarStudioOpen(false)}
        currentAvatar={settings.avatar}
        playerName={settings.playerName}
        onSave={handleSaveAvatar}
      />

      {/* Game Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenAvatarStudio={() => setIsAvatarStudioOpen(true)}
      />

      {/* Multiplayer Coming Soon Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
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
        onNewMatch={handleStartMatch}
      />
    </div>
  );
}
