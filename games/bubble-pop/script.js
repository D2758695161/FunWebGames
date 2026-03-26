// Bubble Pop Game - JavaScript

// Game State
const state = {
  mode: null,
  bubbles: [],
  currentRound: 0,
  totalRounds: 10,
  score: 0,
  targetValue: null,
  isGameActive: false,
  spawnInterval: null,
  animationFrame: null,
  bubbleSpeed: 1,
  colors: [
    { name: 'red', class: 'bubble--red', hex: '#FF6B6B' },
    { name: 'blue', class: 'bubble--blue', hex: '#4ECDC4' },
    { name: 'green', class: 'bubble--green', hex: '#95E1D3' },
    { name: 'yellow', class: 'bubble--yellow', hex: '#FFE66D' },
    { name: 'purple', class: 'bubble--purple', hex: '#DDA0DD' },
    { name: 'orange', class: 'bubble--orange', hex: '#FFB347' }
  ]
};

// DOM Elements
const modeSelector = document.getElementById('mode-selector');
const gameUI = document.getElementById('game-ui');
const modeBtns = document.querySelectorAll('.mode-btn');
const promptText = document.getElementById('prompt-text');
const scoreStars = document.getElementById('score-stars');
const roundDisplay = document.getElementById('round-display');
const restartBtn = document.getElementById('restart-btn');
const bubbleContainer = document.getElementById('bubble-container');
const celebrationModal = document.getElementById('celebration-modal');
const finalScoreDisplay = document.getElementById('final-score');
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
    case 'pop':
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
    
    case 'correct':
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    
    case 'wrong':
      oscillator.frequency.value = 300;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
    
    case 'round':
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + 0.15);
        }, i * 100);
      });
      break;
    
    case 'win':
      const winNotes = [523, 659, 784, 1047];
      winNotes.forEach((freq, i) => {
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
  setupModeSelector();
  setupRestartButton();
  setupPlayAgainButton();
  setupHelpButton();
}

// Help Button Setup
function setupHelpButton() {
  const helpBtn = document.getElementById('help-btn');
  if (!helpBtn) return;
  
  helpBtn.addEventListener('click', () => {
    HelpModal.show('🫧', 'Pop the bubbles that match the picture!');
  });
  
  HelpModal.showIfFirstTime('bubble-pop', '🫧', 'Pop the bubbles that match the picture!');
}

function setupModeSelector() {
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      startGame();
    });
  });
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
  if (!state.mode) return;
  
  // Reset state
  state.bubbles = [];
  state.currentRound = 0;
  state.score = 0;
  state.isGameActive = true;
  state.bubbleSpeed = 1;
  
  // Clear container
  bubbleContainer.innerHTML = '';
  confettiContainer.innerHTML = '';
  
  // Show game UI
  modeSelector.classList.add('hidden');
  gameUI.classList.remove('hidden');
  celebrationModal.classList.add('hidden');
  
  // Initialize score stars
  updateScoreStars();
  
  // Start first round
  nextRound();
  
  // Start bubble spawn loop
  startSpawnLoop();
  
  // Start animation loop
  startAnimationLoop();
}

function startSpawnLoop() {
  if (state.spawnInterval) {
    clearInterval(state.spawnInterval);
  }
  
  state.spawnInterval = setInterval(() => {
    if (state.isGameActive && state.bubbles.length < 6) {
      spawnBubble();
    }
  }, 1500);
}

function startAnimationLoop() {
  function animate() {
    if (state.isGameActive) {
      updateBubbles();
    }
    state.animationFrame = requestAnimationFrame(animate);
  }
  animate();
}

function nextRound() {
  state.currentRound++;
  
  if (state.currentRound > state.totalRounds) {
    endGame();
    return;
  }
  
  // Update round display
  roundDisplay.textContent = `${state.currentRound}/${state.totalRounds}`;
  
  // Generate target based on mode
  generateTarget();
  
  // Update prompt
  updatePrompt();
  
  // Increase speed slightly
  state.bubbleSpeed = 1 + (state.currentRound * 0.1);
}

function generateTarget() {
  switch (state.mode) {
    case 'numbers':
      state.targetValue = Math.floor(Math.random() * 10) + 1;
      break;
    case 'letters':
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      state.targetValue = letters[Math.floor(Math.random() * letters.length)];
      break;
    case 'colors':
      const colorIndex = Math.floor(Math.random() * state.colors.length);
      state.targetValue = state.colors[colorIndex];
      break;
  }
}

function updatePrompt() {
  let prompt = '';
  switch (state.mode) {
    case 'numbers':
      prompt = `Pop the number ${state.targetValue}!`;
      break;
    case 'letters':
      prompt = `Pop the letter ${state.targetValue}!`;
      break;
    case 'colors':
      prompt = `Pop the ${state.targetValue.name} bubble!`;
      break;
  }
  promptText.textContent = prompt;
}

function spawnBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  // Random size between 60-100px
  const size = 60 + Math.random() * 40;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  // Random horizontal position
  const containerWidth = bubbleContainer.offsetWidth;
  const maxX = containerWidth - size;
  const startX = Math.random() * maxX;
  bubble.style.left = `${startX}px`;
  bubble.style.bottom = `-${size}px`;
  
  // Random color
  const color = state.colors[Math.floor(Math.random() * state.colors.length)];
  bubble.classList.add(color.class);
  bubble.dataset.color = color.name;
  
  // Content based on mode
  let content;
  switch (state.mode) {
    case 'numbers':
      content = Math.floor(Math.random() * 10) + 1;
      break;
    case 'letters':
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      content = letters[Math.floor(Math.random() * letters.length)];
      break;
    case 'colors':
      content = state.colors[Math.floor(Math.random() * state.colors.length)].name.charAt(0).toUpperCase();
      break;
  }
  
  bubble.textContent = content;
  bubble.dataset.content = content;
  bubble.dataset.isTarget = (
    (state.mode === 'numbers' || state.mode === 'letters') && content === state.targetValue
  ) || (state.mode === 'colors' && color.name === state.targetValue.name);
  
  // Click/touch handler
  bubble.addEventListener('pointerdown', (e) => handleBubbleClick(e, bubble));
  
  bubbleContainer.appendChild(bubble);
  state.bubbles.push({
    element: bubble,
    x: startX,
    y: -size,
    speed: state.bubbleSpeed * (0.5 + Math.random() * 0.5),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 2 + Math.random() * 2
  });
}

function updateBubbles() {
  const containerHeight = bubbleContainer.offsetHeight;
  
  state.bubbles = state.bubbles.filter(bubbleObj => {
    const { element, x, y, speed, wobble, wobbleSpeed } = bubbleObj;
    
    // Update position
    const newY = y + speed * 2;
    const wobbleOffset = Math.sin(wobble + Date.now() / 500) * 20;
    
    element.style.bottom = `${newY}px`;
    element.style.transform = `translateX(${wobbleOffset}px)`;
    
    // Remove if off screen
    if (newY > containerHeight + 100) {
      element.remove();
      return false;
    }
    
    bubbleObj.y = newY;
    bubbleObj.wobble = wobble;
    return true;
  });
}

function handleBubbleClick(e, bubble) {
  e.preventDefault();
  
  if (!state.isGameActive || bubble.classList.contains('popping')) return;
  
  initAudio();
  
  const isTarget = bubble.dataset.isTarget === 'true';
  
  if (isTarget) {
    // Correct!
    playSound('pop');
    playSound('correct');
    popBubble(bubble);
    state.score++;
    updateScoreStars();
    
    setTimeout(() => {
      playSound('round');
      nextRound();
    }, 500);
  } else {
    // Wrong - gentle feedback
    playSound('wrong');
    bubble.classList.add('wrong');
    setTimeout(() => {
      bubble.classList.remove('wrong');
    }, 500);
  }
}

function popBubble(bubble) {
  bubble.classList.add('popping');
  createParticles(bubble);
  
  setTimeout(() => {
    bubble.remove();
    state.bubbles = state.bubbles.filter(b => b.element !== bubble);
  }, 300);
}

function createParticles(bubble) {
  const rect = bubble.getBoundingClientRect();
  const containerRect = bubbleContainer.getBoundingClientRect();
  const centerX = rect.left - containerRect.left + rect.width / 2;
  const centerY = rect.top - containerRect.top + rect.height / 2;
  
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#DDA0DD', '#FFB347'];
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    const angle = (i / 12) * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    
    bubbleContainer.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 800);
  }
}

function updateScoreStars() {
  scoreStars.innerHTML = '';
  for (let i = 0; i < state.totalRounds; i++) {
    const star = document.createElement('span');
    star.className = 'score-star';
    star.textContent = '⭐';
    if (i < state.score) {
      star.classList.add('filled');
    }
    scoreStars.appendChild(star);
  }
}

function endGame() {
  state.isGameActive = false;
  
  if (state.spawnInterval) {
    clearInterval(state.spawnInterval);
  }
  
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }
  
  // Check and save high score (higher is better)
  const mode = state.mode;
  const metricKey = `score-${mode}`;
  const isNewRecord = HighScore.set('bubble-pop', metricKey, state.score, 'high');
  
  playSound('win');
  createConfetti();
  
  setTimeout(() => {
    finalScoreDisplay.textContent = state.score;
    
    // Display best score
    const bestScoreDisplay = document.getElementById('best-score-display');
    const bestScore = HighScore.get('bubble-pop', metricKey);
    if (bestScore !== null) {
      const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
      if (isNewRecord && state.score === bestScore) {
        bestScoreDisplay.textContent = `🏆 New Record! Best (${modeLabel}): ${bestScore}`;
        bestScoreDisplay.style.color = 'var(--color-red)';
        bestScoreDisplay.style.fontWeight = 'bold';
      } else {
        bestScoreDisplay.textContent = `Best (${modeLabel}): ${bestScore}`;
        bestScoreDisplay.style.color = 'var(--text-light)';
        bestScoreDisplay.style.fontWeight = 'normal';
      }
    } else {
      bestScoreDisplay.textContent = '';
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
