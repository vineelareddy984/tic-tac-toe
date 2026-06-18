import { BoardState, Symbol } from '../types';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Helper to check winner
export function checkGameState(board: BoardState): {
  winner: Symbol | null;
  line: number[] | null;
  isDraw: boolean;
} {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo, isDraw: false };
    }
  }

  const isDraw = board.every(cell => cell !== null);
  return { winner: null, line: null, isDraw };
}

// Get all empty spots on the board
function getEmptyIndices(board: BoardState): number[] {
  return board
    .map((val, index) => (val === null ? index : null))
    .filter((val): val is number => val !== null);
}

// Simple random move selector
function getRandomMove(board: BoardState): number {
  const empty = getEmptyIndices(board);
  if (empty.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * empty.length);
  return empty[randomIndex];
}

// Minimax algorithm implementation
function minimax(
  board: BoardState,
  depth: number,
  isMax: boolean,
  aiSymbol: Symbol,
  playerSymbol: Symbol
): { score: number; index: number } {
  const state = checkGameState(board);

  // Base evaluations
  if (state.winner === aiSymbol) {
    return { score: 10 - depth, index: -1 };
  }
  if (state.winner === playerSymbol) {
    return { score: -10 + depth, index: -1 };
  }
  if (state.isDraw) {
    return { score: 0, index: -1 };
  }

  const emptySpots = getEmptyIndices(board);

  if (isMax) {
    let bestScore = -Infinity;
    let bestIndex = -1;

    for (const index of emptySpots) {
      board[index] = aiSymbol;
      const result = minimax(board, depth + 1, false, aiSymbol, playerSymbol);
      board[index] = null; // undo move

      if (result.score > bestScore) {
        bestScore = result.score;
        bestIndex = index;
      }
    }
    return { score: bestScore, index: bestIndex };
  } else {
    let bestScore = Infinity;
    let bestIndex = -1;

    for (const index of emptySpots) {
      board[index] = playerSymbol;
      const result = minimax(board, depth + 1, true, aiSymbol, playerSymbol);
      board[index] = null; // undo move

      if (result.score < bestScore) {
        bestScore = result.score;
        bestIndex = index;
      }
    }
    return { score: bestScore, index: bestIndex };
  }
}

// Find immediate win or immediate block
function findCrucialMove(board: BoardState, symbolToCheck: Symbol): number {
  const emptySpots = getEmptyIndices(board);
  for (const index of emptySpots) {
    const nextBoard = [...board];
    nextBoard[index] = symbolToCheck;
    const { winner } = checkGameState(nextBoard);
    if (winner === symbolToCheck) {
      return index;
    }
  }
  return -1;
}

// Main function to query the AI move
export function getAIMove(
  board: BoardState,
  aiSymbol: Symbol,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const playerSymbol: Symbol = aiSymbol === 'X' ? 'O' : 'X';
  const emptySpots = getEmptyIndices(board);

  if (emptySpots.length === 0) return -1;

  // Easy mode: Completely random
  if (difficulty === 'easy') {
    return getRandomMove(board);
  }

  // Medium mode: 60% smart (immediate wins/blocks or Center), 40% random
  if (difficulty === 'medium') {
    const shouldBeSmart = Math.random() < 0.6;
    if (shouldBeSmart) {
      // 1. Try to win immediately
      const winMove = findCrucialMove(board, aiSymbol);
      if (winMove !== -1) return winMove;

      // 2. Try to block player from winning immediately
      const blockMove = findCrucialMove(board, playerSymbol);
      if (blockMove !== -1) return blockMove;

      // 3. Play center if available
      if (board[4] === null) return 4;
    }
    return getRandomMove(board);
  }

  // Hard mode: Minimax (unbeatable)
  // First move optimization for center / corner if board is empty to save computation,
  // though minimax is extremely fast.
  if (emptySpots.length === 9) {
    // If starting first, take center or a random corner
    const preferred = [4, 0, 2, 6, 8];
    const randomIndex = Math.floor(Math.random() * preferred.length);
    return preferred[randomIndex];
  }

  const { index } = minimax([...board], 0, true, aiSymbol, playerSymbol);
  return index;
}
