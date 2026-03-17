# Music Maker Game Requirements

## Overview

**Game Name**: Music Maker  
**Folder**: `games/music-maker/`  
**Purpose**: Tap colorful instruments to create music  
**Target Age**: 5-7 years  
**Learning Value**: Rhythm, cause-and-effect, creativity, auditory discrimination

---

## Gameplay Flow

1. **Instrument Grid**
   - 8 large instrument buttons arranged in a 2x4 or 3x3 grid
   - Each button shows a colorful instrument icon
   - Tap any instrument to play its sound with visual feedback

2. **Record Mode**
   - "Record" button toggles recording on/off
   - While recording: taps are saved to a sequence
   - "Play" button replays the recorded sequence
   - "Clear" button erases the recording

3. **Magic Song**
   - "Magic Song" button plays a pre-set melody
   - Visualizes which instruments are playing (buttons light up)
   - Inspires children to create their own songs

4. **Tempo Control**
   - Slider shown as turtle-to-rabbit scale
   - Adjusts playback speed of recordings and magic songs
   - Three preset speeds: Slow (turtle), Medium (running), Fast (rabbit)

---

## Visual Design (GR-2)

### Layout
- **Instrument Grid** (top 60%)
  - 2x4 grid on mobile, 3x3 with one empty on tablet/desktop
  - Each button: 120x120px minimum
  - Rounded corners (border-radius: 20px)
  - Spacing: 16px between buttons
  - Icons: large, colorful, instantly recognizable

- **Control Panel** (bottom 40%)
  - Record/Play/Clear buttons (large, 80x80px)
  - Magic Song button (prominent, star icon)
  - Tempo slider with turtle/rabbit icons
  - Visual indicator showing current tempo

### Instrument Buttons
- **Drum** 🥁 - Red background, pulse animation on tap
- **Xylophone** 🎵 - Blue background, bar animation on tap
- **Piano** 🎹 - White/black keys simplified, key press animation
- **Tambourine** 🪘 - Yellow background, shake animation on tap
- **Trumpet** 🎺 - Gold background, sound wave animation on tap
- **Guitar** 🎸 - Brown background, string vibration animation
- **Bell** 🔔 - Silver background, ring animation on tap
- **Maracas** 🥁 - Orange background, shake animation on tap

### Colors
- Each instrument has a distinct, vibrant color
- Active/inactive states use opacity (active = 100%, inactive = 60%)
- Recording mode: red pulse border around grid
- Playback mode: green pulse border around grid

### Typography
- Font stack: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`
- Button labels: 20px (optional — icons should be self-explanatory)
- Tempo labels: "Slow" "Medium" "Fast" in 18px

---

## Audio & Feedback (GR-3)

### Instrument Sounds
- **Drum**: Deep bass drum hit
- **Xylophone**: Bright, high-pitched note (C4)
- **Piano**: Middle C note, warm tone
- **Tambourine**: Jingly shake sound
- **Trumpet**: Short "ta-da" fanfare
- **Guitar**: Single plucked string (E string)
- **Bell**: Clear, ringing tone
- **Maracas**: Shaking percussion sound

### Sound Effects
- **Button tap**: Soft click + instrument sound
- **Record start**: "Beep boop" countdown
- **Record stop**: Satisfying "click"
- **Playback start**: Gentle chime
- **Magic song**: 8-note melody using various instruments

### Visual Feedback
- Button pulses (scale: 1.0 → 1.1 → 1.0) on tap
- Sound waves radiate from button during playback
- Recording indicator: red dot pulses in corner
- Playback indicator: green dot pulses in corner
- Magic song: buttons light up in sequence

---

## Interactions (GR-4)

### Touch/Mouse Support
- **Instrument buttons**: Tap/click to play
- **Record button**: Tap to toggle recording mode
- **Play button**: Tap to replay recording
- **Clear button**: Tap to erase recording
- **Magic Song**: Tap to play pre-set melody
- **Tempo slider**: Drag or tap to adjust speed

### Gestures
- **Swipe up/down** on tempo slider → adjust speed
- **Long press instrument** → continuous sound (optional)

### Accessibility
- All buttons ≥ 48x48px (actually 120x120px for instruments)
- High contrast between button icons and backgrounds
- Audio can be muted via global toggle (GR-3)
- Visual feedback for all actions (important for hearing-impaired)

---

## Technical Requirements (GR-5, GR-6)

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Maker</title>
  <link rel="stylesheet" href="../css/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <button class="back-button">← Back to Games</button>
    
    <div class="instrument-grid">
      <button class="instrument-btn" data-instrument="drum">
        <div class="instrument-icon">🥁</div>
        <div class="instrument-name">Drum</div>
      </button>
      <button class="instrument-btn" data-instrument="xylophone">
        <div class="instrument-icon">🎵</div>
        <div class="instrument-name">Xylophone</div>
      </button>
      <!-- 6 more instruments -->
    </div>
    
    <div class="control-panel">
      <div class="record-controls">
        <button class="control-btn record" id="record-btn">
          <div class="control-icon">⏺️</div>
          <div class="control-label">Record</div>
        </button>
        <button class="control-btn play" id="play-btn">
          <div class="control-icon">▶️</div>
          <div class="control-label">Play</div>
        </button>
        <button class="control-btn clear" id="clear-btn">
          <div class="control-icon">🗑️</div>
          <div class="control-label">Clear</div>
        </button>
      </div>
      
      <button class="magic-btn" id="magic-btn">
        <div class="magic-icon">✨</div>
        <div class="magic-label">Magic Song</div>
      </button>
      
      <div class="tempo-control">
        <div class="tempo-label">Tempo:</div>
        <div class="tempo-slider">
          <span class="tempo-icon">🐢</span>
          <input type="range" min="1" max="3" value="2" id="tempo-slider">
          <span class="tempo-icon">🐇</span>
        </div>
        <div class="tempo-display" id="tempo-display">Medium</div>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### JavaScript Features
- Audio playback using Web Audio API or `<audio>` elements
- Recording functionality:
  ```javascript
  let recording = [];
  let isRecording = false;
  
  function recordNote(instrument, timestamp) {
    if (isRecording) {
      recording.push({ instrument, time: timestamp });
    }
  }
  ```
- Playback sequencer with tempo control
- Magic song pre-defined as array of notes:
  ```javascript
  const magicSong = [
    { instrument: 'xylophone', time: 0 },
    { instrument: 'bell', time: 200 },
    { instrument: 'xylophone', time: 400 },
    // ...
  ];
  ```
- Visual pulse animations using CSS transforms

### Performance
- All audio files pre-loaded on game start
- Total asset size < 300KB (use short, compressed audio clips)
- No external dependencies
- Optimized for touch devices (passive event listeners)

---

## Acceptance Criteria

### Must-Haves
- [ ] Game loads without console errors
- [ ] All 8 instruments play distinct sounds
- [ ] Visual feedback on every button tap
- [ ] Record mode captures sequence of taps
- [ ] Play button replays recording accurately
- [ ] Clear button erases recording
- [ ] Magic Song button plays a melody
- [ ] Tempo slider adjusts playback speed
- [ ] "Back to Games" button returns to landing page
- [ ] Responsive layout works at 320px, 768px, 1920px
- [ ] All interactive elements ≥ 48x48px
- [ ] Visual style matches shared.css conventions

### Nice-to-Haves
- [ ] Continuous sound on long press
- [ ] Visual metronome during playback
- [ ] Save/load recordings (localStorage)
- [ ] Multiple magic songs to choose from
- [ ] Instrument volume controls

---

## Testing Checklist

- [ ] Open game in browser — no console errors
- [ ] Tap each instrument — sound plays + visual feedback
- [ ] Test recording: record 5 notes, play back
- [ ] Test clear: recording erased after clear
- [ ] Test magic song: plays melody with visual cues
- [ ] Test tempo slider: slow/medium/fast speeds work
- [ ] Check "Back to Games" button works
- [ ] Test at mobile width (320px) — grid adapts to 2 columns
- [ ] Test at tablet width (768px) — grid adapts to 3 columns
- [ ] Test at desktop width (1920px) — grid looks good
- [ ] Verify all buttons are easily tappable (≥ 48px)

---

## Dependencies

- **Shared CSS**: `../css/shared.css` (colors, fonts, button styles)
- **Audio Files**: 8 instrument sounds + magic song melody
- **No External Libraries**: Vanilla JavaScript only

---

## Notes for Developer

- Use short audio clips (0.5-1 second each) to keep file size small
- Pre-load all audio on game start to avoid latency
- Use CSS animations for visual feedback — they're smoother than JS
- Recording timestamp can be relative (milliseconds since recording start)
- Tempo affects playback interval: slow = 400ms, medium = 200ms, fast = 100ms
- Magic song should be simple and catchy — 8 notes max for first version
