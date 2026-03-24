// Maze Runner - Game Logic
// Follows GR-5: Technical Requirements

// ===== Maze Data =====
const mazes = [
  // Maze 1 - Simple 3x3
  {
    grid: [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,1,1,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ],
    start: {x: 2, y: 3},
    goal: {x: 2, y: 1},
    stars: [{x: 1, y: 3}, {x: 3, y: 1}]
  },
  // Maze 2 - Simple 3x3
  {
    grid: [
      [1,1,1,1,1],
      [1,0,1,0,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ],
    start: {x: 1, y: 3},
    goal: {x: 3, y: 1},
    stars: [{x: 1, y: 1}, {x: 3, y: 3}]
  },
  // Maze 3 - Simple 3x3
  {
    grid: [
      [1,0,0,0,1],
      [1,1,1,0,1],
      [1,0,0,0,1],
      [1,0,1,1,1],
      [1,1,1,1,1]
    ],
    start: {x: 1, y: 0},
    goal: {x: 3, y: 2},
    stars: [{x: 2, y: 0}, {x: 1, y: 2}]
  },
  // Maze 4 - 5x5 with one dead end
  {
    grid: [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,1,0,1],
      [1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 5},
    goal: {x: 5, y: 1},
    stars: [{x: 3, y: 5}, {x: 5, y: 3}, {x: 1, y: 1}]
  },
  // Maze 5 - 5x5
  {
    grid: [
      [1,1,1,1,1,1,1],
      [1,0,0,1,0,0,1],
      [1,0,0,1,0,0,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 5},
    goal: {x: 5, y: 1},
    stars: [{x: 3, y: 3}, {x: 1, y: 3}, {x: 5, y: 5}]
  },
  // Maze 6 - 5x5
  {
    grid: [
      [1,1,1,1,1,1,1],
      [1,0,0,0,1,0,1],
      [1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1],
      [1,0,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 5},
    goal: {x: 5, y: 1},
    stars: [{x: 3, y: 1}, {x: 1, y: 3}, {x: 5, y: 3}]
  },
  // Maze 7 - 7x7 complex
  {
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1],
      [1,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 7},
    goal: {x: 7, y: 1},
    stars: [{x: 3, y: 7}, {x: 7, y: 3}, {x: 1, y: 5}, {x: 5, y: 5}]
  },
  // Maze 8 - 7x7 complex
  {
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,1,0,0,0,0,1],
      [1,0,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,0,1],
      [1,1,1,0,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 7},
    goal: {x: 7, y: 1},
    stars: [{x: 5, y: 7}, {x: 1, y: 3}, {x: 7, y: 5}, {x: 3, y: 1}]
  },
  // Maze 9 - 9x9 complex
  {
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,1,0,0,1],
      [1,0,1,0,1,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 9},
    goal: {x: 9, y: 1},
    stars: [{x: 5, y: 9}, {x: 9, y: 5}, {x: 1, y: 3}, {x: 5, y: 5}, {x: 9, y: 9}]
  },
  // Maze 10 - 9x9 complex
  {
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,0,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: {x: 1, y: 9},
    goal: {x: 9, y: 1},
    stars: [{x: 3, y: 9}, {x: 7, y: 9}, {x: 9, y: 3}, {x: 1, y: 7}, {x: 5, y: 5}]
  }
];

// Character goals
const characterGoals = {
  bunny: { emoji: '🥕', name: 'Carrot' },
  puppy: { emoji: '🦴', name: 'Bone' },
  kitty: { emoji: '🐟', name: 'Fish' }
};

// ===== State =====
let selectedCharacter = null;
let currentMazeIndex = 0;
let playerPos = {x: 0, y: 0};
let starsCollected = 0;
let collectedStars = [];
let timerInterval = null;
let startTime = null;
let isDragging = false;

// ===== Canvas Setup =====
const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');
let cellSize = 0;

// ===== DOM Elements =====
const characterSelectScreen = document.getElementById('character-select-screen');
const gameScreen = document.getElementById('game-screen');
const characterBtns = document.querySelectorAll('.character-btn');
const startBtn = document.getElementById('start-btn');
const currentMazeEl = document.getElementById('current-maze');
const totalMazesEl = document.getElementById('total-mazes');
const starsCollectedEl = document.getElementById('stars-collected');
const timerEl = document.getElementById('timer');
const arrowBtns = document.querySelectorAll('.arrow-btn');
const completionScreen = document.getElementById('completion-screen');
const finalStarsEl = document.getElementById('final-stars');
const nextBtn = document.getElementById('next-btn');

// ===== Character Selection =====
characterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    characterBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCharacter = btn.dataset.character;
    startBtn.disabled = false;
    playSound('pop');
  });
});

startBtn.addEventListener('click', () => {
  characterSelectScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startMaze(currentMazeIndex);
});

// ===== Maze Setup =====
function startMaze(index) {
  if (index >= mazes.length) {
    // Game complete - all mazes done
    showCompletion(true);
    return;
  }

  currentMazeIndex = index;
  const maze = mazes[index];
  playerPos = {...maze.start};
  starsCollected = 0;
  collectedStars = [];
  
  currentMazeEl.textContent = index + 1;
  totalMazesEl.textContent = mazes.length;
  updateStarsDisplay();
  startTimer();
  resizeCanvas();
  drawMaze();
  completionScreen.classList.add('hidden');
}

function resizeCanvas() {
  const container = canvas.parentElement;
  const size = Math.min(container.clientWidth, 600);
  const maze = mazes[currentMazeIndex];
  const gridSize = maze.grid.length;
  cellSize = Math.floor((size - 40) / gridSize);
  canvas.width = cellSize * gridSize + 40;
  canvas.height = cellSize * gridSize + 40;
  drawMaze();
}

window.addEventListener('resize', resizeCanvas);

// ===== Drawing =====
function drawMaze() {
  const maze = mazes[currentMazeIndex];
  const goal = characterGoals[selectedCharacter];
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw maze cells
  for (let y = 0; y < maze.grid.length; y++) {
    for (let x = 0; x < maze.grid[y].length; x++) {
      const cellX = 20 + x * cellSize;
      const cellY = 20 + y * cellSize;
      
      if (maze.grid[y][x] === 1) {
        // Wall
        ctx.fillStyle = '#666';
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      } else {
        // Path
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
      }
    }
  }
  
  // Draw stars
  maze.stars.forEach((star, i) => {
    if (!collectedStars.includes(i)) {
      const starX = 20 + star.x * cellSize + cellSize / 2;
      const starY = 20 + star.y * cellSize + cellSize / 2;
      drawStar(starX, starY, cellSize * 0.4);
    }
  });
  
  // Draw goal
  const goalX = 20 + maze.goal.x * cellSize + cellSize / 2;
  const goalY = 20 + maze.goal.y * cellSize + cellSize / 2;
  ctx.font = `${cellSize * 0.8}px "Comic Sans MS", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(goal.emoji, goalX, goalY);
  
  // Draw player
  const playerX = 20 + playerPos.x * cellSize + cellSize / 2;
  const playerY = 20 + playerPos.y * cellSize + cellSize / 2;
  const playerEmoji = selectedCharacter === 'bunny' ? '🐰' : 
                      selectedCharacter === 'puppy' ? '🐶' : '🐱';
  ctx.font = `${cellSize * 0.7}px "Comic Sans MS", sans-serif`;
  ctx.fillText(playerEmoji, playerX, playerY);
}

function drawStar(cx, cy, outerRadius) {
  const innerRadius = outerRadius * 0.5;
  const spikes = 5;
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===== Movement =====
function movePlayer(dx, dy) {
  const maze = mazes[currentMazeIndex];
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  
  // Check bounds
  if (newY < 0 || newY >= maze.grid.length || newX < 0 || newX >= maze.grid[0].length) {
    playSound('boop');
    return;
  }
  
  // Check wall collision
  if (maze.grid[newY][newX] === 1) {
    playSound('boop');
    return;
  }
  
  // Move player
  playerPos.x = newX;
  playerPos.y = newY;
  playSound('step');
  
  // Check star collection
  maze.stars.forEach((star, i) => {
    if (star.x === newX && star.y === newY && !collectedStars.includes(i)) {
      collectedStars.push(i);
      starsCollected++;
      updateStarsDisplay();
      playSound('star');
    }
  });
  
  // Check goal
  if (newX === maze.goal.x && newY === maze.goal.y) {
    completeMaze();
  }
  
  drawMaze();
}

// Arrow controls
arrowBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const direction = btn.dataset.direction;
    switch(direction) {
      case 'up': movePlayer(0, -1); break;
      case 'down': movePlayer(0, 1); break;
      case 'left': movePlayer(-1, 0); break;
      case 'right': movePlayer(1, 0); break;
    }
  });
});

// Drag controls
let dragStartPos = null;

canvas.addEventListener('mousedown', handleDragStart);
canvas.addEventListener('touchstart', handleDragStart, {passive: false});

canvas.addEventListener('mousemove', handleDragMove);
canvas.addEventListener('touchmove', handleDragMove, {passive: false});

canvas.addEventListener('mouseup', handleDragEnd);
canvas.addEventListener('touchend', handleDragEnd);

function handleDragStart(e) {
  e.preventDefault();
  isDragging = true;
  const pos = getCanvasPosition(e);
  dragStartPos = pos;
}

function handleDragMove(e) {
  if (!isDragging) return;
  e.preventDefault();
}

function handleDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  
  const pos = getCanvasPosition(e);
  if (!dragStartPos) return;
  
  const dx = pos.x - dragStartPos.x;
  const dy = pos.y - dragStartPos.y;
  
  // Determine primary direction
  if (Math.abs(dx) > Math.abs(dy)) {
    movePlayer(dx > 0 ? 1 : -1, 0);
  } else {
    movePlayer(0, dy > 0 ? 1 : -1);
  }
  
  dragStartPos = null;
}

function getCanvasPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  if (e.touches && e.touches.length > 0) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  }
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

// ===== Game Logic =====
function completeMaze() {
  stopTimer();
  playSound('celebration');
  finalStarsEl.textContent = starsCollected;
  setTimeout(() => {
    completionScreen.classList.remove('hidden');
  }, 500);
}

nextBtn.addEventListener('click', () => {
  startMaze(currentMazeIndex + 1);
});

function updateStarsDisplay() {
  starsCollectedEl.textContent = starsCollected;
}

// ===== Timer =====
function startTimer() {
  stopTimer();
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ===== Audio =====
function playSound(type) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'pop':
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
      
    case 'step':
      oscillator.frequency.value = 300;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
      
    case 'star':
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'boop':
      oscillator.frequency.value = 150;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
      
    case 'celebration':
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.4);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.4);
      });
      break;
  }
}

function showCompletion(allDone) {
  if (allDone) {
    // All mazes complete
    finalStarsEl.textContent = starsCollected;
    completionScreen.classList.remove('hidden');
    document.querySelector('.completion-message h2').textContent = '🎉 Amazing! All Mazes Complete! 🎉';
    nextBtn.textContent = 'Play Again';
    nextBtn.onclick = () => {
      currentMazeIndex = 0;
      selectedCharacter = null;
      characterBtns.forEach(b => b.classList.remove('selected'));
      startBtn.disabled = true;
      gameScreen.classList.add('hidden');
      characterSelectScreen.classList.remove('hidden');
      completionScreen.classList.add('hidden');
      document.querySelector('.completion-message h2').textContent = '🎉 You did it! 🎉';
      nextBtn.textContent = 'Next Maze →';
      nextBtn.onclick = () => startMaze(currentMazeIndex + 1);
    };
  }
}

// ===== Initialize =====
resizeCanvas();
