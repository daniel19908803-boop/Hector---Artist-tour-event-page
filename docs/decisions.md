# Implementation decisions

- The attached document is a reference brief. This delivery fulfills the content creation request as a populated, privately hosted demonstration; it does not claim the full production backend in that brief is complete.
- All six artists, tours, event descriptions, and The Foundry Hall are fictional. Every seed document carries `isSample: true`. Existing venue descriptions and capacities are illustrative, not verified operational information.
- Artwork is generated locally from original SVG stage architecture and light beams, then encoded as WebP with Sharp. No photographs or third-party logos were downloaded.
- Dates are generated at build time from the calendar date in America/New_York. Opening night is the second Saturday of the following month at 7 PM Eastern. Event starts retain their local hour across DST.
- The deployed demonstration is static Astro. API integrations, editorial approval actions, email delivery, shared RSVP capacity, and production cron/webhook automation are not active. Forms clearly state their local-only behavior.
- Sanity Studio is an optional separate installation so the public website does not need its editor dependencies. Its schemas and idempotent seed utility are included. The public demo reads the local content module, not the CMS; a live CMS query layer is a later integration.
- Calendar files use UTC timestamps, which encode the Eastern event instant unambiguously across daylight saving changes. Lines are UTF-8 folded at 75 octets and use CRLF.
- The package manager pins the stable `@emnapi/runtime` compatible with the Astro language service, avoiding an incompatible auto-resolved beta peer dependency.
