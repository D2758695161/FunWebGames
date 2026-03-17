# Shape Builder Game Requirements

## Overview

Drag basic shapes onto a canvas to match a target picture. Children learn geometry and spatial reasoning by assembling shapes into recognizable objects.

## Functional Requirements

### SB-1: Shape Palette
- Left side of screen: shape palette
- Basic shapes: circles, squares, triangles, rectangles
- Various colors available for each shape
- Shapes displayed as large, draggable icons (minimum 60x60px)
- Infinite supply of each shape type

### SB-2: Target Pictures
- Right side of screen: target picture made of shapes
- Examples: house (square + triangle), car (rectangles + circles), tree (triangle + rectangle), boat (triangle + rectangle)
- 8-10 target pictures of increasing complexity
- Target shown as silhouette or outlined guide
- "Show hint" button reveals shape boundaries

### SB-3: Gameplay Mechanics
- Drag shapes from palette to canvas
- Shapes snap to a grid for easier placement (grid size: 20px)
- Shapes can be rotated (90-degree increments) via tap on rotation button
- Shapes can be deleted by dragging to trash icon
- Match detection: when all shapes placed correctly, celebrate
- "Next picture" button appears on completion

### SB-4: Visual Feedback
- Shape being dragged: slightly scaled up (1.1x) with shadow
- Snap zone highlighted when shape is near correct position
- Correct placement: shape glows briefly + chime sound
- Completion: confetti animation + "You did it!" audio
- Grid visible as faint lines (optional toggle)

### SB-5: Audio Feedback
- Pick up shape: soft "lift" sound
- Correct placement: cheerful chime
- Wrong placement (if any): gentle "boop"
- Game complete: celebration music
- Background music: optional, muted by default

### SB-6: Navigation
- "Back to Games" button always visible
- Level selector (shows current picture number, e.g., "3/10")
- "Show hint" button for assistance
- "Restart" button to clear canvas

## Technical Requirements

### File Structure
```
games/shape-builder/
  index.html          ← Main game page
  style.css           ← Game-specific styles
  script.js           ← Game logic with drag-and-drop
  assets/
    sounds/
    images/
      targets/        ← SVG target outlines
```

### Code Requirements
- Import shared CSS
- Vanilla ES6+ JavaScript
- Use Pointer Events for drag-and-drop
- SVG for shapes and targets (scalable)
- Canvas or DOM-based shape placement
- Grid snapping logic with 20px increments
- No external dependencies
- Total asset size: < 500KB

### Touch Requirements
- Touch targets: shapes minimum 48x48px
- Drag area: full canvas
- Prevent scroll while dragging
- Multi-touch safe

## Acceptance Criteria

- [ ] Shape palette displays all shape types with colors
- [ ] Target pictures load correctly (8-10 levels)
- [ ] Shapes can be dragged from palette to canvas
- [ ] Shapes snap to 20px grid
- [ ] Shapes can be rotated and deleted
- [ ] "Show hint" reveals shape boundaries
- [ ] Correct placement triggers sound and visual feedback
- [ ] Level completion triggers celebration
- [ ] "Next picture" advances to next level
- [ ] "Back to Games" button works
- [ ] Level selector shows progress
- [ ] Works on mobile (320px) and desktop (1920px)
- [ ] No console errors
- [ ] Loads in under 2 seconds

## Learning Value

- Geometry basics (shapes, sizes)
- Spatial reasoning
- Pattern recognition
- Creativity and design
- Fine motor skills

## Related Requirements

- GR-2: Visual Design (global requirement)
- GR-3: Audio & Feedback (global requirement)
- GR-4: Responsive & Touch (global requirement)
- GR-5: Performance & Compatibility (global requirement)
