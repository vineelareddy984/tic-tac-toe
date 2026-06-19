import React from 'react';
import { ScoreState, PlayerNames, GameMode, AIDifficulty } from '../types';

interface ScoreBoardProps {
  scores: ScoreState;
  names: PlayerNames;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  names,
  gameMode,
  aiDifficulty
}) => {
  const oLabel = gameMode === 'ai' ? `AI (${aiDifficulty})` : names.O;

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {/* Player X */}
      <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-2xl p-3.5 text-center flex flex-col justify-between">
        <span className="text-xs font-bold text-sky-800 dark:text-sky-400 truncate block">
          {names.X}
        </span>
        <div className="flex items-baseline justify-center gap-0.5 mt-1">
          <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
            {scores.X}
          </span>
          <span className="text-[10px] font-bold text-sky-400 dark:text-sky-500 uppercase">W</span>
        </div>
      </div>

      {/* Draws */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-3.5 text-center flex flex-col justify-between">
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">
          Draws
        </span>
        <div className="flex items-baseline justify-center gap-0.5 mt-1">
          <span className="text-2xl font-black font-mono text-zinc-700 dark:text-zinc-300">
            {scores.draws}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">D</span>
        </div>
      </div>

      {/* Player O */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-3.5 text-center flex flex-col justify-between">
        <span className="text-xs font-bold text-amber-800 dark:text-amber-400 truncate block">
          {oLabel}
        </span>
        <div className="flex items-baseline justify-center gap-0.5 mt-1">
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {scores.O}
          </span>
          <span className="text-[10px] font-bold text-amber-400 dark:text-amber-500 uppercase">W</span>
        </div>
      </div>
    </div>
  );
};
