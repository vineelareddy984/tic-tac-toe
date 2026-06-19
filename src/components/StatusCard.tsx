import React from 'react';
import { Symbol, PlayerNames, GameMode } from '../types';
import { Trophy, HelpCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface StatusCardProps {
  currentTurn: Symbol;
  names: PlayerNames;
  gameMode: GameMode;
  isGameOver: boolean;
  winner: Symbol | null;
  isDraw: boolean;
  onReset: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  currentTurn,
  names,
  gameMode,
  isGameOver,
  winner,
  isDraw,
  onReset
}) => {
  if (!isGameOver) {
    const activeName = currentTurn === 'X' ? names.X : (gameMode === 'ai' ? 'AI Bot' : names.O);
    return (
      <div className="flex justify-center w-full">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/60 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-xs">
          <span className="text-[10px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            Turn
          </span>
          <div className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 ${
            currentTurn === 'X'
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
          }`}>
            <span>{currentTurn}</span>
            <span className="font-semibold block truncate max-w-28">{activeName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`w-full flex flex-col items-center gap-3.5 border rounded-3xl p-6 text-center ${
        winner
          ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/30 text-emerald-800 dark:text-emerald-400'
          : 'bg-zinc-50/80 dark:bg-zinc-900/40 border-zinc-150 dark:border-zinc-800/40 text-zinc-700 dark:text-zinc-300'
      }`}
    >
      {winner ? (
        <>
          <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
            <Trophy size={28} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight mb-1">
              {winner === 'X' ? names.X : (gameMode === 'ai' ? 'AI Bot' : names.O)} Wins!
            </h2>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 font-medium">
              Winning alignment successfully locked on the board.
            </p>
          </div>
        </>
      ) : isDraw ? (
        <>
          <div className="p-3 bg-zinc-500/10 rounded-full text-zinc-500">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight mb-1">
              It's a Draw!
            </h2>
            <p className="text-xs text-zinc-500/70 dark:text-zinc-400/60 font-medium">
              Both contestants built solid block lines perfectly.
            </p>
          </div>
        </>
      ) : null}

      <button
        id="btn-play-again"
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all cursor-pointer mt-1"
      >
        <RefreshCw size={13} />
        Play Another Match
      </button>
    </motion.div>
  );
};
