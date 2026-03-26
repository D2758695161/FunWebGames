// Dress Up - Game Logic
// Follows GR-5: Technical Requirements

// ===== Character Data =====
const characters = {
  boy: {
    base: '👦',
    positions: {
      hats: { x: 50, y: 15, zIndex: 10 },
      tops: { x: 50, y: 45, zIndex: 5 },
      bottoms: { x: 50, y: 65, zIndex: 4 },
      shoes: { x: 50, y: 88, zIndex: 3 },
      accessories: { x: 50, y: 35, zIndex: 9 }
    }
  },
  girl: {
    base: '👧',
    positions: {
      hats: { x: 50, y: 15, zIndex: 10 },
      tops: { x: 50, y: 45, zIndex: 5 },
      bottoms: { x: 50, y: 65, zIndex: 4 },
      shoes: { x: 50, y: 88, zIndex: 3 },
      accessories: { x: 50, y: 35, zIndex: 9 }
    }
  }
};

// ===== Item Data =====
const items = {
  hats: [
    { id: 'cap-red', name: 'Red Cap', emoji: '🧢', category: 'hats' },
    { id: 'cowboy', name: 'Cowboy Hat', emoji: '🤠', category: 'hats' },
    { id: 'crown', name: 'Crown', emoji: '👑', category: 'hats' },
    { id: 'beanie', name: 'Beanie', emoji: '🧶', category: 'hats' },
    { id: 'sun-hat', name: 'Sun Hat', emoji: '👒', category: 'hats' },
    { id: 'wizard', name: 'Wizard Hat', emoji: '🧙', category: 'hats' },
    { id: 'party', name: 'Party Hat', emoji: '🎉', category: 'hats' },
    { id: 'bunny-ears', name: 'Bunny Ears', emoji: '🐰', category: 'hats' },
    { id: 'flower', name: 'Flower Crown', emoji: '🌸', category: 'hats' },
    { id: 'baseball', name: 'Baseball Cap', emoji: '⚾', category: 'hats' }
  ],
  tops: [
    { id: 'tshirt-red', name: 'Red T-Shirt', emoji: '👕', category: 'tops' },
    { id: 'tshirt-blue', name: 'Blue T-Shirt', emoji: '👕', category: 'tops' },
    { id: 'tshirt-yellow', name: 'Yellow T-Shirt', emoji: '👕', category: 'tops' },
    { id: 'striped', name: 'Striped Shirt', emoji: '👚', category: 'tops' },
    { id: 'hoodie', name: 'Hoodie', emoji: '🧥', category: 'tops' },
    { id: 'sweater', name: 'Sweater', emoji: '🧶', category: 'tops' },
    { id: 'jacket', name: 'Jacket', emoji: '🧥', category: 'tops' },
    { id: 'cape', name: 'Superhero Cape', emoji: '🦸', category: 'tops' },
    { id: 'doctor', name: 'Doctor Coat', emoji: '🩺', category: 'tops' },
    { id: 'chef', name: 'Chef Apron', emoji: '👨‍🍳', category: 'tops' }
  ],
  bottoms: [
    { id: 'jeans-blue', name: 'Blue Jeans', emoji: '👖', category: 'bottoms' },
    { id: 'jeans-black', name: 'Black Jeans', emoji: '👖', category: 'bottoms' },
    { id: 'shorts-red', name: 'Red Shorts', emoji: '🩳', category: 'bottoms' },
    { id: 'shorts-green', name: 'Green Shorts', emoji: '🩳', category: 'bottoms' },
    { id: 'skirt-pink', name: 'Pink Skirt', emoji: '👗', category: 'bottoms' },
    { id: 'skirt-yellow', name: 'Yellow Skirt', emoji: '👗', category: 'bottoms' },
    { id: 'leggings', name: 'Leggings', emoji: '👖', category: 'bottoms' },
    { id: 'pajama', name: 'Pajama Pants', emoji: '🛌', category: 'bottoms' }
  ],
  shoes: [
    { id: 'sneakers-white', name: 'White Sneakers', emoji: '👟', category: 'shoes' },
    { id: 'sneakers-black', name: 'Black Sneakers', emoji: '👟', category: 'shoes' },
    { id: 'sneakers-red', name: 'Red Sneakers', emoji: '👟', category: 'shoes' },
    { id: 'boots-brown', name: 'Brown Boots', emoji: '👢', category: 'shoes' },
    { id: 'boots-black', name: 'Black Boots', emoji: '👢', category: 'shoes' },
    { id: 'sandals', name: 'Sandals', emoji: '🩴', category: 'shoes' },
    { id: 'flats', name: 'Ballet Flats', emoji: '👠', category: 'shoes' },
    { id: 'rain-boots', name: 'Rain Boots', emoji: '🌧️', category: 'shoes' }
  ],
  accessories: [
    { id: 'glasses-round', name: 'Round Glasses', emoji: '👓', category: 'accessories' },
    { id: 'glasses-sun', name: 'Sunglasses', emoji: '🕶️', category: 'accessories' },
    { id: 'necklace-star', name: 'Star Necklace', emoji: '⭐', category: 'accessories' },
    { id: 'necklace-heart', name: 'Heart Necklace', emoji: '💖', category: 'accessories' },
    { id: 'bracelet', name: 'Bracelet', emoji: '📿', category: 'accessories' },
    { id: 'watch', name: 'Watch', emoji: '⌚', category: 'accessories' },
    { id: 'backpack', name: 'Backpack', emoji: '🎒', category: 'accessories' },
    { id: 'wings', name: 'Fairy Wings', emoji: '🧚', category: 'accessories' },
    { id: 'wand', name: 'Magic Wand', emoji: '🪄', category: 'accessories' },
    { id: 'microphone', name: 'Microphone', emoji: '🎤', category: 'accessories' },
    { id: 'camera', name: 'Camera', emoji: '📷', category: 'accessories' }
  ]
};

// ===== State =====
let selectedCharacter = null;
let currentCategory = 'hats';
let wornItems = {}; // { category: item }
let outfitCount = 0;
let isDragging = false;
let draggedItem = null;
let dragOffset = { x: 0, y: 0 };

// Animation state
let previewOpacity = 0;
let previewItem = null;
let isSnapping = false;
let snapScale = 1;
let discoColors = [];
let discoPhase = 0;

// ===== DOM Elements =====
const characterSelectScreen = document.getElementById('character-select-screen');
const gameScreen = document.getElementById('game-screen');
const characterOptions = document.querySelectorAll('.character-option');
const startBtn = document.getElementById('start-btn');
const categoryTabs = document.querySelectorAll('.category-tab');
const characterBase = document.getElementById('character-base');
const characterLayers = document.getElementById('character-layers');
const carouselContainer = document.getElementById('carousel-container');
const resetBtn = document.getElementById('reset-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const saveBtn = document.getElementById('save-btn');
const fashionShowBtn = document.getElementById('fashion-show-btn');
const outfitCountDisplay = document.getElementById('outfit-count');
const bestOutfitsDisplay = document.getElementById('best-outfits');

// ===== Character Selection =====
characterOptions.forEach(option => {
  option.addEventListener('click', () => {
    characterOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedCharacter = option.dataset.character;
    startBtn.disabled = false;
    playSound('pop');
  });
});

startBtn.addEventListener('click', () => {
  characterSelectScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  initializeGame();
});

// ===== Game Initialization =====
function initializeGame() {
  characterBase.textContent = characters[selectedCharacter].base;
  switchCategory('hats');
  updateCharacterLayers();
}

// ===== Category Switching =====
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    switchCategory(category);
    playSound('page');
  });
});

function switchCategory(category) {
  currentCategory = category;
  
  // Update active tab
  categoryTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
  
  // Render carousel
  renderCarousel();
}

function renderCarousel() {
  carouselContainer.innerHTML = '';
  
  const categoryItems = items[currentCategory] || [];
  
  categoryItems.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'carousel-item';
    itemEl.dataset.itemId = item.id;
    itemEl.dataset.category = item.category;
    itemEl.draggable = true;
    
    itemEl.innerHTML = `
      <div class="carousel-item-preview">${item.emoji}</div>
      <div class="carousel-item-name">${item.name}</div>
    `;
    
    // Mouse events
    itemEl.addEventListener('mousedown', handleDragStart);
    itemEl.addEventListener('click', () => handleItemClick(item));
    
    // Touch events
    itemEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    itemEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    itemEl.addEventListener('touchend', handleTouchEnd);
    
    // Drag events
    itemEl.addEventListener('dragstart', handleDragStart);
    itemEl.addEventListener('dragend', handleDragEnd);
    
    carouselContainer.appendChild(itemEl);
  });
}

function handleItemClick(item) {
  if (isDragging) return;
  
  // Show preview first
  showPreview(item);
  
  // Toggle item on/off after brief delay
  setTimeout(() => {
    if (wornItems[item.category] && wornItems[item.category].id === item.id) {
      delete wornItems[item.category];
    } else {
      wornItems[item.category] = item;
    }
    
    updateCharacterLayers();
    playSound('pop');
  }, 300);
}

function showPreview(item) {
  previewItem = item;
  previewOpacity = 0.5;
  
  // Fade out preview
  const fadeInterval = setInterval(() => {
    previewOpacity -= 0.05;
    if (previewOpacity <= 0) {
      previewOpacity = 0;
      previewItem = null;
      clearInterval(fadeInterval);
      updateCharacterLayers();
    } else {
      updateCharacterLayers();
    }
  }, 50);
}

// ===== Drag and Drop =====
function handleDragStart(e) {
  if (e.type === 'mousedown' && e.button !== 0) return;
  
  const itemEl = e.target.closest('.carousel-item');
  if (!itemEl) return;
  
  isDragging = true;
  draggedItem = {
    id: itemEl.dataset.itemId,
    category: itemEl.dataset.category,
    element: itemEl
  };
  
  itemEl.classList.add('dragging');
  playSound('rustle');
}

function handleDragEnd() {
  isDragging = false;
  if (draggedItem && draggedItem.element) {
    draggedItem.element.classList.remove('dragging');
  }
  draggedItem = null;
}

function handleTouchStart(e) {
  e.preventDefault();
  handleDragStart(e);
}

function handleTouchMove(e) {
  if (!isDragging) return;
  e.preventDefault();
}

function handleTouchEnd(e) {
  if (!isDragging || !draggedItem) return;
  
  const touch = e.changedTouches[0];
  const characterRect = document.getElementById('character-container').getBoundingClientRect();
  
  // Check if dropped on character
  if (
    touch.clientX >= characterRect.left &&
    touch.clientX <= characterRect.right &&
    touch.clientY >= characterRect.top &&
    touch.clientY <= characterRect.bottom
  ) {
    // Find item data
    const item = items[draggedItem.category].find(i => i.id === draggedItem.id);
    if (item) {
      wornItems[item.category] = item;
      isSnapping = true;
      updateCharacterLayers();
      playSound('snap');
    }
  }
  
  handleDragEnd();
}

// Drop zone for character
characterLayers.addEventListener('dragover', (e) => {
  e.preventDefault();
});

characterLayers.addEventListener('drop', (e) => {
  e.preventDefault();
  
  if (!draggedItem) return;
  
  const item = items[draggedItem.category].find(i => i.id === draggedItem.id);
  if (item) {
    wornItems[item.category] = item;
    updateCharacterLayers();
    playSound('snap');
  }
  
  handleDragEnd();
});

// ===== Character Layers =====
function updateCharacterLayers() {
  characterLayers.innerHTML = '';
  
  const positions = characters[selectedCharacter].positions;
  
  // Sort items by z-index for correct layering
  const sortedCategories = Object.keys(wornItems).sort((a, b) => {
    const posA = positions[a] || { zIndex: 0 };
    const posB = positions[b] || { zIndex: 0 };
    return posA.zIndex - posB.zIndex;
  });
  
  sortedCategories.forEach(category => {
    const item = wornItems[category];
    if (!item) return;
    
    const pos = positions[category];
    if (!pos) return;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'character-item';
    
    // Check if this is the preview item
    if (previewItem && previewItem.id === item.id) {
      itemEl.style.opacity = previewOpacity;
      itemEl.classList.add('preview');
    }
    
    // Add snap animation class if recently added
    if (isSnapping && item === draggedItem) {
      itemEl.classList.add('snap-animation');
    }
    
    itemEl.textContent = item.emoji;
    itemEl.style.left = `${pos.x}%`;
    itemEl.style.top = `${pos.y}%`;
    itemEl.style.zIndex = pos.zIndex;
    
    // Click to remove
    itemEl.addEventListener('click', () => {
      delete wornItems[category];
      updateCharacterLayers();
      playSound('pop');
    });
    
    characterLayers.appendChild(itemEl);
  });
  
  // Reset snap state after animation
  if (isSnapping) {
    setTimeout(() => {
      isSnapping = false;
    }, 300);
  }
}

// ===== Action Buttons =====
resetBtn.addEventListener('click', () => {
  wornItems = {};
  updateCharacterLayers();
  playSound('swoosh');
});

randomizeBtn.addEventListener('click', () => {
  wornItems = {};
  
  // Random item from each category
  Object.keys(items).forEach(category => {
    const categoryItems = items[category];
    if (categoryItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryItems.length);
      wornItems[category] = categoryItems[randomIndex];
    }
  });
  
  // Animate items flying in
  animateRandomize();
  updateCharacterLayers();
  playSound('twinkle');
});

function animateRandomize() {
  characterLayers.classList.add('randomize-active');
  setTimeout(() => {
    characterLayers.classList.remove('randomize-active');
  }, 500);
}

fashionShowBtn.addEventListener('click', () => {
  const characterContainer = document.getElementById('character-container');
  characterContainer.classList.add('fashion-show-active');
  playSound('celebration');
  
  // Add disco lights effect
  startDiscoLights();
  
  setTimeout(() => {
    characterContainer.classList.remove('fashion-show-active');
    stopDiscoLights();
  }, 3000);
});

function startDiscoLights() {
  discoPhase = 0;
  const discoInterval = setInterval(() => {
    if (!document.getElementById('character-container').classList.contains('fashion-show-active')) {
      clearInterval(discoInterval);
      return;
    }
    
    discoPhase = (discoPhase + 1) % 6;
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#DDA0DD', '#FFB347'];
    document.getElementById('character-container').style.background = 
      `radial-gradient(circle, ${colors[discoPhase]}40, transparent)`;
  }, 300);
}

function stopDiscoLights() {
  document.getElementById('character-container').style.background = 'transparent';
}

saveBtn.addEventListener('click', () => {
  saveOutfit();
  playSound('camera');
});

// ===== High Score Tracking =====
function updateOutfitCount() {
  outfitCount++;
  if (outfitCountDisplay) {
    outfitCountDisplay.textContent = outfitCount;
  }
  
  // Check and save high score (higher is better)
  const metricKey = 'outfits';
  const isNewRecord = HighScore.set('dress-up', metricKey, outfitCount, 'high');
  
  // Display best score
  if (bestOutfitsDisplay) {
    const bestScore = HighScore.get('dress-up', metricKey);
    if (bestScore !== null) {
      if (isNewRecord && outfitCount === bestScore) {
        bestOutfitsDisplay.textContent = `${bestScore} 🏆`;
        bestOutfitsDisplay.style.color = 'var(--color-red)';
        bestOutfitsDisplay.style.fontWeight = 'bold';
      } else {
        bestOutfitsDisplay.textContent = bestScore;
        bestOutfitsDisplay.style.color = 'var(--text-light)';
        bestOutfitsDisplay.style.fontWeight = 'normal';
      }
    }
  }
}

// ===== Screenshot Generation =====
function saveOutfit() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('character-container');
  const rect = container.getBoundingClientRect();
  
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);
  
  // Draw background
  ctx.fillStyle = '#FFF5F8';
  ctx.fillRect(0, 0, rect.width, rect.height);
  
  // Draw character base
  ctx.font = '180px "Comic Sans MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(characters[selectedCharacter].base, rect.width / 2, rect.height / 2);
  
  // Draw worn items
  const positions = characters[selectedCharacter].positions;
  Object.keys(wornItems).forEach(category => {
    const item = wornItems[category];
    const pos = positions[category];
    if (item && pos) {
      ctx.font = '80px "Comic Sans MS", sans-serif';
      ctx.fillText(item.emoji, (rect.width * pos.x) / 100, (rect.height * pos.y) / 100);
    }
  });
  
  // Track outfit creation
  updateOutfitCount();
  
  // Download
  const link = document.createElement('a');
  link.download = `dress-up-${selectedCharacter}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
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
      
    case 'snap':
      oscillator.frequency.value = 800;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
      
    case 'page':
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'rustle':
      oscillator.frequency.value = 300;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
      
    case 'twinkle':
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
      });
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
      
    case 'swoosh':
      oscillator.frequency.value = 200;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      break;
      
    case 'camera':
      oscillator.frequency.value = 1000;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
  }
}

// ===== Initialize =====
// Game starts when user selects character and clicks start

// Help Button Setup (called after game screen is shown)
const helpBtn = document.getElementById('help-btn');
if (helpBtn) {
  helpBtn.addEventListener('click', () => {
    HelpModal.show('👗', 'Drag clothes to dress up the model!');
  });
  
  HelpModal.showIfFirstTime('dress-up', '👗', 'Drag clothes to dress up the model!');
}
