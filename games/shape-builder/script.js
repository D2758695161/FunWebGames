// Shape Builder Game - JavaScript
// Follows GR-4: Responsive & Touch, GR-3: Audio & Feedback

// ===== Game State =====
const state = {
  currentLevel: 0,
  shapesOnCanvas: [],
  isDragging: false,
  draggedElement: null,
  dragOffset: { x: 0, y: 0 },
  selectedShape: null,
  hintVisible: false,
  moves: 0,
  levels: []
};

// ===== Shape Definitions =====
const shapeTypes = [
  {
    name: 'square',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" fill="currentColor"/>
    </svg>`
  },
  {
    name: 'circle',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="currentColor"/>
    </svg>`
  },
  {
    name: 'triangle',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 90,90 10,90" fill="currentColor"/>
    </svg>`
  },
  {
    name: 'rectangle',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="25" width="80" height="50" fill="currentColor"/>
    </svg>`
  }
];

const colors = [
  { name: 'red', value: '#FF6B6B' },
  { name: 'blue', value: '#4ECDC4' },
  { name: 'yellow', value: '#FFE66D' },
  { name: 'green', value: '#95E1D3' },
  { name: 'purple', value: '#DDA0DD' },
  { name: 'orange', value: '#FFB347' }
];

// ===== Level Designs (8-10 levels) =====
const levelDesigns = [
  {
    name: 'House',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="100" width="100" height="80" fill="#4ECDC4"/>
      <polygon points="100,30 160,100 40,100" fill="#FF6B6B"/>
    </svg>`,
    shapes: [
      { type: 'square', color: colors[1].value, x: 50, y: 100, width: 100, height: 100, rotation: 0, correct: true },
      { type: 'triangle', color: colors[0].value, x: 40, y: 30, width: 120, height: 70, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Car',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="80" width="140" height="60" fill="#FFB347"/>
      <circle cx="60" cy="140" r="20" fill="#333"/>
      <circle cx="140" cy="140" r="20" fill="#333"/>
    </svg>`,
    shapes: [
      { type: 'rectangle', color: colors[3].value, x: 30, y: 80, width: 140, height: 60, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 60, y: 140, width: 40, height: 40, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 140, y: 140, width: 40, height: 40, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Tree',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="85" y="140" width="30" height="50" fill="#8B4513"/>
      <polygon points="100,20 150,100 50,100" fill="#228B22"/>
    </svg>`,
    shapes: [
      { type: 'rectangle', color: '#8B4513', x: 85, y: 140, width: 30, height: 50, rotation: 0, correct: true },
      { type: 'triangle', color: colors[3].value, x: 50, y: 20, width: 100, height: 80, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Boat',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,30 160,120 40,120" fill="#FFE66D"/>
      <rect x="60" y="120" width="80" height="30" fill="#8B4513"/>
    </svg>`,
    shapes: [
      { type: 'triangle', color: colors[2].value, x: 40, y: 30, width: 120, height: 90, rotation: 0, correct: true },
      { type: 'rectangle', color: '#8B4513', x: 60, y: 120, width: 80, height: 30, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Robot',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="80" height="70" fill="#A9A9A9"/>
      <rect x="50" y="110" width="100" height="60" fill="#A9A9A9"/>
      <circle cx="75" cy="65" r="10" fill="#4ECDC4"/>
      <circle cx="125" cy="65" r="10" fill="#4ECDC4"/>
    </svg>`,
    shapes: [
      { type: 'square', color: '#A9A9A9', x: 60, y: 40, width: 80, height: 70, rotation: 0, correct: true },
      { type: 'rectangle', color: '#A9A9A9', x: 50, y: 110, width: 100, height: 60, rotation: 0, correct: true },
      { type: 'circle', color: colors[1].value, x: 75, y: 65, width: 20, height: 20, rotation: 0, correct: true },
      { type: 'circle', color: colors[1].value, x: 125, y: 65, width: 20, height: 20, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Flower',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="30" fill="#FFD700"/>
      <circle cx="100" cy="50" r="25" fill="#FF6B6B"/>
      <circle cx="150" cy="100" r="25" fill="#FF6B6B"/>
      <circle cx="100" cy="150" r="25" fill="#FF6B6B"/>
      <circle cx="50" cy="100" r="25" fill="#FF6B6B"/>
      <rect x="95" y="130" width="10" height="60" fill="#228B22"/>
    </svg>`,
    shapes: [
      { type: 'circle', color: '#FFD700', x: 100, y: 100, width: 60, height: 60, rotation: 0, correct: true },
      { type: 'circle', color: colors[0].value, x: 100, y: 50, width: 50, height: 50, rotation: 0, correct: true },
      { type: 'circle', color: colors[0].value, x: 150, y: 100, width: 50, height: 50, rotation: 0, correct: true },
      { type: 'circle', color: colors[0].value, x: 100, y: 150, width: 50, height: 50, rotation: 0, correct: true },
      { type: 'circle', color: colors[0].value, x: 50, y: 100, width: 50, height: 50, rotation: 0, correct: true },
      { type: 'rectangle', color: '#228B22', x: 95, y: 130, width: 10, height: 60, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Snowman',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="140" r="40" fill="#FFF"/>
      <circle cx="100" cy="90" r="30" fill="#FFF"/>
      <circle cx="100" cy="55" r="25" fill="#FFF"/>
      <circle cx="95" cy="50" r="3" fill="#333"/>
      <circle cx="105" cy="50" r="3" fill="#333"/>
    </svg>`,
    shapes: [
      { type: 'circle', color: '#FFFFFF', x: 100, y: 140, width: 80, height: 80, rotation: 0, correct: true },
      { type: 'circle', color: '#FFFFFF', x: 100, y: 90, width: 60, height: 60, rotation: 0, correct: true },
      { type: 'circle', color: '#FFFFFF', x: 100, y: 55, width: 50, height: 50, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 95, y: 50, width: 6, height: 6, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 105, y: 50, width: 6, height: 6, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Rocket',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="60" width="40" height="80" fill="#A9A9A9"/>
      <polygon points="100,20 130,60 70,60" fill="#FF6B6B"/>
      <polygon points="70,140 80,140 80,160" fill="#FF6B6B"/>
      <polygon points="120,140 130,140 120,160" fill="#FF6B6B"/>
      <circle cx="100" cy="90" r="15" fill="#4ECDC4"/>
    </svg>`,
    shapes: [
      { type: 'rectangle', color: '#A9A9A9', x: 80, y: 60, width: 40, height: 80, rotation: 0, correct: true },
      { type: 'triangle', color: colors[0].value, x: 70, y: 20, width: 60, height: 40, rotation: 0, correct: true },
      { type: 'triangle', color: colors[0].value, x: 70, y: 140, width: 10, height: 20, rotation: 0, correct: true },
      { type: 'triangle', color: colors[0].value, x: 120, y: 140, width: 10, height: 20, rotation: 0, correct: true },
      { type: 'circle', color: colors[1].value, x: 100, y: 90, width: 30, height: 30, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Fish',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="60" ry="40" fill="#FFB347"/>
      <polygon points="160,100 190,80 190,120" fill="#FF6B6B"/>
      <circle cx="80" cy="90" r="8" fill="#333"/>
    </svg>`,
    shapes: [
      { type: 'circle', color: colors[3].value, x: 100, y: 100, width: 120, height: 80, rotation: 0, correct: true },
      { type: 'triangle', color: colors[0].value, x: 160, y: 80, width: 30, height: 40, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 80, y: 90, width: 16, height: 16, rotation: 0, correct: true }
    ]
  },
  {
    name: 'Butterfly',
    target: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="80" rx="30" ry="40" fill="#DDA0DD"/>
      <ellipse cx="130" cy="80" rx="30" ry="40" fill="#DDA0DD"/>
      <ellipse cx="70" cy="130" rx="25" ry="30" fill="#95E1D3"/>
      <ellipse cx="130" cy="130" rx="25" ry="30" fill="#95E1D3"/>
      <rect x="90" y="50" width="20" height="120" fill="#333"/>
      <circle cx="100" cy="45" r="10" fill="#333"/>
    </svg>`,
    shapes: [
      { type: 'circle', color: colors[4].value, x: 70, y: 80, width: 60, height: 80, rotation: 0, correct: true },
      { type: 'circle', color: colors[4].value, x: 130, y: 80, width: 60, height: 80, rotation: 0, correct: true },
      { type: 'circle', color: colors[3].value, x: 70, y: 130, width: 50, height: 60, rotation: 0, correct: true },
      { type: 'circle', color: colors[3].value, x: 130, y: 130, width: 50, height: 60, rotation: 0, correct: true },
      { type: 'rectangle', color: '#333333', x: 90, y: 50, width: 20, height: 120, rotation: 0, correct: true },
      { type: 'circle', color: '#333333', x: 100, y: 45, width: 20, height: 20, rotation: 0, correct: true }
    ]
  }
];

// ===== DOM Elements =====
let palette, canvas, targetDisplay, levelDisplay, trashZone, completionModal;

// ===== Initialization =====
function init() {
  // Cache DOM elements
  palette = document.getElementById('palette');
  canvas = document.getElementById('game-canvas');
  targetDisplay = document.getElementById('target-display');
  levelDisplay = document.getElementById('level-display');
  trashZone = document.getElementById('trash-zone');
  completionModal = document.getElementById('completion-modal');

  // Initialize levels
  state.levels = levelDesigns;

  // Setup event listeners
  setupPalette();
  setupCanvas();
  setupButtons();
  setupAudio();

  // Load first level
  loadLevel(0);

  console.log('Shape Builder initialized!');
}

// ===== Setup Functions =====
function setupPalette() {
  const grid = palette.querySelector('.palette-grid');
  grid.innerHTML = '';

  shapeTypes.forEach(shape => {
    colors.forEach(color => {
      const item = document.createElement('div');
      item.className = 'palette-item';
      item.dataset.shape = shape.name;
      item.dataset.color = color.value;
      item.style.color = color.value;
      item.innerHTML = shape.svg;
      
      // Pointer events for drag
      item.addEventListener('pointerdown', handlePalettePointerDown);
      
      grid.appendChild(item);
    });
  });
}

function setupCanvas() {
  // Canvas pointer events
  canvas.addEventListener('pointermove', handleCanvasPointerMove);
  canvas.addEventListener('pointerup', handleCanvasPointerUp);
  canvas.addEventListener('pointerleave', handleCanvasPointerUp);
  
  // Trash zone events
  trashZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    trashZone.classList.add('drag-over');
  });
  
  trashZone.addEventListener('dragleave', () => {
    trashZone.classList.remove('drag-over');
  });
  
  trashZone.addEventListener('drop', (e) => {
    e.preventDefault();
    trashZone.classList.remove('drag-over');
    if (state.selectedShape) {
      deleteShape(state.selectedShape);
    }
  });
}

function setupButtons() {
  document.getElementById('btn-restart').addEventListener('click', restartLevel);
  document.getElementById('btn-hint').addEventListener('click', toggleHint);
  document.getElementById('btn-next').addEventListener('click', nextLevel);
}

function setupAudio() {
  // Audio files would be in assets/sounds/
  // For now, using empty sources (sounds are optional per SB-5)
  document.getElementById('sound-lift').src = 'assets/sounds/lift.mp3';
  document.getElementById('sound-chime').src = 'assets/sounds/chime.mp3';
  document.getElementById('sound-boop').src = 'assets/sounds/boop.mp3';
  document.getElementById('sound-celebration').src = 'assets/sounds/celebration.mp3';
}

// ===== Level Management =====
function loadLevel(levelIndex) {
  state.currentLevel = levelIndex;
  state.shapesOnCanvas = [];
  state.hintVisible = false;
  state.moves = 0;
  
  const level = state.levels[levelIndex];
  
  // Update level display
  levelDisplay.textContent = `Level ${levelIndex + 1}/${state.levels.length}`;
  
  // Show target
  targetDisplay.innerHTML = level.target;
  
  // Clear canvas
  canvas.innerHTML = '';
  
  // Hide completion modal
  completionModal.classList.add('hidden');
  
  // Show grid (optional per SB-4)
  canvas.classList.add('grid-visible');
  
  console.log(`Loaded level ${levelIndex + 1}: ${level.name}`);
}

function restartLevel() {
  loadLevel(state.currentLevel);
  playSound('lift');
}

function nextLevel() {
  if (state.currentLevel < state.levels.length - 1) {
    loadLevel(state.currentLevel + 1);
    playSound('lift');
  } else {
    // Game complete!
    alert('🎉 Congratulations! You completed all levels!');
    loadLevel(0);
  }
}

// ===== Drag and Drop (Pointer Events) =====
function handlePalettePointerDown(e) {
  e.preventDefault();
  
  const paletteItem = e.currentTarget;
  const shapeType = paletteItem.dataset.shape;
  const color = paletteItem.dataset.color;
  
  // Create new shape on canvas
  const shape = createShapeOnCanvas(shapeType, color);
  
  // Start dragging
  state.isDragging = true;
  state.draggedElement = shape.element;
  state.selectedShape = shape;
  
  // Calculate offset
  const rect = canvas.getBoundingClientRect();
  state.dragOffset = {
    x: e.clientX - rect.left - shape.x,
    y: e.clientY - rect.top - shape.y
  };
  
  // Add dragging class
  shape.element.classList.add('dragging');
  
  playSound('lift');
}

function handleCanvasPointerMove(e) {
  if (!state.isDragging || !state.draggedElement) return;
  
  e.preventDefault();
  
  const rect = canvas.getBoundingClientRect();
  let newX = e.clientX - rect.left - state.dragOffset.x;
  let newY = e.clientY - rect.top - state.dragOffset.y;
  
  // Snap to 20px grid (SB-3)
  newX = Math.round(newX / 20) * 20;
  newY = Math.round(newY / 20) * 20;
  
  // Update shape position
  state.draggedElement.style.left = `${newX}px`;
  state.draggedElement.style.top = `${newY}px`;
  
  // Update state
  if (state.selectedShape) {
    state.selectedShape.x = newX;
    state.selectedShape.y = newY;
  }
}

function handleCanvasPointerUp(e) {
  if (!state.isDragging || !state.draggedElement) return;
  
  state.isDragging = false;
  state.draggedElement.classList.remove('dragging');
  
  // Check for correct placement
  checkShapePlacement(state.selectedShape);
  
  state.draggedElement = null;
}

// ===== Shape Creation =====
function createShapeOnCanvas(type, color) {
  const shapeDef = shapeTypes.find(s => s.name === type);
  if (!shapeDef) return null;
  
  const shape = {
    id: Date.now(),
    type: type,
    color: color,
    x: 50,
    y: 50,
    width: 80,
    height: 80,
    rotation: 0,
    correct: false,
    element: null
  };
  
  // Create DOM element
  const el = document.createElement('div');
  el.className = 'placed-shape';
  el.style.color = color;
  el.style.left = `${shape.x}px`;
  el.style.top = `${shape.y}px`;
  el.style.width = `${shape.width}px`;
  el.style.height = `${shape.height}px`;
  el.innerHTML = `
    <div class="shape-controls">
      <button class="btn-rotate" title="Rotate">🔄</button>
    </div>
    ${shapeDef.svg}
  `;
  
  // Rotate button
  el.querySelector('.btn-rotate').addEventListener('click', (e) => {
    e.stopPropagation();
    rotateShape(shape);
  });
  
  // Select on click
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    selectShape(shape);
  });
  
  canvas.appendChild(el);
  shape.element = el;
  state.shapesOnCanvas.push(shape);
  state.moves++;
  
  return shape;
}

function selectShape(shape) {
  // Deselect previous
  document.querySelectorAll('.placed-shape').forEach(el => {
    el.style.outline = 'none';
  });
  
  // Select new
  state.selectedShape = shape;
  shape.element.style.outline = '2px dashed var(--color-yellow)';
}

function rotateShape(shape) {
  shape.rotation = (shape.rotation + 90) % 360;
  shape.element.style.transform = `rotate(${shape.rotation}deg)`;
  playSound('lift');
}

function deleteShape(shape) {
  if (shape.element) {
    shape.element.remove();
  }
  state.shapesOnCanvas = state.shapesOnCanvas.filter(s => s.id !== shape.id);
  if (state.selectedShape === shape) {
    state.selectedShape = null;
  }
  playSound('boop');
}

// ===== Game Logic =====
function checkShapePlacement(shape) {
  const level = state.levels[state.currentLevel];
  
  // Find matching correct shape
  const correctShape = level.shapes.find(s => 
    s.type === shape.type &&
    Math.abs(s.x - shape.x) < 30 &&
    Math.abs(s.y - shape.y) < 30
  );
  
  if (correctShape) {
    // Snap to correct position
    shape.x = correctShape.x;
    shape.y = correctShape.y;
    shape.element.style.left = `${shape.x}px`;
    shape.element.style.top = `${shape.y}px`;
    shape.correct = true;
    
    // Visual feedback (SB-4)
    shape.element.classList.add('correct');
    setTimeout(() => shape.element.classList.remove('correct'), 500);
    
    playSound('chime');
    
    // Check level completion
    checkLevelCompletion();
  } else {
    playSound('boop');
  }
}

function checkLevelCompletion() {
  const level = state.levels[state.currentLevel];
  const placedCorrectly = state.shapesOnCanvas.filter(s => s.correct).length;
  const totalNeeded = level.shapes.filter(s => s.correct).length;
  
  if (placedCorrectly >= totalNeeded && totalNeeded > 0) {
    // Level complete!
    setTimeout(() => {
      showCompletion();
    }, 500);
  }
}

function showCompletion() {
  // Check and save high score (lower moves is better)
  const levelNum = state.currentLevel + 1;
  const metricKey = `moves-level-${levelNum}`;
  const isNewRecord = HighScore.set('shape-builder', metricKey, state.moves, 'low');
  
  // Display moves and best score
  const movesDisplay = document.getElementById('moves-display');
  const bestMovesDisplay = document.getElementById('best-moves-display');
  
  movesDisplay.textContent = `Moves: ${state.moves}`;
  
  const bestScore = HighScore.get('shape-builder', metricKey);
  if (bestScore !== null) {
    if (isNewRecord && state.moves === bestScore) {
      bestMovesDisplay.textContent = `🏆 New Record! Best: ${bestScore} moves`;
      bestMovesDisplay.style.color = 'var(--color-red)';
      bestMovesDisplay.style.fontWeight = 'bold';
    } else {
      bestMovesDisplay.textContent = `Best: ${bestScore} moves`;
      bestMovesDisplay.style.color = 'var(--text-light)';
      bestMovesDisplay.style.fontWeight = 'normal';
    }
  } else {
    bestMovesDisplay.textContent = '';
  }
  
  completionModal.classList.remove('hidden');
  playSound('celebration');
  createConfetti();
}

function toggleHint() {
  state.hintVisible = !state.hintVisible;
  
  if (state.hintVisible) {
    showHintOverlay();
  } else {
    hideHintOverlay();
  }
}

function showHintOverlay() {
  const level = state.levels[state.currentLevel];
  
  level.shapes.forEach(shape => {
    if (!shape.correct) return;
    
    const hint = document.createElement('div');
    hint.className = 'hint-shape';
    hint.style.left = `${shape.x}px`;
    hint.style.top = `${shape.y}px`;
    hint.style.width = `${shape.width}px`;
    hint.style.height = `${shape.height}px`;
    hint.dataset.target = 'hint';
    
    canvas.appendChild(hint);
  });
}

function hideHintOverlay() {
  document.querySelectorAll('[data-target="hint"]').forEach(el => el.remove());
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)].value;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
}

function playSound(name) {
  const audio = document.getElementById(`sound-${name}`);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Audio not loaded or user interaction required
      console.log(`Sound ${name} not available`);
    });
  }
}

// ===== Start Game =====
window.addEventListener('DOMContentLoaded', init);
