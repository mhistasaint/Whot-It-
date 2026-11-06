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
import { LandscapePrompt } from './components/LandscapePrompt';
import { Home, Pause, Play, Settings, Sparkles } from 'lucide-react';

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

  // In-Game Pause State
  const [isGamePaused, setIsGamePaused] = useState(false);

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
    setIsGamePaused(false);
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
    if (gameState.status !== 'PLAYING' || currentScreen !== 'MATCH' || isGamePaused) return;

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
    isGamePaused,
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

  // 15-second countdown timer for the human player's turn that automatically draws a card if time runs out
  const [turnTimeRemaining, setTurnTimeRemaining] = useState<number>(15);
  const isHumanTurn = gameState.status === 'PLAYING' && gameState.currentPlayerIndex === 0 && currentScreen === 'MATCH';

  const isAnyModalOpen =
    isSettingsOpen ||
    isHowToPlayOpen ||
    isStatsOpen ||
    isDailyRewardOpen ||
    isGemShopOpen ||
    isAvatarStudioOpen ||
    isProfileOpen ||
    isMultiplayerOpen ||
    isPeekOpen;

  // Reset turn countdown to 15s whenever it becomes human's turn or turnCount advances
  useEffect(() => {
    if (isHumanTurn) {
      setTurnTimeRemaining(15);
    }
  }, [isHumanTurn, gameState.turnCount]);

  // Countdown timer ticker: pauses immediately when isGamePaused or any modal is open!
  useEffect(() => {
    if (!isHumanTurn || isAnyModalOpen || isGamePaused || turnTimeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTurnTimeRemaining(prev => {
        if (prev <= 1) {
          return 0;
        }
        if (prev <= 4) {
          soundService.playTimerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isHumanTurn, isAnyModalOpen, isGamePaused, turnTimeRemaining]);

  // When countdown hits 0 on human turn: auto-draw from market to enforce game pressure!
  useEffect(() => {
    if (isHumanTurn && turnTimeRemaining === 0 && !isGamePaused && !isAnyModalOpen) {
      // Clear staged WHOT 20 if user was selecting shape
      setStagedWhotCardId(null);
      setSelectedCardId(null);
      if (gameState.status === 'WAITING_WHOT_SHAPE') {
        setGameState(prev => cancelWhotShape(prev));
      }

      // Flash auto-draw warning on the human player
      setOpponentActionText(prev => ({
        ...prev,
        [gameState.players[0].id]: "⏱️ Time's up (15s)! Forced to Market 🛒",
      }));
      setTimeout(() => {
        setOpponentActionText(prev => ({ ...prev, [gameState.players[0].id]: null }));
      }, 2500);

      soundService.playCardDraw();
      setGameState(prev => drawCard(prev, 0));
    }
  }, [isHumanTurn, turnTimeRemaining, isGamePaused, isAnyModalOpen]);

  // Peek feature
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

  // Distribute bots across the game board (Left, Top, Right) for all screen sizes
  let leftOpponent: typeof opponents[0] | null = null;
  let topOpponents: typeof opponents = [];
  let rightOpponent: typeof opponents[0] | null = null;

  if (opponents.length === 1) {
    topOpponents = [opponents[0]];
  } else if (opponents.length === 2) {
    leftOpponent = opponents[0];
    rightOpponent = opponents[1];
  } else if (opponents.length === 3) {
    leftOpponent = opponents[0];
    topOpponents = [opponents[1]];
    rightOpponent = opponents[2];
  } else if (opponents.length >= 4) {
    leftOpponent = opponents[0];
    topOpponents = [opponents[1], opponents[2]];
    rightOpponent = opponents[3];
  }

  return (
    <div className={`flex flex-col min-h-screen theme-${settings.theme} bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] overflow-x-hidden`}>
      {/* Top Bar Navigation (shown only on Gameplay Lobby, hidden in fullscreen match & welcome) */}
      {currentScreen === 'HOME' && (
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
          isInGame={false}
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

      {/* Screen 3: Fullscreen Live Gameplay Arena Table (No Navbar, Minimal In-Game Bar: Home, Pause, Settings) */}
      {currentScreen === 'MATCH' && (
        <main className="flex-1 flex flex-col justify-between w-full h-[100dvh] max-h-[100dvh] p-1 sm:p-2.5 animate-fade-in select-none">
          {/* Fullscreen Minimal In-Game Top Bar: Home, Pause, Settings */}
          <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 bg-[var(--theme-bg-surface)]/85 backdrop-blur-md rounded-xl border border-[var(--theme-border)]/50 shrink-0 mb-1 z-20 shadow-md">
            {/* Left: Home Button */}
            <button
              onClick={() => {
                if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
                setCurrentScreen('WELCOME');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] hover:text-[var(--theme-gold)] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Return to Home"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-gold)]" />
              <span>Home</span>
            </button>

            {/* Center: Match Mode Title & Peek shortcut */}
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xs sm:text-sm text-[var(--theme-text-primary)]">
                WHOT <span className="text-[var(--theme-gold)]">It!</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-[var(--theme-accent)] bg-[var(--theme-bg-main)] px-2 py-0.5 rounded-full border border-[var(--theme-border)] hidden sm:inline">
                {settings.selectedMode} · {settings.difficulty}
              </span>
              <button
                onClick={handleOpenPeek}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--theme-bg-main)] border border-[var(--theme-accent)]/50 text-[11px] font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-elevated)] transition-colors cursor-pointer"
                title="Peek next bot move"
              >
                <Sparkles className="w-3 h-3 text-[var(--theme-accent)]" />
                <span className="hidden sm:inline">Peek</span>
                <span className="text-[9px] font-mono">{isDailyFreePeekReady ? 'FREE' : '100💎'}</span>
              </button>
            </div>

            {/* Right: Pause & Settings Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGamePaused(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isGamePaused
                    ? 'bg-[var(--theme-gold)] text-[var(--theme-accent-text)] border-[var(--theme-gold)] animate-pulse'
                    : 'bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)]'
                }`}
                title={isGamePaused ? 'Resume Match' : 'Pause Match'}
              >
                {isGamePaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isGamePaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dedicated Responsive Game Table Canvas with Dynamic Theme (Fullscreen fit) */}
          <div className="felt-table relative w-full flex-1 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[var(--theme-table-border)] shadow-2xl p-1.5 sm:p-2.5 md:p-3 flex flex-col justify-between overflow-hidden">
            
            {/* REGION A: TOP REGION — Top Computer Opponent(s) */}
            {topOpponents.length > 0 && (
              <div className="w-full shrink-0 pt-0.5 sm:pt-1">
                <div className="flex items-center justify-center gap-4 sm:gap-8 mx-auto py-0.5">
                  {topOpponents.map(bot => (
                    <OpponentSeat
                      key={bot.id}
                      player={bot}
                      isCurrentTurn={gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === bot.id)}
                      position="top"
                      compact={topOpponents.length > 1}
                      lastActionText={opponentActionText[bot.id]}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* REGION B: CENTRAL PLAY ARENA — Split Bots (Left, Right) and Center Table */}
            <div className="flex-1 flex flex-row items-center justify-between w-full my-auto py-1 px-1 sm:px-3 gap-1 sm:gap-3">
              {/* Left Opponent Column */}
              <div className="flex items-center justify-center w-20 sm:w-28 md:w-32 shrink-0">
                {leftOpponent ? (
                  <OpponentSeat
                    player={leftOpponent}
                    isCurrentTurn={gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === leftOpponent.id)}
                    position="left"
                    compact
                    lastActionText={opponentActionText[leftOpponent.id]}
                  />
                ) : (
                  <div className="w-1" />
                )}
              </div>

              {/* Central Table: Draw Pile & Discard Pile (No top timer, direct tap to draw) */}
              <div className="flex-1 flex items-center justify-center">
                <CenterTable
                  drawPileCount={gameState.drawPile.length}
                  discardPile={gameState.discardPile}
                  activeShape={gameState.activeShape}
                  activeNumber={gameState.activeNumber}
                  pendingPenalty={gameState.pendingPenalty}
                  isHumanTurn={isHumanTurn}
                  canHumanDraw={isHumanTurn}
                  onDrawClick={handleHumanDraw}
                />
              </div>

              {/* Right Opponent Column */}
              <div className="flex items-center justify-center w-20 sm:w-28 md:w-32 shrink-0">
                {rightOpponent ? (
                  <OpponentSeat
                    player={rightOpponent}
                    isCurrentTurn={gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === rightOpponent.id)}
                    position="right"
                    compact
                    lastActionText={opponentActionText[rightOpponent.id]}
                  />
                ) : (
                  <div className="w-1" />
                )}
              </div>
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
                turnTimeRemaining={turnTimeRemaining}
              />
            </div>
          </div>

          {/* Forced Landscape Mode Prompt for Mobile Devices */}
          <LandscapePrompt />
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

      {/* Demo Gem Shop Modal (Locked with active Daily Gem link) */}
      <GemShopModal
        isOpen={isGemShopOpen}
        onClose={() => setIsGemShopOpen(false)}
        onGemsUpdated={() => setGems(getStoredGems())}
        onOpenDailyBonus={() => {
          setIsGemShopOpen(false);
          setIsDailyRewardOpen(true);
        }}
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


      {/* In-Game Pause Modal Overlay */}
      {isGamePaused && currentScreen === 'MATCH' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none text-[var(--theme-text-primary)]">
          <div className="w-full max-w-sm bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/50 flex items-center justify-center mb-3 text-2xl text-[var(--theme-gold)] shadow-inner">
              ⏸️
            </div>
            <h3 className="font-display font-black text-2xl text-[var(--theme-text-primary)] mb-1">
              Match Paused
            </h3>
            <p className="text-xs text-[var(--theme-text-muted)] mb-5">
              Turn countdown and bot moves are suspended
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsGamePaused(false)}
                className="w-full py-3 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-xs shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Game</span>
              </button>
              <button
                onClick={() => {
                  setIsGamePaused(false);
                  handleStartMatch();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] font-display font-bold text-xs transition-all cursor-pointer"
              >
                Deal New Match
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] font-display font-bold text-xs transition-all cursor-pointer"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setIsGamePaused(false);
                  setCurrentScreen('WELCOME');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-red-500/40 hover:border-red-500 text-red-300 font-display font-bold text-xs transition-all cursor-pointer"
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={gameState.status === 'GAME_OVER'}
        winner={gameState.winner}
        players={gameState.players}
        turnCount={gameState.turnCount}
        onNewMatch={handleStartMatch}
        onReturnHome={() => setCurrentScreen('WELCOME')}
        onReturnToLobby={() => setCurrentScreen('WELCOME')}
      />
    </div>
  );
}
