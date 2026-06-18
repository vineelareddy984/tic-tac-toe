import { useState } from 'react';
import { Download, Check, FileCode } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export function HtmlExporter() {
  const [downloaded, setDownloaded] = useState(false);

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tic-Tac-Toe Standalone Game</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-muted: #64748b;
      --primary: #0284c7;
      --primary-light: #e0f2fe;
      --secondary: #d97706;
      --secondary-light: #fef3c7;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
      --font-family: "Plus Jakarta Sans", sans-serif;
    }

    .dark {
      --bg: #09090b;
      --card-bg: #18181b;
      --border: #27272a;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --primary: #38bdf8;
      --primary-light: rgba(56, 189, 248, 0.15);
      --secondary: #fbbf24;
      --secondary-light: rgba(251, 191, 36, 0.15);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      transition: background-color 0.3s, color 0.3s;
    }

    .container {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 20px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: background-color 0.3s, border-color 0.3s;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .title span {
      background: linear-gradient(to right, #0284c7, #4f46e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .btn-icon {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 8px;
      border-radius: 12px;
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .btn-icon:hover {
      background-color: var(--border);
    }

    /* Scoreboard */
    .scoreboard {
      display: grid;
      grid-template-cols: repeat(3, 1fr);
      gap: 12px;
    }

    .score-card {
      padding: 12px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid transparent;
    }

    .score-card.sky {
      background-color: var(--primary-light);
      border-color: #38bdf820;
      color: #0369a1;
    }
    .dark .score-card.sky {
      color: #38bdf8;
    }

    .score-card.amber {
      background-color: var(--secondary-light);
      border-color: #fbbf2420;
      color: #b45309;
    }
    .dark .score-card.amber {
      color: #fbbf24;
    }

    .score-card.neutral {
      background-color: var(--border);
      color: var(--text-muted);
    }

    .score-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
    }

    .score-value {
      font-family: "JetBrains Mono", monospace;
      font-size: 24px;
      font-weight: 800;
      margin-top: 4px;
    }

    /* Form Config */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-select, .form-input {
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background-color: var(--card-bg);
      color: var(--text);
      font-size: 14px;
      font-weight: 500;
      outline: none;
      width: 100%;
    }

    .form-select:focus, .form-input:focus {
      border-color: var(--primary);
    }

    .game-mode-toggle {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 8px;
      background: var(--bg);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .mode-btn {
      background: transparent;
      border: none;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }

    .mode-btn.active {
      background: var(--card-bg);
      color: var(--primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Grid */
    .board-container {
      background: var(--bg);
      padding: 8px;
      border-radius: 24px;
      border: 1px solid var(--border);
      aspect-ratio: 1;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      width: 100%;
      height: 100%;
    }

    .cell {
      background-color: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
    }

    .cell:hover:not(:disabled) {
      transform: scale(1.03);
      border-color: var(--text-muted);
    }

    .cell:disabled {
      cursor: default;
    }

    .cell.winning {
      background-color: rgba(16, 185, 129, 0.15);
      border-color: #10b981;
      animation: pulse-winning 1.5s infinite;
    }

    @keyframes pulse-winning {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .shape-x, .shape-o {
      width: 50%;
      height: 50%;
    }

    .shape-x svg {
      stroke: #0ea5e9;
    }

    .shape-o svg {
      stroke: #f59e0b;
    }

    /* Status Bar */
    .status-bar {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .badge-turn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 750;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-active {
      border-radius: 12px;
      padding: 2px 8px;
    }

    .badge-active.x {
      background-color: var(--primary-light);
      color: #0284c7;
    }

    .badge-active.o {
      background-color: var(--secondary-light);
      color: #d97706;
    }

    .btn-action {
      background: linear-gradient(to right, #0ea5e9, #4f46e5);
      color: white;
      border: none;
      padding: 12px 18px;
      border-radius: 16px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s, transform 0.1s;
    }

    .btn-action:hover {
      opacity: 0.95;
    }

    .btn-action:active {
      transform: scale(0.98);
    }

    .alert-banner {
      padding: 16px;
      border-radius: 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .alert-banner.win {
      background-color: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #065f46;
    }
    .dark .alert-banner.win {
      color: #34d399;
    }

    .alert-banner.draw {
      background-color: var(--border);
      color: var(--text);
    }

    .draw-stroke {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: stroke-draw-anim 0.25s ease-out forwards;
    }

    @keyframes stroke-draw-anim {
      to { stroke-dashoffset: 0; }
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Tic-Tac-<span>Toe</span></h1>
      <div style="display: flex; gap: 8px;">
        <button class="btn-icon" id="mute-btn" onclick="toggleMute()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="sound-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        </button>
        <button class="btn-icon" onclick="toggleTheme()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Scoreboard -->
    <div class="scoreboard">
      <div class="score-card sky">
        <span class="score-label" id="lbl-x">Player X</span>
        <span class="score-value" id="score-x">0</span>
      </div>
      <div class="score-card neutral">
        <span class="score-label">Draws</span>
        <span class="score-value" id="score-draws">0</span>
      </div>
      <div class="score-card amber">
        <span class="score-label" id="lbl-o">Player O</span>
        <span class="score-value" id="score-o">0</span>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); text-align: center; letter-spacing: 1px;">Game Setup</h3>
      
      <!-- Mode Toggle -->
      <div class="game-mode-toggle">
        <button class="mode-btn active" id="btn-mode-local" onclick="setMode('local')">Local Play</button>
        <button class="mode-btn" id="btn-mode-ai" onclick="setMode('ai')">vs AI Bot</button>
      </div>

      <!-- Config Inputs -->
      <div style="display: flex; flex-direction: column; gap: 12px;" id="config-inputs">
        <div class="form-group">
          <label class="form-label" style="display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0ea5e9;"></span> Player X Name</label>
          <input type="text" class="form-input" id="name-x" value="Player X" oninput="updateNames()">
        </div>
        <div class="form-group" id="group-o">
          <label class="form-label" style="display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background-color: #f59e0b;"></span> Player O Name</label>
          <input type="text" class="form-input" id="name-o" value="Player O" oninput="updateNames()">
        </div>
        <div class="form-group" id="group-difficulty" style="display: none;">
          <label class="form-label">AI Difficulty</label>
          <select class="form-select" id="difficulty" onchange="resetGame()">
            <option value="easy">Easy (Random moves)</option>
            <option value="medium">Medium (Smart blocks)</option>
            <option value="hard">Hard (Unbeatable Minimax)</option>
          </select>
        </div>
      </div>
      
      <button style="border: 1px solid var(--border); background: var(--card-bg); color: #ef4444; font-size: 11px; font-weight: 700; padding: 8px; border-radius: 8px; cursor: pointer;" onclick="resetScores()">Reset Scores</button>
    </div>

    <!-- Grid Card -->
    <div class="card">
      <div class="board-container">
        <div class="grid" id="board-grid">
          <!-- 9 cells generated dynamically -->
        </div>
      </div>

      <!-- Status or New Game -->
      <div class="status-bar" id="status-container">
        <!-- Turn badge or game outcomes -->
      </div>
    </div>
  </div>

  <script>
    // Game state
    let board = Array(9).fill(null);
    let currentTurn = 'X';
    let gameMode = 'local'; // 'local' | 'ai'
    let scores = { X: 0, O: 0, draws: 0 };
    let names = { X: 'Player X', O: 'Player O' };
    let isGameOver = false;
    let winningLine = null;
    let isMuted = false;

    // Web Audio Synthesizer
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playSound(type) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'moveX') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'moveO') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'win') {
        const now = ctx.currentTime;
        const playNote = (freq, start, duration) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.08, start);
          g.gain.exponentialRampToValueAtTime(0.005, start + duration);
          o.start(start); o.stop(start + duration);
        };
        playNote(261.63, now, 0.15);
        playNote(329.63, now + 0.1, 0.15);
        playNote(523.25, now + 0.2, 0.4);
      } else if (type === 'draw') {
        const now = ctx.currentTime;
        const playNote = (freq, start, duration) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.08, start);
          g.gain.exponentialRampToValueAtTime(0.01, start + duration);
          o.start(start); o.stop(start + duration);
        };
        playNote(293.66, now, 0.2);
        playNote(220.00, now + 0.15, 0.4);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    }

    function toggleMute() {
      isMuted = !isMuted;
      const icon = document.getElementById('sound-icon');
      if (isMuted) {
        icon.innerHTML = '<line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"></line><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>';
      } else {
        icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
        playSound('click');
      }
    }

    function toggleTheme() {
      document.body.classList.toggle('dark');
      playSound('click');
    }

    // Winning sequences
    const WINNING_COMBOS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner(boardState) {
      for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
          return { winner: boardState[a], line: combo };
        }
      }
      const isDraw = boardState.every(cell => cell !== null);
      return { winner: null, line: null, isDraw };
    }

    // AI Minimax logic
    function getAIMove() {
      const difficulty = document.getElementById('difficulty').value;
      const emptySpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

      if (emptySpots.length === 0) return -1;

      if (difficulty === 'easy') {
        return emptySpots[Math.floor(Math.random() * emptySpots.length)];
      }

      if (difficulty === 'medium') {
        const shouldBeSmart = Math.random() < 0.6;
        if (shouldBeSmart) {
          // Try to win
          for (let index of emptySpots) {
            let copy = [...board]; copy[index] = 'O';
            if (checkWinner(copy).winner === 'O') return index;
          }
          // Try to block
          for (let index of emptySpots) {
            let copy = [...board]; copy[index] = 'X';
            if (checkWinner(copy).winner === 'X') return index;
          }
          if (board[4] === null) return 4;
        }
        return emptySpots[Math.floor(Math.random() * emptySpots.length)];
      }

      // Hard mode (Minimax)
      if (emptySpots.length === 9) return 4; // Center is optimal
      
      let bestScore = -Infinity;
      let move = -1;

      for (let index of emptySpots) {
        board[index] = 'O';
        let score = minimax(board, 0, false);
        board[index] = null;
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
      return move;
    }

    function minimax(tempBoard, depth, isMaximizing) {
      const result = checkWinner(tempBoard);
      if (result.winner === 'O') return 10 - depth;
      if (result.winner === 'X') return -10 + depth;
      if (result.isDraw) return 0;

      const emptySpots = tempBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let index of emptySpots) {
          tempBoard[index] = 'O';
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[index] = null;
          bestScore = Math.max(score, bestScore);
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let index of emptySpots) {
          tempBoard[index] = 'X';
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[index] = null;
          bestScore = Math.min(score, bestScore);
        }
        return bestScore;
      }
    }

    // UI Updates
    function updateNames() {
      names.X = document.getElementById('name-x').value.trim() || 'Player X';
      names.O = gameMode === 'ai' ? 'AI Bot' : (document.getElementById('name-o').value.trim() || 'Player O');
      
      document.getElementById('lbl-x').textContent = names.X;
      document.getElementById('lbl-o').textContent = names.O;
      updateStatus();
    }

    function setMode(mode) {
      gameMode = mode;
      playSound('click');
      document.getElementById('btn-mode-local').classList.toggle('active', mode === 'local');
      document.getElementById('btn-mode-ai').classList.toggle('active', mode === 'ai');

      document.getElementById('group-o').style.display = mode === 'local' ? 'flex' : 'none';
      document.getElementById('group-difficulty').style.display = mode === 'ai' ? 'flex' : 'none';

      resetScores();
    }

    function drawCell(index, symbol) {
      const cell = document.getElementById(\`cell-\${index}\`);
      cell.disabled = true;

      if (symbol === 'X') {
        cell.innerHTML = \`<div class="shape-x">
          <svg viewBox="0 0 100 100" fill="none" stroke-width="15" stroke-linecap="round">
            <line class="draw-stroke" x1="15" y1="15" x2="85" y2="85"></line>
            <line class="draw-stroke" x1="85" y1="15" x2="15" y2="85" style="animation-delay: 0.1s;"></line>
          </svg>
        </div>\`;
        playSound('moveX');
      } else {
        cell.innerHTML = \`<div class="shape-o">
          <svg viewBox="0 0 100 100" fill="none" stroke-width="15" stroke-linecap="round">
            <circle class="draw-stroke" cx="50" cy="50" r="35"></circle>
          </svg>
        </div>\`;
        playSound('moveO');
      }
    }

    function cellClick(index) {
      if (isGameOver || board[index] !== null) return;

      board[index] = currentTurn;
      drawCell(index, currentTurn);

      const state = checkWinner(board);
      if (state.winner) {
        handleWin(state.winner, state.line);
        return;
      }
      if (state.isDraw) {
        handleDraw();
        return;
      }

      currentTurn = currentTurn === 'X' ? 'O' : 'X';
      updateStatus();

      if (gameMode === 'ai' && currentTurn === 'O') {
        disableBoard(true);
        setTimeout(() => {
          const aiMove = getAIMove();
          if (aiMove !== -1) {
            board[aiMove] = 'O';
            drawCell(aiMove, 'O');
            
            const aiState = checkWinner(board);
            if (aiState.winner) {
              handleWin(aiState.winner, aiState.line);
              disableBoard(false);
              return;
            }
            if (aiState.isDraw) {
              handleDraw();
              disableBoard(false);
              return;
            }
            currentTurn = 'X';
            updateStatus();
          }
          disableBoard(false);
        }, 400);
      }
    }

    function disableBoard(disable) {
      for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(\`cell-\${i}\`);
        if (board[i] === null) {
          cell.disabled = disable;
        }
      }
    }

    function handleWin(winner, line) {
      isGameOver = true;
      winningLine = line;
      scores[winner]++;
      document.getElementById(\`score-\${winner.toLowerCase()}\`).textContent = scores[winner];
      
      line.forEach(index => {
        document.getElementById(\`cell-\${index}\`).classList.add('winning');
      });

      playSound('win');
      updateStatus();
    }

    function handleDraw() {
      isGameOver = true;
      scores.draws++;
      document.getElementById('score-draws').textContent = scores.draws;
      playSound('draw');
      updateStatus();
    }

    function updateStatus() {
      const parent = document.getElementById('status-container');
      
      if (!isGameOver) {
        const name = currentTurn === 'X' ? names.X : names.O;
        const colorClass = currentTurn === 'X' ? 'x' : 'o';
        parent.innerHTML = \`<div class="badge-turn">
          <span>TURN</span>
          <div class="badge-active \${colorClass}">\${currentTurn} \${name}</div>
        </div>\`;
      } else {
        if (winningLine) {
          const winnerName = board[winningLine[0]] === 'X' ? names.X : names.O;
          parent.innerHTML = \`<div class="alert-banner win">
            <h4 style="font-weight: 800; font-size: 16px;">\${winnerName} Wins!</h4>
            <button class="btn-action" style="margin-top: 12px;" onclick="resetGame()">Play Again</button>
          </div>\`;
        } else {
          parent.innerHTML = \`<div class="alert-banner draw">
            <h4 style="font-weight: 800; font-size: 16px;">It's a Draw!</h4>
            <button class="btn-action" style="margin-top: 12px; background: #64748b" onclick="resetGame()">Play Again</button>
          </div>\`;
        }
      }
    }

    function resetGame() {
      board = Array(9).fill(null);
      currentTurn = 'X';
      isGameOver = false;
      winningLine = null;

      // Render grid cells
      const grid = document.getElementById('board-grid');
      grid.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        grid.innerHTML += \`<button class="cell" id="cell-\${i}" onclick="cellClick(\${i})"></button>\`;
      }

      updateStatus();
    }

    function resetScores() {
      scores = { X: 0, O: 0, draws: 0 };
      document.getElementById('score-x').textContent = '0';
      document.getElementById('score-o').textContent = '0';
      document.getElementById('score-draws').textContent = '0';
      resetGame();
    }

    // Initialize
    updateNames();
    resetGame();
  </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    playClickSound();
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tic-tac-toe.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div id="html-exporter-sec" className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
      <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
        <FileCode className="h-5 w-5 animate-pulse" />
        <span className="text-xs font-extrabold uppercase tracking-wider">
          Portable Offline File
        </span>
      </div>
      <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 -mt-1 leading-relaxed">
        Want to run this game offline? Download it as a single high-fidelity, interactive HTML file containing all logic, Minimax AI rules, and synthesized sound effects!
      </p>
      <button
        onClick={handleDownload}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 w-full rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
          downloaded
            ? 'bg-emerald-600 text-white shadow-emerald-500/10'
            : 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 active:scale-98'
        }`}
      >
        {downloaded ? (
          <>
            <Check className="h-4 w-4" />
            Downloaded to 'tic-tac-toe.html'!
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download Standalone HTML Game
          </>
        )}
      </button>
    </div>
  );
}
