# FunWebGames — Requirements

## Overview

Build 10 browser-based games for 6-year-old children. All games run as static HTML/CSS/JS with zero dependencies. The landing page (`index.html`) serves as a game launcher.

**Target audience**: Children aged 5-7, playing on a parent's laptop or tablet.

---

## Global Requirements

### GR-1: Landing Page
- Grid of game cards (2-3 per row on desktop, 1 per row on mobile)
- Each card shows: game thumbnail, game name, a fun emoji/icon
- Click/tap a card → opens the game in full viewport
- "Back to Games" button visible in every game
- Animated, colorful design — feels like a toy box
- No text that a 6-year-old can't skip — visual navigation only

### GR-2: Visual Design (Apple-Inspired)

Follow Apple's design principles — clarity, deference, depth — adapted for children:

**Simplicity & Focus:**
- Every screen has one clear purpose — remove elements until there's nothing left to remove
- Generous whitespace between all elements — nothing feels cramped
- Interactive elements are visually prominent; backgrounds and chrome recede

**Progressive Disclosure:**
- Start with the simplest view — no settings panels on first load
- Difficulty options appear only after the child plays once, or are presented as simple visual choices (★ ★★ ★★★)
- Advanced features (record, save, etc.) are secondary — never competing with the core interaction

**Depth & Layering:**
- Use subtle shadows and elevation to create physical depth — buttons feel pressable, cards feel liftable
- Active/selected elements rise above the surface (translateY + shadow increase)
- Background layers are muted; foreground gameplay elements are vibrant
- Translucent overlays for modals/dialogs — never fully opaque blockers

**Color with Purpose:**
- Palette: bright primary colors (red, blue, yellow, green) + soft pastels for backgrounds
- Color always signals something: green = correct, highlighted = interactive, muted = background
- Never use color as pure decoration — every color choice communicates state

**Typography:**
- Font: rounded, playful sans-serif (system fonts: `"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", sans-serif`)
- Numbers and letters in games are large enough to be the interaction itself
- Text is for parents (instructions, labels) — never the primary child interface

**Consistency:**
- Same gestures do the same things across all 10 games
- "Back to Games" button is always in the same position and style
- Success feedback (sparkle, chime) is identical across all games
- Shared styles via `css/shared.css` — no per-game color palette drift

**Dimensions:**
- Minimum touch target: 48x48px with at least 8px spacing between targets
- Rounded corners on everything (border-radius ≥ 12px)
- Cards, buttons, and panels use consistent border-radius and shadow values

### GR-3: Audio & Feedback
- Every tap/click produces a soft sound effect
- Correct action: cheerful chime + star/sparkle animation
- Wrong action: gentle "boop" — never harsh, never punishing
- Completion: celebration animation (confetti, stars) + "You did it!" audio
- Background music: optional, muted by default, toggle button in corner
- All audio uses Web Audio API or `<audio>` elements — no external libraries

### GR-4: Responsive & Touch
- Works on screens 320px to 1920px wide
- All interactions work with mouse click AND touch
- Drag-and-drop uses pointer events (works on both touch and mouse)
- No hover-dependent interactions (hover is enhancement only)
- Landscape and portrait orientations supported

### GR-5: Performance & Compatibility
- Each game loads in < 2 seconds on a modern device
- No console errors or warnings
- Works in Chrome 90+, Safari 15+, Firefox 90+
- No external CDN, API calls, or network requests during gameplay
- Total asset size per game: < 500KB (use CSS art, SVG, emoji, and canvas drawing over raster images)

### GR-6: Code Quality
- Each game is self-contained in its own folder: `games/<name>/index.html`
- Games can share CSS from `css/shared.css` via relative import
- JavaScript is vanilla ES6+ — no frameworks, no build step
- Code is readable, commented where logic is non-obvious
- Each HTML file is valid HTML5

---

## Game Specifications

### Game 1: Color Match Memory (`games/color-match/`)

**Concept**: Classic memory card-flip game with colored shapes.

**Gameplay**:
- Grid of face-down cards (4x3 for easy, 4x4 for medium, 6x4 for hard)
- Each card has a colored shape (red circle, blue star, green triangle, etc.)
- Tap to flip a card, tap another to find its match
- Matched pairs stay face-up with a sparkle
- Timer and move counter displayed (non-competitive — just for fun)
- "You won!" celebration when all pairs are found

**Difficulty**: 3 levels selectable from a simple picker (show 3 stars: ★ ★★ ★★★)

**Learning value**: Memory, pattern recognition, color naming

---

### Game 2: Animal Puzzle (`games/animal-puzzle/`)

**Concept**: Drag-and-drop jigsaw puzzle with cute animal pictures.

**Gameplay**:
- Image of an animal is split into 6 / 9 / 12 pieces (difficulty levels)
- Pieces are scattered around the play area
- Ghost outlines show where each piece goes
- Drag a piece near its correct position → it snaps into place
- Each correct placement triggers a happy sound
- When complete: the animal "comes alive" with a CSS animation + animal sound

**Animals**: Cat, Dog, Elephant, Panda, Lion, Giraffe (one per puzzle, randomized)

**Learning value**: Spatial reasoning, fine motor skills, animal recognition

---

### Game 3: Bubble Pop (`games/bubble-pop/`)

**Concept**: Floating bubbles with numbers and letters — pop the right ones.

**Gameplay**:
- Bubbles float up from the bottom of the screen
- A prompt at the top shows what to pop: "Pop the number 5!" or "Pop the letter A!"
- Tap the correct bubble → it pops with a satisfying animation
- Wrong bubble → gentle wobble, no penalty
- 10 rounds per session, score shown as collected stars
- Bubbles get faster as rounds progress

**Modes**: Numbers (1-10), Letters (A-Z), Colors ("Pop the red bubble!")

**Learning value**: Number recognition, letter recognition, color naming, reaction time

---

### Game 4: Shape Builder (`games/shape-builder/`)

**Concept**: Drag basic shapes onto a canvas to match a target picture.

**Gameplay**:
- Left side: shape palette (circles, squares, triangles, rectangles in various colors)
- Right side: target picture made of shapes (e.g., a house = square + triangle, a car = rectangles + circles)
- Drag shapes from palette to canvas, position them to match the target
- Shapes snap to a grid for easier placement
- "Show hint" button outlines where shapes should go
- 8-10 target pictures of increasing complexity

**Learning value**: Geometry basics, spatial reasoning, creativity

---

### Game 5: Counting Garden (`games/counting-garden/`)

**Concept**: Count objects in a garden scene and tap the right number.

**Gameplay**:
- A garden scene with flowers, butterflies, bees, fruits, etc.
- Prompt: "How many butterflies?" with number options (3 choices)
- Objects gently animate (butterflies flutter, flowers sway)
- Tap the correct number → objects light up one by one as they're "counted"
- 10 rounds with different objects and quantities (1-10)
- Stars awarded for correct answers

**Learning value**: Counting 1-10, number recognition, observation

---

### Game 6: Letter Explorer (`games/letter-explorer/`)

**Concept**: Interactive letter learning — see, hear, and trace letters.

**Gameplay**:
- Shows a large letter (A-Z) with an associated animal/object illustration
- "A is for Apple" — with audio pronunciation
- Trace the letter with your finger/mouse on a dotted guide path
- Tracing accuracy shown with color (green = on path, yellow = close, red = off path)
- "Next letter" arrow, or tap the letter carousel at the bottom
- Both uppercase and lowercase shown side by side
- Optional: phonics mode — plays the letter sound, not just the name

**Learning value**: Letter recognition, letter writing, phonics, vocabulary

---

### Game 7: Music Maker (`games/music-maker/`)

**Concept**: Tap colorful instruments to create music.

**Gameplay**:
- Grid of 8 instrument buttons (drum, xylophone, piano, tambourine, trumpet, guitar, bell, maracas)
- Each instrument is a large, colorful icon
- Tap → plays the instrument sound with a visual pulse animation
- "Record" mode: tap instruments in sequence, then play back your song
- "Magic song" button: plays a random pre-set melody for inspiration
- Tempo slider (slow/medium/fast) shown as a turtle-to-rabbit scale

**Learning value**: Rhythm, cause-and-effect, creativity, auditory discrimination

---

### Game 8: Maze Runner (`games/maze-runner/`)

**Concept**: Guide a cute character through simple mazes.

**Gameplay**:
- Top-down maze with a character (bunny, puppy, or kitty — player picks)
- Move character with arrow buttons on screen (no keyboard required)
- Or drag the character directly along valid paths
- Collectible stars along the path (bonus, not required)
- Reach the goal (a carrot, bone, or fish depending on character) → celebration
- 8-10 mazes of increasing difficulty
- Timer shown as a friendly hourglass (no pressure — just for fun)

**Learning value**: Problem solving, planning, spatial navigation

---

### Game 9: Star Catcher (`games/star-catcher/`)

**Concept**: Move a basket to catch falling stars.

**Gameplay**:
- Stars (and bonus items: moons, planets) fall from the top of the screen
- Player moves a basket left/right by dragging or using on-screen arrow buttons
- Catch a star → +1 point, sparkle effect
- Occasional "rainbow star" worth bonus points
- Avoid catching rain clouds (they slow you down briefly — no penalty)
- Round ends after 60 seconds or when 20 stars have fallen
- Score shown as collected star icons (not abstract numbers)

**Learning value**: Hand-eye coordination, reaction time, tracking moving objects

---

### Game 10: Dress Up (`games/dress-up/`)

**Concept**: Drag clothing and accessories onto a character.

**Gameplay**:
- A friendly character in the center (boy or girl, player picks)
- Categories: Hats, Tops, Bottoms, Shoes, Accessories (glasses, wings, wands)
- Swipe through items in each category, drag onto character
- Items snap to correct body position
- "Randomize" button → outfit surprise
- "Save outfit" → downloads a screenshot (canvas-based)
- "Fashion show" button → character does a spin animation
- 5+ items per category, bright and silly options

**Learning value**: Creativity, categorization, fine motor skills, self-expression

---

## Agent Workflow Requirements

These requirements govern how the **4 AI agents** collaborate. Agents communicate exclusively through **GitHub Issues** using a label-based state machine. They never communicate directly.

---

### AWR-1: Issue State Machine

Every issue follows this lifecycle, controlled by **labels** and **assignees**:

```
PM creates issue
  → label: ready-for-dev, unassigned
  → Dev picks up: label: in-progress, assigned: dev-agent
  → Dev finishes: label: ready-for-review, unassigned
  → Reviewer picks up: label: in-progress, assigned: reviewer-agent
  → Review passes: label: ready-for-test, unassigned
  → Review fails: label: ready-for-dev, unassigned (+ comment)
  → Tester picks up: label: in-progress, assigned: tester-agent
  → Test passes: label: done, closed
  → Test fails: label: ready-for-dev, unassigned (+ comment)
```

**Label rules:**
- Status labels are **mutually exclusive**: `ready-for-dev`, `in-progress`, `ready-for-review`, `ready-for-test`, `done`
- When transitioning, the agent **removes the old label first, then adds the new one** — replace, never stack
- Category labels (`feature`, `bug`, `game`, `docs`, `priority-high`) are additive and do not conflict with status labels

**Assignee-as-lock rules:**
- An agent only picks up issues with the correct status label AND **no assignee**
- **First action** when picking up: assign self + change label to `in-progress`
- If an issue is `in-progress` and assigned to another agent → **skip it**
- When done: unassign self + set the next status label
- **Stale detection**: if `in-progress` for >2 hours with no new comment, the next agent may unassign and reset the label to its previous state

---

### AWR-2: PM Agent Behavior (runs every 1 hour)

**Purpose**: Break down requirements into implementable issues, one step at a time.

**On each run:**
1. `git pull` to get latest changes
2. Read `docs/REQUIREMENTS.md` and scan existing GitHub issues (open + closed)
3. Assess what is done, in progress, and not started
4. Write or update per-game requirement files in `docs/requirements/<game-name>.md`
5. Create new issues with label `ready-for-dev` if needed
6. Update `docs/PROGRESS.md` with current status
7. Commit and push doc changes

**Constraints:**
- **Max 5 open issues at a time** — count all open issues regardless of label
- Before creating: check for duplicates by title and content
- Prioritize: project scaffolding first, then one game at a time, then polish/cross-game features
- Each issue should be implementable in a single Dev Agent run (~2 hours of work)
- Include the relevant requirement file path and acceptance criteria in the issue body

**Termination rule:**
- When the PM believes all requirements from `REQUIREMENTS.md` are covered by issues (open or closed), it creates a milestone issue titled **"All requirements complete"** with label `milestone`
- While this milestone issue is open, **the PM stops creating new issues**
- If another agent creates a `feature-request` or `bug` issue, the PM picks it up on the next run and may create follow-up issues
- **This is critical** — without termination, agents will work endlessly

---

### AWR-3: Developer Agent Behavior (runs every 2 hours)

**Purpose**: Implement features and fix bugs based on issues.

**On each run:**
1. `git pull` to get latest changes
2. Query issues: label `ready-for-dev` + unassigned
3. Pick the highest-priority issue (`priority-high` first, then oldest)
4. **Assign self** + replace label with `in-progress`
5. Read the requirement file referenced in the issue
6. Implement the feature or fix
7. Commit with format: `feat(game-name): description` or `fix(game-name): description`
8. Push to `main` branch
9. Comment on the issue: summary of changes + commit SHA
10. **Unassign self** + replace label with `ready-for-review`

**Constraints:**
- One issue per run — do not try to implement multiple issues
- If no `ready-for-dev` issues exist, do nothing
- Do not close issues — only the Tester Agent closes issues
- Test your own code before marking ready for review (open the HTML, check for errors)

---

### AWR-4: Code Reviewer Agent Behavior (runs every 4 hours)

**Purpose**: Review code quality and correctness before testing.

**On each run:**
1. `git pull` to get latest changes
2. Query issues: label `ready-for-review` + unassigned
3. Pick the oldest issue
4. **Assign self** + replace label with `in-progress`
5. Review the code changes (referenced commits in issue comments)

**Review checklist:**
- HTML is valid and loads without errors
- Game mechanics match the requirement file
- Visual style matches GR-2 (colors, fonts, rounded corners, shadows)
- Touch targets ≥ 48px (GR-2)
- No console errors or warnings (GR-5)
- Responsive layout works at 320px, 768px, 1920px (GR-4)
- Audio feedback present (GR-3)
- Code is clean and readable (GR-6)

**If review passes:**
- Comment: "Review passed" with brief notes
- **Unassign self** + replace label with `ready-for-test`

**If review fails (minor issues):**
- Comment with specific issues and suggested fixes
- **Unassign self** + replace label with `ready-for-dev`

**If review fails (critical — game is broken):**
- Fix the bug directly, commit with `fix(game-name): description`, push
- Comment with what was fixed + commit SHA
- **Unassign self** + replace label with `ready-for-test`

---

### AWR-5: Tester Agent Behavior (runs every 6 hours)

**Purpose**: Verify games work correctly in a real browser before closing issues.

**On each run:**
1. `git pull` to get latest changes
2. Query issues: label `ready-for-test` + unassigned
3. Pick the oldest issue
4. **Assign self** + replace label with `in-progress`
5. Serve the site: `python3 -m http.server 8080`
6. Open the relevant game in a browser
7. Test against `tests/checklist.md` criteria

**Test checklist per game:**
- Game loads without errors
- Core gameplay mechanic works (tap, drag, click)
- Sound effects play
- Completion celebration triggers
- "Back to Games" button returns to landing page
- No console errors
- Works on different viewport sizes

**If test passes:**
- Comment with test summary (what was tested, results)
- Update `tests/checklist.md` — check off passing items
- **Unassign self** + replace label with `done`
- **Close the issue**

**If test fails:**
- Comment with specific failures (steps to reproduce, screenshots if possible)
- **Unassign self** + replace label with `ready-for-dev`
- Issue goes back to Dev for rework

---

### AWR-6: Shared Conventions

**Repository:**
- All agents use the same repo: `TechGuyTest/FunWebGames`
- Branch: `main` (no feature branches — agents work incrementally)
- All agents `git pull` before starting any work
- Handle merge conflicts gracefully: pull, rebase, retry

**Commits:**
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `test`, `style`
- Scope: game folder name (e.g., `color-match`, `landing-page`) or `global`

**Issues:**
- Title format: clear, actionable (e.g., "Implement Color Match Memory game", "Fix bubble pop sound not playing")
- Body: reference requirement file, list acceptance criteria
- Status labels are mutually exclusive — always replace, never stack
- Always comment before changing labels — leave an audit trail

**Labels to create in the repo:**

| Label | Color | Type |
|-------|-------|------|
| `ready-for-dev` | `#0E8A16` (green) | Status |
| `in-progress` | `#FBCA04` (yellow) | Status |
| `ready-for-review` | `#1D76DB` (blue) | Status |
| `ready-for-test` | `#D93F0B` (orange) | Status |
| `done` | `#6F42C1` (purple) | Status |
| `milestone` | `#BFDADC` (teal) | Status |
| `feature` | `#A2EEEF` (light blue) | Category |
| `bug` | `#D73A4A` (red) | Category |
| `game` | `#F9D0C4` (pink) | Category |
| `docs` | `#0075CA` (dark blue) | Category |
| `priority-high` | `#B60205` (dark red) | Category |
| `feature-request` | `#C5DEF5` (pale blue) | Category |

---

### AWR-7: Failure Handling

**Agent crashes mid-work:**
- Issue is stuck as `in-progress` + assigned
- Stale detection (>2 hours, no comment) allows the next agent to reclaim it

**No issues to process:**
- Agent does nothing and exits cleanly
- This is expected and normal — not every run produces work

**Merge conflict:**
- Agent pulls, rebases, retries
- If conflict cannot be resolved automatically, agent comments on the issue and resets label to previous state

**All agents idle:**
- When PM has created the "All requirements complete" milestone and all issues are closed with `done`, the pipeline is complete
- Agents still run on schedule but find nothing to do — this is the expected end state
