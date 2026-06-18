import { ChangeEvent } from 'react';
import { GameMode, AIDifficulty, PlayerNames } from '../types';
import { User, Cpu, ChevronDown } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface PlayerSettingsProps {
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  names: PlayerNames;
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (diff: AIDifficulty) => void;
  setNames: (names: PlayerNames) => void;
  onResetScores: () => void;
}

export function PlayerSettings({
  gameMode,
  aiDifficulty,
  names,
  setGameMode,
  setAIDifficulty,
  setNames,
  onResetScores,
}: PlayerSettingsProps) {
  const handleModeChange = (mode: GameMode) => {
    playClickSound();
    setGameMode(mode);
  };

  const handleDifficultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    setAIDifficulty(e.target.value as AIDifficulty);
  };

  const handleNameChange = (player: 'X' | 'O', value: string) => {
    setNames({
      ...names,
      [player]: value.slice(0, 14), // Limit names to 14 chars
    });
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center">
        Game Setup
      </h3>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-gray-100 dark:border-zinc-900">
        <button
          onClick={() => handleModeChange('local')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            gameMode === 'local'
              ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Local Play
        </button>
        <button
          onClick={() => handleModeChange('ai')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            gameMode === 'ai'
              ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          vs AI Bot
        </button>
      </div>

      {/* Contextual Fields */}
      <div className="space-y-3.5">
        {/* Helper Name Input Player X */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            Player X Name
          </label>
          <input
            type="text"
            value={names.X}
            onChange={(e) => handleNameChange('X', e.target.value)}
            className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all shadow-inner"
            placeholder="Name for X"
          />
        </div>

        {/* Player O / AI Config */}
        {gameMode === 'local' ? (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Player O Name
            </label>
            <input
              type="text"
              value={names.O}
              onChange={(e) => handleNameChange('O', e.target.value)}
              className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-inner"
              placeholder="Name for O"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-amber-500" />
              AI Bot Difficulty
            </label>
            <div className="relative">
              <select
                value={aiDifficulty}
                onChange={handleDifficultyChange}
                className="w-full text-sm font-medium pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none cursor-pointer shadow-inner"
              >
                <option value="easy">Easy (Random moves)</option>
                <option value="medium">Medium (Smart blocks/wins)</option>
                <option value="hard">Hard (Unbeatable Minimax)</option>
              </select>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Score Reset Button */}
      <button
        onClick={() => {
          playClickSound();
          onResetScores();
        }}
        className="w-full mt-1.5 py-2 px-3 text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/40 rounded-xl hover:bg-rose-100/50 dark:hover:bg-rose-950/40 active:scale-[0.98] transition-all cursor-pointer"
      >
        Reset Match Scores
      </button>
    </div>
  );
}
