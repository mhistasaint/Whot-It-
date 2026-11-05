import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardShape, GameState, GameMode, BotDifficulty, PlayerAvatar, UserProfile } from './game/types';
import { initGame, playCard, drawCard, resolveWhotShape, cancelWhotShape } from './game/engine';
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
  getUserProfile,
  saveUserProfile,
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
import { WelcomeScreen } from './components/WelcomeScreen';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { SettingsModal } from './components/SettingsModal';
import { MultiplayerModal } from './components/MultiplayerModal';

export default function App() {
  // Settings & Persistent State
  const [settings, setSettings] = useState<PlayerSettings>(() => getPlayerSettings());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getUserProfile());
  const [gems, setGems] = useState<number>(() => getStoredGems());
  const [rewardState, setRewardState] = useState<DailyRewardState>(() => getDailyRewardState());
  const [stats, setStats] = useState<MatchStats>(() => getMatchStats());
  const [isDailyFreePeekReady, setIsDailyFreePeekReady] = useState<boolean>(() => canUseDailyFreePeek());

  // Screen View Management: WELCOME -> HOME (Main Home Screen / Lobby) -> MATCH (Game Table)
  const [currentScreen, setCurrentScreen] = useState<'WELCOME' | 'HOME' | 'MATCH'>('WELCOME');

  // Game Engine State (starts at LOBBY by default)
  const [gameState, setGameState] = useState<GameState>(() =>
    initGame(
      settings.selectedMode,
      settings.difficulty,
      userProfile.username || settings.playerName,
      userProfile.avatar || settings.avatar,
      'LOBBY'
    )
  );

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileCreationMode, setIsProfileCreationMode] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isGemShopOpen, setIsGemShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  // WHOT 20 staging and card selection state
  const [stagedWhotCardId, setStagedWhotCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
    const updatedProfile = saveUserProfile({ avatar: newAvatar, username: newName });
    setUserProfile(updatedProfile);
    // Update active human player in current game state as well
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isHuman ? { ...p, name: newName, avatar: newAvatar } : p
      ),
    }));
  };

  const handleSaveProfile = (updates: Partial<UserProfile>) => {
    const updated = saveUserProfile(updates);
    setUserProfile(updated);
    if (updates.username || updates.avatar) {
      handleUpdateSettings({
        playerName: updated.username,
        avatar: updated.avatar,
      });
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p =>
          p.isHuman ? { ...p, name: updated.username, avatar: updated.avatar } : p
        ),
      }));
    }
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
      userProfile.username || settings.playerName,
      userProfile.avatar || settings.avatar,
      'PLAYING'
    );
    setGameState(fresh);
    setCurrentScreen('MATCH');
    setOpponentActionText({});
    soundService.playCardPlay();
  }, [settings.selectedMode, settings.difficulty, userProfile.username, userProfile.avatar, settings.playerName, settings.avatar]);

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
    if (gameState.status !== 'PLAYING' || currentScreen !== 'MATCH') return;

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
    currentScreen,
    settings.fastSpeed,
  ]);

  // Human player actions
  const handleHumanPlayCard = (cardId: string) => {
    if (gameState.currentPlayerIndex !== 0) return;

    const humanPlayer = gameState.players[0];
    const card = humanPlayer.hand.find(c => c.id === cardId);
    if (!card) return;

    // If card is WHOT 20, stage it for shape selection and explicit confirmation (can be cancelled!)
    if (card.number === 20) {
      setStagedWhotCardId(cardId);
      setSelectedCardId(cardId);
      return;
    }

    // Normal or special card: update stats and play immediately
    updateMatchStats(prev => ({
      ...prev,
      cardsPlayed: prev.cardsPlayed + 1,
      holdOnsPlayed: card.number === 1 ? prev.holdOnsPlayed + 1 : prev.holdOnsPlayed,
      generalMarketsPlayed: card.number === 14 ? prev.generalMarketsPlayed + 1 : prev.generalMarketsPlayed,
      penaltiesStacked: gameState.pendingPenalty && (card.number === 2 || card.number === 5)
        ? prev.penaltiesStacked + 1
        : prev.penaltiesStacked,
    }));
    setStats(getMatchStats());

    if (card.isSpecial && card.specialType) {
      soundService.playSpecialCard(card.specialType);
    } else {
      soundService.playCardPlay();
    }

    setSelectedCardId(null);
    setGameState(prev => playCard(prev, 0, cardId));
  };

  // Called when user confirms WHOT 20 shape in modal
  const handleConfirmWhotShape = (shape: CardShape) => {
    const cardIdToPlay = stagedWhotCardId || gameState.players[0].hand.find(c => c.number === 20)?.id;

    if (!cardIdToPlay) {
      // Fallback for engine WAITING_WHOT_SHAPE
      soundService.playCardPlay();
      setGameState(prev => resolveWhotShape(prev, shape));
      setStagedWhotCardId(null);
      setSelectedCardId(null);
      return;
    }

    updateMatchStats(prev => ({
      ...prev,
      cardsPlayed: prev.cardsPlayed + 1,
      whotsPlayed: prev.whotsPlayed + 1,
    }));
    setStats(getMatchStats());

    soundService.playSpecialCard('WHOT');
    setGameState(prev => playCard(prev, 0, cardIdToPlay, shape));
    setStagedWhotCardId(null);
    setSelectedCardId(null);
  };

  // Called when user cancels WHOT 20 in modal
  const handleCancelWhotShape = () => {
    setStagedWhotCardId(null);
    setSelectedCardId(null);
    if (gameState.status === 'WAITING_WHOT_SHAPE') {
      setGameState(prev => cancelWhotShape(prev));
    }
  };

  const handleHumanDraw = () => {
    if (gameState.currentPlayerIndex !== 0) return;
    setSelectedCardId(null);
    setStagedWhotCardId(null);
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
      {/* Top Bar Navigation (hidden on dedicated Welcome Screen) */}
      {currentScreen !== 'WELCOME' && (
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
          onOpenLobby={() => setCurrentScreen('HOME')}
          onOpenWelcome={() => setCurrentScreen('WELCOME')}
          onOpenProfile={() => {
            setIsProfileCreationMode(false);
            setIsProfileOpen(true);
          }}
          onNewMatch={handleStartMatch}
          isDailyFreePeek={isDailyFreePeekReady}
          onTriggerPeek={handleOpenPeek}
          canPeek={gameState.status === 'PLAYING'}
          isInGame={currentScreen === 'MATCH'}
        />
      )}

      {/* Screen 1: Dedicated Welcome Screen (WHOT It!, Tagline, Card Art, Play, Sign In, Settings) */}
      {currentScreen === 'WELCOME' && (
        <WelcomeScreen
          onPlay={() => setCurrentScreen('HOME')}
          onSignIn={() => {
            setIsProfileCreationMode(false);
            setIsProfileOpen(true);
          }}
          onSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Screen 2: Main Home Screen / Lobby */}
      {currentScreen === 'HOME' && (
        <WelcomeLobby
          playerName={userProfile.username || settings.playerName}
          avatar={userProfile.avatar || settings.avatar}
          gems={gems}
          userProfile={userProfile}
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
          onOpenProfile={() => {
            setIsProfileCreationMode(false);
            setIsProfileOpen(true);
          }}
          onBackToWelcome={() => setCurrentScreen('WELCOME')}
        />
      )}

      {/* Screen 3: Live Gameplay Arena Table */}
      {currentScreen === 'MATCH' && (
        <main className="flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto p-1 sm:p-3 animate-fade-in">
          {/* Dedicated Responsive Game Table Canvas with Dynamic Theme */}
          <div className="felt-table relative w-full rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[var(--theme-table-border)] shadow-2xl p-2 sm:p-4 flex flex-col justify-between h-[calc(100dvh-4.25rem)] sm:h-[calc(100dvh-4.5rem)] max-h-[860px] min-h-[500px] overflow-hidden">
            
            {/* REGION A: TOP REGION — All Computer Opponents dynamically adapting with ZERO clipping */}
            <div className="w-full shrink-0 pt-0.5 sm:pt-1">
              {opponents.length === 1 && (
                /* 1v1: Single opponent centered at top */
                <div className="flex justify-center items-center py-1">
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    position="top"
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                </div>
              )}

              {opponents.length === 2 && (
                /* 1v2: Two opponents evenly spaced at top */
                <div className="flex justify-around items-center w-full max-w-sm sm:max-w-md mx-auto py-1">
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
                /* 1v3: All three opponents arranged in a clean, unclipped 3-column row */
                <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full max-w-md sm:max-w-xl mx-auto py-1 items-start justify-items-center">
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    compact
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                  <OpponentSeat
                    player={opponents[1]}
                    isCurrentTurn={gameState.currentPlayerIndex === 2}
                    compact
                    lastActionText={opponentActionText[opponents[1].id]}
                  />
                  <OpponentSeat
                    player={opponents[2]}
                    isCurrentTurn={gameState.currentPlayerIndex === 3}
                    compact
                    lastActionText={opponentActionText[opponents[2].id]}
                  />
                </div>
              )}

              {opponents.length === 4 && (
                /* 1v4: All four opponents arranged in a clean, unclipped 4-column row */
                <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full max-w-lg sm:max-w-2xl mx-auto py-1 items-start justify-items-center">
                  <OpponentSeat
                    player={opponents[0]}
                    isCurrentTurn={gameState.currentPlayerIndex === 1}
                    compact
                    lastActionText={opponentActionText[opponents[0].id]}
                  />
                  <OpponentSeat
                    player={opponents[1]}
                    isCurrentTurn={gameState.currentPlayerIndex === 2}
                    compact
                    lastActionText={opponentActionText[opponents[1].id]}
                  />
                  <OpponentSeat
                    player={opponents[2]}
                    isCurrentTurn={gameState.currentPlayerIndex === 3}
                    compact
                    lastActionText={opponentActionText[opponents[2].id]}
                  />
                  <OpponentSeat
                    player={opponents[3]}
                    isCurrentTurn={gameState.currentPlayerIndex === 4}
                    compact
                    lastActionText={opponentActionText[opponents[3].id]}
                  />
                </div>
              )}
            </div>

            {/* REGION B: CENTRAL PLAY ARENA — Market Draw Pile, Discard Pile & Match Status */}
            <div className="flex-1 flex items-center justify-center w-full my-auto py-1 px-1 sm:px-4">
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

            {/* REGION C: BOTTOM REGION — Human Player's Hand & Interactive Controls */}
            <div className="w-full shrink-0 pb-0.5 sm:pb-1">
              <PlayerHand
                hand={humanPlayer.hand}
                activeShape={gameState.activeShape}
                activeNumber={gameState.activeNumber}
                pendingPenalty={gameState.pendingPenalty}
                isHumanTurn={isHumanTurn}
                hintsEnabled={settings.hintsEnabled}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onPlayCard={handleHumanPlayCard}
                onDrawCard={handleHumanDraw}
              />
            </div>
          </div>

          {/* Live Match Feed below the table (collapsible on mobile) */}
          <div className="mt-1 sm:mt-2 shrink-0">
            <GameLogView logs={gameState.log} />
          </div>
        </main>
      )}

      {/* WHOT Shape Selection Modal with Cancellation & Confirmation */}
      <WhotShapeModal
        isOpen={stagedWhotCardId !== null || gameState.status === 'WAITING_WHOT_SHAPE'}
        onConfirmShape={handleConfirmWhotShape}
        onCancel={handleCancelWhotShape}
        initialShape={gameState.activeShape !== 'WHOT' ? gameState.activeShape : 'CIRCLE'}
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

      {/* Player Profile & Identity Modal */}
      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        stats={stats}
        gems={gems}
        onSaveProfile={handleSaveProfile}
        onOpenAvatarStudio={() => {
          setIsProfileOpen(false);
          setIsAvatarStudioOpen(true);
        }}
        isCreationMode={isProfileCreationMode}
      />


      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={gameState.status === 'GAME_OVER'}
        winner={gameState.winner}
        players={gameState.players}
        turnCount={gameState.turnCount}
        onNewMatch={handleStartMatch}
        onReturnToLobby={() => setCurrentScreen('HOME')}
      />
    </div>
  );
}
