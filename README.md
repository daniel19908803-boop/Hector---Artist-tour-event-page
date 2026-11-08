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

The `.openai/hosting.json` manifest configures the private Sites deployment. The same `dist/` output can be deployed as a static site on Vercel with the repository root build command `pnpm build` and output directory `dist`. Set `PUBLIC_SITE_URL` to the final origin before building and update `public/robots.txt` for that origin. SSR integrations require switching the Astro output/adapter configuration before adding live API routes.

## Verification

Vitest checks content relationships, fictional opening dates, Eastern date bucketing, DST boundaries, ICS escaping/folding, UTM attribution, and form validation. Playwright checks desktop/mobile discovery, search, filters, storage, artist follows, calendar navigation, forms, accessibility, and overflow at 360, 390, 768, 1024, 1280, and 1440 pixels. Maps are stubbed in browser tests to avoid depending on an external map provider.

See `docs/decisions.md` for implementation scope and `docs/editor-guide.md` for editing content.
