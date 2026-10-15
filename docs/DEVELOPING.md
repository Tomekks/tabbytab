# web-app

The public TabbyTab site: song list, Sheet / Fretboard / Ascii tab views and a metronome. Next.js, reads the Turso `songs` table; holds no audio. Part of TabbyTab (hub: `~/Projects/the-system`).

```bash
cp .env.example .env.local   # then fill TURSO_DATABASE_URL and TURSO_AUTH_TOKEN yourself, never in chat
npm ci
npm run dev                  # http://127.0.0.1:3000
npm run verify               # typecheck, lint, unit tests, token copy + songs shape checks; read the footer
npm run verify:full          # adds the production build (needs TURSO_* set to anything valid, a file: URL works)
```

## Connections (details in the-system `CONNECTIONS.md`)
- **3 `songs` table** (from audio-processing): `db/schema.ts` is this side; `contracts/songs.shape.json` + `contracts/check_songs_shape.py` are copies of audio-processing's, run by `npm run songs-shape:check`.
- **4 tokens** (from design-system): `app/design-tokens.generated.css` is a committed copy. Change tokens in `~/Projects/design-system`, run `npm run sync` there. `npm run tokens:check` fails if the copy is stale, or if source uses a `var(--x)` the copy lacks.
- **8 workbench preview**: `/workbench-preview` (dev server only, port 3000) is shown inside the design-system workbench.
- **Tab drawing rule**: `lib/tabNotation.ts` has a twin in control-center; `fixtures/tab.*.json` are identical copies, checked by `lib/tabFixture.test.ts`.
