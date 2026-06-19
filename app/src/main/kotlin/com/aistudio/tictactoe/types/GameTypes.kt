package com.aistudio.tictactoe.types

enum class BoardSymbol {
    X, O
}

enum class GameMode {
    LOCAL, AI
}

enum class AIDifficulty {
    EASY, MEDIUM, HARD
}

data class PlayerNames(
    val x: String = "Player X",
    val o: String = "Player O"
)

data class ScoreState(
    val x: Int = 0,
    val o: Int = 0,
    val draws: Int = 0
)

data class GameStateResult(
    val winner: BoardSymbol? = null,
    val line: List<Int>? = null,
    val isDraw: Boolean = false
)
