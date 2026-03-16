# FunWebGames

A collection of 10 fun, colorful web games designed for 6-year-old children. This project is developed autonomously by a multi-agent AI pipeline that operates continuously across multiple days.

## Project Goal

Build a fully functional website with **10 engaging, age-appropriate games** for 6-year-olds. Every game must be playable in a browser, require no installation, and include clear instructions that a young child (or their parent) can follow.

## Agent Development Pipeline

This project is built by **4 autonomous AI agents** running sequentially on a scheduler. Agents communicate exclusively through **GitHub Issues** with a label-based state machine.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Scheduler Daemon                              │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  PM Agent    │  │  Dev Agent  │  │  Reviewer    │  │  Tester   │ │
│  │  Every 1 hr  │  │  Every 2 hr │  │  Every 4 hr  │  │ Every 6 hr│ │
│  │              │  │             │  │              │  │           │ │
│  │ • Write reqs │  │ • Implement │  │ • Code review│  │ • Test in │ │
│  │ • Cut issues │  │ • Push code │  │ • Fix issues │  │   browser │ │
│  │ • Prioritize │  │ • Update    │  │ • Comment on │  │ • Close   │ │
│  │ • Track prog │  │   labels    │  │   issues     │  │   or fail │ │
│  └──────┬───────┘  └──────┬──────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                 │                │                │        │
│         ▼                 ▼                ▼                ▼        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              GitHub Issues (Single Source of Truth)           │    │
│  │                                                              │    │
│  │  Issue lifecycle:                                            │    │
│  │  PM creates ──► Dev implements ──► Reviewer reviews ──►     │    │
│  │  Tester tests ──► Closed (or back to Dev)                   │    │
│  │                                                              │    │
│  │  Labels control flow. Assignee = lock.                      │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### How Agents Communicate

Agents do **not** talk to each other directly. All coordination happens through GitHub Issues using **labels** and **assignees** as a state machine.

#### Issue Lifecycle (State Machine)

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
                    ▼                                             │
PM creates ──► [ready-for-dev] ──► Dev picks up ──►              │
               (unassigned)        [in-progress]                 │
                                   (assigned: dev)               │
                                        │                        │
                                        ▼                        │
                                  [ready-for-review] ──►         │
                                  (unassigned)                   │
                                        │                        │
                                        ▼                        │
                                  Reviewer picks up ──►          │
                                  [in-progress]                  │
                                  (assigned: reviewer)           │
                                        │                        │
                                  ┌─────┴──────┐                 │
                                  ▼            ▼                 │
                            Review PASS   Review FAIL            │
                                  │            │                 │
                                  ▼            └─────────────────┘
                            [ready-for-test]     (back to ready-for-dev
                            (unassigned)          with comment)
                                  │
                                  ▼
                            Tester picks up ──►
                            [in-progress]
                            (assigned: tester)
                                  │
                            ┌─────┴──────┐
                            ▼            ▼
                       Test PASS    Test FAIL
                            │            │
                            ▼            └───────────────────────┘
                       [done]              (back to ready-for-dev
                       (closed)             with comment)
```

#### Labels (Mutually Exclusive)

Each issue has **exactly one** status label at any time. When transitioning, the agent **removes the old label before adding the new one** — it is a replacement, not an addition.

| Label | Meaning | Who acts on it |
|-------|---------|---------------|
| `ready-for-dev` | Spec is complete, ready to implement | Dev Agent picks up |
| `in-progress` | An agent is actively working on this | No one else touches it |
| `ready-for-review` | Code is written, needs review | Reviewer Agent picks up |
| `ready-for-test` | Review passed, needs testing | Tester Agent picks up |
| `done` | Tested and closed | No one (terminal state) |

**Category labels** (not mutually exclusive, used for filtering):
`feature`, `bug`, `game`, `docs`, `priority-high`

#### Assignee = Lock

Labels alone can't prevent two agents from grabbing the same issue. The **assignee field** acts as a lock:

1. Agent queries issues with the right label AND **unassigned**
2. **First action**: assign self + change label to `in-progress`
3. If an issue is `in-progress` and assigned to someone else → **skip it**
4. When done: unassign self + set the next label

**Stale detection**: If an issue is `in-progress` for >2 hours with no new comment, the next agent that sees it may unassign and reset the label to the previous state.

### Agent Roles

#### 1. PM Agent (runs every 1 hour)
- Reads `docs/REQUIREMENTS.md` and checks existing GitHub issues
- Assesses which games are complete, in progress, or not started
- Writes per-game requirement files in `docs/requirements/<game-name>.md`
- Creates issues with label `ready-for-dev` (max **5 open issues** at a time)
- Before creating: checks for duplicates and existing open issues
- Updates `docs/PROGRESS.md` with current status
- Commits and pushes doc changes

**Termination rule**: When the PM believes all requirements from `REQUIREMENTS.md` are covered by existing issues (open or closed), it creates a milestone issue titled **"All requirements complete"** with label `milestone` and **stops creating new issues**. If a Tester or Reviewer later creates a `feature-request` issue, the PM picks it up on the next run.

#### 2. Developer Agent (runs every 2 hours)
- Queries issues labeled `ready-for-dev` + unassigned
- Picks the highest-priority issue (prefer `priority-high`, then oldest)
- Assigns self + labels `in-progress`
- Reads the requirement file in `docs/requirements/`
- Implements incrementally — one game or one major feature per run
- Commits with format: `feat(game-name): description` or `fix(game-name): description`
- Pushes to `main` branch
- Comments on the issue with what was done + commit SHA
- Removes `in-progress`, adds `ready-for-review`, unassigns self

#### 3. Code Reviewer Agent (runs every 4 hours)
- Queries issues labeled `ready-for-review` + unassigned
- Assigns self + labels `in-progress`
- Reviews the code changes (referenced in issue comments)
- Checks: HTML validity, game mechanics match requirements, visual style matches GR-2, no console errors, touch targets ≥ 48px
- **If review passes**: removes `in-progress`, adds `ready-for-test`, unassigns self, comments "Review passed"
- **If review fails**: fixes critical bugs directly (commits + pushes), or comments with detailed feedback, removes `in-progress`, adds `ready-for-dev`, unassigns self

#### 4. Tester Agent (runs every 6 hours)
- Queries issues labeled `ready-for-test` + unassigned
- Assigns self + labels `in-progress`
- Serves the site (`python3 -m http.server`), opens in browser
- Tests against `tests/checklist.md` criteria for the relevant game
- Verifies: gameplay works, sounds play, responsive layout, no console errors
- **If test passes**: removes `in-progress`, adds `done`, unassigns self, closes the issue with a test summary comment
- **If test fails**: comments with specific failures + screenshots, removes `in-progress`, adds `ready-for-dev`, unassigns self (issue goes back to Dev)

## Tech Stack

- **HTML5 + CSS3 + vanilla JavaScript** — no build step, no dependencies
- **Single `index.html`** — landing page with game launcher
- **One folder per game** — `games/<game-name>/index.html`
- **Static site** — can be opened directly via `file://` or served with any HTTP server

## Project Structure

```
FunWebGames/
├── index.html              # Landing page — game launcher with thumbnails
├── css/
│   └── shared.css          # Shared styles (colors, fonts, layout)
├── games/
│   ├── color-match/        # Game 1: Color Matching Memory
│   ├── animal-puzzle/      # Game 2: Animal Jigsaw Puzzle
│   ├── bubble-pop/         # Game 3: Bubble Pop (Numbers & Letters)
│   ├── shape-builder/      # Game 4: Shape Builder
│   ├── counting-garden/    # Game 5: Counting Garden
│   ├── letter-explorer/    # Game 6: Letter Explorer
│   ├── music-maker/        # Game 7: Music Maker
│   ├── maze-runner/        # Game 8: Maze Runner
│   ├── star-catcher/       # Game 9: Star Catcher
│   └── dress-up/           # Game 10: Dress Up
├── assets/
│   ├── images/             # Shared images, icons, sprites
│   └── sounds/             # Shared sound effects, music
├── docs/
│   ├── REQUIREMENTS.md     # Master requirements document
│   └── requirements/       # Per-game requirement files (written by PM agent)
└── tests/
    └── checklist.md        # Manual test checklist for each game
```

## How to Run Locally

```bash
# Option 1: Python (built-in)
cd FunWebGames
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: Node.js
npx serve .
# Open http://localhost:3000

# Option 3: Just open the file
open index.html
```

## Design Principles

Inspired by Apple's design philosophy — clarity, deference, depth — adapted for a 6-year-old audience.

### Core Philosophy
1. **Simplicity first**: Every screen has one clear purpose. Remove until there's nothing left to remove. If a child hesitates, the design failed.
2. **Progressive disclosure**: Start with the simplest version. Reveal complexity only as the child masters the basics. Easy mode first, no settings on the first screen, difficulty unlocks through play.
3. **Direct manipulation**: Objects behave like real things. Drag a puzzle piece, it moves with your finger. Tap a bubble, it pops. No abstract buttons when a direct gesture works.
4. **Meaningful animation**: Every animation communicates something — a bounce says "tap me", a sparkle says "well done", a gentle shake says "try again". Never animate for decoration alone.
5. **Consistency**: Same gestures do the same things across all 10 games. Back button is always in the same place. Success always looks and sounds the same. A child who learns one game already knows how to navigate the rest.

### Visual Design
6. **Generous whitespace**: Don't crowd the screen. Let every element breathe. Large tap targets (min 48px) with generous padding between them.
7. **Depth through layering**: Use subtle shadows, translucency, and z-ordering to create a sense of physical space — cards feel like cards, buttons feel pressable, backgrounds recede.
8. **Color with purpose**: Bright colors draw attention to interactive elements. Muted backgrounds keep focus on gameplay. Color is never decorative — it always signals something (correct = green glow, active = highlighted, etc.).
9. **Typography as interface**: Rounded, friendly sans-serif. Numbers and letters are large enough to be the interaction itself, not labels for something else.

### Interaction Design
10. **Forgiveness**: No wrong answers — just "not yet." No timers that punish. No scores that shame. Every interaction gives positive or neutral feedback.
11. **Instant feedback**: Every touch produces an immediate response — sound, animation, color change. Latency kills the feeling of direct manipulation.
12. **No reading required**: Icons, images, colors, and sounds guide the child. Any text exists for parents, never as the primary interface.
13. **Touch-native**: Designed for fingers first, mouse second. All interactions are tap/drag/swipe — no hover states, no right-click, no keyboard shortcuts.

### Safety & Trust
14. **Contained experience**: No external links, no ads, no data collection, no network requests during gameplay. Parents should feel safe handing over the device.
15. **Respectful of attention**: Short sessions (1-3 minutes per round). Natural stopping points. No dark patterns to keep playing.

## Success Criteria

### Functional
- [ ] 10 fully functional games accessible from the landing page
- [ ] Landing page shows all 10 games with thumbnails and one-click launch
- [ ] All games work in Chrome, Safari, and Firefox (desktop + tablet)
- [ ] No external dependencies — works offline after initial load
- [ ] No console errors or warnings in any game
- [ ] Each game has a completed test checklist in `tests/checklist.md`

### Design Quality
- [ ] Every screen has a single, obvious purpose — no clutter
- [ ] Progressive difficulty: easy mode is immediately playable with zero instructions
- [ ] Consistent navigation: "Back to Games" always in the same position, same style
- [ ] Animations are purposeful — every motion communicates state or feedback
- [ ] Generous whitespace — nothing feels cramped, even on 320px screens
- [ ] Color palette is cohesive across all games (shared via `css/shared.css`)
- [ ] Depth and layering: interactive elements feel elevated above backgrounds

### Interaction Quality
- [ ] Every tap/drag produces instant visual + audio feedback (<100ms)
- [ ] No wrong answers — all incorrect actions get gentle, encouraging feedback
- [ ] Direct manipulation: drag puzzle pieces, pop bubbles, trace letters — gestures match the metaphor
- [ ] All interactive elements ≥ 48px touch targets with adequate spacing
- [ ] Works identically with touch and mouse — no hover-dependent interactions

### Kid-Friendliness
- [ ] A 6-year-old can start playing any game without reading a single word
- [ ] Each game round completes in 1-3 minutes with a natural stopping point
- [ ] Celebration animations on every completion (confetti, stars, sounds)
- [ ] No external links, ads, or network requests — completely self-contained
- [ ] Positive, encouraging UX throughout — no negative feedback for wrong answers

## License

MIT
