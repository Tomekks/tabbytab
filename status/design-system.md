# Design system

Part of `status/` — see `STATUS.md` for the index.

**The tokens, brands and the workbench live in `~/Projects/design-system`**, not here. This app keeps only:
- `app/design-tokens.generated.css`, a committed copy of the default brand's CSS custom properties, imported by `app/globals.css`. `npm run tokens:check` fails if the copy is stale or if source uses a `var(--x)` it lacks.
- `components/ui/` (`Button`, `ColorField`, `IconButton`, `SegmentedControl`, `Slider`, `state-overlay`): the React components, which stay here by decision (the token names are the contract).
- `app/workbench-preview` (dev server only): the page the workbench shows in its iframe (connection 8).

**Changing a token:** edit in the workbench or in `~/Projects/design-system/brands/`, run `npm run sync` there, review the diff of the generated CSS here, run `npm run verify`.

**Gone on purpose:** the old in-app editor at `/design-system` and its API route. It stays in the archive repo; its feature checklist is in the-system `research/phase5-old-editor-checklist.md` once written.
