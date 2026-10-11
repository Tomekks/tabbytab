# web-app: 13 Ship (what differs)

- Deploys are the owner's step; auto-deploy is off. How: `status/deployment.md`.
- Before asking to ship, run `npm run stage` (real build served on :3001) and have the owner look at it.
- Changes to `db/schema.ts`, generated CSS or `lib/tabNotation.ts` need the impact check done on both sides first (see `AGENTS.md`).
