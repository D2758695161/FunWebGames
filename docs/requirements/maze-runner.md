# Maze Runner Game Requirements

## Overview

**Game Name**: Maze Runner  
**Folder**: `games/maze-runner/`  
**Purpose**: Guide a cute character through simple mazes  
**Target Age**: 5-7 years  
**Learning Value**: Problem solving, planning, spatial navigation

---

## Gameplay Flow

1. **Character Selection**
   - Choose from 3 characters at start: Bunny 🐰, Puppy 🐶, or Kitty 🐱
   - Each character has unique appearance but same gameplay
   - Selection persists for the session

2. **Maze Navigation**
   - Top-down view of maze with walls and pathways
   - Character starts at entrance (bottom of maze)
   - Goal is at exit (top of maze) — carrot 🥕 for bunny, bone 🦴 for puppy, fish 🐟 for kitty
   - Player guides character to goal

3. **Movement Controls**
   - **Option 1**: On-screen arrow buttons (up, down, left, right)
   - **Option 2**: Drag character directly along valid paths
   - Both methods work simultaneously

4. **Collectibles**
   - Stars ⭐ scattered along the path (bonus, not required)
   - Collecting a star triggers happy sound + sparkle animation
   - Counter shows stars collected

5. **Completion**
   - Reach the goal → celebration animation
   - Character does happy dance
   - "You did it!" message with star count
   - "Next Maze" button appears

6. **Progression**
   - 8-10 mazes of increasing difficulty
   - Timer shown as friendly hourglass (no pressure)
   - Current maze number displayed (e.g., "Maze 3 of 10")

---

## Visual Design (GR-2)

### Layout
- **Game Area** (top 70%)
  - Maze drawn with thick walls (8px stroke)
  - Character: large emoji or simple SVG (48x48px)
  - Goal: large emoji (64x64px) with gentle pulse animation
  - Stars: yellow ⭐ (32x32px) with subtle float animation

- **Controls** (bottom 30%)
  - Arrow buttons in cross formation (up, down, left, right)
  - Each button: 60x60px, rounded corners
  - "Next Maze" button (hidden until completion)
  - Info panel: maze number, star count, timer

### Maze Design
- **Maze 1-3**: Simple 3x3 grid, obvious path
- **Maze 4-6**: 5x5 grid, one dead end
- **Maze 7-8**: 7x7 grid, multiple dead ends
- **Maze 9-10**: 9x9 grid, complex paths

- Wall color: Dark gray (#666)
- Path color: Light beige (#F5F5DC)
- Character color: Matches chosen animal
- Goal color: Bright orange (carrot), white (bone), orange (fish)

### Character Selection Screen
- Large character buttons (120x120px)
- Character name below each button
- "Start Game" button at bottom
- Background: soft gradient matching character theme

### Colors
- **Walls**: Dark gray (#666) with subtle shadow
- **Paths**: Light beige (#F5F5DC) or light green (#90EE90)
- **Character**: Colorful emoji or SVG
- **Goal**: Bright, contrasting color to stand out
- **Stars**: Gold (#FFD700) with yellow glow
- **UI**: Soft pastels matching shared.css

### Typography
- Font stack: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`
- Maze number: 24px
- Star count: 20px with star emoji prefix
- Timer: 18px, friendly hourglass emoji ⏳

---

## Audio & Feedback (GR-3)

### Sound Effects
- **Character selection**: Soft "pop" on tap
- **Movement**: Light footstep sound (different per character)
- **Star collection**: Cheerful "ding!" + sparkle sound
- **Wall collision**: Gentle "boop" (if using arrow controls)
- **Goal reached**: Celebration fanfare + character-specific sound
- **Next maze**: Page turn sound

### Music
- Optional background music (calm, exploratory tune)
- Muted by default, toggle in corner
- Volume slider if enabled

### Visual Feedback
- Character bounces slightly on each move
- Star sparkles and disappears when collected
- Goal pulses gently to attract attention
- Wall collision: character shakes slightly (if using arrow controls)
- Completion: confetti animation + character dance

---

## Interactions (GR-4)

### Touch/Mouse Support
- **Arrow buttons**: Tap/click to move character one step
- **Character drag**: Touch/mouse drag to move along valid paths
- **Character selection**: Tap/click to choose
- **Next Maze**: Tap/click to advance

### Movement Logic
- **Arrow controls**: Character moves one grid cell per tap
  - Cannot move through walls
  - Gentle shake feedback on invalid move

- **Drag controls**: Character follows finger/mouse
  - Snaps to nearest valid path position
  - Smooth animation between cells
  - Cannot drag through walls (stops at wall boundary)

### Accessibility
- Arrow buttons ≥ 48x48px (actually 60x60px)
- Character draggable area ≥ 48x48px
- High contrast between walls and paths
- Audio can be muted via global toggle (GR-3)
- No time pressure — child can solve at own pace

---

## Technical Requirements (GR-5, GR-6)

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maze Runner</title>
  <link rel="stylesheet" href="../css/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Character Selection Screen (initially visible) -->
  <div class="character-select active">
    <h1>Choose Your Friend!</h1>
    <div class="character-grid">
      <button class="character-btn" data-character="bunny">
        <div class="character-icon">🐰</div>
        <div class="character-name">Bunny</div>
      </button>
      <button class="character-btn" data-character="puppy">
        <div class="character-icon">🐶</div>
        <div class="character-name">Puppy</div>
      </button>
      <button class="character-btn" data-character="kitty">
        <div class="character-icon">🐱</div>
        <div class="character-name">Kitty</div>
      </button>
    </div>
    <button class="start-btn">Start Game</button>
  </div>
  
  <!-- Game Screen (initially hidden) -->
  <div class="game-screen">
    <button class="back-button">← Back to Games</button>
    
    <div class="game-area">
      <canvas id="maze-canvas"></canvas>
    </div>
    
    <div class="game-info">
      <div class="maze-counter">Maze <span id="current-maze">1</span> of 10</div>
      <div class="star-counter">⭐ <span id="stars-collected">0</span></div>
      <div class="timer">⏳ <span id="timer">0:00</span></div>
    </div>
    
    <div class="controls">
      <div class="arrow-controls">
        <button class="arrow-btn up">↑</button>
        <div class="arrow-row">
          <button class="arrow-btn left">←</button>
          <button class="arrow-btn down">↓</button>
          <button class="arrow-btn right">→</button>
        </div>
      </div>
    </div>
    
    <div class="completion-screen hidden">
      <div class="completion-message">
        <h2>You did it! 🎉</h2>
        <p>Stars collected: ⭐ <span id="final-stars">0</span></p>
        <button class="next-btn">Next Maze →</button>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### JavaScript Features
- Maze generation algorithm (pre-defined or procedural):
  ```javascript
  const mazes = [
    { // Maze 1
      grid: [
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,1,1,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1]
      ],
      start: {x: 2, y: 3},
      goal: {x: 2, y: 1},
      stars: [{x: 1, y: 3}, {x: 3, y: 1}]
    },
    // ... 9 more mazes
  ];
  ```
- Character movement with collision detection
- Drag controls with path validation
- Star collection tracking
- Timer (optional, non-competitive)
- Character state persistence

### Performance
- Canvas rendering for smooth animation
- Pre-load all mazes on game start
- Total asset size < 200KB (no images, just canvas drawing)
- No external dependencies

---

## Acceptance Criteria

### Must-Haves
- [ ] Game loads without console errors
- [ ] Character selection screen works
- [ ] All 8-10 mazes are playable
- [ ] Arrow controls move character correctly
- [ ] Drag controls work smoothly
- [ ] Character cannot move through walls
- [ ] Stars can be collected with sound/visual feedback
- [ ] Goal triggers completion celebration
- [ ] "Next Maze" advances to next maze
- [ ] "Back to Games" button returns to landing page
- [ ] Responsive layout works at 320px, 768px, 1920px
- [ ] All interactive elements ≥ 48x48px
- [ ] Visual style matches shared.css conventions

### Nice-to-Haves
- [ ] Timer display (non-competitive)
- [ ] Character-specific sounds
- [ ] Smooth character animations
- [ ] Maze preview before starting
- [ ] Restart current maze button

---

## Testing Checklist

- [ ] Open game in browser — no console errors
- [ ] Select each character — game starts correctly
- [ ] Test arrow controls — character moves one cell at a time
- [ ] Test drag controls — character follows finger smoothly
- [ ] Verify walls block movement
- [ ] Collect stars — counter updates, sound plays
- [ ] Reach goal — completion screen appears
- [ ] Click "Next Maze" — advances to next maze
- [ ] Check "Back to Games" button works
- [ ] Test at mobile width (320px) — controls fit screen
- [ ] Test at tablet width (768px) — maze looks good
- [ ] Test at desktop width (1920px) — layout adapts
- [ ] Verify all buttons are easily tappable (≥ 48px)

---

## Dependencies

- **Shared CSS**: `../css/shared.css` (colors, fonts, button styles)
- **No External Libraries**: Vanilla JavaScript only
- **Canvas API**: For maze and character rendering

---

## Notes for Developer

- Use canvas for maze rendering — it's more flexible than HTML/CSS for grids
- Pre-define all 10 mazes as JSON arrays for simplicity
- Character movement should be grid-based (cell by cell) for clarity
- Drag controls should snap to grid positions for precision
- Keep collision detection simple: check if next cell is a wall (value 1)
- Timer is optional and should not create pressure — just for fun
- Character selection can use localStorage to remember choice across sessions
