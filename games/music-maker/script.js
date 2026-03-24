/**
 * Music Maker Game
 * Create music with colorful instruments
 */

// ===== Instrument Data =====
const instruments = {
  drum: { icon: '🥁', name: 'Drum', frequency: 150, type: 'triangle' },
  xylophone: { icon: '🎵', name: 'Xylophone', frequency: 523.25, type: 'sine' },
  piano: { icon: '🎹', name: 'Piano', frequency: 440, type: 'sine' },
  tambourine: { icon: '🪘', name: 'Tambourine', frequency: 800, type: 'triangle' },
  trumpet: { icon: '🎺', name: 'Trumpet', frequency: 349.23, type: 'sawtooth' },
  guitar: { icon: '🎸', name: 'Guitar', frequency: 329.63, type: 'triangle' },
  bell: { icon: '🔔', name: 'Bell', frequency: 1046.50, type: 'sine' },
  maracas: { icon: '🪇', name: 'Maracas', frequency: 600, type: 'sawtooth' }
};

const instrumentKeys = Object.keys(instruments);

// Magic song - simple catchy melody
const magicSong = [
  { instrument: 'xylophone', delay: 0 },
  { instrument: 'bell', delay: 200 },
  { instrument: 'xylophone', delay: 400 },
  { instrument: 'piano', delay: 600 },
  { instrument: 'bell', delay: 800 },
  { instrument: 'xylophone', delay: 1000 },
  { instrument: 'trumpet', delay: 1200 },
  { instrument: 'piano', delay: 1400 }
];

// ===== Game State =====
let isRecording = false;
let recording = [];
let recordingStartTime = 0;
let isPlaying = false;
let tempo = 2; // 1=slow, 2=medium, 3=fast
let audioContext = null;

// Tempo intervals in milliseconds
const tempoIntervals = {
  1: 400, // slow
  2: 200, // medium
  3: 100  // fast
};

// ===== DOM Elements =====
const instrumentGrid = document.getElementById('instrument-grid');
const instrumentBtns = document.querySelectorAll('.instrument-btn');
const recordBtn = document.getElementById('record-btn');
const playBtn = document.getElementById('play-btn');
const clearBtn = document.getElementById('clear-btn');
const magicBtn = document.getElementById('magic-btn');
const tempoSlider = document.getElementById('tempo-slider');
const tempoDisplay = document.getElementById('tempo-display');
const statusIndicator = document.getElementById('status-indicator');
const statusDot = statusIndicator.querySelector('.status-dot');
const statusText = statusIndicator.querySelector('.status-text');

// ===== Audio System =====
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function playInstrumentSound(instrumentKey) {
  initAudio();
  
  const instrument = instruments[instrumentKey];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = instrument.frequency;
  oscillator.type = instrument.type;
  
  // Envelope for natural sound
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  
  oscillator.start(now);
  oscillator.stop(now + 0.5);
  
  // Visual feedback
  const btn = document.querySelector(`[data-instrument="${instrumentKey}"]`);
  if (btn) {
    btn.classList.add('playing');
    setTimeout(() => btn.classList.remove('playing'), 300);
  }
  
  // Record if in recording mode
  if (isRecording) {
    const time = Date.now() - recordingStartTime;
    recording.push({ instrument: instrumentKey, time });
    playBtn.disabled = false;
  }
}

function playMagicSong() {
  if (isPlaying) return;
  
  initAudio();
  isPlaying = true;
  updateStatus('playing', 'Playing Magic Song...');
  instrumentGrid.classList.add('playing');
  magicBtn.disabled = true;
  recordBtn.disabled = true;
  
  const interval = tempoIntervals[tempo];
  
  magicSong.forEach((note, index) => {
    setTimeout(() => {
      playInstrumentSound(note.instrument);
      if (index === magicSong.length - 1) {
        setTimeout(() => {
          isPlaying = false;
          updateStatus('ready', 'Ready to Play!');
          instrumentGrid.classList.remove('playing');
          magicBtn.disabled = false;
          recordBtn.disabled = false;
        }, 500);
      }
    }, note.delay * (interval / 200)); // Adjust for tempo
  });
}

function playRecording() {
  if (isPlaying || recording.length === 0) return;
  
  initAudio();
  isPlaying = true;
  updateStatus('playing', 'Playing Recording...');
  instrumentGrid.classList.add('playing');
  playBtn.disabled = true;
  recordBtn.disabled = true;
  
  const interval = tempoIntervals[tempo];
  const speedMultiplier = interval / 200;
  
  recording.forEach((note, index) => {
    setTimeout(() => {
      playInstrumentSound(note.instrument);
      if (index === recording.length - 1) {
        setTimeout(() => {
          isPlaying = false;
          updateStatus('ready', 'Ready to Play!');
          instrumentGrid.classList.remove('playing');
          playBtn.disabled = false;
          recordBtn.disabled = false;
        }, 500);
      }
    }, note.time * speedMultiplier);
  });
}

// ===== Recording Controls =====
function toggleRecording() {
  if (isPlaying) return;
  
  isRecording = !isRecording;
  
  if (isRecording) {
    recording = [];
    recordingStartTime = Date.now();
    recordBtn.classList.add('active');
    updateStatus('recording', 'Recording...');
    instrumentGrid.classList.add('recording');
    playBtn.disabled = true;
  } else {
    recordBtn.classList.remove('active');
    updateStatus('ready', 'Ready to Play!');
    instrumentGrid.classList.remove('recording');
    if (recording.length > 0) {
      playBtn.disabled = false;
    }
  }
}

function clearRecording() {
  if (isPlaying || isRecording) return;
  
  recording = [];
  playBtn.disabled = true;
  updateStatus('ready', 'Recording Cleared');
  setTimeout(() => {
    updateStatus('ready', 'Ready to Play!');
  }, 1000);
}

// ===== Tempo Control =====
function updateTempo() {
  tempo = parseInt(tempoSlider.value);
  const tempoNames = { 1: 'Slow', 2: 'Medium', 3: 'Fast' };
  tempoDisplay.textContent = tempoNames[tempo];
}

// ===== Status Updates =====
function updateStatus(mode, text) {
  statusIndicator.className = 'status-indicator ' + mode;
  statusText.textContent = text;
}

// ===== Event Listeners =====
instrumentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const instrument = btn.dataset.instrument;
    playInstrumentSound(instrument);
  });
  
  // Touch support
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const instrument = btn.dataset.instrument;
    playInstrumentSound(instrument);
  }, { passive: false });
});

recordBtn.addEventListener('click', toggleRecording);
playBtn.addEventListener('click', playRecording);
clearBtn.addEventListener('click', clearRecording);
magicBtn.addEventListener('click', playMagicSong);
tempoSlider.addEventListener('input', updateTempo);

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '8') {
    const index = parseInt(e.key) - 1;
    if (index < instrumentKeys.length) {
      playInstrumentSound(instrumentKeys[index]);
    }
  }
  if (e.key === 'r' || e.key === 'R') toggleRecording();
  if (e.key === ' ' || e.key === 'Enter') {
    if (!playBtn.disabled) playRecording();
  }
  if (e.key === 'c' || e.key === 'C') clearRecording();
  if (e.key === 'm' || e.key === 'M') playMagicSong();
});

// Initialize
updateTempo();
updateStatus('ready', 'Ready to Play!');

// Resume audio context on first user interaction
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });
