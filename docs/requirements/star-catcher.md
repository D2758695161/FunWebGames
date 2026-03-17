# Star Catcher Game Requirements

## Overview

**Game Name**: Star Catcher  
**Folder**: `games/star-catcher/`  
**Purpose**: Move a basket to catch falling stars  
**Target Age**: 5-7 years  
**Learning Value**: Hand-eye coordination, reaction time, tracking moving objects

---

## Gameplay Flow

1. **Game Start**
   - Basket 🧺 appears at bottom center of screen
   - Stars ⭐ begin falling from top of screen
   - Score counter starts at 0

2. **Catching Mechanics**
   - Player moves basket left/right to catch falling stars
   - Catch a star → +1 point, sparkle effect, cheerful sound
   - Stars disappear on catch

3. **Special Items**
   - **Rainbow Star** 🌈 (rare, 10% chance): worth 5 points, extra celebration
   - **Moon** 🌙 (occasional): worth 3 points, gentle chime
   - **Planet** 🪐 (occasional): worth 2 points, space sound
   - **Rain Cloud** ☁️ (occasional): slows basket speed briefly, no penalty

4. **Round Duration**
   - Round ends after 60 seconds OR when 20 stars have fallen
   - Timer counts down visibly
   - Star counter shows progress (e.g., "5/20 stars")

5. **Completion**
   - Game over screen shows final score
   - Score displayed as collected star icons (not abstract numbers)
   - "Play Again" button to restart
   - "Back to Games" button to exit

---

## Visual Design (GR-2)

### Layout
- **Game Area** (full screen, minus controls)
  - Night sky background (dark blue gradient)
  - Twinkling stars in background (CSS animation)
  - Falling objects: stars, moons, planets, clouds
  - Basket at bottom, movable left/right

- **Score Display** (top of screen)
  - Large star icons showing current score
  - Each star = 1 point (rainbow star = 5 stars)
  - Horizontal layout, wraps if needed

- **Timer/Counter** (top corners)
  - Top-left: Timer (e.g., "60s")
  - Top-right: Star counter (e.g., "5/20")

- **Controls** (bottom corners, optional)
  - Left arrow button ←
  - Right arrow button →
  - These are optional — primary control is dragging basket

### Falling Objects
- **Star** ⭐ - Yellow (#FFD700), medium size (32x32px), medium speed
- **Rainbow Star** 🌈 - Rainbow gradient, large size (48x48px), slow speed, sparkles
- **Moon** 🌙 - White with gray, medium size (36x36px), medium speed
- **Planet** 🪐 - Blue/green, medium size (36x36px), medium speed
- **Rain Cloud** ☁️ - Gray, large size (40x40px), slow speed, drips animation

### Basket Design
- Wicker basket emoji 🧺 or custom SVG
- Size: 80x40px (wide enough to catch objects)
- Color: Brown (#8B4513) with yellow highlights
- Animation: Gentle bounce when idle, squish on star catch

### Background
- Night sky: Dark blue gradient (#0a0a2a to #1a1a4a)
- Twinkling stars: Small white dots with opacity animation
- Optional: Gentle moon in corner (static)

### Colors
- **Background**: Dark blue night sky
- **Stars**: Yellow (#FFD700) with white glow
- **Rainbow Star**: CSS gradient animation
- **Moon**: White (#FFF) with gray shadows
- **Planet**: Blue (#4169E1) and green (#32CD32)
- **Cloud**: Light gray (#D3D3D3) with rain drops
- **Basket**: Brown (#8B4513) with highlights
- **UI**: Bright yellow for score, white for timer

### Typography
- Font stack: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`
- Timer: 24px, white, monospace for numbers
- Counter: 24px, white
- Score stars: 32px emoji or SVG icons

---

## Audio & Feedback (GR-3)

### Sound Effects
- **Star catch**: Cheerful "ding!" + sparkle sound
- **Rainbow star catch**: Magical "twinkle" + fanfare
- **Moon catch**: Gentle "boing"
- **Planet catch**: Spacey "blip"
- **Cloud touch**: Soft "plop" + rain sound
- **Game start**: "Ready, set, go!" countdown
- **Game over**: Gentle "aww" then celebration if score > 0

### Background Music
- Optional calm night music (crickets, gentle wind)
- Muted by default, toggle in corner
- Volume slider if enabled

### Visual Feedback
- **Star catch**: Star explodes into sparkles, basket bounces
- **Rainbow star**: Screen flashes rainbow colors briefly
- **Moon/Planet**: Gentle pulse on catch
- **Cloud**: Basket slows with visual "slime" effect
- **Score update**: New star icon pops in with scale animation
- **Timer**: Color changes as time runs low (green → yellow → red)

---

## Interactions (GR-4)

### Touch/Mouse Support
- **Basket drag**: Primary control method
  - Touch: drag basket left/right
  - Mouse: click and drag basket
  - Basket follows finger/mouse smoothly

- **Arrow buttons** (optional secondary control):
  - Left arrow ←: moves basket left continuously while held
  - Right arrow →: moves basket right continuously while held
  - Buttons are 60x60px, rounded corners

### Movement Logic
- Basket constrained to bottom of screen
- Basket cannot move off-screen left/right
- Basket speed: 5px per frame (adjustable for cloud slowdown)
- Falling objects: random horizontal position, constant vertical speed
- Collision detection: basket area vs object position

### Accessibility
- Basket draggable area ≥ 48x40px
- Arrow buttons ≥ 48x48px (actually 60x60px)
- High contrast between objects and background
- Audio can be muted via global toggle (GR-3)
- No time pressure beyond the 60-second limit

---

## Technical Requirements (GR-5, GR-6)

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Star Catcher</title>
  <link rel="stylesheet" href="../css/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <button class="back-button">← Back to Games</button>
    
    <div class="game-area">
      <canvas id="game-canvas"></canvas>
      
      <div class="score-display" id="score-display">
        <!-- Star icons will be added here dynamically -->
      </div>
      
      <div class="timer-display" id="timer-display">60s</div>
      <div class="counter-display" id="counter-display">0/20</div>
    </div>
    
    <div class="controls">
      <button class="arrow-btn left">←</button>
      <button class="arrow-btn right">→</button>
    </div>
    
    <div class="game-over hidden">
      <div class="game-over-content">
        <h2>Game Over! 🌟</h2>
        <div class="final-score" id="final-score">
          <!-- Final score stars will be displayed here -->
        </div>
        <div class="buttons">
          <button class="play-again-btn">Play Again</button>
          <button class="back-to-games-btn">Back to Games</button>
        </div>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### JavaScript Features
- Game loop using `requestAnimationFrame`:
  ```javascript
  let score = 0;
  let starsCaught = 0;
  let timeLeft = 60;
  let basketPosition = { x: canvas.width / 2, y: canvas.height - 50 };
  let fallingObjects = [];
  
  function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
  }
  ```
- Falling object generator:
  ```javascript
  function spawnObject() {
    const types = ['star', 'star', 'star', 'star', 'star', 
                   'star', 'star', 'star', 'star', 'rainbow',
                   'moon', 'planet', 'cloud'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    fallingObjects.push({
      type,
      x: Math.random() * canvas.width,
      y: -50,
      speed: getSpeed(type),
      size: getSize(type)
    });
  }
  ```
- Collision detection:
  ```javascript
  function checkCollision(object) {
    const basketWidth = 80;
    const basketHeight = 40;
    const basketLeft = basketPosition.x - basketWidth / 2;
    const basketRight = basketPosition.x + basketWidth / 2;
    const basketTop = basketPosition.y - basketHeight / 2;
    
    return (
      object.y + object.size > basketTop &&
      object.x > basketLeft &&
      object.x < basketRight
    );
  }
  ```
- Score tracking with visual star icons
- Timer countdown with visual feedback

### Performance
- Canvas rendering for smooth animation (60 FPS)
- Object pooling for falling objects (reuse instead of create/destroy)
- Throttled spawn rate (one object every 1-2 seconds)
- Total asset size < 150KB (no images, just canvas/emoji)
- No external dependencies

---

## Acceptance Criteria

### Must-Haves
- [ ] Game loads without console errors
- [ ] Basket moves smoothly with drag controls
- [ ] Arrow buttons work (optional but nice)
- [ ] Stars fall from top of screen
- [ ] Catching stars increases score
- [ ] Score displayed as star icons (visual, not numbers)
- [ ] Timer counts down from 60 seconds
- [ ] Game ends after 60 seconds OR 20 stars fallen
- [ ] Game over screen shows final score
- [ ] "Play Again" restarts game
- [ ] "Back to Games" button returns to landing page
- [ ] Responsive layout works at 320px, 768px, 1920px
- [ ] All interactive elements ≥ 48x48px
- [ ] Visual style matches shared.css conventions

### Nice-to-Haves
- [ ] Rainbow stars, moons, planets as special items
- [ ] Rain clouds that slow basket temporarily
- [ ] Twinkling background stars
- [ ] Basket bounce animation on catch
- [ ] High score tracking (localStorage)

---

## Testing Checklist

- [ ] Open game in browser — no console errors
- [ ] Drag basket left/right — smooth movement
- [ ] Test arrow buttons — basket moves continuously
- [ ] Catch stars — score increases, sound plays
- [ ] Verify timer counts down correctly
- [ ] Wait 60 seconds — game over screen appears
- [ ] Catch 20 stars — game over screen appears
- [ ] Click "Play Again" — game restarts
- [ ] Check "Back to Games" button works
- [ ] Test at mobile width (320px) — basket fits screen
- [ ] Test at tablet width (768px) — game area looks good
- [ ] Test at desktop width (1920px) — layout adapts
- [ ] Verify all buttons are easily tappable (≥ 48px)

---

## Dependencies

- **Shared CSS**: `../css/shared.css` (colors, fonts, button styles)
- **No External Libraries**: Vanilla JavaScript only
- **Canvas API**: For game rendering and animation

---

## Notes for Developer

- Use canvas for rendering — it's more performant than DOM for many moving objects
- Implement object pooling to avoid garbage collection stutter
- Falling object spawn rate: start at 1 per second, can increase slightly as game progresses
- Basket movement should use delta-time for smoothness across devices
- Score display should use actual star emoji/icons, not numbers, for visual appeal
- Timer color change: green (60-30s), yellow (29-10s), red (9-0s)
- Cloud slowdown effect: reduce basket speed by 50% for 3 seconds
- Keep collision detection simple: bounding box is fine for this age group
