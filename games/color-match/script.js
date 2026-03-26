// Color Match Memory Game - JavaScript

// Game State
const state = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  moves: 0,
  time: 0,
  timerInterval: null,
  isGameActive: false,
  difficulty: 'easy',
  difficultyLevels: {
    easy: { rows: 3, cols: 4, pairs: 6 },
    medium: { rows: 4, cols: 4, pairs: 8 },
    hard: { rows: 4, cols: 6, pairs: 12 }
  }
};

// Shapes and Colors
const shapes = ['●', '★', '▲', '■', '♥', '♦'];
const colors = [
  { name: 'red', class: 'shape-red' },
  { name: 'blue', class: 'shape-blue' },
  { name: 'green', class: 'shape-green' },
  { name: 'yellow', class: 'shape-yellow' },
  { name: 'purple', class: 'shape-purple' },
  { name: 'orange', class: 'shape-orange' }
];

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const celebrationModal = document.getElementById('celebration-modal');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');
const confettiContainer = document.createElement('div');
confettiContainer.id = 'confetti-container';
document.body.appendChild(confettiContainer);

// Audio Context (Web Audio API)
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Sound Effects
function playSound(type) {
  if (!audioContext) return;
  if (SoundToggle.isMuted()) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case 'flip':
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
    
    case 'match':
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Play a second tone for harmony
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 800;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }, 100);
      break;
    
    case 'wrong':
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    
    case 'win':
      // Play a victory melody
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
  resetState();
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
    HelpModal.show('🎨', 'Flip cards to find matching pairs! Find all the pairs to win!');
  });
  
  // Show help on first visit
  HelpModal.showIfFirstTime('color-match', '🎨', 'Flip cards to find matching pairs! Find all the pairs to win!');
}

function resetState() {
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.time = 0;
  state.isGameActive = false;
  
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  
  timerDisplay.textContent = '0s';
  movesDisplay.textContent = '0';
  celebrationModal.classList.add('hidden');
  confettiContainer.innerHTML = '';
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
  
  // Set default active button
  document.querySelector('[data-level="easy"]').classList.add('active');
}

function setupRestartButton() {
  restartBtn.addEventListener('click', () => {
    startGame();
  });
}

function setupPlayAgainButton() {
  playAgainBtn.addEventListener('click', () => {
    celebrationModal.classList.add('hidden');
    startGame();
  });
}

function startGame() {
  resetState();
  const level = state.difficultyLevels[state.difficulty];
  state.totalPairs = level.pairs;
  state.isGameActive = true;
  
  // Generate cards
  generateCards(level);
  
  // Start timer
  state.timerInterval = setInterval(() => {
    state.time++;
    timerDisplay.textContent = `${state.time}s`;
  }, 1000);
}

function generateCards(level) {
  gameGrid.innerHTML = '';
  gameGrid.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
  
  // Create pairs
  const cardPairs = [];
  const availableShapes = shapes.slice(0, level.pairs);
  const availableColors = colors.slice(0, level.pairs);
  
  for (let i = 0; i < level.pairs; i++) {
    const shape = availableShapes[i % availableShapes.length];
    const color = availableColors[i % availableColors.length];
    
    // Create two cards for each pair
    cardPairs.push({ shape, color, id: `card-${i}-a` });
    cardPairs.push({ shape, color, id: `card-${i}-b` });
  }
  
  // Shuffle cards
  shuffleArray(cardPairs);
  
  // Create card elements
  cardPairs.forEach((cardData, index) => {
    const card = createCardElement(cardData, index);
    gameGrid.appendChild(card);
  });
}

function createCardElement(cardData, index) {
  const card = document.createElement('div');
  card.className = 'card-game';
  card.dataset.index = index;
  card.dataset.shape = cardData.shape;
  card.dataset.color = cardData.color.name;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Face down card');
  
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front ${cardData.color.class}">${cardData.shape}</div>
      <div class="card-back"></div>
    </div>
  `;
  
  card.addEventListener('click', () => handleCardClick(card));
  
  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleCardClick(card) {
  if (!state.isGameActive) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (state.flippedCards.length >= 2) return;
  
  // Flip the card
  card.classList.add('flipped');
  card.setAttribute('aria-label', `Card showing ${card.dataset.shape} in ${card.dataset.color}`);
  playSound('flip');
  
  state.flippedCards.push(card);
  
  // Check for match when two cards are flipped
  if (state.flippedCards.length === 2) {
    state.moves++;
    movesDisplay.textContent = state.moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = state.flippedCards;
  const isMatch = card1.dataset.shape === card2.dataset.shape && 
                  card1.dataset.color === card2.dataset.color;
  
  if (isMatch) {
    handleMatch(card1, card2);
  } else {
    handleMismatch(card1, card2);
  }
}

function handleMatch(card1, card2) {
  playSound('match');
  createSparkles(card1);
  createSparkles(card2);
  
  card1.classList.add('matched');
  card2.classList.add('matched');
  card1.setAttribute('aria-label', `Matched pair: ${card1.dataset.shape} in ${card1.dataset.color}`);
  card2.setAttribute('aria-label', `Matched pair: ${card2.dataset.shape} in ${card2.dataset.color}`);
  
  state.matchedPairs++;
  state.flippedCards = [];
  
  // Check for win
  if (state.matchedPairs === state.totalPairs) {
    handleWin();
  }
}

function handleMismatch(card1, card2) {
  playSound('wrong');
  
  setTimeout(() => {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.setAttribute('aria-label', 'Face down card');
    card2.setAttribute('aria-label', 'Face down card');
    state.flippedCards = [];
  }, 1000);
}

function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;
    
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    
    sparkle.style.transform = `translate(${translateX}px, ${translateY}px)`;
    sparkle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    confettiContainer.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }
}

function handleWin() {
  state.isGameActive = false;
  clearInterval(state.timerInterval);
  
  // Check and save high score (lower moves is better)
  const difficulty = state.difficulty;
  const metricKey = `moves-${difficulty}`;
  const isNewRecord = HighScore.set('color-match', metricKey, state.moves, 'low');
  
  playSound('win');
  createConfetti();
  
  setTimeout(() => {
    finalTimeDisplay.textContent = `${state.time}s`;
    finalMovesDisplay.textContent = state.moves;
    
    // Display best score
    const bestMovesDisplay = document.getElementById('best-moves-display');
    const bestScore = HighScore.get('color-match', metricKey);
    if (bestScore !== null) {
      const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      if (isNewRecord && state.moves === bestScore) {
        bestMovesDisplay.textContent = `🏆 New Record! Best (${difficultyLabel}): ${bestScore} moves`;
        bestMovesDisplay.style.color = 'var(--color-red)';
        bestMovesDisplay.style.fontWeight = 'bold';
      } else {
        bestMovesDisplay.textContent = `Best (${difficultyLabel}): ${bestScore} moves`;
        bestMovesDisplay.style.color = 'var(--text-light)';
        bestMovesDisplay.style.fontWeight = 'normal';
      }
    } else {
      bestMovesDisplay.textContent = '';
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
      
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 50);
  }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initGame);
