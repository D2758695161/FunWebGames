# Counting Garden Game Requirements

## Overview

Count objects in a garden scene and tap the right number. Children practice counting 1-10 by observing animated garden scenes with flowers, butterflies, bees, and fruits.

## Functional Requirements

### CG-1: Garden Scene
- Beautiful garden background with grass, sky, flowers
- Objects to count: flowers, butterflies, bees, ladybugs, fruits, birds, etc.
- Objects gently animate (butterflies flutter, flowers sway, bees buzz)
- Objects clearly visible and countable (not overlapping too much)
- Scene changes each round

### CG-2: Counting Questions
- Prompt at top: "How many butterflies?"
- 3 number options displayed as large buttons (e.g., "3", "5", "7")
- Only one correct answer
- Numbers range from 1 to 10
- 10 rounds per session

### CG-3: Gameplay Mechanics
- Tap a number button to answer
- Correct answer: objects light up one by one as they're "counted" (sequential highlight)
- Wrong answer: gentle shake animation, try again (no penalty)
- Score shown as collected stars (1 star per correct answer)
- Round advances automatically after correct answer
- Game complete after 10 rounds → celebration

### CG-4: Visual Feedback
- Correct answer: each object highlights sequentially with number callout
- Counting animation: 1... 2... 3... with visual indicator
- Star awarded: flies up to score display
- Wrong answer: buttons shake gently, no negative feedback
- Progress indicator: shows current round (e.g., "Round 3/10")

### CG-5: Audio Feedback
- Correct answer: cheerful chime + counting audio ("One... two... three!")
- Each object counted: soft "ding" sound
- Wrong answer: gentle "boop" (encouraging, not punishing)
- Round complete: short success sound
- Game complete: celebration music + "You did it!"
- Background music: optional, muted by default

### CG-6: Navigation
- "Back to Games" button always visible
- "Play Again" button after game completion
- Progress indicator shows rounds completed

## Technical Requirements

### File Structure
```
games/counting-garden/
  index.html          ← Main game page
  style.css           ← Game-specific styles
  script.js           ← Game logic
  assets/
    sounds/
    images/
      objects/        ← SVG garden objects (butterflies, flowers, etc.)
```

### Code Requirements
- Import shared CSS
- Vanilla ES6+ JavaScript
- SVG for garden objects (scalable, animated)
- CSS animations for object movement (flutter, sway)
- Sequential counting animation with delays
- Web Audio API or `<audio>` for sounds
- No external dependencies
- Total asset size: < 500KB

### Accessibility
- Touch targets: number buttons minimum 60x60px
- High contrast between objects and background
- Large, clear numbers
- Works on mobile and desktop

## Acceptance Criteria

- [ ] Garden scene displays with animated objects
- [ ] Prompt clearly shows what to count
- [ ] 3 number options displayed as large buttons
- [ ] Correct answer triggers sequential counting animation
- [ ] Objects highlight one by one during counting
- [ ] Wrong answer triggers gentle shake, allows retry
- [ ] Star awarded for correct answers
- [ ] 10 rounds per session
- [ ] Progress indicator shows current round
- [ ] Game completion triggers celebration
- [ ] "Back to Games" button works
- [ ] "Play Again" button restarts game
- [ ] Works on mobile (320px) and desktop (1920px)
- [ ] No console errors
- [ ] Loads in under 2 seconds

## Learning Value

- Counting 1-10
- Number recognition
- Observation skills
- One-to-one correspondence
- Visual discrimination

## Related Requirements

- GR-2: Visual Design (global requirement)
- GR-3: Audio & Feedback (global requirement)
- GR-4: Responsive & Touch (global requirement)
- GR-5: Performance & Compatibility (global requirement)
