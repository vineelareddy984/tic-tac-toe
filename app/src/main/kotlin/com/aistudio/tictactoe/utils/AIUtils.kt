package com.aistudio.tictactoe.utils

import com.aistudio.tictactoe.types.BoardSymbol
import com.aistudio.tictactoe.types.GameStateResult
import com.aistudio.tictactoe.types.AIDifficulty
import kotlin.random.Random

object AIUtils {
    private val WINNING_COMBOS = listOf(
        listOf(0, 1, 2), listOf(3, 4, 5), listOf(6, 7, 8), // rows
        listOf(0, 3, 6), listOf(1, 4, 7), listOf(2, 5, 8), // columns
        listOf(0, 4, 8), listOf(2, 4, 6)                  // diagonals
    )

    fun checkGameState(board: List<BoardSymbol?>): GameStateResult {
        for (combo in WINNING_COMBOS) {
            val (a, b, c) = combo
            if (board[a] != null && board[a] == board[b] && board[a] == board[c]) {
                return GameStateResult(winner = board[a], line = combo, isDraw = false)
            }
        }

        val isDraw = board.all { it != null }
        return GameStateResult(winner = null, line = null, isDraw = isDraw)
    }

    private fun getEmptyIndices(board: List<BoardSymbol?>): List<Int> {
        return board.mapIndexed { index, symbol -> if (symbol == null) index else null }.filterNotNull()
    }

    private fun getRandomMove(board: List<BoardSymbol?>): Int {
        val empty = getEmptyIndices(board)
        if (empty.isEmpty()) return -1
        return empty[Random.nextInt(empty.size)]
    }

    private fun findCrucialMove(board: List<BoardSymbol?>, symbolToCheck: BoardSymbol): Int {
        val emptySpots = getEmptyIndices(board)
        for (index in emptySpots) {
            val nextBoard = board.toMutableList()
            nextBoard[index] = symbolToCheck
            val state = checkGameState(nextBoard)
            if (state.winner == symbolToCheck) {
                return index
            }
        }
        return -1
    }

    private fun minimax(
        board: MutableList<BoardSymbol?>,
        depth: Int,
        isMax: Boolean,
        aiSymbol: BoardSymbol,
        playerSymbol: BoardSymbol
    ): Pair<Int, Int> {
        val state = checkGameState(board)

        if (state.winner == aiSymbol) return Pair(10 - depth, -1)
        if (state.winner == playerSymbol) return Pair(-10 + depth, -1)
        if (state.isDraw) return Pair(0, -1)

        val emptySpots = getEmptyIndices(board)

        if (isMax) {
            var bestScore = Int.MIN_VALUE
            var bestIndex = -1

            for (index in emptySpots) {
                board[index] = aiSymbol
                val (score, _) = minimax(board, depth + 1, false, aiSymbol, playerSymbol)
                board[index] = null

                if (score > bestScore) {
                    bestScore = score
                    bestIndex = index
                }
            }
            return Pair(bestScore, bestIndex)
        } else {
            var bestScore = Int.MAX_VALUE
            var bestIndex = -1

            for (index in emptySpots) {
                board[index] = playerSymbol
                val (score, _) = minimax(board, depth + 1, true, aiSymbol, playerSymbol)
                board[index] = null

                if (score < bestScore) {
                    bestScore = score
                    bestIndex = index
                }
            }
            return Pair(bestScore, bestIndex)
        }
    }

    fun getAIMove(
        board: List<BoardSymbol?>,
        aiSymbol: BoardSymbol,
        difficulty: AIDifficulty
    ): Int {
        val playerSymbol = if (aiSymbol == BoardSymbol.X) BoardSymbol.O else BoardSymbol.X
        val emptySpots = getEmptyIndices(board)

        if (emptySpots.isEmpty()) return -1

        if (difficulty == AIDifficulty.EASY) {
            return getRandomMove(board)
        }

        if (difficulty == AIDifficulty.MEDIUM) {
            val shouldBeSmart = Random.nextFloat() < 0.6f
            if (shouldBeSmart) {
                val winMove = findCrucialMove(board, aiSymbol)
                if (winMove != -1) return winMove

                val blockMove = findCrucialMove(board, playerSymbol)
                if (blockMove != -1) return blockMove

                if (board[4] == null) return 4
            }
            return getRandomMove(board)
        }

        if (emptySpots.size == 9) {
            val preferred = listOf(4, 0, 2, 6, 8)
            return preferred[Random.nextInt(preferred.size)]
        }

        val result = minimax(board.toMutableList(), 0, true, aiSymbol, playerSymbol)
        return result.second
    }
}
