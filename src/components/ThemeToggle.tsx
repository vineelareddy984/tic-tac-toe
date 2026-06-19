import React from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  onToggleTheme,
  isMuted,
  onToggleMute
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        id="btn-toggle-sound"
        onClick={() => {
          onToggleMute();
          if (isMuted) {
            sound.setMuted(false);
            sound.playClick();
          } else {
            sound.playClick();
            sound.setMuted(true);
          }
        }}
        className={`p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer ${
          isMuted
            ? 'bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40'
            : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        }`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <button
        id="btn-toggle-theme"
        onClick={onToggleTheme}
        className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        title="Toggle dark mode"
      >
        {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
      </button>
    </div>
  );
};
