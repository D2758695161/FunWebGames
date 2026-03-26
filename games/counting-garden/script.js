// Counting Garden Game - JavaScript
// Follows GR-3: Audio & Feedback, GR-4: Responsive & Touch

// ===== Game State =====
const state = {
  currentRound: 0,
  totalRounds: 10,
  stars: 0,
  currentObject: null,
  currentCount: 0,
  objects: [],
  isAnimating: false
};

// ===== Garden Objects (SVG) =====
const objectTypes = {
  butterfly: {
    name: 'butterflies',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="10" ry="30" fill="#8B4513"/>
      <ellipse cx="30" cy="40" rx="25" ry="20" fill="#FF6B6B" opacity="0.8"/>
      <ellipse cx="70" cy="40" rx="25" ry="20" fill="#FF6B6B" opacity="0.8"/>
      <ellipse cx="30" cy="60" rx="20" ry="15" fill="#4ECDC4" opacity="0.8"/>
      <ellipse cx="70" cy="60" rx="20" ry="15" fill="#4ECDC4" opacity="0.8"/>
      <line x1="50" y1="20" x2="50" y2="10" stroke="#333" stroke-width="2"/>
      <circle cx="45" cy="8" r="3" fill="#333"/>
      <circle cx="55" cy="8" r="3" fill="#333"/>
    </svg>`
  },
  flower: {
    name: 'flowers',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="15" fill="#FFD700"/>
      <circle cx="50" cy="25" r="12" fill="#FF6B6B"/>
      <circle cx="75" cy="50" r="12" fill="#FF6B6B"/>
      <circle cx="50" cy="75" r="12" fill="#FF6B6B"/>
      <circle cx="25" cy="50" r="12" fill="#FF6B6B"/>
      <circle cx="68" cy="32" r="12" fill="#FF6B6B"/>
      <circle cx="68" cy="68" r="12" fill="#FF6B6B"/>
      <circle cx="32" cy="68" r="12" fill="#FF6B6B"/>
      <circle cx="32" cy="32" r="12" fill="#FF6B6B"/>
      <rect x="48" y="65" width="4" height="35" fill="#228B22"/>
    </svg>`
  },
  bee: {
    name: 'bees',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="#FFD700"/>
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="#333" stroke-width="3" stroke-dasharray="10,5"/>
      <ellipse cx="30" cy="40" rx="15" ry="10" fill="#FFF" opacity="0.7"/>
      <ellipse cx="70" cy="40" rx="15" ry="10" fill="#FFF" opacity="0.7"/>
      <circle cx="35" cy="45" r="5" fill="#333"/>
      <circle cx="65" cy="45" r="5" fill="#333"/>
      <line x1="40" y1="35" x2="35" y2="25" stroke="#333" stroke-width="2"/>
      <line x1="60" y1="35" x2="65" y2="25" stroke="#333" stroke-width="2"/>
    </svg>`
  },
  ladybug: {
    name: 'ladybugs',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="40" fill="#FF6B6B"/>
      <line x1="50" y1="15" x2="50" y2="85" stroke="#333" stroke-width="2"/>
      <circle cx="35" cy="40" r="5" fill="#333"/>
      <circle cx="65" cy="40" r="5" fill="#333"/>
      <circle cx="35" cy="60" r="5" fill="#333"/>
      <circle cx="65" cy="60" r="5" fill="#333"/>
      <circle cx="50" cy="20" r="15" fill="#333"/>
      <circle cx="45" cy="18" r="3" fill="#FFF"/>
      <circle cx="55" cy="18" r="3" fill="#FFF"/>
    </svg>`
  },
  bird: {
    name: 'birds',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="#4ECDC4"/>
      <polygon points="20,50 5,45 5,55" fill="#FF6B6B"/>
      <circle cx="35" cy="45" r="5" fill="#333"/>
      <circle cx="37" cy="43" r="2" fill="#FFF"/>
      <path d="M 60 40 Q 80 30 90 40 Q 80 50 60 45" fill="#4ECDC4"/>
      <path d="M 60 55 Q 80 65 90 55 Q 80 50 60 55" fill="#4ECDC4"/>
    </svg>`
  },
  apple: {
    name: 'apples',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="35" fill="#FF6B6B"/>
      <path d="M 50 25 Q 60 15 70 20" stroke="#8B4513" stroke-width="3" fill="none"/>
      <ellipse cx="55" cy="20" rx="8" ry="5" fill="#228B22"/>
      <circle cx="40" cy="50" r="5" fill="#FFF" opacity="0.3"/>
    </svg>`
  }
};

// ===== DOM Elements =====
let garden, objectsContainer, questionText, optionsContainer, feedbackMessage, starsDisplay, roundDisplay, completionModal;

// ===== Initialization =====
function init() {
  garden = document.getElementById('garden');
  objectsContainer = document.getElementById('objects-container');
  questionText = document.getElementById('question-text');
  optionsContainer = document.getElementById('options-container');
  feedbackMessage = document.getElementById('feedback-message');
  starsDisplay = document.getElementById('stars');
  roundDisplay = document.getElementById('round-display');
  completionModal = document.getElementById('completion-modal');

  document.getElementById('btn-play-again').addEventListener('click', restartGame);
  setupAudio();
  setupHelp();

  startGame();
  console.log('Counting Garden initialized!');
}

function setupHelp() {
  const helpBtn = document.getElementById('help-btn');
  if (!helpBtn) return;
  
  helpBtn.addEventListener('click', () => {
    HelpModal.show('🌸', 'Count the objects and pick the right number!');
  });
  
  HelpModal.showIfFirstTime('counting-garden', '🌸', 'Count the objects and pick the right number!');
}

function setupAudio() {
  document.getElementById('sound-correct').src = 'assets/sounds/correct.mp3';
  document.getElementById('sound-count').src = 'assets/sounds/count.mp3';
  document.getElementById('sound-wrong').src = 'assets/sounds/wrong.mp3';
  document.getElementById('sound-round').src = 'assets/sounds/round.mp3';
  document.getElementById('sound-celebration').src = 'assets/sounds/celebration.mp3';
}

// ===== Game Flow =====
function startGame() {
  state.currentRound = 0;
  state.stars = 0;
  updateScore();
  completionModal.classList.add('hidden');
  nextRound();
}

function restartGame() {
  playSound('round');
  startGame();
}

function nextRound() {
  state.currentRound++;
  
  if (state.currentRound > state.totalRounds) {
    endGame();
    return;
  }

  state.isAnimating = false;
  updateRoundDisplay();
  generateRound();
}

function generateRound() {
  // Pick random object type
  const types = Object.keys(objectTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  state.currentObject = type;

  // Pick random count (1-10)
  const count = Math.floor(Math.random() * 10) + 1;
  state.currentCount = count;

  // Update question
  questionText.textContent = `How many ${objectTypes[type].name}?`;

  // Clear garden
  objectsContainer.innerHTML = '';
  state.objects = [];

  // Spawn objects at random positions
  spawnObjects(type, count);

  // Generate answer options
  generateOptions(count);

  // Clear feedback
  feedbackMessage.textContent = '';
}

function spawnObjects(type, count) {
  const positions = generatePositions(count);

  for (let i = 0; i < count; i++) {
    const obj = document.createElement('div');
    obj.className = `garden-object ${type}`;
    obj.style.left = `${positions[i].x}px`;
    obj.style.top = `${positions[i].y}px`;
    obj.innerHTML = objectTypes[type].svg;
    obj.dataset.index = i;
    
    objectsContainer.appendChild(obj);
    state.objects.push(obj);
  }
}

function generatePositions(count) {
  const positions = [];
  const padding = 80;
  const availableWidth = garden.clientWidth - padding * 2;
  const availableHeight = garden.clientHeight * 0.5 - padding;

  for (let i = 0; i < count; i++) {
    let x, y, overlaps;
    let attempts = 0;

    do {
      overlaps = false;
      x = padding + Math.random() * availableWidth;
      y = padding + Math.random() * availableHeight;

      // Check overlap with existing positions
      for (const pos of positions) {
        const dx = pos.x - x;
        const dy = pos.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          overlaps = true;
          break;
        }
      }

      attempts++;
    } while (overlaps && attempts < 50);

    positions.push({ x, y });
  }

  return positions;
}

function generateOptions(correctCount) {
  optionsContainer.innerHTML = '';

  // Generate 2 wrong answers
  const options = new Set([correctCount]);
  while (options.size < 3) {
    const wrong = Math.floor(Math.random() * 10) + 1;
    if (wrong !== correctCount) {
      options.add(wrong);
    }
  }

  // Convert to array and shuffle
  const optionsArray = Array.from(options).sort(() => Math.random() - 0.5);

  // Create buttons
  optionsArray.forEach(num => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = num;
    btn.addEventListener('click', () => handleAnswer(num, btn));
    optionsContainer.appendChild(btn);
  });
}

// ===== Answer Handling =====
function handleAnswer(selectedNum, btn) {
  if (state.isAnimating) return;

  if (selectedNum === state.currentCount) {
    // Correct!
    state.isAnimating = true;
    btn.classList.add('correct');
    feedbackMessage.textContent = '✓ Correct! Let\'s count together!';
    playSound('correct');
    
    // Start counting animation
    setTimeout(() => countObjects(), 500);
  } else {
    // Wrong
    btn.classList.add('wrong');
    feedbackMessage.textContent = 'Try again!';
    playSound('wrong');
    
    setTimeout(() => {
      btn.classList.remove('wrong');
    }, 500);
  }
}

function countObjects() {
  const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  
  state.objects.forEach((obj, index) => {
    setTimeout(() => {
      obj.classList.add('counting');
      feedbackMessage.textContent = `${numbers[index]}...`;
      playSound('count');

      if (index === state.objects.length - 1) {
        // Counting complete
        setTimeout(() => completeRound(), 1000);
      }
    }, index * 800);
  });
}

function completeRound() {
  state.stars++;
  updateScore();
  playSound('round');
  feedbackMessage.textContent = `✓ ${state.currentCount} ${state.currentObject}s! Great job!`;
  
  // Animate star flying to score
  animateStar();

  setTimeout(() => {
    nextRound();
  }, 2000);
}

function animateStar() {
  const star = document.createElement('div');
  star.className = 'star-fly';
  star.textContent = '⭐';
  star.style.left = '50%';
  star.style.top = '50%';
  garden.appendChild(star);

  setTimeout(() => star.remove(), 1000);
}

function updateScore() {
  starsDisplay.textContent = `⭐ ${state.stars}`;
}

function updateRoundDisplay() {
  roundDisplay.textContent = `Round ${state.currentRound}/${state.totalRounds}`;
}

// ===== Game End =====
function endGame() {
  // Check and save high score (higher is better)
  const metricKey = 'stars';
  const isNewRecord = HighScore.set('counting-garden', metricKey, state.stars, 'high');
  
  document.getElementById('final-stars').textContent = state.stars;
  
  // Display best score
  const bestStarsDisplay = document.getElementById('best-stars-display');
  const bestScore = HighScore.get('counting-garden', metricKey);
  if (bestScore !== null) {
    if (isNewRecord && state.stars === bestScore) {
      bestStarsDisplay.textContent = `🏆 New Record! Best: ${bestScore} stars`;
      bestStarsDisplay.style.color = 'var(--color-red)';
      bestStarsDisplay.style.fontWeight = 'bold';
    } else {
      bestStarsDisplay.textContent = `Best: ${bestScore} stars`;
      bestStarsDisplay.style.color = 'var(--text-light)';
      bestStarsDisplay.style.fontWeight = 'normal';
    }
  } else {
    bestStarsDisplay.textContent = '';
  }
  
  completionModal.classList.remove('hidden');
  playSound('celebration');
  createConfetti();
}

function createConfetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#DDA0DD'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
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
      console.log(`Sound ${name} not available`);
    });
  }
}

// ===== Start Game =====
window.addEventListener('DOMContentLoaded', init);
