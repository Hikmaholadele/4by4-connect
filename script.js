const ROWS = 6;
const COLS = 6;
const CONNECT = 4;

const boardElement = document.getElementById("board");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const turnText = document.getElementById("turnText");
const playerDot = document.getElementById("playerDot");

const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");

const result = document.getElementById("result");
const resultText = document.getElementById("resultText");

let board = [];
let currentPlayer = 1;
let gameOver = false;
let scores = {
  1: 0,
  2: 0
};

function createBoard() {
  board = Array.from(
    { length: ROWS },
    () => Array(COLS).fill(0)
  );

  currentPlayer = 1;
  gameOver = false;

  result.classList.add("hidden");

  renderBoard();
  updateTurn();
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("button");

      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (board[row][col] === 1) {
        cell.classList.add("red");
      }

      if (board[row][col] === 2) {
        cell.classList.add("yellow");
      }

      cell.addEventListener("click", () => handleMove(row, col));

      boardElement.appendChild(cell);
    }
  }
}

function handleMove(row, col) {
    if (gameOver) {
      return;
    }
  
    // Find the lowest empty cell in the clicked column
    let dropRow = -1;
  
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        dropRow = r;
        break;
      }
    }
  
    // Column is full
    if (dropRow === -1) {
      return;
    }
  
    board[dropRow][col] = currentPlayer;
  
    const winningCells = findWinningCells(
      dropRow,
      col,
      currentPlayer
    );
  
    renderBoard();
  
    if (winningCells) {
      highlightWinner(winningCells);
      endGame(`Player ${currentPlayer} Wins!`);
      return;
    }
  
    if (isDraw()) {
      endGame("It's a Draw!");
      return;
    }
  
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  
    updateTurn();
  }
function findWinningCells(row, col, player) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0]    // vertical
  ];

  for (const [rowDirection, colDirection] of directions) {
    const cells = [[row, col]];

    collectDirection(
      row,
      col,
      rowDirection,
      colDirection,
      player,
      cells
    );

    collectDirection(
      row,
      col,
      -rowDirection,
      -colDirection,
      player,
      cells
    );

    if (cells.length >= CONNECT) {
      return cells;
    }
  }

  return null;
}

function collectDirection(
  row,
  col,
  rowDirection,
  colDirection,
  player,
  cells
) {
  let nextRow = row + rowDirection;
  let nextCol = col + colDirection;

  while (
    nextRow >= 0 &&
    nextRow < ROWS &&
    nextCol >= 0 &&
    nextCol < COLS &&
    board[nextRow][nextCol] === player
  ) {
    cells.push([nextRow, nextCol]);

    nextRow += rowDirection;
    nextCol += colDirection;
  }
}

function highlightWinner(cells) {
  cells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );

    if (cell) {
      cell.classList.add("winner");
    }
  });
}

function isDraw() {
  return board.every(row => row.every(cell => cell !== 0));
}

function endGame(message) {
  gameOver = true;

  if (message.includes("Wins")) {
    scores[currentPlayer]++;
    updateScores();
  }

  resultText.textContent = message;
  result.classList.remove("hidden");
}

function updateTurn() {
  turnText.textContent = `Player ${currentPlayer}`;

  playerDot.classList.toggle(
    "red",
    currentPlayer === 1
  );

  playerDot.classList.toggle(
    "yellow",
    currentPlayer === 2
  );
}

function updateScores() {
  score1Element.textContent = scores[1];
  score2Element.textContent = scores[2];
}

restartBtn.addEventListener("click", createBoard);
playAgainBtn.addEventListener("click", createBoard);

createBoard();