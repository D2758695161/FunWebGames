/**
 * Sound Toggle System for FunWebGames
 * Global mute/unmute control that persists across all games
 * 
 * Usage:
 *   SoundToggle.init();  // Call once on page load
 *   SoundToggle.isMuted();  // Check if muted
 *   SoundToggle.toggle();  // Toggle mute state
 *   SoundToggle.setMuted(true);  // Set mute state
 * 
 * In game sound functions:
 *   if (SoundToggle.isMuted()) return;
 *   // ... play sound
 */

const SoundToggle = (function() {
  const STORAGE_KEY = 'funwebgames-sound-muted';
  let isMutedState = false;
  let toggleButton = null;
  
  // Initialize sound toggle
  function init() {
    // Load saved preference
    try {
      isMutedState = localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      isMutedState = false;
    }
    
    // Check for user preference for reduced motion/sound
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isMutedState = true;
    }
    
    // Create toggle button
    createToggleButton();
    
    // Update all audio contexts
    updateAllAudio();
    
    return isMutedState;
  }
  
  // Create toggle button in DOM
  function createToggleButton() {
    toggleButton = document.createElement('button');
    toggleButton.className = 'sound-toggle-btn';
    toggleButton.setAttribute('aria-label', isMutedState ? 'Unmute sound' : 'Mute sound');
    toggleButton.setAttribute('title', isMutedState ? 'Unmute' : 'Mute');
    toggleButton.textContent = isMutedState ? '🔇' : '🔊';
    
    toggleButton.addEventListener('click', toggle);
    
    // Add to page (typically in header)
    // Check for game-header first (individual games), then page-header (landing page)
    const header = document.querySelector('.game-header') || document.querySelector('.page-header');
    if (header) {
      const existingBtn = header.querySelector('.sound-toggle-btn');
      if (existingBtn) {
        existingBtn.remove();
      }
      // Insert after help button if exists, otherwise at end
      const helpBtn = header.querySelector('.help-btn');
      if (helpBtn && helpBtn.nextSibling) {
        header.insertBefore(toggleButton, helpBtn.nextSibling);
      } else {
        header.appendChild(toggleButton);
      }
    }
  }
  
  // Toggle mute state
  function toggle() {
    isMutedState = !isMutedState;
    savePreference();
    updateButton();
    updateAllAudio();
    
    // Play feedback sound if unmuting
    if (!isMutedState) {
      playFeedbackSound();
    }
  }
  
  // Set mute state
  function setMuted(muted) {
    isMutedState = muted;
    savePreference();
    updateButton();
    updateAllAudio();
  }
  
  // Check if muted
  function isMuted() {
    return isMutedState;
  }
  
  // Save preference to localStorage
  function savePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, isMutedState.toString());
    } catch (e) {
      // localStorage not available, continue silently
    }
  }
  
  // Update button appearance
  function updateButton() {
    if (!toggleButton) return;
    
    toggleButton.textContent = isMutedState ? '🔇' : '🔊';
    toggleButton.setAttribute('aria-label', isMutedState ? 'Unmute sound' : 'Mute sound');
    toggleButton.setAttribute('title', isMutedState ? 'Unmute' : 'Mute');
    
    if (isMutedState) {
      toggleButton.classList.add('muted');
    } else {
      toggleButton.classList.remove('muted');
    }
  }
  
  // Update all audio contexts (suspend/resume)
  function updateAllAudio() {
    // This will be called by individual games to check mute state
    // before playing sounds
    dispatchChangeEvent();
  }
  
  // Dispatch custom event for games to listen to
  function dispatchChangeEvent() {
    const event = new CustomEvent('soundtoggle-change', {
      detail: { muted: isMutedState }
    });
    document.dispatchEvent(event);
  }
  
  // Play feedback sound (always plays, even when muted)
  function playFeedbackSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio not supported
    }
  }
  
  // Public API
  return {
    init,
    toggle,
    setMuted,
    isMuted
  };
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundToggle;
}
