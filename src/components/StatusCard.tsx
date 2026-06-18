import { Symbol, GameMode, PlayerNames } from '../types';
import { RefreshCw, Trophy, AlertCircle } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface StatusCardProps {
  currentTurn: Symbol;
  winner: Symbol | null;
  isDraw: boolean;
  names: PlayerNames;
  gameMode: GameMode;
  onReset: () => void;
}

export function StatusCard({
  currentTurn,
  winner,
  isDraw,
  names,
  gameMode,
  onReset,
}: StatusCardProps) {
  const isGameOver = !!winner || isDraw;

  // Render names
  const getPlayerName = (sym: Symbol) => {
    if (sym === 'X') return names.X || 'Player X';
    if (sym === 'O') {
      return gameMode === 'ai' ? 'AI Bot' : names.O || 'Player O';
    }
    return '';
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Turn indicator / game-over banner */}
      <div className="w-full text-center">
        {!isGameOver ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-sm transition-all animate-none">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Turn
            </span>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-sm ${
                currentTurn === 'X'
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              }`}
            >
              <span className="text-sm font-black">{currentTurn}</span>
              <span className="font-semibold tracking-wide truncate max-w-[100px]">
                {getPlayerName(currentTurn)}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden transition-all duration-300">
            {winner ? (
              <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 animate-bounce">
                <div className="relative">
                  <Trophy className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <h4 className="text-lg font-black text-emerald-800 dark:text-emerald-300 tracking-tight">
                  {getPlayerName(winner)} Wins!
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Matches are highlighted on the board below
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800/60 transition-all">
                <AlertCircle className="h-10 w-10 text-zinc-500" />
                <h4 className="text-lg font-black text-zinc-700 dark:text-zinc-300 tracking-tight">
                  It's a Draw!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Both players played perfectly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Play Again Trigger */}
      {isGameOver && (
        <button
          onClick={() => {
            playClickSound();
            onReset();
          }}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-700 text-white font-extrabold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer group"
        >
          <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          Play Another Match
        </button>
      )}
    </div>
  );
}
