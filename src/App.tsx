import React from 'react';
import { Symbol, GameMode, AIDifficulty, PlayerNames, ScoreState } from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { ScoreBoard } from './components/ScoreBoard';
import { PlayerSettings } from './components/PlayerSettings';
import { StatusCard } from './components/StatusCard';
import { GameBoard } from './components/GameBoard';
import { HtmlExporter } from './components/HtmlExporter';
import { checkGameState, getAIMove } from './utils/ai';
import { sound } from './utils/sound';
import { Star } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const [board, setBoard] = React.useState<(Symbol | null)[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = React.useState<Symbol>('X');
  const [gameMode, setGameMode] = React.useState<GameMode>('local');
  const [aiDifficulty, setAiDifficulty] = React.useState<AIDifficulty>('hard');
  const [isAiThinking, setIsAiThinking] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(false);

  const [names, setNames] = React.useState<PlayerNames>({
    X: 'Player X',
    O: 'Player O'
  });

  const [scores, setScores] = React.useState<ScoreState>({
    X: 0,
    O: 0,
    draws: 0
  });

  // Sync dark mode style on document body
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync inline sound mute
  React.useEffect(() => {
    sound.setMuted(isMuted);
  }, [isMuted]);

  // Reset board on configuration change
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setIsAiThinking(false);
  };

  const handleResetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    handleReset();
  };

  // AI loop
  React.useEffect(() => {
    if (gameMode === 'ai' && currentTurn === 'O') {
      const state = checkGameState(board);
      if (!state.winner && !state.isDraw) {
        setIsAiThinking(true);

        const timer = setTimeout(() => {
          const aiMoveIdx = getAIMove(board, 'O', aiDifficulty);
          if (aiMoveIdx !== -1) {
            const nextBoard = [...board];
            nextBoard[aiMoveIdx] = 'O';
            setBoard(nextBoard);
            sound.playMoveO();

            const nextState = checkGameState(nextBoard);
            if (nextState.winner) {
              setScores(prev => ({ ...prev, O: prev.O + 1 }));
              sound.playWin();
            } else if (nextState.isDraw) {
              setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
              sound.playDraw();
            } else {
              setCurrentTurn('X');
            }
          }
          setIsAiThinking(false);
        }, 550); // Fluid delay

        return () => clearTimeout(timer);
      }
    }
  }, [board, currentTurn, gameMode, aiDifficulty]);

  const handleCellClick = (idx: number) => {
    if (board[idx] || (gameMode === 'ai' && currentTurn === 'O') || isAiThinking) return;

    const nextBoard = [...board];
    nextBoard[idx] = currentTurn;
    setBoard(nextBoard);

    if (currentTurn === 'X') {
      sound.playMoveX();
    } else {
      sound.playMoveO();
    }

    const state = checkGameState(nextBoard);
    if (state.winner) {
      if (state.winner === 'X') {
        setScores(prev => ({ ...prev, X: prev.X + 1 }));
      } else {
        setScores(prev => ({ ...prev, O: prev.O + 1 }));
      }
      sound.playWin();
    } else if (state.isDraw) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      sound.playDraw();
    } else {
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    }
  };

  const gameState = checkGameState(board);
  const isGameOver = !!gameState.winner || gameState.isDraw;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
        
        {/* Header Navbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/85 dark:bg-[#18181b]/85 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-500/20">
              #
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base tracking-tight leading-none text-slate-900 dark:text-white">
                  Tic-Tac-Toe
                </span>
                <Star size={13} className="fill-amber-400 stroke-amber-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wide uppercase">
                Premium Duel Edition
              </span>
            </div>
          </div>

          <ThemeToggle
            darkMode={darkMode}
            onToggleTheme={() => { setDarkMode(!darkMode); sound.playClick(); }}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        </header>

        {/* Workspace Body content */}
        <main className="flex-1 px-4 py-6 md:py-8 flex flex-col gap-5 items-center">
          
          <ScoreBoard
            scores={scores}
            names={names}
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
          />

          <PlayerSettings
            gameMode={gameMode}
            onModeChange={handleModeToggle => { setGameMode(handleModeToggle); handleResetScores(); }}
            aiDifficulty={aiDifficulty}
            onDifficultyChange={handleDifficultyToggle => { setAiDifficulty(handleDifficultyToggle); handleReset(); }}
            names={names}
            onNameChange={setNames}
            onResetMatch={handleResetScores}
          />

          <StatusCard
            currentTurn={currentTurn}
            names={names}
            gameMode={gameMode}
            isGameOver={isGameOver}
            winner={gameState.winner}
            isDraw={gameState.isDraw}
            onReset={handleReset}
          />

          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={gameState.line}
            disabled={isGameOver || isAiThinking}
            isAiThinking={isAiThinking}
          />

          {/* Portable Export utility block */}
          <div className="w-full mt-2">
            <HtmlExporter />
          </div>

        </main>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-zinc-100 dark:border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest leading-none">
            Tic-Tac-Toe Game Room • Crafted in Cloud Native Workspace
          </p>
        </footer>

      </div>
    </div>
  );
}
