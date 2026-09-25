# CLAUDE.md - Bleeding Kansas

## Project Overview

Browser-based historical survival/strategy game set in Kansas Territory (1854), the pre-Civil War "Bleeding Kansas" period. Single-page React app with many interconnected simulation systems: survival, combat, wounds, inventory/loot/scavenging, economy, farming, ecology/animals, factions/politics, NPCs/companions, militia, the Underground Railroad, careers, knowledge, and a narrative storyteller. There is no backend. Saves go to `localStorage` under the key `bleeding_kansas_saves`.

`README.md` is still the unmodified Vite template, so don't rely on it for project information.

## Commands

```bash
npm ci            # Install dependencies (node_modules is not committed)
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b (type check) then vite build → dist/
npm run lint      # eslint .
npm run preview   # Serve the production build
```

- **No test framework is configured.** `npm run build` and `npm run lint` are the quality gates. Both currently pass cleanly, so keep them that way.
- Run both before committing.

## ⚠️ Critical Gotcha: Stale Compiled `.js` Files Shadow the `.ts` Sources

Most `.ts` files under `src/core/` and `src/systems/` have a **committed, outdated `.js` twin** next to them (e.g. `GameState.ts` + `GameState.js`). Imports are written without extensions (`from '../core/GameState'`). **Vite's default resolution order tries `.js` before `.ts`, so the production bundle and dev server load the stale `.js` file.** Meanwhile `tsc` type-checks the `.ts` file, so the build passes while your change is silently ignored at runtime.

This has been verified: a change to `SaveManager.ts` did not appear in `dist/`.

- Only these `.ts` files have no `.js` twin, so edits to them do take effect: `Audio/AudioManager.ts`, `Careers/CareerManager.ts`, `Careers/CareerTypes.ts`, `Ecology/ResourceTypes.ts`, `FX/FXManager.ts`, `Survival/BaseSystem.ts`. All `.tsx` components are unaffected.
- **Do not edit the `.js` files by hand, and do not create new ones.** Treat `.ts` as the source of truth.
- The proper fix is to delete all `src/**/*.js` files, then verify with `npm run build` and `npm run dev`. Get the user's agreement before doing this, because runtime behavior will change to match the current `.ts` code.
- Until that's done, if a `.ts` change "doesn't work" at runtime, this is the likely cause.

## Tech Stack

- React 19 + TypeScript ~5.9 (strict), ES modules
- Vite 7 with `@vitejs/plugin-react` (no custom Vite config beyond the plugin)
- Zustand 5 for global state
- Tailwind CSS 4 via `@tailwindcss/postcss` + autoprefixer
- `clsx` and `tailwind-merge` for class composition
- ESLint 9 flat config: `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks`, `react-refresh` (vite); ignores `dist`

## Project Structure

```
src/
  main.tsx, App.tsx       # Entry point; App switches screens on currentScene
  index.css               # Tailwind import + parchment theme variables and .game-* classes
  core/
    GameState.ts          # Zustand store (useGameStore) and the Scene enum. The hub of the game.
    SystemInterconnects.ts# Cross-system ripple effects (ecology → economy → politics → events)
    StorytellerTypes.ts
  components/             # React UI (.tsx only)
    MainMenu, CharacterCreationScreen, GameLayout, Dashboard, GameOverScreen,
    CombatScene, EventDisplay, GameLog, MapView, StatsDisplay, FactionDisplay,
    SaveLoadMenu, *Panel.tsx (Inventory, Shop, Combat, Animals, Farm, NPC, Politics,
    Saloon, Safehouse, Wound, Skills, Knowledge, Scavenge, Container, LandOffice)
    FX/ParticleSystem.tsx
  systems/<Domain>/       # Game logic, one folder per domain
    Animals, Audio, Careers, Character, Combat, Companions, Ecology, Economy,
    Events (+ StoryModules/), FX, Factions, Farming, Inventory, Knowledge, Loot,
    Militia, NPCs, Politics, SaveLoad, Scavenge, Survival, UndergroundRailroad,
    World, Wounds
```

## Architecture

### Global state: `src/core/GameState.ts`
- `useGameStore` is a single Zustand store. It holds manager/system **class instances** (`playerManager`, `factionManager`, `knowledgeManager`, etc.) plus plain state (`currentScene`, game log, location, and so on).
- Store actions orchestrate gameplay: `advanceTime`, `travelTo`, `resolveEventOption`, `useItem`, `buyItem`, `startCombat`, `performCombatAction`, `setCharacter`, `saveGame`/`loadGame`, `plantCrop`/`harvestCrop`, `buyLand`, `interactWithNPC`, `huntAnimal`/`fightAnimal`/`buyAnimal`, `startMission`, `setTravelMode`, `discoverLocation`, `scavenge`, `openContainer`, `recruitCompanion`, `addLog`, `setScene`.
- Add new gameplay actions to the `GameState` interface and the store. Components call actions and don't reach into systems to mutate them.
- Managers are mutable class instances created once inside the store factory, so mutating one does not trigger a re-render by itself. The established action pattern (see `buyLand`) is:
  ```ts
  buyLand: (acres: number) => {
      const state = get();
      const result = state.farmingSystem.buyLand(acres, pricePerAcre, state.playerManager); // mutate via manager
      state.addLog(result);
      state.systemInterconnects.onPlayerAction(state.currentLocationId, PlayerActionType.Build, 1); // ripple effects
      set({}); // force subscribers to re-render
  },
  ```

### Scenes
`enum Scene { MainMenu, CharacterCreation, Gameplay, Combat, GameOver }`. `App.tsx` renders the screen for `currentScene`. Change screens with `setScene`.

### Systems (`src/systems/<Domain>/`)
Each domain folder usually contains:
- `*Manager.ts` / `*System.ts`: a class that owns the domain state and logic
- `*Types.ts`: interfaces, enums, and type aliases
- `*Data.ts`: static content such as items, enemies, map nodes, NPCs, and events

The narrative layer is `Events/StorytellerEngine.ts` plus pluggable `Events/StoryModules/*Module.ts` (extend `StoryModule`). `CalamityManager` and `EventManager` handle scripted and random events. `World/MapData.ts` defines map nodes and `TravelSystem.ts` handles movement.

### Components
Feature panels (`*Panel.tsx`) are self-contained: they read from `useGameStore` and render. Business logic belongs in systems or store actions, not in components.

## TypeScript / Lint Rules That Bite

From `tsconfig.app.json` (only `src/` is included):
- `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`: remove unused imports, variables, and params, or the build fails.
- `verbatimModuleSyntax: true`: **type-only imports must use `import type { ... }`** (or inline `type` modifiers).
- `noUncheckedSideEffectImports`, `forceConsistentCasingInFileNames`: file name case in imports must match exactly.
- `erasableSyntaxOnly: false`: `enum`s are allowed and widely used.
- `moduleResolution: "bundler"`, `allowImportingTsExtensions`, `noEmit`: `tsc` only type-checks and never emits, so it did not produce the stray `.js` files.
- ESLint `@typescript-eslint/no-explicit-any` is on; prefer `unknown` or proper types.
- `react-refresh/only-export-components`: `.tsx` files should export components only. Put shared constants and types elsewhere.

## Conventions

- **Files:** PascalCase. `.tsx` for components, `.ts` for logic. Suffix by role: `Manager`, `System`, `Types`, `Data`, `Panel`, `Screen`.
- **Names:** camelCase for variables and functions; PascalCase for classes, interfaces, enums, and components; UPPER_SNAKE_CASE for constants (e.g. `SAVE_STORAGE_KEY`).
- **Components:** function components that read state via `useGameStore()`.
- **Indentation:** 4 spaces in `src/`.
- **Styling:** Tailwind utilities first (common panel look: `bg-stone-800 p-4 rounded border border-stone-600`). The theme lives in `src/index.css`: CSS variables `--color-parchment`, `--color-parchment-dark`, `--color-blood-red`, `--color-charcoal`, `--color-ink`, plus `.game-panel` and `.game-btn` classes. Aesthetic: 1850s Western, parchment, Courier New typewriter font. Avoid inline `style={{}}`; a recent commit refactored those out.
- **Historical tone:** content depicts slavery, abolition, and border violence. Keep writing period-grounded and treat it seriously, not flippantly.

## Known TODOs in Code

- `core/GameState.ts`: companion morale/leaving when unpaid; "Trigger actual combat" from events
- `Combat/CombatManager.ts`: ammo tracking
- `Scavenge/ScavengeManager.ts`: luck stat (currently hardcoded `0`)
- `Animals/AnimalManager.ts`: get biome from `MapData`; `AnimalData.ts`: hides
- `Events/EventManager.ts`: dynamic event triggers
- `Events/StorytellerEngine.ts`: read values from the player manager instead of placeholders

## Repo Clutter (committed, not part of the app)

These root files are leftovers from earlier debugging sessions. Don't treat them as current state, and don't add more like them:
- `build_errors.txt`, `lint_errors.txt`, `lint_errors_v2.txt`, `lint_errors_v3.txt`: stale error dumps (build and lint are now clean)
- `verify_depth.ts`, `verify_drought.mts`, `verify_scavenge.ts`: ad-hoc verification scripts outside `src/`, not type-checked by the build
- `apply_storyteller_wiring.ps1`: one-off PowerShell patch script
- `tsconfig.app.json` excludes `src/verify_recruitment.ts`, which no longer exists

Put throwaway scripts in a scratch location, not the repo.

## Workflow Checklist

1. Edit the `.ts`/`.tsx` source, never the `.js` twins.
2. `npm run build`: must type-check and bundle.
3. `npm run lint`: must be clean.
4. If the change touches a module with a stale `.js` twin, confirm it actually takes effect at runtime (see the gotcha above).
