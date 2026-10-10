# Deployment

Part of `status/` — see `STATUS.md` for the index. Written for the new repo (2026-10-10); the old repo's history is in the archive repo `Music-tab-processor`.

**Project:** Vercel project `tabbytab` (account `tomsvarpinsgmailcoms-projects`), same Turso database as the old site. It exists but is **not connected to this repo yet**; connecting it, setting its env and the first deploy are the owner's switch-over steps (see the-system `APPROACH.md`, owner to-do). Nothing here has been deployed.

**Repo root is the app root.** There is no `app/` subfolder any more, so the Vercel Root Directory setting stays empty. (Old incident: a wrong Root Directory made deploys fail with misleading `Cannot find module '@/...'` errors; if that exact error appears, check Settings → General → Root Directory first.)

**Env (production scope, server-side, never `NEXT_PUBLIC_`):** `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`; optional `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`.

**Auto-deploy on push is off, on purpose.** `vercel.json` sets `git.deploymentEnabled: false`. A deploy is a separate, deliberate step: `npx vercel deploy --prod --yes` from this folder, from a clean tree at the merged commit (the CLI uploads working-folder files, not the branch).

**No generator at build time.** `app/design-tokens.generated.css` is committed; the build only reads it. Do not add a `prebuild` that runs the token generator, it does not exist in this repo.

**Separately observed, not a code bug:** a deploy can occasionally fail with `useSearchParams() should be wrapped in a suspense boundary at page "/404"` while prerendering the not-found page. Nothing here uses `useSearchParams`; a retry has fixed it every time. Retry before investigating.
