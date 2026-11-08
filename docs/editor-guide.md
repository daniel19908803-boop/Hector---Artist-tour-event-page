# The editor's guide

## Updating the public demo

The demo reads `apps/web/src/lib/data.ts`. That file contains the artist biographies, tour titles, venue guides, and event schedule. Artist and venue IDs link the content together. Keep those IDs unchanged when editing copy. Rebuild the website after saving changes.

## Add a show to the demo

1. Choose an existing artist ID and venue ID from the content file.
2. Add a row to `schedule`: artist ID, venue ID, days from today, ticket price, and status. A price of zero is free.
3. Use one of `scheduled`, `sellingFast`, `fewLeft`, `soldOut`, `cancelled`, or `postponed` for the status.
4. Run the build. The new date appears on event, artist, venue, city, genre, and calendar pages automatically.

## Working in Sanity

The optional Studio includes fields for shows, artists, tours, venues, genres, cities, submissions, RSVPs, settings, and simple pages. Ask the project maintainer to complete setup in the README before using it. The public demo is not yet connected to Studio edits.

For an event, add its title, venue, headlining artist, date and time, ticketing details, a short description, and artwork with alternative text. Choose the correct local timezone. Preview all details before publishing. All seeded events are fictional; replace them with confirmed real information before launching a real service.

## Feature a show

In the local demo, the first scheduled event has `featured: true`. Change that flag in the content file to change the hero's featured show. In Sanity, Site settings includes a homepage event reference for a future live integration.

## Venue openings

The Foundry Hall is fictional. Its opening date is calculated as the second Saturday of next month at 7 PM Eastern. Edit the venue description and opening event copy in the content file to adapt the concept. Do not use it to announce a real opening without replacing the sample location and confirming the details.

## Forms and personal information

Demo event drafts and RSVP entries stay on the visitor's browser. They do not reach editors or generate emails. There is no shared guest list to export. Submission approval, attendee CSV export, newsletter delivery, and email confirmations require the production server integration described in the reference brief.

Visitors can download their event draft as JSON from the confirmation page. Clearing site storage removes local drafts, saved shows, follows, and RSVP records.
