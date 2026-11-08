# LiveDiscover

An original, populated live music discovery demo for Raleigh, Durham, Chapel Hill, Carrboro, and Cary. Built with Astro, strict TypeScript, Tailwind CSS v4, and Preact islands.

## Run locally

Use Node 24 LTS and pnpm 10:

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Astro (normally http://127.0.0.1:4321).

```sh
pnpm check
pnpm test
pnpm build
pnpm test:e2e
```

The static output is in `dist/`. Playwright uses an installed Chrome by default. Install Chrome on the test host, or set `PLAYWRIGHT_CHANNEL=chromium` after running `pnpm exec playwright install chromium`.

## Included content

Six fictional artists and tours; seven venue guides; fifteen upcoming concert dates, a free venue opening, and three archived shows; five city pages; eight genre pages; editorial copy, legal demo notes, and original stage-light artwork. All primary browsing routes are populated. Search, URL filters, saved events, artist follows, calendar navigation, ICS downloads, share, browser-local event drafts, and browser-local demo RSVPs work without credentials.

Content lives in `apps/web/src/lib/data.ts`. Edit that file and rebuild to update the public demo. Run `pnpm seed` to export an inventory to `docs/sample-content.json`. Recreate the artwork with `node scripts/generate-art.mjs`.

## Optional Sanity content workspace

The Studio is supplied separately and is not installed by the public site's workspace install:

```sh
pnpm --dir studio install --ignore-workspace
```

Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` for the Studio, then run `pnpm studio`. For seeding, set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, and the server-only `SANITY_API_WRITE_TOKEN`, then run `pnpm seed`. The seed uses fixed document IDs and uploads original generated artwork. It replaces only its own fixed-ID sample documents. `pnpm seed:clean` removes documents with `isSample == true`; shared image assets remain.

Never commit real credentials. `.env.example` lists the production integration variables from the reference brief. Load them through your shell or deployment environment; the standalone seed script does not automatically load `.env`.

The public website currently reads its local sample data. Connecting CMS reads, live email, submission moderation, real ticket providers, shared RSVP capacity, and server APIs is additional production integration work. The Studio source is included but was not installed, authenticated, or browser-tested in this delivery.

## Hosting

Vercel builds from the repository root using the checked-in `vercel.json`: pnpm install, `pnpm build`, and the static `dist/` output. Node 24 is pinned in `package.json`. The current site is static and does not require the server adapter. SSR integrations require switching the Astro output/adapter configuration before adding live API routes.

To link this checkout and enable automatic deployment using Vercel CLI:

```sh
npx --yes vercel@latest login
npx --yes vercel@latest link
pnpm deploy:connect
pnpm deploy
```

When linking, choose your intended Vercel account/team, create or select the project, and keep the project root at `./`. The Vercel GitHub integration must have access to `daniel19908803-boop/Hector---Artist-tour-event-page`. Once connected, pushes to the production branch (`main`) deploy to production; pushes to other branches create previews. No GitHub Actions deployment token is needed for this connection. The existing GitHub Actions workflow continues to run validation separately.

`pnpm deploy:preview` starts a manual preview deployment. `pnpm deploy` starts a manual production deployment. The CLI stores the local project link under ignored `.vercel/`; do not commit tokens or downloaded environment files.

Canonical URLs, social metadata, calendar links, sitemap, and `robots.txt` use `PUBLIC_SITE_URL` when explicitly configured. Otherwise Vercel builds use the automatically provided `VERCEL_PROJECT_PRODUCTION_URL` (falling back to `VERCEL_URL`). For a future custom domain, set `PUBLIC_SITE_URL` in Vercel and redeploy. Leave it unset to use Vercel's own address.

The existing Sites hosting manifest is retained for the original deployment. Vercel uploads exclude that manifest, local environment files, and test artifacts through `.vercelignore`.

## Verification

Vitest checks content relationships, fictional opening dates, Eastern date bucketing, DST boundaries, ICS escaping/folding, UTM attribution, and form validation. Playwright checks desktop/mobile discovery, search, filters, storage, artist follows, calendar navigation, forms, accessibility, and overflow at 360, 390, 768, 1024, 1280, and 1440 pixels. Maps are stubbed in browser tests to avoid depending on an external map provider.

See `docs/decisions.md` for implementation scope and `docs/editor-guide.md` for editing content.
