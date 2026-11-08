import {describe,it,expect} from 'vitest';
import {artists,venues,events,upcomingEvents,getVenue,openingDate} from '../apps/web/src/lib/data';
import {isUpcoming,matchesWhen} from '../apps/web/src/lib/dates';
import {makeIcs} from '../apps/web/src/lib/ics';
import {ticketUrl} from '../apps/web/src/lib/ticketing';
import {rsvpSchema,submissionSchema} from '../apps/web/src/lib/validation';
import {formatInTimeZone} from '../apps/web/node_modules/date-fns-tz';
describe('original demo content',()=>{
 it('has valid unique relationships, dates, descriptions, and sample markers',()=>{expect(artists).toHaveLength(6);expect(venues).toHaveLength(7);expect(events).toHaveLength(19);expect(new Set(events.map(e=>e.slug)).size).toBe(events.length);for(const event of events){expect(event.isSample).toBe(true);expect(artists.some(a=>a.id===event.artistId)).toBe(true);expect(venues.some(v=>v.id===event.venueId)).toBe(true);expect(new Date(event.endDateTime)>new Date(event.startDateTime)).toBe(true);expect(event.description.length).toBeGreaterThan(20)}expect(upcomingEvents.length).toBe(16)});
 it('opens the fictional venue on the second Saturday next month',()=>{expect(formatInTimeZone(openingDate,'America/New_York','EEEE HH:mm')).toBe('Saturday 19:00');const day=Number(formatInTimeZone(openingDate,'America/New_York','d'));expect(day).toBeGreaterThanOrEqual(8);expect(day).toBeLessThanOrEqual(14)});
});
describe('timezone handling',()=>{
 it('buckets tonight by Eastern time across UTC midnight',()=>{expect(matchesWhen('2026-11-09T01:00:00Z','tonight',new Date('2026-11-08T20:00:00Z'))).toBe(true);expect(matchesWhen('2026-11-09T06:00:00Z','tonight',new Date('2026-11-08T20:00:00Z'))).toBe(false)});
 it('handles the DST spring boundary and rolling weeks',()=>{expect(matchesWhen('2026-03-08T23:00:00Z','tonight',new Date('2026-03-08T05:00:00Z'))).toBe(true);expect(matchesWhen('2026-03-14T23:00:00Z','week',new Date('2026-03-08T05:00:00Z'))).toBe(true);expect(matchesWhen('2026-03-15T23:00:00Z','week',new Date('2026-03-08T05:00:00Z'))).toBe(false)});
 it('keeps a show upcoming until its end and defaults to four hours',()=>{expect(isUpcoming({startDateTime:'2026-11-08T23:00:00Z'},new Date('2026-11-09T02:00:00Z'))).toBe(true);expect(isUpcoming({startDateTime:'2026-11-08T23:00:00Z'},new Date('2026-11-09T03:00:00Z'))).toBe(false)});
});
describe('calendar and ticket utilities',()=>{
 it('creates a portable ICS with UTC timestamps, a stable UID, escaped locations, and CRLF lines',()=>{const event=events[0],ics=makeIcs(event,getVenue(event.venueId));expect(ics).toContain('BEGIN:VCALENDAR\r\n');expect(ics).toContain(`UID:${event.id}@livediscover.com`);expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);expect(ics).toContain('LOCATION:Lincoln Theatre\\,');expect(ics.replace(/\r\n /g,'')).toContain(`URL:https://livediscover.com/events/${event.slug}`);for(const line of ics.split('\r\n'))expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)});
 it('preserves existing ticket parameters and adds referral attribution',()=>{const url=new URL(ticketUrl('https://tickets.example/show?seat=ga','sample-tour'));expect(url.searchParams.get('seat')).toBe('ga');expect(url.searchParams.get('utm_source')).toBe('livediscover');expect(url.searchParams.get('utm_campaign')).toBe('sample-tour');expect(()=>ticketUrl('javascript:alert(1)','show')).toThrow()});
});
describe('form validation',()=>{
 it('requires consent, a valid email and no more than three RSVP guests',()=>{const valid={name:'Taylor Lee',email:'taylor@example.com',guests:'2',consent:true,eventId:'event-opening'};expect(rsvpSchema.safeParse(valid).success).toBe(true);expect(rsvpSchema.safeParse({...valid,guests:4}).success).toBe(false);expect(rsvpSchema.safeParse({...valid,consent:false}).success).toBe(false);expect(rsvpSchema.safeParse({...valid,email:'broken'}).success).toBe(false)});
 it('rejects an incomplete submission and unsafe ticket URLs',()=>{expect(submissionSchema.safeParse({}).success).toBe(false);const valid={contactName:'Taylor Lee',contactEmail:'taylor@example.com',role:'artist',eventTitle:'A sample show',artistName:'A sample band',venueName:'A sample venue',venueAddress:'10 Main Street',city:'Raleigh',date:'2026-12-01',time:'20:00',ticketUrl:'',priceFrom:20,genre:'Indie rock',description:'An original night of live music in a sample room.',consent:true};expect(submissionSchema.safeParse(valid).success).toBe(true);expect(submissionSchema.safeParse({...valid,ticketUrl:'javascript:alert(1)'}).success).toBe(false)});
});
