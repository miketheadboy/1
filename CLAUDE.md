# CLAUDE.md - Bleeding Kansas

## Project Overview

Historical survival/strategy game set in Kansas Territory (1854) during the pre-Civil War period. Built with React 19, TypeScript, Zustand, and Vite. Rich narrative-driven game with interconnected systems for survival, combat, economy, politics, ecology, and NPC interactions.

## Build & Development Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # TypeScript check (tsc -b) + Vite production build to /dist
npm run lint      # ESLint check (eslint .)
npm run preview   # Preview production build locally
```

**No test framework is currently configured.** Build and lint are the primary quality gates.

## Tech Stack

- **Framework:** React 19 with TypeScript (strict mode)
- **Build:** Vite 7
- **State Management:** Zustand (`useGameStore` hook)
- **Styling:** Tailwind CSS 4 with custom parchment/Western theme
- **Module Type:** ES Modules

## Project Structure

```
src/
  core/           # GameState (Zustand store), SystemInterconnects, StorytellerTypes
  components/     # React UI - Dashboard, panels (InventoryPanel, CombatPanel, etc.), screens
    FX/           # ParticleSystem visual effects
  systems/        # Game logic organized by domain:
    Survival/     # PlayerStats, BaseSystem
    Inventory/    # InventoryManager, ItemData, InventoryTypes
    Combat/       # CombatManager, CombatTypes, EnemyData
    Events/       # EventManager, StorytellerEngine, CalamityManager, StoryModules/
    World/        # TravelSystem, MapData, WorldTypes
    Factions/     # FactionManager, FactionTypes
    Animals/      # AnimalManager, AnimalTypes, AnimalData
    Ecology/      # EcologySystem, ResourceTypes
    Economy/      # EconomySystem
    Politics/     # PoliticsSystem
    NPCs/         # NPCSystem, NPCData, CitizenData
    Farming/      # FarmingSystem
    Wounds/       # WoundManager, WoundTypes
    Loot/         # LootManager, LootTypes, ContainerTypes
    Scavenge/     # ScavengeManager, ScavengeTypes, ScavengeData
    Careers/      # CareerManager, CareerTypes
    Knowledge/    # KnowledgeManager, KnowledgeTypes
    Militia/      # MilitiaManager, MilitiaTypes
    UndergroundRailroad/  # UndergroundRailroadSystem
    SaveLoad/     # SaveManager, SaveTypes
    FX/           # FXManager (screen shake, particles)
    Audio/        # AudioManager
```

## Architecture Patterns

### Manager/System Pattern
Each game domain has a dedicated Manager or System class encapsulating business logic, with separate `*Types.ts` for interfaces and `*Data.ts` for static data.

### Zustand Store (GameState.ts)
Central state via `useGameStore` hook. All global state mutations go through Zustand's `set()`. Components access state with:
```typescript
const { playerManager, factionManager, addLog } = useGameStore();
```

### Component Panel Pattern
Each feature has a self-contained panel component (`*Panel.tsx`) that reads from the store and renders UI. Business logic stays in Manager/System classes, not in components.

### SystemInterconnects
Cross-system effects (ecology changes affect economy, player actions affect world state) are routed through `SystemInterconnects.ts`.

### Scene Navigation
`GameState.enum Scene` controls high-level screens: MainMenu, CharacterCreation, Gameplay, Combat, GameOver.

## Coding Conventions

- **Files:** PascalCase for components (`.tsx`) and systems (`.ts`). Suffix with Manager, System, Types, Data, or Panel as appropriate.
- **Variables/functions:** camelCase. Classes/interfaces/enums: PascalCase. Constants: UPPER_SNAKE_CASE.
- **TypeScript strict mode** is enforced: no implicit `any`, no unused locals/parameters, no switch fallthrough.
- **Styling:** Tailwind utilities first. Custom theme uses CSS variables (`--color-parchment`, `--color-blood-red`, `--color-charcoal`, `--color-ink`). Monospace Courier New typewriter aesthetic.
- **ESLint:** Flat config (v9). Extends recommended + TypeScript + React Hooks + React Refresh rules.

## Key Constraints

- `noUnusedLocals` and `noUnusedParameters` are enabled in tsconfig - all variables and parameters must be used
- Always run `npm run build` before committing to catch TypeScript errors
- Always run `npm run lint` to check ESLint compliance
- Keep business logic in system classes, UI logic in components - do not mix
- Avoid circular dependencies between system folders
