// Letter Explorer - Game Logic
// Follows GR-5: Technical Requirements

// ===== Letter Data =====
const letters = {
  A: { name: "A", sound: "/a/", word: "Apple", emoji: "🍎", color: "#FFB6C1" },
  B: { name: "B", sound: "/b/", word: "Bear", emoji: "🐻", color: "#ADD8E6" },
  C: { name: "C", sound: "/k/", word: "Cat", emoji: "🐱", color: "#98FB98" },
  D: { name: "D", sound: "/d/", word: "Dog", emoji: "🐶", color: "#FFDAB9" },
  E: { name: "E", sound: "/e/", word: "Elephant", emoji: "🐘", color: "#DDA0DD" },
  F: { name: "F", sound: "/f/", word: "Fish", emoji: "🐟", color: "#87CEEB" },
  G: { name: "G", sound: "/g/", word: "Giraffe", emoji: "🦒", color: "#F0E68C" },
  H: { name: "H", sound: "/h/", word: "House", emoji: "🏠", color: "#FFB6C1" },
  I: { name: "I", sound: "/i/", word: "Ice Cream", emoji: "🍦", color: "#FFE4E1" },
  J: { name: "J", sound: "/j/", word: "Jellyfish", emoji: "🪼", color: "#E6E6FA" },
  K: { name: "K", sound: "/k/", word: "Kangaroo", emoji: "🦘", color: "#90EE90" },
  L: { name: "L", sound: "/l/", word: "Lion", emoji: "🦁", color: "#FFD700" },
  M: { name: "M", sound: "/m/", word: "Monkey", emoji: "🐵", color: "#FFA07A" },
  N: { name: "N", sound: "/n/", word: "Nest", emoji: "🪺", color: "#87CEFA" },
  O: { name: "O", sound: "/o/", word: "Owl", emoji: "🦉", color: "#DDA0DD" },
  P: { name: "P", sound: "/p/", word: "Penguin", emoji: "🐧", color: "#AFEEEE" },
  Q: { name: "Q", sound: "/kw/", word: "Queen", emoji: "👑", color: "#FFB6C1" },
  R: { name: "R", sound: "/r/", word: "Rabbit", emoji: "🐰", color: "#98FB98" },
  S: { name: "S", sound: "/s/", word: "Sun", emoji: "☀️", color: "#FFFACD" },
  T: { name: "T", sound: "/t/", word: "Tiger", emoji: "🐯", color: "#FFE4B5" },
  U: { name: "U", sound: "/u/", word: "Umbrella", emoji: "☂️", color: "#E6E6FA" },
  V: { name: "V", sound: "/v/", word: "Violin", emoji: "🎻", color: "#FFB6C1" },
  W: { name: "W", sound: "/w/", word: "Whale", emoji: "🐋", color: "#87CEEB" },
  X: { name: "X", sound: "/ks/", word: "Xylophone", emoji: "🎹", color: "#FFDAB9" },
  Y: { name: "Y", sound: "/y/", word: "Yacht", emoji: "⛵", color: "#F0FFF0" },
  Z: { name: "Z", sound: "/z/", word: "Zebra", emoji: "🦓", color: "#FFEFD5" }
};

const letterOrder = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ===== State =====
let currentLetterIndex = 0;
let currentMode = "name"; // name, sound, trace
let isTracing = false;
let tracePoints = [];
let isDrawing = false;
let tracingComplete = false;
let lettersCompleted = 0;

// ===== DOM Elements =====
const letterDisplay = document.getElementById("letter-display");
const letterLarge = document.getElementById("letter-large");
const illustration = document.getElementById("illustration");
const letterText = document.getElementById("letter-text");
const tracingCanvas = document.getElementById("tracing-canvas");
const tracingArea = document.getElementById("tracing-area");
const tracingFeedback = document.getElementById("tracing-feedback");
const letterCarousel = document.getElementById("letter-carousel");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const modeToggle = document.getElementById("mode-toggle");
const tryAgainBtn = document.getElementById("try-again-btn");
const accuracyDisplay = document.getElementById("accuracy-display");
const accuracyValue = document.getElementById("accuracy-value");
const celebrationMessage = document.getElementById("celebration-message");
const lettersCompletedDisplay = document.createElement("div");
lettersCompletedDisplay.className = "celebration-stats";
lettersCompletedDisplay.style.marginTop = "var(--spacing-sm)";
lettersCompletedDisplay.style.fontSize = "1.125rem";
celebrationMessage.insertBefore(lettersCompletedDisplay, celebrationMessage.firstChild);

// ===== Canvas Setup =====
const ctx = tracingCanvas.getContext("2d");
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const rect = tracingArea.getBoundingClientRect();
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  tracingCanvas.width = canvasWidth;
  tracingCanvas.height = canvasHeight;
  drawCurrentLetter();
}

// ===== Initialization =====
function init() {
  SoundToggle.init();
  
  createLetterCarousel();
  resizeCanvas();
  updateLetterDisplay();
  setupEventListeners();
  setupHelp();
  window.addEventListener("resize", resizeCanvas);
}

function setupHelp() {
  const helpBtn = document.getElementById('help-btn');
  if (!helpBtn) return;
  
  helpBtn.addEventListener('click', () => {
    HelpModal.show('🔤', 'Trace the letter with your finger!');
  });
  
  HelpModal.showIfFirstTime('letter-explorer', '🔤', 'Trace the letter with your finger!');
}

// ===== Letter Carousel =====
function createLetterCarousel() {
  letterCarousel.innerHTML = "";
  letterOrder.forEach((letter, index) => {
    const btn = document.createElement("button");
    btn.className = "letter-btn" + (index === currentLetterIndex ? " active" : "");
    btn.textContent = letter;
    btn.setAttribute("aria-label", `Go to letter ${letter}`);
    btn.addEventListener("click", () => goToLetter(index));
    letterCarousel.appendChild(btn);
  });
}

function updateCarousel() {
  const buttons = letterCarousel.querySelectorAll(".letter-btn");
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentLetterIndex);
  });
  // Scroll active button into view
  const activeBtn = buttons[currentLetterIndex];
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

// ===== Letter Navigation =====
function goToLetter(index) {
  if (index < 0 || index >= letterOrder.length) return;
  currentLetterIndex = index;
  updateLetterDisplay();
  updateCarousel();
  playSound("chime");
}

function nextLetter() {
  goToLetter(currentLetterIndex + 1);
}

function prevLetter() {
  goToLetter(currentLetterIndex - 1);
}

function getCurrentLetter() {
  return letterOrder[currentLetterIndex];
}

// ===== Update Display =====
function updateLetterDisplay() {
  const letter = getCurrentLetter();
  const data = letters[letter];
  
  letterLarge.textContent = letter;
  illustration.textContent = data.emoji;
  letterText.textContent = `${letter} is for ${data.word}`;
  letterDisplay.style.backgroundColor = data.color;
  
  // Reset tracing state
  resetTracing();
  
  // Draw letter on canvas
  if (currentMode === "trace") {
    setTimeout(drawCurrentLetter, 100);
  }
  
  // Update navigation buttons
  prevBtn.disabled = currentLetterIndex === 0;
  nextBtn.disabled = currentLetterIndex === letterOrder.length - 1;
}

// ===== Canvas Drawing =====
function drawCurrentLetter() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw grid
  drawGrid();
  
  // Draw letter guide
  const letter = getCurrentLetter();
  drawLetterGuide(letter);
}

function drawGrid() {
  ctx.strokeStyle = "#f0f0f0";
  ctx.lineWidth = 1;
  const gridSize = 20;
  
  for (let x = 0; x < canvasWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvasHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
}

function drawLetterGuide(letter) {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const fontSize = Math.min(canvasWidth, canvasHeight) * 0.6;
  
  // Draw dotted guide
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 4;
  ctx.font = `bold ${fontSize}px "Comic Sans MS", "Chalkboard SE", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(letter, centerX, centerY);
  ctx.setLineDash([]);
  
  // Store guide path for accuracy calculation (simplified - using bounding box)
  storeGuidePath(letter, centerX, centerY, fontSize);
}

let guidePath = null;

function storeGuidePath(letter, centerX, centerY, fontSize) {
  // Simplified: store center point and size for distance calculation
  guidePath = {
    letter,
    centerX,
    centerY,
    fontSize,
    points: generateLetterPoints(letter, centerX, centerY, fontSize)
  };
}

function generateLetterPoints(letter, centerX, centerY, size) {
  // Generate sample points along the letter stroke (simplified approach)
  // In production, this would use actual letter path data
  const points = [];
  const step = size / 20;
  
  // Create a circular pattern around center for basic detection
  const radius = size / 3;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  
  return points;
}

// ===== Tracing Logic =====
function getCanvasCoordinates(e) {
  const rect = tracingCanvas.getBoundingClientRect();
  const scaleX = tracingCanvas.width / rect.width;
  const scaleY = tracingCanvas.height / rect.height;
  
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

function startDrawing(e) {
  if (currentMode !== "trace" || tracingComplete) return;
  
  e.preventDefault();
  isDrawing = true;
  tracePoints = [];
  
  const coords = getCanvasCoordinates(e);
  tracePoints.push(coords);
  
  playSound("whoosh");
  updateFeedback("start");
}

function draw(e) {
  if (!isDrawing || currentMode !== "trace") return;
  
  e.preventDefault();
  const coords = getCanvasCoordinates(e);
  tracePoints.push(coords);
  
  // Draw the trace line
  ctx.strokeStyle = "#4A90E2";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([]);
  
  if (tracePoints.length > 1) {
    const lastPoint = tracePoints[tracePoints.length - 2];
    const currentPoint = tracePoints[tracePoints.length - 1];
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  
  // Calculate and show accuracy
  const accuracy = calculateAccuracy();
  updateFeedbackForAccuracy(accuracy);
}

function stopDrawing(e) {
  if (!isDrawing) return;
  
  isDrawing = false;
  
  // Calculate final accuracy
  const accuracy = calculateAccuracy();
  
  if (accuracy >= 70) {
    tracingComplete = true;
    showCelebration();
    playSound("celebration");
  } else {
    updateFeedback("Keep trying!");
  }
}

function calculateAccuracy() {
  if (!guidePath || tracePoints.length === 0) return 0;
  
  let totalDistance = 0;
  let onPathCount = 0;
  const threshold = guidePath.fontSize / 6; // Tolerance
  
  tracePoints.forEach(point => {
    // Find distance to nearest guide point
    let minDistance = Infinity;
    guidePath.points.forEach(guidePoint => {
      const dx = point.x - guidePoint.x;
      const dy = point.y - guidePoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) minDistance = distance;
    });
    
    totalDistance += minDistance;
    if (minDistance < threshold) onPathCount++;
  });
  
  const accuracy = Math.round((onPathCount / tracePoints.length) * 100);
  return Math.min(100, accuracy);
}

function updateFeedbackForAccuracy(accuracy) {
  accuracyValue.textContent = accuracy;
  accuracyDisplay.classList.remove("hidden");
  
  if (accuracy >= 80) {
    tracingFeedback.textContent = "Great! ✓";
    tracingFeedback.className = "tracing-feedback success";
  } else if (accuracy >= 50) {
    tracingFeedback.textContent = "Getting closer...";
    tracingFeedback.className = "tracing-feedback warning";
  } else {
    tracingFeedback.textContent = "Keep going!";
    tracingFeedback.className = "tracing-feedback error";
  }
}

function updateFeedback(state) {
  if (state === "start") {
    tracingFeedback.textContent = "Trace the letter!";
    tracingFeedback.className = "tracing-feedback";
  } else {
    tracingFeedback.textContent = state;
  }
}

function resetTracing() {
  isDrawing = false;
  tracePoints = [];
  tracingComplete = false;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  drawLetterGuide(getCurrentLetter());
  tracingFeedback.textContent = "";
  tracingFeedback.className = "tracing-feedback";
  accuracyDisplay.classList.add("hidden");
  celebrationMessage.classList.add("hidden");
  tryAgainBtn.classList.add("hidden");
}

function showCelebration() {
  // Increment letters completed
  lettersCompleted++;
  
  // Check and save high score (higher is better)
  const metricKey = 'letters';
  const isNewRecord = HighScore.set('letter-explorer', metricKey, lettersCompleted, 'high');
  
  // Display count and best score
  const bestScore = HighScore.get('letter-explorer', metricKey);
  if (bestScore !== null) {
    if (isNewRecord && lettersCompleted === bestScore) {
      lettersCompletedDisplay.textContent = `🎉 ${lettersCompleted}/26 letters! 🏆 New Record!`;
      lettersCompletedDisplay.style.color = 'var(--color-red)';
      lettersCompletedDisplay.style.fontWeight = 'bold';
    } else {
      lettersCompletedDisplay.textContent = `${lettersCompleted}/26 letters (Best: ${bestScore})`;
      lettersCompletedDisplay.style.color = 'var(--text-light)';
      lettersCompletedDisplay.style.fontWeight = 'normal';
    }
  } else {
    lettersCompletedDisplay.textContent = `${lettersCompleted}/26 letters completed!`;
  }
  
  celebrationMessage.classList.remove("hidden");
  tryAgainBtn.classList.remove("hidden");
}

// ===== Audio =====
function playSound(type) {
  if (SoundToggle.isMuted()) return;
  
  // Use Web Audio API for simple sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case "chime":
      oscillator.frequency.value = 523.25; // C5
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
      
    case "whoosh":
      oscillator.frequency.value = 200;
      oscillator.type = "triangle";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
      
    case "celebration":
      // Play a simple arpeggio
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
      });
      break;
      
    case "boop":
      oscillator.frequency.value = 150;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
  }
}

function speakLetter() {
  const letter = getCurrentLetter();
  const data = letters[letter];
  
  if ("speechSynthesis" in window) {
    let text = "";
    switch (currentMode) {
      case "name":
        text = `${letter} is for ${data.word}`;
        break;
      case "sound":
        text = `${letter} says ${data.sound}. ${data.word} starts with ${letter}`;
        break;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}

// ===== Mode Switching =====
function setMode(mode) {
  currentMode = mode;
  
  // Update button states
  const modeBtns = modeToggle.querySelectorAll(".mode-btn");
  modeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  
  // Show/hide elements based on mode
  if (mode === "trace") {
    tracingArea.style.display = "block";
    tryAgainBtn.classList.add("hidden");
    resizeCanvas();
  } else {
    tracingArea.style.display = "none";
    tryAgainBtn.classList.add("hidden");
    accuracyDisplay.classList.add("hidden");
    celebrationMessage.classList.add("hidden");
  }
  
  // Speak the letter
  speakLetter();
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Navigation
  prevBtn.addEventListener("click", prevLetter);
  nextBtn.addEventListener("click", nextLetter);
  
  // Mode toggle
  modeToggle.addEventListener("click", (e) => {
    if (e.target.classList.contains("mode-btn")) {
      setMode(e.target.dataset.mode);
    }
  });
  
  // Try again
  tryAgainBtn.addEventListener("click", resetTracing);
  
  // Illustration tap
  illustration.addEventListener("click", () => {
    playSound("chime");
    speakLetter();
  });
  
  // Canvas touch events
  tracingCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  tracingCanvas.addEventListener("touchmove", draw, { passive: false });
  tracingCanvas.addEventListener("touchend", stopDrawing);
  tracingCanvas.addEventListener("touchcancel", stopDrawing);
  
  // Canvas mouse events
  tracingCanvas.addEventListener("mousedown", startDrawing);
  tracingCanvas.addEventListener("mousemove", draw);
  tracingCanvas.addEventListener("mouseup", stopDrawing);
  tracingCanvas.addEventListener("mouseleave", stopDrawing);
  
  // Swipe gestures on letter display
  let touchStartX = 0;
  letterDisplay.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  
  letterDisplay.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextLetter();
      } else {
        prevLetter();
      }
    }
  });
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevLetter();
    if (e.key === "ArrowRight") nextLetter();
    if (e.key === " ") speakLetter();
  });
}

// ===== Start Game =====
init();
