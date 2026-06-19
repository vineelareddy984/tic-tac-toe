export type Symbol = 'X' | 'O';

export type GameMode = 'local' | 'ai';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface PlayerNames {
  X: string;
  O: string;
}

export interface ScoreState {
  X: number;
  O: number;
  draws: number;
}

export interface GameState {
  winner: Symbol | null;
  line: number[] | null;
  isDraw: boolean;
}
