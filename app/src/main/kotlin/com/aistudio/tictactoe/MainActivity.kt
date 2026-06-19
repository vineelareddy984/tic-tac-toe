package com.aistudio.tictactoe

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aistudio.tictactoe.types.*
import com.aistudio.tictactoe.utils.AIUtils
import com.aistudio.tictactoe.utils.SoundManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var darkMode by remember { mutableStateOf(false) }
            val systemTheme = isSystemInDarkTheme()
            
            // Sync with system default initially
            LaunchedEffect(Unit) {
                darkMode = systemTheme
            }

            AppTheme(darkTheme = darkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TicTacToeApp(
                        darkMode = darkMode,
                        onToggleTheme = {
                            darkMode = !darkMode
                            SoundManager.playClick()
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun AppTheme(
    darkTheme: Boolean,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = Color(0xFF38BDF8), // Blue Sky
            secondary = Color(0xFFFBBF24), // Amber
            background = Color(0xFF09090B), // Deep slate
            surface = Color(0xFF18181B), // Zinc Card
            onBackground = Color(0xFFF4F4F5),
            onSurface = Color(0xFFE4E4E7)
        )
    } else {
        lightColorScheme(
            primary = Color(0xFF0284C7), // Sky Blue
            secondary = Color(0xFFD97706), // Amber
            background = Color(0xFFF8FAFC), // Off-white
            surface = Color(0xFFFFFFFF), // White Card
            onBackground = Color(0xFF0F172A),
            onSurface = Color(0xFF1E293B)
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TicTacToeApp(
    darkMode: Boolean,
    onToggleTheme: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    
    // States
    var board by remember { mutableStateOf(List<BoardSymbol?>(9) { null }) }
    var currentTurn by remember { mutableStateOf(BoardSymbol.X) }
    var gameMode by remember { mutableStateOf(GameMode.LOCAL) }
    var aiDifficulty by remember { mutableStateOf(AIDifficulty.HARD) }
    var isAiThinking by remember { mutableStateOf(false) }
    var isMuted by remember { mutableStateOf(false) }

    var names by remember {
        mutableStateOf(PlayerNames(x = "Player X", o = "Player O"))
    }

    var scores by remember {
        mutableStateOf(ScoreState(x = 0, o = 0, draws = 0))
    }

    // Sync with singleton state helper
    LaunchedEffect(isMuted) {
        SoundManager.isMuted = isMuted
    }

    // Reset board when modes or difficulties change
    val handleReset = {
        board = List(9) { null }
        currentTurn = BoardSymbol.X
        isAiThinking = false
    }

    val handleResetScores = {
        scores = ScoreState()
        handleReset()
    }

    // AI logic observer
    LaunchedEffect(board, currentTurn, gameMode, aiDifficulty) {
        if (gameMode == GameMode.AI && currentTurn == BoardSymbol.O) {
            val state = AIUtils.checkGameState(board)
            if (state.winner == null && !state.isDraw) {
                isAiThinking = true
                delay(500) // Paced time to feel fluid

                val aiMove = AIUtils.getAIMove(board, BoardSymbol.O, aiDifficulty)
                if (aiMove != -1) {
                    val nextBoard = board.toMutableList()
                    nextBoard[aiMove] = BoardSymbol.O
                    board = nextBoard
                    SoundManager.playMoveO()

                    val result = AIUtils.checkGameState(nextBoard)
                    if (result.winner != null) {
                        scores = scores.copy(o = scores.o + 1)
                        SoundManager.playWin()
                    } else if (result.isDraw) {
                        scores = scores.copy(draws = scores.draws + 1)
                        SoundManager.playDraw()
                    } else {
                        currentTurn = BoardSymbol.X
                    }
                }
                isAiThinking = false
            }
        }
    }

    val handleCellClick: (Int) -> Unit = { index ->
        if (board[index] == null && !(gameMode == GameMode.AI && currentTurn == BoardSymbol.O) && !isAiThinking) {
            val nextBoard = board.toMutableList()
            nextBoard[index] = currentTurn
            board = nextBoard

            if (currentTurn == BoardSymbol.X) {
                SoundManager.playMoveX()
            } else {
                SoundManager.playMoveO()
            }

            val result = AIUtils.checkGameState(nextBoard)
            if (result.winner != null) {
                if (result.winner == BoardSymbol.X) {
                    scores = scores.copy(x = scores.x + 1)
                } else {
                    scores = scores.copy(o = scores.o + 1)
                }
                SoundManager.playWin()
            } else if (result.isDraw) {
                scores = scores.copy(draws = scores.draws + 1)
                SoundManager.playDraw()
            } else {
                currentTurn = if (currentTurn == BoardSymbol.X) BoardSymbol.O else BoardSymbol.X
            }
        }
    }

    val gameResult = AIUtils.checkGameState(board)
    val isGameOver = gameResult.winner != null || gameResult.isDraw

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Navbar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, MaterialTheme.colorScheme.onBackground.copy(alpha = 0.08f))
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(Color(0xFF38BDF8), Color(0xFF4F46E5))
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "#",
                                color = Color.white,
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp
                            )
                        }

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Tic-Tac-Toe",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = null,
                                    tint = Color(0xFFFBBF24),
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                            Text(
                                "Premium Duel Edition",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                            )
                        }
                    }

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Sound switch
                        IconButton(
                            onClick = {
                                isMuted = !isMuted
                                SoundManager.playClick()
                            },
                            modifier = Modifier
                                .size(40.dp)
                                .background(
                                    MaterialTheme.colorScheme.background,
                                    RoundedCornerShape(12.dp)
                                )
                                .border(
                                    1.dp,
                                    MaterialTheme.colorScheme.onBackground.copy(alpha = 0.1f),
                                    RoundedCornerShape(12.dp)
                                )
                        ) {
                            Icon(
                                imageVector = if (isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
                                contentDescription = "Toggle Sound",
                                tint = if (isMuted) Color(0xFFEF4444) else MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // Theme switcher
                        IconButton(
                            onClick = { onToggleTheme() },
                            modifier = Modifier
                                .size(40.dp)
                                .background(
                                    MaterialTheme.colorScheme.background,
                                    RoundedCornerShape(12.dp)
                                )
                                .border(
                                    1.dp,
                                    MaterialTheme.colorScheme.onBackground.copy(alpha = 0.1f),
                                    RoundedCornerShape(12.dp)
                                )
                        ) {
                            Icon(
                                imageVector = if (darkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                                contentDescription = "Toggle Theme",
                                tint = if (darkMode) Color(0xFFFBBF24) else Color(0xFF4F46E5),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }

            // Body Area
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Score statistics card
                AndroidScoreBoard(
                    scores = scores,
                    names = names,
                    gameMode = gameMode,
                    aiDifficulty = aiDifficulty
                )

                // Setup configuration card
                AndroidSetupCard(
                    gameMode = gameMode,
                    aiDifficulty = aiDifficulty,
                    names = names,
                    onModeChange = {
                        gameMode = it
                        handleResetScores()
                    },
                    onDifficultyChange = {
                        aiDifficulty = it
                        handleReset()
                    },
                    onNameChange = { names = it },
                    onResetScores = { handleResetScores() }
                )

                // Turns and Banner Cards
                AndroidStatusCard(
                    currentTurn = currentTurn,
                    names = names,
                    gameMode = gameMode,
                    isGameOver = isGameOver,
                    winner = gameResult.winner,
                    isDraw = gameResult.isDraw,
                    onReset = { handleReset() }
                )

                // Main Board Grid
                Box(contentAlignment = Alignment.Center) {
                    AndroidGameBoard(
                        board = board,
                        onCellClick = handleCellClick,
                        winningLine = gameResult.line,
                        disabled = isGameOver || isAiThinking
                    )

                    // Loading overlay when bot is working
                    if (isAiThinking) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopCenter)
                                .padding(top = 12.dp)
                                .background(Color(0xFFF59E0B), RoundedCornerShape(20.dp))
                                .padding(horizontal = 14.dp, vertical = 6.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                CircularProgressIndicator(
                                    color = Color.White,
                                    strokeWidth = 2.dp,
                                    modifier = Modifier.size(12.dp)
                                )
                                Text(
                                    "AI Bot thinking...",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }

                // Portable App Footer Note
                Text(
                    text = "Tic-Tac-Toe Game Room • Powered by Compose Core",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.4f),
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(top = 20.dp, bottom = 12.dp)
                )
            }
        }
    }
}

@Composable
fun AndroidScoreBoard(
    scores: ScoreState,
    names: PlayerNames,
    gameMode: GameMode,
    aiDifficulty: AIDifficulty
) {
    val oLabel = if (gameMode == GameMode.AI) "AI ($aiDifficulty)" else names.o

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Player X
        Box(
            modifier = Modifier
                .weight(1f)
                .background(
                    if (isSystemInDarkTheme()) Color(0xFF0C2540) else Color(0xFFE0F2FE),
                    RoundedCornerShape(16.dp)
                )
                .border(
                    1.dp,
                    if (isSystemInDarkTheme()) Color(0xFF1E3A8A).copy(alpha = 0.3f) else Color(0xFFBAE6FD),
                    RoundedCornerShape(16.dp)
                )
                .padding(10.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = names.x,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0369A1),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    verticalAlignment = Alignment.Bottom,
                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    Text(
                        text = scores.x.toString(),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFF0284C7)
                    )
                    Text("W", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0284C7).copy(alpha = 0.7f))
                }
            }
        }

        // Draws
        Box(
            modifier = Modifier
                .weight(1f)
                .background(
                    if (isSystemInDarkTheme()) Color(0xFF18181B) else Color(0xFFF1F5F9),
                    RoundedCornerShape(16.dp)
                )
                .border(
                    1.dp,
                    if (isSystemInDarkTheme()) Color(0xFF27272A) else Color(0xFFE2E8F0),
                    RoundedCornerShape(16.dp)
                )
                .padding(10.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Draws",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                )
                Row(
                    verticalAlignment = Alignment.Bottom,
                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    Text(
                        text = scores.draws.toString(),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.8f)
                    )
                    Text("D", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f))
                }
            }
        }

        // Player O
        Box(
            modifier = Modifier
                .weight(1f)
                .background(
                    if (isSystemInDarkTheme()) Color(0xFF451A03) else Color(0xFFFEF3C7),
                    RoundedCornerShape(16.dp)
                )
                .border(
                    1.dp,
                    if (isSystemInDarkTheme()) Color(0xFF78350F).copy(alpha = 0.3f) else Color(0xFFFDE68A),
                    RoundedCornerShape(16.dp)
                )
                .padding(10.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = oLabel,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB45309),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    verticalAlignment = Alignment.Bottom,
                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    Text(
                        text = scores.o.toString(),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFFD97706)
                    )
                    Text("W", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD97706).copy(alpha = 0.7f))
                }
            }
        }
    }
}

@Composable
fun AndroidSetupCard(
    gameMode: GameMode,
    aiDifficulty: AIDifficulty,
    names: PlayerNames,
    onModeChange: (GameMode) -> Unit,
    onDifficultyChange: (AIDifficulty) -> Unit,
    onNameChange: (PlayerNames) -> Unit,
    onResetScores: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.onBackground.copy(alpha = 0.08f)),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                "Game Setup",
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 2.dp),
                textAlign = TextAlign.Center
            )

            // Setup Segmented Buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        MaterialTheme.colorScheme.background,
                        RoundedCornerShape(12.dp)
                    )
                    .border(
                        1.dp,
                        MaterialTheme.colorScheme.onBackground.copy(alpha = 0.05f),
                        RoundedCornerShape(12.dp)
                    )
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Local Play Btn
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (gameMode == GameMode.LOCAL) MaterialTheme.colorScheme.surface else Color.Transparent)
                        .clickable { onModeChange(GameMode.LOCAL) }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = if (gameMode == GameMode.LOCAL) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                        )
                        Text(
                            "Local Play",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (gameMode == GameMode.LOCAL) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                    }
                }

                // AI Bot Btn
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (gameMode == GameMode.AI) MaterialTheme.colorScheme.surface else Color.Transparent)
                        .clickable { onModeChange(GameMode.AI) }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Computer,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = if (gameMode == GameMode.AI) Color(0xFFD97706) else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                        )
                        Text(
                            "vs AI Bot",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (gameMode == GameMode.AI) Color(0xFFD97706) else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                    }
                }
            }

            // Input Forms
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Name Player X
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Box(modifier = Modifier.size(6.dp).background(Color(0xFF0284C7), CircleShape))
                        Text(
                            "PLAYER X NAME",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                        )
                    }
                    TextField(
                        value = names.x,
                        onValueChange = { onNameChange(names.copy(x = it.take(14))) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = TextFieldDefaults.colors(
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent,
                            disabledIndicatorColor = Color.Transparent,
                            containerColor = MaterialTheme.colorScheme.background
                        ),
                        singleLine = true,
                        placeholder = { Text("Name for X", fontSize = 12.sp) }
                    )
                }

                // Name Player O or AI Difficulty Select
                if (gameMode == GameMode.LOCAL) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Box(modifier = Modifier.size(6.dp).background(Color(0xFFD97706), CircleShape))
                            Text(
                                "PLAYER O NAME",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                            )
                        }
                        TextField(
                            value = names.o,
                            onValueChange = { onNameChange(names.copy(o = it.take(14))) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = TextFieldDefaults.colors(
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent,
                                disabledIndicatorColor = Color.Transparent,
                                containerColor = MaterialTheme.colorScheme.background
                            ),
                            singleLine = true,
                            placeholder = { Text("Name for O", fontSize = 12.sp) }
                        )
                    }
                } else {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Icon(Icons.Default.SmartToy, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(9.dp))
                            Text(
                                "AI BOT DIFFICULTY",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                            )
                        }

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    MaterialTheme.colorScheme.background,
                                    RoundedCornerShape(10.dp)
                                )
                                .padding(2.dp),
                            horizontalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            listOf(
                                AIDifficulty.EASY to "Easy",
                                AIDifficulty.MEDIUM to "Medium",
                                AIDifficulty.HARD to "Hard"
                            ).forEach { (diff, label) ->
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (aiDifficulty == diff) Color(0xFFD97706) else Color.Transparent)
                                        .clickable { onDifficultyChange(diff) }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        label,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (aiDifficulty == diff) Color.White else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Button(
                onClick = onResetScores,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFEF4444).copy(alpha = 0.08f),
                    contentColor = Color(0xFFEF4444)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                contentPadding = PaddingValues(vertical = 0.dp)
            ) {
                Text("Reset Match Scores", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun AndroidStatusCard(
    currentTurn: BoardSymbol,
    names: PlayerNames,
    gameMode: GameMode,
    isGameOver: Boolean,
    winner: BoardSymbol?,
    isDraw: Boolean,
    onReset: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        if (!isGameOver) {
            val name = if (currentTurn == BoardSymbol.X) names.x else (if (gameMode == GameMode.AI) "AI Bot" else names.o)
            
            Box(
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(24.dp))
                    .border(
                        1.dp,
                        MaterialTheme.colorScheme.onBackground.copy(alpha = 0.06f),
                        RoundedCornerShape(24.dp)
                    )
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        "TURN",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.4f),
                        letterSpacing = 1.sp
                    )

                    Box(
                        modifier = Modifier
                            .background(
                                if (currentTurn == BoardSymbol.X) {
                                    if (isSystemInDarkTheme()) Color(0xFF0C2540) else Color(0xFFE0F2FE)
                                } else {
                                    if (isSystemInDarkTheme()) Color(0xFF451A03) else Color(0xFFFEF3C7)
                                },
                                RoundedCornerShape(10.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = currentTurn.name,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = if (currentTurn == BoardSymbol.X) Color(0xFF0284C7) else Color(0xFFD97706)
                            )
                            Text(
                                text = name,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (currentTurn == BoardSymbol.X) Color(0xFF0284C7) else Color(0xFFD97706)
                            )
                        }
                    }
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        if (winner != null) {
                            if (isSystemInDarkTheme()) Color(0xFF064E3B).copy(alpha = 0.2f) else Color(0xFFD1FAE5).copy(alpha = 0.8f)
                        } else {
                            if (isSystemInDarkTheme()) Color(0xFF1E293B).copy(alpha = 0.2f) else Color(0xFFF1F5F9).copy(alpha = 0.8f)
                        },
                        RoundedCornerShape(20.dp)
                    )
                    .border(
                        1.dp,
                        if (winner != null) {
                            if (isSystemInDarkTheme()) Color(0xFF065F46).copy(alpha = 0.4f) else Color(0xFFA7F3D0)
                        } else {
                            if (isSystemInDarkTheme()) Color(0xFF334155).copy(alpha = 0.4f) else Color(0xFFCBD5E1)
                        },
                        RoundedCornerShape(20.dp)
                    )
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (winner != null) {
                    val winnerName = if (winner == BoardSymbol.X) names.x else (if (gameMode == GameMode.AI) "AI Bot" else names.o)
                    
                    Icon(
                        imageVector = Icons.Default.EmojiEvents,
                        contentDescription = null,
                        tint = Color(0xFF10B981),
                        modifier = Modifier.size(36.dp)
                    )
                    Text(
                        text = "$winnerName Wins!",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        color = if (isSystemInDarkTheme()) Color(0xFF34D399) else Color(0xFF065F46)
                    )
                    Text(
                        "Winning combo highlighted on the board",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = (if (isSystemInDarkTheme()) Color(0xFF34D399) else Color(0xFF065F46)).copy(alpha = 0.7f)
                    )
                } else if (isDraw) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        tint = Color(0xFF64748B),
                        modifier = Modifier.size(36.dp)
                    )
                    Text(
                        text = "It's a Draw!",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        "Both players locked standard lines perfectly.",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                    )
                }

                Button(
                    onClick = {
                        SoundManager.playClick()
                        onReset()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp))
                        Text("Play Another Match", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun AndroidGameBoard(
    board: List<BoardSymbol?>,
    onCellClick: (Int) -> Unit,
    winningLine: List<Int>?,
    disabled: Boolean
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .background(
                if (isSystemInDarkTheme()) Color(0xFF121214) else Color(0xFFF1F5F9).copy(alpha = 0.5f),
                RoundedCornerShape(24.dp)
            )
            .border(
                1.dp,
                if (isSystemInDarkTheme()) Color(0xFF27272A) else Color(0xFFE2E8F0),
                RoundedCornerShape(24.dp)
            )
            .padding(10.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            for (row in 0 until 3) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    for (col in 0 until 3) {
                        val index = row * 3 + col
                        val symbol = board[index]
                        val isWinning = winningLine?.contains(index) ?: false

                        AndroidCell(
                            index = index,
                            symbol = symbol,
                            isWinning = isWinning,
                            disabled = disabled || symbol != null,
                            onClick = { onCellClick(index) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AndroidCell(
    index: Int,
    symbol: BoardSymbol?,
    isWinning: Boolean,
    disabled: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Pulse animation for winningCells
    val isLight = !isSystemInDarkTheme()
    val basePulseColor = if (isWinning) {
        Color(0xFF10B981).copy(alpha = if (isLight) 0.15f else 0.25f)
    } else {
        MaterialTheme.colorScheme.surface
    }

    val pulseTransition = rememberInfiniteTransition()
    val cellColor by if (isWinning) {
        pulseTransition.animateColor(
            initialValue = basePulseColor,
            targetValue = basePulseColor.copy(alpha = basePulseColor.alpha * 0.6f),
            animationSpec = infiniteRepeatable(
                animation = tween(1000, easing = LinearEasing),
                repeatMode = RepeatMode.Reverse
            )
        )
    } else {
        remember { mutableStateOf(basePulseColor) }
    }

    Box(
        modifier = modifier
            .fillMaxHeight()
            .clip(RoundedCornerShape(16.dp))
            .background(cellColor)
            .border(
                border = BorderStroke(
                    width = if (isWinning) 2.dp else 1.dp,
                    color = if (isWinning) Color(0xFF10B981) else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.08f)
                ),
                shape = RoundedCornerShape(16.dp)
            )
            .clickable(enabled = !disabled) { onClick() },
        contentAlignment = Alignment.Center
    ) {
        if (symbol != null) {
            // Draw custom vectors for X and O
            val symbolColor = if (symbol == BoardSymbol.X) Color(0xFF0EA5E9) else Color(0xFFF59E0B)
            
            // Build simple entry stroke animations
            val scaleAnim = remember { Animatable(0.5f) }
            LaunchedEffect(symbol) {
                scaleAnim.animateTo(
                    1f,
                    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow)
                )
            }

            Canvas(
                modifier = Modifier
                    .fillMaxSize(0.5f)
            ) {
                val sizePx = size.width
                val cap = StrokeCap.Round
                val strokeWidthX = sizePx * 0.16f

                if (symbol == BoardSymbol.X) {
                    // Draw Cross X
                    drawLine(
                        color = symbolColor,
                        start = androidx.compose.ui.geometry.Offset(0f, 0f),
                        end = androidx.compose.ui.geometry.Offset(sizePx * scaleAnim.value, sizePx * scaleAnim.value),
                        strokeWidth = strokeWidthX,
                        cap = cap
                    )
                    if (scaleAnim.value > 0.5f) {
                        drawLine(
                            color = symbolColor,
                            start = androidx.compose.ui.geometry.Offset(sizePx, 0f),
                            end = androidx.compose.ui.geometry.Offset(sizePx - (sizePx * scaleAnim.value), sizePx * scaleAnim.value),
                            strokeWidth = strokeWidthX,
                            cap = cap
                        )
                    }
                } else {
                    // Draw Circle O
                    drawCircle(
                        color = symbolColor,
                        radius = (sizePx / 2f) * scaleAnim.value,
                        style = Stroke(width = strokeWidthX, cap = cap)
                    )
                }
            }
        }
    }
}
