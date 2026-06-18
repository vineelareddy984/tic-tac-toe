import { BoardState, Symbol } from '../types';
import { playClickSound } from '../utils/sound';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  winner: Symbol | null;
  isDraw: boolean;
  disabled: boolean;
}

export function GameBoard({
  board,
  onCellClick,
  winningLine,
  winner,
  isDraw,
  disabled,
}: GameBoardProps) {
  const isWinningCell = (index: number) => {
    return winningLine?.includes(index) || false;
  };

  const handleCellClick = (index: number) => {
    if (disabled || board[index] !== null) return;
    playClickSound();
    onCellClick(index);
  };

  return (
    <div className="relative w-full aspect-square max-w-[340px] md:max-w-[380px] mx-auto p-2 bg-gray-50/50 dark:bg-zinc-950/40 rounded-3xl border border-gray-200/50 dark:border-zinc-800/40 shadow-sm backdrop-blur-sm">
      {/* 3x3 grid */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
        {board.map((cell, index) => {
          const isWinner = isWinningCell(index);
          const hasSymbol = cell !== null;

          return (
            <button
              key={index}
              disabled={disabled || hasSymbol}
              onClick={() => handleCellClick(index)}
              className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 outline-none select-none overflow-hidden aspect-square cursor-pointer ${
                isWinner
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/25 border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse'
                  : hasSymbol
                  ? 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]'
                  : 'bg-white dark:bg-zinc-900/60 border border-gray-200/30 dark:border-zinc-800/20 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-white dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:scale-[1.03] active:scale-[0.97]'
              }`}
              style={{ contentVisibility: 'auto' }}
            >
              {/* Dynamic decorative hover lines for empty cells */}
              {!hasSymbol && !disabled && (
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-radial from-gray-100/40 dark:from-zinc-800/30 to-transparent pointer-events-none" />
              )}

              {/* Symbol Drawing */}
              {cell === 'X' && (
                <div className="w-1/2 h-1/2 relative transition-all duration-300">
                  <svg
                    viewBox="0 0 100 100"
                    className={`w-full h-full stroke-sky-500 dark:stroke-sky-400 drop-shadow-[0_2px_8px_rgba(14,165,233,0.3)] ${
                      isWinner ? 'scale-110' : ''
                    }`}
                  >
                    <line
                      x1="15"
                      y1="15"
                      x2="85"
                      y2="85"
                      strokeWidth="15"
                      strokeLinecap="round"
                      className="animate-[draw-stroke_0.25s_ease-out_forwards]"
                      style={{
                        strokeDasharray: '100',
                        strokeDashoffset: '100',
                        animation: 'draw-stroke 0.2s cubic-bezier(0.12, 0, 0.39, 1) forwards',
                      }}
                    />
                    <line
                      x1="85"
                      y1="15"
                      x2="15"
                      y2="85"
                      strokeWidth="15"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: '100',
                        strokeDashoffset: '100',
                        animation: 'draw-stroke 0.2s cubic-bezier(0.12, 0, 0.39, 1) 0.1s forwards',
                      }}
                    />
                  </svg>
                </div>
              )}

              {cell === 'O' && (
                <div className="w-1/2 h-1/2 relative transition-all duration-300">
                  <svg
                    viewBox="0 0 100 100"
                    className={`w-full h-full stroke-amber-500 dark:stroke-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] ${
                      isWinner ? 'scale-110' : ''
                    }`}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      strokeWidth="15"
                      fill="transparent"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: '220',
                        strokeDashoffset: '220',
                        animation: 'draw-stroke 0.25s cubic-bezier(0.12, 0, 0.39, 1) forwards',
                      }}
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Embedded stroke draw CSS animation */}
      <style>{`
        @keyframes draw-stroke {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
