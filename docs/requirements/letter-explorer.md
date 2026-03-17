# Letter Explorer Game Requirements

## Overview

**Game Name**: Letter Explorer  
**Folder**: `games/letter-explorer/`  
**Purpose**: Interactive letter learning — see, hear, and trace letters  
**Target Age**: 5-7 years  
**Learning Value**: Letter recognition, letter writing, phonics, vocabulary

---

## Gameplay Flow

1. **Start Screen**
   - Large letter displayed (A-Z, starts at A)
   - Associated animal/object illustration (A = Apple, B = Bear, etc.)
   - "A is for Apple" text with audio pronunciation
   - Next/Previous arrows to navigate letters
   - Toggle between uppercase/lowercase view

2. **Letter Tracing Mode**
   - Dotted guide path showing letter shape
   - User traces with finger/mouse along the path
   - Real-time feedback: green (on path), yellow (close), red (off path)
   - Tracing accuracy percentage shown
   - "Try Again" button to restart tracing

3. **Phonics Mode (Optional)**
   - Toggle to hear letter sound instead of name
   - "A says /a/" with audio
   - Example word pronunciation: "Apple starts with A"

4. **Navigation**
   - Letter carousel at bottom (A B C D E ...)
   - Tap any letter to jump to it
   - Auto-advance to next letter after tracing completion

---

## Visual Design (GR-2)

### Layout
- **Letter Display Area** (top 40%)
  - Large letter (120px font size)
  - Rounded, playful sans-serif font
  - Soft shadow for depth
  - Background: light pastel (changes per letter)

- **Illustration Area** (top-right, 30% width)
  - Simple SVG or emoji-based illustration
  - Animates gently (e.g., apple bounces, bear waves)
  - Positioned to not block tracing area

- **Tracing Canvas** (middle 40%)
  - White background with subtle grid (10px spacing)
  - Dotted guide path (gray, 4px stroke, 8px gap)
  - User's trace appears in real-time (blue, 6px stroke)
  - Minimum touch target: entire canvas area

- **Controls** (bottom 20%)
  - Next/Previous arrows (large, 60x60px, rounded)
  - Letter carousel (horizontal scroll, each letter 48x48px)
  - Mode toggle buttons: "Name" / "Sound" / "Trace"
  - "Try Again" button (center, prominent)

### Colors
- **Primary**: Blue (#4A90E2) for interactive elements
- **Success**: Green (#5CB85C) for correct tracing
- **Warning**: Yellow (#F0AD4E) for close tracing
- **Error**: Red (#D9534F) for off-path tracing
- **Background**: Soft pastels per letter (A=light pink, B=light blue, etc.)

### Typography
- Font stack: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`
- Letter: 120px, bold
- Text labels: 24px
- Carousel letters: 32px

---

## Audio & Feedback (GR-3)

### Sound Effects
- **Letter reveal**: Gentle chime
- **Tracing start**: Soft "whoosh"
- **On-path tracing**: Subtle continuous sound
- **Correct completion**: Cheerful celebration chime
- **Try again**: Gentle "boop"

### Audio Content
- Letter name pronunciation (A, B, C...)
- Letter sound pronunciation (/a/, /b/, /k/...)
- Example word pronunciation ("Apple", "Bear", "Cat")
- All audio pre-loaded, no network requests

### Visual Feedback
- Letter pulses on reveal
- Tracing path glows when user is on track
- Confetti animation on successful completion
- "Great job!" text appears briefly on completion

---

## Interactions (GR-4)

### Touch/Mouse Support
- **Tracing**: Works with both touch drag and mouse drag
- **Navigation**: Tap/click arrows and carousel
- **Toggle buttons**: Tap/click to switch modes

### Gestures
- **Swipe left/right** on letter area → next/previous letter
- **Tap illustration** → plays associated sound (animal noise, object sound)
- **Long press tracing canvas** → resets trace

### Accessibility
- All buttons ≥ 48x48px
- High contrast between text and background
- Audio can be muted via global toggle (GR-3)
- No time pressure — child can trace at own pace

---

## Technical Requirements (GR-5, GR-6)

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Letter Explorer</title>
  <link rel="stylesheet" href="../css/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <button class="back-button">← Back to Games</button>
    
    <div class="letter-display">
      <div class="letter-large">A</div>
      <div class="illustration">🍎</div>
      <div class="letter-text">A is for Apple</div>
    </div>
    
    <div class="tracing-area">
      <canvas id="tracing-canvas"></canvas>
    </div>
    
    <div class="controls">
      <button class="nav-button prev">←</button>
      <div class="letter-carousel">
        <button class="letter-btn active">A</button>
        <button class="letter-btn">B</button>
        <!-- ... -->
      </div>
      <button class="nav-button next">→</button>
    </div>
    
    <div class="mode-toggle">
      <button class="mode-btn active">Name</button>
      <button class="mode-btn">Sound</button>
      <button class="mode-btn">Trace</button>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### JavaScript Features
- Canvas-based tracing with path detection
- Web Audio API for sound playback
- Letter data stored as JSON object:
  ```javascript
  const letters = {
    A: { name: "A", sound: "/a/", word: "Apple", emoji: "🍎", color: "#FFB6C1" },
    B: { name: "B", sound: "/b/", word: "Bear", emoji: "🐻", color: "#ADD8E6" },
    // ...
  };
  ```
- Tracing accuracy algorithm (distance from guide path)
- Smooth transitions between letters

### Performance
- All assets < 100KB total
- Canvas rendering optimized (requestAnimationFrame)
- Audio pre-loaded on game start
- No external dependencies

---

## Acceptance Criteria

### Must-Haves
- [ ] Game loads without console errors
- [ ] All 26 letters (A-Z) are accessible
- [ ] Each letter has an associated illustration
- [ ] Tracing mode works with touch and mouse
- [ ] Real-time feedback shows tracing accuracy
- [ ] Audio plays for letter name, sound, and example word
- [ ] "Back to Games" button returns to landing page
- [ ] Responsive layout works at 320px, 768px, 1920px
- [ ] All interactive elements ≥ 48x48px
- [ ] Visual style matches shared.css conventions

### Nice-to-Haves
- [ ] Phonics mode toggle
- [ ] Tracing accuracy percentage display
- [ ] Confetti celebration on completion
- [ ] Swipe gestures for navigation
- [ ] Illustration sounds on tap

---

## Testing Checklist

- [ ] Open game in browser — no console errors
- [ ] Navigate through all 26 letters
- [ ] Test tracing with mouse — smooth path drawing
- [ ] Test tracing with touch device — responsive
- [ ] Verify audio plays for each letter
- [ ] Check "Back to Games" button works
- [ ] Test at mobile width (320px) — layout adapts
- [ ] Test at tablet width (768px) — layout adapts
- [ ] Test at desktop width (1920px) — layout adapts
- [ ] Verify all buttons are easily tappable (≥ 48px)

---

## Dependencies

- **Shared CSS**: `../css/shared.css` (colors, fonts, button styles)
- **Audio Files**: 26 letter name sounds, 26 letter sounds, 26 example words
- **No External Libraries**: Vanilla JavaScript only

---

## Notes for Developer

- Use canvas for tracing — it's more performant than SVG for freehand drawing
- Pre-load all audio files on game start to avoid latency
- Store letter data as a JSON object for easy maintenance
- Tracing accuracy can be calculated using point-to-path distance algorithm
- Keep illustrations simple — use emoji or basic SVG shapes to stay under 500KB total
