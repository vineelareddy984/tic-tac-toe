import { Symbol, AIDifficulty, GameState } from '../types';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export function checkGameState(board: (Symbol | null)[]): GameState {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo, isDraw: false };
    }
  }

  const isDraw = board.every(cell => cell !== null);
  return { winner: null, line: null, isDraw };
}

function getEmptyIndices(board: (Symbol | null)[]): number[] {
  return board.map((cell, idx) => cell === null ? idx : null).filter((v): v is number => v !== null);
}

function getRandomMove(board: (Symbol | null)[]): number {
  const empty = getEmptyIndices(board);
  if (empty.length === 0) return -1;
  return empty[Math.floor(Math.random() * empty.length)];
}

function findCrucialMove(board: (Symbol | null)[], symbol: Symbol): number {
  const empty = getEmptyIndices(board);
  for (const idx of empty) {
    const nextBoard = [...board];
    nextBoard[idx] = symbol;
    const state = checkGameState(nextBoard);
    if (state.winner === symbol) {
      return idx;
    }
  }
  return -1;
}

function minimax(
  board: (Symbol | null)[],
  depth: number,
  isMax: boolean,
  aiSymbol: Symbol,
  opponentSymbol: Symbol
): { score: number; idx: number } {
  const state = checkGameState(board);

  if (state.winner === aiSymbol) return { score: 10 - depth, idx: -1 };
  if (state.winner === opponentSymbol) return { score: -10 + depth, idx: -1 };
  if (state.isDraw) return { score: 0, idx: -1 };

  const empty = getEmptyIndices(board);

  if (isMax) {
    let bestScore = -Infinity;
    let bestIdx = -1;

    for (const idx of empty) {
      board[idx] = aiSymbol;
      const { score } = minimax(board, depth + 1, false, aiSymbol, opponentSymbol);
      board[idx] = null;

      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }
    return { score: bestScore, idx: bestIdx };
  } else {
    let bestScore = Infinity;
    let bestIdx = -1;

    for (const idx of empty) {
      board[idx] = opponentSymbol;
      const { score } = minimax(board, depth + 1, true, aiSymbol, opponentSymbol);
      board[idx] = null;

      if (score < bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }
    return { score: bestScore, idx: bestIdx };
  }
}

export function getAIMove(
  board: (Symbol | null)[],
  aiSymbol: Symbol,
  difficulty: AIDifficulty
): number {
  const opponentSymbol = aiSymbol === 'X' ? 'O' : 'X';
  const empty = getEmptyIndices(board);

  if (empty.length === 0) return -1;

  if (difficulty === 'easy') {
    return getRandomMove(board);
  }

  if (difficulty === 'medium') {
    const isSmart = Math.random() < 0.6;
    if (isSmart) {
      const winMove = findCrucialMove(board, aiSymbol);
      if (winMove !== -1) return winMove;

      const blockMove = findCrucialMove(board, opponentSymbol);
      if (blockMove !== -1) return blockMove;

      if (board[4] === null) return 4;
    }
    return getRandomMove(board);
  }

  if (empty.length === 9) {
    const preferred = [4, 0, 2, 6, 8];
    return preferred[Math.floor(Math.random() * preferred.length)];
  }

  const result = minimax([...board], 0, true, aiSymbol, opponentSymbol);
  return result.idx;
}
