export type Symbol = 'X' | 'O';
export type BoardState = Array<Symbol | null>;

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
