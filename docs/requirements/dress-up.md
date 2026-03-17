# Dress Up Game Requirements

## Overview

**Game Name**: Dress Up  
**Folder**: `games/dress-up/`  
**Purpose**: Drag clothing and accessories onto a character  
**Target Age**: 5-7 years  
**Learning Value**: Creativity, categorization, fine motor skills, self-expression

---

## Gameplay Flow

1. **Character Selection**
   - Choose character at start: Boy 👦 or Girl 👧
   - Character appears in center of screen
   - Selection persists for the session

2. **Category Navigation**
   - Categories: Hats, Tops, Bottoms, Shoes, Accessories
   - Swipe or tap category buttons to switch
   - Current category highlighted

3. **Item Selection**
   - Items displayed as scrollable carousel in current category
   - Swipe left/right through items
   - Tap an item to see preview (ghost overlay on character)

4. **Dressing**
   - Drag item from carousel onto character
   - Item snaps to correct body position
   - Multiple items can be layered (e.g., hat over hair, glasses over eyes)

5. **Special Features**
   - **Randomize**: Generates random outfit
   - **Fashion Show**: Character does spin animation with current outfit
   - **Save Outfit**: Downloads screenshot of character
   - **Reset**: Removes all items, back to base character

---

## Visual Design (GR-2)

### Layout
- **Character Area** (center, 60% of screen)
  - Character displayed large (200x300px)
  - Neutral pose, facing forward
  - Items layer on top in correct positions

- **Category Tabs** (top, below back button)
  - Horizontal row of category buttons
  - Each button: 80x60px, rounded corners
  - Active category highlighted with border/badge

- **Item Carousel** (bottom, 30% of screen)
  - Horizontal scrollable list of items
  - Each item: 80x80px preview
  - Current item centered with larger size (100x100px)

- **Action Buttons** (floating, corners)
  - Randomize (top-right): 🎲 icon
  - Fashion Show (bottom-right): 💃 icon
  - Save (bottom-left): 💾 icon
  - Reset (top-left): 🔄 icon

### Character Design
- **Boy**: Simple cartoon boy, neutral expression, basic hair
- **Girl**: Simple cartoon girl, neutral expression, basic hair
- **Style**: Rounded, friendly, minimal detail
- **Base outfit**: Plain white shirt, blue pants (boy) / dress (girl)
- **Size**: 200x300px centered on screen

### Clothing Items

#### Hats (10+ items)
- Baseball cap 🧢 (red, blue, green)
- Cowboy hat 🤠
- Crown 👑
- Beanie 🧶 (multiple colors)
- Sun hat 🌞
- Wizard hat 🧙
- Party hat 🎉
- Animal ears 🐰🐱🐶
- Flower crown 🌸

#### Tops (10+ items)
- T-shirts (red, blue, yellow, green, pink)
- Striped shirt 📊
- Hoodie (gray, purple)
- Sweater (orange, brown)
- Jacket (denim, leather)
- Superhero cape 🦸
- Doctor coat 🩺
- Chef apron 👨‍🍳

#### Bottoms (8+ items)
- Jeans 👖 (blue, black)
- Shorts (red, green)
- Skirt (pink, yellow, plaid)
- Leggings (purple, gray)
- Pajama pants 🛌
- Sports shorts ⚽

#### Shoes (8+ items)
- Sneakers (white, black, red)
- Boots (brown, black)
- Sandals 🩴
- Ballet flats 👠
- Rain boots 🌧️
- Slippers 🐻

#### Accessories (10+ items)
- Glasses (round, square, sunglasses) 👓
- Necklaces (star, heart, pearl) 💎
- Bracelets (rainbow, beaded) 📿
- Watches ⌚
- Backpacks (red, blue, polka dot) 🎒
- Wings (angel, butterfly, fairy) ✨
- Magic wands 🪄
- Microphone 🎤
- Camera 📷

### Colors
- **Character**: Skin tone, hair color, base outfit
- **Clothing**: Bright, saturated colors
- **UI**: Soft pastels matching shared.css
- **Active item**: Yellow border/highlight
- **Category tabs**: Gradient backgrounds per category

### Typography
- Font stack: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`
- Category names: 18px
- Item names (optional): 14px below preview
- Button labels: 16px with emoji

---

## Audio & Feedback (GR-3)

### Sound Effects
- **Character selection**: Soft "pop"
- **Category switch**: Page turn sound
- **Item swipe**: Gentle swipe sound
- **Item tap (preview)**: Soft "whoosh"
- **Item drag**: Light fabric rustle
- **Item snap**: Satisfying "click"
- **Randomize**: Magic "twinkle" sound
- **Fashion show**: Runway music + applause
- **Save**: Camera shutter sound
- **Reset**: Gentle "swoosh"

### Music
- Optional cheerful background music
- Muted by default, toggle in corner
- Changes during fashion show (runway music)

### Visual Feedback
- **Item preview**: Ghost overlay on character with 50% opacity
- **Drag**: Item follows finger with slight scale up (1.1x)
- **Snap**: Item pops into place with scale animation (1.1 → 1.0)
- **Fashion show**: Character spins 360° with disco lights
- **Randomize**: Items fly in from all sides
- **Save**: Camera flash animation

---

## Interactions (GR-4)

### Touch/Mouse Support
- **Character selection**: Tap/click to choose
- **Category tabs**: Tap/click to switch categories
- **Item carousel**: Swipe/touch-drag to scroll, tap to preview
- **Item drag**: Touch/mouse drag from carousel to character
- **Action buttons**: Tap/click to trigger actions

### Drag-and-Drop Logic
- **Drag start**: Item lifts from carousel with scale up
- **Drag move**: Item follows finger/mouse
- **Drag over character**: Visual highlight shows valid drop zone
- **Drop**: Item snaps to correct body position
- **Drop outside**: Item returns to carousel

### Snap Positions
- **Hats**: Top of head (y = character.y - 30)
- **Tops**: Upper body (y = character.y + 20)
- **Bottoms**: Lower body (y = character.y + 80)
- **Shoes**: Feet (y = character.y + 150)
- **Accessories**: 
  - Glasses: eyes (y = character.y - 10)
  - Necklaces: neck (y = character.y + 40)
  - Wings: back (behind character, y = character.y + 20)

### Accessibility
- Carousel items ≥ 48x48px (actually 80x80px)
- Category tabs ≥ 48x48px
- Action buttons ≥ 48x48px
- High contrast between items and backgrounds
- Audio can be muted via global toggle (GR-3)
- No time pressure — child can dress at own pace

---

## Technical Requirements (GR-5, GR-6)

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dress Up</title>
  <link rel="stylesheet" href="../css/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Character Selection Screen (initially visible) -->
  <div class="character-select active">
    <h1>Choose Your Model!</h1>
    <div class="character-options">
      <button class="character-option" data-character="boy">
        <div class="character-preview">👦</div>
        <div class="character-label">Boy</div>
      </button>
      <button class="character-option" data-character="girl">
        <div class="character-preview">👧</div>
        <div class="character-label">Girl</div>
      </button>
    </div>
    <button class="start-btn">Start Dressing!</button>
  </div>
  
  <!-- Game Screen (initially hidden) -->
  <div class="game-screen">
    <button class="back-button">← Back to Games</button>
    
    <div class="action-buttons">
      <button class="action-btn reset" id="reset-btn" title="Reset">
        <span class="action-icon">🔄</span>
      </button>
      <button class="action-btn randomize" id="randomize-btn" title="Randomize">
        <span class="action-icon">🎲</span>
      </button>
      <button class="action-btn save" id="save-btn" title="Save Outfit">
        <span class="action-icon">💾</span>
      </button>
      <button class="action-btn fashion-show" id="fashion-show-btn" title="Fashion Show">
        <span class="action-icon">💃</span>
      </button>
    </div>
    
    <div class="category-tabs">
      <button class="category-tab active" data-category="hats">Hats</button>
      <button class="category-tab" data-category="tops">Tops</button>
      <button class="category-tab" data-category="bottoms">Bottoms</button>
      <button class="category-tab" data-category="shoes">Shoes</button>
      <button class="category-tab" data-category="accessories">Accessories</button>
    </div>
    
    <div class="character-area">
      <div class="character-container">
        <div class="character-base" id="character-base">
          <!-- Base character emoji or SVG -->
        </div>
        <div class="character-layers" id="character-layers">
          <!-- Items will be layered here dynamically -->
        </div>
      </div>
    </div>
    
    <div class="item-carousel">
      <div class="carousel-container" id="carousel-container">
        <!-- Items will be added here dynamically -->
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

### JavaScript Features
- Character and item data as JSON:
  ```javascript
  const characters = {
    boy: {
      base: '👦',
      positions: {
        hat: { x: 0, y: -30, zIndex: 10 },
        top: { x: 0, y: 20, zIndex: 5 },
        bottom: { x: 0, y: 80, zIndex: 4 },
        shoes: { x: 0, y: 150, zIndex: 3 },
        glasses: { x: 0, y: -10, zIndex: 9 },
        necklace: { x: 0, y: 40, zIndex: 6 },
        wings: { x: 0, y: 20, zIndex: 1 }
      }
    },
    // ... girl
  };
  
  const items = {
    hats: [
      { id: 'cap-red', name: 'Red Cap', emoji: '🧢', category: 'hats', color: 'red' },
      { id: 'crown', name: 'Crown', emoji: '👑', category: 'hats' },
      // ...
    ],
    tops: [
      { id: 'tshirt-blue', name: 'Blue T-Shirt', emoji: '👕', category: 'tops', color: 'blue' },
      // ...
    ],
    // ... other categories
  };
  ```
- Drag-and-drop with HTML5 Drag API or pointer events
- Item layering with z-index management
- Carousel with swipe support (touch events)
- Fashion show animation (CSS transforms)
- Screenshot generation using canvas:
  ```javascript
  function saveOutfit() {
    // Create canvas, draw character + items, download as PNG
  }
  ```

### Performance
- Lazy load item images/emojis as needed
- Use CSS transforms for animations (GPU accelerated)
- Total asset size < 300KB (use emoji/SVG, not PNG)
- No external dependencies

---

## Acceptance Criteria

### Must-Haves
- [ ] Game loads without console errors
- [ ] Character selection screen works
- [ ] All 5 categories are accessible
- [ ] Item carousel scrolls smoothly
- [ ] Items can be dragged onto character
- [ ] Items snap to correct positions
- [ ] Multiple items can be layered
- [ ] Randomize button creates random outfit
- [ ] Fashion Show button triggers animation
- [ ] Save button downloads screenshot
- [ ] Reset button removes all items
- [ ] "Back to Games" button returns to landing page
- [ ] Responsive layout works at 320px, 768px, 1920px
- [ ] All interactive elements ≥ 48x48px
- [ ] Visual style matches shared.css conventions

### Nice-to-Haves
- [ ] Item preview on tap (ghost overlay)
- [ ] Item rotation (flip horizontally)
- [ ] Multiple saved outfits
- [ ] Share outfit button
- [ ] Item scale adjustment

---

## Testing Checklist

- [ ] Open game in browser — no console errors
- [ ] Select boy character — game starts
- [ ] Select girl character — game starts
- [ ] Switch between all 5 categories
- [ ] Scroll carousel — smooth swipe/touch
- [ ] Drag hat onto character — snaps to head
- [ ] Drag glasses onto character — snaps to face
- [ ] Layer multiple items — correct z-index
- [ ] Click Randomize — outfit changes
- [ ] Click Fashion Show — character animates
- [ ] Click Save — screenshot downloads
- [ ] Click Reset — all items removed
- [ ] Check "Back to Games" button works
- [ ] Test at mobile width (320px) — carousel fits
- [ ] Test at tablet width (768px) — layout looks good
- [ ] Test at desktop width (1920px) — character centered
- [ ] Verify all buttons are easily tappable (≥ 48px)

---

## Dependencies

- **Shared CSS**: `../css/shared.css` (colors, fonts, button styles)
- **No External Libraries**: Vanilla JavaScript only
- **Canvas API**: For screenshot generation
- **HTML5 Drag API** or **Pointer Events**: For drag-and-drop

---

## Notes for Developer

- Use emoji for items where possible — small file size, universal support
- For complex items (wings, capes), use simple SVG
- Character can be emoji with layered items as absolutely positioned divs
- Drag-and-drop: use pointer events for better touch support
- Screenshot generation: create hidden canvas, draw character + items, convert to data URL
- Fashion show animation: CSS keyframes for 360° rotation + scale pulse
- Item positions should be relative to character center for easy adjustment
- Consider using CSS Grid/Flexbox for item layering instead of absolute positioning
- Save feature: use `canvas.toDataURL()` and trigger download with `<a>` tag
