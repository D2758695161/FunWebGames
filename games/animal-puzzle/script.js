// Animal Puzzle Game - JavaScript

// Game State
const state = {
  pieces: [],
  placedPieces: 0,
  totalPieces: 0,
  currentAnimal: null,
  difficulty: 'easy',
  difficultyLevels: {
    easy: { rows: 2, cols: 3, pieces: 6 },
    medium: { rows: 3, cols: 3, pieces: 9 },
    hard: { rows: 3, cols: 4, pieces: 12 }
  },
  isDragging: false,
  draggedPiece: null,
  dragOffset: { x: 0, y: 0 },
  time: 0,
  timerInterval: null
};

// Animal Data with SVG paths
const animals = [
  {
    name: 'Cat',
    emoji: '🐱',
    color: '#FFB6C1',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#FFB6C1"/>
      <polygon points="20,25 30,5 40,25" fill="#FFB6C1"/>
      <polygon points="60,25 70,5 80,25" fill="#FFB6C1"/>
      <ellipse cx="35" cy="45" rx="8" ry="10" fill="#333"/>
      <ellipse cx="65" cy="45" rx="8" ry="10" fill="#333"/>
      <circle cx="37" cy="43" r="3" fill="#FFF"/>
      <circle cx="67" cy="43" r="3" fill="#FFF"/>
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#FF69B4"/>
      <path d="M 45 62 Q 50 67 55 62" stroke="#333" stroke-width="2" fill="none"/>
      <line x1="20" y1="50" x2="40" y2="52" stroke="#333" stroke-width="2"/>
      <line x1="20" y1="55" x2="40" y2="55" stroke="#333" stroke-width="2"/>
      <line x1="20" y1="60" x2="40" y2="58" stroke="#333" stroke-width="2"/>
      <line x1="60" y1="52" x2="80" y2="50" stroke="#333" stroke-width="2"/>
      <line x1="60" y1="55" x2="80" y2="55" stroke="#333" stroke-width="2"/>
      <line x1="60" y1="58" x2="80" y2="60" stroke="#333" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'Dog',
    emoji: '🐶',
    color: '#DEB887',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#DEB887"/>
      <ellipse cx="25" cy="40" rx="15" ry="20" fill="#DEB887"/>
      <ellipse cx="75" cy="40" rx="15" ry="20" fill="#DEB887"/>
      <ellipse cx="35" cy="45" rx="8" ry="10" fill="#333"/>
      <ellipse cx="65" cy="45" rx="8" ry="10" fill="#333"/>
      <circle cx="37" cy="43" r="3" fill="#FFF"/>
      <circle cx="67" cy="43" r="3" fill="#FFF"/>
      <ellipse cx="50" cy="55" rx="10" ry="8" fill="#333"/>
      <ellipse cx="50" cy="53" rx="6" ry="4" fill="#FFF"/>
      <path d="M 45 65 Q 50 70 55 65" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    name: 'Elephant',
    emoji: '🐘',
    color: '#A9A9A9',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#A9A9A9"/>
      <ellipse cx="20" cy="45" rx="20" ry="25" fill="#A9A9A9"/>
      <ellipse cx="80" cy="45" rx="20" ry="25" fill="#A9A9A9"/>
      <ellipse cx="35" cy="45" rx="6" ry="8" fill="#333"/>
      <ellipse cx="65" cy="45" rx="6" ry="8" fill="#333"/>
      <circle cx="37" cy="43" r="2" fill="#FFF"/>
      <circle cx="67" cy="43" r="2" fill="#FFF"/>
      <ellipse cx="50" cy="60" rx="8" ry="15" fill="#A9A9A9"/>
      <ellipse cx="50" cy="75" rx="10" ry="5" fill="#D3D3D3"/>
    </svg>`
  },
  {
    name: 'Panda',
    emoji: '🐼',
    color: '#FFF',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#FFF"/>
      <circle cx="25" cy="30" r="12" fill="#333"/>
      <circle cx="75" cy="30" r="12" fill="#333"/>
      <ellipse cx="35" cy="45" rx="8" ry="10" fill="#333"/>
      <ellipse cx="65" cy="45" rx="8" ry="10" fill="#333"/>
      <circle cx="37" cy="43" r="3" fill="#FFF"/>
      <circle cx="67" cy="43" r="3" fill="#FFF"/>
      <ellipse cx="50" cy="55" rx="8" ry="6" fill="#333"/>
      <path d="M 45 65 Q 50 68 55 65" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    name: 'Lion',
    emoji: '🦁',
    color: '#FFA500',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="35" fill="#FFA500"/>
      <circle cx="50" cy="50" r="45" fill="#FFD700" opacity="0.5"/>
      <ellipse cx="35" cy="45" rx="8" ry="10" fill="#333"/>
      <ellipse cx="65" cy="45" rx="8" ry="10" fill="#333"/>
      <circle cx="37" cy="43" r="3" fill="#FFF"/>
      <circle cx="67" cy="43" r="3" fill="#FFF"/>
      <ellipse cx="50" cy="55" rx="8" ry="6" fill="#333"/>
      <path d="M 45 65 Q 50 70 55 65" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    name: 'Giraffe',
    emoji: '🦒',
    color: '#FFD700',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#FFD700"/>
      <circle cx="30" cy="35" r="8" fill="#DAA520"/>
      <circle cx="70" cy="35" r="8" fill="#DAA520"/>
      <circle cx="35" cy="65" r="7" fill="#DAA520"/>
      <circle cx="65" cy="65" r="7" fill="#DAA520"/>
      <polygon points="30,15 35,5 40,15" fill="#DAA520"/>
      <polygon points="60,15 65,5 70,15" fill="#DAA520"/>
      <ellipse cx="35" cy="45" rx="6" ry="8" fill="#333"/>
      <ellipse cx="65" cy="45" rx="6" ry="8" fill="#333"/>
      <circle cx="37" cy="43" r="2" fill="#FFF"/>
      <circle cx="67" cy="43" r="2" fill="#FFF"/>
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#333"/>
    </svg>`
  }
];

// DOM Elements
const puzzleBoard = document.getElementById('puzzle-board');
const piecePool = document.getElementById('piece-pool');
const progressDisplay = document.getElementById('progress');
const timerDisplay = document.getElementById('timer');
const animalNameDisplay = document.getElementById('animal-name');
const restartBtn = document.getElementById('restart-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const celebrationModal = document.getElementById('celebration-modal');
const finalAnimalDisplay = document.getElementById('final-animal');
const finalTimeDisplay = document.getElementById('final-time-display');
const bestTimeDisplay = document.getElementById('best-time-display');
const playAgainBtn = document.getElementById('play-again-btn');
const confettiContainer = document.createElement('div');
confettiContainer.id = 'confetti-container';
document.body.appendChild(confettiContainer);

// Audio Context
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!audioContext) return;
  if (SoundToggle.isMuted()) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case 'lift':
      oscillator.frequency.value = 300;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
    
    case 'place':
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    
    case 'win':
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + 0.2);
        }, i * 150);
      });
      break;
  }
}

// Initialize Game
function initGame() {
  SoundToggle.init();
  initAudio();
  setupDifficultyButtons();
  setupRestartButton();
  setupPlayAgainButton();
  setupHelpButton();
  startGame();
}

// Help Button Setup
function setupHelpButton() {
  const helpBtn = document.getElementById('help-btn');
  if (!helpBtn) return;
  
  helpBtn.addEventListener('click', () => {
    HelpModal.show('🧩', 'Drag puzzle pieces to complete the animal picture!');
  });
  
  HelpModal.showIfFirstTime('animal-puzzle', '🧩', 'Drag puzzle pieces to complete the animal picture!');
}

function setupDifficultyButtons() {
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.level;
      startGame();
    });
  });
  
  document.querySelector('[data-level="easy"]').classList.add('active');
}

function setupRestartButton() {
  restartBtn.addEventListener('click', startGame);
}

function setupPlayAgainButton() {
  playAgainBtn.addEventListener('click', () => {
    celebrationModal.classList.add('hidden');
    startGame();
  });
}

function startGame() {
  state.placedPieces = 0;
  state.pieces = [];
  state.isDragging = false;
  state.draggedPiece = null;
  state.time = 0;
  
  // Clear existing timer
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
  
  celebrationModal.classList.add('hidden');
  puzzleBoard.classList.remove('animal-complete');
  confettiContainer.innerHTML = '';
  timerDisplay.textContent = '0s';
  
  // Select random animal
  state.currentAnimal = animals[Math.floor(Math.random() * animals.length)];
  animalNameDisplay.textContent = state.currentAnimal.name;
  finalAnimalDisplay.textContent = state.currentAnimal.name;
  
  const level = state.difficultyLevels[state.difficulty];
  state.totalPieces = level.pieces;
  
  updateProgress();
  generatePuzzle(level);
  
  // Start timer
  state.timerInterval = setInterval(() => {
    state.time++;
    timerDisplay.textContent = `${state.time}s`;
  }, 1000);
}

function updateProgress() {
  progressDisplay.textContent = `${state.placedPieces}/${state.totalPieces}`;
}

function generatePuzzle(level) {
  puzzleBoard.innerHTML = '';
  piecePool.innerHTML = '';
  piecePool.classList.remove('has-pieces');
  
  const { rows, cols } = level;
  const pieceWidth = 100 / cols;
  const pieceHeight = 100 / rows;
  
  // Create grid
  const grid = document.createElement('div');
  grid.className = 'piece-grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  puzzleBoard.appendChild(grid);
  
  // Create ghost outlines and pieces
  const pieces = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      
      // Ghost outline
      const ghost = document.createElement('div');
      ghost.className = 'ghost-outline';
      ghost.dataset.index = index;
      ghost.style.width = `${pieceWidth}%`;
      ghost.style.height = `${pieceHeight}%`;
      ghost.style.left = `${col * pieceWidth}%`;
      ghost.style.top = `${row * pieceHeight}%`;
      ghost.style.background = `url("data:image/svg+xml,${encodeURIComponent(state.currentAnimal.svg)}")`;
      ghost.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
      ghost.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
      grid.appendChild(ghost);
      
      // Puzzle piece
      const piece = createPuzzlePiece(index, row, col, rows, cols, pieceWidth, pieceHeight);
      pieces.push(piece);
    }
  }
  
  state.pieces = pieces;
  scatterPieces(pieces);
  piecePool.classList.add('has-pieces');
}

function createPuzzlePiece(index, row, col, rows, cols, pieceWidth, pieceHeight) {
  const piece = document.createElement('div');
  piece.className = 'puzzle-piece';
  piece.dataset.index = index;
  piece.dataset.row = row;
  piece.dataset.col = col;
  piece.style.width = `${pieceWidth}%`;
  piece.style.height = `${pieceHeight}%`;
  piece.style.background = `url("data:image/svg+xml,${encodeURIComponent(state.currentAnimal.svg)}")`;
  piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
  piece.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
  piece.style.borderRadius = 'var(--radius-sm)';
  piece.style.boxShadow = 'var(--shadow-sm)';
  
  // Pointer events for drag-and-drop
  piece.addEventListener('pointerdown', handlePointerDown);
  
  return piece;
}

function scatterPieces(pieces) {
  const poolRect = piecePool.getBoundingClientRect();
  
  pieces.forEach((piece, i) => {
    piecePool.appendChild(piece);
    
    // Random position within piece pool
    const maxOffsetX = poolRect.width - 60;
    const maxOffsetY = poolRect.height - 60;
    
    const randomX = Math.random() * maxOffsetX;
    const randomY = Math.random() * maxOffsetY;
    
    piece.style.left = `${randomX}px`;
    piece.style.top = `${randomY}px`;
    piece.style.position = 'absolute';
  });
}

function handlePointerDown(e) {
  e.preventDefault();
  
  const piece = e.currentTarget;
  if (piece.classList.contains('placed')) return;
  
  initAudio();
  playSound('lift');
  
  state.isDragging = true;
  state.draggedPiece = piece;
  piece.classList.add('dragging');
  
  const rect = piece.getBoundingClientRect();
  state.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  piece.setPointerCapture(e.pointerId);
  piece.addEventListener('pointermove', handlePointerMove);
  piece.addEventListener('pointerup', handlePointerUp);
}

function handlePointerMove(e) {
  if (!state.isDragging || !state.draggedPiece) return;
  e.preventDefault();
  
  const piece = state.draggedPiece;
  const poolRect = piecePool.getBoundingClientRect();
  const boardRect = puzzleBoard.getBoundingClientRect();
  
  // Calculate position relative to piece pool
  let newX = e.clientX - poolRect.left - state.dragOffset.x;
  let newY = e.clientY - poolRect.top - state.dragOffset.y;
  
  // Allow dragging over the board area
  if (newY < 0) {
    const boardRelativeY = e.clientY - boardRect.top;
    newY = boardRelativeY + (poolRect.height);
  }
  
  piece.style.left = `${newX}px`;
  piece.style.top = `${newY}px`;
}

function handlePointerUp(e) {
  if (!state.isDragging || !state.draggedPiece) return;
  
  const piece = state.draggedPiece;
  piece.classList.remove('dragging');
  piece.releasePointerCapture(e.pointerId);
  piece.removeEventListener('pointermove', handlePointerMove);
  piece.removeEventListener('pointerup', handlePointerUp);
  
  // Check if piece is over correct position
  const boardRect = puzzleBoard.getBoundingClientRect();
  const pieceRect = piece.getBoundingClientRect();
  const pieceCenter = {
    x: pieceRect.left + pieceRect.width / 2,
    y: pieceRect.top + pieceRect.height / 2
  };
  
  const index = parseInt(piece.dataset.index);
  const level = state.difficultyLevels[state.difficulty];
  const { rows, cols } = level;
  const pieceWidth = boardRect.width / cols;
  const pieceHeight = boardRect.height / rows;
  
  const targetRow = parseInt(piece.dataset.row);
  const targetCol = parseInt(piece.dataset.col);
  
  const targetX = boardRect.left + targetCol * pieceWidth + pieceWidth / 2;
  const targetY = boardRect.top + targetRow * pieceHeight + pieceHeight / 2;
  
  const distance = Math.sqrt(
    Math.pow(pieceCenter.x - targetX, 2) +
    Math.pow(pieceCenter.y - targetY, 2)
  );
  
  // Snap tolerance: ~20px
  if (distance < 50) {
    snapPieceToPosition(piece, targetRow, targetCol);
  }
  
  state.isDragging = false;
  state.draggedPiece = null;
}

function snapPieceToPosition(piece, row, col) {
  const level = state.difficultyLevels[state.difficulty];
  const { rows, cols } = level;
  const pieceWidth = 100 / cols;
  const pieceHeight = 100 / rows;
  
  piece.style.position = 'absolute';
  piece.style.left = `${col * pieceWidth}%`;
  piece.style.top = `${row * pieceHeight}%`;
  piece.style.width = `${pieceWidth}%`;
  piece.style.height = `${pieceHeight}%`;
  piece.classList.add('placed', 'correct');
  
  // Mark ghost as filled
  const ghost = puzzleBoard.querySelector(`.ghost-outline[data-index="${piece.dataset.index}"]`);
  if (ghost) {
    ghost.classList.add('filled');
  }
  
  playSound('place');
  state.placedPieces++;
  updateProgress();
  
  if (state.placedPieces === state.totalPieces) {
    handleWin();
  }
}

function handleWin() {
  // Stop timer
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
  
  // Check and save high score (lower time is better)
  const animal = state.currentAnimal.name.toLowerCase();
  const metricKey = `time-${animal}`;
  const isNewRecord = HighScore.set('animal-puzzle', metricKey, state.time, 'low');
  
  playSound('win');
  puzzleBoard.classList.add('animal-complete', 'animal-bounce');
  createConfetti();
  
  setTimeout(() => {
    finalTimeDisplay.textContent = `Time: ${state.time}s`;
    
    // Display best score
    const bestScore = HighScore.get('animal-puzzle', metricKey);
    if (bestScore !== null) {
      const animalLabel = state.currentAnimal.name;
      if (isNewRecord && state.time === bestScore) {
        bestTimeDisplay.textContent = `🏆 New Record! Best (${animalLabel}): ${bestScore}s`;
        bestTimeDisplay.style.color = 'var(--color-red)';
        bestTimeDisplay.style.fontWeight = 'bold';
      } else {
        bestTimeDisplay.textContent = `Best (${animalLabel}): ${bestScore}s`;
        bestTimeDisplay.style.color = 'var(--text-light)';
        bestTimeDisplay.style.fontWeight = 'normal';
      }
    } else {
      bestTimeDisplay.textContent = '';
    }
    
    celebrationModal.classList.remove('hidden');
  }, 500);
}

function createConfetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#DDA0DD', '#FFB347'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 50);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initGame);
