import { ScoreState, PlayerNames, GameMode } from '../types';

interface ScoreBoardProps {
  scores: ScoreState;
  names: PlayerNames;
  gameMode: GameMode;
  aiDifficulty: string;
}

export function ScoreBoard({ scores, names, gameMode, aiDifficulty }: ScoreBoardProps) {
  const oLabel = gameMode === 'ai' ? `AI (${aiDifficulty})` : names.O;

  return (
    <div id="stats-board" className="grid grid-cols-3 gap-3 w-full">
      {/* Player X Score Card */}
      <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 transition-all duration-300">
        <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 capitalize tracking-wide truncate w-full text-center">
          {names.X || 'Player X'}
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-mono text-3xl font-extrabold text-sky-800 dark:text-sky-300">
            {scores.X}
          </span>
          <span className="text-[10px] uppercase font-bold text-sky-500/70">W</span>
        </div>
      </div>

      {/* Draws Score Card */}
      <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 transition-all duration-300">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide text-center">
          Draws
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-mono text-3xl font-extrabold text-zinc-700 dark:text-zinc-300">
            {scores.draws}
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-400">D</span>
        </div>
      </div>

      {/* Player O/AI Score Card */}
      <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 transition-all duration-300">
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 capitalize tracking-wide truncate w-full text-center">
          {oLabel || 'Player O'}
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-mono text-3xl font-extrabold text-amber-800 dark:text-amber-300">
            {scores.O}
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-500/70">W</span>
        </div>
      </div>
    </div>
  );
}
