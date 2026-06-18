import { useState, useEffect } from 'react';
import { GameMode, AIDifficulty, PlayerNames, ScoreState, Symbol } from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { ScoreBoard } from './components/ScoreBoard';
import { PlayerSettings } from './components/PlayerSettings';
import { GameBoard } from './components/GameBoard';
import { StatusCard } from './components/StatusCard';
import { HtmlExporter } from './components/HtmlExporter';
import { checkGameState, getAIMove } from './utils/ai';
import {
  playMoveX,
  playMoveO,
  playWinSound,
  playDrawSound,
  playClickSound,
  toggleMute as libToggleMute,
  getMuteState,
} from './utils/sound';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function App() {
  // Game states
  const [board, setBoard] = useState<(Symbol | null)[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Symbol>('X');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('hard');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [names, setNames] = useState<PlayerNames>({
    X: 'Player X',
    O: 'Player O',
  });

  const [scores, setScores] = useState<ScoreState>({
    X: 0,
    O: 0,
    draws: 0,
  });

  // Sound and dark mode
  const [isMuted, setIsMuted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Load and apply dark theme on boot
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Handle game mode or settings changes -> resets match board to be clean
  useEffect(() => {
    handleReset();
  }, [gameMode, aiDifficulty]);

  // Listen to AI turns and resolve them automatically
  useEffect(() => {
    if (gameMode === 'ai' && currentTurn === 'O') {
      const state = checkGameState(board);
      if (state.winner || state.isDraw) return; // Game already ended

      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const move = getAIMove(board, 'O', aiDifficulty);
        if (move !== -1) {
          const nextBoard = [...board];
          nextBoard[move] = 'O';
          setBoard(nextBoard);
          playMoveO();

          // Check outcome
          const outcome = checkGameState(nextBoard);
          if (outcome.winner) {
            setScores((prev) => ({ ...prev, O: prev.O + 1 }));
            playWinSound();
          } else if (outcome.isDraw) {
            setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
            playDrawSound();
          } else {
            setCurrentTurn('X');
          }
        }
        setIsAiThinking(false);
      }, 500); // 500ms delay for visual pacing

      return () => clearTimeout(timer);
    }
  }, [board, currentTurn, gameMode, aiDifficulty]);

  // Click on a core grid cell
  const handleCellClick = (index: number) => {
    if (board[index] !== null || (gameMode === 'ai' && currentTurn === 'O') || isAiThinking) {
      return;
    }

    const nextBoard = [...board];
    const originalTurn = currentTurn;
    nextBoard[index] = originalTurn;
    setBoard(nextBoard);

    if (originalTurn === 'X') {
      playMoveX();
    } else {
      playMoveO();
    }

    // Check game outcomes
    const outcome = checkGameState(nextBoard);
    if (outcome.winner) {
      setScores((prev) => ({
        ...prev,
        [outcome.winner as Symbol]: prev[outcome.winner as Symbol] + 1,
      }));
      playWinSound();
    } else if (outcome.isDraw) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      playDrawSound();
    } else {
      setCurrentTurn(originalTurn === 'X' ? 'O' : 'X');
    }
  };

  // Reset the active board for a new match
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setIsAiThinking(false);
  };

  // Reset the long-term score scoreboard counters
  const handleResetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    handleReset();
  };

  const handleToggleMute = () => {
    const nextMuted = libToggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) playClickSound();
  };

  const { winner, line: winningLine, isDraw } = checkGameState(board);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <nav id="app-nav" className="w-full border-b border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              #
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                Tic-Tac-Toe
                <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Premium Duel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute button */}
            <button
              id="volume-toggle-btn"
              onClick={handleToggleMute}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center"
              aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-rose-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              )}
            </button>

            {/* Dark mode button */}
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main id="app-main" className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        {/* Playable Area and Side Settings Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
          
          {/* Left panel: Customizer, Settings and Extractor */}
          <section className="col-span-1 md:col-span-5 space-y-6">
            <PlayerSettings
              gameMode={gameMode}
              aiDifficulty={aiDifficulty}
              names={names}
              setGameMode={setGameMode}
              setAIDifficulty={setAIDifficulty}
              setNames={setNames}
              onResetScores={handleResetScores}
            />
            <HtmlExporter />
          </section>

          {/* Right panel: Active Game Arena */}
          <section className="col-span-1 md:col-span-7 flex flex-col gap-6 items-center">
            {/* Interactive scoreboard */}
            <ScoreBoard
              scores={scores}
              names={names}
              gameMode={gameMode}
              aiDifficulty={aiDifficulty}
            />

            {/* Active Turn/Banner cards */}
            <StatusCard
              currentTurn={currentTurn}
              winner={winner}
              isDraw={isDraw}
              names={names}
              gameMode={gameMode}
              onReset={handleReset}
            />

            {/* Main Interactive Grid board */}
            <div className="relative w-full flex justify-center">
              <GameBoard
                board={board}
                onCellClick={handleCellClick}
                winningLine={winningLine}
                winner={winner}
                isDraw={isDraw}
                disabled={isAiThinking || !!winner || isDraw}
              />

              {/* Loader placeholder when Bot is finding minimax trees */}
              {isAiThinking && (
                <div id="ai-loader-bubble" className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                  AI is calculating...
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Aesthetic minimalistic footer */}
      <footer id="app-footer" className="w-full text-center py-6 text-[11px] font-semibold text-gray-400 dark:text-zinc-600 border-t border-gray-100 dark:border-zinc-900 mt-10">
        Tic-Tac-Toe Game Room &middot; Powered by Antigravity React Core
      </footer>
    </div>
  );
}
