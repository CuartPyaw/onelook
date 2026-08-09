# Repository Guidelines

OneLook (一目) is a Vue 3 + TypeScript mind-map editor. Data stays local in IndexedDB; rendering uses SVG with D3 layout algorithms.

## Project Structure & Module Organization

- `src/components/editor/` — editor UI: canvas, panels, dialogs.
- `src/composables/` — reusable composables (`useHistory.ts`).
- `src/core/` — mind-map engine, including legacy KityMinder JavaScript; treat `.js` files there as vendored code.
- `src/layout/` and `src/core/layout/` — layout algorithms (mind map, tree, fish-bone).
- `src/services/` — IndexedDB (`db.ts`), import/export (`export.ts`), and format converters in `converters/`.
- `src/stores/`, `src/types/`, `src/utils/`, `src/styles/` — Pinia state, types, utilities, global CSS.
- `docs/` — VitePress documentation; `public/` — static assets.

## Build, Test, and Development Commands

Requires Node.js >= 16 and pnpm >= 8; install with `pnpm install`.

- `pnpm dev` — Vite dev server (http://localhost:5173).
- `pnpm build` — type-check with `vue-tsc`, then production build.
- `pnpm preview` — serve the production build.
- `pnpm docs:dev` — run VitePress docs locally.
- `pnpm docs:build` — build the docs site.

No test runner is configured yet. `pnpm build` is the verification gate (strict TypeScript, no unused locals); manually test UI flows you touch, especially import/export and persistence.

## Coding Style & Naming Conventions

- Two-space indentation; strict TypeScript from `tsconfig.json`.
- Components: PascalCase (`MindMapCanvas.vue`); composables: `useXxx.ts`; stores, services, types, utilities: camelCase.
- Import aliases use `@/*` → `src/*`.
- Use Tailwind utility classes in templates; put custom CSS in `src/styles/index.css`.
- No ESLint or Prettier config; match surrounding code.

## Commit & Pull Request Guidelines

History uses Conventional Commits with imperative, lowercase summaries:

```text
feat: implement mind map editor with node property panel
docs: create links documentation for about section
build: simplify the build script
chore: update license to MIT
```

Use `feat:`, `fix:`, `docs:`, `build:`, or `chore:` prefixes. Create feature branches per the README pattern (`feature/AmazingFeature`) and open one PR per logical change.

In PRs, summarize what changed and why, link any related issue, and add screenshots for UI changes. Confirm `pnpm build` (and `pnpm docs:build` for docs changes) before requesting review.

## Security & Configuration Tips

The app has no backend or secrets; keep it that way. Persist data through the Dexie services layer rather than new browser APIs, and don't commit local runtime logs or environment-specific config.
