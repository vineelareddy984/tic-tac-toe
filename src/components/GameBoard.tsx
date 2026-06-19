import React from 'react';
import { Symbol } from '../types';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameBoardProps {
  board: (Symbol | null)[];
  onCellClick: (idx: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
  isAiThinking: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  winningLine,
  disabled,
  isAiThinking
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[380px] bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-3xl border border-zinc-150 dark:border-zinc-800 flex items-center justify-center">
      
      <div className="grid grid-cols-3 grid-rows-3 gap-2.5 w-full h-full">
        {board.map((cell, idx) => {
          const isWinning = winningLine?.includes(idx);
          return (
            <button
              id={`cell-${idx}`}
              key={idx}
              type="button"
              onClick={() => onCellClick(idx)}
              disabled={disabled || cell !== null}
              className={`relative rounded-2xl flex items-center justify-center transition-all cursor-pointer select-none overflow-hidden ${
                isWinning
                  ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 shadow-sm shadow-emerald-500/10'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-zinc-300 dark:hover:border-zinc-700'
              } ${isWinning ? 'animate-pulse' : ''}`}
            >
              <AnimatePresence mode="wait">
                {cell && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: "spring", damping: 14, stiffness: 220 }}
                    className="w-full h-full flex items-center justify-center p-3.5"
                  >
                    {cell === 'X' ? (
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-sky-500 dark:stroke-sky-400 stroke-[16] fill-none" strokeLinecap="round">
                        <line x1="15" y1="15" x2="85" y2="85" />
                        <line x1="85" y1="15" x2="15" y2="85" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-500 dark:stroke-amber-400 stroke-[14] fill-none" strokeLinecap="round">
                        <circle cx="50" cy="50" r="35" />
                      </svg>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {isAiThinking && (
        <div className="absolute top-4 px-3.5 py-1.5 bg-amber-500 text-white font-bold rounded-full text-[10px] tracking-wide flex items-center gap-1.5 shadow-md">
          <Loader2 size={11} className="animate-spin" />
          AI Bot thinking...
        </div>
      )}
    </div>
  );
};
