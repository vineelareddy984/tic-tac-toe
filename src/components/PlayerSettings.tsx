import React from 'react';
import { GameMode, AIDifficulty, PlayerNames } from '../types';
import { User, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';

interface PlayerSettingsProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  aiDifficulty: AIDifficulty;
  onDifficultyChange: (diff: AIDifficulty) => void;
  names: PlayerNames;
  onNameChange: (names: PlayerNames) => void;
  onResetMatch: () => void;
}

export const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  gameMode,
  onModeChange,
  aiDifficulty,
  onDifficultyChange,
  names,
  onNameChange,
  onResetMatch
}) => {

  const handleModeToggle = (mode: GameMode) => {
    sound.playClick();
    onModeChange(mode);
  };

  const handleDifficultyToggle = (diff: AIDifficulty) => {
    sound.playClick();
    onDifficultyChange(diff);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl p-5 w-full flex flex-col gap-4">
      <h3 className="text-[11px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase text-center">
        Game Setup
      </h3>

      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900/50">
        <button
          id="btn-mode-local"
          type="button"
          onClick={() => handleModeToggle('local')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            gameMode === 'local'
              ? 'bg-white dark:bg-zinc-900 shadow-xs border border-zinc-100 dark:border-zinc-800 text-sky-600 dark:text-sky-400'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <User size={13} />
          Local Play
        </button>
        <button
          id="btn-mode-ai"
          type="button"
          onClick={() => handleModeToggle('ai')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            gameMode === 'ai'
              ? 'bg-white dark:bg-zinc-900 shadow-xs border border-zinc-100 dark:border-zinc-800 text-amber-600 dark:text-amber-400'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Cpu size={13} />
          vs AI Bot
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Player X
          </label>
          <input
            id="input-name-x"
            type="text"
            value={names.X}
            onChange={(e) => onNameChange({ ...names, X: e.target.value.slice(0, 14) })}
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl focus:border-sky-500/50 focus:outline-hidden dark:text-zinc-200"
            placeholder="Name for X"
          />
        </div>

        {gameMode === 'local' ? (
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Player O
            </label>
            <input
              id="input-name-o"
              type="text"
              value={names.O}
              onChange={(e) => onNameChange({ ...names, O: e.target.value.slice(0, 14) })}
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl focus:border-amber-500/50 focus:outline-hidden dark:text-zinc-200"
              placeholder="Name for O"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
              <Cpu size={9} className="text-amber-500" /> AI Bot Level
            </label>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900/50">
              {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((level) => (
                <button
                  id={`btn-diff-${level}`}
                  key={level}
                  type="button"
                  onClick={() => handleDifficultyToggle(level)}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-all capitalize cursor-pointer ${
                    aiDifficulty === level
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'
                  }`}
                >
                  {level === 'hard' ? (
                    <span className="flex items-center justify-center gap-0.5">
                      <Sparkles size={8} /> Hard
                    </span>
                  ) : level}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        id="btn-reset-scores"
        onClick={() => {
          sound.playClick();
          onResetMatch();
        }}
        className="w-full text-center flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold text-red-500 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100/50 dark:border-red-900/20 transition-all cursor-pointer"
      >
        <RefreshCw size={10} />
        Reset Match Scores
      </button>
    </div>
  );
};
